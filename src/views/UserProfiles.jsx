import React, { useState, useRef, memo, useEffect } from "react";
import MarketIndex from "../components/MarketIndex";
import { TopNav } from "../components/TopNav";
import LeftNav from "../components/LeftNav";
import { ErrorContainer } from "../components/ErrorConsole";
import RightNav from "../components/RightNav";
import filterIcon from "../assets/newFilter.png";
import Delete from "../assets/delete.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Log from "../assets/log.png";
import Start from "../assets/start_2.png";
import Logout from "../assets/logout.png";
import Stop from "../assets/stop.png";
import Stop2 from "../assets/stop2.png";
import leftSideBar1active from "../assets/1leftactive.png";
import zIndex from "@mui/material/styles/zIndex";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { useSelector, useDispatch } from "react-redux";
import { setBrokers } from "../store/slices/broker";
import { setAllSeq } from "../store/slices/colSeq";
import { setAllVis } from "../store/slices/colVis";
import { setConsoleMsgs } from "../store/slices/consoleMsg";
import { setStrategies } from "../store/slices/strategy";

function UserProfiles() {
  const tableRef = useRef(null);
  const mainUser = cookies.get("USERNAME");
  const dispatch = useDispatch();
  const consoleMsgsState = useSelector((state) => state.consoleMsgsReducer);
  const { collapsed } = useSelector((state) => state.collapseReducer);
  const [ colFilter, setcolFilter ] = useState({
    asPerCol: "",
    val: "",
  });
  const [ showSearchProfile, setshowSearchProfile ] = useState({
    showSearchName: false,
    showSearchId: false,
    showSearchMobile: false,
    showSearchMaxProfit: false,
    showSearchMaxLoss: false,
    showSearchMTM: false,
    showSearchNet: false,
    showSearchAvailableMargin: false,
    showSearchQtyByExposure: false,
    showSearchMaxLossPerTrade: false,
    showSearchMaxOpenTrades: false,
    showSearchQtyMultiplier: false,
    showSearchEmail: false,
    showSearchSqOffTime: false,
    showSearchBroker: false,
  });

  // Error Message start
  const errorContainerRef = useRef(null);

  const handleMsg = (Msg) => {
    const lastMsg = consoleMsgsState.consoleMsgs[ 0 ];
    if (Msg.logType === "MESSAGE" || Msg.logType === "ERROR") {
      if (lastMsg && lastMsg.msg === Msg.msg && lastMsg.user === Msg.user) {
        // console.log("msg same");
        dispatch(
          setConsoleMsgs({
            consoleMsgs: [ Msg, ...consoleMsgsState.consoleMsgs.slice(1) ],
          }),
        );
      } else {
        dispatch(
          setConsoleMsgs({
            consoleMsgs: [ Msg, ...consoleMsgsState.consoleMsgs ],
          }),
        );
      }
    } else {
      dispatch(
        setConsoleMsgs({
          consoleMsgs: [ Msg, ...consoleMsgsState.consoleMsgs ],
        }),
      );
    }
  };

  const handleClearLogs = () => {
    dispatch(
      setConsoleMsgs({
        consoleMsgs: [],
      }),
    );
  };
  const handleLogout = async (rowData, index) => {
    try {
      if (rowData.broker !== "pseudo account") {
        const response = await fetch(
          `api/logout_broker_accounts/${rowData.broker}/${rowData.userId}`,
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
          throw new Error(
            errorData.message || "Something bad happened. Please try again",
          );
        }

        const responseData = await response.json();

        // console.log("Success:", responseData);
        const updatedBrokers = [ ...rows ];

        // console.log("rdxIndex", rdxIndex, "rdxValue", rdxValue)
        updatedBrokers[ index ] = {
          ...updatedBrokers[ index ],
          apiUserDetails: "",
          availableMargin: 0,
          net: 0,
          inputDisabled: false,
        };

        dispatch(
          setBrokers({
            brokers: updatedBrokers,
          }),
        );
        handleMsg({
          msg: `Logged out Successfully. - ${rowData.userId}`,
          logType: "MESSAGE",
          timestamp: ` ${new Date().toLocaleString()}`,
          user: rowData.userId,
        });
      } else {
        const updatedBrokers = [ ...rows ];
        updatedBrokers[ index ] = {
          ...updatedBrokers[ index ],
          apiUserDetails: "",
          availableMargin: 0,
          net: 0,
          inputDisabled: false,
        };

        dispatch(
          setBrokers({
            brokers: updatedBrokers,
          }),
        );
        handleMsg({
          msg: `Logged out Successfully. - ${rowData.userId}`,
          logType: "MESSAGE",
          timestamp: ` ${new Date().toLocaleString()}`,
          user: rowData.userId,
        });
      }
    } catch (error) {
      console.error("Error occurred:", error.message);
    }
  };

  // handlelog out
  const handleDelete = async (rowData, index) => {
    try {
      if (rowData.broker !== "" && rowData.userId != "") {
        const response = await fetch(
          `/api/delete_credentials/${mainUser}/${rowData.userId}/${rowData.broker}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(await response.json());
        }

        // If successful, you might want to handle the response here
        // console.log("Credentials deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting credentials:", error.message);
    } finally {
      const updatedRows = rows.filter((_, i) => i !== index);
      // setRows([ ...updatedRows ]);
      dispatch(
        setBrokers({
          brokers: updatedRows,
        }),
      );
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

      handleMsg({
        msg: `Row Deleted Successfully. - ${rowData.userId}`,
        logType: "MESSAGE",
        timestamp: ` ${new Date().toLocaleString()}`,
        user: rowData.userId,
      });
    }
  };
  // handle select change
  const handleSelectChange = (e, index) => {
    const selectedBroker = e.target.value;
    updateRowData(index, { broker: selectedBroker });

    if (selectedBroker === "flattrade") {
      setShowSecretKey(true);
      setShowRedirectAPI(false);
      setShowImei(false); // Resetting setShowImei for other brokers
    } else if (selectedBroker === "fyers") {
      setShowSecretKey(true);
      setShowRedirectAPI(true);
      setShowImei(false); // Resetting setShowImei for other brokers
    } else if (selectedBroker === "finvasia") {
      setShowSecretKey(false);
      setShowRedirectAPI(false); // Assuming 'finvasia' requires redirect API
      setShowImei(true); // Setting setShowImei specifically for Finvasia
    } else {
      setShowSecretKey(false);
      setShowRedirectAPI(false);
      setShowImei(false);
      // Resetting setShowImei for other brokers
    }
  };
  // handle select change
  // passsword hide unhide
  const [ showPassword, setShowPassword ] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [ showPasswordapi, setShowPasswordapi ] = useState(false);
  const togglePasswordApiVisibility = () => {
    setShowPasswordapi(!showPasswordapi);
  };
  const [ showPasswordqr, setShowPasswordqr ] = useState(false);
  const togglePasswordQrVisibility = () => {
    setShowPasswordqr(!showPasswordqr);
  };
  // passsword hide unhide

  const { brokers: rows } = useSelector((state) => state.brokerReducer);
  // const [ rows, setRows ] = useState(brokerState.brokers);
  // useEffect(() => {
  //   setRows(brokerState.brokers);
  // }, [ rows ]);

  // useEffect(() => {
  // dispatch(
  //   setBrokers({
  //     brokers: rows,
  //   }),
  // );
  // }, [ rows ]);

  const [ showSelectBox, setShowSelectBox ] = useState(false);
  const [ enabledFilter, setEnabledFilter ] = useState("");

  const [ selectAll, setSelectAll ] = useState(false);
  const [ uniqueDataNames, setuniqueDataNames ] = useState([]);
  const [ nameSelected, setNameSelected ] = useState([]);

  const [ selectAllBroker, setSelectAllBroker ] = useState(false);
  const [ uniqueDataBroker, setuniqueDataBroker ] = useState([]);
  const [ brokerSelected, setBrokerSelected ] = useState([]);

  const [ selectAllForId, setSelectAllForId ] = useState(false);
  const [ uniqueDatauserId, setuniqueDatauserId ] = useState([]);
  const [ userIdSelected, setuserIdSelected ] = useState([]);

  const [ selectAllSqOffTime, setSelectAllSqOffTime ] = useState(false);
  const [ uniqueDataSqOffTime, setuniqueDataSqOffTime ] = useState([]);
  const [ sqOffTimeSelected, setSqOffTimeSelected ] = useState([]);

  const [ selectAllEmail, setSelectAllEmail ] = useState(false);
  const [ uniqueDataEmail, setuniqueDataEmail ] = useState([]);
  const [ emailSelected, setEmailSelected ] = useState([]);

  const [ selectAllQtyMultiplier, setSelectAllQtyMultiplier ] = useState(false);
  const [ uniqueDataQtyMultiplier, setuniqueDataQtyMultiplier ] = useState([]);
  const [ qtyMultiplierSelected, setQtyMultiplierSelected ] = useState([]);
  const [ uniqueDataMaxOpenTrades, setuniqueDataMaxOpenTrades ] = useState([]);
  const [ selectAllMaxOpenTrades, setSelectAllMaxOpenTrades ] = useState(false);
  const [ maxOpenTradesSelected, setMaxOpenTradesSelected ] = useState([]);

  const [ selectAllQtyByExposure, setSelectAllQtyByExposure ] = useState(false);
  const [ uniqueDataQtyByExposure, setuniqueDataQtyByExposure ] = useState([]);
  const [ qtyByExposureSelected, setQtyByExposureSelected ] = useState([]);

  const [ selectAllMaxLossPerTrade, setSelectAllMaxLossPerTrade ] =
    useState(false);
  const [ uniqueDataMaxLossPerTrade, setuniqueDataMaxLossPerTrade ] = useState(
    [],
  );
  const [ maxLossPerTradeSelected, setMaxLossPerTradeSelected ] = useState([]);

  const [ selectAllNet, setSelectAllNet ] = useState(false);
  const [ uniqueDataNet, setuniqueDataNet ] = useState([]);
  const [ netSelected, setNetSelected ] = useState([]);

  const [ selectAllMaxProfit, setSelectAllMaxProfit ] = useState(false);
  const [ uniqueDataMaxProfit, setuniqueDataMaxProfit ] = useState([]);
  // const uniqueDataMaxProfit = [ ...new Set(data.map((d) => d.maxProfit)) ];
  const [ maxProfitSelected, setMaxProfitSelected ] = useState([]);

  const [ selectAllMaxLoss, setSelectAllMaxLoss ] = useState(false);
  const [ uniqueDataMaxLoss, setuniqueDataMaxLoss ] = useState([]);
  // const uniqueDataMaxLoss = [ ...new Set(data.map((d) => d.maxLoss)) ];
  const [ maxLossSelected, setMaxLossSelected ] = useState([]);

  const [ selectAllMobile, setSelectAllMobile ] = useState(false);
  const [ uniqueDataMobile, setuniqueDataMobile ] = useState([]);
  // const uniqueDataMobile = [ ...new Set(data.map((d) => d.mobile)) ];
  const [ mobileSelected, setMobileSelected ] = useState([]);

  const [ selectAllMTM, setSelectAllMTM ] = useState(false);
  const [ uniqueDataMTM, setuniqueDataMTM ] = useState([]);
  // const uniqueDataMTM = [ ...new Set(data.map((d) => d.mtmAll)) ];
  const [ mtmSelected, setMTMSelected ] = useState([]);

  const [ selectAllAvailableMargin, setSelectAllAvailableMargin ] =
    useState(false);
  const [ uniqueDataAvailableMargin, setuniqueDataAvailableMargin ] = useState(
    [],
  );
  // const uniqueDataAvailableMargin = [
  //   ...new Set(data.map((d) => d.availableMargin)),
  // ];
  const [ availableMarginSelected, setAvailableMarginSelected ] = useState([]);

  useEffect(() => {
    const data = rows;
    setuniqueDataNames(data ? [ ...new Set(data.map((d) => d.name)) ] : []);
    // setNameSelected(uniqueDataNames.map((name) => name.toLowerCase()));

    setuniqueDatauserId(data ? [ ...new Set(data.map((d) => d.userId)) ] : []);
    // setuserIdSelected(uniqueDatauserId.map((userId) => userId.toLowerCase()));

    setuniqueDataMobile(data ? [ ...new Set(data.map((d) => d.mobile)) ] : []);
    // setMobileSelected(uniqueDataMobile.map((mobile) => mobile.toString()));

    setuniqueDataMaxProfit(
      data ? [ ...new Set(data.map((d) => d.maxProfit)) ] : [],
    );
    // setMaxProfitSelected(
    //   uniqueDataMaxProfit.map((maxProfit) => maxProfit.toString())
    // );

    setuniqueDataMaxLoss(data ? [ ...new Set(data.map((d) => d.maxLoss)) ] : []);
    // setMaxLossSelected(
    //   uniqueDataMaxLoss.map((maxLoss) => maxLoss.toString())
    // );

    setuniqueDataMTM(data ? [ ...new Set(data.map((d) => d.mtmAll)) ] : []);
    // setMTMSelected(uniqueDataMTM.map((mtmAll) => mtmAll.toString()));

    setuniqueDataNet(data ? [ ...new Set(data.map((d) => d.net)) ] : []);
    // setNetSelected(uniqueDataNet.map((net) => net.toString()));

    setuniqueDataAvailableMargin(
      data ? [ ...new Set(data.map((d) => d.availableMargin)) ] : [],
    );
    // setAvailableMarginSelected(
    //   uniqueDataAvailableMargin.map((availableMargin) =>
    //     availableMargin.toString()
    //   )
    // );

    setuniqueDataQtyByExposure(
      data ? [ ...new Set(data.map((d) => d.qtyByExposure)) ] : [],
    );
    // setQtyByExposureSelected(
    //   uniqueDataQtyByExposure.map((qtyByExposure) => qtyByExposure.toString())
    // );

    setuniqueDataMaxLossPerTrade(
      data ? [ ...new Set(data.map((d) => d.maxLossPerTrade)) ] : [],
    );
    // setMaxLossPerTradeSelected(
    //   uniqueDataMaxLossPerTrade.map((maxLossPerTrade) =>
    //     maxLossPerTrade.toString()
    //   )
    // );

    setuniqueDataMaxOpenTrades(
      data ? [ ...new Set(data.map((d) => d.maxOpenTrades)) ] : [],
    );
    // setMaxOpenTradesSelected(
    //   uniqueDataMaxOpenTrades.map((maxOpenTrades) => maxOpenTrades.toString())
    // );

    setuniqueDataQtyMultiplier(
      data ? [ ...new Set(data.map((d) => d.qtyMultiplier)) ] : [],
    );
    // setQtyMultiplierSelected(
    //   uniqueDataQtyMultiplier.map((qtyMultiplier) => qtyMultiplier.toString())
    // );

    setuniqueDataEmail(data ? [ ...new Set(data.map((d) => d.email)) ] : []);
    // setEmailSelected(uniqueDataEmail.map((email) => email.toLowerCase()));

    setuniqueDataSqOffTime(
      data ? [ ...new Set(data.map((d) => d.sqOffTime)) ] : [],
    );
    // setSqOffTimeSelected(
    //   uniqueDataSqOffTime.map((sqOffTime) => sqOffTime.toLowerCase())
    // );

    setuniqueDataBroker(data ? [ ...new Set(data.map((d) => d.broker)) ] : []);
    // setBrokerSelected(uniqueDataBroker.map((broker) => broker));
  }, [ rows ]);

  const handleCheckboxChange = (name) => {
    const isSelected = nameSelected.includes(name);
    if (isSelected) {
      setNameSelected((prevSelected) =>
        prevSelected.filter((item) => item !== name),
      );
      setSelectAll(false);
    } else {
      setNameSelected((prevSelected) => [ ...prevSelected, name ]);
      setSelectAll(nameSelected.length === uniqueDataNames.length - 1);
    }
  };

  const handleCheckboxChangeBroker = (broker) => {
    const isSelected = brokerSelected.includes(broker);
    if (isSelected) {
      setBrokerSelected((prevSelected) =>
        prevSelected.filter((item) => item !== broker),
      );
      setSelectAllBroker(false);
    } else {
      setBrokerSelected((prevSelected) => [ ...prevSelected, broker ]);
      setSelectAllBroker(brokerSelected.length === uniqueDataBroker.length - 1);
    }
  };

  const handleSelectAllForName = () => {
    const allChecked = !selectAll;
    setSelectAll(allChecked);

    if (allChecked) {
      setNameSelected(uniqueDataNames.map((d) => d.toLowerCase()));
    } else {
      setNameSelected([]);
    }
  };

  const handleSelectAllForBroker = () => {
    const allChecked = !selectAllBroker;
    setSelectAllBroker(allChecked);

    if (allChecked) {
      setBrokerSelected(uniqueDataBroker.map((d) => d));
    } else {
      setBrokerSelected([]);
    }
  };

  const handleCheckBoxChangeForMobile = (mobile) => {
    const isSelected = mobileSelected.includes(mobile);
    if (isSelected) {
      setMobileSelected((prevSelected) =>
        prevSelected.filter((item) => item !== mobile),
      );
      setSelectAllMobile(false);
    } else {
      setMobileSelected((prevSelected) => [ ...prevSelected, mobile ]);
      setSelectAllMobile(mobileSelected.length === uniqueDataMobile.length - 1);
    }
  };

  const handleCheckBoxChangeForMaxProfit = (maxProfit) => {
    const isSelected = maxProfitSelected.includes(maxProfit);
    if (isSelected) {
      setMaxProfitSelected((prevSelected) =>
        prevSelected.filter((item) => item !== maxProfit),
      );
      setSelectAllMaxProfit(false);
    } else {
      setMaxProfitSelected((prevSelected) => [ ...prevSelected, maxProfit ]);
      setSelectAllMaxProfit(
        maxProfitSelected.length === uniqueDataMaxProfit.length - 1,
      );
    }
  };

  const handleCheckBoxChangeForMaxLoss = (maxLoss) => {
    const isSelected = maxLossSelected.includes(maxLoss);
    if (isSelected) {
      setMaxLossSelected((prevSelected) =>
        prevSelected.filter((item) => item !== maxLoss),
      );
      setSelectAllMaxLoss(false);
    } else {
      setMaxLossSelected((prevSelected) => [ ...prevSelected, maxLoss ]);
      setSelectAllMaxLoss(
        maxLossSelected.length === uniqueDataMaxLoss.length - 1,
      );
    }
  };

  const handleSelectAllForMobile = () => {
    const allChecked = !selectAllMobile;
    setSelectAllMobile(allChecked);

    if (allChecked) {
      setMobileSelected(uniqueDataMobile.map((d) => d.toString()));
    } else {
      setMobileSelected([]);
    }
  };
  const handleSelectAllForMaxProfit = () => {
    const allChecked = !selectAllMaxProfit;
    setSelectAllMaxProfit(allChecked);

    if (allChecked) {
      setMaxProfitSelected(uniqueDataMaxProfit.map((d) => d.toString()));
    } else {
      setMaxProfitSelected([]);
    }
  };

  const handleSelectAllForMaxLoss = () => {
    const allChecked = !selectAllMaxLoss;
    setSelectAllMaxLoss(allChecked);

    if (allChecked) {
      setMaxLossSelected(uniqueDataMaxLoss.map((d) => d.toString()));
    } else {
      setMaxLossSelected([]);
    }
  };

  const handleCheckboxChangeMTM = (mtmAll) => {
    const isSelected = mtmSelected.includes(mtmAll);
    if (isSelected) {
      setMTMSelected((prevSelected) =>
        prevSelected.filter((item) => item !== mtmAll),
      );
      setSelectAllMTM(false);
    } else {
      setMTMSelected((prevSelected) => [ ...prevSelected, mtmAll ]);
      setSelectAllMTM(mtmSelected.length === uniqueDataMTM.length - 1);
    }
  };

  const handleSelectAllForMTM = () => {
    const allChecked = !selectAllMTM;
    setSelectAllMTM(allChecked);

    if (allChecked) {
      setMTMSelected(uniqueDataMTM.map((d) => d.toString()));
    } else {
      setMTMSelected([]);
    }
  };

  const handleCheckboxChangeNet = (net) => {
    const isSelected = netSelected.includes(net);
    if (isSelected) {
      setNetSelected((prevSelected) =>
        prevSelected.filter((item) => item !== net),
      );
      setSelectAllNet(false);
    } else {
      setNetSelected((prevSelected) => [ ...prevSelected, net ]);
      setSelectAllNet(netSelected.length === uniqueDataNet.length - 1);
    }
  };

  const handleSelectAllForNet = () => {
    const allChecked = !selectAllNet;
    setSelectAllNet(allChecked);

    if (allChecked) {
      setNetSelected(uniqueDataNet.map((d) => d));
    } else {
      setNetSelected([]);
    }
  };

  const handleCheckboxChangeAvailableMargin = (availableMargin) => {
    const isSelected = availableMarginSelected.includes(availableMargin);
    if (isSelected) {
      setAvailableMarginSelected((prevSelected) =>
        prevSelected.filter((item) => item !== availableMargin),
      );
      setSelectAllAvailableMargin(false);
    } else {
      setAvailableMarginSelected((prevSelected) => [
        ...prevSelected,
        availableMargin,
      ]);
      setSelectAllAvailableMargin(
        availableMarginSelected.length === uniqueDataAvailableMargin.length - 1,
      );
    }
  };

  const handleSelectAllForAvailableMargin = () => {
    const allChecked = !selectAllAvailableMargin;
    setSelectAllAvailableMargin(allChecked);

    if (allChecked) {
      setAvailableMarginSelected(
        uniqueDataAvailableMargin.map((d) => d.toString()),
      );
    } else {
      setAvailableMarginSelected([]);
    }
  };

  const handleCheckboxChangeQtyByExposure = (qtyByExposure) => {
    const isSelected = qtyByExposureSelected.includes(qtyByExposure);
    if (isSelected) {
      setQtyByExposureSelected((prevSelected) =>
        prevSelected.filter((item) => item !== qtyByExposure),
      );
      setSelectAllQtyByExposure(false);
    } else {
      setQtyByExposureSelected((prevSelected) => [
        ...prevSelected,
        qtyByExposure,
      ]);
      setSelectAllQtyByExposure(
        qtyByExposureSelected.length === uniqueDataQtyByExposure.length - 1,
      );
    }
  };

  const handleSelectAllForQtyByExposure = () => {
    const allChecked = !selectAllQtyByExposure;
    setSelectAllQtyByExposure(allChecked);

    if (allChecked) {
      setQtyByExposureSelected(
        uniqueDataQtyByExposure.map((d) => d.toString()),
      );
    } else {
      setQtyByExposureSelected([]);
    }
  };

  const handleCheckboxChangeMaxOpenTrades = (maxOpenTrades) => {
    const isSelected = maxOpenTradesSelected.includes(maxOpenTrades);
    if (isSelected) {
      setMaxOpenTradesSelected((prevSelected) =>
        prevSelected.filter((item) => item !== maxOpenTrades),
      );
      setSelectAllMaxOpenTrades(false);
    } else {
      setMaxOpenTradesSelected((prevSelected) => [
        ...prevSelected,
        maxOpenTrades,
      ]);
      setSelectAllMaxOpenTrades(
        maxOpenTradesSelected.length === uniqueDataMaxOpenTrades.length - 1,
      );
    }
  };

  const handleSelectAllForMaxOpenTrades = () => {
    const allChecked = !selectAllMaxOpenTrades;
    setSelectAllMaxOpenTrades(allChecked);

    if (allChecked) {
      setMaxOpenTradesSelected(
        uniqueDataMaxOpenTrades.map((d) => d.toString()),
      );
    } else {
      setMaxOpenTradesSelected([]);
    }
  };

  const handleCheckboxChangeQtyMultiplier = (qtyMultiplier) => {
    const isSelected = qtyMultiplierSelected.includes(qtyMultiplier);
    if (isSelected) {
      setQtyMultiplierSelected((prevSelected) =>
        prevSelected.filter((item) => item !== qtyMultiplier),
      );
      setSelectAllQtyMultiplier(false);
    } else {
      setQtyMultiplierSelected((prevSelected) => [
        ...prevSelected,
        qtyMultiplier,
      ]);
      setSelectAllQtyMultiplier(
        qtyMultiplierSelected.length === uniqueDataQtyMultiplier.length - 1,
      );
    }
  };

  const handleSelectAllForQtyMultiplier = () => {
    const allChecked = !selectAllQtyMultiplier;
    setSelectAllQtyMultiplier(allChecked);

    if (allChecked) {
      setQtyMultiplierSelected(
        uniqueDataQtyMultiplier.map((d) => d.toString()),
      );
    } else {
      setQtyMultiplierSelected([]);
    }
  };

  const handleCheckboxChangeEmail = (email) => {
    const isSelected = emailSelected.includes(email);
    if (isSelected) {
      setEmailSelected((prevSelected) =>
        prevSelected.filter((item) => item !== email),
      );
      setSelectAllEmail(false);
    } else {
      setEmailSelected((prevSelected) => [ ...prevSelected, email ]);
      setSelectAllEmail(emailSelected.length === uniqueDataEmail.length - 1);
    }
  };

  const handleSelectAllForEmail = () => {
    const allChecked = !selectAllEmail;
    setSelectAllEmail(allChecked);

    if (allChecked) {
      setEmailSelected(uniqueDataEmail.map((d) => d.toLowerCase()));
    } else {
      setEmailSelected([]);
    }
  };
  const handleCheckboxChangeSqOffTime = (sqOffTime) => {
    const isSelected = sqOffTimeSelected.includes(sqOffTime);
    if (isSelected) {
      setSqOffTimeSelected((prevSelected) =>
        prevSelected.filter((item) => item !== sqOffTime),
      );
      setSelectAllSqOffTime(false);
    } else {
      setSqOffTimeSelected((prevSelected) => [ ...prevSelected, sqOffTime ]);
      setSelectAllSqOffTime(
        sqOffTimeSelected.length === uniqueDataSqOffTime.length - 1,
      );
    }
  };

  const handleSelectAllForSqOffTime = () => {
    const allChecked = !selectAllSqOffTime;
    setSelectAllSqOffTime(allChecked);

    if (allChecked) {
      setSqOffTimeSelected(uniqueDataSqOffTime.map((d) => d.toLowerCase()));
    } else {
      setSqOffTimeSelected([]);
    }
  };

  const handleCheckboxChangeUser = (userId) => {
    const isSelected = userIdSelected.includes(userId);
    if (isSelected) {
      setuserIdSelected(userIdSelected.filter((item) => item !== userId));
      setSelectAllForId(false);
    } else {
      setuserIdSelected((prevSelected) => [ ...prevSelected, userId ]);
      setSelectAllForId(userIdSelected.length === uniqueDatauserId.length - 1);
    }
  };

  const handleSelectAllForUserId = () => {
    const allChecked = !selectAllForId;
    setSelectAllForId(allChecked);
    if (allChecked) {
      setuserIdSelected(uniqueDatauserId.map((d) => d.toLowerCase()));
    } else {
      setuserIdSelected([]);
    }
  };
  const handleCheckboxChangeMaxLossPerTrade = (maxLossPerTrade) => {
    const isSelected = maxLossPerTradeSelected.includes(maxLossPerTrade);
    if (isSelected) {
      setMaxLossPerTradeSelected((prevSelected) =>
        prevSelected.filter((item) => item !== maxLossPerTrade),
      );
      setSelectAllMaxLossPerTrade(false);
    } else {
      setMaxLossPerTradeSelected((prevSelected) => [
        ...prevSelected,
        maxLossPerTrade,
      ]);
      setSelectAllMaxLossPerTrade(
        maxLossPerTradeSelected.length === uniqueDataMaxLossPerTrade.length - 1,
      );
    }
  };

  const handleSelectAllForMaxLossPerTrade = () => {
    const allChecked = !selectAllMaxLossPerTrade;
    setSelectAllMaxLossPerTrade(allChecked);

    if (allChecked) {
      setMaxLossPerTradeSelected(
        uniqueDataMaxLossPerTrade.map((d) => d.toString()),
      );
    } else {
      setMaxLossPerTradeSelected([]);
    }
  };

  const handleOkClick = () => {
    updateFilteredRows({
      nameSelected,
      userIdSelected,
      mobileSelected,
      maxProfitSelected,
      maxLossSelected,
      mtmSelected,
      netSelected,
      availableMarginSelected,
      qtyByExposureSelected,
      maxLossPerTradeSelected,
      maxOpenTradesSelected,
      qtyMultiplierSelected,
      emailSelected,
      sqOffTimeSelected,
      brokerSelected,
      setNameSelected,
      setuserIdSelected,
      setMobileSelected,
      setMaxProfitSelected,
      setMaxLossSelected,
      setSelectAll,
      setSelectAllForId,
      setSelectAllMobile,
      setSelectAllMaxProfit,
      setSelectAllMaxLoss,
      setMTMSelected,
      setSelectAllMTM,
      setNetSelected,
      setSelectAllNet,
      setAvailableMarginSelected,
      setSelectAllAvailableMargin,
      setQtyByExposureSelected,
      setSelectAllQtyByExposure,
      setMaxLossPerTradeSelected,
      setSelectAllMaxLossPerTrade,
      setMaxOpenTradesSelected,
      setSelectAllMaxOpenTrades,
      setQtyMultiplierSelected,
      setSelectAllQtyMultiplier,
      setEmailSelected,
      setSelectAllEmail,
      setSqOffTimeSelected,
      setSelectAllSqOffTime,
      setSelectAllBroker,
      setBrokerSelected,

      setuniqueDataNames,
      setuniqueDataBroker,
      setuniqueDatauserId,
      setuniqueDataSqOffTime,
      setuniqueDataEmail,
      setuniqueDataQtyMultiplier,
      setuniqueDataMaxOpenTrades,
      setuniqueDataQtyByExposure,
      setuniqueDataMaxLossPerTrade,
      setuniqueDataNet,
      setuniqueDataMaxProfit,
      setuniqueDataMaxLoss,
      setuniqueDataMobile,
      setuniqueDataMTM,
      setuniqueDataAvailableMargin,
    });
    setshowSearchProfile((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([ key, value ]) => [ key, false ]),
      ),
    );
  };

  // console.log("rows", brokerState)
  const [ errorDisplayed, setErrorDisplayed ] = useState(false);

  const handleAddRow = (rowData) => {
    // console.log("Adding a new row...");
    // console.log(rows, "cv");

    const mandatoryFields = [ "userId", "name", "broker", "qrCode", "password" ];
    let fieldsWithError = {};

    const hasMissingFields = rows.some((row) => {
      const missingFields = mandatoryFields.filter((field) => !row[ field ]);
      missingFields.forEach((field) => (fieldsWithError[ field ] = true));
      return missingFields.length > 0;
    });

    if (!hasMissingFields) {
      // console.log("No missing fields. Adding new row...");

      setErrorDisplayed(false); // Reset error display status
      const newRow = {
        enabled: false,
        mtmAll: 0,
        net: 0,
        availableMargin: 0,
        name: "",
        userId: "",
        broker: "",
        secretKey: "",
        apiKey: "",
        qrCode: "",
        sqOffTime: "00:00:00",
        maxProfit: 0,
        maxLoss: 0,
        profitLocking: "",
        qtyByExposure: 0,
        maxLossPerTrade: 0,
        maxOpenTrades: 0,
        qtyMultiplier: 0.0,
        mobile: "",
        email: "",
        password: "",
        autoLogin: false,
        historicalApi: false,
        inputDisabled: false,
      };

      const updatedRows = [ ...rows, newRow ];
      // setRows(updatedRows);
      dispatch(
        setBrokers({
          brokers: updatedRows,
        }),
      );
      // console.log("New row added.");
    } else {
      // console.log("Missing fields detected. Displaying error message...");

      // Display error message for missing fields
      const missingFields = mandatoryFields.filter(
        (field) => fieldsWithError[ field ],
      );
      if (missingFields.length > 0) {
        const errorMsg = `Please enter ${missingFields.join(", ")} before adding a new row.`;
        handleMsg({
          msg: errorMsg,
          logType: "ERROR",
          timestamp: `${new Date().toLocaleString()}`,
          user: rows.userId ? rows.userId : "USER",
        });
      }
      setErrorDisplayed(true);
    }
  };

  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      if (tableRef.current) {
        tableRef.current.scrollLeft = 0;
        tableRef.current.scrollTop = tableRef.current.scrollHeight;
      }
    }, 100);

    return () => clearTimeout(scrollTimeout);
  }, [ rows.length ]);

  const updateRowData = (index, updatedData) => {
    // setRows((prevRows) => {

    //   return updatedRows;
    // });
    const updatedRows = [ ...rows ];
    updatedRows[ index ] = { ...updatedRows[ index ], ...updatedData };
    dispatch(
      setBrokers({
        brokers: updatedRows,
      }),
    );
  };

  const handleValidateRefs = useRef([]);
  const handleVerifyLogin = () => {
    handleValidateRefs.current.forEach((validateRef) => {
      setInterval(validateRef, 3000);
      // validateRef();
    });
    if (tableRef.current) {
      tableRef.current.scrollLeft = 0;
    }
  };
  const [ filteredRows, setFilteredRows ] = useState(rows);
  useEffect(() => {
    setFilteredRows(rows);
  }, [ rows ]);
  const updateFilteredRows = ({
    nameSelected,
    userIdSelected,
    mobileSelected,
    maxProfitSelected,
    maxLossSelected,
    mtmSelected,
    netSelected,
    availableMarginSelected,
    qtyByExposureSelected,
    maxLossPerTradeSelected,
    maxOpenTradesSelected,
    qtyMultiplierSelected,

    emailSelected,
    brokerSelected,
    sqOffTimeSelected,
    setuniqueDataNames,
    setuniqueDataBroker,
    setuniqueDatauserId,
    setuniqueDataSqOffTime,
    setuniqueDataEmail,
    setuniqueDataQtyMultiplier,
    setuniqueDataMaxOpenTrades,
    setuniqueDataQtyByExposure,
    setuniqueDataMaxLossPerTrade,
    setuniqueDataNet,
    setuniqueDataMaxProfit,
    setuniqueDataMaxLoss,
    setuniqueDataMobile,
    setuniqueDataMTM,
    setuniqueDataAvailableMargin,
  }) => {
    let prevfilteredRows;
    if (userIdSelected.length !== 0) {
      prevfilteredRows = rows.filter((row) =>
        userIdSelected.includes(row.userId.toLowerCase()),
      );
    } else {
      prevfilteredRows = rows;
    }
    if (nameSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        nameSelected.includes(row.name.toLowerCase()),
      );
    }
    if (mobileSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        mobileSelected.includes(row.mobile.toString()),
      );
    }
    if (maxProfitSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        maxProfitSelected.includes(row.maxProfit.toString()),
      );
    }
    if (maxLossSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        maxLossSelected.includes(row.maxLoss.toString()),
      );
    }
    if (mtmSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        mtmSelected.includes(row.mtmAll.toString()),
      );
    }
    if (qtyByExposureSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        qtyByExposureSelected.includes(row.qtyByExposure.toString()),
      );
    }
    if (netSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        netSelected.includes(row.net.toString()),
      );
    }
    if (availableMarginSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        availableMarginSelected.includes(row.availableMargin.toString()),
      );
    }
    if (maxLossPerTradeSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        maxLossPerTradeSelected.includes(row.maxLossPerTrade.toString()),
      );
    }
    if (maxOpenTradesSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        maxOpenTradesSelected.includes(row.maxOpenTrades.toString()),
      );
    }
    if (qtyMultiplierSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        qtyMultiplierSelected.includes(row.qtyMultiplier.toString()),
      );
    }
    if (emailSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        emailSelected.includes(row.email.toLowerCase()),
      );
    }
    if (sqOffTimeSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        sqOffTimeSelected.includes(row.sqOffTime.toLowerCase()),
      );
    }
    if (brokerSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        brokerSelected.includes(row.broker.toLowerCase()),
      );
    }

    setuniqueDataNames(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.name;
          }),
        ),
      );
    });
    setuniqueDataBroker(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.broker;
          }),
        ),
      );
    });
    setuniqueDatauserId(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.userId;
          }),
        ),
      );
    });
    setuniqueDataSqOffTime(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.sqOffTime;
          }),
        ),
      );
    });
    setuniqueDataEmail(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.email;
          }),
        ),
      );
    });
    setuniqueDataQtyMultiplier(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.qtyMultiplier;
          }),
        ),
      );
    });
    setuniqueDataMaxOpenTrades(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.maxOpenTrades;
          }),
        ),
      );
    });
    setuniqueDataQtyByExposure(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.qtyByExposure;
          }),
        ),
      );
    });
    setuniqueDataMaxLossPerTrade(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.maxLossPerTrade;
          }),
        ),
      );
    });
    setuniqueDataNet(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.net;
          }),
        ),
      );
    });
    setuniqueDataMaxProfit(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.maxProfit;
          }),
        ),
      );
    });
    setuniqueDataMaxLoss(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.maxLoss;
          }),
        ),
      );
    });
    setuniqueDataMobile(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.mobile;
          }),
        ),
      );
    });
    setuniqueDataMTM(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.mtmAll;
          }),
        ),
      );
    });
    setuniqueDataAvailableMargin(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.availableMargin;
          }),
        ),
      );
    });

    setFilteredRows(prevfilteredRows);
  };

  const [ showSecretKey, setShowSecretKey ] = useState(false);

  const allSeqState = useSelector((state) => state.allSeqReducer);
  const allVisState = useSelector((state) => state.allVisReducer);

  const userProfPageCols = [
    "Action",
    "Client Id",
    "Manual Exit",
    "Mtm (All)",
    "Available margin",
    "Display Name",
    "Broker",
    "API Key",
    "API Secret Key",
    "Data API",
    "QR code",
    "Exit Time",
    "Auto Login",
    "Pin",
    "Max Profit",
    "Max Loss",
    "Profit Locking",
    "Qty By Exposure",
    // "Qty on Max",
    // "Max Loss Per",
    "Max Loss Per Trade",
    "Max Open Trades",
    "Qty Multiplier",
    "Mobile",
    "Email",
    "Net",
    "Market Orders",
    "Enable NRML sqoff",
    "Enable CNC sqOff",
    "Exit Order Type",
    "2FA",
    "Max Loss Wait",
    "Trading Authorization Req",
    "Commodity Margin",
    "API User Details",
    "Utilized Margin",
  ];

  const [ userProfColVis, setuserProfColVis ] = useState(allVisState.userProfVis);

  const [ profColsSelectedALL, setprofColsSelectedALL ] = useState(false);

  const profPageColSelectAll = () => {
    // console.log("profPageColSelectAll");
    setprofColsSelectedALL((prev) => !prev);
    userProfPageCols.map((userSettingCol) => {
      setuserProfColVis((prev) => ({
        ...prev,
        [ userSettingCol ]: profColsSelectedALL,
      }));
    });
  };

  const [ userProfSeq, setuserProfSeq ] = useState(allSeqState.userProfSeq);
  useEffect(() => {
    setuserProfSeq(allSeqState.userProfSeq);
    setuserProfColVis((prev) => {
      const colVis = {};
      Object.keys(userProfColVis).map((col) => {
        if (allSeqState.userProfSeq.includes(col)) {
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
        userProfVis: userProfColVis,
      }),
    );
    // console.log("userProfColVis", userProfColVis)
    if (new Set(Object.values(userProfColVis)).size === 1) {
      if (Object.values(userProfColVis).includes(true)) {
        setuserProfSeq(userProfPageCols);
      } else {
        setuserProfSeq([]);
      }
    }
  }, [ userProfColVis ]);

  useEffect(() => {
    // console.log("userProfSeq", userProfSeq)
    dispatch(
      setAllSeq({
        ...allSeqState,
        userProfSeq: userProfSeq,
      }),
    );
  }, [ userProfSeq ]);

  const handleCloseAllSearchBox = (e) => {
    const allowedElements = [ "th img", ".Filter-popup" ];
    if (!allowedElements.some((element) => e.target.closest(element))) {
      // The click was outside of the allowed elements, perform your function here
      setshowSearchProfile((prev) =>
        Object.fromEntries(
          Object.entries(prev).map(([ key, value ]) => [ key, false ]),
        ),
      );
    }
  };

  const userProfTH = {
    Action: userProfColVis[ "Action" ] && (
      <th colSpan="2">
        <div>
          <small>Action</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setShowSelectBox((prev) => !prev);
            }}
          />
        </div>
        {showSelectBox && (
          <div>
            <select
              type="text"
              value={colFilter.val}
              onChange={(e) => {
                setcolFilter({
                  asPerCol: "Action",
                  val: e.target.value,
                });
              }}
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
    "Client Id": userProfColVis[ "Client Id" ] && (
      <th>
        <div>
          <small>Client Id</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-25px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchId" ? !prev.showSearchId : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchId && (
          <div className="Filter-popup">
            <form id="filter-form-user" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllForId}
                    onChange={handleSelectAllForUserId}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDatauserId
                    .filter((name) => name !== undefined)
                    .map((userId, index) => {
                      return (
                        <div key={index} className="filter-inputs">
                          <input
                            type="checkbox"
                            style={{
                              width: "15px",
                            }}
                            checked={userIdSelected.includes(
                              userId.toLowerCase(),
                            )}
                            onChange={() =>
                              handleCheckboxChangeUser(userId.toLowerCase())
                            }
                          />
                          <label>{userId}</label>
                        </div>
                      );
                    })}
                </li>
              </ul>
            </form>

            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([ key ]) => [ key, false ]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),

    "Manual Exit": userProfColVis[ "Manual Exit" ] && (
      <th>
        <div>
          <small>Manual Exit</small>
        </div>
      </th>
    ),
    "Mtm (All)": userProfColVis[ "Mtm (All)" ] && (
      <th>
        <div>
          <small>Mtm (All)</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-22px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchMTM" ? !prev.showSearchMTM : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchMTM && (
          <div className="Filter-popup">
            <form id="filter-form-mtm" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllMTM}
                    onChange={handleSelectAllForMTM}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMTM
                    .filter((name) => name !== undefined)
                    .map((mtm, index) => (
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
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([ key, value ]) => [ key, false ]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Available margin": userProfColVis[ "Available margin" ] && (
      <th>
        <div>
          <small>Available margin</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchAvailableMargin"
                      ? !prev.showSearchAvailableMargin
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchAvailableMargin && (
          <div className="Filter-popup">
            <form
              id="filter-form-available-margin"
              className="Filter-inputs-container"
            >
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllAvailableMargin}
                    onChange={handleSelectAllForAvailableMargin}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataAvailableMargin
                    .filter((name) => name !== undefined)
                    .map((availableMargin, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={availableMarginSelected.includes(
                            availableMargin,
                          )}
                          onChange={() =>
                            handleCheckboxChangeAvailableMargin(availableMargin)
                          }
                        />
                        <label>{availableMargin}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([ key, value ]) => [ key, false ]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Display Name": userProfColVis[ "Display Name" ] && (
      <th>
        <div>
          <small>Display Name</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-13px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchName" ? !prev.showSearchName : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchName && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAll}
                    onChange={handleSelectAllForName}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataNames
                    .filter((name) => name !== undefined)
                    .map((name, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={nameSelected.includes(name.toLowerCase())}
                          onChange={() =>
                            handleCheckboxChange(name.toLowerCase())
                          }
                        />
                        <label>{name}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([ key, value ]) => [ key, false ]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    Broker: userProfColVis[ "Broker" ] && (
      <th>
        <div>
          <small>Broker</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-10px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchBroker" ? !prev.showSearchBroker : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchBroker && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllBroker}
                    onChange={handleSelectAllForBroker}
                  />
                  Select all
                </li>
                {uniqueDataBroker
                  .filter((name) => name !== undefined)
                  .map((broker, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={brokerSelected.includes(broker)}
                        onChange={() => handleCheckboxChangeBroker(broker)}
                      />
                      <label>{broker}</label>
                    </div>
                  ))}
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([ key, value ]) => [ key, false ]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "API Key": userProfColVis[ "API Key" ] && (
      <th>
        <div>
          <small>API Key</small>
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
    "API Secret Key": userProfColVis[ "API Secret Key" ] && (
      <th>
        <div>
          <small>API Secret Key</small>
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
    "Data API": userProfColVis[ "Data API" ] && (
      <th>
        {/* <div>
      <small>Data API</small>
      <div className="icon-container">
        <CiFilter className="filter_icon" />
      </div>
    </div> */}
        <div>
          <small>Data API</small>
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
    "QR code": userProfColVis[ "QR code" ] && (
      <th>
        <div>
          <small>QR code</small>
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
    "Exit Time": userProfColVis[ "Exit Time" ] && (
      <th>
        <div>
          <small>Exit Time</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-20px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchSqOffTime"
                      ? !prev.showSearchSqOffTime
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchSqOffTime && (
          <div className="Filter-popup">
            <form
              id="filter-form-sqOffTime"
              className="Filter-inputs-container"
            >
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllSqOffTime}
                    onChange={handleSelectAllForSqOffTime}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataSqOffTime
                    .filter((name) => name !== undefined)
                    .map((sqOffTime, index) => (
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
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([ key, value ]) => [ key, false ]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Auto Login": userProfColVis[ "Auto Login" ] && (
      <th>
        <div>
          <small>Auto Login</small>
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
    Pin: userProfColVis[ "Pin" ] && (
      <th>
        <div>
          <small>Pin</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-40px",
            }}
          />
        </div>
      </th>
    ),
    "Max Profit": userProfColVis[ "Max Profit" ] && (
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
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchMaxProfit"
                      ? !prev.showSearchMaxProfit
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchMaxProfit && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllMaxProfit}
                    onChange={handleSelectAllForMaxProfit}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMaxProfit
                    .filter((name) => name !== undefined)
                    .map((maxProfit, index) => (
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
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([ key, value ]) => [ key, false ]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Max Loss": userProfColVis[ "Max Loss" ] && (
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
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchMaxLoss"
                      ? !prev.showSearchMaxLoss
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>

        {showSearchProfile.showSearchMaxLoss && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllMaxLoss}
                    onChange={handleSelectAllForMaxLoss}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMaxLoss
                    .filter((name) => name !== undefined)
                    .map((maxLoss, index) => (
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
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([ key, value ]) => [ key, false ]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Profit Locking": userProfColVis[ "Profit Locking" ] && (
      <th>
        <div>
          <small>Profit Locking</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-5px",
            }}
          />
        </div>
      </th>
    ),
    "Qty By Exposure": userProfColVis[ "Qty By Exposure" ] && (
      <th>
        <div>
          <small>Qty By Exposure</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchQtyByExposure"
                      ? !prev.showSearchQtyByExposure
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchQtyByExposure && (
          <div className="Filter-popup">
            <form
              id="filter-form-qty-by-exposure"
              className="Filter-inputs-container"
            >
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllQtyByExposure}
                    onChange={handleSelectAllForQtyByExposure}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataQtyByExposure
                    .filter((name) => name !== undefined)
                    .map((qtyByExposure, index) => (
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
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([ key, value ]) => [ key, false ]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Qty on Max Loss Per Trade": userProfColVis[
      "Qty on Max Loss Per Trade"
    ] && (
        <th>
          <div>
            <small>Qty on Max Loss Per Trade</small>
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
    "Max Loss Per Trade": userProfColVis[ "Max Loss Per Trade" ] && (
      <th>
        <div>
          <small>Max Loss Per Trade</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchMaxLossPerTrade"
                      ? !prev.showSearchMaxLossPerTrade
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchMaxLossPerTrade && (
          <div className="Filter-popup">
            <form
              id="filter-form-max-loss-per-trade"
              className="Filter-inputs-container"
            >
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllMaxLossPerTrade}
                    onChange={handleSelectAllForMaxLossPerTrade}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMaxLossPerTrade
                    .filter((name) => name !== undefined)
                    .map((maxLossPerTrade, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={maxLossPerTradeSelected.includes(
                            maxLossPerTrade.toString(),
                          )}
                          onChange={() =>
                            handleCheckboxChangeMaxLossPerTrade(
                              maxLossPerTrade.toString(),
                            )
                          }
                        />
                        <label>{maxLossPerTrade}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([ key, value ]) => [ key, false ]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Max Open Trades": userProfColVis[ "Max Open Trades" ] && (
      <th>
        <div>
          <small>Max Open Trades</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchMaxOpenTrades"
                      ? !prev.showSearchMaxOpenTrades
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchMaxOpenTrades && (
          <div className="Filter-popup">
            <form
              id="filter-form-max-open-trades"
              className="Filter-inputs-container"
            >
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllMaxOpenTrades}
                    onChange={handleSelectAllForMaxOpenTrades}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMaxOpenTrades
                    .filter((name) => name !== undefined)
                    .map((maxOpenTrades, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={maxOpenTradesSelected.includes(
                            maxOpenTrades.toString(),
                          )}
                          onChange={() =>
                            handleCheckboxChangeMaxOpenTrades(
                              maxOpenTrades.toString(),
                            )
                          }
                        />
                        <label>{maxOpenTrades}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([ key, value ]) => [ key, false ]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Qty Multiplier": userProfColVis[ "Qty Multiplier" ] && (
      <th>
        <div>
          <small>Qty Multiplier</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchQtyMultiplier"
                      ? !prev.showSearchQtyMultiplier
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchQtyMultiplier && (
          <div className="Filter-popup">
            <form
              id="filter-form-qty-multiplier"
              className="Filter-inputs-container"
            >
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllQtyMultiplier}
                    onChange={handleSelectAllForQtyMultiplier}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataQtyMultiplier
                    .filter((name) => name !== undefined)
                    .map((qtyMultiplier, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={qtyMultiplierSelected.includes(
                            qtyMultiplier.toString(),
                          )}
                          onChange={() =>
                            handleCheckboxChangeQtyMultiplier(
                              qtyMultiplier.toString(),
                            )
                          }
                        />
                        <label>{qtyMultiplier}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([ key, value ]) => [ key, false ]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    Mobile: userProfColVis[ "Mobile" ] && (
      <th>
        <div>
          <small>Mobile</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-25px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchMobile" ? !prev.showSearchMobile : false,
                  ]),
                ),
              }));
            }}
          />
        </div>

        {showSearchProfile.showSearchMobile && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllMobile}
                    onChange={handleSelectAllForMobile}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataMobile.map((mobile, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={mobileSelected.includes(mobile)}
                        onChange={() => handleCheckBoxChangeForMobile(mobile)}
                      />
                      <label>{mobile}</label>
                    </div>
                  ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([ key, value ]) => [ key, false ]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    Email: userProfColVis[ "Email" ] && (
      <th>
        {/* <div>
      <small>Email</small>
      <div className="icon-container">
        <CiFilter
          className="filter_icon"
          onClick={() => {
            setShowSearchEmail((prev) => !prev);
          }}
        />
      </div>
    </div> */}
        <div>
          <small>Email</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-30px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchEmail" ? !prev.showSearchEmail : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchProfile.showSearchEmail && (
          <div className="Filter-popup">
            <form id="filter-form-email" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllEmail}
                    onChange={handleSelectAllForEmail}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataEmail.map((email, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={emailSelected.includes(email.toLowerCase())}
                        onChange={() =>
                          handleCheckboxChangeEmail(email.toLowerCase())
                        }
                      />
                      <label>{email}</label>
                    </div>
                  ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([ key, value ]) => [ key, false ]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    Net: userProfColVis[ "Net" ] && (
      <th>
        <div>
          <small>Net</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-35px",
            }}
            onClick={() => {
              setshowSearchProfile((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchNet" ? !prev.showSearchNet : false,
                  ]),
                ),
              }));
            }}
          />
        </div>

        {showSearchProfile.showSearchNet && (
          <div className="Filter-popup">
            <form id="filter-form-net" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px", marginRight: "5px" }}
                    checked={selectAllNet}
                    onChange={handleSelectAllForNet}
                  />
                  Select all
                </li>
                <li>
                  {uniqueDataNet
                    .filter((name) => name !== undefined)
                    .map((net, index) => (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "12px",
                          }}
                          checked={netSelected.includes(net)}
                          onChange={() => handleCheckboxChangeNet(net)}
                        />
                        <label>{net}</label>
                      </div>
                    ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>OK</button>
              <button
                onClick={() => {
                  setshowSearchProfile((prev) =>
                    Object.fromEntries(
                      Object.entries(prev).map(([ key, value ]) => [ key, false ]),
                    ),
                  );
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Market Orders": userProfColVis[ "Market Orders" ] && (
      <th>
        <div>
          <small>Market Orders</small>
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
    "Enable NRML sqoff": userProfColVis[ "Enable NRML sqoff" ] && (
      <th>
        <div>
          <small>Enable NRML sqoff</small>
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
    "Enable CNC sqOff": userProfColVis[ "Enable CNC sqOff" ] && (
      <th>
        <div>
          <small>Enable CNC sqOff</small>
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
    "Exit Order Type": userProfColVis[ "Exit Order Type" ] && (
      <th>
        <div>
          <small>Exit Order Type</small>
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
    // Password: userProfColVis["Password"] && (
    //   <th>
    //     <div>
    //       <small>Password</small>
    //       <img
    //         src={filterIcon}
    //         alt="icon"
    //         style={{
    //           height: "25px",
    //           width: "25px",
    //           marginLeft: "-25px",
    //         }}
    //       />
    //     </div>
    //   </th>
    // ),
    "2FA": userProfColVis[ "2FA" ] && (
      <th>
        <div>
          <small>2FA</small>
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
    "Max Loss Wait Sec": userProfColVis[ "Max Loss Wait Sec" ] && (
      <th>
        <div>
          <small>Max Loss Wait Sec</small>
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
    "Trading Authorization Req": userProfColVis[
      "Trading Authorization Req"
    ] && (
        <th>
          <div>
            <small style={{ paddingTop: "7px" }}>
              Trading Authorization
              <br /> Req
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
    "Commodity Margin": userProfColVis[ "Commodity Margin" ] && (
      <th>
        <div>
          <small>Commodity Margin</small>
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
    "API User Details": userProfColVis[ "API User Details" ] && (
      <th>
        <div>
          <small>API User Details</small>
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
    "Utilized Margin": userProfColVis[ "Utilized Margin" ] && (
      <th>
        <div>
          <small>Utilized Margin</small>
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
    "Utilized Margin %": userProfColVis[ "Utilized Margin %" ] && (
      <th>
        <div>
          <small>Utilized Margin %</small>
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
  };

  return (
    <div onClick={handleCloseAllSearchBox}>
      <MarketIndex />

      <div className="main-section">
        <LeftNav />
        <div className="middle-main-container">
          <TopNav
            pageCols={userProfPageCols}
            colsSelectedAll={profColsSelectedALL}
            setColsSelectedALL={setprofColsSelectedALL}
            selectAll={profPageColSelectAll}
            colVis={userProfColVis}
            setColVis={setuserProfColVis}
            setSeq={setuserProfSeq}
            rows={rows}
          />
          <div className="main-table" ref={tableRef}>
            <table>
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 20,
                }}
              >
                {userProfSeq.map((colName, index) => {
                  return (
                    <React.Fragment key={index}>
                      {userProfTH[ colName ]}
                    </React.Fragment>
                  );
                })}
              </thead>
              <tbody>
                {filteredRows.map((rowData, index) => {
                  const userProfTD = {
                    Action: userProfColVis[ "Action" ] && (
                      <td
                        style={{ width: "15%", paddingLeft: "15px" }}
                        colSpan="2"
                      >
                        <span className="tooltip-container">
                          {rowData.enabled ? (
                            <img
                              src={Stop2} // Provide the source for the first image
                              alt="icon"
                              className="logout_icon"
                              style={{
                                height: "25px",
                                width: "25px",
                              }}
                              onClick={() => {
                                updateRowData(index, {
                                  enabled: !rowData.enabled,
                                });
                              }}
                            />
                          ) : (
                            <img
                              src={Start} // Provide the source for the second image
                              alt="icon"
                              className="logout_icon"
                              style={{
                                height: "25px",
                                width: "25px",
                              }}
                              onClick={() => {
                                updateRowData(index, {
                                  enabled: !rowData.enabled,
                                });
                              }}
                            />
                          )}
                          <span className="tooltiptexts ">
                            {rowData.enabled ? "Disable" : "Enable"}
                          </span>
                        </span>
                        <span className="tooltip-container">
                          {rowData.inputDisabled ? (
                            <img
                              src={Logout}
                              alt="icon"
                              className="logout_icon"
                              style={{
                                height: "25px",
                                width: "25px",
                              }}
                              onClick={() => {
                                handleLogout(rowData, index);
                              }}
                            />
                          ) : (
                            <img
                              src={Log}
                              alt="icon"
                              className="logout_icon"
                              style={{
                                height: "25px",
                                width: "25px",
                              }}
                            />
                          )}
                          <span
                            className={`tooltiptext ${rowData.inputDisabled
                              ? "login-tooltip"
                              : "logout-tooltip"
                              }`}
                          >
                            {rowData.inputDisabled ? "Logout" : "Login"}
                          </span>
                        </span>

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
                              handleDelete(rowData, index);
                            }}
                          />
                          <span className="tooltiptext delete-tooltip">
                            Delete
                          </span>
                        </span>
                      </td>
                    ),
                    "Client Id": userProfColVis[ "Client Id" ] && (
                      <td>
                        <input
                          type="text"
                          value={rowData.userId}
                          onChange={(e) =>
                            updateRowData(index, { userId: e.target.value })
                          }
                          disabled={rowData.inputDisabled}
                          autoComplete="off"
                        />
                      </td>
                    ),
                    "Manual Exit": userProfColVis[ "Manual Exit" ] && (
                      <td style={{ textAlign: "center" }}>
                        <img
                          src={Log}
                          alt="icon"
                          className="logout_icon"
                          style={{
                            height: "25px",
                            width: "25px",
                          }}
                        />
                      </td>
                    ),
                    "Mtm (All)": userProfColVis[ "Mtm (All)" ] && (
                      <td style={{ textAlign: "right" }}>
                        <input
                          type="number"
                          value={rowData.mtmAll}
                          onChange={(e) =>
                            updateRowData(index, { mtmAll: e.target.value })
                          }
                          style={{ textAlign: "center", padding: "8px" }}
                          readOnly // Adding the readOnly attribute here
                        />
                      </td>
                    ),
                    "Available margin": userProfColVis[ "Available margin" ] && (
                      <td>
                        <input
                          type="number"
                          value={rowData.availableMargin.toFixed(2)}
                          onChange={(e) =>
                            updateRowData(index, {
                              availableMargin: e.target.value,
                            })
                          }
                          style={{ textAlign: "center", padding: "8px" }}
                          disabled={rowData.inputDisabled}
                          readOnly
                          step="0.01"
                        />
                      </td>
                    ),
                    "Display Name": userProfColVis[ "Display Name" ] && (
                      <td>
                        <input
                          type="text"
                          value={rowData.name}
                          onChange={(e) =>
                            updateRowData(index, { name: e.target.value })
                          }
                          style={{ padding: "8px" }}
                          disabled={rowData.inputDisabled}
                        />
                      </td>
                    ),
                    Broker: userProfColVis[ "Broker" ] && (
                      <td>
                        <select
                          onChange={(e) =>
                            updateRowData(index, { broker: e.target.value })
                          }
                          value={rowData.broker}
                          disabled={rowData.inputDisabled}
                          style={{ padding: "8px" }}
                        >
                          <option value="">--select</option>
                          <option value="angelone">Angelone</option>
                          <option value="Fivepaisa">Fivepaisa</option>
                          <option value="flattrade">Flattrade</option>
                          <option value="fyers">Fyers</option>
                          <option value="finvasia">Finvasia</option>
                          <option value="Sharekhan">Sharekhan</option>
                          <option value="Upstox">Upstox</option>
                          <option value="Zerodha">Zerodha</option>
                          <option value="pseudo account">Pseudo account</option>
                        </select>
                      </td>
                    ),
                    "API Key": userProfColVis[ "API Key" ] && (
                      <td>
                        <div style={{ position: "relative" }}>
                          <input
                            type={showPasswordapi ? "text" : "password"}
                            value={rowData.apiKey}
                            onChange={(e) =>
                              updateRowData(index, { apiKey: e.target.value })
                            }
                            disabled={rowData.inputDisabled}
                            style={{ paddingRight: "25px", padding: "8px" }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              right: "5px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              cursor: "pointer",
                            }}
                            onClick={togglePasswordApiVisibility}
                          >
                            {showPasswordapi ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                      </td>
                    ),
                    "API Secret Key": userProfColVis[ "API Secret Key" ] && (
                      <td>
                        {showSecretKey && (
                          <div style={{ position: "relative" }}>
                            <input
                              type={showPassword ? "text" : "password"}
                              value={rowData.secretKey}
                              disabled={rowData.inputDisabled}
                              onChange={(e) => {
                                updateRowData(index, {
                                  secretKey: e.target.value,
                                });
                              }}
                              style={{ paddingRight: "25px", padding: "8px" }}
                            />
                            <span
                              style={{
                                position: "absolute",
                                right: "5px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                              }}
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                          </div>
                        )}
                      </td>
                    ),
                    "Data API": userProfColVis[ "Data API" ] && (
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={rowData.historicalApi}
                          value={rowData.historicalApi}
                          onChange={() => {
                            updateRowData(index, {
                              historicalApi: !rowData.historicalApi,
                            });
                          }}
                          style={{ padding: "8px" }}
                        />
                      </td>
                    ),
                    "QR code": userProfColVis[ "QR code" ] && (
                      <td>
                        <div style={{ position: "relative" }}>
                          <input
                            type={showPasswordqr ? "text" : "password"}
                            value={rowData.qrCode}
                            onChange={(e) =>
                              updateRowData(index, { qrCode: e.target.value })
                            }
                            disabled={rowData.inputDisabled}
                            style={{ paddingRight: "25px", padding: "8px" }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              right: "5px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              cursor: "pointer",
                            }}
                            onClick={togglePasswordQrVisibility}
                          >
                            {showPasswordqr ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                      </td>
                    ),
                    "Exit Time": userProfColVis[ "Exit Time" ] && (
                      <td>
                        <input
                          type="text"
                          value={rowData.sqOffTime}
                          onChange={(e) =>
                            updateRowData(index, { sqOffTime: e.target.value })
                          }
                          style={{ textAlign: "center" }}
                        />
                      </td>
                    ),
                    "Auto Login": userProfColVis[ "Auto Login" ] && (
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={rowData.autoLogin}
                          value={rowData.autoLogin}
                          onChange={() => {
                            updateRowData(index, {
                              autoLogin: !rowData.autoLogin,
                            });
                          }}
                          style={{ padding: "8px" }}
                        />
                      </td>
                    ),
                    Pin: userProfColVis[ "Pin" ] && (
                      <td>
                        <input
                          type="password"
                          value={rowData.password}
                          onChange={(e) =>
                            updateRowData(index, { password: e.target.value })
                          }
                          disabled={rowData.inputDisabled}
                          style={{
                            // width: '40%',
                            display: "inline-block",
                            padding: "8px",
                          }}
                          autoComplete="off"
                        />
                      </td>
                    ),
                    "Max Profit": userProfColVis[ "Max Profit" ] && (
                      <td>
                        <input
                          type="number"
                          value={rowData.maxProfit}
                          onChange={(e) =>
                            updateRowData(index, { maxProfit: e.target.value })
                          }
                          style={{ textAlign: "center", padding: "8px" }}
                        />
                      </td>
                    ),
                    "Max Loss": userProfColVis[ "Max Loss" ] && (
                      <td>
                        <input
                          type="number"
                          value={rowData.maxLoss}
                          onChange={(e) =>
                            updateRowData(index, { maxLoss: e.target.value })
                          }
                          style={{ textAlign: "center", padding: "8px" }}
                        />
                      </td>
                    ),
                    "Profit Locking": userProfColVis[ "Profit Locking" ] && (
                      <td>
                        <input
                          type="number"
                          value={0}
                          onChange={(e) =>
                            updateRowData(index, {
                              profitLocking: e.target.value,
                            })
                          }
                          style={{ padding: "8px", textAlign: "center" }}
                        />
                      </td>
                    ),
                    "Qty By Exposure": userProfColVis[ "Qty By Exposure" ] && (
                      <td>
                        <input
                          type="number"
                          value={rowData.qtyByExposure}
                          onChange={(e) =>
                            updateRowData(index, {
                              qtyByExposure: e.target.value,
                            })
                          }
                          style={{ textAlign: "center", padding: "8px" }}
                        />
                      </td>
                    ),
                    "Qty on Max Loss Per Trade": userProfColVis[
                      "Qty on Max Loss Per Trade"
                    ] && (
                        <td style={{ textAlign: "center" }}>
                          <input
                            type="checkbox"
                            name="Qty_on_Max_Loss_PerTrade"
                            style={{ padding: "8px" }}
                          />
                        </td>
                      ),
                    "Max Loss Per Trade": userProfColVis[
                      "Max Loss Per Trade"
                    ] && (
                        <td>
                          <input
                            type="number"
                            value={rowData.maxLossPerTrade}
                            onChange={(e) =>
                              updateRowData(index, {
                                maxLossPerTrade: e.target.value,
                              })
                            }
                            style={{ textAlign: "center", padding: "8px" }}
                          />
                        </td>
                      ),
                    "Max Open Trades": userProfColVis[ "Max Open Trades" ] && (
                      <td>
                        <input
                          type="number"
                          value={rowData.maxOpenTrades}
                          onChange={(e) =>
                            updateRowData(index, {
                              maxOpenTrades: e.target.value,
                            })
                          }
                          style={{ textAlign: "center", padding: "8px" }}
                        />
                      </td>
                    ),
                    "Qty Multiplier": userProfColVis[ "Qty Multiplier" ] && (
                      <td>
                        <input
                          type="number"
                          value={rowData.qtyMultiplier}
                          onChange={(e) =>
                            updateRowData(index, {
                              qtyMultiplier: e.target.value,
                            })
                          }
                          style={{ textAlign: "center", padding: "8px" }}
                        />
                      </td>
                    ),
                    Mobile: userProfColVis[ "Mobile" ] && (
                      <td>
                        <input
                          type="text"
                          value={rowData.mobile}
                          onChange={(e) =>
                            updateRowData(index, { mobile: e.target.value })
                          }
                        />
                      </td>
                    ),
                    Email: userProfColVis[ "Email" ] && (
                      <td>
                        <input
                          type="email"
                          value={rowData.email}
                          onChange={(e) =>
                            updateRowData(index, { email: e.target.value })
                          }
                        />
                      </td>
                    ),
                    Net: userProfColVis[ "Net" ] && (
                      <td>
                        <input
                          type="number"
                          value={rowData.net}
                          onChange={(e) =>
                            updateRowData(index, { net: e.target.value })
                          }
                          style={{ textAlign: "center" }}
                          disabled={rowData.inputDisabled}
                        />
                      </td>
                    ),
                    "Market Orders": userProfColVis[ "Market Orders" ] && (
                      <td>
                        <input type="text" />
                      </td>
                    ),
                    "Enable NRML sqoff": userProfColVis[
                      "Enable NRML sqoff"
                    ] && (
                        <td style={{ textAlign: "center" }}>
                          <input type="checkbox" />
                        </td>
                      ),
                    "Enable CNC sqOff": userProfColVis[ "Enable CNC sqOff" ] && (
                      <td style={{ textAlign: "center" }}>
                        <input type="checkbox" />
                      </td>
                    ),
                    "Exit Order Type": userProfColVis[ "Exit Order Type" ] && (
                      <td>
                        <input type="text" />
                      </td>
                    ),
                    // Password: userProfColVis[ "Password" ] && (
                    //   <td>
                    //     <input type="text" />
                    //   </td>
                    // ),
                    "2FA": userProfColVis[ "2FA" ] && (
                      <td>
                        <input type="text" />
                      </td>
                    ),
                    "Max Loss Wait Sec": userProfColVis[
                      "Max Loss Wait Sec"
                    ] && (
                        <td>
                          <input type="text" />
                        </td>
                      ),
                    "Trading Authorization Req": userProfColVis[
                      "Trading Authorization Req"
                    ] && (
                        <td style={{ textAlign: "center" }}>
                          <input type="checkbox" />
                        </td>
                      ),
                    "Commodity Margin": userProfColVis[ "Commodity Margin" ] && (
                      <td>
                        <input type="text" />
                      </td>
                    ),
                    "API User Details": userProfColVis[ "API User Details" ] && (
                      <td>
                        <input
                          type="text"
                          value={rowData.apiUserDetails}
                          onChange={(e) =>
                            updateRowData(index, { name: e.target.value })
                          }
                          style={{ padding: "8px" }}
                          disabled={rowData.inputDisabled}
                        />
                      </td>
                    ),
                    "Utilized Margin": userProfColVis[ "Utilized Margin" ] && (
                      <td>
                        <input type="text" />
                      </td>
                    ),
                    "Utilized Margin %": userProfColVis[
                      "Utilized Margin %"
                    ] && (
                        <td>
                          <input type="text" />
                        </td>
                      ),
                  };
                  return (
                    <tr>
                      {userProfSeq.map((colName, index) => {
                        return (
                          <React.Fragment key={index}>
                            {userProfTD[ colName ]}
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
              className="button"
              onClick={handleAddRow}
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
            handleClearLogs={handleClearLogs}
          />
        </div>
        <RightNav />
      </div>
    </div>
  );
}

export default UserProfiles;
