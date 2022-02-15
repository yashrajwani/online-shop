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

async function getUpdateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    res.render("admin/products/update-product", { product: product });
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    _id: req.params.id,
  });

  if (req.file) {
    //replace old image new one
    product.replaceImage(req.file.filename);
  }
  try {
    await product.save();
  } catch (error) {
    return next(error);
  }
  res.redirect("/admin/products");
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    await product.remove();
  } catch (error) {
    return next(error);
  }
  res.json({message: 'Deleted Product Successfully!'});
}

module.exports = {
  getNewProduct: getNewProduct,
  getProducts: getProducts,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct
};
