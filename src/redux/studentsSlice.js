import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk for fetching students
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async () => {
    const response = await axios.get("http://localhost:3001/api/students");
    return response.data;
  }
);

// Thunk for adding a new student
export const addStudent = createAsyncThunk(
  "students/addStudent",
  async (newStudent) => {
    const response = await axios.post(
      "http://localhost:3001/api/students",
      newStudent
    );
    return response.data;
  }
);

const studentsSlice = createSlice({
  name: "students",
  initialState: {
    items: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchStudents.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.items.push(action.payload); // Add the new student to the state
      });
  },
});

// Selector for unassigned students
export const selectUnassignedStudents = (state) =>
  state.students.items.filter((student) => student.campusId === null);

export default studentsSlice.reducer;
