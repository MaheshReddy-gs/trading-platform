import React, { useState, useRef, memo, useEffect } from "react";
import filterIcon from "../assets/newFilter.png";
import "../styles.css";
import MarketIndex from "../components/MarketIndex";
import { TopNav } from "../components/TopNav";
import { ErrorContainer } from "../components/ErrorConsole";
import LeftNav from "../components/LeftNav";
import RightNav from "../components/RightNav";
import { useSelector, useDispatch } from "react-redux";
import { setBrokers } from "../store/slices/broker";
import { setAllSeq } from "../store/slices/colSeq";
import { setAllVis } from "../store/slices/colVis";

function Holdings() {
  const errorContainerRef = useRef(null);
  const dispatch = useDispatch();
  const { collapsed } = useSelector((state) => state.collapseReducer);
  //error console
  const [msgs, setMsgs] = useState([]);
  const handleClearLogs = () => {
    if (msgs.length === 0) return; //guard clause
    setMsgs([]);
  };
  // error console
  const allSeqState = useSelector((state) => state.allSeqReducer);
  const allVisState = useSelector((state) => state.allVisReducer);

  const [holdingsColVis, setholdingsColVis] = useState(allVisState.holdingsVis);
  const holdingsCols = [
    "Action",
    "Exchange",
    "Symbol",
    "Avg Price",
    "Buy Value",
    "LTP",
    "Current Value",
    "P&L%",
    "Collateral Qty",
    "T1 Qty",
    "Cns Sell  Quantity",
    "User ID",
    "User Alias",
  ];

  const [holdingColsSelectedALL, setholdingColsSelectedALL] = useState(false);

  const holdingColSelectALL = () => {
    setholdingColsSelectedALL((prev) => !prev);
    holdingsCols.map((holdingsCol) => {
      setholdingsColVis((prev) => ({
        ...prev,
        [holdingsCol]: holdingColsSelectedALL,
      }));
    });
  };

  const [holdingsSeq, setholdingsSeq] = useState(allSeqState.holdingsSeq);

  useEffect(() => {
    setholdingsSeq(allSeqState.holdingsSeq);
    setholdingsColVis((prev) => {
      const colVis = {};
      Object.keys(holdingsColVis).map((col) => {
        if (allSeqState.holdingsSeq.includes(col)) {
          colVis[col] = true;
        } else {
          colVis[col] = false;
        }
      });
      // console.log("{...prev, ...colVis}", {...prev, ...colVis})
      return { ...colVis };
    });
  }, []);

  useEffect(() => {
    dispatch(
      setAllVis({
        ...allVisState,
        holdingsVis: holdingsColVis,
      }),
    );
    if (new Set(Object.values(holdingsColVis)).size === 1) {
      if (Object.values(holdingsColVis).includes(true)) {
        setholdingsSeq(holdingsCols);
      } else {
        setholdingsSeq([]);
      }
    }
  }, [holdingsColVis]);

  useEffect(() => {
    // console.log("userProfSeq", userProfSeq)
    dispatch(
      setAllSeq({
        ...allSeqState,
        holdingsSeq: holdingsSeq,
      }),
    );
  }, [holdingsSeq]);

  const holdingsTH = {
    Action: holdingsColVis["Action"] && (
      <th>
        <div>
          <small>Action</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-35px",
            }}
            onClick={() => {
              // setShowSelectBox((prev) => !prev);
            }}
          />
        </div>
        {/* {showSelectBox && (
          <div>
            <select
              type="text"
              value={enabledFilter}
              onChange={handleEnabledFilterChange}
              style={{
                padding: "0.1rem 0.3rem",
                width: "100%",
                margin: "1px",
              }}
            >
              <option value="">All</option>
              <option value="checked">checked</option>
              <option value="unchecked">unchecked</option>
            </select>
          </div>
        )} */}
      </th>
    ),
    Exchange: holdingsColVis["Exchange"] && (
      <th>
        <div>
          <small>Exchange</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-30px",
            }}
          />
        </div>
      </th>
    ),
    Symbol: holdingsColVis["Symbol"] && (
      <th>
        <div>
          <small> Symbol</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-20px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
        {/* {showSearchfyersclientId && (
          <div className="Filter-popup">
            <form id="filter-form-user" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllForfyersclientId}
                    onChange={handleSelectAllForFyersClientId}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDatafyersclientId.map((fyersclientId, index) => {
                    return (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "15px",
                          }}
                          checked={fyersclientIdSelected.includes(
                            fyersclientId.toLowerCase(),
                          )}
                          onChange={() =>
                            handleCheckboxChangefyersclient(
                              fyersclientId.toLowerCase(),
                            )
                          }
                        />
                        <label>{fyersclientId}</label>
                      </div>
                    );
                  })}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>ok</button>
              <button
                onClick={() => setShowSearchfyersclientId((prev) => !prev)}
              >
                Cancel
              </button>
            </div>
          </div>
        )} */}
      </th>
    ),
    "Avg Price": holdingsColVis["Avg Price"] && (
      <th>
        <div>
          <small>Avg Price</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-35px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
        {/* {showSearchMTM && (
          <div className="Filter-popup">
            <form id="filter-form-mtm" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllMTM}
                    onChange={handleSelectAllForMTM}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMTM.map((mtm, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={mtmSelected.includes(mtm)}
                        onChange={() => handleCheckboxChangeMTM(mtm)}
                      />
                      <label>{mtm}</label>
                    </div>
                  ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>ok</button>
              <button onClick={() => setShowSearchMTM((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )} */}
      </th>
    ),
    "Buy Value": holdingsColVis["Buy Value"] && (
      <th>
        <div>
          <small>Buy Value</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-35px",
            }}
            onClick={() => {
              // setShowSearchMTM((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    LTP: holdingsColVis["LTP"] && (
      <th>
        <div>
          <small>LTP</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-25px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "Current Value": holdingsColVis["Current Value"] && (
      <th>
        <div>
          <small>Current Value</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-30px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "P&L%": holdingsColVis["P&L%"] && (
      <th>
        <div>
          <small>P&L%</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-25px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "Collateral Qty": holdingsColVis["Collateral Qty"] && (
      <th>
        <div>
          <small>Collateral Qty</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "T1 Qty": holdingsColVis["T1 Qty"] && (
      <th>
        <div>
          <small>T1 Qty</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-30px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "Cns Sell  Quantity": holdingsColVis["Cns Sell  Quantity"] && (
      <th>
        <div>
          <small>Cns Sell Quantity</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "User ID": holdingsColVis["User ID"] && (
      <th>
        <div>
          <small>User ID</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-25px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "User Alias": holdingsColVis["User Alias"] && (
      <th>
        <div>
          <small>User Alias</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-35px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
  };

  const [orderBook, setorderBook] = useState([
    {
      clientId: "",
      exchOrdId: "",
      exchange: "",
      id: "",
      instrument: "",
      message: "",
      orderDateTime: "",
      qty: "",
      side: "",
      status: "",
      symbol: "",
      tradedPrice: "",
    },
  ]);

  return (
    <div>
      <MarketIndex />
      <div className="main-section">
        <LeftNav />

        <div className="middle-main-container">
          <TopNav
            pageCols={holdingsCols}
            colVis={holdingsColVis}
            setColVis={setholdingsColVis}
            colsSelectedAll={holdingColsSelectedALL}
            setColsSelectedALL={setholdingColsSelectedALL}
            selectAll={holdingColSelectALL}
            setSeq={setholdingsSeq}
          />
          <div
            className="main-table"
            style={{ overflow: "auto", height: "92%" }}
            // ref={tableRef}
          >
            <table className="orderflowtable">
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 20,
                }}
              >
                {holdingsSeq.map((colName, index) => {
                  return (
                    <React.Fragment key={index}>
                      {holdingsTH[colName]}
                    </React.Fragment>
                  );
                })}
              </thead>
              <tbody className="tabletbody">
                {orderBook.map((order, index) => {
                  const holdingsTD = {
                    Action: holdingsColVis["Action"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Exchange: holdingsColVis["Exchange"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Symbol: holdingsColVis["Symbol"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Avg Price": holdingsColVis["Avg Price"] && (
                      <td>
                        <input
                          type="text"
                          style={{
                            disabled: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "Buy Value": holdingsColVis["Buy Value"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    LTP: holdingsColVis["LTP"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Current Value": holdingsColVis["Current Value"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "P&L%": holdingsColVis["P&L%"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Collateral Qty": holdingsColVis["Collateral Qty"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "T1 Qty": holdingsColVis["T1 Qty"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Cns Sell  Quantity": holdingsColVis[
                      "Cns Sell  Quantity"
                    ] && (
                      <td>
                        <input
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "User ID": holdingsColVis["User ID"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "User Alias": holdingsColVis["User Alias"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disabled: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                  };
                  return (
                    <tr key={index}>
                      {holdingsSeq.map((colName, index) => {
                        return (
                          <React.Fragment key={index}>
                            {holdingsTD[colName]}
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="add_collapse">
            <button className="hiddenbutton button">Add</button>
            <button
              style={{ zIndex: "0" }}
              onClick={() => {
                errorContainerRef.current.toggleCollapse();
              }}
              className="button"
              id="collapse"
            >
              {collapsed ? "Expand" : "Collapse"}
            </button>
          </div>

          <ErrorContainer
            ref={errorContainerRef}
            msgs={msgs}
            handleClearLogs={handleClearLogs}
          />
        </div>
        <RightNav />
      </div>
    </div>
  );
}

export default Holdings;
