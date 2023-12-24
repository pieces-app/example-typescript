import * as React from 'react'
import { Indicator } from "./Indicator"



// Header element with connection indicator nested inside, shows if pieces os is running.
// We don't support logic for detecting the offline status but will be adding it soon!
export function Header(): React.JSX.Element {
  return (
      <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', padding: '0px 10px', marginBottom: '1rem', boxShadow: '-4px 4px 5px rgba(0,0,0, 0.2)', borderRadius: '10px', minWidth: '1200px', maxWidth: '1200px'}}>
        <h3 style={{color: 'white', fontWeight: 'normal' }}>Pieces OS Client SDK for Typescript<span style={{ fontSize: '8px', marginLeft: '5px', fontWeight: '100' }}>Open Source by Pieces</span></h3>
        <Indicator />
      </div>
  )
}