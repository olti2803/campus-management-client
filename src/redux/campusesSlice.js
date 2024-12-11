import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk for fetching campuses
export const fetchCampuses = createAsyncThunk(
  "campuses/fetchCampuses",
  async () => {
    const response = await axios.get("http://localhost:3001/api/campuses"); // replaced with api endpoint
    return response.data;
  }
);

const campusesSlice = createSlice({
  name: "campuses",
  initialState: {
    items: [],
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
      });
  },
});

export default campusesSlice.reducer;
