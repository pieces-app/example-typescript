import * as React from 'react'
import {useEffect, useState} from 'react'
import * as Pieces from "@pieces.app/pieces-os-client";
import {ConversationTypeEnum, SeededConversation} from "@pieces.app/pieces-os-client";


import { applicationData } from "../App";


let GlobalConversationID: string;
// let GlobalConversationAnswers: Array<Pieces.QGPTQuestionAnswer> = [];

// this gets all conversations that are currently available for a user. there is an optional param that you can set to
// also return the first asset in the list.
// TODO: any is baaaad here but coming back to clean up. output is either void or the first conversation in the list.

// export function refreshCopilot(): void {
//   getAllConversations(true)
// }
//
//
// export function getAllConversations(firstOnly?: boolean): any {
//   new Pieces.ConversationsApi().conversationsSnapshot({}).then(output => {
//     // exit here quickly if the first flag is not set.
//     if (firstOnly == false){
//       console.log(output)
//     } else {
//       return output.iterable.at(0);
//     }
//   })
// }


// going to use get all conversations with a few extra steps to store the current conversations locally.

export function createNewConversation() {

  console.log('Begin creating conversation...')
  // variables for storing our values as they come in.
  // let iterable: Array<Pieces.Conversation>;

  // to create a new conversation, you need to first pass in a seeded conversation in the request body.
  // the only mandatory parameter is the ConversationTypeEnum.Copilot value.
  let seededConversation: SeededConversation = { type: ConversationTypeEnum.Copilot, name: "Demo Seeded Conversation" }

  console.log('Conversation seeded')
  console.log('Passing over the new conversation with name: ' + seededConversation.name)

  // creates new conversation, .then is for confirmation on creation.
  // note the usage of transfereables here to expose the full conversation data and give access to the id and other
  // conversation values.
  new Pieces.ConversationsApi().conversationsCreateSpecificConversationRaw({transferables: true, seededConversation}).then((_c)  => {
    console.log('Conversation created! : Here is the response:');
    console.log(_c);

    // check and ensure the response back is clean.
    if (_c.raw.ok == true && _c.raw.status == 200) {
      console.log('CLEAN RESPONSE BACK.')
      _c.value().then(_conversation => {
        console.log('Returning new conversation values:')
        console.log('ID | ' + _conversation.id);

        // we also are going to set the current conversation id globally here:
        GlobalConversationID = _conversation.id;

        console.log('NAME | ' + _conversation.name);
        console.log('CREATED | ' + _conversation.created.readable);
        // console.log('ID: ' + _conversation.);
      })
    }
  })
}



function sendConversationMessage(prompt: string, conversationID: string = GlobalConversationID){
  // 1. seed a message
  // 2. get the conversation id from somewhere - likely the createNewConversation above ^^
  // 3. send the new message over
  // 4. use the message contents in the (not yet created) message stream/list
  console.log(prompt);
  console.log(conversationID);

  askQuestion({query: prompt, relevant: ''}).then((r) => {
    return r.result;
  }).then((value) => {
    // TODO: need to collect all of the iterable answers here for the viewer.
    // TODO: i believe this is near the implementation of the stream.
    let _answers = value.answers.iterable;
    // console.log(_answers);

    // let's store the new answers globally for this file:
    // GlobalConversationAnswers = [..._answers];
  })
}

function ChatsComponent() {

  // return <div>
  //   {GlobalConversationAnswers.map((item: Pieces.QGPTQuestionAnswer, index) => (
  //     <div
  //       key={index}
  //       style={{}}></div>
  //     ))};
  // </div>
}

