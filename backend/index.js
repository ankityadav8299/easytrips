const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const connectDB = require('./config/db');
const cookieParser = require("cookie-parser");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/", require("./routes/userRoute"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});