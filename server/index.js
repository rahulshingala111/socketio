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
  maxHttpBufferSize: 1e11,
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

app.get("/api/message/:conversationId", async (req, res) => {
  try {
    const abc = await Messg.find({ conversationId: req.params.conversationId });
    res.status(200).json(abc);
  } catch (error) {
    res.status(401).json(error);
  }
});

app.get("/api/getuser/:friendId", (req, res) => {
  try {
    User.findById({ _id: req.params.friendId })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((error) => {
        res.status(401).json(error);
      });
  } catch (error) {
    res.status(401).json(error);
  }
});

app.get("/api/messages/:currentchatid", (req, res) => {
  try {
    Messg.find({ conversationId: req.params.currentchatid })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((error) => {
        res.status(401).json(error);
      });
  } catch (error) {
    console.log(error);
  }
});

let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("user connected - " + socket.id);
  socket.emit("welcome", "socket.io connected");

  //CONNECT
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("metadata", (data) => {
    Conver.find({
      member: { $in: [data.senderId] },
      member: { $in: [data.receiverId] },
    }).then((response) => {
      var conversationId = response[0].id;
      socket.join("room", conversationId);
    });
  });

  //SEND MESSAGE
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    console.log("text " + text);
    Conver.find({
      member: { $in: [senderId] },
      member: { $in: [receiverId] },
    }).then(async (response) => {
      var conversationId = response[0].id;
      // await Messg.insertMany({
      //   conversationId,
      //   sender: senderId,
      //   text: text,
      // });
      socket.to("room").emit("getMessage", {
        senderId,
        text,
      });
    });
  });

  //DISCONNECT
  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

  socket.on("file", (file, name, callback) => {
    if (file) {
      socket.emit("test", file, { name: "rahul" }, (response) => {
        console.log(response.status);
        console.log("emmited");
      });
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
