import React from "react";
import { Provider } from "react-redux";
import { combineReducers, createStore, applyMiddleware } from "redux";
import productReducer from "./store/reducers/productReducer";
import cartReducer from "./store/reducers/cartReducer";
import orderReducer from "./store/reducers/orderReducer";
import authReducer from "./store/reducers/authReducer";

import ReduxThunk from "redux-thunk";
import AppNavigator from "./navigation/AppNavigator";

import * as Notifications from "expo-notifications";

//Set how local notifications are handled
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  const rootReducer = combineReducers({
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    auth: authReducer,
  });

  const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
