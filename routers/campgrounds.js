const express = require("express");
const router = express.Router();
const Campground = require("../models/campgrounds");
const middleware = require("../middleware");

//=======campground page==============
//===============================================
router.get("/", (req, res) => {
  Campground.find({}, (err, isValue) => {
    if (err) console.log(err);
    else res.render("campgrounds/campgrounds", { campgrounds: isValue });
  });
});

//==========================================================
//============campground new page==========================

router.get("/new", middleware.isLoggedIn, (req, res) => {
  console.log(req.user);
  res.render("campgrounds/new");
});
router.post("/", middleware.isLoggedIn, (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  const values = {
    name,
    image,
    description,
    author,
  };
  Campground.create(values, (err, isValue) => {
    if (err) console.log(err);
    else {
      res.redirect("/campgrounds");
    }
  });
});

//===========================================
//=========show page=========================
//=========================================
router.get("/:id", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, isValue) => {
      if (err) console.log(err);
      else {
        res.render("campgrounds/show", { campgrounds: isValue });
      }
    });
});

//========================================
//=====edit page==========================
//==============================================
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, isValue) => {
    if (err) console.log(err);
    else res.render("campgrounds/edit", { campgrounds: isValue });
  });
});
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.result,
    (err, isValue) => {
      if (err) res.redirect("/campgrounds");
      else {
        console.log(isValue);
        res.redirect("/campgrounds/" + isValue._id);
      }
    }
  );
});

//=============================================
//==========delete (or) remove ================
//===========================================
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err, isValue) => {
    if (err) res.redirect("/campgrounds/" + isValue._id);
    else res.redirect("/campgrounds");
  });
});

module.exports = router;
