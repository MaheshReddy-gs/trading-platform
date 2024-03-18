import { useState, useEffect } from "react";
// import React, { useState, useRef, memo, useEffect } from "react";
import "../styles.css";
import profile from "../assets/profile.png";
import loguser from "../assets/loguser.png";
import pas from "../assets/password.png";
import out from "../assets/out.png";
import sub from "../assets/sub.png";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { useNavigate } from "react-router-dom";

function MarketIndex() {
  const navigate = useNavigate();
  const logout = () => {
    console.log("logout");
    cookies.remove("TOKEN", {
      path: "/",
    });
    cookies.remove("USERNAME", {
      path: "/",
    });
    navigate("/");
  };

  const [marketData, setMarketData] = useState({
    sensex: {},
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
          (currentHours > 9 && currentHours < 15) ||
          (currentHours === 15 && currentMinutes <= 30)
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
          if (Object.keys(responseData).length !== 0) {
            const marketData = {
              sensex: {
                c: responseData["BSE:SENSEX-INDEX"]["ltp"].toFixed(2),
                ch: (
                  responseData["BSE:SENSEX-INDEX"]["ltp"] -
                  responseData["BSE:SENSEX-INDEX"]["prev_close_price"]
                ).toFixed(2),
                chp: (
                  ((responseData["BSE:SENSEX-INDEX"]["ltp"] -
                    responseData["BSE:SENSEX-INDEX"]["prev_close_price"]) /
                    responseData["BSE:SENSEX-INDEX"]["ltp"]) *
                  100
                ).toFixed(2),
              },
              nifty50: {
                c: responseData["NSE:NIFTY50-INDEX"]["ltp"].toFixed(2),
                ch: (
                  responseData["NSE:NIFTY50-INDEX"]["ltp"] -
                  responseData["NSE:NIFTY50-INDEX"]["prev_close_price"]
                ).toFixed(2),
                chp: (
                  ((responseData["NSE:NIFTY50-INDEX"]["ltp"] -
                    responseData["NSE:NIFTY50-INDEX"]["prev_close_price"]) /
                    responseData["NSE:NIFTY50-INDEX"]["ltp"]) *
                  100
                ).toFixed(2),
              },
              niftybank: {
                c: responseData["NSE:NIFTYBANK-INDEX"]["ltp"].toFixed(2),
                ch: (
                  responseData["NSE:NIFTYBANK-INDEX"]["ltp"] -
                  responseData["NSE:NIFTYBANK-INDEX"]["prev_close_price"]
                ).toFixed(2),
                chp: (
                  ((responseData["NSE:NIFTYBANK-INDEX"]["ltp"] -
                    responseData["NSE:NIFTYBANK-INDEX"]["prev_close_price"]) /
                    responseData["NSE:NIFTYBANK-INDEX"]["ltp"]) *
                  100
                ).toFixed(2),
              },
              finnifty: {
                c: responseData["NSE:FINNIFTY-INDEX"]["ltp"].toFixed(2),
                ch: (
                  responseData["NSE:FINNIFTY-INDEX"]["ltp"] -
                  responseData["NSE:FINNIFTY-INDEX"]["prev_close_price"]
                ).toFixed(2),
                chp: (
                  ((responseData["NSE:FINNIFTY-INDEX"]["ltp"] -
                    responseData["NSE:FINNIFTY-INDEX"]["prev_close_price"]) /
                    responseData["NSE:FINNIFTY-INDEX"]["ltp"]) *
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
            const storedData = JSON.parse(
              localStorage.getItem("marketIndexDetails"),
            );
            if (storedData && storedData.nifty50.c !== "") {
              setMarketData(storedData);
            } else {
              const defaultData = {
                c: "0",
                ch: "0",
                chp: "0",
              };
              setMarketData({
                sensex: defaultData,
                nifty50: defaultData,
                niftybank: defaultData,
                finnifty: defaultData,
              });
            }
          }
        } else {
          const storedData = JSON.parse(
            localStorage.getItem("marketIndexDetails"),
          );
          if (storedData && storedData.nifty50.c !== "") {
            setMarketData(storedData);
          } else {
            const defaultData = {
              c: "0",
              ch: "0",
              chp: "0",
            };
            setMarketData((prev) => ({
              sensex: defaultData,
              nifty50: defaultData,
              niftybank: defaultData,
              finnifty: defaultData,
            }));
          }
        }
      } catch (error) {
        // console.error("Error fetching market index details:", error);
        const storedData = JSON.parse(
          localStorage.getItem("marketIndexDetails"),
        );
        if (storedData && storedData.nifty50.c !== "") {
          setMarketData(storedData);
        } else {
          const defaultData = {
            c: "0",
            ch: "0",
            chp: "0",
          };
          setMarketData({
            sensex: defaultData,
            nifty50: defaultData,
            niftybank: defaultData,
            finnifty: defaultData,
          });
        }
      }
    };

    fetchMarketIndexDetails();
    // const intervalId = setInterval(fetchMarketIndexDetails, 500);
    // return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className="navbar">
      <div className="logo-container">
        {/* <img src="" alt="logo-img" /> */}
      </div>
      <div className="sensex-container" style={{ width: "1150px" }}>
        <div style={{ width: "280px" }}>
          <span className="sensex-one">
            SENSEX <span>{marketData.sensex.c}</span>{" "}
          </span>
          <span className="sensex-two">
            {marketData.sensex.ch !== null &&
              marketData.sensex.ch !== undefined &&
              marketData.sensex.ch !== "" && (
                <span
                  style={marketData.sensex.ch < 0 ? { color: "red" } : null}
                >
                  {marketData.sensex.ch < 0 ? <span>&#9660;</span> : "▲"}{" "}
                  {marketData.sensex.ch} ({marketData.sensex.chp}%)
                </span>
              )}
          </span>
        </div>
        <div style={{ width: "280px" }}>
          <span className="sensex-one">
            NIFTY50 <span>{marketData.nifty50.c}</span>
          </span>
          <span className="sensex-two">
            {marketData.nifty50.ch !== null &&
              marketData.nifty50.ch !== undefined &&
              marketData.nifty50.ch !== "" && (
                <span
                  style={marketData.nifty50.ch < 0 ? { color: "red" } : null}
                >
                  {marketData.nifty50.ch < 0 ? <span>&#9660;</span> : "▲"}{" "}
                  {marketData.nifty50.ch} ({marketData.nifty50.chp}%)
                </span>
              )}
          </span>
        </div>
        <div style={{ width: "310px" }}>
          <span className="sensex-one">
            NIFTYBANK <span>{marketData.niftybank.c}</span>
          </span>
          <span className="sensex-two">
            {marketData.niftybank.ch !== null &&
              marketData.niftybank.ch !== undefined &&
              marketData.niftybank.ch !== "" && (
                <span
                  style={marketData.niftybank.ch < 0 ? { color: "red" } : null}
                >
                  {marketData.niftybank.ch < 0 ? <span>&#9660;</span> : "▲"}{" "}
                  {marketData.niftybank.ch} ({marketData.niftybank.chp}%)
                </span>
              )}
          </span>
        </div>
        <div style={{ width: "300px" }}>
          <span className="sensex-one">
            FINNIFTY <span>{marketData.finnifty.c}</span>
          </span>
          <span className="sensex-two">
            {marketData.finnifty.ch !== null &&
              marketData.finnifty.ch !== undefined &&
              marketData.finnifty.ch !== "" && (
                <span
                  style={marketData.finnifty.ch < 0 ? { color: "red" } : null}
                >
                  {marketData.finnifty.ch < 0 ? <span>&#9660;</span> : "▲"}{" "}
                  {marketData.finnifty.ch} ({marketData.finnifty.chp}%)
                </span>
              )}
          </span>
        </div>
      </div>
      <div className="options-div">
        <ul className="link">
          <li>
            <a>
              <img src={profile} alt="profile-pic" className="profile-pic" />
            </a>
            <ul className="sub-menu">
              <li style={{ cursor: "pointer" }}>
                {" "}
                <a>User Details</a>
                <img src={loguser} alt="profile-pic" className="profile-pic" />
              </li>
              <li style={{ cursor: "pointer" }}>
                <a
                  onClick={() => {
                    navigate("/Change_Password");
                  }}
                >
                  Change Password
                </a>
                <img src={pas} alt="profile-pic" className="profile-pic" />
              </li>
              <li style={{ cursor: "pointer" }}>
                <a>Subscrption</a>
                <img src={sub} alt="profile-pic" className="profile-pic" />
              </li>
              <li
                onClick={() => {
                  // const navigate = useNavigate();

                  // Call the logout function when the "Logout" button is clicked
                  logout();
                }}
                style={{ cursor: "pointer" }}
              >
                <a style={{ textAlign: "right" }}>Logout</a>
                <img src={out} alt="profile-pic" className="profile-pic" />
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default MarketIndex;
