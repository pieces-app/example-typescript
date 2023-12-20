
import * as Pieces from "@pieces.app/pieces-os-client";

export type MessageOutput = {
  answer: string;
};

/**
 * Stream controller class for interacting with the QGPT websocket
 */
export default class CopilotStreamController {
  private static instance: CopilotStreamController;

  private ws: WebSocket | null = null; // the qgpt websocket

  private setMessage: (message: string) => void; // the current answer element to be updated from socket events

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
                         setMessage
                       }: {
    query: string;
    setMessage: (message: string) => void;
  }): Promise<MessageOutput | undefined> {
    if (!this.ws) {
      this.connect();
    } // need to connect the socket if it's not established.
    await fetch(`http://localhost:1000/.well-known/health`).catch(() => {
      // @TODO add error handling here
    });

    // @TODO add conversation id
    const input: Pieces.QGPTStreamInput = {
      question: {
        query,
        relevant: {iterable: []} //@TODO hook up /relevance here for context
      },
    };

    return this.handleMessages({ input, setMessage });
  }

  /**
   * Connects the websocket, handles all message callbacks, error handling, and rendering.
   */
  private connect() {
    this.ws = new WebSocket(`ws://localhost:1000/qgpt/stream`);

    let totalMessage = '';
    let relevantSnippets: Pieces.RelevantQGPTSeed[] = [];

    this.ws.onmessage = (msg) => {
      const json = JSON.parse(msg.data);
      const result = Pieces.QGPTStreamOutputFromJSON(json);
      let answer: Pieces.QGPTQuestionAnswer | undefined;
      let relevant: Pieces.RelevantQGPTSeeds | undefined;

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
          // add the buttons to the answer element's code blocks.
          if (!totalMessage) {
            this.setMessage("I'm sorry, it seems I don't have any relevant context to that question. Please try again 😃")
          }

          // render the new total message
          this.handleRender(
            totalMessage,
          );
          this.messageResolver!({
            answer: totalMessage,
          });
          // cleanup
          totalMessage = '';

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
      this.handleRender(totalMessage);
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
                                 setMessage,
                               }: {
    input: Pieces.QGPTStreamInput;
    setMessage: (message: string) => void;
  }) {
    if (!this.ws) this.connect();
    await this.connectionPromise;
    this.setMessage = setMessage;

    // init message promise
    const promise = new Promise<MessageOutput>((res, rej) => {
      this.messageResolver = res;
      this.messageRejector = rej;
    });

    try {
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
  ) {
    // this is set up to only do one dom change, that way we prevent flickering in the case we want to do markdown parsing or syntax highlighting
    this.setMessage?.(totalMessage);
  }

  public static getInstance() {
    return (CopilotStreamController.instance ??= new CopilotStreamController());
  }
}
