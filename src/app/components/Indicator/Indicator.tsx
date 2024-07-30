import * as React from 'react'
import './indicator.css'

// @ts-ignore
import check from '../../icons/check.png'
import { launchPiecesOS } from '../../utils/launchPiecesOS'
import useVersion from '../../utils/useVersion'

interface IndicatorProps {
  isConnected: boolean
}



export function Indicator({ isConnected }: IndicatorProps): React.JSX.Element {
  const osVersion = useVersion('version')
  return (
    <>
      <div className='center-container'>
        <button className='custom-button'>
          <div
            id='indicator'
            className={isConnected ? 'indicator green' : 'indicator red'}
            onClick={launchPiecesOS}
          >
            <span
              id='indicator_text'
              className={`indicator-text ${
                isConnected ? 'connected' : 'disconnected'
              }`}
            >
              {isConnected ? "You're Connected" : "You're Not Connected"} v{' '}
              {osVersion}
            </span>
            <img
              id='checkmark'
              src={check}
              alt='checkmark'
              className={`checkmark ${
                isConnected ? 'connected' : 'disconnected'
              }`}
            />
          </div>
        </button>
      </div>
    </>
  )
}
