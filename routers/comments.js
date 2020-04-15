const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campgrounds");
const Comment = require("../models/comments");
const middleware = require("../middleware");
//===============comments =================
//=================================================
router.get("/new", (req, res) => {
  Campground.findById(req.params.id, (err, isVal) => {
    if (err) console.log(err);
    else res.render("comments/new", { campgrounds: isVal });
  });
});

router.post("/", (req, res) => {
  Campground.findById(req.params.id, (err, newCampground) => {
    if (err) res.redirect("/campground");
    else {
      Comment.create(req.body.comment, (err, commentCreate) => {
        if (err) console.log(err);
        else {
          commentCreate.author.id = req.user._id;
          commentCreate.author.username = req.user.username;
          commentCreate.save();
          newCampground.comments.push(commentCreate);
          newCampground.save();
          req.flash("success", "Successfully added comment !");
          res.redirect("/campgrounds/" + newCampground._id);
        }
      });
    }
  });
});

//=================================================
//=============edit command===============================
//=======================================================

router.get(
  "/:comment_id/edit",
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findById(req.params.comment_id, (err, isValue) => {
      if (err) res.redirect("back");
      else
        res.render("comments/edit", {
          campgrounds: req.params.id,
          comment: isValue,
        });
    });
  }
);
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, isValue) => {
      if (err) res.redirect("back");
      else res.redirect("/campgrounds/" + req.params.id);
    }
  );
});

//====== delete ===========================
//================================================
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) res.redirect("back");
    else {
      req.flash("success", "Comment deleted !");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
