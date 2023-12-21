import * as React from "react";

// @ts-ignore
import check from "../icons/check.png";

// this is your indicator badge that we will manipulate through the initial connect call. it will either
// be green or red depending on the current status.

// (4) So in your designs I saw that you wanted to add the 'text connected and secured' and a check to the circle indicator.
// this should be pretty simple to add in with a few steps:
//
// a. First lets get the icon for the check mark - I got one from icons 8 here: https://icons8.com/icon/set/check/color
// b. Now lets move the text inside the pill here that you suggested
// c. then add the <img> element after the <span> you just added, styled it, and TODO: I added a ts-ignore above the image import (cant get it to go away)
// d. added an id to the image for later and we are good to go for now.
//
// lets head over to the App.tsx file at /app/App.tsx and we can get going on rearranging some pieces and parts of this
// landing index page.

export function Indicator(): React.JSX.Element {
 const osVersion = localStorage.getItem("version")
  return (
      <>
          <div style={{ display: "inherit", justifyContent: 'center', alignItems: 'center' }}>
              {/*<p style={{ paddingRight: '10px' }}>Connection Status</p>*/}
              <div id={"indicator"} style={{ backgroundColor: "red", height: '24px', borderRadius: '20px', border: '1px solid black', padding: '2px 10px', display: 'flex', flexWrap: 'wrap', alignItems: 'center'  }}>
                <span id={"indicator_text"} style={{ color: "white", fontSize: '14px' }}>You're Connected! v {osVersion}</span>
                <img id={"checkmark"} src={check} alt={"checkmark"} style={{height: "20px", width: '20px', margin: '0 5px'}}/>
              </div>
          </div>
      </>
  )
}