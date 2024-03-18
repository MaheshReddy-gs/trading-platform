import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userProfSeq: [
    "Client Id",
    "Action",
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
    "Qty on Max Loss Per Trade",
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
    "Req",
    "Commodity Margin",
    "API User Details",
    "Utilized Margin",
  ],
  strategiesSeq: [
    "Action",
    "Manual Square Off",
    "Strategy Label",
    "P L",
    "Trade Size",
    "Duplicate Signal Prevention",
    "Open Time",
    "Close Time",
    "Sq Off Time",
    "Trading Account",
    "Max Profit",
    "Max Loss",
    "Max Loss Wait Time",
    "Profit Locking",
    "Delay Between Users",
    "Unique ID Req for Order",
    "Cancel Previous Open Signal",
    "Stop Reverse",
    "Part Multi Exists",
    "Hold Sell Seconds",
    "Allowed Trades",
    "Entry Order Retry",
    "Entry Retry Count",
    "Entry Retry Wait Seconds",
    "Exit Order Retry",
    "Exit Retry Count",
    "Exit Retry Wait Seconds",
    "Exit Max Wait Seconds",
    "Sq Off Done",
    "Delta",
    "Theta",
    "Vega",
  ],
  portfolioSeq: [
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
  ],
  orderFlowSeq: [
    "Action",
    "Client ID",
    "Stock Symbol",
    "Exchange",
    "Modify",
    "Order Time",
    "Trade ID",
    "Transaction",
    "Avg Execution Price",
    "Order Size",
    "Execution Quantity",
    "Trade Type",
    "Price",
    "Trigger Price",
    "Trigger Time",
    "Exchange Trade ID",
    "Instrument",
    "Trade Duration",
    "Trade Status",
    "Display Name",
    "Status Message",
    "Label",
  ],
  positionsSeq: [
    "Action",
    "User ID",
    "Product",
    "Exchange",
    "Symbol",
    "Net Qty",
    "LTP",
    "P&L",
    "P&L%",
    "Buy Qty",
    "Buy Avg Price",
    "Buy Value",
    "Sell Qty",
    "Sell Avg Price",
    "Sell Value",
    "Carry FWD Qty",
    "Realized Profit",
    "Unrealized profit",
    "User Alias",
  ],
  holdingsSeq: [
    "Action",
    "Exchange",
    "Symbol",
    "Avg Price",
    "Buy Value",
    "LTP",
    "Current Value",
    "P&L%",
    "Collateral Qty",
    "T1 Qty",
    "Cns Sell  Quantity",
    "User ID",
    "User Alias",
  ],
  ordermanagementSeq: [
    "Action",
    "User ID",
    "Source Symbol",
    "Request ID",
    "Exchange",
    "Exchange Symbol",
    "LTP",
    "P&L",
    "Product",
    "Entry Order Type",
    "Entry Order ID",
    "Entry Time",
    "Entry Txn",
    "Entry Qty",
    "Entry Filled Qty",
    "Entry Exchange Time",
    "LTP#1",
    "LTP#2",
    "Entry Avg Price",
    "LTP#3",
    "Entry Status",
    "Exit Order ID",
    "Exit Time",
    "Exit Txn",
    "Exit Qty",
    "Exit Filled Qty",
    "LTP#4",
    "Exit Exchange Time",
    "Exit Avg Price",
    "Exit Status",
    "Target",
    "SL",
    "Break Even",
    "Signal Source",
    "Strategy",
    "Signal Status",
    "Order Failed",
    "User Alies",
    "Remarks",
    "Manual Exit",
  ],
};

export const seqSlice = createSlice({
  name: "seq",
  initialState,
  reducers: {
    setAllSeq: (state, action) => {
      state.userProfSeq = action.payload.userProfSeq || [];
      state.strategiesSeq = action.payload.strategiesSeq || [];
      state.portfolioSeq = action.payload.portfolioSeq || [];
      state.orderFlowSeq = action.payload.orderFlowSeq || [];
      state.positionsSeq = action.payload.positionsSeq || [];
      state.holdingsSeq = action.payload.holdingsSeq || [];
      state.ordermanagementSeq = action.payload.ordermanagementSeq || [];
    },
  },
});

export const { setAllSeq } = seqSlice.actions;

export default seqSlice.reducer;
