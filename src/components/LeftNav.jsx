import React from "react";
import "../styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import leftSideBar1 from "../assets/1left.png";
//import leftSideBar1active from "../assets/1leftactive.png";
import leftSideBar2 from "../assets/2left.png";
//import leftSideBar2active from "../assets/2leftactive.png";
import leftSideBar3 from "../assets/3left.png";
//import leftSideBar3active from "../assets/3leftactive.png";
import leftSideBar4 from "../assets/4left.png";
//import leftSideBar4active from "../assets/4leftactive.png";
import message from "../assets/ErrorContainer/message.png";
import { useSelector, useDispatch } from "react-redux";
import { setBrokers } from "../store/slices/broker";
import { setStrategies } from "../store/slices/strategy";

function LeftNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { brokers } = useSelector((state) => state.brokerReducer);
  console.log(brokers, "12");
  const { strategies: data } = useSelector((state) => state.strategyReducer);
  console.log("startegyState", data);

  const deleteEmptyRow = () => {

    const mandatoryFields = ["StrategyLabel", "TradingAccount"];
    const filteredData = data.filter((row) =>
      mandatoryFields.every((field) => row[field] !== ""),
    );

    if (data.length!==1 && filteredData.length !== data.length) {
      dispatch(
        setStrategies({
          strategies: filteredData,
        }),
      );
    }

    const requiredFields = [
      "userId",
      "name",
      "broker",
      "qrCode",
      "password",
    ];

    const filteredBrokers = brokers.filter((row) =>
      requiredFields.every((field) => row[field] !== ""),
    );

    if (brokers.length && filteredBrokers.length !== brokers.length) {
      dispatch(
        setBrokers({
          brokers: filteredBrokers,
        }),
      );
    }


  }

  // console.log("path", pathname);
  return (
    <div className="left-sidebar">
      <ul className="left-links">
        <li
          onClick={() => {
            navigate("/UserProfiles");
            deleteEmptyRow()
          }}
        >
          <img
            style={{
              height: "50px",
              width: "50px",
              padding: "6px",
              borderRadius: "50%",
              zIndex: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "background-color 0.3s",
              backgroundColor:
                pathname === "/UserProfiles" ? "#4661bd" : "#d8e1ff",
              bottom: "6%",
              cursor: "pointer",
            }}
            src={leftSideBar1}
            alt="img"
          />
          <span className="tooltip">User Profiles</span>
        </li>

        <li
          onClick={() => {
            navigate("/Strategies");
            deleteEmptyRow()
          }}
        >
          <img
            style={{
              height: "50px",
              width: "50px",
              padding: "6px",
              borderRadius: "50%",
              zIndex: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "background-color 0.3s",
              backgroundColor:
                pathname === "/Strategies" ? "#4661bd" : "#d8e1ff",
              bottom: "6%",
              cursor: "pointer",
            }}
            src={leftSideBar2}
            alt="img"
          />
          <span className="tooltip">Strategies</span>
        </li>

        <li
          onClick={() => {
            navigate("/Equity");
            deleteEmptyRow()
          }}
        >
          <img
            style={{
              width: "50px",
              height: "auto",
              padding: "6px 18px",
              borderRadius: "50%",
              zIndex: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "background-color 0.3s",
              backgroundColor: pathname === "/Equity" ? "#4661bd" : "#d8e1ff",
              bottom: "6%",
              cursor: "pointer",
              position: "relative",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            src={leftSideBar3}
            alt="img"
          />
          <span className="tooltip">Equity Trading</span>
        </li>

        <li
          onClick={() => {
            navigate("/F&O/Portfolio");
            deleteEmptyRow()
          }}
        >
          <img
            style={{
              height: "50px",
              width: "50px",
              padding: "6px",
              borderRadius: "50%",
              zIndex: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "background-color 0.3s",
              backgroundColor:
                pathname === "/F&O/Orders" || pathname === "/F&O/Portfolio"
                  ? "#4661bd"
                  : "#d8e1ff",
              bottom: "6%",
              cursor: "pointer",
            }}
            src={leftSideBar4}
            alt="img"
          />
          <span className="tooltip">F&O Trading</span>
        </li>
      </ul>

      <span className="chat-icon-button">
        <img src={message} alt="icon" />
        <span className="tooltip">chat</span>
      </span>
    </div>
  );
}

export default LeftNav;
