import * as React from "react";
import {useState, useEffect} from "react";
import * as Pieces from "@pieces.app/pieces-os-client";
import {Application} from "@pieces.app/pieces-os-client";
import {DataTextInput, DeleteAssetButton, RenameAssetInput} from './components/TextInput/TextInput';
import {Header} from './components/Header/Header'
import {CopilotChat} from './components/Copilot/Copilot'
import {connect} from './utils/Connect'
import { Indicator } from "./components/Indicator/Indicator";
import CopilotStreamController from "./controllers/copilotStreamController";
import "./global.css";
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

  const handleDeSelect = () => {
    setSelectedIndex(-1)
  };

  // Keyboard event handler
  const handleKeyPress = (event) => {
    // Check if 'Cmd' on MacOS or 'Ctrl' on Windows is pressed along with '\'
    if ((event.metaKey || event.ctrlKey) && event.key === '\\') {
      handleDeSelect();
    }
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
        console.log("refreshSnippet",i,_local);
        refresh(_local);
      }
    }).catch((error) => {
      console.error(error);
      setError(true);
    });
  }
  

  return (
      <div className="container">
      <Header isConnected={ !error} />
      {error && <div className="error-container"> Pieces OS is not running in the background. Click You're Not Connected to connect </div>}
        <div className="flex-container">
        <div className="workflow-activity-container">
            <h3 className="activity-heading">Workflow Activity</h3>
            <WorkflowActivityList />
        </div>
        <div className="snippets-container">
          <div className="snippets-header">
            <div className="snippets-subheader">
              <h2 className="snippets-heading">Saved Snippets</h2>
              <button className="refresh-btn" onClick={refreshSnippetList}>Refresh Snippet List
              </button>
        <button className="deselect-btn" onClick={handleDeSelect}>DESELECT
              </button>
              <DeleteAssetButton assetID={((selectedIndex < array.length && selectedIndex!=-1) ? array[selectedIndex].id : "" )} selectedIndex={selectedIndex} setArray={setArray}/>
            </div>

            <div className="snippets-grid">
              {array.map((item: LocalAsset, index) => (
                <div
                  onKeyDown={handleKeyPress}
                  tabIndex={0}
                  key={index}
                  className="snippet-item"
                  style={{
                    backgroundColor: selectedIndex == index ? 'lightblue' : 'white', // Add background color based on selection
                  }}
                  onClick={() => handleSelect(index)}
                >
                  <div>
                    <h3>{item.name}</h3>
                    <div className="snippet-details">
                      <p>{item.id}</p>
                      <p>{item.classification}</p>
                    </div>
                  </div>
                </div>

              ))}
            </div>
          </div>

          <div className="snippet-grid-container">
            <h3 className="snippets-heading-2">Create a New Snippet</h3>
            <DataTextInput applicationData={applicationData}/>
            <RenameAssetInput assetID={((selectedIndex < array.length && selectedIndex!=-1) ? array[selectedIndex].id : "")}/>

          </div>
        </div>
        </div>

        {/* this is the copilot container. the copilot logic is inside the /components/Copilot.tsx */}
        <div className="copilot-container">
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
  let osVersion = _t.health.os.version
  console.log('Application Data: ', applicationData);
  localStorage.setItem("version", osVersion)
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