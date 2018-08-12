import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./routes";
import cors from "cors";

require("dotenv").config();

const app = express();
app.disable("x-powered-by");

mongoose.connect(
  process.env.db,
  err => {
    if (err) {
      console.error(err);
      process.exit(1);
      return;
    }
    console.log("Database Connected Successfully!");
  }
);

dotenv.config({
  configPath:
    process.env.NODE_ENV === "production" ? "../config/prod" : "../config/dev"
});

app.use(
  logger("dev", {
    skip: () => app.get("env") === "test"
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://192.168.0.109:3000",
    credentials: true
  })
);

// app.engine('html', require('ejs').renderFile)
// app.set('view engine', 'ejs')

// Routes
app.use("/", routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  res.status(err.status || 500).send({
    error: "Error 500",
    message: "Error getting requested url"
  });
});

export default app;
