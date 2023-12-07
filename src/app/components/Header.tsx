import * as React from 'react'
import { Indicator } from "./Indicator"

// this is the header element with its children:
export function Header({
  setSearchTerm
}: {
  setSearchTerm: (value: string) => void
}): React.JSX.Element {
  const handleSearch = (event) => {
    event.preventDefault()
    const searchTerm = event.target.elements['search-term'].value
    setSearchTerm(searchTerm ?? '')
  }
  return (
    <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
      <h3>Hello Pieces Dev Community :)</h3>
      <form onSubmit={handleSearch}>
        <input type="text" style={{ marginRight: "10px" }} name="search-term" />
        <button style={{ maxWidth: '100px', marginTop: '10px', }} type='submit'>Search</button>
      </form>
      <Indicator />
    </div>
  )
}