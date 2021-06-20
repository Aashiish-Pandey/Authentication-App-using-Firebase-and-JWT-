import React, { createContext, useState } from "react";

const AuthContext = createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const intialToken = localStorage.getItem("token");
  const [token, setToken] = useState(intialToken);
  const userIsLoggedIn = !!token;

  let logOutTimer;

  const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
    const remainingDuration = adjExpirationTime - currentTime;
    return remainingDuration;
  };

  const retriveStoredToken =()=> {

    const storedToken = localStorage.getItem('token')
    const storedExpirationDate = localStorage.getItem('expirationTime')
    const remainingTime = calculateRemainingTime(storedExpirationDate)
    if(remainingTime<36000) {

        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')

        return null;
    }

    return {

        token:storedToken,
        duration: remainingTime
    }
  }
  const logOutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");

    if (logOutTimer) {
      clearTimeout(logOutTimer);
    }
  };
  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem('expirationTime',expirationTime)
    const remaingTime = calculateRemainingTime(expirationTime);

    logOutTimer = setTimeout(logOutHandler, remaingTime);
  };
  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logOutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
