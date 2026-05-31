import mongoose from "mongoose";

export const PlannedActivitySchema = new mongoose.Schema({
  type: { type: String, required: true },
  activity_date: { type: Date, required: true },
  distance_m: { type: Number, default: 0 },
  duration_ms: { type: Number, default: 0 },
  laps: { type: Number, default: 0 },
  intensity_level: { type: Number, default: 1 },
  comments: { type: String, default: "" },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("PlannedActivity", PlannedActivitySchema);
