import React, { useState, useRef, memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MarketIndex from "../components/MarketIndex";
import LeftNav from "../components/LeftNav";
import RightNav from "../components/RightNav";
import { ErrorContainer } from "../components/ErrorConsole";
import { TopNav } from "../components/TopNav";
import filterIcon from "../assets/newFilter.png";
import Delete from "../assets/recycle5.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Log from "../assets/log.png";
import Start from "../assets/start_2.png";
import Logout from "../assets/logout.png";
import Stop from "../assets/stop.png";
import Stop2 from "../assets/stop2.png";
import { useSelector, useDispatch } from "react-redux";
import { setAllSeq } from "../store/slices/colSeq";
import { setAllVis } from "../store/slices/colVis";
import { setConsoleMsgs } from "../store/slices/consoleMsg";
import { setStrategies } from "../store/slices/strategy";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import Modal from "react-modal";
import Draggable from "react-draggable";

function Strategies() {
  const tableRef = useRef(null);
  const mainUser = cookies.get("USERNAME");

  const { collapsed } = useSelector((state) => state.collapseReducer);

  const dispatch = useDispatch();
  const { consoleMsgs } = useSelector((state) => state.consoleMsgsReducer);
  const [ showSelectBox1, setShowSelectBox1 ] = useState(false);
  const [ clearedCells, setClearedCells ] = useState([]);
  const { strategies: data } = useSelector((state) => state.strategyReducer); // console.log("startegyState", startegyState)
  // const [ data, setData ] = useState(startegyState.strategies);

  // useEffect(() => {
  //   setData(startegyState.strategies);
  // }, [ startegyState.strategies ]);

  // useEffect(() => {
  //   dispatch(
  //     setStrategies({
  //       strategies: data,
  //     }),
  //   );
  // }, [ data ]);



  const handleClickOutside = (e) => {
    const allowedElements = [ ".dropdown-menu", ".popTableHead img" ];
    if (!allowedElements.some((element) => e.target.closest(element))) {
      setIsdropDownOpenMargin(false);
      setIsdropDownOpenBroker(false);
      setIsdropDownOpenUserID(false);
    }
  };

  const [ filteredRows1, setFilteredRows1 ] = useState(data);
  useEffect(() => {
    setFilteredRows1(data);
  }, [ data ]);

  const updateFilteredRows1 = ({
    userIdSelected1,
    maxProfitSelected1,
    maxLossSelected1,
    netSelected1,
    setuniqueDatauserId1,
    setuniqueDataNet1,
    setuniqueDataMaxProfit1,
    setuniqueDataMaxLoss1,
  }) => {
    let prevfilteredRows;
    if (userIdSelected1.length !== 0) {
      prevfilteredRows = data.filter((row) =>
        userIdSelected1.includes(row.StrategyLabel.toLowerCase()),
      );
    } else {
      prevfilteredRows = data;
    }
    if (netSelected1.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        netSelected1.includes(row.PL.toLowerCase()),
      );
    }
    if (maxProfitSelected1.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        maxProfitSelected1.includes(row.MaxProfit.toLowerCase()),
      );
    }
    if (maxLossSelected1.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        maxLossSelected1.includes(row.MaxLoss.toLowerCase()),
      );
    }
    setFilteredRows1(prevfilteredRows);
    setuniqueDatauserId1(() => {
      return Array.from(
        new Set(prevfilteredRows.map((row) => row.StrategyLabel)),
      );
    });
    setuniqueDataNet1(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((row) => {
            if (row.PL !== "") {
              return row.PL;
            }
          }),
        ),
      );
    });
    setuniqueDataMaxProfit1(() => {
      return Array.from(new Set(prevfilteredRows.map((row) => row.MaxProfit)));
    });
    setuniqueDataMaxLoss1(() => {
      return Array.from(new Set(prevfilteredRows.map((row) => row.MaxLoss)));
    });
  };

  const handleOkClick1 = () => {
    updateFilteredRows1({
      userIdSelected1,
      setuserIdSelected1,
      setSelectAllForId1,
      maxProfitSelected1,
      maxLossSelected1,
      setMaxProfitSelected1,
      setMaxLossSelected1,
      setSelectAllMaxProfit1,
      setSelectAllMaxLoss1,
      netSelected1,
      setNetSelected1,
      setSelectAllNet1,
      setuniqueDatauserId1,
      setuniqueDataNet1,
      setuniqueDataMaxProfit1,
      setuniqueDataMaxLoss1,
    });
    if (userIdSelected1) {
      setShowSearchId1(false);
    }
    if (maxProfitSelected1) {
      setShowSearchMaxProfit1(false);
    }
    if (maxLossSelected1) {
      setShowSearchMaxLoss1(false);
    }
    if (netSelected1) {
      setShowSearchNet1(false);
    }
  };

  const [ showSearchId1, setShowSearchId1 ] = useState(false);
  const [ showSearchMaxProfit1, setShowSearchMaxProfit1 ] = useState(false);
  const [ showSearchMaxLoss1, setShowSearchMaxLoss1 ] = useState(false);
  const [ showSearchNet1, setShowSearchNet1 ] = useState(false);

  const handleCloseAllSearchBox = (e) => {
    const allowedElements = [ "th img", ".Filter-popup" ];
    if (!allowedElements.some((element) => e.target.closest(element))) {
      // The click was outside of the allowed elements, perform your function here
      setShowSearchId1(false);
      setShowSearchMaxProfit1(false);
      setShowSearchMaxLoss1(false);
      setShowSearchNet1(false);
    }
  };

  const [ selectAllForId1, setSelectAllForId1 ] = useState(false);
  const [ selectAllNet1, setSelectAllNet1 ] = useState(false);
  const [ selectAllMaxProfit1, setSelectAllMaxProfit1 ] = useState(false);
  const [ selectAllMaxLoss1, setSelectAllMaxLoss1 ] = useState(false);

  const [ uniqueDatauserId1, setuniqueDatauserId1 ] = useState([]);
  const [ uniqueDataNet1, setuniqueDataNet1 ] = useState([]);
  const [ uniqueDataMaxProfit1, setuniqueDataMaxProfit1 ] = useState([]);
  const [ uniqueDataMaxLoss1, setuniqueDataMaxLoss1 ] = useState([]);

  const [ userIdSelected1, setuserIdSelected1 ] = useState([]);
  const [ maxProfitSelected1, setMaxProfitSelected1 ] = useState([]);
  const [ netSelected1, setNetSelected1 ] = useState([]);
  const [ maxLossSelected1, setMaxLossSelected1 ] = useState([]);

  useEffect(() => {
    // console.log("stpage data", data)
    setuniqueDatauserId1(
      data ? [ ...new Set(data.map((d) => d.StrategyLabel)) ] : [],
    );

    setuniqueDataMaxProfit1(
      data ? [ ...new Set(data.map((d) => d.MaxProfit)) ] : [],
    );

    setuniqueDataMaxLoss1(data ? [ ...new Set(data.map((d) => d.MaxLoss)) ] : []);

    setuniqueDataNet1([
      ...new Set(
        data.map((d) => {
          if (d.PL !== "") {
            return d.PL;
          }
        }),
      ),
    ]);
  }, [ data ]);

  const handleCheckboxChangeNet1 = (PL) => {
    const isSelected = netSelected1.includes(PL);
    if (isSelected) {
      setNetSelected1(netSelected1.filter((item) => item !== PL));
      setSelectAllNet1(false);
    } else {
      setNetSelected1((prevSelected) => [ ...prevSelected, PL ]);
      setSelectAllNet1(netSelected1.length === uniqueDataNet1.length - 1);
    }
  };

  const handleSelectAllForNet1 = () => {
    const allChecked = !selectAllNet1;
    setSelectAllNet1(allChecked);

    if (allChecked) {
      setNetSelected1(uniqueDataNet1.map((d) => d));
    } else {
      setNetSelected1([]);
    }
  };

  const handleCheckboxChangeUser1 = (StrategyLabel) => {
    const isSelected = userIdSelected1.includes(StrategyLabel);
    if (isSelected) {
      setuserIdSelected1(
        userIdSelected1.filter((item) => item !== StrategyLabel),
      );
      setSelectAllForId1(false);
    } else {
      setuserIdSelected1((prevSelected) => [ ...prevSelected, StrategyLabel ]);
      setSelectAllForId1(
        userIdSelected1.length === uniqueDatauserId1.length - 1,
      );
    }
  };

  const handleSelectAllForUserId1 = () => {
    const allChecked = !selectAllForId1;
    setSelectAllForId1(allChecked);
    if (allChecked) {
      setuserIdSelected1(uniqueDatauserId1.map((d) => d.toLowerCase()));
    } else {
      setuserIdSelected1([]);
    }
  };

  const handleCheckBoxChangeForMaxProfit1 = (MaxProfit) => {
    const isSelected = maxProfitSelected1.includes(MaxProfit);
    if (isSelected) {
      setMaxProfitSelected1((prevSelected) =>
        prevSelected.filter((item) => item !== MaxProfit),
      );
      setSelectAllMaxProfit1(false);
    } else {
      setMaxProfitSelected1((prevSelected) => [ ...prevSelected, MaxProfit ]);
      setSelectAllMaxProfit1(
        maxProfitSelected1.length === uniqueDataMaxProfit1.length - 1,
      );
    }
  };

  const handleCheckBoxChangeForMaxLoss1 = (MaxLoss) => {
    const isSelected = maxLossSelected1.includes(MaxLoss);
    if (isSelected) {
      setMaxLossSelected1((prevSelected) =>
        prevSelected.filter((item) => item !== MaxLoss),
      );
      setSelectAllMaxLoss1(false);
    } else {
      setMaxLossSelected1((prevSelected) => [ ...prevSelected, MaxLoss ]);
      setSelectAllMaxLoss1(
        maxLossSelected1.length === uniqueDataMaxLoss1.length - 1,
      );
    }
  };

  const handleSelectAllForMaxProfit1 = () => {
    const allChecked = !selectAllMaxProfit1;
    setSelectAllMaxProfit1(allChecked);

    if (allChecked) {
      setMaxProfitSelected1(uniqueDataMaxProfit1.map((d) => d.toString()));
    } else {
      setMaxProfitSelected1([]);
    }
  };

  const handleSelectAllForMaxLoss1 = () => {
    const allChecked = !selectAllMaxLoss1;
    setSelectAllMaxLoss1(allChecked);

    if (allChecked) {
      setMaxLossSelected1(uniqueDataMaxLoss1.map((d) => d.toString()));
    } else {
      setMaxLossSelected1([]);
    }
  };
  const [ dataNew, setDataNew ] = useState([
    {
      Select: false,
      UserID: "Simulitor",
      Alias: "name",
      Multiplier: 1,
      Broker: "pseudoaccount",
      Margin: "100000",
    },
    // Add more objects for additional rows...
  ]);

  const errorContainerRef = useRef(null);
  // Error Message start
  const [ msgs, setMsgs ] = useState([]);
  const navigate = useNavigate();
  const [ userData, setUserData ] = useState(null);
  const [ filteredDataNew, setfilteredDataNew ] = useState([]);

  useEffect(() => {
    setfilteredDataNew(dataNew);
  }, [ dataNew ]);

  // useEffect(() => {
  //   console.log("filteredDataNew", filteredDataNew)
  // }, [ filteredDataNew ])

  const handleClearLogs = () => {
    if (msgs.length === 0) return; //guard clause
    setMsgs([]);
  };
  const handleMsg = (Msg) => {
    const lastMsg = consoleMsgs[ 0 ];
    if (Msg.logType === "MESSAGE" || Msg.logType === "ERROR") {
      if (
        lastMsg &&
        lastMsg.msg === Msg.msg &&
        lastMsg.user === Msg.user &&
        lastMsg.strategy === Msg.strategy
      ) {
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
  // Error Message end
  const [ isErrorDisplayed, setIsErrorDisplayed ] = useState(false);

  // st colvisible
  const addNewRow = () => {
    const mandatoryFields = [ "StrategyLabel", "TradingAccount" ];

    const lastRow = data[ data.length - 1 ];
    const allFieldsFilled = mandatoryFields.every((field) => lastRow[ field ]);

    if (allFieldsFilled) {
      setIsErrorDisplayed(false);

      const newStrategyLabel = lastRow[ "StrategyLabel" ];
      const isUnique =
        data.length < 2 ||
        data
          .slice(0, -1)
          .every((row) => row[ "StrategyLabel" ] !== newStrategyLabel);

      if (isUnique) {
        setIsErrorDisplayed(false);

        const newRow = {
          Action: {
            enabled: false,
            logged: false,
          },
          ManualSquareOff: "",
          StrategyLabel: "",
          PL: "0",
          TradeSize: "0",
          DuplicateSignalPrevention: "0",
          OpenTime: "00:00:00",
          CloseTime: "00:00:00",
          SqOffTime: "00:00:00",
          TradingAccount: "",
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

        // setData((prevData) => [ ...prevData, newRow ]);
        dispatch(
          setStrategies({
            strategies: [ ...data, newRow ],
          }),
        );
      } else {
        if (!isErrorDisplayed) {
          handleMsg({
            msg: "Please enter a unique strategy label before adding a new row.",
            logType: "ERROR",
            timestamp: `${new Date().toLocaleString()}`,
            strategy: "strategy",
          });
          setIsErrorDisplayed(true);
        }
      }
    } else {
      if (!isErrorDisplayed) {
        handleMsg({
          msg: "Please enter strategy label and trading account before adding a new row.",
          logType: "ERROR",
          timestamp: `${new Date().toLocaleString()}`,
          strategy: "strategy",
        });
        setIsErrorDisplayed(true);
      }
    }
  };
  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      if (tableRef.current) {
        tableRef.current.scrollLeft = 0; /* Set to a larger value */
        tableRef.current.scrollTop = tableRef.current.scrollHeight;
      }
    }, 100); // Adjust the timeout as needed

    return () => clearTimeout(scrollTimeout); // Clear the timeout if the component unmounts or data changes
  }, [ data.length ]);
  const [ isModalOpen, setModalOpen ] = useState(false);
  const handleCellClick = (tradingAccountData, index) => {
    if (!data[ index ].StrategyLabel) {
      handleMsg({
        msg: "Please enter the Strategy Label",
        logType: "ERROR",
        timestamp: ` ${new Date().toLocaleString()}`,
        strategy: "strategy",
      });
    } else {
      setSelectedTradingAccount({
        ...tradingAccountData,
        StrategyLabel: data[ index ].StrategyLabel,
      });
      setModalOpen(true);
      setClickedRowIndex(index); // Save the index of the clicked row
      // setting checkbox ticked
      const checkedboxes = data[ index ].TradingAccount.split(",").map((item) =>
        item.trim(),
      );

      setDataNew((prevData) => {
        return prevData.map((item) => {
          if (checkedboxes.includes(item.UserID.trim())) {
            return { ...item, Select: true };
          }
          return item; // Return unchanged for other objects
        });
      });
    }
  };
  const [ selectedTradingAccount, setSelectedTradingAccount ] = useState(null);

  const handleCloseModal = () => {
    setSelectedTradingAccount(null);
    setModalOpen(false);
    // Unchecking all checkboxes
    setDataNew((prevData) => {
      return prevData.map((item) => {
        return { ...item, Select: false };
      });
    });
  };
  const [ clickedRowIndex, setClickedRowIndex ] = useState(-1);

  const [ selectAllChecked, setSelectAllChecked ] = useState(false);

  const handleSelectAll = () => {
    setisPopUpDataChanged(true);
    const allChecked = dataNew.every((item) => item.Select);
    setSelectAllChecked(!allChecked);
    setDataNew((prevData) =>
      prevData.map((item) => {
        return { ...item, Select: !allChecked };
      }),
    );
  };

  const [ isdropDownOpenUserID, setIsdropDownOpenUserID ] = useState(false);
  const [ isdropDownOpenBroker, setIsdropDownOpenBroker ] = useState(false);
  const [ isdropDownOpenMargin, setIsdropDownOpenMargin ] = useState(false);
  const [ isdropDownOpenAlias, setIsdropDownOpenAlias ] = useState(false);

  const [ isPopUpDataChanged, setisPopUpDataChanged ] = useState(false);

  const handleCheckboxChange = (index) => {
    // console.log("handleCheckboxChange ");
    setisPopUpDataChanged(true);
    // const newData = dataNew.map((item, i) => ({
    //   ...item,
    //   Select: i === index ? !item.Select : item.Select,
    // }));
    setDataNew((prevDaata) => {
      const newData = prevDaata.map((item, i) => ({
        ...item,
        Select: i === index ? !item.Select : item.Select,
      }));
      // console.log("newData", newData);
      setSelectAllChecked(newData.every((item) => item.Select));
      return newData;
    });
  };

  const isAtLeastOneItemSelected = () => {
    const selectedItems = dataNew
      .slice(1)
      .filter((item) => item.Select === true);
    return selectedItems.length > 0;
  };

  const handleConfirm = () => {
    setisPopUpDataChanged(false);
    const selectedStrategies = dataNew.filter((item) => item.Select === true);
    const stringVal = selectedStrategies.map((item) => item.UserID).join(", ");

    // console.log(
    //   "Selected Strategies:",
    //   selectedStrategies.map((item) => item.UserID).join(", "),
    // );
    const newData = [ ...data ];
    if (clickedRowIndex !== -1) {
      newData[ clickedRowIndex ] = {
        ...newData[ clickedRowIndex ],
        // TradingAccount: stringVal || 'sim1',
        TradingAccount: stringVal || "",
        // Select: false
      };
      // console.log("Updated Data:", newData);
    }
    dispatch(
      setStrategies({
        strategies: newData,
      }),
    );

    // post request to backend
    const postBroker = async () => {
      const username = cookies.get("USERNAME");
      try {
        const postdata = {
          broker_user_id: selectedStrategies.map((item) => {
            return item.UserID;
          }),
          broker: selectedStrategies.map((item) => {
            return item.Broker;
          }),
          multiplier: selectedStrategies.map((item) => {
            return item.Multiplier;
          }),
          strategy_tag: data[ clickedRowIndex ].StrategyLabel,
          alias: selectedStrategies.map((item) => {
            return item.Alias;
          }),
        };

        // console.log(postdata);

        const response = await fetch(
          `/api/store_broker_and_strategy_info/${username}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postdata),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          // console.log("error-post", errorData);
          throw {
            message:
              errorData.message || "Something bad happened. Please try again",
          };
        }
        const responseData = await response.json();
        handleMsg({
          msg: responseData.message,
          logType: "SUCCESS",
          timestamp: `${new Date().toLocaleString()}`,
          strategy: data[ clickedRowIndex ].StrategyLabel,
        });
      } catch (error) {
        // console.log(error.message);

        handleMsg({
          msg: error.message,
          logType: "ERROR",
          timestamp: `${new Date().toLocaleString()}`,
          strategy: data[ clickedRowIndex ].StrategyLabel,
        });
      }
    };

    postBroker();

    handleCloseModal();
  };

  const { brokers } = useSelector((state) => state.brokerReducer);

  const handleManualSquareOff = async (strategyLabel, TradingAccount) => {
    try {
      // console.log(TradingAccount.split(", "), "TradingAccount");
      const mappedUserIds = TradingAccount.split(", ");

      for (let index = 0; index < mappedUserIds.length; index++) {
        const rowData = brokers.filter(
          (row) => row.userId === mappedUserIds[ index ],
        )[ 0 ];
        // console.log("rowData", rowData)
        if (rowData.broker === "fyers") {
          const response = await fetch(
            `api/manual_square_off/${mainUser}/${strategyLabel}/${rowData.userId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          // console.log("Response received:", response);
          if (!response.ok) {
            // console.log("123");
            const errorData = await response.json();
            // console.log("456");
            // console.log({
            //   msg: errorData.message,
            //   logType: "ERROR",
            //   timestamp: `${new Date().toLocaleString()}`,
            //   user: rowData.userId,
            //   strategy: strategyLabel,
            // });
            handleMsg({
              msg: errorData.message,
              logType: "ERROR",
              timestamp: `${new Date().toLocaleString()}`,
              user: rowData.userId,
              strategy: strategyLabel,
            });
            // throw new Error(
            //   errorData.message || "Something bad happened. Please try again",
            // );
          }
          const responseData = await response.json();
          handleMsg({
            msg: responseData.message,
            logType: "MESSAGE",
            timestamp: `${new Date().toLocaleString()}`,
            user: TradingAccount,
            strategy: strategyLabel,
          });
          // console.log(responseData, "")
        }
        if (rowData.broker === "angelone") {
          // console.log(
          //   "angelone api ",
          //   `api/angelone_manual_square_off/${mainUser}/${strategyLabel}/${rowData.userId}`,
          // );
          const response = await fetch(
            `api/angelone_manual_square_off/${mainUser}/${strategyLabel}/${rowData.userId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          // console.log("Response received:", response);
          if (!response.ok) {
            const errorData = await response.json();
            handleMsg({
              msg: errorData.message,
              logType: "ERROR",
              timestamp: `${new Date().toLocaleString()}`,
              user: rowData.userId,
              strategy: strategyLabel,
            });
            // console.log({
            //   msg: errorData.message,
            //   logType: "ERROR",
            //   timestamp: `${new Date().toLocaleString()}`,
            //   user: rowData.userId,
            //   strategy: strategyLabel,
            // });
            // throw new Error(
            //   errorData.message || "Something bad happened. Please try again",
            // );
          }
          const responseData = await response.json();
          handleMsg({
            msg: responseData.message,
            logType: "MESSAGE",
            timestamp: `${new Date().toLocaleString()}`,
            user: TradingAccount,
            strategy: strategyLabel,
          });
          // console.log(responseData, "")
        }
      }
    } catch (error) {
      console.error("Error occurred:", error.message);
    }
  };

  const handleInputChangeInputs = (index, fieldName, value) => {
    setDataNew((prevData) => {
      const newData = [ ...prevData ];
      newData.forEach((row) => {
        row[ fieldName ] = value;
      });

      return newData;
    });
  };

  useEffect(() => {
    const fetchData = async (username) => {
      try {
        const response = await fetch(`/api/get_startegy_account/${username}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("strategies details", data);
        setUserData(data);

        // Getting data from local storage
        const storedData = JSON.parse(localStorage.getItem("storage"));
        // console.log(storedData);

        const findLastMarginById = (idToFind) => {
          const matchingItems = storedData.filter(
            (item) => item.id == idToFind,
          );
          return matchingItems.length > 0
            ? matchingItems[ matchingItems.length - 1 ].margin
            : 1;
        };

        // Update dataNew with only 'userID' and 'broker'
        const newData = data.data.map((account) => ({
          Select: false,
          UserID: account.broker_id,
          Broker: account.broker,
          Alias: account.display_name,
          Multiplier: selectedTradingAccount
            ? account.multiplier[ selectedTradingAccount.StrategyLabel ]
            : 1,
          Margin: brokers.filter((row) => account.broker_id === row.userId)[ 0 ][
            "availableMargin"
          ],
        }));

        // console.log(newData, "neww");
        // console.log(data, 'mahesh');
        const postData = [
          {
            Select: false,
            UserID: "Simulitor",
            Alias: "name",
            Multiplier: 1, // Use the Multiplier value from newData
            Broker: "pseudoaccount",
            Margin: "100000",
          },
          ...newData, // Include the remaining newData
        ];

        // Preserve the existing checkbox state
        const updatedDataNew = postData.map((item, index) => ({
          ...item,
          Select: dataNew[ index ] ? dataNew[ index ].Select : false,
        }));

        setDataNew(updatedDataNew);
        setfilteredDataNew(updatedDataNew);

        // console.log(newData, 'newdataprinting');
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(cookies.get("USERNAME"));
  }, [ selectedTradingAccount ]);

  const [ allStrategiesList, setallStrategiesList ] = useState([]);

  const stPageCols = [
    "Action",
    "Manual Square Off",
    "Strategy Label",
    "P L",
    "Trade Size",
    "Duplicate Signal Prevention",
    "Open Time",
    "Close Time",
    "Sq Off Time",
    "Trading Account",
    "Max Profit",
    "Max Loss",
    "Max Loss Wait Time",
    "Profit Locking",
    "Delay Between Users",
    "Unique ID Req for Order",
    "Cancel Previous Open Signal",
    "Stop Reverse",
    "Part Multi Exists",
    "Hold Sell Seconds",
    "Allowed Trades",
    "Entry Order Retry",
    "Entry Retry Count",
    "Entry Retry Wait Seconds",
    "Exit Order Retry",
    "Exit Retry Count",
    "Exit Retry Wait Seconds",
    "Exit Max Wait Seconds",
    "Sq Off Done",
    "Delta",
    "Theta",
    "Vega",
  ];

  const allSeqState = useSelector((state) => state.allSeqReducer);
  const allVisState = useSelector((state) => state.allVisReducer);

  const [ stColVis, setstColVis ] = useState(allVisState.strategiesVis);

  // empty state define
  const handleStrategyRowDelete = async (index) => {
    try {
      const username = cookies.get("USERNAME");
      const strategyLabel = data[ index ]?.StrategyLabel;
      const tradingAccount = data[ index ]?.TradingAccount;

      // console.log("USERNAME:", username);
      // console.log("StrategyLabel:", strategyLabel);

      if (!username || !strategyLabel || !tradingAccount) {
        // If required data is not present, only update UI state without fetch request
        const updatedRows = data.filter((_, i) => i !== index);
        // setData([ ...updatedRows ]);
        dispatch(
          setStrategies({
            strategies: updatedRows,
          }),
        );

        // Display success message for row deletion
        handleMsg({
          msg: `Row Deleted  Successfully`,
          logType: "SUCCESS",
          timestamp: `${new Date().toLocaleString()}`,
          strategy: "strategy",
        });

        return; // Exit the function without making a fetch request
      }

      // Make DELETE request
      const response = await fetch(
        `/api/delete_strategy_tag/${username}/${strategyLabel}`,
        {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Something bad happened. Please try again",
        );
      }

      // Update UI state after successful fetch request
      const updatedRows = data.filter((_, i) => i !== index);
      // setData([ ...updatedRows ]);
      dispatch(
        setStrategies({
          strategies: updatedRows,
        }),
      );

      // Display success message for fetch request
      const responseData = await response.json();
      handleMsg({
        msg: `${responseData.message} -  ${strategyLabel}`,
        logType: "SUCCESS",
        timestamp: `${new Date().toLocaleString()}`,
        strategy: "strategy",
      });

      // console.log(responseData.message, '123')
    } catch (error) {
      // Handle errors during the fetch request or invalid data
      console.error("Error:", error.message);
      handleMsg({
        msg: error.message,
        logType: "ERROR",
        timestamp: `${new Date().toLocaleString()}`,
        strategy: "strategy",
      });
    }
  };

  const handleInputChange = (index, fieldName, value) => {
    // setData((prevData) => {
    let newData = [ ...data ];
    // console.log("newData", newData)
    const newStrategyLabel = value.toUpperCase().trim();

    // Check for uniqueness only when StrategyLabel is changed and it's not empty
    if (fieldName === "StrategyLabel" && newStrategyLabel !== "") {
      // console.log("newStrategyLabel", newStrategyLabel)
      const isUnique =
        newData.length < 2 ||
        newData
          .slice(0, -1)
          .every(
            (row) => row[ "StrategyLabel" ].toUpperCase() !== newStrategyLabel,
          );

      if (!isUnique) {
        newData[ index ] = {
          ...newData[ index ],
          [ fieldName ]: "",
        };

        setClearedCells((prevClearedCells) => [ ...prevClearedCells, index ]);

        const currentRowInput = document.getElementById(
          `input_${index}_StrategyLabel`,
        );
        if (currentRowInput) {
          currentRowInput.focus();
        }

        handleMsg({
          msg: "Strategy tag must be unique",
          logType: "ERROR",
          timestamp: `${new Date().toLocaleString()}`,
          strategy: "strategy",
        });
      } else {
        setClearedCells((prevClearedCells) =>
          prevClearedCells.filter((clearedIndex) => clearedIndex !== index),
        );
      }
    }
    // console.log("newData[index][fieldName] ", newData[index])

    newData[ index ] = {
      ...newData[ index ],
      [ fieldName ]: newStrategyLabel,
    };
    // return newData;
    dispatch(
      setStrategies({
        strategies: newData,
      }),
    );
    // });
  };

  const updateActionProperty = (index, property, value) => {
    // setData((prevData) => {
    // Create a copy of the data array
    const newData = [ ...data ];

    // Create a copy of the Action object for the specified index
    const updatedAction = { ...newData[ index ].Action };

    // Update the specified property inside the Action object
    updatedAction[ property ] = value;

    // Update the Action object inside the data array for the specified index
    newData[ index ] = { ...newData[ index ], Action: updatedAction };

    // return newData;
    dispatch(
      setStrategies({
        strategies: newData,
      }),
    ); // Update the state with the new data array
    // });
  };

  const [ stColsSelectedALL, setstColsSelectedALL ] = useState(false);

  const stPageColSelectAll = () => {
    setstColsSelectedALL((prev) => !prev);
    stPageCols.map((stPageCol) => {
      setstColVis((prev) => ({
        ...prev,
        [ stPageCol ]: stColsSelectedALL,
      }));
    });
  };

  const [ strategiesSeq, setstrategiesSeq ] = useState(allSeqState.strategiesSeq);

  useEffect(() => {
    setstrategiesSeq(allSeqState.strategiesSeq);
    setstColVis((prev) => {
      const colVis = {};
      Object.keys(stColVis).map((col) => {
        if (allSeqState.strategiesSeq.includes(col)) {
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
        strategiesVis: stColVis,
      }),
    );
    if (new Set(Object.values(stColVis)).size === 1) {
      if (Object.values(stColVis).includes(true)) {
        setstrategiesSeq(stPageCols);
      } else {
        setstrategiesSeq([]);
      }
    }
  }, [ stColVis ]);

  useEffect(() => {
    // console.log("userProfSeq", userProfSeq)
    dispatch(
      setAllSeq({
        ...allSeqState,
        strategiesSeq: strategiesSeq,
      }),
    );
  }, [ strategiesSeq ]);

  const [ actionFilter, setActionFilter ] = useState("all");

  const strategiesTH = {
    Action: stColVis[ "Action" ] && (
      <th>
        <div>
          <small>Action</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "5px",
            }}
            onClick={() => {
              setShowSelectBox1((prev) => !prev);
            }}
          />
        </div>
        {showSelectBox1 && (
          <div>
            {/* Inside your <select> element */}
            <select
              type="text"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              style={{
                padding: "0.1rem 0.3rem",
                width: "100%",
                margin: "1px",
              }}
            >
              <option value="all">All</option>
              <option value="checked">Enable</option>
              <option value="unchecked">Disable</option>
            </select>
          </div>
        )}
      </th>
    ),
    "Manual Square Off": stColVis[ "Manual Square Off" ] && (
      <th>
        <div>
          <small>Manual Square Off</small>
        </div>
      </th>
    ),
    "Strategy Label": stColVis[ "Strategy Label" ] && (
      <th>
        <div>
          <small>Strategy Label</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-15px",
            }}
            onClick={() => {
              setShowSearchId1((prev) => !prev);
              setShowSearchMaxProfit1(false);
              setShowSearchMaxLoss1(false);
              setShowSearchNet1(false);
            }}
          />
        </div>
        {showSearchId1 && (
          <div className="Filter-popup">
            <form id="filter-form-user" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{
                      width: "12px",
                      marginRight: "5px",
                    }}
                    checked={selectAllForId1}
                    onChange={handleSelectAllForUserId1}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDatauserId1
                    .filter((name) => name !== undefined)
                    .map((StrategyLabel, index) => {
                      return (
                        <div key={index} className="filter-inputs">
                          <input
                            type="checkbox"
                            style={{
                              width: "15px",
                            }}
                            checked={userIdSelected1.includes(
                              StrategyLabel.toLowerCase(),
                            )}
                            onChange={() =>
                              handleCheckboxChangeUser1(
                                StrategyLabel.toLowerCase(),
                              )
                            }
                          />
                          <label>{StrategyLabel}</label>
                        </div>
                      );
                    })}
                </li>
              </ul>
            </form>

            <div className="filter-popup-footer">
              <button onClick={handleOkClick1}>OK</button>
              <button onClick={() => setShowSearchId1((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "P L": stColVis[ "P L" ] && (
      <th>
        <div>
          <small>P&L</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-35px",
            }}
            onClick={() => {
              setShowSearchNet1((prev) => !prev);
              setShowSearchId1(false);
              setShowSearchMaxProfit1(false);
              setShowSearchMaxLoss1(false);
            }}
          />
        </div>

        {showSearchNet1 && (
          <div className="Filter-popup">
            <form id="filter-form-net" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{
                      width: "12px",
                      marginRight: "5px",
                    }}
                    checked={selectAllNet1}
                    onChange={handleSelectAllForNet1}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataNet1
                    .filter((name) => name !== undefined)
                    .map((PL, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={netSelected1.includes(PL)}
                          onChange={() => handleCheckboxChangeNet1(PL)}
                        />
                        <label>{PL}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick1}>OK</button>
              <button onClick={() => setShowSearchNet1((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Trade Size": stColVis[ "Trade Size" ] && (
      <th>
        <div>
          <small>Trade Size</small>
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
    "Duplicate Signal Prevention": stColVis[ "Duplicate Signal Prevention" ] && (
      <th>
        <div>
          <small>
            Duplicate Signal <br />
            Prevention
          </small>
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
    "Open Time": stColVis[ "Open Time" ] && (
      <th>
        <div>
          <small>Open Time</small>
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
    "Close Time": stColVis[ "Close Time" ] && (
      <th>
        <div>
          <small>Close Time</small>
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
      </th>
    ),
    "Sq Off Time": stColVis[ "Sq Off Time" ] && (
      <th>
        <div>
          <small>Sq Off Time</small>
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
      </th>
    ),
    "Trading Account": stColVis[ "Trading Account" ] && (
      <th>
        <div style={{ display: "flex", alignItems: "center" }}>
          <small style={{ marginLeft: "37%" }}>Trading Account</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginRight: "36%",
            }}
          />
        </div>
      </th>
    ),
    "Max Profit": stColVis[ "Max Profit" ] && (
      <th>
        <div>
          <small>Max Profit</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-18px",
            }}
            onClick={() => {
              setShowSearchMaxProfit1((prev) => !prev);
              setShowSearchId1(false);
              setShowSearchMaxLoss1(false);
              setShowSearchNet1(false);
            }}
          />
        </div>
        {showSearchMaxProfit1 && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{
                      width: "12px",
                      marginRight: "5px",
                    }}
                    checked={selectAllMaxProfit1}
                    onChange={handleSelectAllForMaxProfit1}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMaxProfit1
                    .filter((name) => name !== undefined)
                    .map((MaxProfit, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={maxProfitSelected1.includes(MaxProfit)}
                          onChange={() =>
                            handleCheckBoxChangeForMaxProfit1(MaxProfit)
                          }
                        />
                        <label>{MaxProfit}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick1}>OK</button>
              <button onClick={() => setShowSearchMaxProfit1((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Max Loss": stColVis[ "Max Loss" ] && (
      <th>
        <div>
          <small>Max Loss</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-25px",
            }}
            onClick={() => {
              setShowSearchMaxLoss1((prev) => !prev);
              setShowSearchId1(false);
              setShowSearchMaxProfit1(false);
              setShowSearchNet1(false);
            }}
          />
        </div>

        {showSearchMaxLoss1 && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllMaxLoss1}
                    onChange={handleSelectAllForMaxLoss1}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMaxLoss1
                    .filter((name) => name !== undefined)
                    .map((MaxLoss, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={maxLossSelected1.includes(MaxLoss)}
                          onChange={() =>
                            handleCheckBoxChangeForMaxLoss1(MaxLoss)
                          }
                        />
                        <label>{MaxLoss}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick1}>OK</button>
              <button onClick={() => setShowSearchMaxLoss1((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Max Loss Wait Time": stColVis[ "Max Loss Wait Time" ] && (
      <th>
        <div>
          <small>Max Loss Wait Time</small>
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
    "Profit Locking": stColVis[ "Profit Locking" ] && (
      <th>
        <div>
          <small>Profit Locking</small>
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
    "Delay Between Users": stColVis[ "Delay Between Users" ] && (
      <th>
        <div>
          <small>Delay Between Users</small>
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
    "Unique ID Req for Order": stColVis[ "Unique ID Req for Order" ] && (
      <th>
        <div>
          <small>
            Unique ID Req for <br /> Order
          </small>
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
    "Cancel Previous Open Signal": stColVis[ "Cancel Previous Open Signal" ] && (
      <th>
        <div>
          <small>
            Cancel Previous Open
            <br />
            Signal
          </small>
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
    "Stop Reverse": stColVis[ "Stop Reverse" ] && (
      <th>
        <div>
          <small>Stop & Reverse</small>
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
    "Part Multi Exists": stColVis[ "Part Multi Exists" ] && (
      <th>
        <div>
          <small>Part / Multi Exists</small>
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
    "Hold Sell Seconds": stColVis[ "Hold Sell Seconds" ] && (
      <th>
        <div>
          <small>Hold Sell Seconds</small>
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
    "Allowed Trades": stColVis[ "Allowed Trades" ] && (
      <th>
        <div>
          <small>Allowed Trades</small>
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
    "Entry Order Retry": stColVis[ "Entry Order Retry" ] && (
      <th>
        <div>
          <small>Entry Order Retry</small>
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
    "Entry Retry Count": stColVis[ "Entry Retry Count" ] && (
      <th>
        <div>
          <small>Entry Retry Count</small>
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
    "Entry Retry Wait Seconds": stColVis[ "Entry Retry Wait Seconds" ] && (
      <th>
        <div>
          <small>
            Entry Retry <br /> Wait (Seconds)
          </small>
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
    "Exit Order Retry": stColVis[ "Exit Order Retry" ] && (
      <th>
        <div>
          <small>Exit Order Retry</small>
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
    "Exit Retry Count": stColVis[ "Exit Retry Count" ] && (
      <th>
        <div>
          <small>Exit Retry Count</small>
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
    "Exit Retry Wait Seconds": stColVis[ "Exit Retry Wait Seconds" ] && (
      <th>
        <div>
          <small>
            Exit Retry <br /> Wait (Seconds)
          </small>
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
    "Exit Max Wait Seconds": stColVis[ "Exit Max Wait Seconds" ] && (
      <th>
        <div>
          <small>
            Exit Max <br />
            Wait (Seconds)
          </small>
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
    "Sq Off Done": stColVis[ "Sq Off Done" ] && (
      <th>
        <div>
          <small>Sq Off Done</small>
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
      </th>
    ),
    Delta: stColVis[ "Delta" ] && (
      <th>
        <div>
          <small>Delta</small>
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
    Theta: stColVis[ "Theta" ] && (
      <th>
        <div>
          <small>Theta</small>
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
    Vega: stColVis[ "Vega" ] && (
      <th>
        <div>
          <small>Vega</small>
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
  };

  const [ userIDSelected, setuserIDSelected ] = useState([]);
  const [ aliasSelected, setaliasSelected ] = useState([]);
  const [ brokerSelected, setBrokerSelected ] = useState([]);
  const [ marginSelected, setmarginSelected ] = useState([]);

  const handleUserIDSelected = (userid) => {
    setuserIDSelected((prevSelectedValues) => {
      if (prevSelectedValues.includes(userid)) {
        return prevSelectedValues.filter((item) => item !== userid);
      } else {
        return [ ...prevSelectedValues, userid ];
      }
    });
  };
  const handleAliasSelected = (alias) => {
    setaliasSelected((prevSelectedValues) => {
      if (prevSelectedValues.includes(alias)) {
        return prevSelectedValues.filter((item) => item !== alias);
      } else {
        return [ ...prevSelectedValues, alias ];
      }
    });
  };

  const handleBrokerSelected = (broker) => {
    setBrokerSelected((prevSelectedValues) => {
      if (prevSelectedValues.includes(broker)) {
        return prevSelectedValues.filter((item) => item !== broker);
      } else {
        return [ ...prevSelectedValues, broker ];
      }
    });
  };
  const handleMarginSelected = (margin) => {
    setmarginSelected((prevSelectedValues) => {
      if (prevSelectedValues.includes(margin)) {
        return prevSelectedValues.filter((item) => item !== margin);
      } else {
        return [ ...prevSelectedValues, margin ];
      }
    });
  };
  useEffect(() => {
    setfilteredDataNew(dataNew);
  }, [ dataNew ]);

  useEffect(() => {
    // update rows
    if (userIDSelected.length !== 0) {
      setfilteredDataNew(() =>
        dataNew.filter((data) => {
          return userIDSelected.includes(data.UserID);
        }),
      );
    } else {
      setfilteredDataNew(dataNew);
    }
    if (brokerSelected.length !== 0) {
      setfilteredDataNew((prevfilteredDataNew) =>
        prevfilteredDataNew.filter((data) => {
          return brokerSelected.includes(data.Broker);
        }),
      );
    }
    if (marginSelected.length !== 0) {
      setfilteredDataNew((prevfilteredDataNew) =>
        prevfilteredDataNew.filter((data) => {
          return marginSelected.includes(data.Margin);
        }),
      );
    }
    if (aliasSelected.length !== 0) {
      setfilteredDataNew((prevfilteredDataNew) =>
        prevfilteredDataNew.filter((data) => {
          return aliasSelected.includes(data.Alias);
        }),
      );
    }
  }, [ userIDSelected, aliasSelected, brokerSelected, marginSelected ]);

  return (
    <div onClick={handleCloseAllSearchBox}>
      <MarketIndex />
      <div className="main-section">
        <LeftNav />
        <div className="middle-main-container">
          <TopNav
            pageCols={stPageCols}
            colsSelectedAll={stColsSelectedALL}
            setColsSelectedALL={setstColsSelectedALL}
            selectAll={stPageColSelectAll}
            colVis={stColVis}
            setColVis={setstColVis}
            setSeq={setstrategiesSeq}
          />

          <div
            className="main-table"
            style={{ overflow: "auto", height: "92%" }}
            ref={tableRef}
          >
            <table>
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: "10",
                }}
              >
                {strategiesSeq.map((colName, index) => {
                  return (
                    <React.Fragment key={index}>
                      {strategiesTH[ colName ]}
                    </React.Fragment>
                  );
                })}
              </thead>

              <tbody>
                {/* {console.log("filteredRows1   ", filteredRows1)} */}
                {filteredRows1
                  .filter((row) => {
                    if (actionFilter === "all") {
                      return true; // Display all rows
                    } else if (actionFilter === "checked") {
                      return row.Action.enabled;
                    } else if (actionFilter === "unchecked") {
                      return !row.Action.enabled;
                    }
                    return true; // Default to displaying all rows
                  })
                  .map((row, index) => {
                    return (
                      <tr key={index}>
                        {strategiesSeq.map((keyName) => {
                          const key = keyName.replace(/\s/g, "");
                          if (
                            key === "UniqueIDReqforOrder"
                              ? stColVis[ "Unique ID Req for Order" ]
                              : stColVis[
                              key
                                .replace(/\s/g, "")
                                .replace(/([A-Z])/g, " $1")
                                .slice(1)
                              ]
                          ) {
                            return (
                              <td
                                key={key}
                                className={
                                  key === "StrategyLabel" &&
                                    clearedCells.includes(index)
                                    ? "cleared-cell"
                                    : ""
                                }
                                style={{
                                  textAlign: "center",
                                }}
                              >
                                {key === "TradingAccount" ? (
                                  <span
                                    className="clickable-cell"
                                    onClick={() => handleCellClick(row, index)}
                                    style={{
                                      minWidth: "100%",
                                      minHeight: "20px",
                                      border: "1px solid transparent",
                                      display: "inline-block",
                                      alignItems: "center", // Corrected property
                                      justifyContent: "center",
                                      scrollbarWidth: "thin", // Set the width of the scrollbar (non-WebKit browsers)
                                      maxWidth: "11rem",
                                      maxHeight: "50px", // Set a maximum height for the span
                                      overflowY: "auto", // Enable smooth scrolling on iOS devices
                                    }}
                                  >
                                    {row[ key ]}
                                  </span>
                                ) : key === "StrategyLabel" ? (
                                  <input
                                    style={{
                                      padding: "8px",
                                      textAlign: "center",
                                    }}
                                    type="text"
                                    value={row[ key ]}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        key,
                                        e.target.value,
                                      )
                                    }
                                    onBlur={() => handleBlurChange(index)}
                                  />
                                ) : key === "Action" ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      paddingLeft: "9px",
                                    }}
                                  >
                                    <div className="tooltip-container">
                                      {actionFilter === "all" ||
                                        (actionFilter === "checked" &&
                                          row.Action.enabled) ||
                                        (actionFilter === "unchecked" &&
                                          !row.Action.enabled) ? (
                                        <>
                                          {row.Action.enabled ? (
                                            <img
                                              src={Stop2}
                                              alt="icon"
                                              className="logout_icon"
                                              style={{
                                                height: "25px",
                                                width: "25px",
                                              }}
                                              onClick={() => {
                                                updateActionProperty(
                                                  index,
                                                  "enabled",
                                                  false,
                                                );
                                              }}
                                            />
                                          ) : (
                                            <img
                                              src={Start}
                                              alt="icon"
                                              className="logout_icon"
                                              style={{
                                                height: "25px",
                                                width: "25px",
                                              }}
                                              onClick={() => {
                                                updateActionProperty(
                                                  index,
                                                  "enabled",
                                                  true,
                                                );
                                              }}
                                            />
                                          )}
                                          <span className="tooltiptexts">
                                            {row.Action.enabled
                                              ? "Disable"
                                              : "Enable"}
                                          </span>
                                        </>
                                      ) : null}
                                    </div>

                                    {/* --------- */}
                                    <span className="tooltip-container">
                                      {/*  */}

                                      {row.Action.logged ? (
                                        <>
                                          <img
                                            src={Logout}
                                            alt="icon"
                                            className="logout_icon"
                                            style={{
                                              height: "25px",
                                              width: "25px",
                                            }}
                                          />

                                          <span
                                            className={`tooltiptext login-tooltip`}
                                          >
                                            complete
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <img
                                            src={Log}
                                            alt="icon"
                                            className="logout_icon"
                                            style={{
                                              height: "25px",
                                              width: "25px",
                                            }}
                                          />

                                          <span
                                            className={`tooltiptext login-tooltip`}
                                          >
                                            complete
                                          </span>
                                        </>
                                      )}
                                    </span>

                                    {/* ---- */}
                                    <span className="tooltip-container">
                                      <img
                                        src={Delete}
                                        alt="icon"
                                        className="cross_icon"
                                        style={{
                                          height: "25px",
                                          width: "25px",
                                        }}
                                        onClick={() => {
                                          handleStrategyRowDelete(index);
                                        }}
                                      />
                                      <span className="tooltiptext delete-tooltip">
                                        Delete
                                      </span>
                                    </span>
                                  </div>
                                ) : key === "ManualSquareOff" ? (
                                  <img
                                    src={Log}
                                    alt="icon"
                                    className="logout_icon"
                                    style={{
                                      height: "25px",
                                      width: "25px",
                                    }}
                                    onClick={() =>
                                      handleManualSquareOff(
                                        row[ "StrategyLabel" ],
                                        row[ "TradingAccount" ],
                                      )
                                    }
                                  />
                                ) : key === "UniqueIDReqforOrder" ? (
                                  <input
                                    style={{
                                      padding: "8px",
                                      textAlign: "center",
                                    }}
                                    type="checkbox"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={row[ key ]}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        key,
                                        e.target.value,
                                      )
                                    }
                                    style={{ textAlign: "center" }}
                                  />
                                )}
                              </td>
                            );
                          }
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
              className="button"
              onClick={addNewRow}
              style={{ zIndex: "0" }}
            >
              Add
            </button>
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
        <div onClick={handleClickOutside}>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            contentLabel="Trading Account Modal"
            center
            style={{
              content: {
                overflow: "hidden",
                width: "100%",
                height: "100",
                margin: "auto",
                marginLeft: "-40px",
                marginTop: "-40px",
                marginBottom: "-40px",
                overflowX: "hidden",
                backgroundColor: "transparent",
                border: "transparent",
                padding: "0",
              },
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
              },
            }}
          >
            <Draggable>
              <div
                style={{
                  backgroundColor: "white",
                  height: 410,
                  width: 700,
                  margin: "auto",
                  borderRadius: "6px",
                  marginTop: "9%",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    backgroundColor: "#d8e1ff",
                    borderRadius: "6px",
                    marginBottom: "2px",
                    padding: "10px ",
                    overflowX: "hidden",
                  }}
                >
                  Select User(s) for Strategies:{" "}
                  {selectedTradingAccount ? (
                    <span style={{ color: "blue" }}>
                      {selectedTradingAccount.StrategyLabel}
                    </span>
                  ) : (
                    ""
                  )}
                </h2>

                {selectedTradingAccount && (
                  <div
                    className="container"
                    style={{ height: "300px", overflow: "auto" }}
                  >
                    <table className="custom-table">
                      <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                        <tr
                          className="header-row"
                          style={{
                            background: "#d8e1ff",
                            height: 30,
                          }}
                        >
                          <th
                            style={{
                              textAlign: "center",
                              width: "13%",
                            }}
                          >
                            <small>
                              <input
                                type="checkbox"
                                checked={selectAllChecked}
                                onChange={handleSelectAll}
                                style={{ marginRight: "5px" }}
                              />
                              Select
                            </small>
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              width: "17%",
                            }}
                          >
                            <div className="popTableHead ">
                              <small>User ID</small>
                              <img
                                src={filterIcon}
                                alt="icon"
                                style={{
                                  height: "25px",
                                  width: "25px",
                                }}
                                onClick={() => {
                                  setIsdropDownOpenAlias((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenMargin((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenBroker((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenUserID(
                                    !isdropDownOpenUserID,
                                  );
                                }}
                              />
                              {isdropDownOpenUserID && (
                                <div className="dropdown-menu">
                                  {Array.from(
                                    new Set(
                                      dataNew.map((data) => data[ "UserID" ]),
                                    ),
                                  ).map((userid, index) => {
                                    return (
                                      <label key={index}>
                                        <input
                                          type="checkbox"
                                          checked={userIDSelected.includes(
                                            userid,
                                          )}
                                          onClick={() => {
                                            handleUserIDSelected(userid);
                                          }}
                                        />
                                        {userid}
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              width: "18%",
                            }}
                          >
                            <div className="popTableHead">
                              <small>Alias</small>
                              <img
                                src={filterIcon}
                                alt="icon"
                                style={{
                                  height: "25px",
                                  width: "25px",
                                }}
                                onClick={() => {
                                  setIsdropDownOpenMargin((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenBroker((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenUserID((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenAlias(!isdropDownOpenAlias);
                                }}
                              />
                              {isdropDownOpenAlias && (
                                <div className="dropdown-menu">
                                  {/* {console.log("DaaaataNEeww", dataNew)} */}
                                  {Array.from(
                                    new Set(
                                      dataNew.map((data) => {
                                        if (userIDSelected.length === 0) {
                                          return data[ "Alias" ];
                                        } else {
                                          if (
                                            userIDSelected.includes(data.UserID)
                                          ) {
                                            return data[ "Alias" ];
                                          }
                                        }
                                      }),
                                    ),
                                  )
                                    .filter((broker) => broker !== undefined)
                                    .filter((broker) => broker !== "")
                                    .map((alias, index) => {
                                      return (
                                        <label key={index}>
                                          <input
                                            type="checkbox"
                                            checked={aliasSelected.includes(
                                              alias,
                                            )}
                                            onClick={() => {
                                              handleAliasSelected(alias);
                                            }}
                                          />
                                          {alias}
                                        </label>
                                      );
                                    })}
                                </div>
                              )}
                            </div>
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              width: "18%",
                            }}
                          >
                            <div className="popTableHead">
                              <small>Multiplier</small>
                            </div>
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              width: "20%",
                            }}
                          >
                            <div className="popTableHead">
                              <small>Broker</small>
                              <img
                                src={filterIcon}
                                alt="icon"
                                style={{
                                  height: "25px",
                                  width: "25px",
                                }}
                                onClick={() => {
                                  setIsdropDownOpenAlias((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenMargin((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenBroker(
                                    !isdropDownOpenBroker,
                                  );
                                  setIsdropDownOpenUserID((prev) =>
                                    prev ? !prev : prev,
                                  );
                                }}
                              />
                              {isdropDownOpenBroker && (
                                <div className="dropdown-menu">
                                  {Array.from(
                                    new Set(
                                      dataNew.map((data) => {
                                        if (userIDSelected.length === 0) {
                                          return data[ "Broker" ];
                                        } else {
                                          if (
                                            userIDSelected.includes(data.UserID)
                                          ) {
                                            return data[ "Broker" ];
                                          }
                                        }
                                      }),
                                    ),
                                  )
                                    .filter((broker) => broker !== undefined)
                                    .map((broker, index) => {
                                      return (
                                        <label key={index}>
                                          <input
                                            type="checkbox"
                                            checked={brokerSelected.includes(
                                              broker,
                                            )}
                                            onClick={() => {
                                              handleBrokerSelected(broker);
                                            }}
                                          />{" "}
                                          {broker}
                                        </label>
                                      );
                                    })}
                                </div>
                              )}
                            </div>
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              width: "20%",
                            }}
                          >
                            <div className="popTableHead">
                              <small>Margin</small>
                              <img
                                src={filterIcon}
                                alt="icon"
                                style={{
                                  height: "25px",
                                  width: "25px",
                                }}
                                onClick={() => {
                                  setIsdropDownOpenMargin(
                                    !isdropDownOpenMargin,
                                  );
                                  setIsdropDownOpenAlias((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenBroker((prev) =>
                                    prev ? !prev : prev,
                                  );
                                  setIsdropDownOpenUserID((prev) =>
                                    prev ? !prev : prev,
                                  );
                                }}
                              />
                              {isdropDownOpenMargin && (
                                <div className="dropdown-menu">
                                  {Array.from(
                                    new Set(
                                      dataNew.map((data) => data[ "Margin" ]),
                                    ),
                                  ).map((margin, index) => {
                                    return (
                                      <label key={index}>
                                        <input
                                          type="checkbox"
                                          checked={marginSelected.includes(
                                            margin,
                                          )}
                                          onClick={() => {
                                            handleMarginSelected(margin);
                                          }}
                                        />{" "}
                                        {margin}
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredDataNew.map((account, index) => (
                          <tr
                            key={index}
                            className={index % 2 === 0 ? "even-row" : "odd-row"}
                          >
                            <td
                              style={{
                                padding: "15px",
                                textAlign: "center",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={account.Select}
                                onChange={() => handleCheckboxChange(index)}
                              />
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                textAlign: "center",
                              }}
                            >
                              {account.UserID}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                textAlign: "center",
                              }}
                            >
                              {account.Alias}
                            </td>
                            <td>
                              <input
                                type="text"
                                value={account.Multiplier}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  border: "none",
                                  textAlign: "center",
                                }}
                                onChange={(e) => {
                                  setisPopUpDataChanged(true);
                                  handleInputChangeInputs(
                                    index,
                                    "Multiplier",
                                    e.target.value,
                                  );
                                }}
                              />
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                textAlign: "center",
                              }}
                            >
                              {account.Broker}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                textAlign: "center",
                              }}
                            >
                              {account.Margin}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    position: "absolute",
                    bottom: "20px", // Adjust the distance from the bottom as needed
                    width: "100%",
                  }}
                >
                  <button
                    disabled={
                      !isPopUpDataChanged || !isAtLeastOneItemSelected()
                    }
                    style={
                      isPopUpDataChanged && isAtLeastOneItemSelected()
                        ? {
                          backgroundColor: "#0BDA51",
                          color: "white",
                          padding: "10px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          width: "75px",
                          overflowX: "hidden",
                        }
                        : {
                          padding: "10px",
                          borderRadius: "10px",
                          cursor: "default",
                          width: "75px",
                        }
                    }
                    onClick={handleConfirm}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={handleCloseModal}
                    style={{
                      backgroundColor: "#FF2400",
                      color: "white",
                      padding: "10px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      marginLeft: "25px",
                      marginRight: "10px",
                      width: "75px",
                      overflowX: "hidden",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Draggable>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Strategies;
