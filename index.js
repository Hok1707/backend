const express = require("express");
const app = express();
const cors = require("cors");
const loggerMiddleware = require("./src/middleware/logMiddleware");
require("./src/config/db");
require('dotenv').config();

const port = process.env.PORT || 6776;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use(cors({
  origin:'http://localhost:5173',
}));


const authRoute = require("./src/routes/authRoute");
const dashboardRoute = require('./src/routes/dashboardRoute')
const transactionRoute = require("./src/routes/transactionRoute");

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/transaction", transactionRoute);

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
