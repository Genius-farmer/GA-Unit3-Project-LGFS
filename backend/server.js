import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./src/db/db.js";
import authRouter from "./src/routers/authRouter.js";
import userRouter from "./src/routers/userRouter.js";
import recordedActivityRouter from "./src/routers/recordedActivityRouter.js";
import activityConfigRouter from "./src/routers/activityConfigRouter.js";

connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("JSON parsing error:", err.message);
    return res.status(400).json({
      status: 400,
      message: "invalid JSON format",
    });
  } else if (err instanceof SyntaxError && err.status === 400 && err.type === "entity.parse.failed") {
    console.error("URL-encoded parsing error:", err.message);
    return res.status(400).json({
      status: 400,
      message: "invalid form data format",
    });
  }

  next(err);
});

const apiBase = "/api";

app.use(apiBase, authRouter);
app.use(apiBase, userRouter);
app.use(apiBase + "/activities", recordedActivityRouter);
app.use(apiBase + "/activities", activityConfigRouter);

app.listen(5001, () => console.log("Server running on port 5001"));

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  console.error(err.message);
  console.error(err.stack);

  res.status(err.status || 500).json({
    status: "error",
    message: err.message,
  });
});
