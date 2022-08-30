const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// Routes
const userRoutes = require("./routes/user");
app.use("/api/v1/user", userRoutes);

const messageRoutes = require("./routes/message");
app.use("/api/v1/message", messageRoutes);

const chatRoutes = require("./routes/chat");
app.use("/api/v1/chat", chatRoutes);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

// Error Handling
const { notFound, errorHandler } = require("./middlewares/error");
app.use(notFound);
app.use(errorHandler);

module.exports = app;
