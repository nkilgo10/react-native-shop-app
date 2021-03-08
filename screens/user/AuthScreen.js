import React, { useReducer, useCallback, useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Colors from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { login, signUp } from "../../store/actions/authActions";
import { beginAsyncEvent } from "react-native/Libraries/Performance/Systrace";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const AuthScreen = ({ navigation }) => {
  //Hooks
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert("Error Occured", error, [{ text: "OK" }]);
    }
  }, [error]);

  //Form Handling Logic
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  const authHandler = async () => {
    let action;
    if (isSignUp) {
      action = signUp(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }

    setIsLoading(true);
    setError(null);

    try {
      await dispatch(action);
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior="padding"
      keyboardVerticalOffset={50}
    >
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address!"
              onInputChange={inputChangeHandler}
              initialValue=""
            />

            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              minLength={5}
              required
              autoCapitalize="none"
              errorText="Please enter a valid password!"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.buttons}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title={isSignUp ? "Sign Up" : "Login"}
                  color={Colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
            <View style={styles.buttons}>
              <Button
                title={`Switch to ${isSignUp ? "Login" : "Sign Up"}`}
                color={Colors.accent}
                onPress={() => {
                  setIsSignUp((prevState) => !prevState);
                }}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export const authScreenOptions = {
  headerTitle: "Authentication",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    marginTop: 10,
    padding: 5,
  },
});

export default AuthScreen;
