import * as React from 'react'
import { Indicator } from "./Indicator"

// this is the header element with its children:
export function Header(): React.JSX.Element {
  return (
      <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Hello Pieces Dev Community :)</h3>
          <Indicator />
      </div>
  )
}