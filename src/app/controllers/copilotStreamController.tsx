/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable comma-dangle */

import * as Pieces from "@pieces.app/pieces-os-client";

export type MessageOutput = {
  answer: string;
  relevant: Pieces.RelevantQGPTSeeds;
  queryId: string;
  answerId: string;
};

/**
 * Stream controller class for interacting with the QGPT websocket
 */
export default class CopilotStreamController {
  private static instance: CopilotStreamController;

  private ws: WebSocket | null = null; // the qgpt websocket

  private answerEl: HTMLElement | null = null; // the current answer element to be updated from socket events

  // this will resolve the current promise that is created by this.handleMessage
  private messageResolver: null | ((arg0: MessageOutput) => void) = null;

  // this will reject the current promise that is created by this.handleMessage
  private messageRejector: null | ((arg0: any) => void) = null;

  // this is resolved when the socket is ready.
  private connectionPromise: Promise<void> = new Promise<void>((res) => res);

  //@TODO implement socket unloading
  private constructor() {
    this.connect();
  }

  /**
   * cleanup function
   */
  public closeSocket() {
    this.ws?.close();
  }

  /**
   * This is the entry point for all chat messages into this socket.
   * @param param0 The inputted user query, any relevant snippets, and the answer element to be updated
   * @returns a promise which is resolved when we get a 'COMPLETED' status from the socket, or rejected on a socket error.
   */
  public async askQGPT({
                         query,
                         answerEl,
                       }: {
    query: string;
    answerEl: HTMLElement;
  }): Promise<MessageOutput | undefined> {
    if (!this.ws) {
      this.connect();
    } // need to connect the socket if it's not established.
    await fetch(`http://localhost:${port}/.well-known/health`).catch(() => {
      return connectionPoller();
    });
    const application = await getApplication();
    if (!application) return;

    const relevanceInput: RelevanceRequest = {
      qGPTRelevanceInput: {
        query,
        paths: QGPTView.contextSelectionModal.paths,
        assets: { iterable: QGPTView.contextSelectionModal.assets },
        messages: { iterable: QGPTView.contextSelectionModal.grounding },
      },
    };

    const relevanceOutput =
      await ConnectorSingleton.getInstance().QGPTApi.relevance(relevanceInput);

    if (QGPTView.relevant) {
      relevanceOutput.relevant.iterable.push({
        seed: {
          type: SeedTypeEnum.Asset,
          asset: {
            application,
            format: {
              fragment: {
                string: {
                  raw: Pieces.QGPTView.relevant.text,
                },
                metadata: {
                  ext: QGPTView.relevant.extension,
                },
              },
            },
          },
        },
      });
    }

    for (const codeBlock of QGPTView.codeBlocks) {
      relevanceOutput.relevant.iterable.push({
        seed: {
          type: SeedTypeEnum.Asset,
          asset: {
            application,
            format: {
              fragment: {
                string: {
                  raw: codeBlock.text,
                },
                metadata: {
                  ext: codeBlock.extension,
                },
              },
            },
          },
        },
      });
    }

    const relevantEl = QGPTViewBuilder.buildRelevantElement({
      answerDiv: answerEl.parentElement! as HTMLDivElement,
      files: relevanceOutput.relevant.iterable,
    });

    if (relevantEl) {
      const isAtBottom = this.isAtBottom(answerEl);
      answerEl.parentElement?.parentElement?.parentElement?.appendChild(
        relevantEl
      );
      if (isAtBottom) this.forceScroll(answerEl);
    }

    const input: QGPTStreamInput = {
      question: {
        query,
        relevant: relevanceOutput.relevant,
        model: CopilotLLMConfigModal.selectedModel
          ? CopilotLLMConfigModal.selectedModel
          : undefined,
      },
      conversation: QGPTView.conversationId,
    };

    return this.handleMessages({ input, answerEl });
  }

  /**
   * If the user has not used their mousewheel, scroll their container to the bottom.
   * @param answerEl The answer element that is being updated
   * @returns void
   */
  public forceScroll(answerEl: HTMLElement) {
    if (!answerEl.parentElement?.parentElement?.parentElement)
      throw new Error(
        'Change in dom structure broke our autoscroll behavior in the Copilot Stream Controller'
      );
    answerEl.parentElement.parentElement.parentElement.onscroll = () => {
      this.hasScrolled = true;
    };
    answerEl.parentElement.parentElement.parentElement.scrollTop =
      answerEl.parentElement.parentElement.parentElement.scrollHeight;
  }

  public isAtBottom(answerEl: HTMLElement): boolean {
    if (!answerEl.parentElement?.parentElement?.parentElement)
      throw new Error(
        'Change in dom structure broke our autoscroll behavior in the Copilot Stream Controller'
      );
    const element = answerEl.parentElement.parentElement.parentElement;
    const scrollHeight = element.scrollHeight;
    const scrollTop = element.scrollTop;
    const offsetHeight = element.offsetHeight;

    if (offsetHeight === 0) {
      return true;
    }

    return scrollTop >= scrollHeight - offsetHeight - 1;
  }

