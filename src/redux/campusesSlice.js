import { createSlice } from "@reduxjs/toolkit";

const campusesSlice = createSlice({
  name: "campuses",
  initialState: [],
  reducers: {
    setCampuses: (state, action) => action.payload,
  },
});

export const { setCampuses } = campusesSlice.actions;
export default campusesSlice.reducer;
