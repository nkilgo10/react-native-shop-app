import React from "react";
import { View, StyleSheet } from "react-native";

const Card = ({ children, ...props }) => {
  return <View style={{ ...styles.screen, ...props.style }}>{children}</View>;
};

const styles = StyleSheet.create({
  screen: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
});
export default Card;
