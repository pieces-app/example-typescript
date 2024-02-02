import * as React from "react";
import { useState } from "react";
import { deleteAsset, renameAsset } from "../Asset/Asset";
import { CreateButton } from "../Button/Button";
import "./TextInput.css";
import AssetController from "../../controllers/assetController";

export function DataTextInput({ applicationData }) {
  const [name, setName] = useState("");
  const [data, setData] = useState("");

  const handleDataChange = (event) => {
    setData(event.target.value);
    AssetController.getInstance().newAssetData = event.target.value;
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <>
      <input
        placeholder="Type the name of your snippet..."
        type="text"
        value={name}
        className="input-name"
        onChange={handleNameChange}
      />
      <textarea
        placeholder="Add your code/text content into this box"
        value={data}
        className="textarea-data"
        onChange={handleDataChange}
      />
    </>
  );
}

export function DeleteAssetButton({ assetID, selectedIndex ,setArray}) {
  return (
    <>
      <button className="delete-button" onClick={() => deleteAsset(assetID,setArray)}>
        DELETE
      </button>
    </>
  );
}

export function RenameAssetInput({ assetID }) {
  const [name, setNameValue] = useState("");

  const handleNameChange = (event) => {
    setNameValue(event.target.value);
  };

  return (
    <>
      <input
        value={name}
        className="input-rename"
        onChange={handleNameChange}
      />
      {/* TODO: Repair the renaming functionality + move button to other ./Button dir with other components */}
      {/*<button*/}
      {/*  className="rename-button"*/}
      {/*  onClick={() => renameAsset(name, assetID)}*/}
      {/*>*/}
      {/*  Rename Selected Snippet*/}
      {/*</button>*/}
    </>
  );
}
