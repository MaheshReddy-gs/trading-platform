import React, { useState, useRef, memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MarketIndex from "../../components/MarketIndex";
import filterIcon from "../../assets/newFilter.png";
import LeftNav from "../../components/LeftNav";
import RightNav from "../../components/RightNav";
import "../../styles.css";
import { TopNav } from "../../components/TopNav";
import { ErrorContainer } from "../../components/ErrorConsole";
import Edit from "../../assets/edit.png";
import Recycle from "../../assets/recyclebins.png";
import makecopy from "../../assets/makecopy.png";
import makeascompleted from "../../assets/markascompleted.png";
import reset from "../../assets/reset.png";
import payoff from "../../assets/PayOff.png";
import chart from "../../assets/chart.png";
import reexecute from "../../assets/reexecute.png";
import partentry from "../../assets/part-entry.png";
import close from "../../assets/close.png";
import Modal from "react-modal";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { useDispatch, useSelector } from "react-redux";
import { setAllSeq } from "../../store/slices/colSeq";
import { setAllVis } from "../../store/slices/colVis";
import { setConsoleMsgs } from "../../store/slices/consoleMsg";
import { setPortfolios } from "../../store/slices/portfolio";

function Portfolio() {
  const errorContainerRef = useRef(null);
  const { collapsed } = useSelector((state) => state.collapseReducer);
  const { consoleMsgs } = useSelector((state) => state.consoleMsgsReducer);
  // Error Message start
  const dispatch = useDispatch();
  const brokerState = useSelector((state) => state.brokerReducer);
  const [ msgs, setMsgs ] = useState([]);
  const handleClearLogs = () => {
    if (msgs.length === 0) return; //guard clause
    setMsgs([]);
  };
  // Error Message end
  // portfolio table
  const mainUser = cookies.get("USERNAME");

  const [ editingRow, setEditingRow ] = useState(null);
  const [ MakeCopy, setMakeCopy ] = useState(null);
  const [ MakeAsCompleted, setMakeAsCompleted ] = useState(null);
  const [ Reset, setReset ] = useState(null);
  const [ PayOff, setPayOff ] = useState(null);
  const [ Chart, setChart ] = useState(null);
  const [ Reexecute, setReexecute ] = useState(null);
  const [ PartEntry, setPartEntry ] = useState(null);
  const navigate = useNavigate();

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

  const handleDeletes = async (portfolioname) => {
    try {
      const response = await fetch(
        `/api/delete_portfolio/${mainUser}/${portfolioname}`,
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

      handlePageClick();
      handleMsg({
        msg: "Portfolio deleted Successfully",
        logType: "SUCCESS",
        timestamp: ` ${new Date().toLocaleString()}`,
        portfolio: portfolioname,
      });
    } catch (error) {
      console.error("Error deleting credentials:", error.message);
    } finally {
      setShowConfirmDeleteModal(false);
    }
  };
  const [ showConfirmDeleteModal, setShowConfirmDeleteModal ] = useState(false);
  const [ portfolioToDelete, setPortfolioToDelete ] = useState("");
  const handleDelete = (portfolioName) => {
    // Show a confirmation modal before actually deleting
    setShowConfirmDeleteModal(true);

    // Set the portfolio name to be deleted in the state
    setPortfolioToDelete(portfolioName);
  };

  const [ timerValue, setTimerValue ] = useState("");
  const [ isTableOpen, setTableOpen ] = useState(false);
  const [ isTableOpen1, setTableOpen1 ] = useState(false);
  const [ isPlusClicked, setIsPlusClicked ] = useState({});
  const [ isPlusClicked1, setIsPlusClicked1 ] = useState({});
  const [ subTableData, setsubTableData ] = useState([]);
  const [ showPortfolio, setShowPortfolio ] = useState(false);
  const [ otherDetails, setotherDetails ] = useState([]);
  useEffect(() => {
    setotherDetails(brokerState.brokers);
  }, [ brokerState.brokers ]);

  const { portfolios: portfolioDetails } = useSelector(
    (state) => state.portfolioReducer,
  ); // const [ portfolioDetails, setPortfolioDetails ] = useState(
  //   portfolioState.portfolios,
  // );
  // useEffect(() => {
  //   setPortfolioDetails(portfolioState.portfolios);
  // }, [ portfolioState.portfolios ]);

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
      // console.log("responseData", responseData);
      const extractedPortfolio = responseData[ "Portfolio details" ];
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

  const handleTimerChange = (e) => {
    const inputTime = e.target.value;

    // Format the input time as hh:mm:ss
    const formattedTime = formatInputTime(inputTime);

    // Update the state with the formatted time
    setTimerValue(formattedTime);
  };
  const handlePartEntry = () => {
    setPartEntry();
  };
  const handleMakeCopy = () => {
    setMakeCopy();
  };

  const handleMakeAsCompleted = () => {
    setMakeAsCompleted();
  };

  const handleReset = () => {
    setReset();
  };

  const handlePayOff = () => {
    setPayOff();
  };

  const handleChart = () => {
    setChart();
  };

  const handleReexecute = () => {
    setReexecute();
  };

  const handlePlusClick = async (index) => {
    const plusState = { ...isPlusClicked };
    Object.keys(plusState).forEach((key) => {
      plusState[ key ] = false;
    });
    plusState[ index ] = !isPlusClicked[ index ];
    // console.log("otherDetails", otherDetails);
    setTableOpen(Object.values(plusState).includes(true));
    setIsPlusClicked(plusState);
    const brokerIds = portfolioDetails[ index ].Strategy_accounts_id.split(",");
    // console.log("brokerIds", brokerIds);
    // console.log("otherDetails", otherDetails);
    const brokerDetails = otherDetails.filter((broker) =>
      brokerIds.includes(broker.userId),
    );
    // console.log("brokerDetails", brokerDetails);
    setsubTableData([ { ...portfolioDetails[ index ], brokerDetails } ]);
  };
  useEffect(() => {
    setsubTableData((prev) => ({
      ...prev,
      otherDetails: otherDetails,
    }));
  }, [ otherDetails ]);
  useState(() => {
    const newBoolObject = {};
    if (subTableData.length !== 0) {
      subTableData[ 0 ].Strategy_accounts_id.split(",").forEach((_, index) => {
        const newBoolObject = {};
        newBoolObject[ index ] = false;
      });
      setIsPlusClicked1(newBoolObject);
    }
  }, [ subTableData ]);

  useState(() => {
    const newBoolObject = {};
    portfolioDetails.forEach((_, index) => {
      newBoolObject[ index ] = false;
    });
    setIsPlusClicked(newBoolObject);
  }, [ portfolioDetails ]);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const { brokers: brokerDetails } = useSelector(
          (state) => state.brokerReducer,
        );
        // const brokerIds = portfolioDetails[index].Strategy_accounts_id.split(',')
        // // console.log("portfolioDetails",brokerIds)
        // const otherDetails = brokerDetails.filter((broker) => brokerIds.includes(broker.broker_user_id))
        // console.log("brokerDetails",brokerDetails)
        // brokerDetails.map((broker) => {

        // })
        setotherDetails(brokerDetails);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getUserDetails();
  }, []);

  const handlePlusClick1 = (index) => {
    const plusState = { ...isPlusClicked1 };
    Object.keys(plusState).forEach((key) => {
      plusState[ key ] = false;
    });
    plusState[ index ] = !isPlusClicked1[ index ];
    setTableOpen1(Object.values(plusState).includes(true));
    setIsPlusClicked1(plusState);
  };

  //   const plusState = { ...isPlusClicked1 };
  //   Object.keys(plusState).forEach((key) => {
  //     plusState[key] = false;
  //   });
  //   plusState[index] = !isPlusClicked1[index];
  //   setTableOpen1(Object.values(plusState).includes(true));
  //   setIsPlusClicked1(plusState);
  // };
  const handleEdit = (editablePortfolio) => {
    setEditingRow(editablePortfolio);
    const params = JSON.stringify(editablePortfolio);
    // console.log("string params", params);
    navigate(`/Edit-Portfolio/${params}`, editablePortfolio);
  };
  useEffect(() => {
    if (portfolioDetails.length === 0) {
      dispatch(
        setPortfolios({
          portfolios: [
            {
              Strategy_accounts_id: "",
              exchange: "",
              expiry_date: "",
              lots: "",
              order_type: "",
              portfolio_name: "",
              quantity: "",
              remarks: "",
              strategy: "",
              strategy_account: "",
              strike: "",
              transaction_type: "",
              user_id: "",
              variety: "",
              stock_symbol: "",
              // "product": "",
            },
          ],
        }),
      );
      // setPortfolioDetails([
      //   {
      //     Strategy_accounts_id: "",
      //     exchange: "",
      //     expiry_date: "",
      //     lots: "",
      //     order_type: "",
      //     portfolio_name: "",
      //     quantity: "",
      //     remarks: "",
      //     strategy: "",
      //     strategy_account: "",
      //     strike: "",
      //     transaction_type: "",
      //     user_id: "",
      //     variety: "",
      //     stock_symbol: "",
      //     // "product": "",
      //   },
      // ]);
    }
  }, [ portfolioDetails ]);

  const allSeqState = useSelector((state) => state.allSeqReducer);
  const allVisState = useSelector((state) => state.allVisReducer);

  const portfolioCols = [
    "Enabled",
    "Status",
    "Portfolio Name",
    "PNL",
    "Symbol",
    "Execute/Sq Off",
    "Edit",
    "Delete",
    "Make Copy",
    "Mark As Completed",
    "Reset",
    "Pay Off",
    "Chat",
    "Re Execute",
    "Part Entry/Exit",
    "Current Value",
    "Value Per Lot",
    "Underlying LTP",
    "Positional Portfolio",
    "Product",
    "Strategy",
    "Entry Price",
    "Combined Premuim",
    "Per Lot Premuim",
    "Start Time",
    "End Time",
    "SqOff Time",
    "Range End Time",
    "Delta",
    "Theta",
    "Vega",
    "Remarks",
    "Message",
  ];

  const [ colVisPortfolio, setcolVisPortfolio ] = useState(
    allVisState.portfolioVis,
  );

  const [ portfolioColsSelectedALL, setportfolioColsSelectedALL ] =
    useState(false);
  const portfolioColSelectALL = () => {
    setportfolioColsSelectedALL((prev) => !prev);
    portfolioCols.map((portfolioCol) => {
      setcolVisPortfolio((prev) => ({
        ...prev,
        [ portfolioCol ]: portfolioColsSelectedALL,
      }));
    });
  };

  const [ portfolioSeq, setportfolioSeq ] = useState(allSeqState.portfolioSeq);

  useEffect(() => {
    setportfolioSeq(allSeqState.strategiesSeq);
    setcolVisPortfolio((prev) => {
      const colVis = {};
      Object.keys(colVisPortfolio).map((col) => {
        if (allSeqState.portfolioSeq.includes(col)) {
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
        portfolioVis: colVisPortfolio,
      }),
    );
    if (new Set(Object.values(colVisPortfolio)).size === 1) {
      if (Object.values(colVisPortfolio).includes(true)) {
        setportfolioSeq(portfolioCols);
      } else {
        setportfolioSeq([]);
      }
    }
  }, [ colVisPortfolio ]);

  useEffect(() => {
    // console.log("userProfSeq", userProfSeq)
    dispatch(
      setAllSeq({
        ...allSeqState,
        portfolioSeq: portfolioSeq,
      }),
    );
  }, [ portfolioSeq ]);

  const [ showSearchPortfolio, setshowSearchPortfolio ] = useState({
    showSearchPortfolioName: false,
    showSearchSymbol: false,
    showSearchProduct: false,
    showSearchStrategy: false,
  });

  const handleCloseAllSearchBox = (e) => {
    const allowedElements = [ "th img", ".Filter-popup" ];
    if (!allowedElements.some((element) => e.target.closest(element))) {
      // The click was outside of the allowed elements, perform your function here
      setshowSearchPortfolio((prev) =>
        Object.fromEntries(
          Object.entries(prev).map(([ key, value ]) => [ key, false ]),
        ),
      );
    }
  };

  const [ selectAllPortfolioName, setSelectAllPortfolioName ] = useState(false);
  const [ uniquePortfolioName, setuniquePortfolioName ] = useState([]);
  const [ portfolioNameSelected, setPortfolioNameSelected ] = useState([]);

  const [ selectAllSymbol, setSelectAllSymbol ] = useState(false);
  const [ uniqueSymbol, setuniqueSymbol ] = useState([]);
  const [ SymbolSelected, setSymbolSelected ] = useState([]);

  const [ selectAllProduct, setSelectAllProduct ] = useState(false);
  const [ uniqueProduct, setuniqueProduct ] = useState([]);
  const [ ProductSelected, setProductSelected ] = useState([]);

  const [ selectAllStrategy, setSelectAllStrategy ] = useState(false);
  const [ uniqueStrategy, setuniqueStrategy ] = useState([]);
  const [ StrategySelected, setStrategySelected ] = useState([]);

  useEffect(() => {
    const data = portfolioDetails;

    setuniquePortfolioName(
      data ? [ ...new Set(data.map((d) => d.portfolio_name)) ] : [],
    );
    setuniqueSymbol(data ? [ ...new Set(data.map((d) => d.stock_symbol)) ] : []);
    setuniqueProduct(data ? [ ...new Set(data.map((d) => d.variety)) ] : []);
    setuniqueStrategy(data ? [ ...new Set(data.map((d) => d.strategy)) ] : []);
  }, [ portfolioDetails ]);

  const handleCheckboxChangePortfolioName = (portfolioName) => {
    const isSelected = portfolioNameSelected.includes(portfolioName);
    if (isSelected) {
      setPortfolioNameSelected(
        portfolioNameSelected.filter((item) => item !== portfolioName),
      );
      setSelectAllPortfolioName(false);
    } else {
      setPortfolioNameSelected((prevSelected) => [
        ...prevSelected,
        portfolioName,
      ]);
      setSelectAllPortfolioName(
        portfolioNameSelected.length === uniquePortfolioName.length - 1,
      );
    }
  };

  const handleSelectAllForPortfolioName = () => {
    const allChecked = !selectAllPortfolioName;
    setSelectAllPortfolioName(allChecked);
    if (allChecked) {
      setPortfolioNameSelected(uniquePortfolioName.map((d) => d.toLowerCase()));
    } else {
      setPortfolioNameSelected([]);
    }
  };

  const handleCheckboxChangeSymbol = (Symbol) => {
    const isSelected = SymbolSelected.includes(Symbol);
    if (isSelected) {
      setSymbolSelected(SymbolSelected.filter((item) => item !== Symbol));
      setSelectAllSymbol(false);
    } else {
      setSymbolSelected((prevSelected) => [ ...prevSelected, Symbol ]);
      setSelectAllSymbol(SymbolSelected.length === uniqueSymbol.length - 1);
    }
  };

  const handleSelectAllForSymbol = () => {
    const allChecked = !selectAllSymbol;
    setSelectAllSymbol(allChecked);
    if (allChecked) {
      setSymbolSelected(uniqueSymbol.map((d) => d.toLowerCase()));
    } else {
      setSymbolSelected([]);
    }
  };

  const handleCheckboxChangeStrategy = (Strategy) => {
    const isSelected = StrategySelected.includes(Strategy);
    if (isSelected) {
      setStrategySelected(StrategySelected.filter((item) => item !== Strategy));
      setSelectAllStrategy(false);
    } else {
      setStrategySelected((prevSelected) => [ ...prevSelected, Strategy ]);
      setSelectAllStrategy(
        StrategySelected.length === uniqueStrategy.length - 1,
      );
    }
  };

  const handleSelectAllForStrategy = () => {
    const allChecked = !selectAllStrategy;
    setSelectAllStrategy(allChecked);
    if (allChecked) {
      setStrategySelected(uniqueStrategy.map((d) => d.toLowerCase()));
    } else {
      setStrategySelected([]);
    }
  };

  const handleCheckboxChangeProduct = (Product) => {
    const isSelected = ProductSelected.includes(Product);
    if (isSelected) {
      setProductSelected(ProductSelected.filter((item) => item !== Product));
      setSelectAllProduct(false);
    } else {
      setProductSelected((prevSelected) => [ ...prevSelected, Product ]);
      setSelectAllProduct(ProductSelected.length === uniqueProduct.length - 1);
    }
  };

  const handleSelectAllForProduct = () => {
    const allChecked = !selectAllProduct;
    setSelectAllProduct(allChecked);
    if (allChecked) {
      setProductSelected(uniqueProduct.map((d) => d.toLowerCase()));
    } else {
      setProductSelected([]);
    }
  };

  const handleOkClick = () => {
    updateFilteredRows({
      portfolioNameSelected,
      SymbolSelected,
      ProductSelected,
      StrategySelected,

      setPortfolioNameSelected,
      setSymbolSelected,
      setProductSelected,
      setStrategySelected,

      setSelectAllPortfolioName,
      setSelectAllSymbol,
      setSelectAllProduct,
      setSelectAllStrategy,

      uniquePortfolioName,
      uniqueSymbol,
      uniqueProduct,
      uniqueStrategy,

      setuniquePortfolioName,
      setuniqueSymbol,
      setuniqueProduct,
      setuniqueStrategy,
    });
    setshowSearchPortfolio((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([ key, value ]) => [ key, false ]),
      ),
    );
  };
  const updateFilteredRows = ({
    portfolioNameSelected,
    SymbolSelected,
    ProductSelected,
    StrategySelected,

    setPortfolioNameSelected,
    setSymbolSelected,
    setProductSelected,
    setStrategySelected,

    setSelectAllPortfolioName,
    setSelectAllSymbol,
    setSelectAllProduct,
    setSelectAllStrategy,

    uniquePortfolioName,
    uniqueSymbol,
    uniqueProduct,
    uniqueStrategy,

    setuniquePortfolioName,
    setuniqueSymbol,
    setuniqueProduct,
    setuniqueStrategy,
  }) => {
    const rows = portfolioDetails;
    let prevfilteredRows;
    if (portfolioNameSelected.length !== 0) {
      // console.log("portfolioNameSelected", portfolioNameSelected);
      prevfilteredRows = rows.filter((row) =>
        portfolioNameSelected.includes(row.portfolio_name.toLowerCase()),
      );
    } else {
      prevfilteredRows = rows;
    }
    // console.log("prevfilteredRows  portfolioNameSelected", prevfilteredRows);
    if (SymbolSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        SymbolSelected.includes(row.stock_symbol.toLowerCase()),
      );
    }
    // console.log("prevfilteredRows  SymbolSelected", prevfilteredRows);
    if (ProductSelected.length !== 0) {
      prevfilteredRows = prevfilteredRows.filter((row) =>
        ProductSelected.includes(row.variety.toLowerCase()),
      );
    }
    // console.log("prevfilteredRows  ProductSelected", prevfilteredRows);
    if (StrategySelected.length !== 0) {
      // console.log("pStrategySelected", StrategySelected);
      prevfilteredRows = prevfilteredRows.filter((row) =>
        StrategySelected.includes(row.strategy.toLowerCase()),
      );
    }
    // console.log("prevfilteredRows  StrategySelected", prevfilteredRows);

    setuniquePortfolioName(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.portfolio_name;
          }),
        ),
      );
    });
    setuniqueSymbol(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.stock_symbol;
          }),
        ),
      );
    });

    setuniqueProduct(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.variety;
          }),
        ),
      );
    });

    setuniqueStrategy(() => {
      return Array.from(
        new Set(
          prevfilteredRows.map((filteredRow) => {
            return filteredRow.strategy;
          }),
        ),
      );
    });

    // setPortfolioDetails(prevfilteredRows);
    dispatch(
      setPortfolios({
        portfolios: prevfilteredRows,
      }),
    );
  };

  const portfolioTH = {
    Enabled: colVisPortfolio[ "Enabled" ] && (
      <th colspan="2">
        <div>
          <small>Enabled</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
          // onClick={() => {
          //   setShowSelectBox((prev) => !prev);
          // }}
          />
        </div>
        {/* {showSelectBox && (
          <div>
            <select
              type="text"
              // value={enabledFilter}
              // onChange={handleEnabledFilterChange}
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
    Status: colVisPortfolio[ "Status" ] && (
      <th>
        <div>
          <small>Status</small>
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
    "Portfolio Name": colVisPortfolio[ "Portfolio Name" ] && (
      <th>
        <div>
          <small>Portfolio Name</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-15px",
            }}
            onClick={() => {
              setshowSearchPortfolio((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchPortfolioName"
                      ? !prev.showSearchPortfolioName
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchPortfolio.showSearchPortfolioName && (
          <div className="Filter-popup">
            <form id="filter-form-user" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllPortfolioName}
                    onChange={handleSelectAllForPortfolioName}
                  />
                  Select all
                </li>
                <li>
                  {uniquePortfolioName.map((fyersclientId, index) => {
                    return (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "15px",
                          }}
                          checked={portfolioNameSelected.includes(
                            fyersclientId.toLowerCase(),
                          )}
                          onChange={() =>
                            handleCheckboxChangePortfolioName(
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
              <button onClick={handleOkClick}>Ok</button>
              <button
                onClick={() => {
                  setshowSearchPortfolio((prev) =>
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
    PNL: colVisPortfolio[ "PNL" ] && (
      <th>
        <div>
          <small>PNL</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-40px",
            }}
            onClick={() => {
              // setShowSearchMTM((prev) => !prev);
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
    Symbol: colVisPortfolio[ "Symbol" ] && (
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
              setshowSearchPortfolio((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchSymbol" ? !prev.showSearchSymbol : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchPortfolio.showSearchSymbol && (
          <div className="Filter-popup">
            <form id="filter-form-user" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllSymbol}
                    onChange={handleSelectAllForSymbol}
                  />
                  Select all
                </li>
                <li>
                  {uniqueSymbol.map((fyersclientId, index) => {
                    return (
                      <div key={index} className="filter-inputs">
                        <input
                          type="checkbox"
                          style={{
                            width: "15px",
                          }}
                          checked={SymbolSelected.includes(
                            fyersclientId.toLowerCase(),
                          )}
                          onChange={() =>
                            handleCheckboxChangeSymbol(
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
              <button onClick={handleOkClick}>Ok</button>
              <button
                onClick={() => {
                  setshowSearchPortfolio((prev) =>
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
    "Execute/Sq Off": colVisPortfolio[ "Execute/Sq Off" ] && (
      <th>
        <div>
          <small>Execute/Sq Off</small>
        </div>
      </th>
    ),
    Delete: colVisPortfolio[ "Delete" ] && (
      <th>
        <div>
          <small>Delete</small>
        </div>
      </th>
    ),
    Edit: colVisPortfolio[ "Edit" ] && (
      <th>
        <div>
          <small>Edit</small>
        </div>
      </th>
    ),
    "Make Copy": colVisPortfolio[ "Make Copy" ] && (
      <th>
        <div>
          <small>Make Copy</small>
        </div>
      </th>
    ),
    "Mark As Completed": colVisPortfolio[ "Mark As Completed" ] && (
      <th>
        <div>
          <small>Mark As Completed</small>
        </div>
      </th>
    ),
    Reset: colVisPortfolio[ "Reset" ] && (
      <th>
        <div>
          <small>Reset</small>
        </div>
      </th>
    ),
    "Pay Off": colVisPortfolio[ "Pay Off" ] && (
      <th>
        <div>
          <small>Pay Off</small>
        </div>
      </th>
    ),
    Chat: colVisPortfolio[ "Chat" ] && (
      <th>
        <div>
          <small>Chat</small>
        </div>
      </th>
    ),
    "Re Execute": colVisPortfolio[ "Re Execute" ] && (
      <th>
        <div>
          <small>Re Execute</small>
        </div>
      </th>
    ),
    "Part Entry/Exit": colVisPortfolio[ "Part Entry/Exit" ] && (
      <th>
        <div>
          <small>Part Entry/Exit</small>
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
                        style={{ width: "12px" }}
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
    "Current Value": colVisPortfolio[ "Current Value" ] && (
      <th>
        <div>
          <small>Current Value</small>
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
    "Value Per Lot": colVisPortfolio[ "Value Per Lot" ] && (
      <th>
        <div>
          <small>Value Per Lot</small>
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
    "Underlying LTP": colVisPortfolio[ "Underlying LTP" ] && (
      <th>
        <div>
          <small>Underlying LTP</small>
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
    "Positional Portfolio": colVisPortfolio[ "Positional Portfolio" ] && (
      <th>
        <div>
          <small>Positional Portfolio</small>
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
    Product: colVisPortfolio[ "Product" ] && (
      <th>
        <div>
          <small>Product</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-35px",
            }}
            onClick={() => {
              setshowSearchPortfolio((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchProduct"
                      ? !prev.showSearchProduct
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>

        {showSearchPortfolio.showSearchProduct && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllProduct}
                    onChange={handleSelectAllForProduct}
                  />
                  Select all
                </li>
                <li>
                  {uniqueProduct.map((maxLoss, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={ProductSelected.includes(
                          maxLoss.toLowerCase(),
                        )}
                        onChange={() =>
                          handleCheckboxChangeProduct(maxLoss.toLowerCase())
                        }
                      />
                      <label>{maxLoss}</label>
                    </div>
                  ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>Ok</button>
              <button onClick={() => setShowSearchMaxLoss((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    Strategy: colVisPortfolio[ "Strategy" ] && (
      <th>
        <div>
          <small>Strategy</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-35px",
            }}
            onClick={() => {
              setshowSearchPortfolio((prev) => ({
                ...Object.fromEntries(
                  Object.keys(prev).map((key) => [
                    key,
                    key === "showSearchStrategy"
                      ? !prev.showSearchStrategy
                      : false,
                  ]),
                ),
              }));
            }}
          />
        </div>
        {showSearchPortfolio.showSearchStrategy && (
          <div className="Filter-popup">
            <form id="filter-form" className="Filter-inputs-container">
              <ul>
                <li>
                  <input
                    type="checkbox"
                    style={{ width: "12px" }}
                    checked={selectAllStrategy}
                    onChange={handleSelectAllForStrategy}
                  />
                  Select all
                </li>
                <li>
                  {uniqueStrategy.map((maxLoss, index) => (
                    <div key={index} className="filter-inputs">
                      <input
                        type="checkbox"
                        style={{
                          width: "12px",
                        }}
                        checked={StrategySelected.includes(
                          maxLoss.toLowerCase(),
                        )}
                        onChange={() =>
                          handleCheckboxChangeStrategy(maxLoss.toLowerCase())
                        }
                      />
                      <label>{maxLoss}</label>
                    </div>
                  ))}
                </li>
              </ul>
            </form>
            <div className="filter-popup-footer">
              <button onClick={handleOkClick}>Ok</button>
              <button onClick={() => setShowSearchMaxLoss((prev) => !prev)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </th>
    ),
    "Entry Price": colVisPortfolio[ "Entry Price" ] && (
      <th>
        <div>
          <small>Entry Price</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-20px",
            }}
            onClick={() => {
              setShowSearchQtyByExposure((prev) => !prev);
            }}
          />
        </div>
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
      </th>
    ),
    "Combined Premuim": colVisPortfolio[ "Combined Premuim" ] && (
      <th>
        <div>
          <small>Combined Premuim</small>
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
    "Per Lot Premuim": colVisPortfolio[ "Per Lot Premuim" ] && (
      <th>
        <div>
          <small>Per Lot Premuim</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              setShowSearchMaxLossPerTrade((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "Start Time": colVisPortfolio[ "Start Time" ] && (
      <th>
        <div>
          <small>Start Time</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-25px",
            }}
            onClick={() => {
              setShowSearchMaxOpenTrades((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "End Time": colVisPortfolio[ "End Time" ] && (
      <th>
        <div>
          <small>End Time</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-25px",
            }}
            onClick={() => {
              setShowSearchQtyMultiplier((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "SqOff Time": colVisPortfolio[ "SqOff Time" ] && (
      <th>
        <div>
          <small>SqOff Time</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-25px",
            }}
            onClick={() => {
              setShowSearchMobile((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    "Range End Time": colVisPortfolio[ "Range End Time" ] && (
      <th>
        <div>
          <small>Range End Time</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-15px",
            }}
            onClick={() => {
              setShowSearchMobile((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    Delta: colVisPortfolio[ "Delta" ] && (
      <th>
        <div>
          <small>Delta</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-40px",
            }}
            onClick={() => {
              setShowSearchEmail((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    Theta: colVisPortfolio[ "Theta" ] && (
      <th>
        <div>
          <small>Theta</small>
          <img
            src={filterIcon}
            alt="icon"
            style={{
              height: "25px",
              width: "25px",
              marginLeft: "-40px",
            }}
            onClick={() => {
              setShowSearchNet((prev) => !prev);
            }}
          />
        </div>
      </th>
    ),
    Vega: colVisPortfolio[ "Vega" ] && (
      <th>
        <div>
          <small>Vega</small>
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
    Remarks: colVisPortfolio[ "Remarks" ] && (
      <th>
        <div>
          <small>Remarks</small>
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
    Message: colVisPortfolio[ "Message" ] && (
      <th>
        <div>
          <small>Message</small>
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
  };

  return (
    <div onClick={handleCloseAllSearchBox}>
      <MarketIndex />
      <div className="main-section">
        <LeftNav />

        <div className="middle-main-container">
          {/* <ErrorContainer
            msgs={[]}
          /> */}
          <TopNav
            pageCols={portfolioCols}
            colsSelectedAll={portfolioColsSelectedALL}
            setColsSelectedALL={setportfolioColsSelectedALL}
            selectAll={portfolioColSelectALL}
            colVis={colVisPortfolio}
            setColVis={setcolVisPortfolio}
            setSeq={setportfolioSeq}
          />
          <div
            className="main-table"
          // ref={tableRef}
          >
            <table className="table">
              <thead style={{ position: "sticky", top: "0px", zIndex: 10 }}>
                {portfolioSeq.map((colName, index) => {
                  return (
                    <React.Fragment key={index}>
                      {portfolioTH[ colName ]}
                    </React.Fragment>
                  );
                })}
              </thead>
              <tbody
                className="tabletbody"
                style={{ backgroundColor: "#e8e6e6" }}
              >
                {portfolioDetails.map((item, index) => {
                  const portfolioTD = {
                    Enabled: colVisPortfolio[ "Enabled" ] && (
                      <td
                        style={{
                          width: "15%",
                          textAlign: "right",
                          paddingRight: "10px",
                        }}
                        colSpan="2"
                      >
                        {index !== undefined &&
                          (!isPlusClicked[ index ] ? (
                            <span
                              style={{
                                fontSize: "30px",
                                fontWeight: "bold",
                                marginRight: "55px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                handlePlusClick(index);
                              }}
                            >
                              +
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: "30px",
                                fontWeight: "bold",
                                marginRight: "59px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                handlePlusClick(index);
                              }}
                            >
                              -
                            </span>
                          ))}
                        <input type="checkbox" />
                      </td>
                    ),
                    Status: colVisPortfolio[ "Status" ] && (
                      <td>
                        <input
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    "Portfolio Name": colVisPortfolio[ "Portfolio Name" ] && (
                      <td>
                        <input
                          type="text"
                          value={item.portfolio_name}
                          style={{
                            disable: "none",
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    PNL: colVisPortfolio[ "PNL" ] && (
                      <td>
                        <input
                          type="number"
                          defaultValue="0"
                          onInput={(e) => {
                            const value = e.target.value;
                            // Remove non-numeric characters
                            const sanitizedValue = value.replace(/[^0-9]/g, "");
                            // Update the input value
                            e.target.value = sanitizedValue;
                          }}
                          style={{
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    Symbol: colVisPortfolio[ "Symbol" ] && (
                      <td>
                        <input
                          type="text"
                          value={item.stock_symbol}
                          style={{
                            disable: "none",
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    "Execute/Sq Off": colVisPortfolio[ "Execute/Sq Off" ] && (
                      <td style={{ textAlign: "center" }}>
                        <span className="tooltip-container">
                          <img
                            src={close}
                            alt="icon"
                            className="cross_icon"
                            style={{
                              height: "20px",
                              width: "20px",
                            }}
                          // onClick={handleDelete}
                          />
                          <span className="tooltiptext delete-tooltip">
                            Sq Off
                          </span>
                        </span>
                      </td>
                    ),
                    Delete: colVisPortfolio[ "Delete" ] && (
                      <td style={{ textAlign: "center" }}>
                        <span className="tooltip-container">
                          <img
                            src={Recycle}
                            alt="icon"
                            className="cross_icon"
                            style={{
                              height: "20px",
                              width: "20px",
                            }}
                            onClick={() => {
                              handleDelete(item.portfolio_name);
                            }}
                          />
                          <span className="tooltiptext delete-tooltip">
                            Delete
                          </span>
                        </span>
                      </td>
                    ),
                    Edit: colVisPortfolio[ "Edit" ] && (
                      <td style={{ textAlign: "center" }}>
                        <span className="tooltip-container">
                          <img
                            src={Edit}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                            }}
                            onClick={() => {
                              handleEdit(item);
                            }}
                          />
                          <span className="tooltiptext delete-tooltip">
                            Edit
                          </span>
                        </span>
                      </td>
                    ),

                    "Make Copy": colVisPortfolio[ "Make Copy" ] && (
                      <td style={{ textAlign: "center" }}>
                        <span className="tooltip-container">
                          <img
                            src={makecopy}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                            }}
                            onClick={handleMakeCopy}
                          />
                          <span className="tooltiptext delete-tooltip">
                            Make Copy
                          </span>
                        </span>
                      </td>
                    ),
                    "Mark As Completed": colVisPortfolio[
                      "Mark As Completed"
                    ] && (
                        <td style={{ textAlign: "center" }}>
                          <span className="tooltip-container">
                            <img
                              src={makeascompleted}
                              alt="icon"
                              style={{
                                height: "25px",
                                width: "25px",
                              }}
                              onClick={handleMakeAsCompleted}
                            />
                            <button
                              className="tooltiptext delete-tooltip"
                              style={{ width: "9.2rem" }}
                            >
                              Make As Completed
                            </button>
                          </span>
                        </td>
                      ),
                    Reset: colVisPortfolio[ "Reset" ] && (
                      <td style={{ textAlign: "center" }}>
                        <span className="tooltip-container">
                          <img
                            src={reset}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                            }}
                            onClick={handleReset}
                          />
                          <span className="tooltiptext delete-tooltip">
                            Reset
                          </span>
                        </span>
                      </td>
                    ),
                    "Pay Off": colVisPortfolio[ "Pay Off" ] && (
                      <td style={{ textAlign: "center" }}>
                        <span className="tooltip-container">
                          <img
                            src={payoff}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                            }}
                            onClick={handlePayOff}
                          />
                          <span className="tooltiptext delete-tooltip">
                            Pay Off
                          </span>
                        </span>
                      </td>
                    ),
                    Chat: colVisPortfolio[ "Chat" ] && (
                      <td style={{ textAlign: "center" }}>
                        <span className="tooltip-container">
                          <img
                            src={chart}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                            }}
                            onClick={handleChart}
                          />
                          <span className="tooltiptext delete-tooltip">
                            Chat
                          </span>
                        </span>
                      </td>
                    ),
                    "Re Execute": colVisPortfolio[ "Re Execute" ] && (
                      <td style={{ textAlign: "center" }}>
                        <span className="tooltip-container">
                          <img
                            src={reexecute}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                            }}
                            onClick={handleReexecute}
                          />
                          <span className="tooltiptext delete-tooltip">
                            Re execute
                          </span>
                        </span>
                      </td>
                    ),
                    "Part Entry/Exit": colVisPortfolio[ "Part Entry/Exit" ] && (
                      <td
                        style={{
                          textAlign: "center",
                          // backgroundColor: "#e8e6e6",
                        }}
                      >
                        <span className="tooltip-container">
                          <img
                            src={partentry}
                            alt="icon"
                            style={{
                              height: "25px",
                              width: "25px",
                            }}
                            onClick={handlePartEntry}
                          />
                          <span className="tooltiptext delete-tooltip">
                            Part Entry
                          </span>
                        </span>
                      </td>
                    ),
                    "Current Value": colVisPortfolio[ "Current Value" ] && (
                      <td>
                        <input
                          type="number"
                          defaultValue="0"
                          style={{
                            disable: "none",
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    "Value Per Lot": colVisPortfolio[ "Value Per Lot" ] && (
                      <td>
                        <input
                          type="number"
                          defaultValue="0"
                          style={{
                            disable: "none",
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    "Underlying LTP": colVisPortfolio[ "Underlying LTP" ] && (
                      <td>
                        <input
                          type="number"
                          defaultValue="0"
                          style={{
                            disable: "none",
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    "Positional Portfolio": colVisPortfolio[
                      "Positional Portfolio"
                    ] && (
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                      ),
                    Product: colVisPortfolio[ "Product" ] && (
                      <td>
                        <input
                          type="text"
                          value={item.variety}
                          style={{
                            disable: "none",
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    Strategy: colVisPortfolio[ "Strategy" ] && (
                      <td>
                        <input
                          type="text"
                          value={item.strategy}
                          style={{
                            disable: "none",
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    "Entry Price": colVisPortfolio[ "Entry Price" ] && (
                      <td>
                        <input
                          type="number"
                          defaultValue="0"
                          style={{
                            disable: "none",
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    "Combined Premuim": colVisPortfolio[ "Combined Premuim" ] && (
                      <td>
                        <input
                          type="number"
                          defaultValue="0"
                          style={{
                            disable: "none",
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    "Per Lot Premuim": colVisPortfolio[ "Per Lot Premuim" ] && (
                      <td>
                        <input
                          type="number"
                          defaultValue="0"
                          style={{
                            disable: "none",
                            padding: "6px",

                            alignItems: "center",
                          }}
                        />
                      </td>
                    ),
                    "Start Time": colVisPortfolio[ "Start Time" ] && (
                      <td>
                        <input
                          type="text"
                          defaultValue="00:00:00"
                          style={{
                            padding: "6px",

                            alignItems: "center",
                          }}
                        />
                      </td>
                    ),
                    "End Time": colVisPortfolio[ "End Time" ] && (
                      <td>
                        <input
                          type="text"
                          defaultValue="00:00:00"
                          style={{
                            disable: "none",
                            padding: "6px",

                            alignItems: "center",
                          }}
                        />
                      </td>
                    ),
                    "SqOff Time": colVisPortfolio[ "SqOff Time" ] && (
                      <td>
                        <input
                          type="text"
                          defaultValue="00:00:00"
                          style={{
                            disable: "none",
                            padding: "6px",

                            alignItems: "center",
                          }}
                        />
                      </td>
                    ),
                    "Range End Time": colVisPortfolio[ "Range End Time" ] && (
                      <td>
                        <input
                          type="text"
                          defaultValue="00:00:00"
                          style={{
                            disable: "none",
                            padding: "6px",

                            alignItems: "center",
                          }}
                        />
                      </td>
                    ),
                    Delta: colVisPortfolio[ "Delta" ] && (
                      <td>
                        <input
                          type="number"
                          defaultValue="0"
                          onInput={(e) => {
                            const value = e.target.value;
                            const sanitizedValue = value.replace(
                              /[^0-9.]/g,
                              "",
                            );
                            const formattedValue = sanitizedValue.replace(
                              /(\d)(?=(\d{2})+(?!\.\d))$/,
                              "$1,",
                            );
                            e.target.value = formattedValue;
                          }}
                          style={{
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    Theta: colVisPortfolio[ "Theta" ] && (
                      <td>
                        <input
                          type="number"
                          defaultValue="0"
                          onInput={(e) => {
                            const value = e.target.value;
                            const sanitizedValue = value.replace(/[^0-9]/g, "");
                            e.target.value = sanitizedValue;
                          }}
                          style={{
                            disable: "none",
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    Vega: colVisPortfolio[ "Vega" ] && (
                      <td>
                        <input
                          type="number"
                          defaultValue="0"
                          onInput={(e) => {
                            const value = e.target.value;
                            const sanitizedValue = value.replace(/[^0-9]/g, "");
                            e.target.value = sanitizedValue;
                          }}
                          style={{
                            disable: "none",
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    Remarks: colVisPortfolio[ "Remarks" ] && (
                      <td>
                        <input
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                    Message: colVisPortfolio[ "Message" ] && (
                      <td>
                        <input
                          type="text"
                          style={{
                            disable: "none",
                            padding: "6px",
                          }}
                        />
                      </td>
                    ),
                  };
                  return (
                    <tr key={index}>
                      {portfolioSeq.map((colName, index) => {
                        return (
                          <React.Fragment key={index}>
                            {portfolioTD[ colName ]}
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Modal
              isOpen={showConfirmDeleteModal}
              onRequestClose={() => setShowConfirmDeleteModal(false)}
              contentLabel="Confirm Delete Modal"
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
                If you proceed, you can't retrieve '{portfolioToDelete}'
                portfolio details?
              </p>
              <div style={{ flex: 1 }}></div>
              <div className="modal-buttons" style={{ marginBottom: "20px" }}>
                <button
                  style={{
                    padding: "8px 16px",
                    borderRadius: "5px",
                    backgroundColor: "#d9534f",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleDeletes(portfolioToDelete);
                  }}
                >
                  Confirm
                </button>
                <button
                  style={{
                    marginLeft: "10px",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    backgroundColor: "#5cb85c",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowConfirmDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </Modal>

            {isTableOpen && (
              <div>
                <table className="table1">
                  <thead>
                    <tr>
                      <th>SNO1</th>
                      <th>ID</th>
                      <th>SqOff</th>
                      <th>Idle</th>
                      <th>Execute</th>
                      <th>Part Entry/Exit</th>
                      <th>Exchange Symbol</th>
                      <th>Transcation</th>
                      <th>Lots</th>
                      <th>Target Type</th>
                      <th>Target Value</th>
                      <th>Profit Locking</th>
                      <th>SL Type</th>
                      <th>SL Value</th>
                      <th>Trailing SL</th>
                      <th>SL Wait</th>
                      <th>On Target</th>
                      <th>On SL</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subTableData.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="number"
                            value={index + 1}
                            style={{
                              disable: "none",
                              textAlign: "center",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            defaultValue="00:00:00"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.lots}
                            style={{
                              disable: "none",
                              textAlign: "center",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            style={{
                              disable: "none",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            style={{
                              disable: "none",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            style={{
                              disable: "none",
                              padding: "6px",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <table className="table2">
                  <thead>
                    <tr>
                      <th>Option Portfolio</th>
                      <th>User ID</th>
                      <th>User Alias</th>
                      <th>SqOff</th>
                      <th>Mark As Completed</th>
                      <th>Part Entry/Exit</th>
                      <th>Avg Execution Price</th>
                      <th>PNL</th>
                      <th>CE PNL</th>
                      <th>PE PNL</th>
                      <th>Max PNL</th>
                      <th>Max PNL Time</th>
                      <th>Min PNL</th>
                      <th>Min PNL Time</th>
                      <th>Target</th>
                      <th>SL</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {console.log("subTableData", subTableData)} */}
                    {subTableData[ 0 ].brokerDetails.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              paddingRight: "15px",
                            }}
                          >
                            {!isPlusClicked1[ index ] ? (
                              <span
                                style={{
                                  fontSize: "30px",
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                  paddingLeft: "10px",
                                  paddingRight: "10px",
                                }}
                                onClick={() => {
                                  handlePlusClick1(index);
                                }}
                              >
                                +
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: "30px",
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                  paddingLeft: "13px",
                                  paddingRight: "10px",
                                }}
                                onClick={() => {
                                  handlePlusClick1(index);
                                }}
                              >
                                -
                              </span>
                            )}
                            <input
                              type="text"
                              style={{
                                marginLeft: "10px",
                                backgroundColor: "#A6D8FF",
                              }}
                            />
                          </div>
                        </td>

                        <td>
                          <input
                            type="text"
                            className="Clickable cell"
                            value={item.userId}
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              minWidth: "100%",
                              minHeight: "20px",
                              border: "1px solid transparent",
                              display: "inline-block",
                              alignItems: "center", // Corrected property
                              justifyContent: "center",
                              scrollbarWidth: "thin", // Set the width of the scrollbar (non-WebKit browsers)
                              maxWidth: "11rem",
                              maxHeight: "50px", // Set a maximum height for the span
                              overflowY: "auto",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            value={item.display_name}
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            defaultValue="00:00:00"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={timerValue}
                            onChange={handleTimerChange}
                            placeholder="00:00:00"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={timerValue}
                            onChange={handleTimerChange}
                            placeholder="00:00:00"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            defaultValue="0"
                            onInput={(e) => {
                              const value = e.target.value;
                              // Remove non-numeric characters
                              const sanitizedValue = value.replace(
                                /[^0-9]/g,
                                "",
                              );
                              // Update the input value
                              e.target.value = sanitizedValue;
                            }}
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                              textAlign: "center",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{
                              disable: "none",
                              padding: "6px",
                              backgroundColor: "#A6D8FF",
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {isTableOpen && isTableOpen1 && (
                  <table className="table3">
                    <thead>
                      <tr>
                        <th>SNO</th>
                        <th>SqOff Leg</th>
                        <th>Part Entry/Exit</th>
                        <th>Exchange Symbol</th>
                        <th>LTP</th>
                        <th>PNL</th>
                        <th>Txn</th>
                        <th>Lots</th>
                        <th>Leg Qty</th>
                        <th>Total Entry Qty</th>
                        <th>Avg Entry Price</th>
                        <th>Entry Filled Qty</th>
                        <th>Avg Exit Price</th>
                        <th>Exit Filled Qty</th>
                        <th>Status</th>
                        <th>Target</th>
                        <th>SL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subTableData.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="number"
                              value={index + 1}
                              style={{
                                disable: "none",
                                textAlign: "center",
                                padding: "6px",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ disable: "none", padding: "6px" }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ disable: "none", padding: "6px" }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ disable: "none", padding: "6px" }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ disable: "none", padding: "6px" }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.lots}
                              style={{
                                disable: "none",
                                textAlign: "center",
                                padding: "6px",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{ disable: "none", padding: "6px" }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              defaultValue="0"
                              onInput={(e) => {
                                const value = e.target.value;
                                // Remove non-numeric characters
                                const sanitizedValue = value.replace(
                                  /[^0-9]/g,
                                  "",
                                );
                                // Update the input value
                                e.target.value = sanitizedValue;
                              }}
                              style={{
                                disable: "none",
                                padding: "6px",
                                textAlign: "center",
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
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

export default Portfolio;
