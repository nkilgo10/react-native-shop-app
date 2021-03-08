import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Platform,
  Button,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/CustomHeaderButton";

import { useDispatch, useSelector } from "react-redux";
import ProductItem from "../../components/ProductItem";

import Colors from "../../constants/Colors";
import * as cartActions from "../../store/actions/cartActions";
import { fetchProducts } from "../../store/actions/productActions";

const ProductsOverviewScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const products = useSelector((state) => state.products.availableProducts);
  const dispatch = useDispatch();

  //Load products from server
  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);

    try {
      await dispatch(fetchProducts());
    } catch (err) {
      setError(err.message);
    }

    setIsRefreshing(false);
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  //Re-load products if leave and revist the page to refresh the current products
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadProducts();
    });

    return () => {
      unsubscribe();
    };
  }, [loadProducts]);

  //Event Handler
  const selectItemHandler = (id, title) => {
    navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>An Error Occured!</Text>
        <Button
          title="Try Again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>
          No products found. Maybe start adding some!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          title={itemData.item.title}
          image={itemData.item.image}
          price={Number(itemData.item.price)}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
            color={Colors.primary}
          />
          <Button
            title="Add To Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
            color={Colors.primary}
          />
        </ProductItem>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily:
      Platform.OS === "android"
        ? "sans-serif-condensed"
        : "AmericanTypewriter-CondensedBold",
  },
});

export const screenOptions = (navData) => {
  return {
    headerTitle: "All Products",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        />
      </HeaderButtons>
    ),
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

export default ProductsOverviewScreen;
