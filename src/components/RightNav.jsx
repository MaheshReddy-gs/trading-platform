import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosPeople } from "react-icons/io";
import start from "../assets/start.png";
import stop from "../assets/stop.png";
import { BsFillCaretLeftFill } from "react-icons/bs";
import rightBarTrade from "../assets/rightBarTrade.png";
import OptionChain from "../assets/Options trading/option chain .png";
import OptionPortfolioExecution from "../assets/Options trading/option portfolio execution.png";
import OptionStrategies from "../assets/Options trading/Option Strategies .png";
import OptionTrading from "../assets/Options trading/Option trading .png";
import rightBarTools from "../assets/rightBarTools.png";
import QuickTradePanels from "../assets/Trading tools/Quick trade panel .png";
import ShowQuickPositionsWindow from "../assets/Trading tools/Show quick Positions Window.png";
import SquareOffAllLoggedInUsers from "../assets/Trading tools/square off all logged in users.png";
import ManualRefresh from "../assets/Trading tools/Manual refresh .png";
import ChartinkSetting from "../assets/Trading tools/chartink setting .png";
import MTMAnalyser from "../assets/Trading tools/MTM analyser.png";
import Schedule from "../assets/Trading tools/schedule.png";
import rightBarSettings from "../assets/rightBarSettings.png";
import SettingsInstallation from "../assets/settings icons/Settings and installation .png";
import FeatureRequest from "../assets/settings icons/Feature request.png";
import SaveFilledData from "../assets/settings icons/Save fillled data .png";
import TOTPManager from "../assets/settings icons/TOTP manager.png";
import ChangePassword from "../assets/settings icons/change password.png";
import ResetAppConfigurations from "../assets/settings icons/reset app configurations .png";
import RestoreBackups from "../assets/settings icons/Restore backups .png";
import ShowHiddenColumns from "../assets/settings icons/SHow hidden columns .png";
import OpenLogFolder from "../assets/settings icons/Open log folder.png";
import LastUpdate from "../assets/settings icons/Last update .png";
import AddProfile from "../assets/Add Profile.png";
import AddPortfolio from "../assets/Trading tools/Add Portfolio.png";
import Options from "../assets/Options.png";
import EnableAllPortfolio from "../assets/Trading tools/Enable All Portfolio(s).png";
import DeleteAllPortfolio from "../assets/Trading tools/Delete All Portfolio(s).png";
import DeleteEnabledPortfolio from "../assets/Trading tools/Delete Enabled Portfolio(s).png";
import DeleteMultipleUsingCondition from "../assets/Trading tools/Delete Multiple Using Condition.png";
import SqOffAllPortfolio from "../assets/Trading tools/SqOff All Portfolio(s).png";
import ExportGrid from "../assets/Trading tools/Export Grid.png";
import ResetPortiolioForm from "../assets/Trading tools/Reset Portiolio Form.png";
import PortfolioColumnSettings from "../assets/Trading tools/Portfolio Column Settings.png";
import PortfolioLegColSettings from "../assets/Trading tools/Portfolio Leg Col Settings.png";
import UserPortfolioColSettings from "../assets/Trading tools/User Portfolio Col Settings.png";
import UserLegColumnSettings from "../assets/Trading tools/User Leg Column Settings.png";
import ClearMTMAnalyserData from "../assets/Trading tools/Clear MTM Analyser Data.png";
import refreshImg from "../assets/refresh.png";
import importIMg from "../assets/import.png";
import exportIMg from "../assets/export.png";
import { OptionQuickTradePanel } from "../components/OptionQuickTradePanel";
import { QuickTradePanel } from "../components/QuickTradePanel";
import { useSelector, useDispatch } from "react-redux";
import { setPlaceOrderStart } from "../store/slices/placeOrder";
import { setConsoleMsgs } from "../store/slices/consoleMsg";
import { setBrokers } from "../store/slices/broker";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const RightCustomizeTwo = ({ rows, handleMsg }) => {
  // console.log("rows======", rows)
  const dispatch = useDispatch();
  const { placeOrderStart } = useSelector(
    (state) => state.placeOrderStartReducer,
  );

  const handlePlaceOrderStart = (e) => {
    const btn = e.target.className;
    if (btn === "start") {
      if (placeOrderStart) {
        handleMsg({
          msg: "Trading is already started.",
          logType: "MESSAGE",
          timestamp: ` ${new Date().toLocaleString()}`,
        });
        return;
      }
      if (rows.map((row) => row.inputDisabled).includes(true)) {
        dispatch(
          setPlaceOrderStart({
            placeOrderStart: rows
              .map((row) => row.inputDisabled)
              .includes(true),
          }),
        );
        document.querySelector(".stop").style.background = "#d8e1ff";
        document.querySelector(".start").style.background = "#595959";
        // Show success message for starting trading
        handleMsg({
          msg: "Trading is started.",
          logType: "SUCCESS",
          timestamp: ` ${new Date().toLocaleString()}`,
        });
      } else {
        handleMsg({
          msg: "To Start Trading, First Log In a broker account",
          logType: "MESSAGE",
          timestamp: ` ${new Date().toLocaleString()}`,
        });
      }
    } else if (btn === "stop") {
      if (!placeOrderStart) {
        handleMsg({
          msg: "Trading is already stopped.",
          logType: "MESSAGE",
          timestamp: ` ${new Date().toLocaleString()}`,
        });
        return;
      }
      if (rows.map((row) => row.inputDisabled).includes(true)) {
        dispatch(
          setPlaceOrderStart({
            placeOrderStart: false,
          }),
        );
        document.querySelector(".stop").style.background = "#595959";
        document.querySelector(".start").style.background = "#d8e1ff";
        // Show success message for stopping trading
        handleMsg({
          msg: "Trading is stopped.",
          logType: "SUCCESS",
          timestamp: ` ${new Date().toLocaleString()}`,
        });
      }
    }
  };

  return (
    <div className="right-customize-two">
      <div
        className="start"
        style={{
          background: "#d8e1ff",
          transition: "background 1s cubic-bezier(0.42, 0, 0.54, 1.27)",
        }}
        onClick={handlePlaceOrderStart}
      >
        <span className="start">Start</span>
        <img className="start" src={start} alt="start" />
      </div>
      <div
        className="stop"
        style={{
          background: "#595959",
          transition: "background 1s cubic-bezier(0.42, 0, 0.54, 1.27)",
        }}
        onClick={handlePlaceOrderStart}
      >
        <span className="stop">Stop</span>
        <img className="stop" src={stop} alt="stop" />
      </div>
    </div>
  );
};

