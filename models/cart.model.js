class Cart {
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    this.items = items;
    this.totalPrice = totalPrice;
    this.totalQuantity = totalQuantity;
  }

  addItem(product) {
    const cartItem = {
      product: product,
      quantity: 1,
      totalPrice: product.price,
    };

    this.totalQuantity++;
    this.totalPrice += product.price;

    for (let i = 0; i < this.items.length; ++i) {
      const item = this.items[i];
      if (item.product.id === product.id) {
        cartItem.quantity = item.quantity + 1;
        cartItem.totalPrice = item.totalPrice + product.price;
        this.items[i] = cartItem;
        return;
      }
    }
    this.items.push(cartItem);
  }

  updateItem(productId, newQuantity) {
    for (let i = 0; i < this.items.length; ++i) {
      const item = this.items[i];
      if (item.product.id === productId && newQuantity > 0) {
        const cartItem = { ...item };
        cartItem.totalPrice =
          newQuantity * (cartItem.totalPrice / cartItem.quantity);
        cartItem.quantity = newQuantity;

        this.totalQuantity += newQuantity - item.quantity;
        this.totalPrice += cartItem.totalPrice - item.totalPrice;
        this.items[i] = cartItem;
        return {updatedItemPrice: cartItem.totalPrice};
      } else if (item.product.id === productId && newQuantity <= 0) {
        this.totalQuantity -= item.quantity;
        this.totalPrice -= item.totalPrice;
        this.items.splice(i, 1);
        return {updatedItemPrice: 0};
      }
    }
  }
}

module.exports = Cart;
