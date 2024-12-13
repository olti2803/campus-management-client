import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk for fetching all campuses
export const fetchCampuses = createAsyncThunk(
  "campuses/fetchCampuses",
  async () => {
    const response = await axios.get("http://localhost:3001/api/campuses");
    return response.data;
  }
);

// Thunk for fetching a single campus by ID
export const fetchSingleCampus = createAsyncThunk(
  "campuses/fetchSingleCampus",
  async (id) => {
    const response = await axios.get(
      `http://localhost:3001/api/campuses/${id}`
    );
    return response.data;
  }
);

// Thunk for deleting a campus
export const deleteCampus = createAsyncThunk(
  "campuses/deleteCampus",
  async (id) => {
    await axios.delete(`http://localhost:3001/api/campuses/${id}`);
    return id; // Return the deleted campus ID to update the state
  }
);

// Thunk for adding a student to a campus
export const addStudentToCampus = createAsyncThunk(
  "campuses/addStudentToCampus",
  async (studentData) => {
    const response = await axios.put(
      `http://localhost:3001/api/students/${studentData.id}`,
      { campusId: studentData.campusId }
    );
    return response.data; // Return the updated student
  }
);

// Thunk for removing a student from a campus
export const removeStudentFromCampus = createAsyncThunk(
  "campuses/removeStudentFromCampus",
  async ({ studentId }) => {
    await axios.put(`http://localhost:3001/api/students/${studentId}`, {
      campusId: null,
    });
    return studentId; // Return the removed student's ID
  }
);

const campusesSlice = createSlice({
  name: "campuses",
  initialState: {
    items: [],
    singleCampus: null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampuses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCampuses.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCampuses.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchSingleCampus.fulfilled, (state, action) => {
        state.singleCampus = action.payload; // Set the single campus data
      })
      .addCase(deleteCampus.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (campus) => campus.id !== action.payload
        );
      })
      .addCase(addStudentToCampus.fulfilled, (state, action) => {
        if (state.singleCampus && state.singleCampus.Students) {
          state.singleCampus.Students.push(action.payload); // Add student to current campus
        }
      })
      .addCase(removeStudentFromCampus.fulfilled, (state, action) => {
        if (state.singleCampus && state.singleCampus.Students) {
          state.singleCampus.Students = state.singleCampus.Students.filter(
            (student) => student.id !== action.payload
          );
        }
      });
  },
});

// Selectors for state management
export const selectCampus = (state) => state.campuses.singleCampus;
export const selectCampusStudents = (state) =>
  state.campuses.singleCampus?.Students || [];

export default campusesSlice.reducer;
