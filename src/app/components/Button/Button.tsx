import * as React from "react";
import { createAsset } from "../Asset/Asset";
import "./button.css";

export function CreateButton({
  applicationData,
  data,
  name,
}): React.JSX.Element {
  return (
    <button
      className="btn"
      onClick={() => createAsset(applicationData, data, name)}
    >
      Create Snippet
    </button>
  );
}
