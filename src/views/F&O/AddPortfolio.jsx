import React, { useState, useEffect, useRef } from "react";
import { json, useParams, useSearchParams } from "react-router-dom";
import Modal from "react-modal";
import "./AddPortfolio.css";
import Timepic from "../../components/Timepic";
import { useNavigate } from "react-router-dom";
import Fandorow from "../F&O/FandOrow";
import { setPortfolios } from "../../store/slices/portfolio";
import Cookies from "universal-cookie";
import { useSelector, useDispatch } from "react-redux";
const cookies = new Cookies();

function AddPortfolio() {
  const dispatch = useDispatch();
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [ selectedWeekdays, setSelectedWeekdays ] = useState([]);
  const [ selectAllChecked, setSelectAllChecked ] = useState(false);
  const [ dropdownVisible, setDropdownVisible ] = useState(false);
  const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ dropdownRef ]);
  useEffect(() => {
    // Check if all weekdays are selected
    const allWeekdaysSelected = selectedWeekdays.length === weekdays.length;
    setSelectAllChecked(allWeekdaysSelected);
  }, [ selectedWeekdays, weekdays ]);

  const toggleWeekday = (weekday) => {
    const updatedSelectedWeekdays = selectedWeekdays.includes(weekday)
      ? selectedWeekdays.filter((day) => day !== weekday)
      : [ ...selectedWeekdays, weekday ];
    const sortedSelectedWeekdays = updatedSelectedWeekdays.sort((a, b) => {
      return weekdays.indexOf(a) - weekdays.indexOf(b);
    });
    setSelectedWeekdays(sortedSelectedWeekdays);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSelectAll = () => {
    if (!selectAllChecked) {
      setSelectedWeekdays([ ...weekdays ]);
    } else {
      setSelectedWeekdays([]);
    }
    setSelectAllChecked();
  };

  const handleOk = () => {
    // Handle Ok button click here, e.g., save selected weekdays
    setDropdownVisible(false); // Close the dropdown after clicking Ok
    setIsDropdownOpen(false);
  };

  const handleCancel = () => {
    // Handle Cancel button click here, e.g., reset selected weekdays
    setSelectedWeekdays([]); // Reset selected weekdays
    setDropdownVisible(false); // Close the dropdown after clicking Cancel
    setIsDropdownOpen(false);
  };

  const params = useParams();
  const FandRowRef = useRef(null);

  const [ editPortfolio, seteditPortfolio ] = useState(false);
  const [ portfolio, setPortfolio ] = useState(() => {
    // console.log("Params : ", portfolio)

    if (params.portfolio) {
      seteditPortfolio(true);
      return JSON.parse(params.portfolio);
    } else {
      seteditPortfolio(false);
      return null; // Return a default value when params.portfolio is not provided
    }
  });
  // console.log("params============", JSON.parse(portfolio))
  const [ showModal, setShowModal ] = useState(false);

  const handleSymbolChange = (e) => {
    setIsPortfolioEdited(true);
    const symbol = e.target.value;
    setstock_symbol(symbol);
    setSelectedDate(""); // Reset selected date when stock symbol changes
  };

  const [ isExecutionTabActive, setIsExecutionTabActive ] = useState(true);
  const [ isTargetTabActive, setisTargetTabActive ] = useState(false);
  const [ isStoplossTabActive, setisStoplossTabActive ] = useState(false);
  const [ isExitTabActive, setisExitTabActive ] = useState(false);
  const navigate = useNavigate();

  const handleConfirmSave = async () => {
    handlePageClick();
    navigate("/F&O/Portfolio");

    setShowModal(false);
  };

  const [ timerValue1, setTimerValue1 ] = useState("00:00:00");
  const [ timerValue2, setTimerValue2 ] = useState("00:00:00");
  const [ timerValue3, setTimerValue3 ] = useState("00:00:00");

  const handleTimerChange = (e, setTimerValue) => {
    const inputTime = e.target.value;
    const formattedTime = formatInputTime(inputTime);
    setTimerValue(formattedTime);
  };

  const formatInputTime = (inputTime) => {
    const numericTime = inputTime.replace(/[^0-9]/g, "");
    const paddedTime = numericTime.padStart(6, "0");
    let hours = Math.min(parseInt(paddedTime.slice(0, 2), 10), 23);
    const minutes = parseInt(paddedTime.slice(2, 4), 10);
    const seconds = parseInt(paddedTime.slice(4, 6), 10);

    // Adjust hours to reset after 24 hours
    hours = hours % 24;

    const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return formattedTime;
  };

  const [ activeTab, setActiveTab ] = useState("execution");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsExecutionTabActive(tab === "execution");
    setisTargetTabActive(tab === "target");
    setisStoplossTabActive(tab === "stoploss");
    setisExitTabActive(tab === "exit");
  };
  const handleToggleClick = (page) => { };
  const [ legsEdited, setlegsEdited ] = useState(false);
  const [ strategyTags, setStrategyTags ] = useState([]);

  const [ exchange, setExchange ] = useState("");
  const [ stock_symbol, setstock_symbol ] = useState("NIFTY");
  const [ selectedDate, setSelectedDate ] = React.useState(null);
  const [ variety, setProduct ] = useState("");
  const [ selectedStrategy, setSelectedStrategy ] = useState("");
  const [ order_type, setEntryOrder ] = useState("");
  const [ portfolio_name, setPortfolioName ] = useState("");

  const [ message, setMessage ] = useState("");
  const mainUser = cookies.get("USERNAME");
  const [ IsPortfolioEdited, setIsPortfolioEdited ] = useState(false);

  // const experies = useSelector(state => state.expiryReducer);

  // console.log("experies", experies)

  const [ dateOptions, setdateOptions ] = useState([]);
  const expiryState = useSelector((state) => state.expiryReducer);
  // console.log("NIFTY, BANKNIFTY, FINNIFTY", NIFTY,"=", BANKNIFTY,"=", FINNIFTY)
  useEffect(() => {
    const generateDateOptions = () => {
      // console.log("experies 123", experies)
      if (!Object.values(expiryState).includes([])) {
        const Expirylist =
          stock_symbol === "NIFTY"
            ? expiryState.NIFTY
            : stock_symbol === "BANKNIFTY"
              ? expiryState.BANKNIFTY
              : stock_symbol === "FINNIFTY"
                ? expiryState.FINNIFTY
                : null;
        // console.log("responseData expiries ", Expirylist)
        const options = Expirylist.map((expiry) => (
          <option
            selected={
              editPortfolio
                ? portfolio.expiry_date === expiry
                : selectedDate === expiry
                  ? true
                  : false
            }
            key={`${stock_symbol}-${expiry}`}
            value={expiry}
          >
            {expiry}
          </option>
        ));
        // console.log("options   ", options)
        setdateOptions(options);
      }
    };
    generateDateOptions();
  }, [ stock_symbol, expiryState ]);

  // useEffect(() => {
  //   console.log("IsPortfolioEdited", IsPortfolioEdited);
  // }, [ IsPortfolioEdited ]);

  const handlePageClick = async () => {
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
      // console.log("responseData", responseData)
      const extractedPortfolio = responseData[ "Portfolio details" ];
      console.log("extractedPortfolio adddport", extractedPortfolio);

      dispatch(
        setPortfolios({
          portfolios: extractedPortfolio,
        }),
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGoBackClick = () => {
    if (editPortfolio) {
      let edited = false;
      const valuesMatch =
        exchange === portfolio.exchange &&
        stock_symbol === portfolio.stock_symbol &&
        selectedStrategy === portfolio.strategy &&
        order_type === portfolio.order_type &&
        portfolio.variety === variety;
      const currentLegs = FandRowRef.current.getLegs();
      const dbLegs = JSON.parse(params.portfolio).legs;

      if (currentLegs.length !== dbLegs.length) {
        edited = true;
        setIsPortfolioEdited(true);
      }

      // Sort both arrays based on some unique property
      currentLegs.sort((a, b) => a.id - b.id);
      dbLegs.sort((a, b) => a.id - b.id);
      // console.log("currentLegs.length !== dbLegs.length", currentLegs, "=  ", dbLegs)
      // Compare each object in the arrays
      for (let i = 0; i < currentLegs.length; i++) {
        const obj1 = currentLegs[ i ];
        const obj2 = dbLegs[ i ];

        // Check if all properties are the same
        for (let key in obj2) {
          if (obj1[ key ] !== obj2[ key ]) {
            edited = true;
            setIsPortfolioEdited(true);
          }
        }
      }

      if (!edited && valuesMatch) {
        navigate("/F&O/Portfolio");
      } else {
        setShowModal(true);
        setMessage("Please save the changes");
      }
    } else {
      let edited = false;
      const valuesMatch =
        exchange === "" &&
        stock_symbol === "NIFTY" &&
        selectedStrategy === "" &&
        order_type === "" &&
        variety === "";
      // console.log("above details=", {exchange,stock_symbol,selectedStrategy,order_type,variety})
      const currentLegs = FandRowRef.current.getLegs();
      if (currentLegs.length !== 1) {
        edited = true;
        setIsPortfolioEdited(true);
      }
      const leg = currentLegs[ 0 ];
      edited =
        leg.transaction_type === "BUY" &&
        leg.option_type === "CE" &&
        leg.lots === 1 &&
        leg.expiry_date === "" &&
        leg.strike === "";
      // console.log("currentLegs", leg.transaction_type === "BUY"," ", leg.option_type === "CE"," ",  leg.lots === 1," ",  leg.expiry_date === ""," ",  leg.strike === "" )

      // Sort both arrays based on some unique property

      // Compare each object in the arrays

      // console.log("!edited && valuesMatch", !edited ,  valuesMatch)
      if (edited && valuesMatch) {
        navigate("/F&O/Portfolio");
      } else {
        setShowModal(true);
        setMessage("Please save the changes");
      }
    }
  };

  useEffect(() => {
    if (editPortfolio) {
      setExchange(portfolio.exchange);
      setstock_symbol(portfolio.stock_symbol);
      setPortfolioName(portfolio.portfolio_name);
      setProduct(portfolio.variety);
      setEntryOrder(portfolio.order_type);
      setSelectedStrategy(portfolio.strategy);
    }
  }, []);

  const { portfolios } = useSelector(state => state.portfolioReducer)

  const handleSavePortfolio = async () => {
    try {
      if (!editPortfolio) {

        const existingPortfolioNames = portfolios.map(
          (portfolio) => portfolio.portfolio_name.toLowerCase(),
        );

        if (existingPortfolioNames.includes(portfolio_name.toLowerCase())) {
          setShowModal(true);
          setMessage("Please enter a unique name for the Portfolio");
          return;
        }

        if (!portfolio_name) {
          setShowModal(true);
          setMessage("Please enter a name for the Portfolio");
          return;
        }
      }
      if (!exchange) {
        setShowModal(true);
        setMessage("Please select an Exchange");
        return;
      }
      if (!variety) {
        setShowModal(true);
        setMessage("Please select a Product");
        return;
      }
      if (!selectedStrategy) {
        setShowModal(true);
        setMessage("Please select a Strategy Tag");
        return;
      }
      if (!order_type) {
        setShowModal(true);
        setMessage("Please select an Entry Order Type");
        return;
      }

      const currentLegs = FandRowRef.current.getLegs();

      const allStrikes = currentLegs.map((leg) => leg.strike);
      const allExpiry_Dates = currentLegs.map((leg) => leg.expiry_date);
      const allLTPs = currentLegs.map((leg) => leg.ltp);

      if (allExpiry_Dates.includes("")) {
        setShowModal(true);
        setMessage("Please select an Expriy Date");
        return;
      }
      if (allStrikes.includes("")) {
        setShowModal(true);
        setMessage("Please select an Strike Price");
        return;
      }

      const newPortfolioItem = {
        strategy_tag: selectedStrategy,
        exchange,
        stock_symbol,
        portfolio_name,
        variety,
        order_type,
        legs: currentLegs,
      };

      const api = {
        endpoint: editPortfolio
          ? `/api/edit_portfolio/${mainUser}/${portfolio_name}`
          : `/api/store_portfolio/${mainUser}`,
      };
      console.log("newPortfolioItem", newPortfolioItem);
      try {
        const response = await fetch(api.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPortfolioItem),
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(
            responseData.message || "Something bad happened. Please try again",
          );
        } else {
          setShowModal(true);
          setMessage(responseData[ 0 ].message);
        }
      } catch (error) {
        setShowModal(true);
        if (error.message === "Portfolio with the same data already exists") {
          setMessage("Portfolio with the same data already exists");
        } else {
          setMessage("Please Try Again");
        }
      }
    } catch (error) {
      setShowModal(true);
      setMessage(error.message || "Something bad happened. Please try again");
    }
  };

  useEffect(() => {
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
        const extractedStrategyTags = responseData.strategies.map(
          (strategy) => strategy.strategy_tag,
        );
        setStrategyTags(extractedStrategyTags);

        // console.log(responseData, '1234');
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStrategy(cookies.get("USERNAME"));
  }, []);
  const [ selectedSymbol, setSelectedSymbol ] = useState("");
  const [ marketData, setMarketData ] = useState({
    nifty50: {},
    niftybank: {},
    finnifty: {},
  });
  useEffect(() => {
    const fetchMarketIndexDetails = async () => {
      try {
        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();

        if (
          (currentHours === 9 && currentMinutes >= 15) ||
          (currentHours < 9 && currentHours > 15) ||
          (currentHours === 15 && currentMinutes <= 45)
        ) {
          const response = await fetch(`/api/get_live_feed`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch market index details");
          }

          const responseData = await response.json();
          // console.log("live res===", responseData);
          if (Object.keys(responseData).length !== 0) {
            const {
              "NSE:NIFTY50-INDEX": niftyDet,
              "NSE:NIFTYBANK-INDEX": bankniftyDet,
              "NSE:FINNIFTY-INDEX": finniftyDet,
            } = responseData;

            const marketData = {
              sensex: {
                c: sensexDet[ "ltp" ].toFixed(2),
                ch: (sensexDet[ "ltp" ] - sensexDet[ "prev_close_price" ]).toFixed(
                  2,
                ),
                chp: (
                  ((sensexDet[ "ltp" ] - sensexDet[ "prev_close_price" ]) /
                    sensexDet[ "ltp" ]) *
                  100
                ).toFixed(2),
              },
              nifty50: {
                c: niftyDet[ "ltp" ].toFixed(2),
                ch: (niftyDet[ "ltp" ] - niftyDet[ "prev_close_price" ]).toFixed(2),
                chp: (
                  ((niftyDet[ "ltp" ] - niftyDet[ "prev_close_price" ]) /
                    niftyDet[ "ltp" ]) *
                  100
                ).toFixed(2),
              },
              niftybank: {
                c: bankniftyDet[ "ltp" ].toFixed(2),
                ch: (
                  bankniftyDet[ "ltp" ] - bankniftyDet[ "prev_close_price" ]
                ).toFixed(2),
                chp: (
                  ((bankniftyDet[ "ltp" ] - bankniftyDet[ "prev_close_price" ]) /
                    bankniftyDet[ "ltp" ]) *
                  100
                ).toFixed(2),
              },
              finnifty: {
                c: finniftyDet[ "ltp" ].toFixed(2),
                ch: (
                  finniftyDet[ "ltp" ] - finniftyDet[ "prev_close_price" ]
                ).toFixed(2),
                chp: (
                  ((finniftyDet[ "ltp" ] - finniftyDet[ "prev_close_price" ]) /
                    finniftyDet[ "ltp" ]) *
                  100
                ).toFixed(2),
              },
            };
            setMarketData(marketData);
            localStorage.setItem(
              "marketIndexDetails",
              JSON.stringify(marketData),
            );
          } else {
            if (localStorage.getItem("marketIndexDetails")) {
              setMarketData(
                JSON.parse(localStorage.getItem("marketIndexDetails")),
              );
            }
          }
        } else {
          if (localStorage.getItem("marketIndexDetails")) {
            setMarketData(
              JSON.parse(localStorage.getItem("marketIndexDetails")),
            );
          }
        }
      } catch (error) {
        console.error("Error fetching market index details:", error);
      }
    };

    fetchMarketIndexDetails();
    const intervalId = setInterval(fetchMarketIndexDetails, 500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <div className="add-portfolio">
        <div className="rectangle-1499"></div>
        <div className="heading">
          <div className="options-portfolio-execution-beta">
            Options Portfolio Execution
          </div>
          <div className="div">
            <div className="div2" onClick={handleGoBackClick}>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  fontFamily: "sans-serif",
                  cursor: "pointer",
                }}
              >
                x
              </button>
            </div>
          </div>
        </div>
        <div className="frame-13810">
          <div className="group-13281">
            <div className="default-portfolio-settings">
              Default Portfolio Settings
            </div>
            <div className="help">Help</div>
          </div>
          <div>
            {stock_symbol === "NIFTY" && (
              <span
                className="sensex-one"
                style={{
                  // color: "blue",
                  fontFamily: "Roboto",
                  fontSize: "14px",
                  fontWeight: "650",
                  marginRight: "10px",
                }}
              >
                NIFTY50{" "}
                <span style={{ color: "green" }}>
                  {marketData.nifty50 && marketData.nifty50.c}
                </span>
              </span>
            )}
            {stock_symbol === "BANKNIFTY" && (
              <span
                className="sensex-one"
                style={{
                  // color: "blue",
                  fontFamily: "Roboto",
                  fontSize: "14px",
                  fontWeight: "650",
                }}
              >
                BANKNIFTY{" "}
                <span style={{ color: "green" }}>
                  {marketData.niftybank && marketData.niftybank.c}
                </span>
              </span>
            )}
            {stock_symbol === "FINNIFTY" && (
              <span
                className="sensex-one"
                style={{
                  // color: "blue",
                  fontFamily: "Roboto",
                  fontSize: "14px",
                  fontWeight: "650",
                }}
              >
                FINNIFTY{" "}
                <span style={{ color: "green" }}>
                  {marketData.finnifty && marketData.finnifty.c}
                </span>
              </span>
            )}
          </div>
        </div>
        <div className="frame-13825">
          <div className="frame-13824">
            <div className="exchange">Exchange</div>
            <div className="group-13283">
              <div className="nifty">
                <div className="nifty1" style={{ marginBottom: "9px" }}>
                  Stock Symbol
                </div>
                <select
                  // defaultValue={'NIFTY'}
                  onChange={handleSymbolChange}
                  className="exchange-dropdown1"
                  value={stock_symbol}
                  style={{ cursor: "pointer" }}
                >
                  <option selected disabled>
                    {" "}
                    Select{" "}
                  </option>
                  <option
                    selected={stock_symbol === "NIFTY"}
                    value="NIFTY"
                    color="black"
                  >
                    NIFTY
                  </option>
                  <option
                    selected={stock_symbol === "BANKNIFTY"}
                    value="BANKNIFTY"
                    color="black"
                  >
                    BANKNIFTY
                  </option>
                  <option
                    selected={stock_symbol === "FINNIFTY"}
                    value="FINNIFTY"
                    color="black"
                  >
                    FINNIFTY
                  </option>
                </select>
              </div>
              <div>
                <select
                  className="exchange-dropdown"
                  onChange={(e) => {
                    setExchange(e.target.value);
                    setIsPortfolioEdited(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <option selected disabled>
                    {" "}
                    Select{" "}
                  </option>
                  <option
                    value="BFO"
                    selected={editPortfolio && portfolio.exchange === "BFO"}
                  >
                    BFO
                  </option>
                  <option
                    value="NFO"
                    selected={editPortfolio && portfolio.exchange === "NFO"}
                  >
                    NFO
                  </option>
                  <option
                    value="MCX"
                    selected={editPortfolio && portfolio.exchange === "MCX"}
                  >
                    MCX
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className="frame-13823">
            <div className="expiry2">Expiry</div>
            <div>
              <select
                onChange={(e) => {
                  setIsPortfolioEdited(true);
                  setSelectedDate(e.target.value);
                  // generateDateOptions(stock_symbol);
                }}
                className="expiry-dropdown"
                value={selectedDate}
                style={{ cursor: "pointer" }}
              >
                {/* {generateDateOptions(stock_symbol)} */}
                <option key="default" value="">
                  Select
                </option>
                {dateOptions}
              </select>
            </div>
          </div>
          <div className="frame-13822">
            <div className="default-lots">
              Default
              <br />
              Lots
            </div>
            <div className="frame-136682">
              <input
                type="number"
                onInput={(e) => {
                  const value = e.target.value;
                  // Remove non-numeric characters
                  const sanitizedValue = value.replace(/[^0-9]/g, "");
                  // Update the input value
                  e.target.value = sanitizedValue;
                }}
                id="lotsInput"
                defaultValue="1"
                style={{
                  zIndex: "99",
                  paddingTop: "7px",
                  paddingBottom: "7px",
                  marginBottom: "2px",
                }}
              />
            </div>
          </div>
          <div className="frame-13817">
            <div className="predefined-strategies">
              Predefined
              <br />
              Strategies
            </div>
            <div>
              <select
                className="predefined-strategies-dropdown"
                style={{ cursor: "pointer" }}
              >
                <option value="option1">Custom</option>
                <option value="option2">Covered Call</option>
                <option value="option3">Bull Call Spread</option>
                <option value="option4">Bear Put Spread</option>
                <option value="option5">Long Straddle</option>
                <option value="option6">Long Strangle</option>
                <option value="option7">Long Call Butterfly</option>
                <option value="option8">Iron Condor</option>
                <option value="option9">Iron Butterfly</option>
              </select>
            </div>
          </div>
          <div className="frame-13818">
            <div className="strike-selection">Strike Selection </div>
            <div>
              <select
                className="strike-selection-dropdown"
                style={{ cursor: "pointer" }}
              >
                <option value="option1">NORMAL</option>
                <option value="option2">RELATIVE</option>
                <option value="option3">BOTH</option>
              </select>
            </div>
          </div>
          <div className="frame-13819">
            <div className="underlying">Underlying</div>
            <div>
              <select
                className="underlying-dropdown"
                style={{ cursor: "pointer" }}
              >
                <option value="option1">SPOT</option>
                <option value="option2">FUTURES</option>
              </select>
            </div>
          </div>
          <div className="frame-13820">
            <div className="price-type">Price Type</div>
            <div>
              <select
                className="price-type-dropdown"
                style={{ cursor: "pointer" }}
              >
                <option value="option1">LTP</option>
                <option value="option2">BID ASK</option>
                <option value="option3">BID ASK AVG</option>
              </select>
            </div>
          </div>
          <div className="frame-13821">
            <div className="strike-step">
              Strike
              <br />
              Step
            </div>
            <div className="group-13282">
              <td style={{ border: "transparent" }}>
                <input type="text" defaultValue={100} />
              </td>
            </div>
          </div>
        </div>
        <div className="frame-13816">
          <div className="frame-13815">
            <div className="frame-137982">
              <input
                type="checkbox"
                id="yourCheckboxId"
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="move-sl-to-cost">Move SL to Cost</div>
          </div>
          <div className="frame-13814">
            <div className="frame-13797">
              <input
                type="checkbox"
                id="yourCheckboxId"
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="positional-portfolio">Positional Portfolio</div>
          </div>
          <div className="frame-13813">
            <div className="frame-13796">
              <input
                type="checkbox"
                id="yourCheckboxId"
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="buy-trades-first">Buy Trades First</div>
          </div>
          <div className="frame-13812">
            <div className="frame-137892">
              <input
                type="checkbox"
                id="yourCheckboxId"
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className="tgt-sl-entry-on-per-lot-basis">
              Tgt / SL / Entry on Per Lot Basis
            </div>
          </div>
        </div>
        <div className="ellipse-47"></div>
        <div className="ellipse-48"></div>
        {/* <div className="group-13286"> */}
        <div className="rectangle-1557" style={{ cursor: "pointer" }}></div>
        <div className="ellipse-49" style={{ cursor: "pointer" }}></div>
        <img
          className="ellipse-50"
          src="/src/assets/Ellipse 50.png"
          style={{ cursor: "pointer" }}
        />
        <div
          className="save-portfolio"
          style={{ cursor: "pointer" }}
          onClick={handleSavePortfolio}
        >
          Save Portfolio
        </div>
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          contentLabel="Confirm Save Modal"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            },
            content: {
              width: "300px",
              height: "150px",
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: "white",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              padding: "20px",
            },
          }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: "18px",
              marginBottom: "20px",
            }}
          >
            {" "}
            {message}
          </p>
          <div style={{ flex: 1 }}></div>
          <div className="modal-buttons" style={{ marginBottom: "20px" }}>
            {message !== "Please Try Again" &&
              message !== "Portfolio with the same data already exists" && (
                <button
                  style={{
                    padding: "8px 16px",
                    borderRadius: "5px",
                    backgroundColor: "#5cb85c",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (
                      message ===
                      "Duplicate legs detected. Please remove duplicates before saving." ||
                      message === "Please enter a name for the Portfolio" ||
                      message ===
                      "Please enter a unique name for the Portfolio" ||
                      message === "Please select an Exchange" ||
                      message === "Please select a Product" ||
                      message === "Please select a Strategy Tag" ||
                      message === "Please select an Entry Order Type" ||
                      message === "Please select an Expriy Date" ||
                      message === "Please select an Strike Price" ||
                      message === "Please save the changes"
                    ) {
                      setShowModal(false);
                    } else {
                      handleConfirmSave();
                    }
                  }}
                >
                  OK
                </button>
              )}
            {message !==
              "Duplicate legs detected. Please remove duplicates before saving." &&
              message !== "Please enter a name for the Portfolio" &&
              message !== "Please enter a unique name for the Portfolio" &&
              message !== "Please select an Exchange" &&
              message !== "Please select a Product" &&
              message !== "Please select a Strategy Tag" &&
              message !== "Please select an Entry Order Type" &&
              message !== "Please select an Expriy Date" &&
              message !== "Please select an Strike Price" && (
                <button
                  style={{
                    marginLeft: "10px",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    backgroundColor: "#d9534f",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (message === "Please save the changes") {
                      navigate("/F&O/Portfolio");
                    }
                    setShowModal(false);
                  }}
                >
                  Cancel
                </button>
              )}
          </div>
        </Modal>
        {/* <div className="group-13285"> */}
        <div className="rectangle-1556" style={{ cursor: "pointer" }}></div>
        <div className="ellipse-502" style={{ cursor: "pointer" }}></div>
        <img
          className="ellipse-51"
          src="/src/assets/Ellipse 51.png"
          style={{ cursor: "pointer" }}
        />
        <div className="reset" style={{ cursor: "pointer" }}>
          Reset
        </div>
        {/* </div> */}
        {/* <div className="group-13284"> */}
        <div className="rectangle-1555" style={{ cursor: "pointer" }}></div>
        <div className="ellipse-512" style={{ cursor: "pointer" }}></div>
        <img
          className="ellipse-52"
          src="/src/assets/Ellipse 52.png"
          style={{ cursor: "pointer" }}
        />
        <div className="refresh" style={{ cursor: "pointer" }}>
          Refresh
        </div>
        {/* </div> */}
        <Fandorow
          dateOptions={dateOptions}
          ref={FandRowRef}
          setlegsEdited={setlegsEdited}
          editPortfolio={editPortfolio}
          portfolio={portfolio}
          selectedDate={selectedDate}
          stock_symbol={stock_symbol}
          setIsPortfolioEdited={setIsPortfolioEdited}
        />
        <div className="toggle1">
          <div className="toggle-switch-container1">
            <div
              className={`toggle-switch1 ${activeTab === "execution" ? "active" : ""}`}
              onClick={() => handleTabClick("execution")}
            >
              <span>Execution Parameters</span>
            </div>
            <div
              className={`toggle-switch1 ${activeTab === "target" ? "active" : ""}`}
              onClick={() => handleTabClick("target")}
            >
              <span>Target Settings</span>
            </div>
            <div
              className={`toggle-switch1 ${activeTab === "stoploss" ? "active" : ""}`}
              onClick={() => handleTabClick("stoploss")}
            >
              <span>Stoploss Settings</span>
            </div>
            <div
              className={`toggle-switch1 ${activeTab === "exit" ? "active" : ""}`}
              onClick={() => handleTabClick("exit")}
            >
              <span>Exit Settings</span>
            </div>
          </div>
        </div>
        {isExecutionTabActive && (
          <div className="execution-parameters">
            <div className="frame-13802">
              <div className="execution-settings">Execution Settings</div>
              <div className="timings">Timings</div> <br />
              <table className="product">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Strategy Tag</th>
                    <th>If One or More Leg Falls</th>
                    <th>Legs Execution</th>
                    <th>Qty By Exposure</th>
                    <th>Max Lots</th>
                    <th>Premium Gap</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        className="Product-dropdown Product-dropdown1"
                        onChange={(e) => {
                          setIsPortfolioEdited(true);
                          setProduct(e.target.value);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <option selected disabled>
                          {" "}
                          Select
                        </option>
                        <option
                          selected={
                            editPortfolio && portfolio.variety === "NORMAL"
                          }
                          value="NORMAL"
                        >
                          NRML
                        </option>
                        <option
                          selected={
                            editPortfolio && portfolio.variety === "MIS"
                          }
                          value="MIS"
                        >
                          MIS
                        </option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="Strategy-dropdown"
                        onChange={(e) => {
                          setIsPortfolioEdited(true);
                          setSelectedStrategy(e.target.value);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <option selected disabled>
                          {" "}
                          Select
                        </option>
                        {strategyTags.map((tag, index) => (
                          <option
                            selected={
                              editPortfolio && portfolio.strategy === tag
                            }
                            key={index}
                            value={tag}
                          >
                            {tag}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className="One-or-More-dropdown"
                        style={{ cursor: "pointer" }}
                      >
                        <option value="option1">Keep PLaced Legs</option>
                        <option value="option2">Keep PLaced Legs2</option>
                        <option value="option3">Keep PLaced Legs3</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="Legs-Execution-dropdown"
                        style={{ cursor: "pointer" }}
                      >
                        <option value="option1">Parallel</option>
                        <option value="option2">Parallel2</option>
                        <option value="option3">Parallel3</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="box"
                        style={{
                          border: "1px solid #ccc", // You can adjust the color and width as needed
                          borderRadius: "5px", // Optional: Adds rounded corners
                          padding: "8px", // Optional: Adds padding for better appearance
                        }}
                      />
                    </td>
                    <td>
                      <input type="text" />
                    </td>
                    <td>
                      <input type="text" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="Entry-Setting">Entry Setting</div>
              <div className="line1"></div> <br />
              <table className="product1">
                <thead>
                  <tr>
                    <th>Portfolio Execution Mode</th>
                    <th>Entry Order Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        className="Portfolio-Execution-dropdown"
                        style={{ cursor: "pointer" }}
                      >
                        <option value="option1">Manual</option>
                        <option value="option2">Manual2</option>
                        <option value="option3">Manual3</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="Entry-Order-dropdown"
                        onChange={(e) => {
                          // console.log("e.target.value", e.target.value);
                          setIsPortfolioEdited(true);
                          setEntryOrder(e.target.value);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <option selected disabled>
                          {" "}
                          Select
                        </option>
                        <option
                          value="MARKET"
                          selected={
                            editPortfolio && portfolio.order_type === "MARKET"
                          }
                        >
                          MARKET
                        </option>
                        <option
                          value="LIMIT"
                          selected={
                            editPortfolio && portfolio.order_type === "LIMIT"
                          }
                        >
                          LIMIT
                        </option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="product2">
                <thead>
                  <tr>
                    <th>Run On Days</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>SqOff Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <div className="timing-border">
                      <div className="custom-dropdown" ref={dropdownRef}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <input
                            type="text"
                            className="dropdown-toggle"
                            value={
                              selectedWeekdays.length > 0
                                ? selectedWeekdays.join(", ")
                                : "Select weekdays"
                            }
                            onClick={toggleDropdown}
                            readOnly
                            style={{ cursor: "pointer" }}
                          />
                          <button
                            onClick={toggleDropdown}
                            className="dropdown-button"
                            style={{
                              marginLeft: "-20px",
                              border: "none",
                              backgroundColor: "#fff",
                              fontSize: "17px",
                              cursor: "pointer",
                            }}
                          >
                            {isDropdownOpen ? "▲" : "▼"}
                          </button>
                        </div>
                        {dropdownVisible && (
                          <div
                            className="dropdown-content"
                            style={{ cursor: "pointer" }}
                          >
                            <input
                              type="checkbox"
                              id="selectAll"
                              checked={selectAllChecked}
                              onChange={toggleSelectAll}
                              style={{ cursor: "pointer" }}
                            />
                            <label htmlFor="selectAll">
                              {selectAllChecked ? "Deselect All" : "Select All"}
                            </label>
                            {weekdays.map((weekday) => (
                              <div key={weekday}>
                                <input
                                  type="checkbox"
                                  id={weekday}
                                  value={weekday}
                                  checked={selectedWeekdays.includes(weekday)}
                                  onChange={() => toggleWeekday(weekday)}
                                  style={{ cursor: "pointer" }}
                                />
                                <label htmlFor={weekday}>{weekday}</label>
                              </div>
                            ))}
                            <div>
                              <button
                                className="weekdays-button1"
                                onClick={handleOk}
                                style={{ width: "37px", cursor: "pointer" }}
                              >
                                Ok
                              </button>
                              <button
                                className="weekdays-button2"
                                onClick={handleCancel}
                                style={{ width: "60px", cursor: "pointer" }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <td>
                      <Timepic />
                    </td>
                    <td>
                      <Timepic />
                    </td>
                    <td>
                      <Timepic />
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="product3">
                <thead>
                  <tr>
                    <th>Estimated Margin</th>
                  </tr>
                </thead>
                <tbody>
                  <td>Click to Refresh</td>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {isTargetTabActive && (
          <div className="execution-parameters">
            <div className="frame-13802">
              <div className="Portfolio-Profit-Protection">
                Portfolio Profit Protection
              </div>
              <table className="TargetSettings">
                <thead>
                  <tr>
                    <th>Target Type</th>
                    <th style={{ paddingRight: "9.6rem" }}>
                      If Profit Reaches
                    </th>
                    <th>Lock Minimum Profit At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        className="Product-dropdown"
                        style={{ marginRight: "10rem", cursor: "pointer" }}
                      >
                        <option value="option1">Combined Profit</option>
                        <option value="option2">Combined Profit2</option>
                        <option value="option3">Combined Profit3</option>
                      </select>
                    </td>
                    <td>
                      <input type="text" value={0} />
                    </td>
                    <td>
                      <input type="text" value={0} />
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="TargetSettings1">
                <thead>
                  <tr>
                    <th>Combined Profit</th>
                    <th>For Every Icrease In Profit By</th>
                    <th>Trail Profit By</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="text"
                        style={{
                          border: "1px solid #ccc", // You can adjust the color and width as needed
                          borderRadius: "5px", // Optional: Adds rounded corners
                          padding: "8px", // Optional: Adds padding for better appearance
                        }}
                      />
                    </td>
                    <td>
                      <input type="text" value={0} />
                    </td>
                    <td>
                      <input type="text" value={0} style={{ width: "185px" }} />
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="TargetSettings2">
                <thead>
                  <tr>
                    <th>Combined Profit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        className="Product-dropdown"
                        style={{ marginRight: "10rem", cursor: "pointer" }}
                      >
                        <option value="option1">None</option>
                        <option value="option2">None2</option>
                        <option value="option3">None3</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {isStoplossTabActive && (
          <div className="execution-parameters">
            <div className="frame-13802">
              <table className="Stoploss">
                <thead>
                  <tr>
                    <th>Stoplossgap Type</th>
                    <td style={{ paddingBottom: "0px" }}>
                      <th style={{ paddingRight: "5px" }}>
                        <input type="checkbox" />
                      </th>
                      <th style={{ color: "#C71A8A" }}>
                        On SI SqOff only Loss Making Legs
                      </th>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        className="Product-dropdown"
                        style={{ marginRight: "10rem", cursor: "pointer" }}
                      >
                        <option value="option1">Combined Premium</option>
                        <option value="option2">Combined Premium2</option>
                        <option value="option3">Combined Premium3</option>
                      </select>
                    </td>
                    <td>
                      <th style={{ paddingRight: "0px" }}>
                        <input type="checkbox" />
                      </th>
                      <th style={{ color: "#4FBB80" }}>
                        On SI SqOff only Profit Making Legs
                      </th>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="Stoploss1">
                <thead>
                  <tr>
                    <th>Combined Premium</th>
                    <th>SI Wait Seconds</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="text"
                        style={{
                          border: "1px solid #ccc", // You can adjust the color and width as needed
                          borderRadius: "5px", // Optional: Adds rounded corners
                          padding: "8px", // Optional: Adds padding for better appearance
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        style={{
                          border: "1px solid #ccc", // You can adjust the color and width as needed
                          borderRadius: "5px", // Optional: Adds rounded corners
                          padding: "8px", // Optional: Adds padding for better appearance
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="Stoploss2">
                <thead>
                  <tr>
                    <th>On Stoploss</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        className="Product-dropdown"
                        style={{ marginRight: "10rem", cursor: "pointer" }}
                      >
                        <option value="option1">None</option>
                        <option value="option2">None2</option>
                        <option value="option3">None3</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isExitTabActive && (
          <div className="execution-parameters">
            <div className="frame-13802">
              <table className="ExitSettings">
                <thead>
                  <tr>
                    <h4>Combined Premium</h4>
                  </tr>
                </thead>
              </table>
              <br />
              <table className="ExitSettings1">
                <label>
                  <input type="checkbox" />
                  On Sl SqOff only Profit Making Legs
                </label>
                <label>
                  <input type="checkbox" />
                  Slice Exit Orders as Entry Orders
                </label>
                <label style={{ color: "#9B0101" }}>
                  <input type="checkbox" />
                  Stop Exit Orders If No Positions Exists
                </label>
              </table>
              <label className="h4">
                <h4>On Portfolio Complete</h4>
                <span className="notApplicable">
                  (Not Applicable on Manual)
                </span>
                <select
                  className="Product-dropdown"
                  style={{ marginRight: "11rem", cursor: "pointer" }}
                >
                  <option value="option1">None</option>
                  <option value="option2">None2</option>
                  <option value="option3">None3</option>
                </select>
              </label>
              <label className="OrderRetry">
                <span className="OrderRetry1">Order Retry Settings</span>
                <br />
                <br />
                <span className="Settings">
                  These Settings will be applicable When an Order gets Rejected.
                </span>
                <br />
                <span className="Settings1">
                  First, Stoxxo will apply the Strategy Tag Retry settings as
                  per <br />
                  Entry / Exit Order. This will behave like a Failover Setting{" "}
                  <br />
                  Which will be applied after Strategy tag settings.
                </span>
                <br />
                <h4>Wait Between Each Retry (Sec)</h4>
                <h4>Max Wait Time (Sec)</h4>
              </label>
            </div>
          </div>
        )}

        <div className="gap1">
          <div className="line">
            <table>
              <td className="OPN">
                <th>Option Portfolio Name</th>
                <input
                  defaultValue={editPortfolio ? portfolio.portfolio_name : null}
                  readOnly={editPortfolio}
                  type="text"
                  onChange={(e) => setPortfolioName(e.target.value)}
                />
              </td>
              <td className="Remarks">
                <th></th>
                <input type="text" placeholder="Remarks" />
              </td>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPortfolio;
