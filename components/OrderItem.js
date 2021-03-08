import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Platform } from "react-native";
import Colors from "../constants/Colors";
import CartItem from "../components/CartItem";
import Card from "./Card";

const OrderItem = ({ amount, date, items }) => {
  const [showDetails, setShowDetails] = useState();
  return (
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.amount}>${amount.toFixed(2)}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Button
        title={showDetails ? "Hide Details" : "Show Details"}
        color={Colors.primary}
        onPress={() => {
          setShowDetails((prevState) => !prevState);
        }}
      />

      {showDetails && (
        <View style={styles.detailItems}>
          {items.map((cartItem) => (
            <CartItem
              key={cartItem.productId}
              quantity={cartItem.quantity}
              amount={cartItem.productPrice}
              title={cartItem.productTitle}
              onRemove={() => {}}
            />
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: "center",
  },
  detailItems: {
    width: "100%",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  amount: {
    fontSize: 16,
    fontFamily:
      Platform.OS === "android"
        ? "sans-serif-condensed"
        : "AmericanTypewriter-CondensedBold",
  },
  date: {
    fontSize: 16,
    color: "#888",
  },
});

export default OrderItem;
