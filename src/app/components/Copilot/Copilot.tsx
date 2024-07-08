import * as React from 'react'
import {useEffect, useState} from 'react'
import * as Pieces from "@pieces.app/pieces-os-client";
import {ConversationTypeEnum, SeededConversation} from "@pieces.app/pieces-os-client";
import "./Copilot.css";


import { applicationData } from "../../App";
import CopilotStreamController from '../../controllers/copilotStreamController';
import Markdown from '../ResponseFormat/Markdown';


let GlobalConversationID: string;


// going to use get all conversations with a few extra steps to store the current conversations locally.
export function createNewConversation() {
  try {

    // logs --> CREATING CONVERSATION
    console.log('Begin creating conversation...')

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
          console.log('Returning new conversation values.');
          // console.log('ID | ' + _conversation.id);
          // console.log('NAME | ' + _conversation.name);
          // console.log('CREATED | ' + _conversation.created.readable);
          // console.log('ID: ' + _conversation.);

          // Set the conversation variable here for the local file:
          GlobalConversationID = _conversation.id;
        })
      }
    })
  } catch (error) {
    console.error('An error occurred while creating a conversation:', error);
  }
}


// You can use this here to set and send a conversation message.
// function sendConversationMessage(prompt: string, conversationID: string = GlobalConversationID){
//   // 1. seed a message
//   // 2. get the conversation id from somewhere - likely the createNewConversation above ^^
//   // 3. send the new message over
//   // 4. use the message contents in the (not yet created) message stream/list
//   // console.log(prompt);
//   // console.log(conversationID);
//
//   askQuestion({query: prompt, relevant: ''}).then((r) => {
//     return r.result;
//   }).then((value) => {
//
//     // TODO: need to collect all of the iterable answers here for the viewer.
//     // TODO: i believe this is near the implementation of the stream.
//     // let _answers = value.answers.iterable;
//     // let's store the new answers globally for this file:
//     // GlobalConversationAnswers = [..._answers];
//   })
// }
export function CopilotChat(): React.JSX.Element {
  const [chatSelected, setChatSelected] = useState('-- no chat selected --');
  const [chatInputData, setData] = useState('');
  const [message, setMessage] = useState<string>('');

  // handles the data changes on the chat input.
  const handleCopilotChatInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setData(event.target.value);
  };

  // handles the ask button click.
  const handleCopilotAskbuttonClick = async (chatInputData, setMessage)=>{
    CopilotStreamController.getInstance().askQGPT({
      query: chatInputData,
      setMessage,
    });
    setData("");
  }

  // handles the new conversation button click.
  const handleNewConversation = async () => {
    createNewConversation();
    setMessage("")
    setData("")
  };

  // for setting the initial copilot chat that takes place on page load.
  useEffect(() => {
    const getInitialChat = async () => {
      let _name: string;

      await new Pieces.ConversationsApi()
        .conversationsSnapshot({})
        .then((output) => {
          if (
            output.iterable.length > 0 &&
            output.iterable.at(0).hasOwnProperty("name")
          ) {
            _name = output.iterable.at(0).name;
            GlobalConversationID = output.iterable.at(0).id;
          }
          return _name;
        });
        
      if (_name) {
        setChatSelected(_name);
      }
    };
    getInitialChat();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Copilot Chat</h1>
          <button className="button" onClick={handleNewConversation}>Create Fresh Conversation</button>
        </div>
        <div className="footer">
          <button>back</button>
          <p>{chatSelected}</p>
          <button>forward</button>
        </div>
      </div>
      <div className="chat-box">
        <div className="text-area">
          <textarea placeholder="Type your prompt here..." value={chatInputData} onChange={handleCopilotChatInputChange}></textarea>
          <button onClick={() => handleCopilotAskbuttonClick(chatInputData,setMessage) }>Ask</button>
        </div>
        <div className="messages">
          <div>
          <Markdown message={message} />
          </div>
        </div>
      </div>
    </div>
  );
}