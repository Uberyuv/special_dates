require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const {reqLogger} = require("./src/utils/logger");

//important resources
const PORT = process.env.PORT || 80;
const MODE = process.env.NODE_ENV || "Development";
const HOSTNAME = process.env.HOSTNAME || "localhost";

const connectDB = require("./db");



const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(reqLogger.log);
app.use(express.static(__dirname + '/public')); //__dir and not _dir

//Fetch Routes
const eventRoute = require('./src/routes/eventRoute')
const userRoute = require('./src/routes/userRoute')
const authRoute = require('./src/routes/authRouter');

//Stiching Routes
app.use("/events", eventRoute);
app.use("/users", userRoute);
app.use("/", authRoute);


//Check server status
app.get("/home", (req, res) => {
  console.log("App Connected");  
  res.send("GET request send to Homepage");
});


// connectToMongoDb
connectDB();
const db = mongoose.connection; //get the default connection

// Bind connection to error event( to get the notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));


app.listen(PORT, () => {
  console.log(`Server running in ${MODE} mode at http://${HOSTNAME}:${PORT}/`);
});
