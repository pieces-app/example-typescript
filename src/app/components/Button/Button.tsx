import * as React from "react";
import { createAsset } from "../Asset/Asset";
import "./Button.css";

// Interface defines the specific types for each passable prop
interface CreateButtonProps {
  applicationData: any;
  data: any;
  name: string;
}

// CreateButton component takes applicationData, data, and name as props,
// and renders a button which creates an asset using the provided data when clicked.
export function CreateButton({
  applicationData,
  data,
  name,
}): React.JSX.Element {
  // Memoizes the handleClick function using React's useCallback hook.
  // The function is re-rendered only when one of the dependencies changes.
  const handleClick = React.useCallback(() => {
    if (applicationData && data && name) {
      createAsset(applicationData, data, name);
    } else {
      alert("One or more parameters are empty or null.");
    }
  }, [applicationData, data, name]);

  return (
    <button className="button" onClick={handleClick}>
      Create Snippet
    </button>
  );
}
