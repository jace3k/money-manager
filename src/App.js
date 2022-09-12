/* eslint-disable no-unused-vars */
import React, { useMemo } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Navigation from "./Navigation";

import { useSelector, useDispatch } from "react-redux";
import {
  setUsers,
  setRecords,
  setMax,
  setUser,
  setInitalBalance,
  setActivities,
  setCleaningSchedule,
} from "./slices/userSlice";

import { db, auth, provider } from "./config/firebase";
import { get, set, ref, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

const App = () => {
  const users = useSelector((state) => state.user.users);
  const records = useSelector((state) => state.user.records);
  const localMaxValue = useSelector((state) => state.user.max);
  const localInitialBalance = useSelector((state) => state.user.initialBalance);
  const localActivities = useSelector((state) => state.user.activities);
  const localCleaningSchedule = useSelector(
    (state) => state.user.cleaningSchedule
  );
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [authStateChanged, setAuthStateChanged] = React.useState(false);
  const [offline, setOffline] = React.useState(false);

  useMemo(() => {
    onAuthStateChanged(
      auth,
      (authUser) => {
        if (authUser) {
          console.log("LOOGEED!", authUser);
          get(ref(db, "users/" + authUser.uid))
            .then((snapshot) => {
              const dbUser = snapshot.val();
              const role = dbUser ? dbUser.role : "standard";
              const {
                accessToken,
                displayName,
                email,
                emailVerified,
                phoneNumber,
                photoURL,
                uid,
              } = authUser;
              dispatch(
                setUser({
                  accessToken,
                  displayName,
                  email,
                  emailVerified,
                  phoneNumber,
                  photoURL,
                  uid,
                  role,
                })
              );
              setAuthStateChanged(true);
              setOffline(false);
            })
            .catch((error) => {
              console.log("error getUser in auth changed", error);
              setOffline(true);
            });
        } else {
          console.log("Logged out");
          dispatch(setUser(null));
          setAuthStateChanged(true);
        }
      },
      (error) => {
        console.log("error onAuthStateChanged", error);
        setOffline(true);
      }
    );
  }, [dispatch]);

  onValue(ref(db, "users"), (snapshot) => {
    const dbUsers = snapshot.val();

    if (dbUsers && Object.keys(dbUsers).length !== Object.keys(users).length) {
      dispatch(setUsers(dbUsers));
    }
  });

  onValue(ref(db, "records"), (snapshot) => {
    const dbData = snapshot.val();

    if (dbData) {
      const dbDataValues = Object.values(dbData);
      if (dbDataValues.length && dbDataValues.length !== records.length) {
        dispatch(setRecords(dbDataValues.reverse()));
      }
    }

    // there was a clean
    if (!dbData && records.length) {
      dispatch(setRecords([]));
    }
  });

  onValue(ref(db, "max"), (snapshot) => {
    const maxValue = snapshot.val();

    // if no max Value in db, setting it at 80
    if (!maxValue) {
      set(ref(db, "max"), 80);
    }

    if (maxValue && maxValue !== localMaxValue) {
      dispatch(setMax(maxValue));
    }
  });

  onValue(ref(db, "initialBalance"), (snapshot) => {
    const initialBalance = snapshot.val();

    if (!initialBalance) {
      set(ref(db, "initialBalance"), 0);
    }

    if (initialBalance && initialBalance !== localInitialBalance) {
      dispatch(setInitalBalance(initialBalance));
    }
  });

  onValue(ref(db, "activities"), (snapshot) => {
    const activities = snapshot.val();

    if (!activities) {
      console.log("NO [ACTIVITIES] DEFINED IN DB!");
    }

    if (
      activities &&
      Object.keys(activities).length !== Object.keys(localActivities).length
    ) {
      dispatch(setActivities(activities));
    }
  });

  onValue(ref(db, "cleaning"), (snapshot) => {
    const cleaningSchedule = snapshot.val();

    if (!cleaningSchedule) {
      console.log("NO [CLEANING SCHEDULE] CREATED!");
    }

    if (
      cleaningSchedule &&
      Object.keys(cleaningSchedule).length !==
      Object.keys(localCleaningSchedule).length
    ) {
      dispatch(setCleaningSchedule(cleaningSchedule));
    }
  });

  const appRouter = (
    <>
      <Navigation
        user={user}
        auth={auth}
        provider={provider}
        db={db}
        authStateChanged={authStateChanged}
      />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );

  if (offline) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Jesteś offline!</h1>
        <p>Odśwież aplikację gdy odzyskasz internet</p>
      </div>
    );
  }

  return appRouter;
};

export default App;
