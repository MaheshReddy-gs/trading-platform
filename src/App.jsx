import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
// import Register from './views/Register';
// import Login from './views/Login';
import UserProfiles from "./views/UserProfiles";
import Strategies from "./views/Strategies";
import Equity from "./views/Equity";
import Orders from "./views/F&O/Orders";
import Portfolio from "./views/F&O/Portfolio";
import AddPortfolio from "./views/F&O/AddPortfolio";
import OrderFlow from "./views/OrderFlow";
import OrderManagement from "./views/OrderManagement";
import Positions from "./views/Positions";
import Holdings from "./views/Holdings";
// import Positions from './views/Positions';
import Register from "./views/Register/Register";
import Login from "./views/Login/Login";
import { useDispatch, useSelector } from "react-redux";
import { setBrokers } from "./store/slices/broker.js";
import { setAuth } from "./store/slices/auth.js";
import { setStrategies } from "./store/slices/strategy.jsx";
import { setPortfolios } from "./store/slices/portfolio.jsx";
import { setExpiries } from "./store/slices/expiries.js";
import { setConsoleMsgs } from "./store/slices/consoleMsg.js";
import { setOrders } from "./store/slices/orderBook.jsx";
import { setPositions } from "./store/slices/position.jsx";
import Change_Password from "./components/Change_Password.jsx";
import { useNavigate } from "react-router-dom";

import Cookies from "universal-cookie";

const cookies = new Cookies();

