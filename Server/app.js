require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose")
require("./db/connect")
const cookieParser = require("cookie-parser")
const Products = require("./models/productsSchema")
const DefaultData = require("./defaultdata")
const cors = require("cors");
const router = require("./routes/router")


app.use(express.json());
app.use(cookieParser(""));
app.use( cors({
    origin: "http://localhost:3000", 
    credentials: true
  }));
app.use(router);


app.listen(process.env.port, () => {
    console.log("Server is running on port number");
})


DefaultData();
