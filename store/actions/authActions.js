import AsyncStorage from "@react-native-community/async-storage";

//Actions
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
export const SET_DID_TRY_LOGIN = "SET_DID_TRY_LOGIN";

let timer;

//Action Creators
export const setDidTryLogin = () => {
  return {
    type: SET_DID_TRY_LOGIN,
  };
};

export const authenticate = (userId, token, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId, token });
  };
};

export const signUp = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBjesmWraFkgr3YWUczJYfSkVxh_1Lt_zw",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    //Error Handling
    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;

      let message = "Something went wrong";

      if (errorId === "EMAIL_EXISTS") {
        message =
          "This email already exists. Please register with a new email.";
      }

      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn)
      ) * 1000
    );

    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToToken(resData.idToken, resData.userId, expirationDate);
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBjesmWraFkgr3YWUczJYfSkVxh_1Lt_zw",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    //Error Handling
    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;

      let message = "Something went wrong";

      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email could not be found. Please try a valid email.";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "Invaild Password.";
      }

      throw new Error(message);
    }
    const resData = await response.json();

    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );

    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToToken(resData.idToken, resData.localId, expirationDate);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

//Helper Functions
const saveDataToToken = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({ token, userId, expiryDate: expirationDate.toISOString() })
  );
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return async (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout);
    }, expirationTime);
  };
};
