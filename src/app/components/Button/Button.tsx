import * as React from "react";
import { createAsset } from "../Asset/Asset";
import "./Button.css";

export function CreateButton({
  applicationData,
  data,
  name,
}): React.JSX.Element {
  return (
    <button
      className="button"
      onClick={() => createAsset(applicationData, data, name)}
    >
      Create Snippet
    </button>
  );
}
