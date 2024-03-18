import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  NIFTY: [],
  BANKNIFTY: [],
  FINNIFTY: [],
};

export const expirySlice = createSlice({
  name: "expiry",
  initialState,
  reducers: {
    setExpiries: (state, action) => {
      state.NIFTY = action.payload.NIFTY || [];
      state.BANKNIFTY = action.payload.BANKNIFTY || [];
      state.FINNIFTY = action.payload.FINNIFTY || [];
    },
  },
});

export const { setExpiries } = expirySlice.actions;

export default expirySlice.reducer;
