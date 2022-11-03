/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

interface WalkState {
  loading: boolean;
  success: boolean;
  error: any;
  lat: number;
  lon: number;
  isWalkingStarted: boolean;
  others: any[];
  selectedDogs: any[];
  start: number;
  end: number;
  path: any[];
  totalDist: number;
}

interface Location {
  lat: number;
  lng: number;
}

type Any = any;

const initialState: WalkState = {
  loading: false,
  success: false,
  error: null,
  lat: 33.450701,
  lon: 126.570667,
  isWalkingStarted: false,
  others: [],
  selectedDogs: [],
  start: Date.now(),
  end: Date.now(),
  path: [],
  totalDist: 0
}; // 초기 상태 정의

export const startWalking = createAsyncThunk<
  // Return type of the payload creator
  Any,
  // First argument to the payload creator
  Location
  // Types for ThunkAPI
>("walk/startWalking", async () => {
  try {
    // const res = await fetch(`/walk/${location}`);
    // if (res.status === 400) {
    //   // Return the known error for future handling
    //   return (await res.json()) as MyKnownError;
    // }
    // return (await res.json()) as any;
  } catch (error) {
    console.error(error);
  }
});

export const nowWalking = createAsyncThunk<Any, Location>(
  // Types for ThunkAPI
  "walk/nowWalking",
  async (center) => {
    try {
      console.log(center);
      // const res = await fetch(`/walk/now`);
      // if (res.status === 400) {
      //   return (await res.json()) as MyKnownError;
      // }
      // return (await res.json()) as any;
    } catch (error) {
      console.error(error);
    }
  }
);

export const finishWalking = createAsyncThunk<Any, number>(
  // Types for ThunkAPI
  "walk/finishWalking",
  async (totalDist) => {
    try {
      console.log(totalDist);
      // const res = await fetch(`/walk/stop`);
      // if (res.status === 400) {
      //   return (await res.json()) as MyKnownError;
      // }
      // return (await res.json()) as any;
    } catch (error) {
      console.error(error);
    }
  }
);

const walkSlice = createSlice({
  name: "walk",
  initialState,
  reducers: {
    setCurLocation: (state, { payload }) => {
      state.lat = payload.lat;
      state.lon = payload.lon;
    },
    toggleSelectedDogs: (state, { payload }) => {
      console.log(state.selectedDogs);
      if (state.selectedDogs.find((dog) => dog.id === payload.id)) {
        state.selectedDogs = state.selectedDogs.filter(
          (dog) => dog.id !== payload.id
        );
      } else {
        state.selectedDogs.push(payload);
      }
    },
    clearSelectedDogs: (state) => {
      state.selectedDogs = [];
    },
    pushPath: (state, { payload }) => {
      state.path.push(payload);
    },
    setDistance: (state, { payload }) => {
      state.totalDist = payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(startWalking.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(startWalking.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.isWalkingStarted = true;
      state.start = Date.now();
    });
    builder.addCase(startWalking.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });

    builder.addCase(nowWalking.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(nowWalking.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      // state.path.push(payload);
    });
    builder.addCase(nowWalking.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });

    builder.addCase(finishWalking.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(finishWalking.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.isWalkingStarted = false;
      state.end = Date.now();
      console.log((state.end - state.start) / 1000, "초 동안 산책했음");
    });
    builder.addCase(finishWalking.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });
  }
});

export const {
  setCurLocation,
  toggleSelectedDogs,
  clearSelectedDogs,
  pushPath,
  setDistance
} = walkSlice.actions; // 액션 생성함수
export default walkSlice.reducer; // 리듀서
