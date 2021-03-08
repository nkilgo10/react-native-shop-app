class CartItem {
  constructor(quantity, prodPrice, prodTitle, pushToken, sum) {
    this.quantity = quantity;
    this.prodPrice = prodPrice;
    this.prodTitle = prodTitle;
    this.pushToken = pushToken;
    this.sum = sum;
  }
}

export default CartItem;
