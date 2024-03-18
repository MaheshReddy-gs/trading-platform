import React, {
  useState,
  useRef,
  memo,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import "./FandOrow.css";
// import Delete from '../F&O/image/delete.png';
import Buy from "../../assets/buy.png";
import Sell from "../../assets/SELL.png";
import CE from "../../assets/CE.png";
import PE from "../../assets/PE.png";
import Close from "../../assets/close1.png";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const Fandorow = forwardRef(
  (
    {
      setlegsEdited,
      editPortfolio,
      portfolio,
      selectedDate,
      stock_symbol,
      setIsPortfolioEdited,
    },
    ref,
  ) => {
    const tableRef = useRef();


    const [ dateOptions, setdateOptions ] = useState([]);
    const expiryState = useSelector((state) => state.expiryReducer);
    // console.log("NIFTY, BANKNIFTY, FINNIFTY", NIFTY,"=", BANKNIFTY,"=", FINNIFTY)
    const generateDateOptions = (index = 0) => {
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
        const options = Expirylist.map((expiry) => (
          <option
            selected={
              editPortfolio
                ? legs[ index ][ "expiry_date" ] === expiry
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
        // setdateOptions(options);
        return options;
      }
    };

    // useEffect(() => {

    //   generateDateOptions();
    // }, [stock_symbol, selectedDate, expiryState]);
    const [ timerValue, setTimerValue ] = useState("");
    const [ currentNumber, setCurrentNumber ] = useState(1);

    const rowStyle = (index) => ({
      backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#e6e6e6",
    });

    const handleTimerChange = (e) => {
      const inputTime = e.target.value;
      const formattedTime = formatInputTime(inputTime);
      setTimerValue(formattedTime);
    };

    const formatInputTime = (inputTime) => {
      const numericTime = inputTime.replace(/[^0-9]/g, "");
      const paddedTime = numericTime.padStart(6, "0");
      const hours = Math.min(parseInt(paddedTime.slice(0, 2), 10), 23);
      const formattedTime = `${String(hours).padStart(2, "0")}:${paddedTime.slice(2, 4)}:${paddedTime.slice(4, 6)}`;
      return formattedTime;
    };

    const [ legs, setlegs ] = useState([
      {
        transaction_type: "BUY",
        option_type: "CE",
        ltp: "0",
        lots: 1,
        expiry_date: "",
        strike: "",
      },
    ]);
    useEffect(() => {
      if (editPortfolio && portfolio && portfolio.legs) {
        const updatedLegs = portfolio.legs;
        setlegs(updatedLegs);
      }
    }, [ portfolio ]);

    const handleAddRow = () => {
      setlegs((prevLegs) => [
        ...prevLegs,
        {
          transaction_type: "BUY",
          option_type: "CE",
          ltp: "0",
          lots: 1,
          expiry_date: selectedDate,
          strike: "",
        },
      ]);

      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.scrollLeft = 0; /* Set to a larger value */
          tableRef.current.scrollTop = tableRef.current.scrollHeight;
        }
      }, 100);
    };
    const handleDelete = (indexToDelete) => {
      setlegs((prevLegs) => {
        // console.log("first");
        if (prevLegs.length === 1) {
          return prevLegs;
        }
        const updatedLegs = prevLegs.filter(
          (_, index) => index !== indexToDelete,
        );
        // console.log("updatedLegs1", updatedLegs);
        return updatedLegs;
      });
    };

    useEffect(() => {
      if (selectedDate !== null) {
        // console.log("second")
        const updatedLegs = [ ...legs ];
        legs.map((leg) => {
          leg[ "expiry_date" ] = selectedDate;
        });
        setlegs(updatedLegs);
      }
    }, [ selectedDate ]);

    useEffect(() => {
      setlegs((prevLegs) => {
        const updatedLegs = prevLegs.map((leg) => {
          return {
            ...leg,
            ltp: "0",
          };
        });
        // console.log("updatedLegs1", updatedLegs);
        return updatedLegs;
      });
    }, [ stock_symbol ]);

    const [ allStrikeValues, setAllStrikeValues ] = useState([]);
    const [ allOptionTypes, setAllOptionTypes ] = useState([]);
    const [ allExpiryDates, setAllExpiryDates ] = useState([]);

    useEffect(() => {
      if (
        legs.map((leg) => leg.strike).join(",") !== allStrikeValues.join(",") ||
        legs.map((leg) => leg[ "option_type" ]).join(",") !==
        allOptionTypes.join(",") ||
        legs.map((leg) => leg.expiry_date).join(",") !==
        allExpiryDates.join(",")
      ) {
        const allStrikes = legs.map((leg) => leg.strike);
        const allExpiries = legs.map((leg) => leg.expiry_date);
        const allOptions = legs.map((leg) => leg.option_type);
        setAllStrikeValues(allStrikes);
        setAllOptionTypes(allOptions);
        setAllExpiryDates(allExpiries);
      }
    }, [ legs ]);

    useImperativeHandle(ref, () => ({
      getLegs() {
        return legs;
      },
    }));

    useEffect(() => {
      allStrikeValues.map(async (strike, index) => {
        const atmData = {
          symbol: stock_symbol,
          strike: strike,
          option_type: allOptionTypes[ index ],
          expiry: legs[ index ].expiry_date,
        };
        console.log("ATM Data:", atmData);

        if (
          atmData.symbol !== "" &&
          atmData.strike !== "" &&
          atmData.option_type !== "" &&
          atmData.expiry !== ""
        ) {
          try {
            const response = await fetch(`/api/get_price_details/${mainUser}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(atmData),
            });

            if (!response.ok) {
              throw new Error(
                responseData.message ||
                "Something bad happened. Please try again",
              );
            }
            const responseData = await response.json();
            console.log("ltp res", responseData)
            setlegs(prevLegs => {
              const updatedLegs = [ ...prevLegs ];
              updatedLegs[ index ][ "ltp" ] = `${responseData[ "Strike Price" ]} (${responseData[ "Price" ].toFixed(2)})`;
              return updatedLegs
            })
            if (!response.ok) {
              throw new Error(
                responseData.message ||
                "Something bad happened. Please try again",
              );
            }
          } catch (error) {
            console.log(error.message);
          }
        }
      });
    }, [ stock_symbol, allStrikeValues, allOptionTypes, allExpiryDates ]);

    const generateRows = () => {
      return legs.map((leg, index) => (
        <tr key={leg.id} style={rowStyle(index)} className="input">
          <td>{currentNumber + index}</td>
          <td>
            {legs[ index ][ "transaction_type" ] === "BUY" && (
              <img
                src={Buy}
                id="BUY"
                alt="icon"
                className="cross_icon buy_sell"
                style={{
                  height: "35px",
                  width: "35px",
                }}
                onClick={() => {
                  setIsPortfolioEdited(true);
                  setlegs((prev) => {
                    const updatedLegs = [ ...prev ];
                    updatedLegs[ index ][ "transaction_type" ] = "SELL";
                    return updatedLegs;
                  });
                }}
              />
            )}
            {legs[ index ][ "transaction_type" ] === "SELL" && (
              <img
                src={Sell}
                id="SELL"
                alt="icon"
                className="cross_icon sell_buy"
                style={{
                  height: "35px",
                  width: "35px",
                }}
                onClick={() => {
                  setIsPortfolioEdited(true);
                  setlegs((prev) => {
                    const updatedLegs = [ ...prev ];
                    updatedLegs[ index ][ "transaction_type" ] = "BUY";
                    return updatedLegs;
                  });
                }}
              />
            )}
            {legs[ index ][ "option_type" ] === "CE" && (
              <img
                src={CE}
                alt="icon"
                id="CE"
                className="cross_icon ce_pe"
                style={{
                  height: "35px",
                  width: "35px",
                }}
                onClick={() => {
                  setIsPortfolioEdited(true);
                  setlegs((prev) => {
                    const updatedLegs = [ ...prev ];
                    updatedLegs[ index ][ "option_type" ] = "PE";
                    return updatedLegs;
                  });
                }}
              />
            )}
            {legs[ index ][ "option_type" ] === "PE" && (
              <img
                src={PE}
                alt="icon"
                id="PE"
                className="cross_icon pe_ce"
                style={{
                  height: "35px",
                  width: "35px",
                }}
                onClick={() => {
                  setIsPortfolioEdited(true);
                  setlegs((prev) => {
                    const legs = [ ...prev ];
                    legs[ index ][ "option_type" ] = "CE";
                    return legs;
                  });
                }}
              />
            )}
            <img
              src={Close}
              alt="icon"
              className="cross_icon"
              style={{
                height: "35px",
                width: "35px",
              }}
              onClick={() => {
                setIsPortfolioEdited(true);
                handleDelete(index);
              }}
            />
          </td>
          <td style={{ padding: 0, cursor: "pointer" }}>
            <input
              type="text"
              className="number1"
              value={legs[ index ][ "ltp" ]}
              style={{
                textAlign: "center",
                borderRadius: "3px",
              }}
            />
          </td>

          <td>
            <input type="checkbox" style={{ cursor: "pointer" }} />
          </td>
          <td style={{ padding: 0, cursor: "pointer" }}>
            <input
              type="number"
              max="100"
              value={leg.lots}
              onInput={(e) => {
                const value = parseInt(e.target.value);
                if (value <= 0) {
                  e.target.value = 1; // Clear the input value
                }
                if (value > 100) {
                  e.target.value = 100; // Clear the input value
                }
              }}
              onChange={(e) => {
                setIsPortfolioEdited(true);
                setlegs((prev) => {
                  const updatedLegs = [ ...prev ];
                  updatedLegs[ index ][ "lots" ] = !(e.target.value > 0)
                    ? 1
                    : e.target.value > 100
                      ? 100
                      : e.target.value;
                  return updatedLegs;
                });
              }}
              className="number1 portfolioLots"
              style={{
                textAlign: "center",
                borderRadius: "3px",
              }}
            />
          </td>
          <td>
            <select
              className="expiry-dropdown"
              style={{ width: "95px" }}
              onChange={(e) => {
                setIsPortfolioEdited(true);
                setlegs((prev) => {
                  const updatedLegs = [ ...prev ];
                  updatedLegs[ index ][ "expiry_date" ] = e.target.value;
                  return updatedLegs;
                });
              }}
            >
              <option key="default" value="">
                Select
              </option>
              {generateDateOptions(index)}
            </select>
          </td>
          <td>
            <select
              className="custom-dropdown"
              style={{ cursor: "pointer" }}
              onChange={(e) => {
                setIsPortfolioEdited(true);
                setlegs((prev) => {
                  const updatedLegs = [ ...prev ];
                  updatedLegs[ index ][ "strike" ] = e.target.value;
                  return updatedLegs;
                });
              }}
            >
              <option disabled selected>
                Select
              </option>
              {Array.from({ length: 11 }, (_, i) => (i - 5) * 100).map(
                (value) => (
                  <option
                    key={value}
                    selected={
                      editPortfolio &&
                      leg[ "strike" ] ===
                      (value === 0
                        ? "ATM"
                        : value > 0
                          ? `ATM+${value}`
                          : `ATM${value}`)
                    }
                    value={
                      value === 0
                        ? "ATM"
                        : value > 0
                          ? `ATM+${value}`
                          : `ATM${value}`
                    }
                  >
                    {value === 0
                      ? "ATM"
                      : value > 0
                        ? `ATM+${value}`
                        : `ATM${value}`}
                  </option>
                ),
              )}
            </select>
          </td>

          <td>
            <select className="custom-dropdown" style={{ cursor: "pointer" }}>
              <option value="option1">None</option>
              <option value="option2">Premium</option>
              <option value="option3">Uderlying</option>
              <option value="option4">Strike</option>
              <option value="option5">Ads Olute Premium</option>
              <option value="option6">Delta</option>
              <option value="option7">Theta</option>
            </select>
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="number"
              onInput={(e) => {
                const value = e.target.value;
                // Remove non-numeric characters
                const sanitizedValue = value.replace(/[^0-9]/g, "");
                // Update the input value
                e.target.value = sanitizedValue;
              }}
              className="number1"
              defaultValue={0}
              style={{
                textAlign: "center",
                borderRadius: "3px",
              }}
            />
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="number"
              onInput={(e) => {
                const value = e.target.value;
                // Remove non-numeric characters
                const sanitizedValue = value.replace(/[^0-9]/g, "");
                // Update the input value
                e.target.value = sanitizedValue;
              }}
              className="number1"
              defaultValue={0}
              style={{
                textAlign: "center",
                borderRadius: "3px",
              }}
            />
          </td>
          <td>
            <select className="custom-dropdown" style={{ cursor: "pointer" }}>
              <option value="option1">None</option>
              <option value="option2">Premium</option>
              <option value="option3">Uderlying</option>
              <option value="option4">Strike</option>
              <option value="option5">Adsolute Premium</option>
              <option value="option6">Delta</option>
              <option value="option7">Theta</option>
            </select>
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="number"
              onInput={(e) => {
                const value = e.target.value;
                // Remove non-numeric characters
                const sanitizedValue = value.replace(/[^0-9]/g, "");
                // Update the input value
                e.target.value = sanitizedValue;
              }}
              className="number1"
              defaultValue={0}
              style={{
                textAlign: "center",
                borderRadius: "3px",
              }}
            />
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="number"
              onInput={(e) => {
                const value = e.target.value;
                // Remove non-numeric characters
                const sanitizedValue = value.replace(/[^0-9]/g, "");
                // Update the input value
                e.target.value = sanitizedValue;
              }}
              className="number1"
              defaultValue={0}
              style={{
                textAlign: "center",
                borderRadius: "3px",
              }}
            />
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="number"
              onInput={(e) => {
                const value = e.target.value;
                // Remove non-numeric characters
                const sanitizedValue = value.replace(/[^0-9]/g, "");
                // Update the input value
                e.target.value = sanitizedValue;
              }}
              className="number1"
              defaultValue={0}
              style={{
                textAlign: "center",
                borderRadius: "3px",
              }}
            />
          </td>
          <td>
            <select className="custom-dropdown" style={{ cursor: "pointer" }}>
              <option value="option1">None</option>
              <option value="option2">Premium</option>
              <option value="option3">Uderlying</option>
              <option value="option4">Strike</option>
              <option value="option5">Ads Olute Premium</option>
              <option value="option6">Delta</option>
              <option value="option7">Theta</option>
            </select>
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="text"
              pattern="[A-Za-z]+"
              title="Only letters are allowed"
              onInput={(e) => {
                const value = e.target.value;
                // Remove non-letter characters
                const sanitizedValue = value.replace(/[^A-Za-z]/g, "");
                // Update the input value
                e.target.value = sanitizedValue;
              }}
            />
          </td>

          <td>
            <select className="custom-dropdown" style={{ cursor: "pointer" }}>
              <option value="option1">None</option>
              <option value="option2">Premium</option>
              <option value="option3">Uderlying</option>
              <option value="option4">Strike</option>
              <option value="option5">Ads Olute Premium</option>
              <option value="option6">Delta</option>
              <option value="option7">Theta</option>
            </select>
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="text"
              pattern="[A-Za-z]+"
              title="Only letters are allowed"
              onInput={(e) => {
                const value = e.target.value;
                // Remove non-letter characters
                const sanitizedValue = value.replace(/[^A-Za-z]/g, "");
                // Update the input value
                e.target.value = sanitizedValue;
              }}
            />
          </td>
          <td style={{ padding: 0 }}>
            <input
              type="text"
              // value={timerValue}
              onChange={handleTimerChange}
              placeholder="00:00:00"
              style={{ textAlign: "center" }}
              onInput={(e) => {
                const value = e.target.value;
              }}
            />
          </td>
        </tr>
      ));
    };
    const mainUser = cookies.get("USERNAME");

    return (
      <div>
        <div className="tablecontainer" ref={tableRef}>
          <table className="table">
            <thead
              className="thead"
              style={{ position: "sticky", top: "0", zIndex: "20" }}
            >
              <tr>
                <th>ID</th>
                <th>Action</th>
                <th>LTP</th>
                <th>Idle</th>
                <th>Lots</th>
                <th>Expiry</th>
                <th>Strike</th>
                <th>Target</th>
                <th>TGT Value</th>
                <th>Trail TGT</th>
                <th>Stoploss</th>
                <th>SL Value</th>
                <th>Trail SL</th>
                <th>SL Wait</th>
                <th>On Target</th>
                <th>
                  TGT portfolio <br />
                  Name/Count
                </th>
                <th>On Stoploss</th>
                <th>
                  Sl portfolio <br />
                  Name/Count
                </th>
                <th>Start Time</th>
              </tr>
            </thead>
            <tbody className="tabletbody1">{generateRows()}</tbody>
          </table>
        </div>
        <div className="frame-13773">
          {/* onClick={addNewRow} */}
          <div className="ce-pe">
            <button
              className="ce-pe-span2"
              onClick={handleAddRow}
              style={{ cursor: "pointer" }}
            >
              + CE/PE
            </button>
          </div>
        </div>
      </div>
    );
  },
);
Fandorow.displayName = "Fandorow";

export default Fandorow;
