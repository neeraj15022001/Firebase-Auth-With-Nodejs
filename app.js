const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const PORT = process.env.PORT || 8000;
var session = require("express-session");
app.use(express.static(__dirname + "/static"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cookieParser());
var sess = {
  secret: "FGAWNJ",
  cookie: {},
  resave: false,
  saveUnintialized: false,
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.post("/", (req, res) => {
  const isGoogleProvider = req.body.isGoogleProvider;
  if (isGoogleProvider) {
    req.session.token = req.body.token;
  } else {
    req.session.token = uuidv4();
  }
  res.redirect(200, "/profile");
});
app.get("/profile", (req, res) => {
  if (req.session.token) {
    res.sendFile(__dirname + "/static/profile.html");
    return;
  }
  res.redirect("/");
});

app.get("/signOut", (req, res) => {
  req.session.destroy(() => {
    res.sendStatus(200);
    return;
  });
});
app.listen(PORT, () => {
  console.log(`App is now listening on port ${PORT}`);
});
