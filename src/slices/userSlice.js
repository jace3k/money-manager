import { createSlice } from "@reduxjs/toolkit";
import { ref, set, get, remove, update } from "firebase/database";
import {
  /*GoogleAuthProvider,*/ signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, provider, db } from "../config/firebase";

const initialState = {
  users: [],
  records: [],
  max: 100,
  user: null,
  loginLoading: false,
  balance: 0,
  initialBalance: 0,
  activities: {},
  cleaningSchedule: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setRecords: (state, action) => {
      state.records = action.payload;
    },
    setMax: (state, action) => {
      state.max = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoginLoading: (state, action) => {
      state.loginLoading = action.payload;
    },
    setAccountBalance: (state, action) => {
      state.balance = action.payload;
    },
    setInitalBalance: (state, action) => {
      state.initialBalance = action.payload;
    },
    setActivities: (state, action) => {
      state.activities = action.payload;
    },
    setCleaningSchedule: (state, action) => {
      state.cleaningSchedule = action.payload;
    },
  },
});

export const {
  setUsers,
  setRecords,
  setMax,
  setUser,
  setLoginLoading,
  setAccountBalance,
  setInitalBalance,
  setActivities,
  setCleaningSchedule,
} = userSlice.actions;

export const loginAsync = () => (dispatch) => {
  dispatch(setLoginLoading(true));
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      get(ref(db, "users/" + user.uid)).then((snapshot) => {
        const existingUser = snapshot.val();

        if (!existingUser) {
          console.log("Creating new user!", user.displayName);
          // uncomment to enable saving new users in db.
          // const newUser = {
          //   id: user.uid,
          //   email: user.email,
          //   displayName: user.displayName,
          //   role: "standard",
          //   createdAt: new Date().getTime(),
          // };
          // set(ref(db, 'users/' + user.uid), newUser);
        }
      });

      dispatch(setLoginLoading(false));
    })
    .catch((error) => {
      console.log("Error when login.", error);
      dispatch(setLoginLoading(false));
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
    });
};

export const logoutAsync = () => () => {
  signOut(auth).then((value) => {
    console.log("logged out!", value);
  });
};

export const createNewRecordAsync = (newRecord) => () => {
  set(ref(db, "records/" + newRecord.timestamp), newRecord);
};

export const removeRecordAsync = (timestamp) => () => {
  remove(ref(db, "records/" + timestamp));
};

export const addUser = (user) => () => {
  set(ref(db, "users/" + user.id), user);
};

export const updateUser = (user) => () => {
  update(ref(db, "users/" + user.id), user);
};

export const addNextCleaningRecord = (firstDay, record) => () => {
  update(ref(db, `cleaning/${firstDay}`), record);
};

export default userSlice.reducer;
