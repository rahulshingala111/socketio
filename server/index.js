const express = require("express");
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
const fs = require("fs");
const mysql = require("mysql");

//#region --- image upload multer
const multer = require("multer");
const { log } = require("console");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });
//#endregion

//#region --express--
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Request-Headers", "Set-Headers");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers,myheader,X-RapidAPI-Key, Authorization, X-Requested-With,Set-Headers"
  );
  next();
});
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.array());
app.use(express.static("public"));
//#endregion

//#region ----MySQL----
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected MySQL");
  // con.query("CREATE DATABASE mydb", function (err, result) {
  //   if (err) throw err;
  //   console.log("Database created");
  // });
});

app.get("/dbtest", (req, res) => {
  var sql = "INSERT INTO users (username,firstname,lastname,email) VALUES ?";
  var values = [["rahul123", "rahul", "shingala", "rahul@gmail.com"]];
  con.query(sql, [values], function (err, result) {
    if (err) {
      //throw err;
      res.status(404).json(err);
    }
    console.log("Update!!!!!!!!!!");
    res.status(200).json(result);
  });
});
//#endregion

//#region ====home====
app.get("/", (req, res) => {
  console.log("inside home");
  res.sendStatus(200);
});

app.post("/login", (req, res) => {
  try {
    var sql = "SELECT username FROM users WHERE username = ?";
    var values = [[req.body.username]];
    con.query(sql, [values], (err, result) => {
      if (err) {
        res.status(404).json(err);
      } else {
        if (result[0]?.username === req.body.username) {
          res.status(200).json({ username: result[0].username, isfound: true });
        } else {
          res.status(401).json({ username: null, isfound: false });
        }
      }
    });
  } catch (error) {
    res.status(404).json(err);
  }
});

app.post("/register", (req, res) => {
  try {
    var sql = "INSERT INTO users(username,firstname,lastname,email) VALUES ?";
    var values = [
      [
        req.body.username,
        req.body.firstname,
        req.body.lastname,
        req.body.email,
      ],
    ];
    con.query(sql, [values], (err, result) => {
      if (err) {
        res.status(401).json({ err, msg: "user already exist" });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

//#endregion

//#region -----chat-----

app.get("/api/conversation/:userId", (req, res) => {
  try {
    var sql = `SELECT * FROM conversation WHERE member1 LIKE '${req.params.userId}' OR member2 LIKE '${req.params.userId}'`;
    con.query(sql, function (err, result) {
      if (err) {
        res.status(404).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});

app.get("/api/messages/:conversationId", (req, res) => {
  try {
    var sql = `SELECT * FROM messages WHERE conversationid = '${req.params.conversationId}' ORDER BY created_at ASC`;
    con.query(sql, (err, result) => {
      if (err) {
        res.status(404).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    res.status(401).json(error);
  }
});

app.get("/download/:filename", (req, res) => {
  try {
    console.log(req.params.filename);
    const filename = req.params.filename;
    const filePath = path.join(__dirname, `/tmp/files/${filename}`);
    res.download(filePath, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("succses");
      }
    });
  } catch (error) {
    res.status(401).json(error);
  }
});
//#endregion

//#region -----socketio----
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

  //ROOM
  socket.on("newroom", (data) => {
    socket.join(data.roomName);
  });
  socket.on("roomemit", (data) => {
    console.log(data);
    socket
      .to(data.room)
      .emit("roomrecive", { text: data.text, user: data.user });
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
    console.log(senderId + " and " + receiverId);
    Conver.find({
      member: { $in: [senderId] },
      member: { $in: [receiverId] },
    }).then(async (response) => {
      console.log(response);
      var conversationId = response[0].id;
      console.log("conversation Id" + conversationId);
      await Messg.insertMany({
        conversationId,
        sender: senderId,
        text: text,
      });
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

  //SAVE FILE
  socket.on("file", (file, metadata, callback) => {
    if (file) {
      const fileName = `${metadata.sentDate}-${metadata.name}`;
      fs.writeFile(`./tmp/files/${fileName}`, file, (err) => {
        if (err) {
          console.log(err);
          callback({ status: "NOT SAVED" });
        } else {
          Conver.find({
            member: { $in: [metadata.senderId] },
            member: { $in: [metadata.receiverId] },
          }).then((response) => {
            var conversationId = response[0].id;
            Messg.insertMany({
              conversationId,
              sender: metadata.senderId,
              text: null,
              nameOFfile: fileName,
            });
          });
          socket
            .to("room")
            .emit("test", { nameOFfile: fileName, sender: metadata.sender });
          console.log("file saved");
        }
      });
    } else {
      callback({
        status: "NO FILE",
      });
    }
  });
});
//#endregion

server.listen(3001, () => {
  console.log("listening on " + 3001);
});

const port = 5000;
app.listen(port, () => {
  console.log(`Listening to Port ${port}`);
});
