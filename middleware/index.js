const Campground = require("../models/campgrounds");
const Comment = require("../models/comments");

const middlewareObj = {};

//=====campgrounds middleware=============================
//==============================================
middlewareObj.checkCampgroundOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findByIdAndUpdate(
      req.params.id,
      req.body.result,
      (err, isValue) => {
        if (err) res.redirect("back");
        else {
          if (isValue.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "You don't have permission to do that !");
            res.redirect("back");
          }
        }
      }
    );
  } else {
    req.flash("error", "You need to be login to do that !");
    res.redirect("back");
  }
};

//=====comments middleware=============================
//==============================================
middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findByIdAndUpdate(
      req.params.comment_id,
      req.body.result,
      (err, isValue) => {
        if (err) console.log(err);
        else {
          if (isValue.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "You don't have permission to do that !");
            res.redirect("back");
          }
        }
      }
    );
  } else {
    req.flash("error", "You need to be login to do that !");
    res.redirect("back");
  }
};

//=================authentication of logging middleware===============
//================================================================
middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be login to do that !");
  res.redirect("/login");
};

module.exports = middlewareObj;

/* <div class="container">
  <% if(error && error.length > 0){ %>
  <div class="alert alert-danger" role="alert">
    {%= error %}
  </div>
  <% } %> <% if(success && success.length > 0){ %>
  <div class="alert alert-success" role="alert">
    {%= success %}
  </div>
  <% } %>
</div>  */
