const express = require("express");
const app = express();
const cors = require("cors");
const loggerMiddleware = require("./src/middleware/logMiddleware");
require("./src/config/db");
require("dotenv").config();

const port = process.env.PORT || 6776;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use(
  cors({
    origin: [
      "https://expense-tracker-bice-kappa.vercel.app",
      "http://localhost:5173",
    ],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    methods: "GET,HEAD,PUT,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

const authRoute = require("./src/routes/authRoute");
const dashboardRoute = require("./src/routes/dashboardRoute");
const transactionRoute = require("./src/routes/transactionRoute");

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/transaction", transactionRoute);
app.use("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
