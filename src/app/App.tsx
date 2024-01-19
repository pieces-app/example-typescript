import * as React from "react";
import {useState, useEffect} from "react";
import * as Pieces from "@pieces.app/pieces-os-client";
import {Application} from "@pieces.app/pieces-os-client";
import {DataTextInput, DeleteAssetButton, RenameAssetInput} from './components/TextInput';
import {Header} from './components/Header'
import {CopilotChat} from './components/Copilot'
import {connect} from './utils/Connect'
import { Indicator } from "./components/Indicator";
import CopilotStreamController from "./controllers/copilotStreamController";
import WorkflowActivityList from "./components/WorkflowActivity";


// types
type LocalAsset = {
  name: string,
  id: string,
  classification: Pieces.ClassificationSpecificEnum,
}

//=============================[GLOBALS]================================//
let full_context: JSON;
export var applicationData: Application;
let _indicator: HTMLElement;
let snippetList: Array<LocalAsset>;

// you primary App function where all react elements render at their core.
// for reactivity i added a number of state based properties here, and made the highest level
// a little more verbose.
//
// refresh is responsible for adding new assets to the snippet list itself when you create a new asset.
// the refresh button is connected to first <button> element you see below the header and div there.
export function App(): React.JSX.Element {

  const [array, setArray] = useState<Array<LocalAsset>>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [error, setError] = useState(null);

  const refresh = (_newAsset: LocalAsset) => {
    setArray(prevArray => [...prevArray, _newAsset])
  }

  useEffect(() => {
    refreshSnippetList();
    CopilotStreamController.getInstance();
    }, []);

  const clearArray = () => {
    setArray([])
  }

  const handleSelect = (index) => {
    setSelectedIndex(index!=selectedIndex?index:-1);
  };

  function refreshSnippetList() {
    new Pieces.AssetsApi().assetsSnapshot({}).then((assets) => {
      // console.log('Response', assets)
      clearArray()

      for (let i = 0; i < assets.iterable.length; i++) {
        let _local: LocalAsset = {
          id: assets.iterable[i].id,
          name: assets.iterable[i].name,
          classification: assets.iterable[i].original.reference.classification.specific
        }

        refresh(_local);

      }
    }).catch((error) => {
      console.error(error);
      setError(true);
    });
  }
  

  return (
      <div style={{ padding: '10px 20px'}}>
      <Header isConnected={ !error} />
      {error && <div style={{border: '2px solid black',
        backgroundColor: '#0e1111',
          color: 'red',
          // minWidth: '1175px',
          // maxWidth: '1175px',
          padding: '20px',
          borderRadius: '9px',
          display: "flex",
        boxShadow: '-4px 4px 5px rgba(0,0,0, 0.2)',marginBottom:"10px"}}> Pieces OS is not running in the background. Click You're Not Connected to connect </div>}
        <div style={{display:'flex',flex:1,flexDirection:'row-reverse'}}>
        <div style={{border: '2px solid black',
          backgroundColor: '#0e1111',
          height: '600px',
          minWidth: '250px',
          // maxWidth: '1175px',
          padding: '20px',
          borderRadius: '9px',
          display: "flex",
          flex:1,
          flexDirection: 'column',
          boxShadow: '-4px 4px 5px rgba(0,0,0, 0.2)',}}>
            <h3 style={{color: 'white', fontWeight: 'normal' }}>Workflow Activity</h3>
            <WorkflowActivityList />
        </div>
        <div style={{
          // width: "auto",
          border: '2px solid black',
          backgroundColor: '#0e1111',
          height: '600px',
          minWidth: '1000px',
          // maxWidth: '1175px',
          padding: '20px',
          borderRadius: '9px',
          display: "flex",
          flex:1,
          marginRight: '10px',
          boxShadow: '-4px 4px 5px rgba(0,0,0, 0.2)',
        }}>
          <div style={{minHeight: '100%', display: "flex", flexDirection: "column", justifyContent: 'space-between'}}>

            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <h2 style={{color: 'white', fontWeight: 'normal', margin: '5px'}}>Saved Snippets</h2>
              <button style={{
                maxWidth: 'fit-content',
                height: 'fit-content',
                marginLeft: '10px',
                backgroundColor: "black",
                border: '1px solid white',
                borderRadius: '5px',
                padding: '8px 24px',
                color: 'white',
                flexWrap: 'nowrap',
                cursor: 'pointer',
                fontSize: '12px'
              }} onClick={refreshSnippetList}>Refresh Snippet List
              </button>
              <DeleteAssetButton assetID={(selectedIndex != -1 ? array[selectedIndex].id : "" )} selectedIndex={selectedIndex}/>
            </div>

            <div style={{
              overflow: "scroll",
              // minWidth: '700px',
              minHeight: "80%",
              paddingRight: '5px',
              display: "grid",
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(3, 1fr)',
              gap: '5px'
            }}>
              {array.map((item: LocalAsset, index) => (
                <div
                  key={index}
                  style={{
                    margin: '5px',
                    alignItems: 'center',
                    padding: "10px",
                    borderRadius: '5px',
                    height: '200px',
                    width: '200px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: "space-between",
                    backgroundColor: selectedIndex == index ? 'lightblue' : 'white', // Add background color based on selection
                    cursor: 'pointer' // Add cursor style to indicate clickability
                  }}
                  onClick={() => handleSelect(index)}
                >
                  <div>
                    <h3>{item.name}</h3>
                    <div style={{flexDirection: "column"}}>
                      <p>{item.id}</p>
                      <p>{item.classification}</p>
                    </div>
                  </div>
                </div>

              ))}
            </div>

          </div>
          <div style={{display: 'flex', flexDirection: 'column', padding: '10px', maxHeight: '90%', alignSelf: 'end',marginLeft:'10px'}}>
            <h3 style={{color: 'white', fontWeight: 'normal' }}>Create a New Snippet</h3>
            <DataTextInput applicationData={applicationData}/>
            <RenameAssetInput assetID={(selectedIndex != -1 ? array[selectedIndex].id : "")}/>

          </div>
        </div>
        </div>

        {/* this is the copilot container. the copilot logic is inside the /components/Copilot.tsx */}
        <div style={{
          border: '2px solid black',
          backgroundColor: '#0e1111',
          height: '600px',
          // minWidth: '1175px',
          // maxWidth: '1175px',
          padding: '20px',
          borderRadius: '9px',
          display: "flex",
          boxShadow: '-4px 4px 5px rgba(0,0,0, 0.2)',
          marginTop: '20px'
        }}>
            <CopilotChat />
        </div>


      </div>
  )
}

connect().then(__ => {
  // TODO: this needs improvement but is okay for now. since the types are not here yet,
  // for some reason i had to parse the stringified full_context object to get correct typing.
  full_context = __;
  let _t = JSON.parse(JSON.stringify(full_context));
  applicationData = _t.application;
  console.log('Application Data: ', applicationData);

  // define the indicator now that it exists.
  _indicator = document.getElementById("indicator");

  // conditional for the response back on application.
  // TODO: add some better error handling components and log - abstract the connect to its own file as well.
  if (_indicator != null) {
    __ != undefined ? _indicator.style.backgroundColor = "green" : _indicator.style.backgroundColor = "red";
  }
  
  _indicator.firstElementChild.innerHTML = __ != undefined ? "You're Connected!" : "You're Not Connected";

  // @agrim implemented - Upon connecting to the Pieces OS, there is a need to enhance the user experience by implementing a timer 
  // that automatically hides the "You're Connected" text and shrinks the button after a certain duration
  let time = 3000;
  setTimeout(() => {
    if (_indicator != null) {
      let indicatorText = document.getElementById("indicator_text");
      indicatorText.innerText = "";
      _indicator.style.transition = "all 0.3s ease";
      _indicator.style.transform = "scale(0.8)";
    }
  }, time);
})