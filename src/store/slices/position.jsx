import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  positions: [],
};

export const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    setPositions: (state, action) => {
      state.positions = action.payload.positions || [];
    },
  },
});

export const { setPositions } = positionSlice.actions;

export default positionSlice.reducer;
