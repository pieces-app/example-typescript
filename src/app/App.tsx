import * as React from "react";
import {useState, useEffect} from "react";
import * as Pieces from "@pieces.app/pieces-os-client";
import {Application} from "@pieces.app/pieces-os-client";
import {DataTextInput, DeleteAssetButton, RenameAssetInput} from './components/TextInput/TextInput';
import {Header} from './components/Header/Header'
import {CopilotChat} from './components/Copilot/Copilot'
import {connect} from './utils/Connect'
import { Indicator } from "./components/Indicator/Indicator";
import "./global.css";
import WorkflowActivityList from "./components/WorkflowActivity";
import Modal from "./components/Asset/Modal";
import { AiFillEye } from 'react-icons/ai';

import { OSApi } from "@pieces.app/pieces-os-client";
import { config } from "../platform.config";
const osApi = new OSApi(); // Create an instance of the OSApi

// types
type LocalAsset = {
  name: string,
  id: string,
  classification: Pieces.ClassificationSpecificEnum,
}

type SnippetSelector = ( arg: number ) => void;
type SnippetDeselector = () => void;
type KeyboardInputHandler = ( arg: React.KeyboardEvent ) => void;
type FormHandler = (event: React.BaseSyntheticEvent) => void;

//=============================[GLOBALS]================================//
let full_context: JSON;
export var applicationData: Application;
let _indicator: HTMLElement | null = null;
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
  const [previewData, setPreviewData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handlePreview = async (snippetId:string) => {
    try {
      const asset = await new Pieces.AssetApi(config).assetSnapshot({ asset: snippetId });
      console.log('asset ===', asset)
      setPreviewData(asset);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const [userName, setUserName] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(null); // State to track login status
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to handle user login
  const loginUser = async () => {
    try {
      // Call the signIntoOS() method to initiate the login process
      const userDetails = await osApi.signIntoOS();
      setUserName(userDetails.name);
      setIsLoggedIn(true); 
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle login error
    }
  };


  // Function to handle user logout
  const logoutUser = async () => {
    try {
      // Call the signOutOfOS() method to initiate the logout process
      await osApi.signOutOfOS();
      setIsLoggedIn(false); // Update login status
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const refresh = (_newAsset: LocalAsset) => {
    setArray(prevArray => [...prevArray, _newAsset])
  }

  useEffect(() => {
    refreshSnippetList();
    }, []);

  const clearArray = () => {
    setArray([])
  }

  const handleSelect: SnippetSelector = (index) => {
    setSelectedIndex(index!=selectedIndex?index:-1);
  };

  const handleDeSelect: SnippetDeselector = () => {
    setSelectedIndex(-1)
  };

  // Keyboard event handler
  const handleKeyPress: KeyboardInputHandler = (event) => {
    // Check if 'Cmd' on MacOS or 'Ctrl' on Windows is pressed along with '\'
    if ((event.metaKey || event.ctrlKey) && event.key === '\\') {
      handleDeSelect();
    }
  };
    async function refreshSnippetList() {
      try {
        const assets = await new Pieces.AssetsApi(config).assetsSnapshot({});
        clearArray();
    
        for (let i = 0; i < assets.iterable.length; i++) {
          let _local: LocalAsset = {
            id: assets.iterable[i].id,
            name: assets.iterable[i].name,
            classification: assets.iterable[i].original.reference.classification.specific
          }
          console.log("refreshSnippet", i, _local);
          refresh(_local);
        }
      } catch (error) {
        console.error(error);
        setError(true);
      }
    }
  
  async function searchSnippetList(snippetName: string) {
    try {
      const searchedAssets = await new Pieces.SearchApi(config).fullTextSearch({ query: snippetName });
      
      // Check if there are no matching snippets 
      if (searchedAssets.iterable.length === 0) {
        return 'No matching snippets found';
      }

      // get the "ID" or identifier of the first match on the string you passed in as the query:
      let firstSearchMatchAssetIdentifier = searchedAssets.iterable[0].identifier;

      let matchName: String;

      // take that identifier to get your assets name using the Pieces.AssetApi()
      const asset = await new Pieces.AssetApi(config).assetSnapshot({asset: firstSearchMatchAssetIdentifier});
  
      // assign that name to the matchName variable:
      matchName = asset.name;
      console.log("the matchName is" + matchName);

      // then you can do whatever you would like with that match:
      return matchName;
    } catch (error) {
      console.error(error);
    }
  };

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState('')
  const handleSearch: FormHandler = async (event) => {
    event.preventDefault()
    const searchTerm = event.target.elements['search-term'].value
    if (!searchTerm) {
      setSearchResult('');
      return;
    }
    setSearchTerm(searchTerm );
    let result = await searchSnippetList(searchTerm);
    console.log("The Result is "+ result);
    console.log(searchTerm);
    setSearchResult(result.toString());
  }

  // This is the state for the application data. It is set to null initially and then set to the application data once the connection is established.
  const [appData, setAppData] = useState<Application | null>(null);

  // This is the useEffect hook that is called when the component is mounted. It is responsible for connecting to the Pieces OS and setting the application data.
  useEffect(() => {
    connect().then(__ => {
      // TODO: this needs improvement but is okay for now. since the types are not here yet,
      // for some reason i had to parse the stringified full_context object to get correct typing.
      full_context = __;
      let _t = JSON.parse(JSON.stringify(full_context));
      setUserName(_t?.user?.name);
      setIsLoggedIn(true); 
      setIsLoading(false);
      applicationData = _t.application;
      setAppData(applicationData);
      let osVersion = _t.health.os.version
      console.log('Application Data: ', applicationData);
      localStorage.setItem("version", osVersion)
      // define the indicator now that it exists.
      _indicator = document.getElementById("indicator");

      // conditional for the response back on application.
      // TODO: add some better error handling components and log - abstract the connect to its own file as well.
      // Inside the useEffect hook, ensure _indicator is not null before accessing its properties
      if (_indicator != null) {
        __ != undefined ? _indicator.style.backgroundColor = "green" : _indicator.style.backgroundColor = "red";
      }

      // Accessing firstElementChild property with null check
      if (_indicator != null && _indicator.firstElementChild != null) {
        _indicator.firstElementChild.innerHTML = __ != undefined ? "You're Connected!" : "You're Not Connected";
}
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
  },[]);

  const filteredArray = array.filter(item => searchTerm === '' || item.name.includes(searchResult));

  if(isLoading){
    return null ;
  }
  return (
    <>
        {isLoggedIn && userName ? (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 style={{ textAlign: "left" }}>Welcome to your own copilot, {userName}</h2>
          <button className="logoutBtn " onClick={logoutUser}>Logout</button>
        </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2 style={{ textAlign: "left" }}>Please Login to use Pieces Copilot</h2>
            <button
              className="loginBtn"
              onClick={loginUser}
            >
              Login
            </button>
          </div>
        )}

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
            {
              filteredArray.length > 0 ? (
                filteredArray.map((item: LocalAsset, index) => (
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
                      {/* <p>{item.id}</p> */}
                      <p>{item.classification}</p>
                  <button onClick={() => handlePreview(item.id)}><AiFillEye title="Preview"/></button>
                  {showModal && (
                      <Modal asset={previewData} onClose={() => setShowModal(false)} />
                    )}
                  <div>
                </div>
                    </div>
                  </div>
                </div>
              ))
            ):
              <div className="white-text">No matching snippets found.</div>
            }
              </div>
            </div>

          <div className="snippet-grid-container">
              <form onSubmit={handleSearch}>
                <input type="text" className="search-input-style" name="search-term" />
                <button className="search-button-style" type='submit'>Search</button>
              </form>
            <h3 className="snippets-heading-2">Create a New Snippet</h3>
            <DataTextInput applicationData={appData}/>
            <RenameAssetInput assetID={((selectedIndex < array.length && selectedIndex!=-1) ? array[selectedIndex].id : "")}/>
            </div>
          </div>
        </div>

        {/* this is the copilot container. the copilot logic is inside the /components/Copilot.tsx */}
       
            <CopilotChat />
       
      </div>
    </>
  );
}
