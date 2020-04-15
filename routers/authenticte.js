const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const request = require("request");
const middleware = require("../middleware");
//=======home page=============

router.get("/", (req, res) => {
  res.render("landing");
});

//=========================================================
//==========search page=============================================
router.get("/search", middleware.isLoggedIn, (req, res) => {
  const value = req.query.imgSearch;
  const url =
    "https://api.unsplash.com/search/photos/?client_id=djtbVZgE4wA0IEpfqZAHftE2N8QkbVbKYD5CJxvFvZg&query=" +
    value;
  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const result = JSON.parse(body);
      res.render("search/engine", { data: result });
    }
  });
});

//==========================================
//=====register page =======================
//============================================

router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, newUser) => {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
      passport.authenticate("local")(req, res, () => {
        req.flash("success", "Welcome to Campground " + newUser.username);
        res.redirect("/campgrounds");
      });
    }
  );
});

//============login page============
router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

//====================Logout ===================
//=========================================
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out !!");
  res.redirect("/campgrounds");
});

module.exports = router;
