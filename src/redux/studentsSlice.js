import { createSlice } from "@reduxjs/toolkit";

const studentsSlice = createSlice({
  name: "students",
  initialState: [],
  reducers: {
    setStudents: (state, action) => action.payload,
  },
});

export const { setStudents } = studentsSlice.actions;
export default studentsSlice.reducer;
