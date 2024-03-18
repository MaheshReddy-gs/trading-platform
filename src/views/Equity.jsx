import React, { useState, useRef, memo, useEffect } from "react";
import MarketIndex from "../components/MarketIndex";
import LeftNav from "../components/LeftNav";
import RightNav from "../components/RightNav";
import { ErrorContainer } from "../components/ErrorConsole";
import { TopNav } from "../components/TopNav";

function Equity() {
  // Error Message start
  const [msgs, setMsgs] = useState([]);
  const handleClearLogs = () => {
    if (msgs.length === 0) return; //guard clause
    setMsgs([]);
  };
  // Error Message end
  return (
    <div>
      <MarketIndex />
      <div className="main-section">
        <LeftNav />
        <div className="middle-main-container">
          {/* <ErrorContainer
            msgs={[]}
          /> */}
          <TopNav />
          <ErrorContainer msgs={msgs} handleClearLogs={handleClearLogs} />
        </div>
        <RightNav />
      </div>
    </div>
  );
}

export default Equity;
