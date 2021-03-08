class Product {
  constructor(id, ownerId, ownerPushToken, title, image, description, price) {
    this.id = id;
    this.ownerId = ownerId;
    this.pushToken = ownerPushToken;
    this.title = title;
    this.image = image;
    this.description = description;
    this.price = price;
  }
}

export default Product;
