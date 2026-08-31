const mongoose = require("mongoose");
// const uri = "mongodb://127.0.0.1:27017/storeDB";

const dbConnection = mongoose.connect(process.env.DBURI);

module.exports = dbConnection;