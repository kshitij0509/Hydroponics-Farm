const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const route = require("./routes/route");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const MQTTHandler = require("./mqtt/mqttHandler");

const methodOverride = require("method-override");
require("dotenv").config();
const PORT = process.env.PORT;

app.use(cors({ origin: "http://localhost:8000", credentials: true }));
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(
      ".............^^^^^^^^^^^^........connected to database.......................^^^^^^^"
    );
  })
  .catch((err) => {
    console.log(
      "//////////////////////////////////issue in connecting to database/////////////////////////",
      err
    );
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json()); // Parse JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

app.use(methodOverride("_method"));

app.use("/farm", route);
app.use("/farm/auth", authRoutes);


app.get("/", (req, res) => {
  res.redirect("/farm");
});

// Initialize MQTT Handler
const mqttHandler = new MQTTHandler();

app.listen(PORT, () => {
  console.log(
    `<><><><><><><><><>< ***********LIVE ON ${PORT}************* ><><><><><><><><><><>`
  );
});
