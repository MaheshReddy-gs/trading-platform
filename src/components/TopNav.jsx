import React, { useState, useRef, memo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import Positionsimg from "../assets/Positions.png";
import ordermanagementimg from "../assets/ordermanagement.png";
import orderflowimg from "../assets/orderflow.png";
import holdingsimg from "../assets/holdings.png";
import Positionsactive from "../assets/positionsactive.png";
import holdingsactive from "../assets/holdingactive.png";
import orderflowactive from "../assets/orderflowactive.png";
import ordermanagementactive from "../assets/ordermanagementactive.png";
import "../styles.css";

export const TopNav = ({
  pageCols,
  colsSelectedAll,
  setColsSelectedALL,
  selectAll,
  colVis,
  setColVis,
  setSeq,
  rows,
}) => {
  const [orderflow, setorderflow] = useState(false);
  const [ordermanagement, setordermanagement] = useState(false);
  const [holdings, setholdings] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [columnHideDropDown, setcolumnHideDropDown] = useState(false);
  console.log(rows, "");

  // Dependency on the pathname
  const [totalAccounts, setTotalAccounts] = useState(0);

  useEffect(() => {
    if (rows) {
      const count = rows.filter(
        (row) =>
          row.userId !== "" &&
          row.broker !== "" &&
          row.apiKey !== "" &&
          row.password !== "" &&
          row.qrCode !== "" &&
          row.name !== ""
      ).length;
      setTotalAccounts(count);
    }
  }, [rows]);

  const [loggedAccounts, setLoggedAccounts] = useState(0);

  useEffect(() => {
    if (rows) {
      const loggedAccountsArray = rows.filter((item) => {
        return item.inputDisabled === true;
      });
      setLoggedAccounts(loggedAccountsArray.length);
    }
  }, [rows]);

  const totalAccountsStyle = { color: "red" };
  const loggedAccountsStyle = { color: "green" };

  const [openPosition, setopenPosition] = useState(0);
  const [closePosition, setclosePosition] = useState(0);

  window.addEventListener("click", (e) => {
    if (columnHideDropDown) {
      if (
        !document.getElementById("hide_btn_ref").contains(e.target) &&
        !document.getElementById("dropdown-menu").contains(e.target)
      ) {
        setcolumnHideDropDown(false);
      }
      // console.log('clicked')
    }
  });

  return (
    <div className="second-navbar">
      <div>
        <h1>
          {pathname.includes("UserProfiles") ? (
            <>
              User Profiles(
              <span style={loggedAccountsStyle}>{loggedAccounts}</span>/
              <span style={totalAccountsStyle}>{totalAccounts}</span>)
            </>
          ) : pathname.includes("Strategies") ? (
            "Strategies"
          ) : pathname.includes("F&O") ? (
            "F & O Trading"
          ) : pathname.includes("Positions") ? (
            <>
              Positions(
              <span style={{ color: "green" }}>{openPosition}</span> /
              <span style={{ color: "red" }}>{closePosition}</span>)
            </>
          ) : pathname.includes("Holdings") ? (
            "Holdings"
          ) : pathname.includes("OrderFlow") ? (
            "Order Flow"
          ) : pathname.includes("OrderManagement") ? (
            "Order Management"
          ) : pathname.includes("Equity") ? (
            "Equity Trading"
          ) : null}
        </h1>
      </div>
      <div className="second-potions-div">
        <div
          id="hide_btn_ref"
          onClick={() => {
            setcolumnHideDropDown((prev) => !prev);
          }}
        >
          <button
            className="hideBtn"
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Hide <FaEye className="eye-icon" />
          </button>
        </div>
        {columnHideDropDown && (
          <div id="dropdown-menu" className="dropdown-menu hidedrop-down">
            <label>
              <input
                checked={colsSelectedAll}
                type="checkbox"
                onClick={selectAll}
              />
              Select All
            </label>
            {Array.from(new Set(pageCols.map((data) => data)))
              .sort()
              .map((columnName, index) => {
                return (
                  <label
                    key={index}
                    style={!colVis[columnName] ? { color: "red" } : null}
                  >
                    <input
                      type="checkbox"
                      checked={!colVis[columnName]}
                      onClick={() => {
                        setColsSelectedALL((prev) => (prev ? false : prev));
                        setColVis((prev) => ({
                          ...prev,
                          [columnName]: !prev[columnName],
                        }));
                        setSeq((prev) => {
                          if (prev.includes(columnName)) {
                            const newOrder = prev.filter(
                              (col) => col !== columnName,
                            );
                            return newOrder;
                          } else {
                            return [...prev, columnName];
                          }
                        });
                      }}
                    />
                    {columnName}
                  </label>
                );
              })}
          </div>
        )}
        <button>Help</button>
        <ul>
          <li
            onClick={() => {
              navigate("/Positions");
            }}
          >
            <img
              src={pathname === "/Positions" ? Positionsactive : Positionsimg}
              alt="img"
              style={{ height: "40.5px", marginTop: "3px" }}
            />
            <span className="tooltip">Positions</span>
          </li>
          <li
            onClick={() => {
              navigate("/Holdings");
            }}
          >
            <img
              src={pathname === "/Holdings" ? holdingsactive : holdingsimg}
              alt="img"
              style={{ height: "40.5px", marginTop: "3px" }}
            />
            <span className="tooltip">Holdings</span>
          </li>
          <li
            onClick={() => {
              navigate("/OrderFlow");
            }}
          >
            <img
              src={pathname === "/OrderFlow" ? orderflowactive : orderflowimg}
              alt="img"
              style={{ height: "40.5px", marginTop: "3px" }}
            />
            <span className="tooltip">Order Flow</span>
          </li>

          <li
            onClick={() => {
              navigate("/OrderManagement");
            }}
          >
            <img
              src={
                pathname === "/OrderManagement"
                  ? ordermanagementactive
                  : ordermanagementimg
              }
              alt="img"
              style={{ height: "40.5px", marginTop: "3px", width: "140px" }}
            />
            <span className="tooltip">Order Management</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
