import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Colors from "../../constants/Colors";
import CartItem from "../../components/CartItem";
import { removeFromCart } from "../../store/actions/cartActions";
import { addOrder } from "../../store/actions/orderActions";
import Card from "../../components/Card";

const CartScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].prodTitle,
        productPrice: state.cart.items[key].prodPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
        productPushToken: state.cart.items[key].pushToken,
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });

  const sendOrderHandler = async () => {
    setIsLoading(true);
    await dispatch(addOrder(cartItems, cartTotalAmount));
    setIsLoading(false);
    navigation.navigate("Orders");
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.accent} />
        ) : (
          <Button
            title="Order Now"
            onPress={sendOrderHandler}
            color={Colors.primary}
            disabled={cartItems.length === 0}
          />
        )}
      </Card>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            onRemove={() => {
              dispatch(removeFromCart(itemData.item.productId));
            }}
            deleteable
          />
        )}
      />
    </View>
  );
};

export const cartScreenOptions = {
  headerTitle: "Your Cart",
};

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
  },
  summaryText: {
    fontSize: 18,
  },
  amount: {
    color: Colors.accent,
  },
});

export default CartScreen;
