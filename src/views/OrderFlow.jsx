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
import { setOrders } from "../store/slices/orderBook";

function OrderFlow() {
  const errorContainerRef = useRef(null);
  // error console
  const dispatch = useDispatch();
  const { collapsed } = useSelector((state) => state.collapseReducer);
  const [msgs, setMsgs] = useState([]);
  const handleClearLogs = () => {
    if (msgs.length === 0) return; //guard clause
    setMsgs([]);
  };
  // error console
  const allSeqState = useSelector((state) => state.allSeqReducer);
  const allVisState = useSelector((state) => state.allVisReducer);

  const [orderFlowColVis, setorderFlowColVis] = useState(
    allVisState.orderFlowVis,
  );
  const orderFlowCols = [
    "Action",
    "Client ID",
    "Stock Symbol",
    "Exchange",
    "Modify",
    "Order Time",
    "Trade ID",
    "Transaction",
    "Avg Execution Price",
    "Order Size",
    "Execution Quantity",
    "Trade Type",
    "Price",
    "Trigger Price",
    "Trigger Time",
    "Exchange Trade ID",
    "Instrument",
    "Trade Duration",
    "Trade Status",
    "Display Name",
    "Status Message",
    "Label",
  ];

  const [orderFlowColsSelectedALL, setorderFlowColsSelectedALL] =
    useState(false);

  const orderFlowColSelectALL = () => {
    setorderFlowColsSelectedALL((prev) => !prev);
    orderFlowCols.map((orderFlowCol) => {
      setorderFlowColVis((prev) => ({
        ...prev,
        [orderFlowCol]: orderFlowColsSelectedALL,
      }));
    });
  };

  const [orderFlowSeq, setorderFlowSeq] = useState(allSeqState.orderFlowSeq);

  useEffect(() => {
    setorderFlowSeq(allSeqState.orderFlowSeq);
    setorderFlowColVis((prev) => {
      const colVis = {};
      Object.keys(orderFlowColVis).map((col) => {
        if (allSeqState.orderFlowSeq.includes(col)) {
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
        orderFlowVis: orderFlowColVis,
      }),
    );
    if (new Set(Object.values(orderFlowColVis)).size === 1) {
      if (Object.values(orderFlowColVis).includes(true)) {
        setorderFlowSeq(orderFlowCols);
      } else {
        setorderFlowSeq([]);
      }
    }
  }, [orderFlowColVis]);

  useEffect(() => {
    // console.log("userProfSeq", userProfSeq)
    dispatch(
      setAllSeq({
        ...allSeqState,
        orderFlowSeq: orderFlowSeq,
      }),
    );
  }, [orderFlowSeq]);

  // const [ orderBook, setOrderBook ] = useState([
  //   {
  //     ch: "",
  //     chp: "",
  //     clientId: "",
  //     description: "",
  //     discloseQty: "",
  //     disclosedQty: "",
  //     dqQtyRem: "",
  //     ex_sym: "",
  //     exchOrdId: "",
  //     exchange: "",
  //     filledQty: "",
  //     fyToken: "",
  //     id: "",
  //     instrument: "",
  //     limitPrice: "",
  //     lp: "",
  //     message: "",
  //     offlineOrder: "",
  //     orderDateTime: "",
  //     orderNumStatus: "",
  //     orderValidity: "",
  //     pan: "",
  //     productType: "",
  //     qty: "",
  //     remainingQuantity: "",
  //     segment: "",
  //     side: "",
  //     slNo: "",
  //     source: "",
  //     status: "",
  //     stopPrice: "",
  //     symbol: "",
  //     tradedPrice: "",
  //     type: "",
  //   },
  // ]);

  const { orders: orderBook } = useSelector((state) => state.orderBookReducer);
  useEffect(() => {
    if (orderBook.length === 0) {
      dispatch(
        setOrders({
          orders: [
            {
              ch: "",
              chp: "",
              clientId: "",
              description: "",
              discloseQty: "",
              disclosedQty: "",
              dqQtyRem: "",
              ex_sym: "",
              exchOrdId: "",
              exchange: "",
              filledQty: "",
              fyToken: "",
              id: "",
              instrument: "",
              limitPrice: "",
              lp: "",
              message: "",
              offlineOrder: "",
              orderDateTime: "",
              orderNumStatus: "",
              orderValidity: "",
              pan: "",
              productType: "",
              qty: "",
              remainingQuantity: "",
              segment: "",
              side: "",
              slNo: "",
              source: "",
              status: "",
              stopPrice: "",
              symbol: "",
              tradedPrice: "",
              type: "",
            },
          ],
        }),
      );
    }
  }, [orderBook]);
  console.log(orderBook, "orderBook");

  const orderFlowTH = {
    Action: orderFlowColVis["Action"] && (
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
    "Client ID": orderFlowColVis["Client ID"] && (
      <th>
        <div>
          <small>Client ID</small>
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
    "Stock Symbol": orderFlowColVis["Stock Symbol"] && (
      <th>
        <div>
          <small>Stock Symbol</small>
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
    Exchange: orderFlowColVis["Exchange"] && (
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
    Modify: orderFlowColVis["Modify"] && (
      <th>
        <div>
          <small>Modify</small>
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
    "Order Time": orderFlowColVis["Order Time"] && (
      <th>
        <div>
          <small>Order Time</small>
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
    "Trade ID": orderFlowColVis["Trade ID"] && (
      <th>
        <div>
          <small>Trade ID</small>
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
    Transaction: orderFlowColVis["Transaction"] && (
      <th>
        <div>
          <small>Transaction</small>
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
    "Avg Execution Price": orderFlowColVis["Avg Execution Price"] && (
      <th>
        <div>
          <small>Avg Execution Price</small>
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
    "Order Size": orderFlowColVis["Order Size"] && (
      <th>
        <div>
          <small>Order Size</small>
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
    "Execution Quantity": orderFlowColVis["Execution Quantity"] && (
      <th>
        <div>
          <small>Execution Quantity</small>
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
    "Trade Type": orderFlowColVis["Trade Type"] && (
      <th>
        <div>
          <small>Trade Type</small>
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
    Price: orderFlowColVis["Price"] && (
      <th>
        <div>
          <small>Price</small>
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
    "Trigger Price": orderFlowColVis["Trigger Price"] && (
      <th>
        <div>
          <small>Trigger Price</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-15px",
            }}
            onClick={() => {
              // setShowSearchfyersclientId((prev) => !prev);
            }}
          />
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
                            handleCheckboxChangeSqOffTime(
                              sqOffTime.toLowerCase(),
                            )
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
        </div>
      </th>
    ),
    "Trigger Time": orderFlowColVis["Trigger Time"] && (
      <th>
        <div>
          <small>Trigger Time</small>
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
    "Exchange Trade ID": orderFlowColVis["Exchange Trade ID"] && (
      <th>
        <div>
          <small>Exchange Trade ID</small>
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
    Instrument: orderFlowColVis["Instrument"] && (
      <th>
        <div>
          <small>Instrument</small>
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
    "Trade Duration": orderFlowColVis["Trade Duration"] && (
      <th>
        <div>
          <small>Trade Duration</small>
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
        </div>
      </th>
    ),
    "Trade Status": orderFlowColVis["Trade Status"] && (
      <th>
        <div>
          <small>Trade Status</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setShowSearchMaxLoss((prev) => !prev);
            }}
          />
          {/* {showSearchMaxLoss && (
            <div className="Filter-popup">
              <form id="filter-form" className="Filter-inputs-container">
                <ul>
                  <li>
                    <input
                      type="checkbox"
                      style={{ width: "12px" }}
                      checked={selectAllMaxLoss}
                      onChange={handleSelectAllForMaxLoss}
                    />
                    Select all
                  </li>
                  <li>
                    {uniqueDataMaxLoss.map((maxLoss, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={maxLossSelected.includes(maxLoss)}
                          onChange={() =>
                            handleCheckBoxChangeForMaxLoss(maxLoss)
                          }
                        />
                        <label>{maxLoss}</label>
                      </div>
                    ))}
                  </li>
                </ul>
              </form>
              <div className="filter-popup-footer">
                <button onClick={handleOkClick}>ok</button>
                <button onClick={() => setShowSearchMaxLoss((prev) => !prev)}>
                  Cancel
                </button>
              </div>
            </div>
          )} */}
        </div>
      </th>
    ),
    "Display Name": orderFlowColVis["Display Name"] && (
      <th>
        <div>
          <small>Display Name</small>
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
    "Status Message": orderFlowColVis["Status Message"] && (
      <th>
        <div>
          <small>Status Message</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setShowSearchQtyByExposure((prev) => !prev);
            }}
          />
          {/* {showSearchQtyByExposure && (
            <div className="Filter-popup">
              <form
                id="filter-form-qty-by-exposure"
                className="Filter-inputs-container"
              >
                <ul>
                  <li>
                    <input
                      type="checkbox"
                      style={{ width: "12px" }}
                      checked={selectAllQtyByExposure}
                      onChange={handleSelectAllForQtyByExposure}
                    />
                    Select all
                  </li>
                  <li>
                    {uniqueDataQtyByExposure.map((qtyByExposure, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={qtyByExposureSelected.includes(
                            qtyByExposure.toString(),
                          )}
                          onChange={() =>
                            handleCheckboxChangeQtyByExposure(
                              qtyByExposure.toString(),
                            )
                          }
                        />
                        <label>{qtyByExposure}</label>
                      </div>
                    ))}
                  </li>
                </ul>
              </form>
              <div className="filter-popup-footer">
                <button onClick={handleOkClick}>ok</button>
                <button
                  onClick={() => setShowSearchQtyByExposure((prev) => !prev)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )} */}
        </div>
      </th>
    ),
    Label: orderFlowColVis["Label"] && (
      <th>
        <div>
          <small>Label</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-35px",
            }}
          />
        </div>
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
            pageCols={orderFlowCols}
            colsSelectedAll={orderFlowColsSelectedALL}
            setColsSelectedALL={setorderFlowColsSelectedALL}
            selectAll={orderFlowColSelectALL}
            colVis={orderFlowColVis}
            setColVis={setorderFlowColVis}
            setSeq={setorderFlowSeq}
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
                {orderFlowSeq.map((colName, index) => {
                  return (
                    <React.Fragment key={index}>
                      {orderFlowTH[colName]}
                    </React.Fragment>
                  );
                })}
              </thead>
              <tbody className="tabletbody">
                {orderBook.map((order, index) => {
                  const orderFlowTD = {
                    Action: orderFlowColVis["Action"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Client ID": orderFlowColVis["Client ID"] && (
                      <td>
                        <input
                          value={order["Client ID"]}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Stock Symbol": orderFlowColVis["Stock Symbol"] && (
                      <td>
                        <input
                          value={order["Stock Symbol"]}
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            width: "210px",
                          }}
                        />
                      </td>
                    ),
                    Exchange: orderFlowColVis["Exchange"] && (
                      <td>
                        <input
                          value={order["Exchange"]}
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    ),
                    Modify: orderFlowColVis["Modify"] && (
                      <td>
                        <input
                          value={order.Modify}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Order Time": orderFlowColVis["Order Time"] && (
                      <td>
                        <input
                          value={order["Order Time"]}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Trade ID": orderFlowColVis["Trade ID"] && (
                      <td>
                        <input
                          value={order["Trade ID"]}
                          type="number"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Transaction: orderFlowColVis["Transaction"] && (
                      <td>
                        <input
                          value={order.Transaction}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Avg Execution Price": orderFlowColVis[
                      "Avg Execution Price"
                    ] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px 15px" }}
                        />
                      </td>
                    ),
                    "Order Size": orderFlowColVis["Order Size"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Execution Quantity": orderFlowColVis[
                      "Execution Quantity"
                    ] && (
                      <td>
                        <input
                          value={order["Execution Quantity"]}
                          type="number"
                          style={{ disable: "none", padding: "6px 15px" }}
                        />
                      </td>
                    ),

                    "Trade Type": orderFlowColVis["Trade Type"] && (
                      <td>
                        <input
                          value={
                            order["Trade Type"] === 1
                              ? "BUY"
                              : order["Trade Type"] === -1
                                ? "SELL"
                                : ""
                          }
                          type="text"
                          disabled="disabled"
                          style={{ padding: "6px" }}
                        />
                      </td>
                    ),

                    Price: orderFlowColVis["Price"] && (
                      <td>
                        <input
                          value={
                            Number.isInteger(order["Price"])
                              ? order["Price"]
                              : order["Price"]
                          }
                          type="number"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Trigger Price": orderFlowColVis["Trigger Price"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Trigger Time": orderFlowColVis["Trigger Time"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Exchange Trade ID": orderFlowColVis[
                      "Exchange Trade ID"
                    ] && (
                      <td>
                        <input
                          value={order["Exchange Trade ID"]}
                          type="number"
                          style={{ disable: "none", padding: "6px 15px" }}
                        />
                      </td>
                    ),
                    Instrument: orderFlowColVis["Instrument"] && (
                      <td>
                        <input
                          value={order["Instrument"]}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Trade Duration": orderFlowColVis["Trade Duration"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Trade Status": orderFlowColVis["Trade Status"] && (
                      <td>
                        <input
                          value={order["Trade Status"]}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Display Name": orderFlowColVis["Display Name"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    "Status Message": orderFlowColVis["Status Message"] && (
                      <td>
                        <input
                          value={order.message}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    ),
                    Label: orderFlowColVis["Label"] && (
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
                      {orderFlowSeq.map((colName, index) => {
                        return (
                          <React.Fragment key={index}>
                            {orderFlowTD[colName]}
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  );
                  {
                    /* <tr key={index}>
                    {orderFlowColVis["Action"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Client ID"] && (
                      <td>
                        <input
                          value={order["Client ID"]}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Stock Symbol"] && (
                      <td>
                        <input
                          value={order["Stock Symbol"]}
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            width: "210px",
                          }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Exchange"] && (
                      <td>
                        <input
                          value={order["Exchange"]}
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Modify"] && (
                      <td>
                        <input
                          value={order.Modify}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Order Time"] && (
                      <td>
                        <input
                          value={order["Order Time"]}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Trade ID"] && (
                      <td>
                        <input
                          value={order["Trade ID"]}
                          type="number"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Transaction"] && (
                      <td>
                        <input
                          value={order.Transaction}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Avg Execution Price"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Order Size"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Execution Quantity"] && (
                      <td>
                        <input
                          value={order["Execution Quantity"]}
                          type="number"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Trade Type"] && (
                      <td>
                        <input
                          value={
                            order["Trade Type"] == 1
                              ? "BUY"
                              : order["Trade Type"] == -1
                                ? "SELL"
                                : ""
                          }
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Price"] && (
                      <td>
                        <input
                          value={
                            Number.isInteger(order["Price"])
                              ? order["Price"]
                              : order["Price"]
                          }
                          type="number"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Trigger Price"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Trigger Time"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Exchange Trade ID"] && (
                      <td>
                        <input
                          value={order["Exchange Trade ID"]}
                          type="number"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Instrument"] && (
                      <td>
                        <input
                          value={order["Instrument"]}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Trade Duration"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Trade Status"] && (
                      <td>
                        <input
                          value={order["Trade Status"]}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Display Name"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Status Message"] && (
                      <td>
                        <input
                          value={order.message}
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                    {orderFlowColVis["Label"] && (
                      <td>
                        <input
                          type="text"
                          style={{ disable: "none", padding: "6px" }}
                        />
                      </td>
                    )}
                  </tr> */
                  }
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

export default OrderFlow;
