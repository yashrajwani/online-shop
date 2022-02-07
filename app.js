const express = require("express");
const path = require("path");

const db = require("./data/database");
const authRoutes = require("./routes/auth.routes");

const app = express();

// setting view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// statically serve public folder -> all content in public folder can be requested by users
app.use(express.static("public"));

app.use(authRoutes);

db.connectToDatabase()
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log("Failed to connect to database");
    console.log(error);
  });
