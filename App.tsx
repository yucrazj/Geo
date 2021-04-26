import React, { useEffect, useMemo, useReducer } from "react";
import { Dimensions, StyleSheet } from "react-native";
import LoginPage from "./screens/Login";
import MainPage from "./screens/Main.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "./context/context";

import { User } from './models/Users'

export default function App() {

  const initialLoginState = {
    userName: null,
    userID: null,
  };

  const authActions = (prevState: any, action: any) => {
    switch (action.type) {
      case "RETRIEVE_ID":
        return {
          ...prevState,
          userID: action.id,
        };
      case "LOGIN":
        return {
          ...prevState,
          userName: action.name,
          userID: action.id,
        };
      case "LOGOUT":
        return {
          ...prevState,
          userName: null,
          userID: null,
        };
    }
  };

  useEffect(() => {
    setTimeout(async () => {
      let userID;
      userID = null;
      try {
        userID = await AsyncStorage.getItem("userID");
      } catch (e) {
        console.log("Error", e);
      }
      dispatch({ type: "RETRIEVE_ID", token: userID });
    }, 1000);
  }, []);

  const [loginState, dispatch] = useReducer(
    authActions,
    initialLoginState
  );

  const authContext = useMemo(
    () => ({
      signIn: async (foundUser: User) => {
        const userID = String(foundUser.userID);
        const userName = foundUser.userName;
        try {
          await AsyncStorage.setItem("userID", userID);
        } catch (e) {
          console.log("Error", e);
        }
        dispatch({ type: "LOGIN", id: userName, token: userID });
      },
      signOut: async () => {
        console.log("Cerrar Sesion");
        try {
          await AsyncStorage.clear()
        } catch (e) {
          console.log("Error", e);
        }
        dispatch({ type: "LOGOUT" });
      },
    }),
    []
  );

  return (
    <>
      <AuthContext.Provider value={authContext}>
          {loginState.userID !== null ? (
            <MainPage></MainPage>
          ) : (
            <LoginPage></LoginPage>
          )}
      </AuthContext.Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapsContainer: {
    padding: 30,
  },
  map: {
    width: Dimensions.get("window").width - 20,
    height: Dimensions.get("window").height - 150,
  },
  buttons: {
    flexDirection: "row",
  },
});
