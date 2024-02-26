import * as React from "react";
import { createAsset } from "../Asset/Asset";
import "./Button.css";

export function CreateButton({
  applicationData,
  data,
  name,
}): React.JSX.Element {
  const handleClick = () => {
    if (applicationData && data && name) {
      createAsset(applicationData, data, name);
    } else {
      alert("One or more parameters are empty or null.");
    }
  };
  return (
    <button className="button" onClick={handleClick}>
      Create Snippet
    </button>
  );
}
