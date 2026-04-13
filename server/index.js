const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const connectDB = require("./db");

const app = express();
const port = 3001;

const spotifyAuth = require("./spotifyAuth");
const spotifySearch = require("./spotifySearch");
const spotifyAuthCode = require("./spotifyAuthCode");
const queue = require("./queue");

// Middleware first, always before routes
connectDB();
app.use(cookieParser());
app.use(
  session({
    secret: "mixify-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/spotify", spotifyAuth);
app.use("/spotify", spotifySearch);
app.use("/spotify", spotifyAuthCode);
app.use("/", queue);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
