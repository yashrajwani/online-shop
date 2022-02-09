function handleErrors(error, req, res, next) {
  console.log(error);
  // 500 -> server side error
  res.status(500).render("shared/500");
}

module.exports = handleErrors;
