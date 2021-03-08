import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CartItem = ({ onRemove, quantity, title, amount, deleteable }) => {
  return (
    <View style={styles.cartItem}>
      <View style={styles.itemData}>
        <Text styles={styles.quantity}>{quantity} </Text>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.itemData}>
        <Text style={styles.amount}>${amount.toFixed(2)}</Text>
        {deleteable && (
          <TouchableOpacity onPress={onRemove} style={styles.deletButton}>
            <Ionicons
              name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
              size={23}
              color="red"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    padding: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  itemData: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    fontSize: 16,
    color: "#888",
  },
  title: {
    fontSize: 16,
    fontFamily:
      Platform.OS === "android" ? "" : "AmericanTypewriter-CondensedBold",
  },
  amount: {
    fontSize: 16,
  },
  deletButton: {
    marginLeft: 20,
  },
});
export default CartItem;
