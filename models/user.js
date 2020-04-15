const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = new mongoose.Schema({
  username: String,
  password: String,
});

Schema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", Schema);
