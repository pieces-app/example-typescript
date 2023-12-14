import * as React from "react";
import {useState, useEffect} from "react";
import * as Pieces from "@pieces.app/pieces-os-client";
import {Application} from "@pieces.app/pieces-os-client";
import {DataTextInput, DeleteAssetButton, RenameAssetInput} from './components/TextInput';
import {Header} from './components/Header'
import {connect} from './utils/Connect'

// types
type LocalAsset = {
  name: string,
  id: string,
  classification: Pieces.ClassificationSpecificEnum,
}

//=============================[GLOBALS]================================//
let full_context: JSON;
let applicationData: Application;
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

  const refresh = (_newAsset: LocalAsset) => {
    setArray(prevArray => [...prevArray, _newAsset])
  }

  useEffect(() => {
    refreshSnippetList();
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
    })
    
  }

  return (
      <div style={{ padding: '10px 20px' }}>
          <Header />

        <div style={{
          width: "auto",
          border: '2px solid black',
          backgroundColor: 'black',
          height: '600px',
          padding: '20px',
          borderRadius: '9px',
          display: "flex",
          boxShadow: '-4px 4px 5px rgba(0,0,0, 0.2)',
        }}>
          {/* (6) here we can take this div and give it a min height, so that even when the list is not filled with snippets,
              the refresh button is still located towards the bottom of the column.

              to match our new header, we can go ahead and start adjusting some of the colors here before moving on to
              make some final tweaks to the components.

              a. added a background color to the main view container directly one level above ^^
              b. add the light shadow to the container as well from the component file for the /component/header.tsx
              c. add some minimal padding to the container for you snippets that contains the array.map
              d. add a title to this side - 'Saved Snippets' from your design

              */}
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
              minWidth: '700px',
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

              {/* (5) i moved this button up higher in this file and placed it inside the same column div as the snippet list.
                this will create the more side by side look that you were going for in your design example */}
            </div>

          </div>
          <div style={{display: 'flex', flexDirection: 'column', padding: '10px', maxHeight: '90%', alignSelf: 'end'}}>
            <h3 style={{color: 'white', fontWeight: 'normal' }}>Create a New Snippet</h3>
            <DataTextInput applicationData={applicationData}/>
            <RenameAssetInput assetID={(selectedIndex != -1 ? array[selectedIndex].id : "")}/>

          </div>
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
  //
  // (1) first @jordan-pieces came in here and added this turing statement here inside a new
  // if statement. this is an upgrade in comparison to the previous if statment that would not check to
  // see if the _indicator itself is added to the DOM yet.
  if (_indicator != null) {
    __ != undefined ? _indicator.style.backgroundColor = "green" : _indicator.style.backgroundColor = "red";
  }
})