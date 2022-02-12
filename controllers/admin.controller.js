const Product = require("../models/product.model");

function getNewProduct(req, res) {
  res.render("admin/products/new-product");
}

async function getProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render("admin/products/all-products", { products: products });
  } catch (error) {
    return next(error);
  }
}

async function createNewProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    image: req.file.filename,
  });
  try {
    await product.save();
  } catch (error) {
    return next(error);
  }
  res.redirect("/admin/products");
}

module.exports = {
  getNewProduct: getNewProduct,
  getProducts: getProducts,
  createNewProduct: createNewProduct,
};
