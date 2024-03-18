import React, { useState, useEffect } from "react";
import shape from "../assets/shape.png";
import Modal from "react-modal";
import pencil from "../assets/pencil.png";
import minus from "../assets/minus-sign.png";
import plus from "../assets/plus-sign.png";
import Draggable from "react-draggable";
import push from "../assets/push-pin.png";
import reuse from "../assets/reuse.png";
import disk from "../assets/diskette.png";
import recycle from "../assets/recycle-bin.png";
import { Oval } from "react-loader-spinner";
import { useSelector, useDispatch } from "react-redux";
import { setConsoleMsgs } from "../store/slices/consoleMsg";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const OptionQuickTradePanel = ({
  handleClose1,
  isOpen1,
  colopen1,
  toggleOpen1,
  setIsOpen1,
  executedPortfolios,
}) => {
  // Initialize to false
  const mainUser = cookies.get("USERNAME");
  const dispatch = useDispatch();
  const { consoleMsgs } = useSelector((state) => state.consoleMsgsReducer);
  const handleMsg = (Msg) => {
    const lastMsg = consoleMsgs[ 0 ];
    if (Msg.logType === "MESSAGE" || Msg.logType === "ERROR") {
      if (lastMsg && lastMsg.msg === Msg.msg && lastMsg.user === Msg.user) {
        dispatch(
          setConsoleMsgs({
            consoleMsgs: [ Msg, ...consoleMsgs.slice(1) ],
          }),
        );
      } else {
        dispatch(
          setConsoleMsgs({
            consoleMsgs: [ Msg, ...consoleMsgs ],
          }),
        );
      }
    } else {
      dispatch(
        setConsoleMsgs({
          consoleMsgs: [ Msg, ...consoleMsgs ],
        }),
      );
    }
  };

  //  empty state
  const { portfolios: portfolioDetails } = useSelector(
    (state) => state.portfolioReducer,
  );
  const { strategies: Strategydata } = useSelector(
    (state) => state.strategyReducer,
  );
  const { brokers: rows } = useSelector((state) => state.brokerReducer);

  // console.log("portfolioDetails", portfolioDetails)
  const [ linkedPortfolios, setlinkedPortfolios ] = useState([]);
  const [ allStrategiesList, setallStrategiesList ] = useState([]);
  const [ placeOrderBtn, setplaceOrderBtn ] = useState(false);

  const { placeOrderStart } = useSelector(
    (state) => state.placeOrderStartReducer,
  );

  const [ optionsQTP, setOptionsQTP ] = useState({
    exchange: "",
    stock_symbol: "",
    lots: "",
    variety: "",
    strategy: "",
    userIds: "",
    portfolio_name: "",
    Option_Strategy: "",
  });
  useEffect(() => {
    if (!isOpen1) {
      setplaceOrderOptionsQTPBtn(false);
      setOptionsQTP({
        exchange: "",
        stock_symbol: "",
        lots: "",
        variety: "",
        strategy: "",
        userIds: "",
        portfolio_name: "",
        Option_Strategy: "",
      });
    }
  }, [ isOpen1 ]);

  const [ placeOrderOptionsQTPBtn, setplaceOrderOptionsQTPBtn ] = useState(false);

  const placeOrderOptionsQTP = async () => {
    try {
      optionsQTP.userIds.map(async (userId) => {
        const user = rows.find((user) => user.userId === userId);
        if (user && user.inputDisabled) {
          if (user.broker === "angelone") {
            // console.log("Order placing angelone 1");
            const res = await fetch(
              `api/place_order/angelone/${mainUser}/${optionsQTP.Option_Strategy}/${user.userId}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              },
            );
            // console.log("Order placing angelone 2");

            try {
              const orderPlaceoptionsQTPRes = await res.json();

              // console.log("Order placing angelone 3", orderPlaceoptionsQTPRes);

              setplaceOrderOptionsQTPBtn(false);
              setIsOpen1(false);
              // console.log("aNGELONE", orderPlaceoptionsQTPRes);
              if (orderPlaceoptionsQTPRes.orderstatus === "rejected") {
                handleMsg({
                  msg: orderPlaceoptionsQTPRes.message,
                  logType: "Order Rejected",
                  timestamp: `${new Date().toLocaleString()}`,
                  user: user.userId,
                });
                return;
              }
              handleMsg({
                msg: orderPlaceoptionsQTPRes.message,
                logType: "MESSAGE",
                timestamp: `${new Date().toLocaleString()}`,
                user: user.userId,
              });
            } catch (e) {
              // console.log("Order placing angelone 4");
              // console.log("Errrror buvabnn", e.message);
              setplaceOrderOptionsQTPBtn(false);
              setIsOpen1(false);
              handleMsg({
                msg: e.message,
                logType: "Order Error",
                timestamp: `${new Date().toLocaleString()}`,
                user: user.userId,
              });
            }
          }
          // console.log("console1");
          if (user.broker === "fyers") {
            const res = await fetch(
              `api/place_order/fyers/${mainUser}/${optionsQTP.Option_Strategy}/${user.userId}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              },
            );
            // console.log("console2");
            const orderPlaceoptionsQTPRes = await res.json();
            setplaceOrderOptionsQTPBtn(false);
            setIsOpen1(false);
            // console.log("fYERS", orderPlaceoptionsQTPRes);
            if (orderPlaceoptionsQTPRes.message.s === "error") {
              handleMsg({
                msg: orderPlaceoptionsQTPRes.message.message,
                logType: "ERROR",
                timestamp: `${new Date().toLocaleString()}`,
                user: user.userId,
              });
            }
          }
        }
      });

      // const orderPlaceoptionsQTPRes = await res.json()
      // console.log("bhuvanabhniubhfsnuxyb f2ui3eryn")

      // if(orderPlaceoptionsQTPRes.orderstatus==="rejected"){
      // 	handleMsg({
      // 		msg: orderPlaceoptionsQTPRes.message,
      // 		logType: "Order Rejected",
      // 		timestamp: `${new Date().toLocaleString()}`,
      // 	})
      // }
    } catch (error) {
      console.log(error.message);
    }
  };

  const { strategies } = useSelector(state => state.strategyReducer)


  return (
    <div>
      <Modal // Options Quick Trade Panel
        isOpen={isOpen1}
        onRequestClose={handleClose1}
        className="your-modal-button"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <Draggable>
          <div className="container1">
            <div className="title">
              <img src={pencil} style={{ padding: "5px" }} alt="" />
              <img
                src={colopen1 ? minus : plus}
                style={{ cursor: "pointer", padding: "5px" }}
                onClick={toggleOpen1}
                id="colopen1"
                alt=""
              />
              <img src={push} style={{ padding: "5px" }} alt="" />
              <img
                src={shape}
                style={{ cursor: "pointer", padding: "5px" }}
                onClick={handleClose1}
                alt=""
              />
            </div>
            <div className="content">
              <form>
                <div className="user-details">
                  <div className="MCX">
                    <select
                      className="details"
                      style={{ color: "GrayText" }}
                      value={
                        optionsQTP.exchange !== "" ? optionsQTP.exchange : null
                      }
                      onChange={(e) => {
                        setOptionsQTP((prev) => ({
                          ...prev,
                          exchange: e.target.value,
                        }));
                      }}
                    >
                      <option disabled selected>
                        Exchange
                      </option>
                      <option style={{ color: "black" }}>BFO</option>
                      <option style={{ color: "black" }}>NFO</option>
                      <option style={{ color: "black" }}>MCX</option>
                    </select>
                  </div>
                  <div className="EFS">
                    <input
                      value={
                        optionsQTP.stock_symbol !== ""
                          ? optionsQTP.stock_symbol
                          : null
                      }
                      onChange={(e) => {
                        setOptionsQTP((prev) => ({
                          ...prev,
                          stock_symbol: e.target.value,
                        }));
                      }}
                      type="text"
                      placeholder="Enter Future Stock"
                    />
                  </div>
                  <div className="OS">
                    <select
                      className="details"
                      style={{ color: "GrayText" }}
                      value={
                        optionsQTP.Option_Strategy !== ""
                          ? optionsQTP.Option_Strategy
                          : null
                      }
                      onChange={(e) => {
                        const portfolio = portfolioDetails.filter(
                          (portfolio) =>
                            portfolio.portfolio_name === e.target.value,
                        );

                        const brokerIds =
                          portfolio[ 0 ][ "Strategy_accounts_id" ].split(",");
                        // console.log("portfolio linked", brokerIds);
                        setOptionsQTP((prev) => ({
                          ...prev,
                          userIds: brokerIds,
                          exchange: portfolio[ 0 ].exchange,
                          stock_symbol: portfolio[ 0 ].stock_symbol,
                          lots: Number(portfolio[ 0 ].lots),
                          variety: portfolio[ 0 ].variety,
                          strategy: portfolio[ 0 ].strategy,
                          Option_Strategy: e.target.value,
                        }));
                      }}
                    >
                      <option selected disabled>
                        Option Strategy
                      </option>
                      {portfolioDetails.map((portfolioItem, index) => (
                        <option key={index} style={{ color: "black" }}>
                          {portfolioItem.portfolio_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="Lots">
                    <span
                      className="label"
                      style={{ fontFamily: "Roboto", fontSize: "19px" }}
                    >
                      {" "}
                      Lots{" "}
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={optionsQTP.lots !== "" ? optionsQTP.lots : null}
                      onChange={(e) => {
                        setOptionsQTP((prev) => ({
                          ...prev,
                          lots: Number(e.target.value),
                        }));
                      }}
                    />
                  </div>
                  <div className="NRML">
                    <select
                      className="details"
                      style={{ color: "GrayText" }}
                      value={
                        optionsQTP.variety !== "" ? optionsQTP.variety : null
                      }
                      onChange={(e) => {
                        setOptionsQTP((prev) => ({
                          ...prev,
                          variety: e.target.value,
                        }));
                      }}
                    >
                      <option disabled selected>
                        Product
                      </option>
                      <option value="NORMAL" style={{ color: "black" }}>
                        NRML
                      </option>
                      <option value="MIS" style={{ color: "black" }}>
                        MIS
                      </option>
                    </select>
                  </div>
                  <div className="DEFAULT">
                    <select
                      value={
                        optionsQTP.strategy !== "" ? optionsQTP.strategy : null
                      }
                      onChange={(e) => {
                        const linkedList = portfolioDetails.filter(
                          (portfolio) => portfolio.strategy === e.target.value,
                        );
                        // console.log("linkedList", linkedList)
                        const brokerIds =
                          linkedList[ 0 ][ "Strategy_accounts_id" ].split(",");
                        console.log("brokerIds ===", brokerIds);
                        setlinkedPortfolios(linkedList);
                        setOptionsQTP((prev) => ({
                          ...prev,
                          userIds: brokerIds,
                          strategy: e.target.value,
                        }));
                      }}
                      className="details"
                      style={{ color: "GrayText" }}
                    >
                      <option selected disabled>
                        Strategy
                      </option>
                      {
                        strategies.filter((row) => row.Action.enabled) // Filter rows where Action.enabled is true
                          .map((row, index) => (
                            <option key={index} value={row.StrategyLabel}>
                              {row.StrategyLabel}
                            </option>
                          ))
                      }
                    </select>
                  </div>
                </div>

                <div
                  className="OP-details"
                  id="OP-details"
                  style={{
                    border: "1px solid #cacaca",
                    padding: "10px",
                    margin: "2px",
                    display: "none",
                  }}
                >
                  <span className="OP-title" style={{ padding: "10px" }}>
                    Optional Parameters
                  </span>
                  <div className="UD-bottom">
                    <div class="input-box">
                      <span className="details">Entry Price</span>
                      <input type="text" />
                    </div>
                    <div class="input-box">
                      <span className="details">Combt Target</span>
                      <input type="text" />
                    </div>
                    <div class="input-box">
                      <span className="details">Comb SL</span>
                      <input type="text" />
                    </div>
                  </div>

                  <div
                    className="UD"
                    style={{ display: "flex", margin: "5px" }}
                  >
                    <div class="input-box">
                      <span className="details">Leg Target</span>
                      <input type="text" />
                    </div>
                    <div class="input-box" style={{ marginLeft: "0px" }}>
                      <span className="details">Leg SL</span>
                      <input type="text" />
                    </div>
                    <div className="checkbox1">
                      {/* Checkbox with content */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "10px",
                          marginTop: "17px",
                        }}
                      >
                        <input
                          type="checkbox"
                          id="legSlCheckbox"
                          style={{ opacity: "1", accentColor: "green" }}
                        />
                        <label
                          htmlFor="legSlCheckbox"
                          style={{
                            position: "relative",
                            cursor: "pointer",
                            border: "2px solid green",
                            marginLeft: "-20.8px",
                            height: "20.3px",
                            width: "23.9px",
                          }}
                        ></label>
                        {/* Additional content */}
                        <span
                          style={{
                            marginLeft: "9px",
                            display: "inline-block",
                            fontFamily: "Roboto",
                          }}
                        >
                          Move SL To Cost
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box2">
                  <select
                    className="detail"
                    style={{ color: "GrayText" }}
                    onChange={(e) => {
                      // Handle portfolio selection here if needed
                      setOptionsQTP((prev) => ({
                        ...prev,
                        portfolio_name: e.target.value,
                      }));
                    }}
                  >
                    <option
                      value=""
                      disabled
                      selected
                      style={{ fontFamily: "Roboto" }}
                    >
                      Executed Portfolios
                    </option>
                    {executedPortfolios.map((portfolio, index) => (
                      <option key={index} value={portfolio}>
                        {portfolio}
                      </option>
                    ))}
                  </select>
                </div>
                {/* <div className="box2">
                      <select
                        value={
                          optionsQTP.portfolio_name !== ""
                            ? optionsQTP.portfolio_name
                            : null
                        }
                        onChange={(e) => {
                          const portfolio = portfolioDetails.filter(
                            (portfolio) =>
                              portfolio.portfolio_name === e.target.value,
                          );
                          setOptionsQTP((prev) => ({
                            ...prev,
                            exchange: portfolio[ 0 ].exchange,
                            stock_symbol: portfolio[ 0 ].stock_symbol,
                            lots: Number(portfolio[ 0 ].lots),
                            variety: portfolio[ 0 ].variety,
                            strategy: portfolio[ 0 ].strategy,
                            portfolio_name: e.target.value,
                          }));
                        }}
                        className="detail"
                        style={{ color: "GrayText" }}
                      >
                        <option
                          value="option1"
                          disabled
                          selected
                          style={{ fontFamily: "Roboto" }}
                        >
                          Executed Portfolios
                        </option>
                        {linkedPortfolios.map((linkedPortfolio, index) => (
                          <option
                            key={index}
                            value={linkedPortfolio.portfolio_name}
                            style={{ color: "black" }}
                          >
                          </option>
                        ))}
                      </select>
                    </div> */}

                <div className="user-details-start">
                  <div class="input-box">
                    {!placeOrderOptionsQTPBtn ? (
                      <button
                        disabled={optionsQTP.Option_Strategy === ""}
                        type="button"
                        onClick={() => {
                          if (placeOrderStart) {
                            setplaceOrderOptionsQTPBtn(true);
                            placeOrderOptionsQTP();
                          } else {
                            setIsOpen1(false);
                            handleMsg({
                              msg: "To place an Order, Start the Trading.",
                              logType: "ERROR",
                              timestamp: `${new Date().toLocaleString()}`,
                            });
                          }
                        }}
                        style={
                          optionsQTP.Option_Strategy !== ""
                            ? { background: "#85e657" }
                            : {
                              background: "#ccc",
                              color: "#666",
                              cursor: "not-allowed",
                            }
                        }
                      >
                        ENTRY
                      </button>
                    ) : (
                      <button
                        type="button"
                        style={{ background: "#618F00", cursor: "default" }}
                      >
                        <Oval
                          className
                          height="20"
                          width="255"
                          color="white"
                          strokeWidth={3}
                        />
                      </button>
                    )}
                  </div>
                  <div class="input-box">
                    <button
                      type="button"
                      text="exit"
                      style={{ background: "#ff0000" }}
                      onClick={handleClose1}
                    >
                      EXIT
                    </button>
                  </div>
                  <div className="UD-button">
                    <p
                      style={{
                        color: "blue",
                        fontSize: "18px",
                        padding: "2px",
                        display: "none",
                        fontFamily: "roboto",
                      }}
                      className="SL1"
                    >
                      Target, SL in Points. For Percentage, Tick Value in %
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Draggable>
      </Modal>
    </div>
  );
};
import React, { useState, useEffect } from "react";
import shape from "../assets/shape.png";
import Modal from "react-modal";
import pencil from "../assets/pencil.png";
import minus from "../assets/minus-sign.png";
import plus from "../assets/plus-sign.png";
import Draggable from "react-draggable";
import push from "../assets/push-pin.png";
import reuse from "../assets/reuse.png";
import disk from "../assets/diskette.png";
import recycle from "../assets/recycle-bin.png";
import { Oval } from "react-loader-spinner";
import { useSelector, useDispatch } from "react-redux";
import { setConsoleMsgs } from "../store/slices/consoleMsg";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const OptionQuickTradePanel = ({
  handleClose1,
  isOpen1,
  colopen1,
  toggleOpen1,
  setIsOpen1,
  executedPortfolios,
}) => {
  // Initialize to false
  const mainUser = cookies.get("USERNAME");
  const dispatch = useDispatch();
  const { consoleMsgs } = useSelector((state) => state.consoleMsgsReducer);
  const handleMsg = (Msg) => {
    const lastMsg = consoleMsgs[ 0 ];
    if (Msg.logType === "MESSAGE" || Msg.logType === "ERROR") {
      if (lastMsg && lastMsg.msg === Msg.msg && lastMsg.user === Msg.user) {
        dispatch(
          setConsoleMsgs({
            consoleMsgs: [ Msg, ...consoleMsgs.slice(1) ],
          }),
        );
      } else {
        dispatch(
          setConsoleMsgs({
            consoleMsgs: [ Msg, ...consoleMsgs ],
          }),
        );
      }
    } else {
      dispatch(
        setConsoleMsgs({
          consoleMsgs: [ Msg, ...consoleMsgs ],
        }),
      );
    }
  };

  //  empty state
  const { portfolios: portfolioDetails } = useSelector(
    (state) => state.portfolioReducer,
  );
  const { strategies: Strategydata } = useSelector(
    (state) => state.strategyReducer,
  );
  const { brokers: rows } = useSelector((state) => state.brokerReducer);

  // console.log("portfolioDetails", portfolioDetails)
  const [ linkedPortfolios, setlinkedPortfolios ] = useState([]);
  const [ allStrategiesList, setallStrategiesList ] = useState([]);
  const [ placeOrderBtn, setplaceOrderBtn ] = useState(false);

  const { placeOrderStart } = useSelector(
    (state) => state.placeOrderStartReducer,
  );

  const [ optionsQTP, setOptionsQTP ] = useState({
    exchange: "",
    stock_symbol: "",
    lots: "",
    variety: "",
    strategy: "",
    userIds: "",
    portfolio_name: "",
    Option_Strategy: "",
  });
  useEffect(() => {
    if (!isOpen1) {
      setplaceOrderOptionsQTPBtn(false);
      setOptionsQTP({
        exchange: "",
        stock_symbol: "",
        lots: "",
        variety: "",
        strategy: "",
        userIds: "",
        portfolio_name: "",
        Option_Strategy: "",
      });
    }
  }, [ isOpen1 ]);

  const [ placeOrderOptionsQTPBtn, setplaceOrderOptionsQTPBtn ] = useState(false);

  const placeOrderOptionsQTP = async () => {
    try {
      optionsQTP.userIds.map(async (userId) => {
        const user = rows.find((user) => user.userId === userId);
        if (user && user.inputDisabled) {
          if (user.broker === "angelone") {
            // console.log("Order placing angelone 1");
            const res = await fetch(
              `api/place_order/angelone/${mainUser}/${optionsQTP.Option_Strategy}/${user.userId}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              },
            );
            // console.log("Order placing angelone 2");

            try {
              const orderPlaceoptionsQTPRes = await res.json();

              // console.log("Order placing angelone 3", orderPlaceoptionsQTPRes);

              setplaceOrderOptionsQTPBtn(false);
              setIsOpen1(false);
              // console.log("aNGELONE", orderPlaceoptionsQTPRes);
              if (orderPlaceoptionsQTPRes.orderstatus === "rejected") {
                handleMsg({
                  msg: orderPlaceoptionsQTPRes.message,
                  logType: "Order Rejected",
                  timestamp: `${new Date().toLocaleString()}`,
                  user: user.userId,
                });
                return;
              }
              handleMsg({
                msg: orderPlaceoptionsQTPRes.message,
                logType: "MESSAGE",
                timestamp: `${new Date().toLocaleString()}`,
                user: user.userId,
              });
            } catch (e) {
              // console.log("Order placing angelone 4");
              // console.log("Errrror buvabnn", e.message);
              setplaceOrderOptionsQTPBtn(false);
              setIsOpen1(false);
              handleMsg({
                msg: e.message,
                logType: "Order Error",
                timestamp: `${new Date().toLocaleString()}`,
                user: user.userId,
              });
            }
          }
          // console.log("console1");
          if (user.broker === "fyers") {
            const res = await fetch(
              `api/place_order/fyers/${mainUser}/${optionsQTP.Option_Strategy}/${user.userId}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              },
            );
            // console.log("console2");
            const orderPlaceoptionsQTPRes = await res.json();
            setplaceOrderOptionsQTPBtn(false);
            setIsOpen1(false);
            // console.log("fYERS", orderPlaceoptionsQTPRes);
            if (orderPlaceoptionsQTPRes.message.s === "error") {
              handleMsg({
                msg: orderPlaceoptionsQTPRes.message.message,
                logType: "ERROR",
                timestamp: `${new Date().toLocaleString()}`,
                user: user.userId,
              });
            }
          }
        }
      });

      // const orderPlaceoptionsQTPRes = await res.json()
      // console.log("bhuvanabhniubhfsnuxyb f2ui3eryn")

      // if(orderPlaceoptionsQTPRes.orderstatus==="rejected"){
      // 	handleMsg({
      // 		msg: orderPlaceoptionsQTPRes.message,
      // 		logType: "Order Rejected",
      // 		timestamp: `${new Date().toLocaleString()}`,
      // 	})
      // }
    } catch (error) {
      console.log(error.message);
    }
  };

  const { strategies } = useSelector(state => state.strategyReducer)


  return (
    <div>
      <Modal // Options Quick Trade Panel
        isOpen={isOpen1}
        onRequestClose={handleClose1}
        className="your-modal-button"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <Draggable>
          <div className="container1">
            <div className="title">
              <img src={pencil} style={{ padding: "5px" }} alt="" />
              <img
                src={colopen1 ? minus : plus}
                style={{ cursor: "pointer", padding: "5px" }}
                onClick={toggleOpen1}
                id="colopen1"
                alt=""
              />
              <img src={push} style={{ padding: "5px" }} alt="" />
              <img
                src={shape}
                style={{ cursor: "pointer", padding: "5px" }}
                onClick={handleClose1}
                alt=""
              />
            </div>
            <div className="content">
              <form>
                <div className="user-details">
                  <div className="MCX">
                    <select
                      className="details"
                      style={{ color: "GrayText" }}
                      value={
                        optionsQTP.exchange !== "" ? optionsQTP.exchange : null
                      }
                      onChange={(e) => {
                        setOptionsQTP((prev) => ({
                          ...prev,
                          exchange: e.target.value,
                        }));
                      }}
                    >
                      <option disabled selected>
                        Exchange
                      </option>
                      <option style={{ color: "black" }}>BFO</option>
                      <option style={{ color: "black" }}>NFO</option>
                      <option style={{ color: "black" }}>MCX</option>
                    </select>
                  </div>
                  <div className="EFS">
                    <input
                      value={
                        optionsQTP.stock_symbol !== ""
                          ? optionsQTP.stock_symbol
                          : null
                      }
                      onChange={(e) => {
                        setOptionsQTP((prev) => ({
                          ...prev,
                          stock_symbol: e.target.value,
                        }));
                      }}
                      type="text"
                      placeholder="Enter Future Stock"
                    />
                  </div>
                  <div className="OS">
                    <select
                      className="details"
                      style={{ color: "GrayText" }}
                      value={
                        optionsQTP.Option_Strategy !== ""
                          ? optionsQTP.Option_Strategy
                          : null
                      }
                      onChange={(e) => {
                        const portfolio = portfolioDetails.filter(
                          (portfolio) =>
                            portfolio.portfolio_name === e.target.value,
                        );

                        const brokerIds =
                          portfolio[ 0 ][ "Strategy_accounts_id" ].split(",");
                        // console.log("portfolio linked", brokerIds);
                        setOptionsQTP((prev) => ({
                          ...prev,
                          userIds: brokerIds,
                          exchange: portfolio[ 0 ].exchange,
                          stock_symbol: portfolio[ 0 ].stock_symbol,
                          lots: Number(portfolio[ 0 ].lots),
                          variety: portfolio[ 0 ].variety,
                          strategy: portfolio[ 0 ].strategy,
                          Option_Strategy: e.target.value,
                        }));
                      }}
                    >
                      <option selected disabled>
                        Option Strategy
                      </option>
                      {portfolioDetails.map((portfolioItem, index) => (
                        <option key={index} style={{ color: "black" }}>
                          {portfolioItem.portfolio_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="Lots">
                    <span
                      className="label"
                      style={{ fontFamily: "Roboto", fontSize: "19px" }}
                    >
                      {" "}
                      Lots{" "}
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={optionsQTP.lots !== "" ? optionsQTP.lots : null}
                      onChange={(e) => {
                        setOptionsQTP((prev) => ({
                          ...prev,
                          lots: Number(e.target.value),
                        }));
                      }}
                    />
                  </div>
                  <div className="NRML">
                    <select
                      className="details"
                      style={{ color: "GrayText" }}
                      value={
                        optionsQTP.variety !== "" ? optionsQTP.variety : null
                      }
                      onChange={(e) => {
                        setOptionsQTP((prev) => ({
                          ...prev,
                          variety: e.target.value,
                        }));
                      }}
                    >
                      <option disabled selected>
                        Product
                      </option>
                      <option value="NORMAL" style={{ color: "black" }}>
                        NRML
                      </option>
                      <option value="MIS" style={{ color: "black" }}>
                        MIS
                      </option>
                    </select>
                  </div>
                  <div className="DEFAULT">
                    <select
                      value={
                        optionsQTP.strategy !== "" ? optionsQTP.strategy : null
                      }
                      onChange={(e) => {
                        const linkedList = portfolioDetails.filter(
                          (portfolio) => portfolio.strategy === e.target.value,
                        );
                        // console.log("linkedList", linkedList)
                        const brokerIds =
                          linkedList[ 0 ][ "Strategy_accounts_id" ].split(",");
                        console.log("brokerIds ===", brokerIds);
                        setlinkedPortfolios(linkedList);
                        setOptionsQTP((prev) => ({
                          ...prev,
                          userIds: brokerIds,
                          strategy: e.target.value,
                        }));
                      }}
                      className="details"
                      style={{ color: "GrayText" }}
                    >
                      <option selected disabled>
                        Strategy
                      </option>
                      {
                        strategies.filter((row) => row.Action.enabled) // Filter rows where Action.enabled is true
                          .map((row, index) => (
                            <option key={index} value={row.StrategyLabel}>
                              {row.StrategyLabel}
                            </option>
                          ))
                      }
                    </select>
                  </div>
                </div>

                <div
                  className="OP-details"
                  id="OP-details"
                  style={{
                    border: "1px solid #cacaca",
                    padding: "10px",
                    margin: "2px",
                    display: "none",
                  }}
                >
                  <span className="OP-title" style={{ padding: "10px" }}>
                    Optional Parameters
                  </span>
                  <div className="UD-bottom">
                    <div class="input-box">
                      <span className="details">Entry Price</span>
                      <input type="text" />
                    </div>
                    <div class="input-box">
                      <span className="details">Combt Target</span>
                      <input type="text" />
                    </div>
                    <div class="input-box">
                      <span className="details">Comb SL</span>
                      <input type="text" />
                    </div>
                  </div>

                  <div
                    className="UD"
                    style={{ display: "flex", margin: "5px" }}
                  >
                    <div class="input-box">
                      <span className="details">Leg Target</span>
                      <input type="text" />
                    </div>
                    <div class="input-box" style={{ marginLeft: "0px" }}>
                      <span className="details">Leg SL</span>
                      <input type="text" />
                    </div>
                    <div className="checkbox1">
                      {/* Checkbox with content */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "10px",
                          marginTop: "17px",
                        }}
                      >
                        <input
                          type="checkbox"
                          id="legSlCheckbox"
                          style={{ opacity: "1", accentColor: "green" }}
                        />
                        <label
                          htmlFor="legSlCheckbox"
                          style={{
                            position: "relative",
                            cursor: "pointer",
                            border: "2px solid green",
                            marginLeft: "-20.8px",
                            height: "20.3px",
                            width: "23.9px",
                          }}
                        ></label>
                        {/* Additional content */}
                        <span
                          style={{
                            marginLeft: "9px",
                            display: "inline-block",
                            fontFamily: "Roboto",
                          }}
                        >
                          Move SL To Cost
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box2">
                  <select
                    className="detail"
                    style={{ color: "GrayText" }}
                    onChange={(e) => {
                      // Handle portfolio selection here if needed
                      setOptionsQTP((prev) => ({
                        ...prev,
                        portfolio_name: e.target.value,
                      }));
                    }}
                  >
                    <option
                      value=""
                      disabled
                      selected
                      style={{ fontFamily: "Roboto" }}
                    >
                      Executed Portfolios
                    </option>
                    {executedPortfolios.map((portfolio, index) => (
                      <option key={index} value={portfolio}>
                        {portfolio}
                      </option>
                    ))}
                  </select>
                </div>
                {/* <div className="box2">
                      <select
                        value={
                          optionsQTP.portfolio_name !== ""
                            ? optionsQTP.portfolio_name
                            : null
                        }
                        onChange={(e) => {
                          const portfolio = portfolioDetails.filter(
                            (portfolio) =>
                              portfolio.portfolio_name === e.target.value,
                          );
                          setOptionsQTP((prev) => ({
                            ...prev,
                            exchange: portfolio[ 0 ].exchange,
                            stock_symbol: portfolio[ 0 ].stock_symbol,
                            lots: Number(portfolio[ 0 ].lots),
                            variety: portfolio[ 0 ].variety,
                            strategy: portfolio[ 0 ].strategy,
                            portfolio_name: e.target.value,
                          }));
                        }}
                        className="detail"
                        style={{ color: "GrayText" }}
                      >
                        <option
                          value="option1"
                          disabled
                          selected
                          style={{ fontFamily: "Roboto" }}
                        >
                          Executed Portfolios
                        </option>
                        {linkedPortfolios.map((linkedPortfolio, index) => (
                          <option
                            key={index}
                            value={linkedPortfolio.portfolio_name}
                            style={{ color: "black" }}
                          >
                          </option>
                        ))}
                      </select>
                    </div> */}

                <div className="user-details-start">
                  <div class="input-box">
                    {!placeOrderOptionsQTPBtn ? (
                      <button
                        disabled={optionsQTP.Option_Strategy === ""}
                        type="button"
                        onClick={() => {
                          if (placeOrderStart) {
                            setplaceOrderOptionsQTPBtn(true);
                            placeOrderOptionsQTP();
                          } else {
                            setIsOpen1(false);
                            handleMsg({
                              msg: "To place an Order, Start the Trading.",
                              logType: "ERROR",
                              timestamp: `${new Date().toLocaleString()}`,
                            });
                          }
                        }}
                        style={
                          optionsQTP.Option_Strategy !== ""
                            ? { background: "#85e657" }
                            : {
                              background: "#ccc",
                              color: "#666",
                              cursor: "not-allowed",
                            }
                        }
                      >
                        ENTRY
                      </button>
                    ) : (
                      <button
                        type="button"
                        style={{ background: "#618F00", cursor: "default" }}
                      >
                        <Oval
                          className
                          height="20"
                          width="255"
                          color="white"
                          strokeWidth={3}
                        />
                      </button>
                    )}
                  </div>
                  <div class="input-box">
                    <button
                      type="button"
                      text="exit"
                      style={{ background: "#ff0000" }}
                      onClick={handleClose1}
                    >
                      EXIT
                    </button>
                  </div>
                  <div className="UD-button">
                    <p
                      style={{
                        color: "blue",
                        fontSize: "18px",
                        padding: "2px",
                        display: "none",
                        fontFamily: "roboto",
                      }}
                      className="SL1"
                    >
                      Target, SL in Points. For Percentage, Tick Value in %
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Draggable>
      </Modal>
    </div>
  );
};
