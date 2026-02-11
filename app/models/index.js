const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.product = require("./product.model");
db.order = require("./order.model");

db.ROLES = ["customer", "barista", "admin"];

module.exports = db;