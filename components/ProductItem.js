import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import Card from "./Card";

const ProductItem = ({ image, title, price, onSelect, children }) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <>
      <Card style={styles.product}>
        <View style={styles.touchable}>
          <TouchableCmp onPress={onSelect} useForeground>
            <View>
              <View style={styles.imageContainer}>
                <Image style={styles.imageSource} source={{ uri: image }} />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.price}>${Number(price.toFixed(2))}</Text>
              </View>

              <View style={styles.actions}>{children}</View>
            </View>
          </TouchableCmp>
        </View>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  touchable: {
    overflow: "hidden",
    borderRadius: 10,
  },

  product: {
    height: 300,
    margin: 20,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },

  imageSource: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    height: "17%",
    padding: 10,
  },
  title: {
    fontSize: 18,
    marginVertical: 4,
  },
  price: {
    fontSize: 14,
    color: "#888",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "23%",
    paddingHorizontal: 15,
  },
});

export default ProductItem;
