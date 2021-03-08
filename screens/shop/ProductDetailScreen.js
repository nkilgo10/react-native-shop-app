import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/Colors";
import * as cartActions from "../../store/actions/cartActions";

const ProductDetailScreen = ({ route }) => {
  const prodId = route.params.productId;
  const dispatch = useDispatch();

  const selectedProduct = useSelector((state) =>
    state.products.availableProducts.find((prod) => prod.id === prodId)
  );

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.image }} />
      <View style={styles.actions}>
        <Button
          title="Add To Cart"
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProduct));
          }}
          color={Colors.primary}
        />
      </View>

      <Text style={styles.priceSelect}>${selectedProduct.price}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  priceSelect: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20,
  },
  actions: {
    marginVertical: 10,
    alignItems: "center",
  },
});

export const detailScreenOptions = (navData) => {
  return {
    headerTitle: navData.route.params.productTitle,
  };
};

export default ProductDetailScreen;
