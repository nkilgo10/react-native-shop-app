import React, { useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import Colors from "../constants/Colors";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import { authenticate, setDidTryLogin } from "../store/actions/authActions";

const StartUpScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      //If no data is available, send user to login/ sign up screen
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        dispatch(setDidTryLogin());
        return;
      }

      //Transforming the data received back to an object then destructing it
      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate } = transformedData;

      const expirationDate = new Date(expiryDate);

      //What happens if the user data is invalid or expired
      if (expirationDate <= new Date() || !token || !userId) {
        dispatch(setDidTryLogin());
        return;
      }

      //Gets the time until the log in token runs out in Milliseconds
      const expirationTime = expirationDate.getTime() - new Date().getTime();
      
      //navigation.navigate("Shop");
      dispatch(authenticate(userId, token, expirationTime));
    };
    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StartUpScreen;