  /**
   * Connects the websocket, handles all message callbacks, error handling, and rendering.
   */
  private connect() {
    this.ws = new WebSocket(`ws://localhost:${port}/qgpt/stream`);

    let totalMessage = '';
    let relevantSnippets: RelevantQGPTSeed[] = [];

    this.ws.onmessage = (msg) => {
      const json = JSON.parse(msg.data);
      const result = QGPTStreamOutputFromJSON(json);
      let answer: QGPTQuestionAnswer | undefined;
      let relevant: RelevantQGPTSeeds | undefined;

      // we got something from /relevance
      if (result.relevance) {
        relevant = result.relevance.relevant;
      } else {
        relevant = { iterable: [] };
      }

      // there is relevant snippets from the socket
      if (relevant) {
        for (const el of relevant.iterable) {
          relevantSnippets.push(el);
        }
      }
      // we got something from /question
      if (result.question) {
        answer = result.question.answers.iterable[0];
      } else {
        // the message is complete, or we do nothing
        if (result.status === 'COMPLETED') {
          QGPTView.lastConversationMessage = new Date();
          // add the buttons to the answer element's code blocks.
          if (!totalMessage) {
            this.answerEl!.innerHTML =
              "I'm sorry, it seems I don't have any relevant context to that question. Please try again 😃";
          }
          let queryIndicie: [string, number] = ['', -1];
          let answerIndicie: [string, number] = ['', -1];
          ConnectorSingleton.getInstance()
            .conversationApi.conversationGetSpecificConversation({
            conversation: result.conversation,
          })
            .then((conversation) => {
              // get the latest two messages on the conversation
              // this assumes the last message indicie is our answerid
              // and the 2nd to last message indicie is our queryid
              // this is the most efficient way I could figure this out - caleb
              for (const key in conversation.messages.indices ?? {}) {
                const index = conversation.messages.indices![key];
                if (index > answerIndicie[1]) {
                  queryIndicie = answerIndicie;
                  answerIndicie = [key, index];
                } else if (index > queryIndicie[1]) {
                  queryIndicie = [key, index];
                }
              }
            })
            .finally(() => {
              // render the new total message
              const isAtBottom = this.isAtBottom(this.answerEl!);
              this.handleRender(
                totalMessage,
                this.answerEl!,
                relevantSnippets,
                true
              );
              if (isAtBottom) this.forceScroll(this.answerEl!);
              QGPTViewBuilder.addMessageActions(
                this.answerEl!.parentElement!,
                false,
                answerIndicie[0]
              );
              this.messageResolver!({
                answer: totalMessage,
                relevant: { iterable: relevantSnippets },
                answerId: answerIndicie[0],
                queryId: queryIndicie[0],
              });
              // cleanup
              totalMessage = '';
              relevantSnippets = [];
            });
        } else if (result.status === 'FAILED' || result.status === 'UNKNOWN') {
          if (this.messageRejector) this.messageRejector(result);
          totalMessage = '';
          relevantSnippets = [];
        }
        return;
      }
      // add to the total message
      if (answer?.text) {
        totalMessage += answer.text;
      }
      // render the new total message
      const isAtBottom = this.isAtBottom(this.answerEl!);
      this.handleRender(totalMessage, this.answerEl!, relevantSnippets);
      if (isAtBottom) this.forceScroll(this.answerEl!);
    };

    const refreshSockets = (error?: any) => {
      if (error) console.error(error);
      totalMessage = '';
      relevantSnippets = [];
      if (this.messageRejector) this.messageRejector(error);
      this.ws = null;
    };
    // on error or close, reject the 'handleMessage' promise, and close the socket.
    this.ws.onerror = refreshSockets;
    this.ws.onclose = refreshSockets;

    this.connectionPromise = new Promise((res) => {
      if (!this.ws)
        throw new Error(
          'There is no websocket in Copilot Stream Controller (race condition)'
        );
      this.ws.onopen = () => res();
    });
  }

  /**
   *
   * @param param0 the input into the websocket, and the answer element to be updated.
   * @returns a promise that is resolved when the chat is complete, or rejected on an error.
   */
  private async handleMessages({
                                 input,
                                 answerEl,
                               }: {
    input: QGPTStreamInput;
    answerEl: HTMLElement;
  }) {
    if (!this.ws) this.connect();
    ConversationStreamController.getInstance().resetConnection();
    await this.connectionPromise;
    this.answerEl = answerEl;

    // scroll the container to the bottom
    answerEl!.parentElement!.parentElement!.scrollTop =
      answerEl!.parentElement!.parentElement!.scrollHeight;
    this.hasScrolled = false;

    // init message promise
    const promise = new Promise<MessageOutput>((res, rej) => {
      this.messageResolver = res;
      this.messageRejector = rej;
    });

    // seed the next conversation if there is not one.
    if (!QGPTView.conversationId.length) {
      const seededConversation: SeededConversation = {
        type: ConversationTypeEnum.Copilot,
      };
      const conversation =
        await ConnectorSingleton.getInstance().conversationsApi.conversationsCreateSpecificConversation(
          {
            transferables: false,
            seededConversation,
          }
        );
      input.conversation = conversation.id;
      QGPTView.conversationId = conversation.id;
    } else {
      input.conversation = QGPTView.conversationId;
    }
    try {
      QGPTView.lastConversationMessage = new Date();
      this.ws!.send(JSON.stringify(input));
    } catch (err) {
      console.error('err', err);
      this.messageRejector?.(err);
    }

    return promise;
  }

  /**
   * This converts our raw markdown into HTML, then syntax highlights the pre > code blocks, then renders the result.
   * @param totalMessage The total message to rendre
   * @param answerEl the answer element to update
   */
  private handleRender(
    totalMessage: string,
    answerEl: HTMLElement,
    relevant: RelevantQGPTSeed[],
    completed = false
  ) {
    const sanitized = QGPTComponentBuilder.sanitize(totalMessage);
    const htmlString = marked.parse(sanitized);
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    QGPTViewBuilder.highlightCodeBlocks(
      Array.from(div.querySelectorAll('pre > code')),
      relevant,
      !completed
    );

    div.classList.add(...answerEl.classList);
    answerEl.replaceWith(div);
    this.answerEl = div;
  }

  public static getInstance() {
    return (CopilotStreamController.instance ??= new CopilotStreamController());
  }
}
