import React, { useRef } from "react";
import "../views/F&O/AddPortfolio.css";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function Timepic() {
  const [Start_hour, setstarth] = React.useState("00");
  const [Start_min, setStartm] = React.useState("00");
  const [Start_sec, setStarts] = React.useState("00");
  const [temp, setTemp] = React.useState();

  const newRef = useRef(null);

  const increment = (data) => {
    if (data === "hour") {
      // Increment hours
      setstarth((prevHour) => {
        let newHour = parseInt(prevHour) + 1;
        if (newHour > 23) {
          newHour = 0;
        }
        return ("0" + newHour).slice(-2);
      });
    } else if (data === "min") {
      // Increment minutes
      setStartm((prevMin) => {
        let newMin = parseInt(prevMin) + 1;
        if (newMin > 59) {
          newMin = 0;
          // If minutes reach 60, increment hours
          setstarth((prevHour) => {
            let newHour = parseInt(prevHour) + 1;
            if (newHour > 23) {
              newHour = 0;
            }
            return ("0" + newHour).slice(-2);
          });
        }
        return ("0" + newMin).slice(-2);
      });
    } else if (data === "sec") {
      // Increment seconds
      setStarts((prevSec) => {
        let newSec = parseInt(prevSec) + 1;
        if (newSec > 59) {
          newSec = 0;
          // If seconds reach 60, increment minutes
          setStartm((prevMin) => {
            let newMin = parseInt(prevMin) + 1;
            if (newMin > 59) {
              newMin = 0;
              // If minutes reach 60, increment hours
              setstarth((prevHour) => {
                let newHour = parseInt(prevHour) + 1;
                if (newHour > 23) {
                  newHour = 0;
                }
                return ("0" + newHour).slice(-2);
              });
            }
            return ("0" + newMin).slice(-2);
          });
        }
        return ("0" + newSec).slice(-2);
      });
    }
  };

  const decrement = (data) => {
    if (data === "hour") {
      setstarth((prevHour) => {
        let newHour = parseInt(prevHour) - 1;
        if (newHour < 0) {
          newHour = 23;
        }
        return ("0" + newHour).slice(-2);
      });
    } else if (data === "min") {
      setStartm((prevMin) => {
        let newMin = parseInt(prevMin) - 1;
        if (newMin < 0) {
          newMin = 59;
          decrement("hour"); // Decrement hour when minute reaches 0
        }
        return ("0" + newMin).slice(-2);
      });
    } else if (data === "sec") {
      setStarts((prevSec) => {
        let newSec = parseInt(prevSec) - 1;
        if (newSec < 0) {
          newSec = 59;
          decrement("min"); // Decrement minute when second reaches 0
        }
        return ("0" + newSec).slice(-2);
      });
    }
  };

  const handleKeyDown = (event, data) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault(); // Prevent the default behavior of the key press
      if (event.key === "ArrowUp") {
        increment(data); // Call increment function if the up arrow key is pressed
      } else if (event.key === "ArrowDown") {
        decrement(data); // Call decrement function if the down arrow key is pressed
      }
    }
  };

  const handleInputChange = (event, data) => {
    const value = event.target.value;
    if (data === "hour") {
      if (parseInt(value) >= 0 && parseInt(value) <= 23) {
        setstarth(("0" + value).slice(-2));
      }
    } else if (data === "min") {
      if (parseInt(value) >= 0 && parseInt(value) <= 59) {
        setStartm(("0" + value).slice(-2));
      }
    } else if (data === "sec") {
      if (parseInt(value) >= 0 && parseInt(value) <= 59) {
        setStarts(("0" + value).slice(-2));
      }
    }
  };
  let timeoutUp;
  let timeoutDown;

  const handleMouseDownUp = () => {
    timeoutUp = setTimeout(() => {
      repeat("up");
    }, 500); // Adjust the delay (in milliseconds) as needed
  };

  const handleMouseDownDown = () => {
    timeoutDown = setTimeout(() => {
      repeat("down");
    }, 500); // Adjust the delay (in milliseconds) as needed
  };

  const handleMouseUp = () => {
    clearTimeout(timeoutUp);
    clearTimeout(timeoutDown);
  };

  const repeat = (data) => {
    if (data === "up") {
      increment();
      timeoutUp = setTimeout(() => repeat("up"), 100); // Adjust the repeat interval
    } else if (data === "down") {
      decrement();
      timeoutDown = setTimeout(() => repeat("down"), 100); // Adjust the repeat interval
    }
  };

  return (
    <div>
      <div className="app_box" ref={newRef}>
        <div className="Box-outer">
          <input
            type="number"
            className="clock_field"
            value={Start_hour}
            onChange={(e) => handleInputChange(e, "hour")}
            placeholder="HH"
            onSelect={() => setTemp("hour")}
            onKeyDown={(event) => handleKeyDown(event, "hour")}
          />
          <span className="colen-center">:</span>
          <input
            type="number"
            className="clock_field"
            value={Start_min}
            onChange={(e) => handleInputChange(e, "min")}
            placeholder="MM"
            onSelect={() => setTemp("min")}
            onKeyDown={(event) => handleKeyDown(event, "min")}
          />
          <span className="colen-center">:</span>
          <input
            type="number"
            className="clock_field"
            value={Start_sec}
            onChange={(e) => handleInputChange(e, "sec")}
            placeholder="SS"
            onSelect={() => setTemp("sec")}
            onKeyDown={(event) => handleKeyDown(event, "sec")}
          />
        </div>
        <div className="arrow_button">
          <ArrowDropUpIcon
            className="top_arrow"
            onClick={() => increment(temp)}
            style={{ display: "block" }}
          />
          <ArrowDropDownIcon
            className="down_arrow"
            onClick={() => decrement(temp)}
            style={{ display: "block" }}
          />
        </div>
      </div>
    </div>
  );
}

export default Timepic;
