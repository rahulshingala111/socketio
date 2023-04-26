const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

//Schema

const app = express();

//header origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Request-Headers", "Set-Headers");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers,myheader,X-RapidAPI-Key, Authorization, X-Requested-With,Set-Headers"
  );
  next();
});

// idk
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: false, parameterLimit: 50000 })
);

//mongoose
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://0.0.0.0:27017/socketio", {
  useNewUrlParser: true,
  //useCreateIndex: true,
  // useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.get("/home", (req, res) => {
  console.log("inside home");
  res.sendStatus(200);
});

const port = 5000;
app.listen(port, () => {
  console.log(`Listening to Port ${port}`);
});
