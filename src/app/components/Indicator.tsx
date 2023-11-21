import * as React from "react";

// this is your indicator badge that we will manipulate through the initial connect call. it will either
// be green or red depending on the current status.
export function Indicator(): React.JSX.Element {
  return (
      <>
          <div style={{ display: "inherit", justifyContent: 'center', alignItems: 'center' }}>
              <p style={{ paddingRight: '10px' }}>Connection Status</p>
              <div id={"indicator"} style={{ backgroundColor: "red", width: '24px', height: '24px', borderRadius: '20px', border: '1px solid black'}}></div>
          </div>
      </>
  )
}