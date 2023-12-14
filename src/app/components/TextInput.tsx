import * as React from "react";
import {useState} from "react";
import { deleteAsset, renameAsset } from "./Asset";
import {CreateButton} from './Button';

export function DataTextInput({applicationData}) {
  const [name, setName] = useState('');
  const [data, setData] = useState('');

  const handleDataChange = (event) => {
      setData(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  return (
      <>
          <input placeholder="Type the name of your snippet..." type="text" value={name} style={{ maxWidth: '450px', marginBottom: '10px' }} onChange={handleNameChange} />
          <textarea placeholder={"Add your code/text content into this box"} value={data} style={{ height: '200px', width: '450px', verticalAlign: 'top' }} onChange={handleDataChange} />
          <CreateButton applicationData={applicationData} data={data} name={name} />
      </>

  );
}

// (7) now we are bringing selected index into the button here and using it to determine the visibility of the button
// and will now show when selected.
export function DeleteAssetButton({assetID, selectedIndex}) {
  return (
      <>
          <button style={{ visibility: selectedIndex != -1 ? 'visible' : 'hidden', marginLeft: '1rem', maxWidth: 'fit-content', backgroundColor: 'transparent', color: 'red', border: '1px solid red', borderRadius: '5px', padding: '2px 20px', cursor: 'pointer' }} onClick={() => deleteAsset(assetID)}>DELETE</button>
      </>

  );
}

export function RenameAssetInput({assetID}) {
  const [name, setNameValue] = useState('');

  const handleNameChange = (event) => {
      setNameValue(event.target.value);
  };

  return (
      <>
          <input value={name} style={{ width: '450px', verticalAlign: 'top' }} onChange={handleNameChange} />
          <button  style={{
            marginTop: '10px',
            maxWidth: 'fit-content',
            height: 'fit-content',
            backgroundColor: "black",
            border: '1px solid white',
            borderRadius: '5px',
            padding: '8px 24px',
            color: 'white',
            flexWrap: 'nowrap',
            cursor: 'pointer',
            fontSize: '12px'
          }} onClick={() => renameAsset(name, assetID)}>Rename Selected Snippet</button>
      </>
  );
}