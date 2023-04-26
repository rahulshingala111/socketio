//#region ============= ====================
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

//Schema
const User = require("./schema/User");

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
//#endregion

app.get("/", (req, res) => {
  console.log("inside home");
  res.sendStatus(200);
});

app.post("/register", (req, res) => {
  try {
    User.findOne({ email: req.body.email })
      .then((result) => {
        if (result === null || result === "" || result === undefined) {
          User.insertMany({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
          });
          console.log("user registerred successfully");
          res.sendStatus(200);
        } else {
          console.log("user already exist");
          res.sendStatus(401);
        }
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(404);
      });
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});
const chechEmailPassword = (req, res, next) => {
  try {
    User.findOne({ email: req.body.email, password: req.body.password })
      .then((result) => {
        if (result === null || result === "" || result === undefined) {
          res.sendStatus(401);
        } else {
          next();
        }
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(401);
      });
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
};
app.post("/login", chechEmailPassword, (req, res) => {
  res.sendStatus(200);
});

// const isAuthenticated = async (req, res, next) => {
//   try {
//     const secret = new TextEncoder().encode("rahulSecret");
//     const jwt = req.headers.myheader;
//     const { payload } = await jose.jwtVerify(jwt, secret);
//     try {
//       User.findOne({ email: payload.email })
//         .then((result) => {
//           res.send(result);
//           next();
//         })
//         .catch((error) => {
//           console.log(error);
//           res.sendStatus(401);
//         });
//     } catch (err) {
//       console.log(err);
//       res.sendStatus(403);
//     }
//   } catch (err) {
//     console.log(err);
//     res.sendStatus(403);
//   }
// };

app.get("/chat", isAuthenticated, (req, res) => {});

const port = 5000;
app.listen(port, () => {
  console.log(`Listening to Port ${port}`);
});