export async function askQuestion({
                                    query,
                                    relevant,
                                  }: {
  query: string;
  relevant: string;
}) {
  // TODO: need to get instance here - current config is stored in app.tsx (maybe not actually)
  // const config = ConnectorSingleton.getInstance();
  const params: Pieces.QGPTQuestionInput = {
    query,
    relevant: {
      iterable: [
        {
          seed: {
            type: Pieces.SeedTypeEnum.Asset,
            asset: {
              application: applicationData,
              format: {
                fragment: {
                  string: {
                    raw: relevant,
                  },
                },
              },
            },
          },
        },
      ],
    },
  };
  // const result = await Pieces.QGPTApi.question({qGPTQuestionInput: params});
  const result = new Pieces.QGPTApi().question({qGPTQuestionInput: params});
  return {result, query};
}

export function CopilotChat(): React.JSX.Element {
  const [chatSelected, setChatSelected] = useState('-- no chat selected --');
  const [chatInputData, setData] = useState('');

  // handles the data changes on the chat input.
  const handleCopilotChatInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setData(event.target.value);
    // console.log(event.target.value)
  };

  // for setting the initial copilot chat that takes place on page load.
  useEffect(() => {
    const getInitialChat = async () => {
      let _name: string;

      await new Pieces.ConversationsApi().conversationsSnapshot({}).then(output => {
        _name = output.iterable.at(0).name;
        GlobalConversationID = output.iterable.at(0).id;
        return output.iterable.at(0).name
      });
      setChatSelected(_name);
    };
    getInitialChat();
  }, []);

    return (
      <div style={{ width: '-webkit-fill-available'}}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
          <div style={{ display: 'inherit', flexDirection: 'inherit', alignItems: 'inherit' }}>
            <h1 style={{color: 'White'}}>Copilot Chat</h1>
            {/* TODO: configure for selecting a conversation */}
            {/*<button onClick={createNewConversation}> Get all Conversations</button>*/}
            <button style={{maxWidth: 'fit-content',
              height: 'fit-content',
              marginLeft: '10px',
              backgroundColor: "black",
              border: '1px solid white',
              borderRadius: '5px',
              padding: '8px 24px',
              color: 'white',
              flexWrap: 'nowrap',
              cursor: 'pointer',
              fontSize: '12px'}} onClick={createNewConversation}>Create Fresh Conversation</button>
          </div>

          <div style={{width: '500px', maxHeight: '50px', display: "inherit", flexWrap: 'inherit', alignItems: 'inherit', justifyContent: 'center'}}>
            {/* TODO: great candidate for a class here on these two buttons and their coming styles. */}
            <button style={{maxHeight: '25px', minWidth: '60px'}}>back</button>
            {/* TODO: attach the data here for the currently selected copilot chat */}
            <p style={{ margin: '0px 15px', color: "white"}}> {chatSelected} </p>
            <button style={{maxHeight: '25px', minWidth: '60px'}}>forward</button>
          </div>
        </div>
        <div style={{border: '2px solid white', height: '80%', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '15px', marginBottom: '10px', display: 'flex', position: 'relative'}}>
        {/*  top layer is the text box that always stays on top of the chat bar */}
          <div style={{
            zIndex: '10',
            border: '2px solid transparent',
            width: '-webkit-fill-available',
            position: "absolute",
            bottom: 0,
            height: '50px',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
            backgroundColor: "white",
            display: 'inherit'
          }}>
            <textarea placeholder={"Type your prompt here..."} style={{
              width: '99.5%',
              height: '90%',
              borderBottomLeftRadius: '10px',
              borderBottomRightRadius: '10px',
              border: 'none',
              resize: 'none'
            }} value={chatInputData} onChange={handleCopilotChatInputChange}></textarea>
            <button onClick={() => sendConversationMessage(chatInputData)} style={{maxHeight: '25px', minWidth: '60px', alignSelf: 'center', marginBottom: '5px', marginRight: '5px', marginLeft: '10px'}}>Ask</button>
          </div>
          {/* this is the bottom container that is where the messages go. */}
          <div style={{ overflow: "hidden", zIndex: 1, width: '-webkit-fill-available', position: "absolute", height: '100%', borderRadius: '10px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ border: '2px solid transparent', width: '70%'}}>
                <ChatsComponent />
            </div>
          </div>

        </div>
      </div>
    )
}
