import mongoose from "mongoose";
import { RecordedActivitySchema } from "./RecordedActivityModel.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    displayName: {
      type: String,
      trim: true,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    recorded_activities: { type: [RecordedActivitySchema], default: [] },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
