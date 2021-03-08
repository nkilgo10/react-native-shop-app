import React from "react";
import {
  FlatList,
  Platform,
  Button,
  Alert,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/CustomHeaderButton";
import ProductItem from "../../components/ProductItem";
import Colors from "../../constants/Colors";
import { deleteProduct } from "../../store/actions/productActions";

const UserProductsScreen = ({ navigation }) => {
  const user = useSelector((state) => state.products.userProducts);
  const dispatch = useDispatch();

  const editProductHandler = (id) => {
    navigation.navigate("EditProduct", {
      productId: id,
    });
  };

  const deleteHandler = (id) => {
    Alert.alert("Are you sure?", "Do you really want to delete this item?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(deleteProduct(id));
        },
      },
    ]);
  };

  if (user.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>
          No Products Found, Maybe Start Creating Some!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={user}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          title={itemData.item.title}
          image={itemData.item.image}
          price={Number(itemData.item.price)}
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}
        >
          <Button
            title="Edit"
            onPress={() => {
              editProductHandler(itemData.item.id);
            }}
            color={Colors.primary}
          />
          <Button
            title="Delete"
            onPress={deleteHandler.bind(this, itemData.item.id)}
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
    fontSize: 16,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Baskerville-Italic",
  },
});

export const userScreenOptions = (navData) => {
  return {
    headerTitle: "Your Products",
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
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Add"
          iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
          onPress={() => {
            navData.navigation.navigate("EditProduct");
          }}
        />
      </HeaderButtons>
    ),
  };
};

export default UserProductsScreen;
