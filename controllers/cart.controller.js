const Product = require("../models/product.model");

async function addCartItem(req, res, next) {
  let product;
  try {
    product = Product.findById(req.body.productId);
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
  })
}

module.exports = {
  addCartItem: addCartItem,
};
