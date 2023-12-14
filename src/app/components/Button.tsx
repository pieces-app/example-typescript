import * as React from 'react';
import { createAsset } from './Asset';

export function CreateButton({applicationData, data, name}): React.JSX.Element {
  return (
      <button  style={{
          marginTop: '10px',
        marginBottom: '10px',
        maxWidth: 'fit-content',
        height: 'fit-content',
        // marginLeft: '10px',
        backgroundColor: "black",
        border: '1px solid white',
        borderRadius: '5px',
        padding: '8px 24px',
        color: 'white',
        flexWrap: 'nowrap',
        cursor: 'pointer',
        fontSize: '12px'
      }} onClick={() => createAsset(applicationData, data, name)}>Create Snippet</button>
  )
}