import Product from "../../models/product";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

//Actions
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

//Action Creators
export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    try {
      const response = await fetch(
        "https://react-native-shop-d080a-default-rtdb.firebaseio.com/products.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedProducts = [];

      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].ownerPushToken,
            resData[key].title,
            resData[key].image,
            resData[key].description,
            resData[key].price
          )
        );
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter((prod) => prod.ownerId === userId),
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(
      `https://react-native-shop-d080a-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export const createProduct = (title, description, image, price) => {
  return async (dispatch, getState) => {
    //Check permission status of notifications and if granted send pushToken to the server
    let pushToken;

    let permissions = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (permissions.status !== "granted") {
      permissions.status = await Permissions.askAsync(
        Permissions.NOTIFICATIONS
      );
    } else {
      pushToken = (await Notifications.getExpoPushTokenAsync()).data;
    }

    //Getting the auth token and userId from the redux state and sending it to the Firebase backend
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    const response = await fetch(
      `https://react-native-shop-d080a-default-rtdb.firebaseio.com/products.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          image,
          price,
          ownerId: userId,
          ownerPushToken: pushToken,
        }),
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,
        image,
        price,
        ownerId: userId,
        pushToken: pushToken,
      },
    });
  };
};

export const updateProduct = (id, title, description, image) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(
      `https://react-native-shop-d080a-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          image,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        image,
      },
    });
  };
};
