import * as React from "react";
import { Indicator } from "../Indicator/Indicator";
import { connect } from "../../utils/Connect";
import "./Header.css";

// this is the header element with its children:
interface HeaderProps {
  isConnected: boolean;
}

// Header element with connection indicator nested inside, shows if pieces os is running.
// We don't support logic for detecting the offline status but will be adding it soon!
export function Header({ isConnected }: HeaderProps): React.JSX.Element {
  return (
    <div className="header-div">
      <h3>
        Pieces OS Client SDK for Typescript
        <span>Open Source by Pieces</span>
      </h3>
      <Indicator isConnected={isConnected} />
    </div>
  );
}
