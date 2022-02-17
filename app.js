const express = require("express");
const path = require("path");
const csrf = require("csurf");
const expressSession = require("express-session");

const db = require("./data/database");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const baseRoutes = require("./routes/base.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");
const createSessionConfig = require("./config/session");

const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const cartMiddleware = require("./middlewares/cart");

const app = express();

// setting view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// statically serve public folder -> all content in public folder can be requested by users
app.use(express.static("public"));
app.use("/products/assets", express.static("product-data"));

// Decode data from requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(cartMiddleware.initializeCart);

// Adding CSRF (Cross Site Request Forgery) protection
app.use(csrf());
app.use(addCsrfTokenMiddleware);

app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use("/cart", cartRoutes);
app.use(protectRoutesMiddleware);
app.use("/admin", adminRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log("Failed to connect to database");
    console.log(error);
  });
