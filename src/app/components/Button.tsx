import * as React from 'react';
import { createAsset } from './Asset';

export function CreateButton({applicationData, data, name}): React.JSX.Element {
  return (
      <button style={{ marginTop: '10px', maxWidth: '200px' }} onClick={() => createAsset(applicationData, data, name)}>Create Snippet</button>
  )
}