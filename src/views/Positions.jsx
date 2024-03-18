import React, { useState, useRef, memo, useEffect } from "react";
import filterIcon from "../assets/newFilter.png";
import "../styles.css";
import MarketIndex from "../components/MarketIndex";
import { TopNav } from "../components/TopNav";
import { ErrorContainer } from "../components/ErrorConsole";
import LeftNav from "../components/LeftNav";
import RightNav from "../components/RightNav";
import { useSelector, useDispatch } from "react-redux";
import { setAllSeq } from "../store/slices/colSeq";
import { setAllVis } from "../store/slices/colVis";
import { setPositions } from "../store/slices/position";

function Positions() {
  const tableRef = useRef(null);
  const errorContainerRef = useRef(null);
  const dispatch = useDispatch();
  // Error Message start
  const { collapsed } = useSelector((state) => state.collapseReducer);
  const [ msgs, setMsgs ] = useState([]);
  const handleClearLogs = () => {
    if (msgs.length === 0) return; //guard clause
    setMsgs([]);
  };

  const allSeqState = useSelector((state) => state.allSeqReducer);
  const allVisState = useSelector((state) => state.allVisReducer);
  // Error Message end

  // const [ netPositions, setPosition ] = useState([
  //   {
  //     productType: "",
  //     exchange: "",
  //     symbol: "",
  //     netQty: "",
  //     ltp: "",
  //     pl: "",
  //     buyQty: "",
  //     buyAvg: "",
  //     buyVal: "",
  //     cfSellQty: "",
  //     sellAvg: "",
  //     sellVal: "",
  //     realized_profit: "",
  //     unrealized_profit: "",
  //   },
  // ]);
  // useEffect(() => {
  //   if (netPositions.length === 0) {
  //     setPosition([
  //       {
  //         productType: "",
  //         exchange: "",
  //         symbol: "",
  //         netQty: "",
  //         ltp: "",
  //         pl: "",
  //         buyQty: "",
  //         buyAvg: "",
  //         buyVal: "",
  //         cfSellQty: "",
  //         sellAvg: "",
  //         sellVal: "",
  //         realized_profit: "",
  //         unrealized_profit: "",
  //       },
  //     ]);
  //   }
  // }, [ netPositions ]);

  const { positions: position } = useSelector((state) => state.positionReducer);
  useEffect(() => {
    if (position.length === 0) {
      dispatch(
        setPositions({
          positions: [
            {
              clientId: "",
              productType: "",
              exchange: "",
              symbol: "",
              netQty: "",
              ltp: "",
              pl: "",
              buyQty: "",
              buyAvg: "",
              buyVal: "",
              cfSellQty: "",
              sellAvg: "",
              sellVal: "",
              realized_profit: "",
              unrealized_profit: "",
            },
          ],
        }),
      );
    }
  }, [ position ]);
  // console.log(position, "position");

  const [ PositionColVis, setPositionColVis ] = useState(
    allVisState.positionsVis,
  );
  const positionCols = [
    "Action",
    "User ID",
    "Product",
    "Exchange",
    "Symbol",
    "Net Qty",
    "LTP",
    "P&L",
    "P&L%",
    "Buy Qty",
    "Buy Avg Price",
    "Buy Value",
    "Sell Qty",
    "Sell Avg Price",
    "Sell Value",
    "Carry FWD Qty",
    "Realized Profit",
    "Unrealized profit",
    "User Alias",
  ];

  const [ positionColsSelectedALL, setpositionColsSelectedALL ] = useState(false);

  const positionColSelectALL = () => {
    setpositionColsSelectedALL((prev) => !prev);
    positionCols.map((positionCol) => {
      setPositionColVis((prev) => ({
        ...prev,
        [ positionCol ]: positionColsSelectedALL,
      }));
    });
  };

  const [ positionsSeq, setpositionsSeq ] = useState(allSeqState.positionsSeq);

  useEffect(() => {
    setpositionsSeq(allSeqState.positionsSeq);
    setPositionColVis((prev) => {
      const colVis = {};
      Object.keys(PositionColVis).map((col) => {
        if (allSeqState.positionsSeq.includes(col)) {
          colVis[ col ] = true;
        } else {
          colVis[ col ] = false;
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
        positionsVis: PositionColVis,
      }),
    );
    if (new Set(Object.values(PositionColVis)).size === 1) {
      if (Object.values(PositionColVis).includes(true)) {
        setpositionsSeq(positionCols);
      } else {
        setpositionsSeq([]);
      }
    }
  }, [ PositionColVis ]);

  useEffect(() => {
    // console.log("userProfSeq", userProfSeq)
    dispatch(
      setAllSeq({
        ...allSeqState,
        positionsSeq: positionsSeq,
      }),
    );
  }, [ positionsSeq ]);

  const [ showSelectBox, setShowSelectBox ] = useState(false);

  const positionsTH = {
    Action: PositionColVis[ "Action" ] && (
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
    "User ID": PositionColVis[ "User ID" ] && (
      <th>
        <div>
          <small>User ID</small>
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
    Product: PositionColVis[ "Product" ] && (
      <th>
        <div>
          <small>Product</small>
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
    Exchange: PositionColVis[ "Exchange" ] && (
      <th>
        <div>
          <small>Exchange</small>
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
    Symbol: PositionColVis[ "Symbol" ] && (
      <th>
        <div>
          <small>Symbol</small>
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
    "Net Qty": PositionColVis[ "Net Qty" ] && (
      <th>
        <div>
          <small>Net Qty</small>
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
    LTP: PositionColVis[ "LTP" ] && (
      <th>
        <div>
          <small>LTP</small>
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
    "P&L": PositionColVis[ "P&L" ] && (
      <th>
        <div>
          <small>P&L</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-25px",
            }}
          />
        </div>
      </th>
    ),
    "P&L%": PositionColVis[ "P&L%" ] && (
      <th>
        <div>
          <small>P&L%</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
          />
        </div>
      </th>
    ),
    "Buy Qty": PositionColVis[ "Buy Qty" ] && (
      <th>
        <div>
          <small>Buy Qty</small>
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
    "Buy Avg Price": PositionColVis[ "Buy Avg Price" ] && (
      <th>
        <div>
          <small>Buy Avg Price</small>
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
    "Buy Value": PositionColVis[ "Buy Value" ] && (
      <th>
        <div>
          <small>Buy Value</small>
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
    "Sell Qty": PositionColVis[ "Sell Qty" ] && (
      <th>
        <div>
          <small>Sell Qty</small>
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
    "Sell Avg Price": PositionColVis[ "Sell Avg Price" ] && (
      <th>
        <div>
          <small>Sell Avg Price</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-15px",
            }}
          />
        </div>
        {/* {showSearchSqOffTime && (
          <div className="Filter-popup">
            <form
              id="filter-form-sqOffTime"
              className="Filter-inputs-container"
            >
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllSqOffTime}
                    onChange={handleSelectAllForSqOffTime}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataSqOffTime.map((sqOffTime, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={sqOffTimeSelected.includes(
                          sqOffTime.toLowerCase(),
                        )}
                        onChange={() =>
                          handleCheckboxChangeSqOffTime(sqOffTime.toLowerCase())
                        }
                      />
                      <label>{sqOffTime}</label>
                    </div>
                  ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>ok</button>
              <button onClick={() => setShowSearchSqOffTime((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )} */}
      </th>
    ),
    "Sell Value": PositionColVis[ "Sell Value" ] && (
      <th>
        <div>
          <small>Sell Value</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-20px",
            }}
          />
        </div>
      </th>
    ),
    "Carry FWD Qty": PositionColVis[ "Carry FWD Qty" ] && (
      <th>
        <div>
          <small>Carry FWD Qty</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
          />
        </div>
      </th>
    ),
    "Realized Profit": PositionColVis[ "Realized Profit" ] && (
      <th>
        <div>
          <small>Realized Profit</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-20px",
            }}
          />
        </div>
      </th>
    ),
    "Unrealized profit": PositionColVis[ "Unrealized profit" ] && (
      <th>
        <div>
          <small>Unrealized profit</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              // setShowSearchMaxProfit((prev) => !prev);
            }}
          />
        </div>
        {/* {showSearchMaxProfit && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllMaxProfit}
                    onChange={handleSelectAllForMaxProfit}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMaxProfit.map((maxProfit, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={maxProfitSelected.includes(maxProfit)}
                        onChange={() =>
                          handleCheckBoxChangeForMaxProfit(maxProfit)
                        }
                      />
                      <label>{maxProfit}</label>
                    </div>
                  ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>ok</button>
              <button onClick={() => setShowSearchMaxProfit((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )} */}
      </th>
    ),
    "User Alias": PositionColVis[ "User Alias" ] && (
      <th>
        <div>
          <small>User Alias</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              // setShowSearchMaxProfit((prev) => !prev);
            }}
          />
        </div>
        {/* {showSearchMaxProfit && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllMaxProfit}
                    onChange={handleSelectAllForMaxProfit}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMaxProfit.map((maxProfit, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={maxProfitSelected.includes(maxProfit)}
                        onChange={() =>
                          handleCheckBoxChangeForMaxProfit(maxProfit)
                        }
                      />
                      <label>{maxProfit}</label>
                    </div>
                  ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>ok</button>
              <button onClick={() => setShowSearchMaxProfit((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )} */}
      </th>
    ),
  };

  return (
    <div>
      <MarketIndex />
      <div className="main-section">
        <LeftNav />

        <div className="middle-main-container">
          <TopNav
            pageCols={positionCols}
            colVis={PositionColVis}
            setColVis={setPositionColVis}
            colsSelectedAll={positionColsSelectedALL}
            setColsSelectedALL={setpositionColsSelectedALL}
            selectAll={positionColSelectALL}
            setSeq={setpositionsSeq}
          />
          <div
            className="main-table"
            style={{ overflow: "auto", height: "92%" }}
            ref={tableRef}
          >
            <table className="orderflowtable">
              <thead>
                {positionsSeq.map((colName, index) => {
                  return (
                    <React.Fragment key={index}>
                      {positionsTH[ colName ]}
                    </React.Fragment>
                  );
                })}
              </thead>
              <tbody className="tabletbody">
                {/* {console.log(position, "positionsTD")} */}
                {position.map((pos, index) => {
                  const positionsTD = {
                    Action: PositionColVis[ "Action" ] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "User ID": PositionColVis[ "User ID" ] && (
                      <td>
                        <input
                          value={pos[ "User ID" ]}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Product: PositionColVis[ "Product" ] && (
                      <td>
                        <input
                          value={pos.Product}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Exchange: PositionColVis[ "Exchange" ] && (
                      <td>
                        <input
                          value={
                            pos.Exchange === 10
                              ? "NSE"
                              : pos.Exchange === 11
                                ? "MCX"
                                : pos.Exchange === 12
                                  ? "BSE"
                                  : ""
                          }
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    Symbol: PositionColVis[ "Symbol" ] && (
                      <td>
                        <input
                          type="text"
                          value={pos.Symbol}
                          style={{
                            disable: "none",
                            padding: "6px",
                            width: "210px",
                          }}
                        />
                      </td>
                    ),
                    "Net Qty": PositionColVis[ "Net Qty" ] && (
                      <td>
                        <input
                          value={pos[ "Net Qty" ]}
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    LTP: PositionColVis[ "LTP" ] && (
                      <td>
                        <input
                          value={pos.LTP}
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "P&L": PositionColVis[ "P&L" ] && (
                      <td>
                        <input
                          value={
                            typeof pos[ "P&L" ] === "number"
                              ? Number.isInteger(pos.pl)
                                ? pos[ "P&L" ]
                                : pos[ "P&L" ].toFixed(2)
                              : ""
                          } // Conditionally round to two decimal points if position.pl is a number
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "P&L%": PositionColVis[ "P&L%" ] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Buy Qty": PositionColVis[ "Buy Qty" ] && (
                      <td>
                        <input
                          type="text"
                          value={
                            typeof pos[ "Buy Qty" ] === "number"
                              ? Number.isInteger(pos.buyQty)
                                ? pos[ "Buy Qty" ]
                                : pos[ "Buy Qty" ].toFixed(2)
                              : ""
                          } // Conditionally round to two decimal points if position.buyQty is a number
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "Buy Avg Price": PositionColVis[ "Buy Avg Price" ] && (
                      <td>
                        <input
                          value={
                            typeof pos[ "Buy Avg Price" ] === "number"
                              ? Number.isInteger(pos.buyAvg)
                                ? pos[ "Buy Avg Price" ]
                                : pos[ "Buy Avg Price" ].toFixed(2)
                              : ""
                          }
                          type="text"
                          style={{
                            disable: "none",
                            textAlign: "center",
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    "Buy Value": PositionColVis[ "Buy Value" ] && (
                      <td>
                        <input
                          type="text"
                          value={
                            typeof pos[ "Buy Value" ] === "number"
                              ? Number.isInteger(pos.buyVal)
                                ? pos[ "Buy Value" ]
                                : pos[ "Buy Value" ].toFixed(2)
                              : ""
                          }
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "Sell Qty": PositionColVis[ "Sell Qty" ] && (
                      <td>
                        <input
                          value={
                            typeof pos[ "Sell Qty" ] === "number"
                              ? Number.isInteger(pos.cfSellQty)
                                ? pos[ "Sell Qty" ]
                                : pos[ "Sell Qty" ].toFixed(2)
                              : ""
                          }
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "Sell Avg Price": PositionColVis[ "Sell Avg Price" ] && (
                      <td>
                        <input
                          type="number"
                          value={
                            typeof pos[ "Sell Avg Price" ] === "number"
                              ? pos[ "Sell Avg Price" ].toFixed(2)
                              : ""
                          }
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Sell Value": PositionColVis[ "Sell Value" ] && (
                      <td>
                        <input
                          type="number"
                          value={
                            typeof pos[ "Sell Value" ] === "number"
                              ? pos[ "Sell Value" ].toFixed(2)
                              : ""
                          }
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "Carry FWD Qty": PositionColVis[ "Carry FWD Qty" ] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Realized Profit": PositionColVis[ "Realized Profit" ] && (
                      <td>
                        <input
                          value={
                            typeof pos[ "Realized Profit" ] === "number"
                              ? pos[ "Realized Profit" ].toFixed(2)
                              : ""
                          }
                          type="number"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Unrealized profit": PositionColVis[
                      "Unrealized profit"
                    ] && (
                        <td>
                          <input
                            type="number"
                            value={
                              typeof pos[ "Unrealized profit" ] === "number"
                                ? pos[ "Unrealized profit" ].toFixed(2)
                                : ""
                            }
                            style={{
                              disable: "none",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                      ),
                    "User Alias": PositionColVis[ "User Alias" ] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                  };
                  return (
                    <tr key={index}>
                      {positionsSeq.map((colName, index) => {
                        return (
                          <React.Fragment key={index}>
                            {positionsTD[ colName ]}
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
            handleClearLogs={handleClearLogs}
          />
        </div>
        <RightNav />
      </div>
    </div>
  );
}
export default Positions;
import React, { useState, useRef, memo, useEffect } from "react";
import filterIcon from "../assets/newFilter.png";
import "../styles.css";
import MarketIndex from "../components/MarketIndex";
import { TopNav } from "../components/TopNav";
import { ErrorContainer } from "../components/ErrorConsole";
import LeftNav from "../components/LeftNav";
import RightNav from "../components/RightNav";
import { useSelector, useDispatch } from "react-redux";
import { setAllSeq } from "../store/slices/colSeq";
import { setAllVis } from "../store/slices/colVis";
import { setPositions } from "../store/slices/position";

function Positions() {
  const tableRef = useRef(null);
  const errorContainerRef = useRef(null);
  const dispatch = useDispatch();
  // Error Message start
  const { collapsed } = useSelector((state) => state.collapseReducer);
  const [ msgs, setMsgs ] = useState([]);
  const handleClearLogs = () => {
    if (msgs.length === 0) return; //guard clause
    setMsgs([]);
  };

  const allSeqState = useSelector((state) => state.allSeqReducer);
  const allVisState = useSelector((state) => state.allVisReducer);
  // Error Message end

  // const [ netPositions, setPosition ] = useState([
  //   {
  //     productType: "",
  //     exchange: "",
  //     symbol: "",
  //     netQty: "",
  //     ltp: "",
  //     pl: "",
  //     buyQty: "",
  //     buyAvg: "",
  //     buyVal: "",
  //     cfSellQty: "",
  //     sellAvg: "",
  //     sellVal: "",
  //     realized_profit: "",
  //     unrealized_profit: "",
  //   },
  // ]);
  // useEffect(() => {
  //   if (netPositions.length === 0) {
  //     setPosition([
  //       {
  //         productType: "",
  //         exchange: "",
  //         symbol: "",
  //         netQty: "",
  //         ltp: "",
  //         pl: "",
  //         buyQty: "",
  //         buyAvg: "",
  //         buyVal: "",
  //         cfSellQty: "",
  //         sellAvg: "",
  //         sellVal: "",
  //         realized_profit: "",
  //         unrealized_profit: "",
  //       },
  //     ]);
  //   }
  // }, [ netPositions ]);

  const { positions: position } = useSelector((state) => state.positionReducer);
  useEffect(() => {
    if (position.length === 0) {
      dispatch(
        setPositions({
          positions: [
            {
              clientId: "",
              productType: "",
              exchange: "",
              symbol: "",
              netQty: "",
              ltp: "",
              pl: "",
              buyQty: "",
              buyAvg: "",
              buyVal: "",
              cfSellQty: "",
              sellAvg: "",
              sellVal: "",
              realized_profit: "",
              unrealized_profit: "",
            },
          ],
        }),
      );
    }
  }, [ position ]);
  // console.log(position, "position");

  const [ PositionColVis, setPositionColVis ] = useState(
    allVisState.positionsVis,
  );
  const positionCols = [
    "Action",
    "User ID",
    "Product",
    "Exchange",
    "Symbol",
    "Net Qty",
    "LTP",
    "P&L",
    "P&L%",
    "Buy Qty",
    "Buy Avg Price",
    "Buy Value",
    "Sell Qty",
    "Sell Avg Price",
    "Sell Value",
    "Carry FWD Qty",
    "Realized Profit",
    "Unrealized profit",
    "User Alias",
  ];

  const [ positionColsSelectedALL, setpositionColsSelectedALL ] = useState(false);

  const positionColSelectALL = () => {
    setpositionColsSelectedALL((prev) => !prev);
    positionCols.map((positionCol) => {
      setPositionColVis((prev) => ({
        ...prev,
        [ positionCol ]: positionColsSelectedALL,
      }));
    });
  };

  const [ positionsSeq, setpositionsSeq ] = useState(allSeqState.positionsSeq);

  useEffect(() => {
    setpositionsSeq(allSeqState.positionsSeq);
    setPositionColVis((prev) => {
      const colVis = {};
      Object.keys(PositionColVis).map((col) => {
        if (allSeqState.positionsSeq.includes(col)) {
          colVis[ col ] = true;
        } else {
          colVis[ col ] = false;
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
        positionsVis: PositionColVis,
      }),
    );
    if (new Set(Object.values(PositionColVis)).size === 1) {
      if (Object.values(PositionColVis).includes(true)) {
        setpositionsSeq(positionCols);
      } else {
        setpositionsSeq([]);
      }
    }
  }, [ PositionColVis ]);

  useEffect(() => {
    // console.log("userProfSeq", userProfSeq)
    dispatch(
      setAllSeq({
        ...allSeqState,
        positionsSeq: positionsSeq,
      }),
    );
  }, [ positionsSeq ]);

  const [ showSelectBox, setShowSelectBox ] = useState(false);

  const positionsTH = {
    Action: PositionColVis[ "Action" ] && (
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
    "User ID": PositionColVis[ "User ID" ] && (
      <th>
        <div>
          <small>User ID</small>
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
    Product: PositionColVis[ "Product" ] && (
      <th>
        <div>
          <small>Product</small>
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
    Exchange: PositionColVis[ "Exchange" ] && (
      <th>
        <div>
          <small>Exchange</small>
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
    Symbol: PositionColVis[ "Symbol" ] && (
      <th>
        <div>
          <small>Symbol</small>
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
    "Net Qty": PositionColVis[ "Net Qty" ] && (
      <th>
        <div>
          <small>Net Qty</small>
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
    LTP: PositionColVis[ "LTP" ] && (
      <th>
        <div>
          <small>LTP</small>
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
    "P&L": PositionColVis[ "P&L" ] && (
      <th>
        <div>
          <small>P&L</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-25px",
            }}
          />
        </div>
      </th>
    ),
    "P&L%": PositionColVis[ "P&L%" ] && (
      <th>
        <div>
          <small>P&L%</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
          />
        </div>
      </th>
    ),
    "Buy Qty": PositionColVis[ "Buy Qty" ] && (
      <th>
        <div>
          <small>Buy Qty</small>
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
    "Buy Avg Price": PositionColVis[ "Buy Avg Price" ] && (
      <th>
        <div>
          <small>Buy Avg Price</small>
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
    "Buy Value": PositionColVis[ "Buy Value" ] && (
      <th>
        <div>
          <small>Buy Value</small>
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
    "Sell Qty": PositionColVis[ "Sell Qty" ] && (
      <th>
        <div>
          <small>Sell Qty</small>
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
    "Sell Avg Price": PositionColVis[ "Sell Avg Price" ] && (
      <th>
        <div>
          <small>Sell Avg Price</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-15px",
            }}
          />
        </div>
        {/* {showSearchSqOffTime && (
          <div className="Filter-popup">
            <form
              id="filter-form-sqOffTime"
              className="Filter-inputs-container"
            >
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllSqOffTime}
                    onChange={handleSelectAllForSqOffTime}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataSqOffTime.map((sqOffTime, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={sqOffTimeSelected.includes(
                          sqOffTime.toLowerCase(),
                        )}
                        onChange={() =>
                          handleCheckboxChangeSqOffTime(sqOffTime.toLowerCase())
                        }
                      />
                      <label>{sqOffTime}</label>
                    </div>
                  ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>ok</button>
              <button onClick={() => setShowSearchSqOffTime((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )} */}
      </th>
    ),
    "Sell Value": PositionColVis[ "Sell Value" ] && (
      <th>
        <div>
          <small>Sell Value</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-20px",
            }}
          />
        </div>
      </th>
    ),
    "Carry FWD Qty": PositionColVis[ "Carry FWD Qty" ] && (
      <th>
        <div>
          <small>Carry FWD Qty</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
          />
        </div>
      </th>
    ),
    "Realized Profit": PositionColVis[ "Realized Profit" ] && (
      <th>
        <div>
          <small>Realized Profit</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-20px",
            }}
          />
        </div>
      </th>
    ),
    "Unrealized profit": PositionColVis[ "Unrealized profit" ] && (
      <th>
        <div>
          <small>Unrealized profit</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              // setShowSearchMaxProfit((prev) => !prev);
            }}
          />
        </div>
        {/* {showSearchMaxProfit && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllMaxProfit}
                    onChange={handleSelectAllForMaxProfit}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMaxProfit.map((maxProfit, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={maxProfitSelected.includes(maxProfit)}
                        onChange={() =>
                          handleCheckBoxChangeForMaxProfit(maxProfit)
                        }
                      />
                      <label>{maxProfit}</label>
                    </div>
                  ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>ok</button>
              <button onClick={() => setShowSearchMaxProfit((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )} */}
      </th>
    ),
    "User Alias": PositionColVis[ "User Alias" ] && (
      <th>
        <div>
          <small>User Alias</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              // setShowSearchMaxProfit((prev) => !prev);
            }}
          />
        </div>
        {/* {showSearchMaxProfit && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllMaxProfit}
                    onChange={handleSelectAllForMaxProfit}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMaxProfit.map((maxProfit, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={maxProfitSelected.includes(maxProfit)}
                        onChange={() =>
                          handleCheckBoxChangeForMaxProfit(maxProfit)
                        }
                      />
                      <label>{maxProfit}</label>
                    </div>
                  ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>ok</button>
              <button onClick={() => setShowSearchMaxProfit((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )} */}
      </th>
    ),
  };

  return (
    <div>
      <MarketIndex />
      <div className="main-section">
        <LeftNav />

        <div className="middle-main-container">
          <TopNav
            pageCols={positionCols}
            colVis={PositionColVis}
            setColVis={setPositionColVis}
            colsSelectedAll={positionColsSelectedALL}
            setColsSelectedALL={setpositionColsSelectedALL}
            selectAll={positionColSelectALL}
            setSeq={setpositionsSeq}
          />
          <div
            className="main-table"
            style={{ overflow: "auto", height: "92%" }}
            ref={tableRef}
          >
            <table className="orderflowtable">
              <thead>
                {positionsSeq.map((colName, index) => {
                  return (
                    <React.Fragment key={index}>
                      {positionsTH[ colName ]}
                    </React.Fragment>
                  );
                })}
              </thead>
              <tbody className="tabletbody">
                {/* {console.log(position, "positionsTD")} */}
                {position.map((pos, index) => {
                  const positionsTD = {
                    Action: PositionColVis[ "Action" ] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "User ID": PositionColVis[ "User ID" ] && (
                      <td>
                        <input
                          value={pos[ "User ID" ]}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Product: PositionColVis[ "Product" ] && (
                      <td>
                        <input
                          value={pos.Product}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Exchange: PositionColVis[ "Exchange" ] && (
                      <td>
                        <input
                          value={
                            pos.Exchange === 10
                              ? "NSE"
                              : pos.Exchange === 11
                                ? "MCX"
                                : pos.Exchange === 12
                                  ? "BSE"
                                  : ""
                          }
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    Symbol: PositionColVis[ "Symbol" ] && (
                      <td>
                        <input
                          type="text"
                          value={pos.Symbol}
                          style={{
                            disable: "none",
                            padding: "6px",
                            width: "210px",
                          }}
                        />
                      </td>
                    ),
                    "Net Qty": PositionColVis[ "Net Qty" ] && (
                      <td>
                        <input
                          value={pos[ "Net Qty" ]}
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    LTP: PositionColVis[ "LTP" ] && (
                      <td>
                        <input
                          value={pos.LTP}
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "P&L": PositionColVis[ "P&L" ] && (
                      <td>
                        <input
                          value={
                            typeof pos[ "P&L" ] === "number"
                              ? Number.isInteger(pos.pl)
                                ? pos[ "P&L" ]
                                : pos[ "P&L" ].toFixed(2)
                              : ""
                          } // Conditionally round to two decimal points if position.pl is a number
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "P&L%": PositionColVis[ "P&L%" ] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Buy Qty": PositionColVis[ "Buy Qty" ] && (
                      <td>
                        <input
                          type="text"
                          value={
                            typeof pos[ "Buy Qty" ] === "number"
                              ? Number.isInteger(pos.buyQty)
                                ? pos[ "Buy Qty" ]
                                : pos[ "Buy Qty" ].toFixed(2)
                              : ""
                          } // Conditionally round to two decimal points if position.buyQty is a number
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "Buy Avg Price": PositionColVis[ "Buy Avg Price" ] && (
                      <td>
                        <input
                          value={
                            typeof pos[ "Buy Avg Price" ] === "number"
                              ? Number.isInteger(pos.buyAvg)
                                ? pos[ "Buy Avg Price" ]
                                : pos[ "Buy Avg Price" ].toFixed(2)
                              : ""
                          }
                          type="text"
                          style={{
                            disable: "none",
                            textAlign: "center",
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    "Buy Value": PositionColVis[ "Buy Value" ] && (
                      <td>
                        <input
                          type="text"
                          value={
                            typeof pos[ "Buy Value" ] === "number"
                              ? Number.isInteger(pos.buyVal)
                                ? pos[ "Buy Value" ]
                                : pos[ "Buy Value" ].toFixed(2)
                              : ""
                          }
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "Sell Qty": PositionColVis[ "Sell Qty" ] && (
                      <td>
                        <input
                          value={
                            typeof pos[ "Sell Qty" ] === "number"
                              ? Number.isInteger(pos.cfSellQty)
                                ? pos[ "Sell Qty" ]
                                : pos[ "Sell Qty" ].toFixed(2)
                              : ""
                          }
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "Sell Avg Price": PositionColVis[ "Sell Avg Price" ] && (
                      <td>
                        <input
                          type="number"
                          value={
                            typeof pos[ "Sell Avg Price" ] === "number"
                              ? pos[ "Sell Avg Price" ].toFixed(2)
                              : ""
                          }
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Sell Value": PositionColVis[ "Sell Value" ] && (
                      <td>
                        <input
                          type="number"
                          value={
                            typeof pos[ "Sell Value" ] === "number"
                              ? pos[ "Sell Value" ].toFixed(2)
                              : ""
                          }
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    "Carry FWD Qty": PositionColVis[ "Carry FWD Qty" ] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Realized Profit": PositionColVis[ "Realized Profit" ] && (
                      <td>
                        <input
                          value={
                            typeof pos[ "Realized Profit" ] === "number"
                              ? pos[ "Realized Profit" ].toFixed(2)
                              : ""
                          }
                          type="number"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Unrealized profit": PositionColVis[
                      "Unrealized profit"
                    ] && (
                        <td>
                          <input
                            type="number"
                            value={
                              typeof pos[ "Unrealized profit" ] === "number"
                                ? pos[ "Unrealized profit" ].toFixed(2)
                                : ""
                            }
                            style={{
                              disable: "none",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                      ),
                    "User Alias": PositionColVis[ "User Alias" ] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                  };
                  return (
                    <tr key={index}>
                      {positionsSeq.map((colName, index) => {
                        return (
                          <React.Fragment key={index}>
                            {positionsTD[ colName ]}
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
            handleClearLogs={handleClearLogs}
          />
        </div>
        <RightNav />
      </div>
    </div>
  );
}
export default Positions;
