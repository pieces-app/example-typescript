import * as React from "react";

// @ts-ignore
import check from "../icons/check.png";

// this is your indicator badge that we will manipulate through the initial connect call. it will either
// be green or red depending on the current status.
export function Indicator(): React.JSX.Element {
  return (
      <>
          <div style={{ display: "inherit", justifyContent: 'center', alignItems: 'center' }}>
              {/*<p style={{ paddingRight: '10px' }}>Connection Status</p>*/}
              <div id={"indicator"} style={{ backgroundColor: "red", height: '24px', borderRadius: '20px', border: '1px solid black', padding: '2px 10px', display: 'flex', flexWrap: 'wrap', alignItems: 'center'  }}>
                <span id={"indicator_text"} style={{ color: "white", fontSize: '14px' }}>You're Connected!</span>
                <img id={"checkmark"} src={check} alt={"checkmark"} style={{height: "20px", width: '20px', margin: '0 5px'}}/>
              </div>
          </div>
      </>
  )
}