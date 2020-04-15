const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campgrounds");
const User = require("./models/user");
const Comment = require("./models/comments");
const listsCampgrounds = require("./routers/campgrounds");
const listsComments = require("./routers/comments");
const authenticatedLists = require("./routers/authenticte");
const passport = require("passport");
const passportLocal = require("passport-local");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
//const seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/final_project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  require("express-session")({
    secret: "world",
    resave: false,
    saveUninitialized: false,
  })
);

//========================
//==passport middleware ========
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(__dirname + "/public"));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
app.use("/imgs", express.static("imgs"));
//====all routers================
app.use("/campgrounds", listsCampgrounds);
app.use("/campgrounds/:id/comments", listsComments);
app.use(authenticatedLists);

//seedDB();

app.listen(process.env.PORT, process.env.IP, () =>
  console.log("server is started")
);
