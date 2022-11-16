/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../pages/api/index";
import { sendToken } from "../../pages/api/web3/Web3";

interface Location {
  lat: number;
  lng: number;
}

interface Dog {
  birthday: string;
  dogBreed: string;
  dogCharacter: string;
  dogImg: string;
  dogName: string;
  hide: boolean;
  pk: number;
  transactionHash: string;
}

interface WalkState {
  loading: boolean;
  success: boolean;
  error: any;
  isWalkingStarted: boolean;
  selectedDogs: any[];
  totalDist: string;
  isPaused: boolean;
  personId: string;
  center: {
    lat: number;
    lng: number;
  };
  paths: Location[];
  time: number;
  others: any[];
  dogState: number;
  myDogs: Dog[];
  coin: number;
}

const initialState: WalkState = {
  loading: false,
  success: false,
  error: null,
  isWalkingStarted: false,
  selectedDogs: [],
  totalDist: "0.00",
  isPaused: false,
  personId: "",
  center: {
    lat: 0,
    lng: 0
  },
  paths: [],
  time: 0,
  others: [],
  dogState: 0,
  myDogs: [],
  coin: 0
}; // 초기 상태 정의

export const startWalkingApi = async (data: any) => {
  const res = await axios.post("/walk", data);
  return res.data;
};

export const nowWalkingApi = async (data: any) => {
  const res = await axios.post("/walk/walking", data);
  return res.data;
};

type Any = any;

export const finishWalkingApi = createAsyncThunk<Any>(
  // Types for ThunkAPI
  "walk/finishWalking",
  async (_, { getState }) => {
    const state: any = getState();
    try {
      const res = await axios.post("/walk/end", {
        // coin: state.walk.coin,
        coin: 100,
        distance: +state.walk.totalDist,
        walkPath: state.walk.paths,
        time: state.walk.time
      });
      if (res.status === 200) {
        if (state.walk.coin !== 0) {
          sendToken(state.user.userInfo.userWalletAddress, state.walk.coin);
        }
      }
      return res.data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const getMyDogs = async () => {
  const res = await axios.get("/dog");
  return res.data;
};

export const getOtherDogs = async (data: any[]) => {
  const res = await axios.post("/dog/list", data);
  return res.data;
};

export const getFeeds = async () => {
  const res = await axios.get("/feed");
  return res.data;
};

const walkSlice = createSlice({
  name: "walk",
  initialState,
  reducers: {
    startWalking: (state, { payload }) => {
      state.isWalkingStarted = true;
      state.personId = payload;
    },
    finishWalking: (state) => {
      state.isWalkingStarted = false;
    },
    toggleSelectedDogs: (state, { payload }) => {
      if (state.selectedDogs.find((dog) => dog.id === payload.id)) {
        state.selectedDogs = state.selectedDogs.filter(
          (dog) => dog.id !== payload.id
        );
      } else {
        state.selectedDogs.push(payload);
      }
    },
    pushPaths: (state, { payload }) => {
      if (state.paths.length > 1) {
        const lastPosition = state.paths[state.paths.length - 1];
        if (
          lastPosition.lat === payload.lat &&
          lastPosition.lng === payload.lng
        )
          return;
      }
      state.paths.push(payload);
    },
    saveDistance: (state, { payload }) => {
      let tmp = +state.totalDist + payload;
      tmp = parseFloat(tmp.toString()).toFixed(2);
      tmp = parseFloat(tmp).toFixed(2);
      state.totalDist = tmp;
    },
    restartWalking: (state) => {
      state.isPaused = false;
    },
    pauseWalking: (state) => {
      state.isPaused = true;
    },
    saveTime: (state, { payload }) => {
      state.time = payload;
    },
    toggleDogState: (state, { payload }) => {
      state.dogState = payload;
    },
    setMyDogs: (state, { payload }) => {
      state.myDogs = payload;
    },
    saveCoin: (state, { payload }) => {
      state.coin = payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(finishWalkingApi.fulfilled, (state) => {
      state.isWalkingStarted = false;
      state.selectedDogs = [];
      state.totalDist = "0.00";
      state.isPaused = false;
      state.personId = "";
      state.center = {
        lat: 0,
        lng: 0
      };
      state.paths = [];
      state.time = 0;
      state.others = [];
      state.dogState = 0;
      state.coin = 0;
    });
  }
});

export const {
  startWalking,
  finishWalking,
  toggleSelectedDogs,
  pushPaths,
  saveDistance,
  pauseWalking,
  restartWalking,
  // resetWalking,
  saveTime,
  toggleDogState,
  setMyDogs,
  saveCoin
} = walkSlice.actions; // 액션 생성함수
export default walkSlice.reducer; // 리듀서