function App() {
  const authState = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const expiryState = useSelector((state) => state.expiryReducer);
  const mainUser = cookies.get("USERNAME");
  const navigate = useNavigate();


  useEffect(() => {
    // console.lo g(authState.isAuthenticated)
    if (mainUser !== undefined && mainUser !== "") {
      // console.log(")
      dispatch(
        setAuth({
          isAuthenticated: true,
        }),
      );
      const fetchAccountDetails = async () => {
        try {
          const username = cookies.get("USERNAME");
          // console.log(username);
          // post request
          const response = await fetch(
            `/api/get_user_data/${username}`,

            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw {
              message:
                errorData.message || "Something bad happened. Please try again",
            };
          }
          const responseData = await response.json();
          // console.log("--------------");
          // console.log("------------");
          const newFilledData = responseData.broker_credentials.map((data) => {
            return {
              enabled: true,
              mtmAll: 0,
              net: 0,
              availableMargin: 0,
              name: data.display_name,
              userId: data.broker_user_id || "",
              fyersclientId: data.client_id || "",
              broker: data.broker || "",
              imei: data.imei || "",
              secretKey: data.secret_key || "",
              apiKey: data.api_key || "",
              qrCode: data.qr_code || "",
              sqOffTime: "00:00:00",
              maxProfit: 0,
              maxLoss: 0,
              profitLocking: "",
              qtyByExposure: 0,
              maxLossPerTrade: 0,
              maxOpenTrades: 0,
              qtyMultiplier: 0.0, //Decimal
              mobile: "",
              apiUserDetails: "",
              email: "",
              password: data.password,
              autoLogin: true,
              historicalApi: false,
              inputDisabled: false,
            };
          });

          const dummyAndFilledData = [
            {
              enabled: true,
              mtmAll: 0,
              net: 0,
              availableMargin: 1000000,
              name: "pseudo account",
              userId: "P848960",
              fyersclientId: "",
              broker: "pseudo account",
              imei: "",
              secretKey: "",
              apiKey: "BS3JYNN6W3",
              qrCode: "PXFQ5LJL5W7JCSARFU3KAVS2Ji",
              sqOffTime: "0:00:00",
              maxProfit: 0,
              maxLoss: 0,
              profitLocking: "",
              qtyByExposure: 0,
              maxLossPerTrade: 0,
              maxOpenTrades: 0,
              qtyMultiplier: 0.0,
              mobile: "",

              email: "mko",
              password: "1234",
              autoLogin: true,
              historicalApi: false,
              inputDisabled: false,
            },
            ...newFilledData,
          ];
          // console.log(responseData.broker_credentials, "User Details");
          dispatch(
            setBrokers({
              brokers: dummyAndFilledData,
            }),
          );
          // updating row state
          // setRows(dummyAndFilledData);
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchAccountDetails();

      const fetchStrategy = async (username) => {
        try {
          const response = await fetch(
            `/api/retrieve_strategy_info/${username}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const responseData = await response.json();
          // console.log("startegyState", responseData.strategies)
          const extractedStrategyTags = responseData.strategies.map(
            (strategy) => strategy.strategy_tag,
          );
          // setallStrategiesList(extractedStrategyTags);
          const resetRowsData = responseData.strategies.map((item) => {
            return {
              Action: {
                enabled: false,
                logged: false,
              },
              ManualSquareOff: "",
              StrategyLabel: item.strategy_tag,
              PL: "0",
              TradeSize: "0",
              DuplicateSignalPrevention: "0",
              OpenTime: "00:00:00",
              CloseTime: "00:00:00",
              SqOffTime: "00:00:00",
              TradingAccount: item.broker_user_id.join(", "),
              MaxProfit: "0",
              MaxLoss: "0",
              MaxLossWaitTime: "00:00:00",
              ProfitLocking: "0",
              DelayBetweenUsers: "0",
              UniqueIDReqforOrder: "",
              CancelPreviousOpenSignal: "",
              StopReverse: "",
              PartMultiExists: "",
              HoldSellSeconds: "00",
              AllowedTrades: "",
              EntryOrderRetry: "0",
              EntryRetryCount: "0",
              EntryRetryWaitSeconds: "00",
              ExitOrderRetry: "0",
              ExitRetryCount: "0",
              ExitRetryWaitSeconds: "00",
              ExitMaxWaitSeconds: "00",
              SqOffDone: "",
              Delta: "0",
              Theta: "0",
              Vega: "0",
            };
          });

          if (resetRowsData.length > 0) {
            // console.log("startegyState", resetRowsData)
            dispatch(
              setStrategies({
                strategies: resetRowsData,
              }),
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchStrategy(mainUser);

      const fetchPortfolios = async () => {
        try {
          const responsePortfolioData = await fetch(
            `/api/get_portfolio/${mainUser}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (!responsePortfolioData.ok) {
            const errorData = await responsePortfolioData.json();
            throw {
              message:
                errorData.message || "Something bad happened. Please try again",
            };
          }
          const responseData = await responsePortfolioData.json();
          // console.log("responseData",responseData)
          const extractedPortfolio = responseData["Portfolio details"];
          // console.log("extractedPortfolio", extractedPortfolio);

          dispatch(
            setPortfolios({
              portfolios: extractedPortfolio,
            }),
          );
        } catch (error) {
          console.error("Error:", error);
        }
      };
      fetchPortfolios();

      let expiries = {
        NIFTY: [],
        FINNIFTY: [],
        BANKNIFTY: [],
      };

      const fetchExpiries = async (symbol) => {
        try {
          const body = {
            symbol: symbol,
          };
          const responseExpiries = await fetch(
            `/api/get_expiry_list_blueprint/${mainUser}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            },
          );

          if (!responseExpiries.ok) {
            const errorData = await responseExpiries.json();
            throw {
              message:
                errorData.message || "Something bad happened. Please try again",
            };
          }
          const { Expirylist } = await responseExpiries.json();
          // console.log("responseData",symbol, "=", Expirylist)

          expiries[symbol] = Expirylist;
          // console.log("expiries obj", expiries)
          dispatch(
            setExpiries({
              NIFTY: expiries["NIFTY"],
              BANKNIFTY: expiries["BANKNIFTY"],
              FINNIFTY: expiries["FINNIFTY"],
            }),
          );
        } catch (error) {
          console.error("Error:", error);
        }
      };
      Object.keys(expiries).map((symbol) => {
        fetchExpiries(symbol);
      });
    } else {
      navigate("/");
    }
  }, [mainUser]);


 
  const { consoleMsgs } = useSelector((state) => state.consoleMsgsReducer);
  const { brokers: rows } = useSelector((state) => state.brokerReducer);
  // const { orders } = useSelector((state) => state.orderBookReducer);
  const { positions } = useSelector((state) => state.positionReducer);

  // useEffect(()=>{
  //   console.log("consoleMsgs", consoleMsgs)
  // }, [consoleMsgs])`
  // useEffect(()=>{
  //   console.log("orders updated", orders)
  // }, [orders])

  const handleMsg = (Msg) => {
    // console.log("consoleMsgs", consoleMsgs)
    dispatch((dispatch, getState) => {
      const previousConsoleMsgs = getState().consoleMsgsReducer.consoleMsgs;
     
    
    const lastMsg = consoleMsgs[0];
    if (Msg.logType === "MESSAGE" || Msg.logType === "ERROR") {
      if (lastMsg && lastMsg.msg === Msg.msg && lastMsg.user === Msg.user) {
        
        dispatch(
          setConsoleMsgs({
            consoleMsgs: [Msg, ...previousConsoleMsgs.slice(1)],
          }),
        );
      } else {
        dispatch(
          setConsoleMsgs({
            consoleMsgs: [Msg, ...previousConsoleMsgs],
          }),
        );
      }
    } else {
      dispatch(
        setConsoleMsgs({
          consoleMsgs: [Msg, ...previousConsoleMsgs],
        }),
      );
    }
  });
  };

  const [Broker, setBroker] = useState({
    angelone: [],
    fyers: [],
    flattrade: [],
  });

  useEffect(() => {
    const loggedInRows = rows.filter((row) => row.inputDisabled);

    let updatedBroker = { angelone: [], fyers: [], flattrade: [] }; // Ensure angelone is always present

    loggedInRows.forEach((row) => {
      if (row.broker === "angelone") {
        updatedBroker.angelone.push(row.userId);
      } else if (row.broker === "fyers") {
        updatedBroker.fyers.push(row.userId);
      } else if (row.broker === "flattrade") {
        updatedBroker.flattrade.push(row.userId);
      }
    });
    setBroker((prev) => {
      if (
        prev.angelone !== updatedBroker.angelone ||
        prev.fyers !== updatedBroker.fyers ||
        prev.flattrade !== updatedBroker.flattrade
      ) {
        return updatedBroker;
      } else {
        return prev;
      }
    });
  }, [rows]);

  const [loginList, setloginList] = useState([]);

  const fetchOrderData = async () => {
    let allOrders = [];
    let orderResMsgs = [];
    const response = await fetch(`api/order_book_blueprint/${mainUser}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Broker),
    });

    // console.log("console 1");
    const responseData = await response.json();
    // console.log("console 2");
    // console.log("responseData orderBook", responseData);

    if (!response.ok) {
      // console.log(responseData, "error responseData");
      handleMsg({
        msg: responseData.Message,
        logType: "ERROR",
        timestamp: `${new Date().toLocaleString()}`,
        user: "Order Book",
      })
      // orderResMsgs.push({
      //   msg: responseData.Message,
      //   logType: "ERROR",
      //   timestamp: `${new Date().toLocaleString()}`,
      //   user: "Order Book",
      // });

      // dispatch((dispatch, getState) => {
      //   const previousConsoleMsgs = getState().consoleMsgsReducer.consoleMsgs;
      //   // const newData = /* logic to get new data */
      //   // console.log("previousConsoleMsgs", [...data.orderResMsgs, ...previousConsoleMsgs])
      //   dispatch(
      //     setConsoleMsgs({
      //       consoleMsgs: [
      //         {
      //           msg: responseData.Message,
      //           logType: "ERROR",
      //           timestamp: `${new Date().toLocaleString()}`,
      //           user: "Order Book",
      //         },
      //         ...previousConsoleMsgs,
      //       ],
      //     }),
      //   );
      // });
      return;
      // handleMsg({
      //   msg: responseData.Message,
      //   logType: "ERROR",
      //   timestamp: `${new Date().toLocaleString()}`,
      //   user: "Order Book",
      // });
    }
    // console.log(responseData, "responseData");
    dispatch((dispatch, getState) => {
      const orders = getState().orderBookReducer.orders;
      if (responseData.angelone && responseData.angelone.length > 0) {
        for (let index = 0; index < responseData.angelone.length; index++) {
          const keys = Object.keys(responseData.angelone[index]);
          const clientId = keys.length > 0 ? keys[index] : null;

          const allOrderDetails = clientId
            ? responseData.angelone[index][clientId].Order_book.data
            : [];

          if (allOrderDetails) {
            const angeloneOB = allOrderDetails.map((order) => ({
              "Client ID": clientId,
              "Stock Symbol": order.tradingsymbol,
              Exchange: order.exchange,
              "Order Time": order.updatetime,
              "Execution Quantity": order.quantity,
              "Trade Type": order.transactiontype,
              Price: order.price,
              "Exchange Trade ID": order.orderid,
              Instrument: order.instrumenttype,
              "Trade Status": order.status,
            }));

            // console.log(angeloneOB, "12");

            // setangeloneOB((prev) => {
            if (
              angeloneOB.length === 1 &&
              angeloneOB[0].symbol !== "" &&
              orders.filter((order) => order["Client ID"] === clientId)[0]
                .symbol === ""
            ) {
              handleMsg({
                msg: `Data received successfully. - ${clientId}`,
                logType: "MESSAGE",
                timestamp: `${new Date().toLocaleString()}`,
                user: clientId,
              })
              // orderResMsgs.push({
              //   msg: `Data received successfully. - ${clientId}`,
              //   logType: "MESSAGE",
              //   timestamp: `${new Date().toLocaleString()}`,
              //   user: clientId,
              // });
              // const previousConsoleMsgs =
              //   getState().consoleMsgsReducer.consoleMsgs;
              // // const newData = /* logic to get new data */
              // // console.log("previousConsoleMsgs", [...data.orderResMsgs, ...previousConsoleMsgs])
              // dispatch(
              //   setConsoleMsgs({
              //     consoleMsgs: [
              //       {
              //         msg: `Data received successfully. - ${clientId}`,
              //         logType: "MESSAGE",
              //         timestamp: `${new Date().toLocaleString()}`,
              //         user: clientId,
              //       },
              //       ...previousConsoleMsgs,
              //     ],
              //   }),
              // );
              allOrders.push(...angeloneOB);
            } else if (
              orders.filter((order) => order["Client ID"] === clientId)
                .length !== angeloneOB.length
            ) {
              handleMsg({
                msg: `Data received successfully. - ${clientId}`,
                logType: "MESSAGE",
                timestamp: `${new Date().toLocaleString()}`,
                user: clientId,
              })
              // orderResMsgs.push({
              //   msg: `Data received successfully. - ${clientId}`,
              //   logType: "MESSAGE",
              //   timestamp: `${new Date().toLocaleString()}`,
              //   user: clientId,
              // });
              // const previousConsoleMsgs =
              //   getState().consoleMsgsReducer.consoleMsgs;
              // // const newData = /* logic to get new data */
              // // console.log("previousConsoleMsgs", [...data.orderResMsgs, ...previousConsoleMsgs])
              // dispatch(
              //   setConsoleMsgs({
              //     consoleMsgs: [
              //       {
              //         msg: `Data received successfully. - ${clientId}`,
              //         logType: "MESSAGE",
              //         timestamp: `${new Date().toLocaleString()}`,
              //         user: clientId,
              //       },
              //       ...previousConsoleMsgs,
              //     ],
              //   }),
              // );
              allOrders.push(...angeloneOB);
            } else {
              allOrders.push(
                ...orders.filter((order) => order["Client ID"] === clientId),
              );
            }
          }
        }
      }
      if (responseData.fyers && responseData.fyers.length > 0) {
        for (let index = 0; index < responseData.fyers.length; index++) {
          const keys = Object.keys(responseData.fyers[index]);
          const clientId = keys.length > 0 ? keys[index] : null;

          if (
            clientId &&
            responseData.fyers[index][clientId]?.Order_book_fyers?.orderBook
          ) {
            const allOrderDetails =
              responseData.fyers[index][clientId].Order_book_fyers.orderBook;

            const fyersOB = allOrderDetails.map((order) => ({
              "Client ID": clientId,
              "Stock Symbol": order.symbol,
              Exchange:
                order.exchange === 10
                  ? "NSE"
                  : order.exchange === 11
                    ? "MCX"
                    : order.exchange === 12
                      ? "BSE"
                      : "",
              "Order Time": order.orderDateTime,
              "Execution Quantity": order.qty,
              "Trade Type":
                order.side === 1 ? "BUY" : order.side === -1 ? "SELL" : "",
              Price: order.tradedPrice,
              "Exchange Trade ID": order.id,
              Instrument:
                order.instrument === 11
                  ? "FUTIDX"
                  : order.instrument === 12
                    ? "FUTIVX"
                    : order.instrument === 13
                      ? "FUTSTK"
                      : order.instrument === 14
                        ? "OPTIDX"
                        : order.instrument === 15
                          ? "OPTSTK"
                          : null,
              "Trade Status":
                order.status === 1
                  ? "Cancelled"
                  : order.status === 2
                    ? "Traded / Filled"
                    : order.status === 3
                      ? "For future use"
                      : order.status === 4
                        ? "Transit"
                        : order.status === 5
                          ? "Rejected"
                          : order.status === 6
                            ? "Pending"
                            : null,
            }));
            // console.log(" FyersRDX0", orders);
            // console.log(" FyersOB", fyersOB);

            if (
              fyersOB.length === 1 &&
              fyersOB[0].symbol !== "" &&
              orders.filter((order) => order["Client ID"] === clientId)[0]
                .symbol === ""
            ) {
              // console.log("1");
              handleMsg({
                msg: `Data received successfully. - ${clientId}`,
                logType: "MESSAGE",
                timestamp: `${new Date().toLocaleString()}`,
                user: clientId,
              })
              // orderResMsgs.push({
              //   msg: `Data received successfully. - ${clientId}`,
              //   logType: "MESSAGE",
              //   timestamp: `${new Date().toLocaleString()}`,
              //   user: clientId,
              // });
              // dispatch((dispatch, getState) => {
              //   const previousConsoleMsgs =
              //     getState().consoleMsgsReducer.consoleMsgs;
              //   // const newData = /* logic to get new data */
              //   // console.log("previousConsoleMsgs", [...data.orderResMsgs, ...previousConsoleMsgs])
              //   dispatch(
              //     setConsoleMsgs({
              //       consoleMsgs: [
              //         {
              //           msg: `Data received successfully. - ${clientId}`,
              //           logType: "MESSAGE",
              //           timestamp: `${new Date().toLocaleString()}`,
              //           user: clientId,
              //         },
              //         ...previousConsoleMsgs,
              //       ],
              //     }),
              //   );
              // });
              allOrders.push(...fyersOB);
            } else if (
              orders.filter((order) => order["Client ID"] === clientId)
                .length !== fyersOB.length
            ) {
              // console.log("2");
              handleMsg({
                msg: `Data received successfully. - ${clientId}`,
                logType: "MESSAGE",
                timestamp: `${new Date().toLocaleString()}`,
                user: clientId,
              })
              // orderResMsgs.push({
              //   msg: `Data received successfully. - ${clientId}`,
              //   logType: "MESSAGE",
              //   timestamp: `${new Date().toLocaleString()}`,
              //   user: clientId,
              // });
              // dispatch((dispatch, getState) => {
              //   const previousConsoleMsgs =
              //     getState().consoleMsgsReducer.consoleMsgs;
              //   // const newData = /* logic to get new data */
              //   // console.log("previousConsoleMsgs", [...data.orderResMsgs, ...previousConsoleMsgs])
              //   dispatch(
              //     setConsoleMsgs({
              //       consoleMsgs: [
              //         {
              //           msg: `Data received successfully. - ${clientId}`,
              //           logType: "MESSAGE",
              //           timestamp: `${new Date().toLocaleString()}`,
              //           user: clientId,
              //         },
              //         ...previousConsoleMsgs,
              //       ],
              //     }),
              //   );
              // });
              allOrders.push(...fyersOB);
            } else {
              // console.log("3");
              allOrders.push(
                ...orders.filter((order) => order["Client ID"] === clientId),
              );
            }
          }
          const allPositionDetails =
            responseData.fyers[index][clientId].fyers_positions.netPositions;
          const fyersPos = allPositionDetails.map((position) => ({
            "User ID": clientId,
            Product: position.productType,
            Exchange: position.exchange,
            Symbol: position.symbol,
            "Net Qty": position.netQty,
            LTP: position.ltp,
            "P&L": position.pl,
            "Buy Qty": position.buyQty,
            "Buy Avg Price": position.buyAvg,
            "Buy Value": position.buyVal,
            "Sell Qty": position.cfSellQty,
            "Sell Avg Price": position.sellAvg,
            "Sell Value": position.sellVal,
            "Realized Profit": position.realized_profit,
            "Unrealized profit": position.unrealized_profit,
          }));
          dispatch(
            setPositions({
              positions: fyersPos,
            }),
          );
        }
      }
    });
    return { allOrders, orderResMsgs };
  };

  useEffect(() => {
    dispatch((dispatch, getState) => {
      if (
        Object.values(Broker).reduce((acc, curr) => [...acc, ...curr], [])
          .length > 0
      ) {
        const intervalId = setInterval(async () => {
          const data = await fetchOrderData();
          // Handle the returned data here
          const orders = getState().orderBookReducer.orders;
          if (data.allOrders.length !== orders.length) {
            // console.log("return", data.orderResMsgs); // Example: Logging the data
            dispatch(
              setOrders({
                orders: data.allOrders,
              }),
            );
          }
        }, 5000);

        // Initial fetch
        fetchOrderData();

        return () => clearInterval(intervalId);
      }
    });
  }, [Broker]);

  return (
    <>
      <Routes basename="/" hashtype="noslash">
        <Route path="/" element={<Login />} />
        <Route path="/UserProfiles" element={<UserProfiles />} />
        <Route path="/Strategies" element={<Strategies />} />
        <Route path="/Equity" element={<Equity />} />
        <Route path="/F&O/Orders" element={<Orders />} />
        <Route path="/F&O/Portfolio" element={<Portfolio />} />
        <Route path="/F&O/AddPortfolio" element={<AddPortfolio />} />
        <Route path="Edit-Portfolio/:portfolio" element={<AddPortfolio />} />
        <Route path="/Positions" element={<Positions />} />
        <Route path="/Holdings" element={<Holdings />} />
        <Route path="/OrderFlow" element={<OrderFlow />} />
        <Route path="/OrderManagement" element={<OrderManagement />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Change_Password" element={<Change_Password />} />
      </Routes>
    </>
  );
}

export default App;
