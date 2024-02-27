import * as React from 'react'
import {useEffect, useState} from 'react'
import * as Pieces from "@pieces.app/pieces-os-client";
import {ConversationTypeEnum, SeededConversation} from "@pieces.app/pieces-os-client";
import "./Copilot.css";


import { applicationData } from "../../App";
import CopilotStreamController from '../../controllers/copilotStreamController';


let GlobalConversationID: string;


// going to use get all conversations with a few extra steps to store the current conversations locally.
export function createNewConversation() {

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

export async function askQuestion({
                                    query,
                                    relevant,
                                    // model,
                                  }: {
  query: string;
  relevant: string;
  // model: string;
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
    // model,
  };
  // const result = await Pieces.QGPTApi.question({qGPTQuestionInput: params});
  const result = new Pieces.QGPTApi().question({qGPTQuestionInput: params});
  return {result, query};
}

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
      // model: selectedModel,
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
    // get all the models and set them to the state.
    async function getModels() {
      const models = await new Pieces.ModelsApi().modelsSnapshot();
      const names = models.iterable.map((model) => model.name);
      setModelNames(names);
    }
    getModels();
  }, []);


  const [modelNames, setModelNames] = useState([]);
  const [selectedModel, setSelectedModel] = useState<String>('GPT-4 Chat Model');

  

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Copilot Chat</h1> 

          <button className="button" onClick={handleNewConversation}>Create Fresh Conversation</button>
          <select className='button' onChange={(e) => setSelectedModel(e.target.value)}>
          {/* style={{width: '100px', height: '30px', borderRadius: '5px',margin: '0 10px'}} */}
                {modelNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
          </select>
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
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}