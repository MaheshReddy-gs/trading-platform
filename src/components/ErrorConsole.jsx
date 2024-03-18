/* eslint-disable react/display-name */
import React, {
  useState,
  useRef,
  memo,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
// Error Container
// import "./ErrorConsole.css";
import "../styles.css";
import allLogs from "../assets/ErrorContainer/allLogs.png";
import attention from "../assets/ErrorContainer/attention.png";
import clearLogs from "../assets/ErrorContainer/clearLogs.png";
import copyAll from "../assets/ErrorContainer/copyAll.png";
import error from "../assets/ErrorContainer/error.png";
import exportErrorImg from "../assets/ErrorContainer/export.png";
import message from "../assets/ErrorContainer/message.png";
import trading from "../assets/ErrorContainer/trading.png";
import warning from "../assets/ErrorContainer/warning.png";
import { useDispatch, useSelector } from "react-redux";
import { setCollapse } from "../store/slices/collapse.js";
import { setConsoleMsgs } from "../store/slices/consoleMsg";

// ---
import filterIcon from "../assets/newFilter.png";
import filterUp from "../assets/newFilter2.png";
import { IoIosPeople } from "react-icons/io";
import { FaFileAlt } from "react-icons/fa";

import Modal from "react-modal";

export const ErrorContainer = forwardRef(({ msgs, }, ref) => {
  const dispatch = useDispatch();
  const { collapsed, height } = useSelector((state) => state.collapseReducer);
  const containerRef = useRef(null);
  // const [tabHeight, setTabHeight] = useState("70vh");

  const [ resizing, setResizing ] = useState(false);
  const [ startY, setStartY ] = useState(0);
  const [ startHeight, setStartHeight ] = useState(0);

  const messages = useSelector((state) => state.consoleMsgsReducer.consoleMsgs);
  useEffect(() => {
    containerRef.current.style.height = collapsed ? "75px" : `${height}px`;
    containerRef.current.style.overflow =
      messages.length > 9 ? "auto" : "hidden";
  }, []);

  useImperativeHandle(ref, () => ({
    getCollapsed() {
      return collapsed;
    },
    toggleCollapse() {
      const errorContainerHeight = collapsed ? "310px" : "75px";
      const errorContainerOverflow = collapsed ? "hidden" : "hidden";
      // setTabHeight(tabHeight);
      document.querySelector(".error-container").style.height =
        errorContainerHeight;
      document.querySelector(".error-container").style.overflow =
        errorContainerOverflow;
      dispatch(
        setCollapse({
          height: collapsed ? 310 : 75,
          collapsed: !collapsed,
        }),
      );
      // return !collapsed
    },
  }));

  const handleMouseDown = (e) => {
    setResizing(true);
    setStartY(e.clientY);
    setStartHeight(containerRef.current.offsetHeight);
  };

  const handleMouseMove = (e) => {
    if (resizing) {
      const newHeight = startHeight - (e.clientY - startY);
      if (newHeight < 80) {
        dispatch(
          setCollapse({
            height: newHeight < 75 ? 75 : newHeight,
            collapsed: true,
          }),
        );
        // containerRef.current.style.overflow = 'hidden'
      }
      if (newHeight > 80) {
        dispatch(
          setCollapse({
            height: newHeight,
            collapsed: false,
          }),
        );
      }
      if (newHeight > 73 && newHeight < 350) {
        containerRef.current.style.height = `${newHeight}px`;
      }
    }
  };

  const handleMouseUp = () => {
    setResizing(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [ handleMouseMove, resizing ]);

  return (
    <div className="error-container" id="error-container" ref={containerRef}>
      <div style={{ position: "sticky", top: "0px", zIndex: "5" }}>
        <div
          id="draggable"
          style={{
            cursor: "row-resize",
            background: "#d8e1ff",
            width: "100%",
            height: "8px",
            borderRadius: "10px",
            position: "absolute",
            top: "-5px",
            userSelect: "none",
          }}
          onMouseDown={handleMouseDown}
        ></div>
        <div className="buttons-container" style={{ paddingRight: "0" }}>
          <div style={{ paddingLeft: "15px" }}>
            <img src={allLogs} alt="" />
            <span>All Logs</span>
          </div>
          <div style={{ marginLeft: "-15%", paddingRight: "20px" }}>
            <img src={attention} alt="" />
            <span>0 Attention</span>
          </div>
          <div style={{ marginLeft: "-15%", paddingRight: "20px" }}>
            <img src={error} alt="" />
            <span>0 Errors</span>
          </div>
          <div style={{ marginLeft: "-15%", paddingRight: "20px" }}>
            <img src={warning} alt="" />
            <span>0 Warnings</span>
          </div>
          <div style={{ marginLeft: "-15%", paddingRight: "20px" }}>
            <img src={message} alt="" />
            <span>0 Messages</span>
          </div>
          <div style={{ marginLeft: "-15%", paddingRight: "30px" }}>
            <img src={trading} alt="" />
            <span>0 Trading</span>
          </div>
          <div
            onClick={() => {
              dispatch(
                setConsoleMsgs({
                  consoleMsgs: [],
                }),
              );
            }}
            style={{ marginLeft: "-15%", paddingRight: "20px" }}
          >
            <img src={clearLogs} alt="" />
            <span>Clear Logs</span>
          </div>
          <div style={{ marginLeft: "-15%", paddingRight: "20px" }}>
            <img src={copyAll} alt="" />
            <span>Copy All</span>
          </div>
          <div
            style={{
              borderRight: "none",
              marginLeft: "-15%",
              paddingRight: "23px",
            }}
          >
            <img src={exportErrorImg} alt="" />
            <span>Export</span>
          </div>
        </div>
      </div>
      <Console messages={msgs} />
    </div>
  );
});

const TableRowTr = memo(({ message }) => {
  return (
    <tr>
      <td>{message.timestamp}</td>
      <td>{message.logType}</td>
      <td>{message.user}</td>
      <td>{message.strategy}</td>
      <td>{message.portfolio}</td>
      <td style={{ borderRight: "none" }}>{message.msg}</td>
    </tr>
  );
});

const TableHead = memo(() => {
  return (
    <thead
      style={{
        position: "sticky",
        top: "40px",
      }}
    >
      <tr>
        <th>
          <div className="error-table-th">
            <small>Time stamp</small>
            <img
              src={filterIcon}
              alt="icon"
              style={{ height: "25px", width: "25px" }}
            />
          </div>
        </th>
        <th>
          <div className="error-table-th" style={{ paddingLeft: "1vw" }}>
            <small>Log Type</small>
            <img
              src={filterIcon}
              alt="icon"
              style={{ height: "25px", width: "25px" }}
            />
          </div>
        </th>
        <th>
          <div className="error-table-th" style={{ paddingLeft: "2vw" }}>
            <small>User</small>
            <img
              src={filterIcon}
              alt="icon"
              style={{ height: "25px", width: "25px" }}
            />
          </div>
        </th>
        <th>
          <div className="error-table-th" style={{ paddingLeft: "2vw" }}>
            <small>Strategy</small>
            <img
              src={filterIcon}
              alt="icon"
              style={{ height: "25px", width: "25px" }}
            />
          </div>
        </th>
        <th>
          <div className="error-table-th" style={{ paddingLeft: "3vw" }}>
            <small>Portfolio</small>
            <img
              src={filterIcon}
              alt="icon"
              style={{ height: "25px", width: "25px" }}
            />
          </div>
        </th>
        <th style={{ width: "40%", borderRight: "none" }}>
          <div className="error-table-th" style={{ paddingLeft: "6vw" }}>
            <small>Message</small>
            <img
              src={filterIcon}
              alt="icon"
              style={{ height: "25px", width: "25px" }}
            />
          </div>
        </th>
      </tr>
    </thead>
  );
});

const Console = memo(({ }) => {
  const [ msgList, setmsgList ] = useState([]);

  const messages = useSelector((state) => state.consoleMsgsReducer.consoleMsgs);

  let reversedMessages = [ ...messages ].reverse(); // Create a copy of the array and reverse it

  const { height: errorContainerHeight } = useSelector(
    (state) => state.collapseReducer,
  );

  useEffect(() => {
    const parentElement = document.getElementById("error-container");
    if (parentElement) {
      // console.log("first",errorContainerHeight)
      const count = Math.floor((errorContainerHeight - 40 - 35) / 25);

      // setParentHeight(height);

      if (reversedMessages.length === 0) {
        parentElement.style.overflow = "hidden";
      }
      if (reversedMessages.length <= count) {
        const emptyRows = new Array(count - reversedMessages.length).fill({});
        if (emptyRows.length > 0) {
          parentElement.style.overflow = "hidden";
        }
        if (Math.floor(reversedMessages.length / 2) > emptyRows.length) {
          parentElement.style.overflow = "scroll";
        }
        reversedMessages = [ ...reversedMessages, ...emptyRows ];
        setmsgList(reversedMessages);
      } else {
        parentElement.style.overflow = "auto";
        setmsgList(reversedMessages);
      }
    }
  }, [ errorContainerHeight, messages ]);
  // console.log(reversedMessages);

  return (
    // <div className="logs-console">
    <table className="error-table">
      <TableHead />
      <tbody>
        <tr style={{ display: "none" }}>
          <td>5.20</td>
          <td>ERROR</td>
          <td></td>
          <td></td>
          <td></td>
          <td colSpan="4">error</td>
        </tr>

        {msgList.map((message, index) => (
          <TableRowTr key={index} message={message} />
        ))}
      </tbody>
    </table>
    // </div>
  );
});
/* eslint-disable react/display-name */
import React, {
  useState,
  useRef,
  memo,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
// Error Container
// import "./ErrorConsole.css";
import "../styles.css";
import allLogs from "../assets/ErrorContainer/allLogs.png";
import attention from "../assets/ErrorContainer/attention.png";
import clearLogs from "../assets/ErrorContainer/clearLogs.png";
import copyAll from "../assets/ErrorContainer/copyAll.png";
import error from "../assets/ErrorContainer/error.png";
import exportErrorImg from "../assets/ErrorContainer/export.png";
import message from "../assets/ErrorContainer/message.png";
import trading from "../assets/ErrorContainer/trading.png";
import warning from "../assets/ErrorContainer/warning.png";
import { useDispatch, useSelector } from "react-redux";
import { setCollapse } from "../store/slices/collapse.js";
import { setConsoleMsgs } from "../store/slices/consoleMsg";

// ---
import filterIcon from "../assets/newFilter.png";
import filterUp from "../assets/newFilter2.png";
import { IoIosPeople } from "react-icons/io";
import { FaFileAlt } from "react-icons/fa";

import Modal from "react-modal";

export const ErrorContainer = forwardRef(({ msgs, }, ref) => {
  const dispatch = useDispatch();
  const { collapsed, height } = useSelector((state) => state.collapseReducer);
  const containerRef = useRef(null);
  // const [tabHeight, setTabHeight] = useState("70vh");

  const [ resizing, setResizing ] = useState(false);
  const [ startY, setStartY ] = useState(0);
  const [ startHeight, setStartHeight ] = useState(0);

  const messages = useSelector((state) => state.consoleMsgsReducer.consoleMsgs);
  useEffect(() => {
    containerRef.current.style.height = collapsed ? "75px" : `${height}px`;
    containerRef.current.style.overflow =
      messages.length > 9 ? "auto" : "hidden";
  }, []);

  useImperativeHandle(ref, () => ({
    getCollapsed() {
      return collapsed;
    },
    toggleCollapse() {
      const errorContainerHeight = collapsed ? "310px" : "75px";
      const errorContainerOverflow = collapsed ? "hidden" : "hidden";
      // setTabHeight(tabHeight);
      document.querySelector(".error-container").style.height =
        errorContainerHeight;
      document.querySelector(".error-container").style.overflow =
        errorContainerOverflow;
      dispatch(
        setCollapse({
          height: collapsed ? 310 : 75,
          collapsed: !collapsed,
        }),
      );
      // return !collapsed
    },
  }));

  const handleMouseDown = (e) => {
    setResizing(true);
    setStartY(e.clientY);
    setStartHeight(containerRef.current.offsetHeight);
  };

  const handleMouseMove = (e) => {
    if (resizing) {
      const newHeight = startHeight - (e.clientY - startY);
      if (newHeight < 80) {
        dispatch(
          setCollapse({
            height: newHeight < 75 ? 75 : newHeight,
            collapsed: true,
          }),
        );
        // containerRef.current.style.overflow = 'hidden'
      }
      if (newHeight > 80) {
        dispatch(
          setCollapse({
            height: newHeight,
            collapsed: false,
          }),
        );
      }
      if (newHeight > 73 && newHeight < 350) {
        containerRef.current.style.height = `${newHeight}px`;
      }
    }
  };

  const handleMouseUp = () => {
    setResizing(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [ handleMouseMove, resizing ]);

  return (
    <div className="error-container" id="error-container" ref={containerRef}>
      <div style={{ position: "sticky", top: "0px", zIndex: "5" }}>
        <div
          id="draggable"
          style={{
            cursor: "row-resize",
            background: "#d8e1ff",
            width: "100%",
            height: "8px",
            borderRadius: "10px",
            position: "absolute",
            top: "-5px",
            userSelect: "none",
          }}
          onMouseDown={handleMouseDown}
        ></div>
        <div className="buttons-container" style={{ paddingRight: "0" }}>
          <div style={{ paddingLeft: "15px" }}>
            <img src={allLogs} alt="" />
            <span>All Logs</span>
          </div>
          <div style={{ marginLeft: "-15%", paddingRight: "20px" }}>
            <img src={attention} alt="" />
            <span>0 Attention</span>
          </div>
          <div style={{ marginLeft: "-15%", paddingRight: "20px" }}>
            <img src={error} alt="" />
            <span>0 Errors</span>
          </div>
          <div style={{ marginLeft: "-15%", paddingRight: "20px" }}>
            <img src={warning} alt="" />
            <span>0 Warnings</span>
          </div>
          <div style={{ marginLeft: "-15%", paddingRight: "20px" }}>
            <img src={message} alt="" />
            <span>0 Messages</span>
          </div>
          <div style={{ marginLeft: "-15%", paddingRight: "30px" }}>
            <img src={trading} alt="" />
            <span>0 Trading</span>
          </div>
          <div
            onClick={() => {
              dispatch(
                setConsoleMsgs({
                  consoleMsgs: [],
                }),
              );
            }}
            style={{ marginLeft: "-15%", paddingRight: "20px" }}
          >
            <img src={clearLogs} alt="" />
            <span>Clear Logs</span>
          </div>
          <div style={{ marginLeft: "-15%", paddingRight: "20px" }}>
            <img src={copyAll} alt="" />
            <span>Copy All</span>
          </div>
          <div
            style={{
              borderRight: "none",
              marginLeft: "-15%",
              paddingRight: "23px",
            }}
          >
            <img src={exportErrorImg} alt="" />
            <span>Export</span>
          </div>
        </div>
      </div>
      <Console messages={msgs} />
    </div>
  );
});

const TableRowTr = memo(({ message }) => {
  return (
    <tr>
      <td>{message.timestamp}</td>
      <td>{message.logType}</td>
      <td>{message.user}</td>
      <td>{message.strategy}</td>
      <td>{message.portfolio}</td>
      <td style={{ borderRight: "none" }}>{message.msg}</td>
    </tr>
  );
});

const TableHead = memo(() => {
  return (
    <thead
      style={{
        position: "sticky",
        top: "40px",
      }}
    >
      <tr>
        <th>
          <div className="error-table-th">
            <small>Time stamp</small>
            <img
              src={filterIcon}
              alt="icon"
              style={{ height: "25px", width: "25px" }}
            />
          </div>
        </th>
        <th>
          <div className="error-table-th" style={{ paddingLeft: "1vw" }}>
            <small>Log Type</small>
            <img
              src={filterIcon}
              alt="icon"
              style={{ height: "25px", width: "25px" }}
            />
          </div>
        </th>
        <th>
          <div className="error-table-th" style={{ paddingLeft: "2vw" }}>
            <small>User</small>
            <img
              src={filterIcon}
              alt="icon"
              style={{ height: "25px", width: "25px" }}
            />
          </div>
        </th>
        <th>
          <div className="error-table-th" style={{ paddingLeft: "2vw" }}>
            <small>Strategy</small>
            <img
              src={filterIcon}
              alt="icon"
              style={{ height: "25px", width: "25px" }}
            />
          </div>
        </th>
        <th>
          <div className="error-table-th" style={{ paddingLeft: "3vw" }}>
            <small>Portfolio</small>
            <img
              src={filterIcon}
              alt="icon"
              style={{ height: "25px", width: "25px" }}
            />
          </div>
        </th>
        <th style={{ width: "40%", borderRight: "none" }}>
          <div className="error-table-th" style={{ paddingLeft: "6vw" }}>
            <small>Message</small>
            <img
              src={filterIcon}
              alt="icon"
              style={{ height: "25px", width: "25px" }}
            />
          </div>
        </th>
      </tr>
    </thead>
  );
});

const Console = memo(({ }) => {
  const [ msgList, setmsgList ] = useState([]);

  const messages = useSelector((state) => state.consoleMsgsReducer.consoleMsgs);

  let reversedMessages = [ ...messages ].reverse(); // Create a copy of the array and reverse it

  const { height: errorContainerHeight } = useSelector(
    (state) => state.collapseReducer,
  );

  useEffect(() => {
    const parentElement = document.getElementById("error-container");
    if (parentElement) {
      // console.log("first",errorContainerHeight)
      const count = Math.floor((errorContainerHeight - 40 - 35) / 25);

      // setParentHeight(height);

      if (reversedMessages.length === 0) {
        parentElement.style.overflow = "hidden";
      }
      if (reversedMessages.length <= count) {
        const emptyRows = new Array(count - reversedMessages.length).fill({});
        if (emptyRows.length > 0) {
          parentElement.style.overflow = "hidden";
        }
        if (Math.floor(reversedMessages.length / 2) > emptyRows.length) {
          parentElement.style.overflow = "scroll";
        }
        reversedMessages = [ ...reversedMessages, ...emptyRows ];
        setmsgList(reversedMessages);
      } else {
        parentElement.style.overflow = "auto";
        setmsgList(reversedMessages);
      }
    }
  }, [ errorContainerHeight, messages ]);
  // console.log(reversedMessages);

  return (
    // <div className="logs-console">
    <table className="error-table">
      <TableHead />
      <tbody>
        <tr style={{ display: "none" }}>
          <td>5.20</td>
          <td>ERROR</td>
          <td></td>
          <td></td>
          <td></td>
          <td colSpan="4">error</td>
        </tr>

        {msgList.map((message, index) => (
          <TableRowTr key={index} message={message} />
        ))}
      </tbody>
    </table>
    // </div>
  );
});
