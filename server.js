// // server setup
const Server = require("socket.io");
const express = require("express");
const http = require("http");
const session = require("express-session");
const path = require("path");

const ChatBot = require("./bot");

const app = express();
//setting the public folder as the static folder
app.use(express.static(path.join(__dirname, "public")));
const ioserver = http.createServer(app);

const sessionMiddlewre = session({
  secret: "Hamsa",
  resave: false,
  saveUninitialized: true,
  cookie: {
    // secure:true,
    maxAge: 7200000, // 2 hours
  },
});

app.use(express.json());
app.use(sessionMiddlewre);

// chatbot class
const bot = new ChatBot();

bot.start(ioserver);

const PORT = process.env.PORT || 4000;
ioserver.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}`);
});
