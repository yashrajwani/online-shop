const Product = require("../models/product.model");

function getCart(req, res) {
  res.render("customer/cart/cart");
}

async function addCartItem(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.body.productId);
  } catch (error) {
    return next(error);
  }

  const cart = res.locals.cart;
  cart.addItem(product);
  req.session.cart = cart;

  // 201 -> add resource action successful
  res.status(201).json({
    message: "Cart Updated Successfully",
    newTotalItems: cart.totalQuantity,
  });
}

function updateCartItem(req, res) {
  const cart = res.locals.cart;
  const {updatedItemPrice} = cart.updateItem(req.body.productId, req.body.quantity);
  req.session.cart = cart;
  res.json({
    message: 'Item Updated',
    updatedCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemPrice,
    }
  })
}

module.exports = {
  addCartItem: addCartItem,
  getCart: getCart,
  updateCartItem: updateCartItem,
};
