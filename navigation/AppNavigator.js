import React from "react";
import { useSelector } from "react-redux";
import { AuthNavigator, ShopNavigator } from "./ShopNavigator";
import { NavigationContainer } from "@react-navigation/native";
import StartUpScreen from "../screens/StartUpScreen";

const AppNavigator = () => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

  return (
    <NavigationContainer>
      {isAuth && <ShopNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <StartUpScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