function RightNav() {
  // qtp popup\
  const mainUser = cookies.get("USERNAME");
  const dispatch = useDispatch();
  const { brokers: rows } = useSelector((state) => state.brokerReducer);

  // const [ rows, setRows ] = useState(brokerState.brokers)

  // useEffect(() => {
  //   setRows(brokerState.brokers)
  // }, [ brokerState.brokers ])

  const updateRowData = (index, updatedData) => {
    // setRows((prevRows) => {
    const updatedRows = [ ...rows ]; // Copy the original array
    updatedRows[ index ] = { ...updatedRows[ index ], ...updatedData }; // Update the specific row
    // return updatedRows; // Set the updated array as the new state
    dispatch(
      setBrokers({
        brokers: updatedRows,
      }),
    );
    // });
  };

  // useEffect(() => {
  //   dispatch(
  //     setBrokers({
  //       brokers: rows,
  //     }),
  //   );
  // }, [ rows ]);

  const { consoleMsgs } = useSelector((state) => state.consoleMsgsReducer);

  const handleMsg = (Msg) => {
    // console.log("consoleMsgs", consoleMsgs)

    const lastMsg = consoleMsgs[ 0 ];
    // console.log("lastMsg", lastMsg);
    if (Msg.logType === "MESSAGE" || Msg.logType === "ERROR") {
      if (lastMsg && lastMsg.msg === Msg.msg && lastMsg.user === Msg.user) {
        // console.log("consoleMsgs 1", [Msg, "=", consoleMsgs.slice(1)]);
        dispatch(
          setConsoleMsgs({
            consoleMsgs: [ Msg, ...consoleMsgs.slice(1) ],
          }),
        );
      } else {
        // console.log("consoleMsgs 2", Msg, "=", consoleMsgs);
        dispatch(
          setConsoleMsgs({
            consoleMsgs: [ Msg, ...consoleMsgs ],
          }),
        );
      }
    } else {
      // console.log("consoleMsgs 3", [Msg, "=", consoleMsgs]);
      dispatch(
        setConsoleMsgs({
          consoleMsgs: [ Msg, ...consoleMsgs ],
        }),
      );
    }
  };
  const [ isOpen1, setIsOpen1 ] = useState(false);
  const [ colopen1, setColopen1 ] = useState(false);

  const toggleOpen1 = () => {
    setColopen1(!colopen1);

    const genderDetails = document.querySelector(".OP-details");
    const udbtton = document.querySelector(".UD-button");
    const sl = document.querySelector(".SL1");

    if (colopen1) {
      genderDetails.style.display = "none";
      sl.style.display = "none";
      udbtton.style.marginTop = "15px";
    } else {
      genderDetails.style.display = "block";
      sl.style.display = "block";
      udbtton.style.marginTop = "0";
    }
  };
  const [ executedPortfolios, setExecutedPortfolios ] = useState([]);

  const fetchExecutedPortfolios = async () => {
    try {
      const response = await fetch(`api/get_executed_portfolios/${mainUser}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch executed portfolios");
      }
      const data = await response.json();
      // console.log(data, "executed protfolios ");
      setExecutedPortfolios(data.ExecutedPortfolios);
    } catch (error) {
      console.error("Error fetching executed portfolios:", error.message);
    }
  };
  const handleOpenqtp = () => {
    setIsOpen1(true);
    setColopen1(false);
    fetchExecutedPortfolios();
  };

  const handleClose1 = () => {
    setIsOpen1(false);
  };

  const [ isOpen, setIsOpen ] = useState(false);
  const [ colopen, setColopen ] = useState(true);

  const toggleOpen = () => {
    setColopen(!colopen);

    const genderDetails = document.querySelector(".gender-details");
    const userButtons = document.querySelector(".user-details-button");
    const selectImage = document.querySelector(".select-image");
    const selectImages = document.querySelector(".select-images");
    const Check = document.querySelector(".check");
    const Sl = document.querySelector(".sl");

    if (colopen) {
      Check.style.display = "block";
      Sl.style.display = "block";
      genderDetails.style.display = "block";
      userButtons.style.marginTop = "0";
      selectImage.style.top = "8%";
      selectImages.style.top = "26.7%";
    } else {
      Check.style.display = "none";
      Sl.style.display = "none";
      genderDetails.style.display = "none";
      userButtons.style.marginTop = "15px";
      selectImage.style.top = "18.8%";
      selectImages.style.top = "58.8%";
    }
  };
  const handleOpen = () => {
    setColopen(true);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // qtp popup
  const [ currentDateTime, setCurrentDateTime ] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
        timeZoneName: "short",
        hour12: false,
      };
      const formattedDateTime = now.toLocaleString("en-IN", options);
      const [ weekday, day, month, year ] = formattedDateTime.split(", ");
      const rearrangedDateTime = `${day}, ${month} (${weekday}) ${year}`;
      setCurrentDateTime(rearrangedDateTime);
    };
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleBrokerLogin = async () => {
    const mandatoryFields = [ "userId", "name", "broker", "qrCode", "password" ];
    let loginMsgs = [];
    let afterLoginUpdates = [];
    let allDisabled = true;
    rows.forEach((data) => {
      if (data.enabled) {
        allDisabled = false;
        return;
      }
    });

    if (allDisabled) {
      const errorMsg = "Please enable the atleast one broker";
      handleMsg({
        msg: errorMsg,
        logType: "ERROR",
        timestamp: `${new Date().toLocaleString()}`,
        user: "USER",
      });

      return;
    }

    for (let index = 0; index < rows.length; index++) {
      const rowData = rows[ index ];
      if (!rowData.inputDisabled && rowData.enabled) {
        const unfilledFields = mandatoryFields.filter(
          (field) => !rowData[ field ],
        );
        if (unfilledFields.length > 0) {
          // console.log("in if")
          const errorMsg = `Please enter ${unfilledFields.join(", ")} to confirm broker login `;
          loginMsgs.push({
            msg: errorMsg,
            logType: "ERROR",
            timestamp: `${new Date().toLocaleString()}`,
            user: rowData.userId !== "" ? rowData.userId : "USER",
          });
        } else {
          if (!rowData.enabled) {
            continue;
          }
          // Skip validation when broker is 'pseudo account'
          if (rowData.broker !== "pseudo account") {
            // checking all fields are entered or not
            if (
              !rowData.userId ||
              (!rowData.apiKey && rowData.broker !== "fyers") ||
              !rowData.qrCode ||
              !rowData.password ||
              !rowData.broker
            ) {
              let missingFields = [];
              if (!rowData.userId) {
                missingFields.push("user Id");
              }
              if (!rowData.apiKey) missingFields.push("API Key");
              if (!rowData.qrCode) missingFields.push("QR code");
              if (!rowData.password) missingFields.push("Pin");
              if (!rowData.broker) missingFields.push("Broker");
              if (rowData.broker === "flattrade" && !rowData.secretKey) {
                missingFields.push("Secret Key");
              }
              if (rowData.broker === "finvasia" && !rowData.imei) {
                missingFields.push("Imei");
              }
              if (rowData.broker === "fyers") {
                missingFields.push("Redirect API Key");
              }

              let errorMessage =
                "Please enter the following field(s): " +
                missingFields.join(", ");
              // notifyError(errorMessage);
              handleMsg({
                msg: errorMessage,
                logType: "ERROR",
                timestamp: `${new Date().toLocaleString()}`,
                user: rowData.userId !== "" ? rowData.userId : "USER",
              });
              return;
            }
          }

          const data = {
            userId: rowData.userId,
            apiKey: rowData.apiKey,
            qrCode: rowData.qrCode,
            password: rowData.password,
            broker: rowData.broker,
            imei: rowData.imei,
            display_name: rowData.name,
            mainUser,
          };

          if (rowData.broker === "fyers") {
            data.secretKey = rowData.secretKey;
            data.client_id = rowData.fyersclientId;
            data.apiKey = null;
          }

          if (rowData.broker === "flattrade") {
            data.secretKey = rowData.secretKey;
            data.imei = null;
            data.fyersclientId = null;
          }

          if (rowData.broker === "pseudo account") {
            data.apiKey = null;
            data.pin = null;
          }
          const response = await fetch("api/datavalidation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // Convert the data to JSON format
          });

          if (!response.ok) {
            const errorData = await response.json();
            loginMsgs.push({
              msg: errorData.message || "An error occurred",
              logType: "ERROR",
              timestamp: `${new Date().toLocaleString()}`,
              user: rowData.userId,
            });
            continue;
          }

          const responseData = await response.json();
          // console.log(rowData.broker, "=", rowData.userId, "=", responseData)
          if (responseData.data) {
            afterLoginUpdates.push({
              [ index ]: {
                apiUserDetails: responseData.data.data.name,
                availableMargin: +responseData.data.data.availablecash,
                net: responseData.data.data.Net
                  ? +responseData.data.data.Net
                  : 0,
                inputDisabled: true,
              },
            });
            // updateRowData(index, {
            //   apiUserDetails: responseData.data.data.name,
            //   availableMargin: +responseData.data.data.availablecash,
            //   net: responseData.data.data.Net ? +responseData.data.data.Net : 0,
            //   inputDisabled: true
            // });
          }

          const storedData = JSON.parse(localStorage.getItem("storage"));
          // console.log(storedData);
          if (!responseData.error) {
            const dataChunk = {
              id: rowData.userId,
              margin: +responseData.data.data.availablecash,
            };
            if (storedData) {
              localStorage.setItem(
                "storage",
                JSON.stringify([ ...storedData, dataChunk ]),
              );
            } else {
              localStorage.setItem("storage", JSON.stringify([ dataChunk ]));
            }
          }

          loginMsgs.push({
            msg: `Logged In successfully. - ${rowData.userId}`,
            logType: "MESSAGE",
            timestamp: `${new Date().toLocaleString()}`,
            user: rowData.userId !== "" ? rowData.userId : "USER",
          });

          // if (index === rows.length - 1) {
          //   // console.log("after map loginMsgs",loginMsgs)
          //   dispatch(
          //     setConsoleMsgs({
          //       consoleMsgs: [ ...loginMsgs ].sort((a, b) => a.timestamp - b.timestamp)
          //     })
          //   )
          // }
          // console.log("first after return", loginMsgs)
          // handleMsg({
          //   msg: `Logged In successfully. - ${rowData.userId}`,
          //   logType: "MESSAGE",
          //   timestamp: `${new Date().toLocaleString()}`,
          //   user: rowData.userId!=="" ? rowData.userId : "USER",
          // });
          // notifySuccess(
          //   `Logged In successfully. - ${rowData.userId}`,
          //   rowData.userId,
          // );
        }
      }
    }
    // console.log("first before return", loginMsgs)
    return { loginMsgs: loginMsgs.reverse(), afterLoginUpdates };
  };

  return (
    <div className="right-sidebar">
      <div className="date-container">
        <span style={{ color: "#4661bd" }}>{currentDateTime}</span>
      </div>

      <div
        className="right-customize-one"
        onClick={async () => {
          const { loginMsgs, afterLoginUpdates } = await handleBrokerLogin();
          // console.log("login logs before lloop", loginMsgs)
          // if(loginMsgs.length===(rows.filter(row => row.enabled)).length){
          // console.log("login logs after loop", loginMsgs)
          // console.log("afterLoginUpdates after loop", afterLoginUpdates)
          const updatedBrokers = [ ...rows ];
          afterLoginUpdates.map((update) => {
            const rdxIndex = Object.keys(update)[ 0 ];
            const rdxValue = Object.values(update)[ 0 ];
            // console.log("rdxIndex", rdxIndex, "rdxValue", rdxValue)
            updatedBrokers[ rdxIndex ] = {
              ...updatedBrokers[ rdxIndex ],
              ...rdxValue,
            };
          });

          dispatch(
            setBrokers({
              brokers: updatedBrokers,
            }),
          );
          dispatch(
            setConsoleMsgs({
              consoleMsgs: [ ...loginMsgs, ...consoleMsgs ],
            }),
          );
          // }
        }}
      >
        <span>Confirm broker login</span>
        <IoIosPeople style={{ fontSize: "30px", color: "green" }} />
      </div>
      <RightCustomizeTwo handleMsg={handleMsg} rows={rows} />
      <div className="right-customize-three">
        <ul>
          <li>
            <BsFillCaretLeftFill style={{ fontSize: "20px" }} />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>Option Trading</span>
              <img src={rightBarTrade} alt="img" />
            </div>

            {/* *************** */}
            <div className="three-options">
              <div onClick={handleOpenqtp}>
                <span>Options Quick Trade Panel</span>
                <img src={OptionTrading} alt="icon" />
              </div>
              <div>
                <span>Options Stratiges payoff</span>
                <img src={OptionStrategies} alt="icon" />
              </div>
              <div>
                <span>Options Portofolio EXecution</span>
                <img src={OptionPortfolioExecution} alt="icon" />
              </div>
              <div>
                <span>Options Chain</span>
                <img src={OptionChain} alt="icon" />
              </div>
            </div>
          </li>
          <li>
            <BsFillCaretLeftFill style={{ fontSize: "20px" }} />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>Trading Tools</span>
              <img src={rightBarTools} alt="img" />
            </div>

            {/* *************** */}
            <div className="three-options">
              <div>
                <div onClick={handleOpen}>
                  <span>Quick Trade Panel</span>
                  <img src={QuickTradePanels} alt="icon" />
                </div>
              </div>
              <div>
                <span>Show Quick Positions Window</span>
                <img src={ShowQuickPositionsWindow} alt="icon" />
              </div>
              <div>
                <span>Square Off All Logged-in Users</span>
                <img src={SquareOffAllLoggedInUsers} alt="icon" />
              </div>
              <div>
                <span>Manual Refresh Script Masters</span>
                <img src={ManualRefresh} alt="icon" />
              </div>
              <div>
                <span>Chartink Screener Settings</span>
                <img src={ChartinkSetting} alt="icon" />
              </div>
              <div>
                <span>MTM Analyser</span>
                <img src={MTMAnalyser} alt="icon" />
              </div>
              <div>
                <span>Schedule Start</span>
                <img src={Schedule} alt="icon" />
              </div>
            </div>
          </li>
          <li>
            <BsFillCaretLeftFill style={{ fontSize: "20px" }} />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>Settings</span>
              <img src={rightBarSettings} alt="img" />
            </div>

            {/* *************** */}
            <div className="three-options">
              <div>
                <span>Settings and Plugins Installation</span>
                <img src={SettingsInstallation} alt="icon" />
              </div>
              <div>
                <span>Submit issue / Feature request</span>
                <img src={FeatureRequest} alt="icon" />
              </div>
              <div>
                <span>Save Filled Data in Grids</span>
                <img src={SaveFilledData} alt="icon" />
              </div>
              <div>
                <span>TOTP Manager</span>
                <img src={TOTPManager} alt="icon" />
              </div>
              <div>
                <span>Change Password</span>
                <img src={ChangePassword} alt="icon" />
              </div>
              <div>
                <span>Reset App Configurations</span>
                <img src={ResetAppConfigurations} alt="icon" />
              </div>
              <div>
                <span>Restore Auto Backups</span>
                <img src={RestoreBackups} alt="icon" />
              </div>
              <div>
                <span>Show Hidden Columns in Grids</span>
                <img src={ShowHiddenColumns} alt="icon" />
              </div>
              <div>
                <span>Open Logs Folder</span>
                <img src={OpenLogFolder} alt="icon" />
              </div>
              <div>
                <span>Last Update Change info</span>
                <img src={LastUpdate} alt="icon" />
              </div>
            </div>
          </li>
          {pathname.includes("/F&O") && (
            <>
              <li
                style={{
                  paddingTop: "0px",
                  paddingBottom: "0px",
                  paddingLeft: "0px",
                  paddingRight: "0px",
                }}
              >
                <div className="toggle-switch-container">
                  <div
                    className={`toggle-switch ${pathname.includes("/F&O/Orders") ? "active" : ""}`}
                    onClick={() => navigate("/F&O/Orders")}
                  >
                    <span>Orders</span>
                  </div>
                  <div
                    className={`toggle-switch ${pathname.includes("/F&O/Portfolio") ? "active" : ""
                      }`}
                    onClick={() => navigate("/F&O/Portfolio")}
                  >
                    <span>Portfolio</span>
                  </div>
                </div>
              </li>
              <li>
                <BsFillCaretLeftFill style={{ fontSize: "20px" }} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span>Add Portfolio</span>
                  <img src={AddProfile} alt="img" />
                </div>

                {/* *************** */}
                <div
                  className="three-options"
                  style={{
                    marginBottom: "0px",
                    marginTop: "3.2rem",
                  }}
                  onClick={() => navigate("/F&O/AddPortfolio")}
                // onClick={handleAddPortfolioClick}
                >
                  <div>
                    <span>Add Portfolio</span>
                    <img src={AddPortfolio} alt="icon" />
                  </div>
                </div>
              </li>
              <li>
                <BsFillCaretLeftFill style={{ fontSize: "20px" }} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span>Options</span>
                  <img src={Options} alt="img" />
                </div>

                {/* *************** */}
                <div className="three-options" style={{ marginTop: "-14rem" }}>
                  <div>
                    <span>Enable All Portfolio(s)</span>
                    <img src={EnableAllPortfolio} alt="icon" />
                  </div>
                  <div>
                    <span>Delete All Portfolio(s)</span>
                    <img src={DeleteAllPortfolio} alt="icon" />
                  </div>
                  <div>
                    <span>Delete Enabled Portfolio(s)</span>
                    <img src={DeleteEnabledPortfolio} alt="icon" />
                  </div>
                  <div>
                    <span>Delete Multiple Using Condition</span>
                    <img src={DeleteMultipleUsingCondition} alt="icon" />
                  </div>
                  <div>
                    <span>SqOff All Portfolio(s)</span>
                    <img src={SqOffAllPortfolio} alt="icon" />
                  </div>
                  <div>
                    <span>Export Grid</span>
                    <img src={ExportGrid} alt="icon" />
                  </div>
                  <div>
                    <span>Reset Portiolio Form</span>
                    <img src={ResetPortiolioForm} alt="icon" />
                  </div>
                  <div>
                    <span>Portfolio Column Settings</span>
                    <img src={PortfolioColumnSettings} alt="icon" />
                  </div>
                  <div>
                    <span>Portfolio Leg Col Settings</span>
                    <img src={PortfolioLegColSettings} alt="icon" />
                  </div>
                  <div>
                    <span>User Portfolio Col Settings</span>
                    <img src={UserPortfolioColSettings} alt="icon" />
                  </div>
                  <div>
                    <span>User Leg Column Settings</span>
                    <img src={UserLegColumnSettings} alt="icon" />
                  </div>
                  <div>
                    <span>Clear MTM Analyser Data</span>
                    <img src={ClearMTMAnalyserData} alt="icon" />
                  </div>
                </div>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="right-customize-four">
        <div>
          <img src={refreshImg} alt="img" />
          <span>Refresh</span>
        </div>
        <div>
          <img src={importIMg} alt="img" />
          <span>Import</span>
        </div>
        <div>
          <img src={exportIMg} alt="img" />
          <span>Export</span>
        </div>
      </div>
      <OptionQuickTradePanel
        colopen1={colopen1}
        toggleOpen1={toggleOpen1}
        handleClose1={handleClose1}
        isOpen1={isOpen1}
        setIsOpen1={setIsOpen1}
        executedPortfolios={executedPortfolios}
      />
      <QuickTradePanel
        handleClose={handleClose}
        toggleOpen={toggleOpen}
        colopen={colopen}
        isOpen={isOpen}
      />
    </div>
  );
}

export default RightNav;
