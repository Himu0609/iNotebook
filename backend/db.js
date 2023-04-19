const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/inotebook";

const connectToMongo = async () => {
  try {
    mongoose.connect(mongoURI);
    console.log("Mongo connected");
  } catch (error) {
    console.log(error);
    process.exit();
  }
  // older version of mongo lets you connect with CALLBACK fuction but newer one does not supoort it
  // mongoose.connect(mongoURI, () => {
  //     console.log("Connected to mongo successfullyy");
  //   });
};
module.exports = connectToMongo;
