import * as React from 'react'
import { Indicator } from "./Indicator"

// (3) Here you can see some of the html structure that you were writing in the index.html file. Inside the
// return (
//  <ALL-HTML-IN-HERE>
// )
// you can see that this acts like a html file and can be used as a location to
// write html or reference other React.JSX.Element(s). So we can start by adding your styling here for the header.
//
// a. you did not include any styling for the header for the \website\wave.png image that you added. so instead I am
// going to remove the headerImg for now and instead change the background color of the Header element itself.
// b. going to add some styling to the header text to change the color, so we can see it, and add some horizontal
// padding to the header container.
// c. we will top it off by adding some rounding and shadow to the header container.
// d. while we are here i would love to add some margin below the header as well to let it breathe.
// e. added a few styles here to the text and a little tagline.
//
// Now lets head over to the <Indicator /> component to get the text in there that you wanted in /components/Indicator.tsx
//

// this is the header element with its children:
interface HeaderProps {
  isConnected: boolean
}

export function Header({isConnected}:HeaderProps): React.JSX.Element {
  return (
      <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', padding: '0px 10px', marginBottom: '1rem', boxShadow: '-4px 4px 5px rgba(0,0,0, 0.2)', borderRadius: '10px', minWidth: '1200px', maxWidth: '1200px'}}>
        <h3 style={{color: 'white', fontWeight: 'normal' }}>Pieces OS Client SDK for Typescript<span style={{ fontSize: '8px', marginLeft: '5px', fontWeight: '100' }}>Open Source by Pieces</span></h3>
      <Indicator isConnected={ isConnected} />
      </div>
  )
}