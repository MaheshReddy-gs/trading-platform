import React, { useState, useEffect } from "react";
import shape from "../assets/shape.png";
import Modal from "react-modal";
import pencil from "../assets/pencil.png";
import minus from "../assets/minus-sign.png";
import plus from "../assets/plus-sign.png";
import Draggable from "react-draggable";
import push from "../assets/push-pin.png";
import reuse from "../assets/reuse.png";
import disk from "../assets/diskette.png";
import recycle from "../assets/recycle-bin.png";
import { Oval } from "react-loader-spinner";
import { useSelector } from "react-redux";

export const QuickTradePanel = ({
  isOpen,
  handleClose,
  colopen,
  toggleOpen,
}) => {
  //  empty state
  // const allStrategiesList = useState();
  const { strategies: Strategydata } = useSelector(
    (state) => state.strategyReducer,
  );

  const [ placeOrderBtn, setplaceOrderBtn ] = useState(false);
  const [ placeOrderOptionsQTPBtn, setplaceOrderOptionsQTPBtn ] = useState(false);
  const [ optionsQTP, setOptionsQTP ] = useState({
    exchange: "",
    stock_symbol: "",
    lots: "",
    variety: "",
    strategy: "",
    portfolio_name: "",
  });
  return (
    <div>
      {" "}
      <Modal // Quick Trade Panel
        isOpen={isOpen}
        onRequestClose={handleClose}
        className="your-modal-button"
        style={{
          border: "none",
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            border: "none",
          },
        }}
      >
        <Draggable>
          <div className="containerin">
            <div className="title"></div>
            <div className="content">
              <form action="#">
                <div className="user-details">
                  <div className="input-box">
                    <select
                      className="one"
                      style={{
                        border: "0.5px solid #cacaca",
                        color: "GrayText",
                        paddingLeft: "7px",
                      }}
                      onChange={(e) => {
                        setoptionsQTP((prev) => ({
                          ...prev,
                          exchange: e.target.value,
                        }));
                      }}
                    >
                      <option disabled selected>
                        Exchange
                      </option>
                      <option style={{ color: "black" }} value={"BFO"}>
                        BFO
                      </option>
                      <option style={{ color: "black" }} value={"NFO"}>
                        NFO
                      </option>
                      <option style={{ color: "black" }} value={"MCX"}>
                        MCX
                      </option>
                    </select>
                  </div>

                  <div
                    type="text"
                    className="two"
                    style={{ marginTop: "-15px" }}
                  >
                    <img
                      src={pencil}
                      style={{
                        padding: "5px",
                        height: "38px",
                        width: "36px",
                      }}
                      alt="profile-pic"
                    />
                    <img
                      style={{
                        cursor: "pointer",
                        padding: "5px",
                        height: "38px",
                        width: "36px",
                      }}
                      src={colopen ? plus : minus}
                      onClick={toggleOpen}
                      id="colopen"
                      alt="profile-pic"
                    />
                    <img
                      src={push}
                      style={{
                        padding: "5px",
                        height: "38px",
                        width: "36px",
                      }}
                      alt="profile-pic"
                    />
                    <img
                      src={shape}
                      style={{ cursor: "pointer", padding: "5px" }}
                      onClick={handleClose}
                      alt="profile-pic"
                    />
                  </div>

                  <div className="input-box5">
                    <select
                      className="details"
                      style={{ color: "GrayText" }}
                      onChange={(e) => {
                        setoptionsQTP((prev) => ({
                          ...prev,
                          quantity:
                            e.target.value === "BANKNIFTY"
                              ? 15
                              : e.target.value === "NIFTY"
                                ? 50
                                : 0,
                          symbol: e.target.value,
                        }));
                      }}
                    >
                      <option disabled selected>
                        Enter Stock Symbol
                      </option>
                      <option style={{ color: "black" }} value={"BANKNIFTY"}>
                        BANKNIFTY
                      </option>
                      <option style={{ color: "black" }} value={"NIFTY"}>
                        NIFTY
                      </option>
                    </select>
                  </div>
                  <div className="input-box" style={{ alignItems: "top" }}>
                    <div type="text" className="four">
                      <img
                        src={reuse}
                        style={{
                          padding: "5px",
                          marginBottom: "20px",
                          height: "43px",
                          width: "40px",
                        }}
                        alt="profile-pic"
                      />
                      <img
                        src={disk}
                        style={{
                          padding: "9px",
                          marginBottom: "20px",
                          height: "43px",
                          width: "40px",
                        }}
                        alt="profile-pic"
                      />
                      <img
                        src={recycle}
                        style={{
                          paddingTop: "5px",
                          marginBottom: "25px",
                          width: "40px",
                        }}
                        alt="profile-pic"
                      />
                    </div>
                  </div>
                  <div className="input-box">
                    <select
                      className="five"
                      style={{
                        border: "0.5px solid #cacaca",
                        color: "GrayText",
                      }}
                      onChange={(e) => {
                        setoptionsQTP((prev) => ({
                          ...prev,
                          strategy_tag: e.target.value,
                        }));
                      }}
                    >
                      <option disabled selected>
                        Strategy
                      </option>
                      {Strategydata.filter((row) => row.Action.enabled) // Filter rows where Action.enabled is true
                        .map((row, index) => (
                          <option key={index} value={row.StrategyLabel}>
                            {row.StrategyLabel}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="input-box">
                    <span
                      style={{
                        padding: "5px",
                        marginLeft: "3px",
                        fontSize: "20px",
                        fontWeight: "400",
                        color: "black",
                        fontFamily: "Roboto",
                      }}
                    >
                      {" "}
                      Qty
                    </span>
                    <input
                      value={optionsQTP.quantity}
                      type="number"
                      className="six"
                    />
                  </div>
                </div>

                <div
                  className="gender-details"
                  id="gender-details"
                  style={{
                    border: "1px solid #cacaca",
                    margin: "5px",
                    display: "none",
                    padding: "10px",
                  }}
                >
                  <span className="gender-title">Optional Parameters</span>

                  <div className="user-details" style={{ margin: "5px" }}>
                    <div className="input-box">
                      <select
                        className="fives"
                        style={{
                          border: "0.5px solid #cacaca",
                          color: "GrayText",
                        }}
                        onChange={(e) => {
                          setoptionsQTP((prev) => ({
                            ...prev,
                            variety: e.target.value,
                          }));
                        }}
                      >
                        <option disabled selected>
                          Product
                        </option>
                        <option style={{ color: "black" }} value={"NORMAL"}>
                          NRML
                        </option>
                        <option style={{ color: "black" }} value={"MIS"}>
                          MIS
                        </option>
                      </select>
                    </div>
                    <div className="input-box">
                      <select
                        className="fives"
                        style={{
                          border: "0.5px solid #cacaca",
                          color: "GrayText",
                        }}
                        onChange={(e) => {
                          setoptionsQTP((prev) => ({
                            ...prev,
                            order_type: e.target.value,
                          }));
                        }}
                      >
                        <option disabled selected>
                          Order Type
                        </option>
                        <option style={{ color: "black" }} value={"MARKET"}>
                          MARKET
                        </option>
                        <option style={{ color: "black" }} value={"LIMIT"}>
                          LIMIT
                        </option>
                      </select>
                    </div>
                    <div class="input-box">
                      <span className="details">Price</span>
                      <input
                        type="number"
                        style={{ width: "65%", WebkitAppearance: "none" }}
                        defaultValue={0}
                        onChange={(e) => {
                          setoptionsQTP((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }));
                        }}
                      />
                    </div>
                    <div class="input-box">
                      <span className="details" style={{ marginLeft: "-85px" }}>
                        Trigger
                      </span>
                      <input
                        style={{ marginLeft: "-43%", width: "65%" }}
                        type="number"
                        value="0"
                      />
                    </div>
                  </div>

                  <div className="user-details-bottom">
                    <div class="input-box">
                      <span className="details">Target</span>
                      <input type="number" value="0" />
                    </div>
                    <div class="input-box">
                      <span className="details">S</span>
                      <input type="number" value="0" />
                    </div>
                    <div class="input-box">
                      <span className="details">SL Trail</span>
                      <input type="number" value="0" />
                    </div>
                  </div>
                </div>
                <div className="user-details-button">
                  <div class="input-box">
                    {!placeOrderBtn ? (
                      <button
                        onClick={() => {
                          // handlePlaceOrderOptionsQTP("BUY", "CE");
                        }}
                        style={{ background: "#618F00" }}
                      >
                        LE
                      </button>
                    ) : (
                      <button
                        style={{ background: "#618F00", cursor: "default" }}
                      >
                        <Oval
                          className
                          height="20"
                          width="55"
                          color="white"
                          strokeWidth={3}
                        />
                      </button>
                    )}
                  </div>
                  <div class="input-box">
                    <button text="exit" style={{ background: "#890000" }}>
                      LX
                    </button>
                  </div>
                  <div class="input-box">
                    <div className="check">
                      <input
                        type="checkbox"
                        style={{ opacity: "1", accentColor: "green" }}
                      />
                      <label
                        htmlFor="legSlCheckbox2"
                        style={{
                          cursor: "pointer",
                          border: "2px solid green",
                          marginLeft: "-20.5px",
                          height: "21.3px",
                          width: "21.9px",
                          marginTop: "-25px",
                        }}
                      ></label>
                    </div>
                  </div>
                  <div className="input-box">
                    <button style={{ background: "#FF0000" }}>SE</button>
                  </div>
                  <div className="input-box">
                    <button style={{ background: "#81430B" }}>SX </button>
                  </div>
                </div>

                <div className="user-details-button">
                  <p
                    style={{
                      color: "blue",
                      fontSize: "19px",
                      fontFamily: "Roboto",
                      padding: "10px",
                      display: "none",
                    }}
                    className="sl"
                  >
                    Target, SL in Points. For Percentage, Tick Value in %
                  </p>
                </div>
              </form>
            </div>
          </div>
        </Draggable>
      </Modal>
    </div>
  );
};
