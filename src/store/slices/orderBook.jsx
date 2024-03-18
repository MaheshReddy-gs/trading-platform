import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [
    {
      ch: "",
      chp: "",
      clientId: "",
      description: "",
      discloseQty: "",
      disclosedQty: "",
      dqQtyRem: "",
      ex_sym: "",
      exchOrdId: "",
      exchange: "",
      filledQty: "",
      fyToken: "",
      id: "",
      instrument: "",
      limitPrice: "",
      lp: "",
      message: "",
      offlineOrder: "",
      orderDateTime: "",
      orderNumStatus: "",
      orderValidity: "",
      pan: "",
      productType: "",
      qty: "",
      remainingQuantity: "",
      segment: "",
      side: "",
      slNo: "",
      source: "",
      status: "",
      stopPrice: "",
      symbol: "",
      tradedPrice: "",
      type: "",
    },
  ],
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload.orders || [];
    },
  },
});

export const { setOrders } = orderSlice.actions;

export default orderSlice.reducer;
