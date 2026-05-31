import express from "express";
import {
  createPlannedActivity,
  deletePlannedActivityById,
  getPlannedActivities,
  getPlannedActivityById,
  updatePlannedActivityById,
} from "../controllers/plannedActivityController.js";
import {
  checkPlannedActivity,
  planned_activity_id_isMongoId,
} from "../validators/plannedActivityValidator.js";
import { checkErrors } from "../validators/checkErrors.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.put(
  "/planned",
  verifyToken,
  checkPlannedActivity,
  checkErrors,
  createPlannedActivity,
);
router.get("/planned", verifyToken, getPlannedActivities);
router.post(
  "/planned",
  verifyToken,
  planned_activity_id_isMongoId,
  checkErrors,
  getPlannedActivityById,
);
router.patch(
  "/planned",
  verifyToken,
  planned_activity_id_isMongoId,
  checkPlannedActivity,
  checkErrors,
  updatePlannedActivityById,
);
router.delete(
  "/planned",
  verifyToken,
  planned_activity_id_isMongoId,
  checkErrors,
  deletePlannedActivityById,
);

export default router;
