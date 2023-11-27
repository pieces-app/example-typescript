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
          <h4>Name:</h4>
          <input type="text" value={name} style={{ maxWidth: '450px' }} onChange={handleNameChange} />
          <h4>Add Data:</h4>
          <textarea value={data} style={{ height: '200px', width: '450px', verticalAlign: 'top' }} onChange={handleDataChange} />
          <CreateButton applicationData={applicationData} data={data} name={name}/>
      </>

  );
}

export function DeleteAssetIDInput() {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
      setValue(event.target.value);
  };

  return (
      <>
          <input value={value} style={{ width: '450px', verticalAlign: 'top' }} onChange={handleChange} />
          <button style={{ marginTop: '10px', maxWidth: '200px' }} onClick={() => deleteAsset(value)}>Delete Snippet</button>
      </>

  );
}

export function RenameAssetInput() {
  const [name, setNameValue] = useState('');
  const [id, setIdValue] = useState('');

  const handleNameChange = (event) => {
      setNameValue(event.target.value);
  };

  const handleIdChange = (event) => {
      setIdValue(event.target.value);
  };

  return (
      <>
          <p>Name:</p>
          <input value={name} style={{ width: '450px', verticalAlign: 'top' }} onChange={handleNameChange} />
          <p>ID:</p>
          <input value={id} style={{ width: '450px', verticalAlign: 'top' }} onChange={handleIdChange} />
          <button style={{ marginTop: '10px', maxWidth: '200px' }} onClick={() => renameAsset(name, id)}>Rename Snippet</button>
      </>

  );
}