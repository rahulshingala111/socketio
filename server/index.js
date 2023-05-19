//#region ============= ====================
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1e8,
});
//Schema
const User = require("./schema/User");
const Room = require("./schema/Room");
const Conver = require("./schema/Conversation");
const Messg = require("./schema/Message");
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

//#region ====home====
app.get("/", (req, res) => {
  console.log("inside home");
  res.sendStatus(200);
});

app.post("/login", (req, res) => {
  try {
    User.findOne({ username: req.body.username }).then((response) => {
      if (response?.username === req.body.username) {
        res.status(200).json({
          id: response.id,
        });
      } else {
        res.sendStatus(401);
      }
    });
  } catch (error) {
    res.sendStatus(401);
  }
});

//#endregion

app.get("/chat", (req, res) => {});

app.post("/api/conversation", async (req, res) => {
  try {
    const abc = await Conver.insertMany({
      member: [req.body.senderId, req.body.reciverId],
    });
    res.status(200).json(abc);
  } catch (error) {
    res.status(401).json(error);
  }
});

app.get("/api/conversation/:userId", async (req, res) => {
  try {
    await Conver.find({ member: { $in: [req.params.userId] } })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((error) => {
        console.log("cant find");
        res.status(401).json(error);
      });
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
});

app.post("/api/message", async (req, res) => {
  try {
    const abc = await Messg.insertMany({
      conversationId: req.body.conversationId,
      sender: req.body.sender,
      text: req.body.text,
    });
    res.status(200).json(abc);
  } catch (error) {
    res.sendStatus(401);
  }
});

io.on("connection", (socket) => {
  console.log("user connected - " + socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`user ${socket.id} joined ${room} room`);
  });

  socket.on("send_message", (messageData) => {
    console.log(messageData);
    // Room.insertMany({
    //   room: messageData.room,
    //   username: messageData.username,
    //   message: messageData.currentMessage,
    //   time: messageData.time,
    // });
    socket.to(messageData.room).emit("recieve_message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });

  socket.on("file", (file, name, callback) => {
    if (file) {
      socket.emit("rrr", file);
      callback({
        status: "OK",
      });
    } else {
      callback({
        status: "NOT OK",
      });
    }
    console.log(file);
  });
});

server.listen(3001, () => {
  console.log("listening on " + 3001);
});

const port = 5000;
app.listen(port, () => {
  console.log(`Listening to Port ${port}`);
});
