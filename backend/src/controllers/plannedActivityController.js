import {
  getErrorObj,
  getResponseJSON,
  setErrorObj,
} from "../utils/appUtils.js";
import ActivityConfigModel from "../models/ActivityConfigModel.js";
import UserModel from "../models/auth.js";

export const createPlannedActivity = async (req, res, next) => {
  try {
    const activityTypeFound = await ActivityConfigModel.findOne({
      type: req.body.type,
    });
    if (!activityTypeFound)
      return next(getErrorObj(400, "invalid activity type"));

    const userFound = await UserModel.findById(req.user.id);
    if (!userFound) return next(getErrorObj(400, "user not found"));

    const newPlan = {
      type: req.body.type,
      activity_date: req.body.activity_date,
      distance_m: req.body.distance_m,
      duration_ms: req.body.duration_ms,
      laps: req.body.laps,
      intensity_level: req.body.intensity_level,
      comments: req.body.comments,
    };

    userFound.planned_activities.push(newPlan);
    await userFound.save();

    res.json(getResponseJSON(undefined, "planned-activity created"));
  } catch (error) {
    return next(setErrorObj(error, 400, "failed to create planned-activity"));
  }
};

export const getPlannedActivities = async (req, res, next) => {
  try {
    const userFound = await UserModel.findById(req.user.id);
    if (!userFound) return next(getErrorObj(400, "user not found"));

    res.json(getResponseJSON(userFound.planned_activities));
  } catch (error) {
    return next(setErrorObj(error, 400, "failed to get planned-activities"));
  }
};

export const getPlannedActivityById = async (req, res, next) => {
  try {
    const userFound = await UserModel.findById(req.user.id);
    if (!userFound) return next(getErrorObj(400, "user not found"));

    const activityFound = userFound.planned_activities.id(
      req.body.planned_activity_id,
    );
    if (!activityFound)
      return next(getErrorObj(404, "planned-activity not found"));

    res.json(getResponseJSON(activityFound));
  } catch (error) {
    return next(setErrorObj(error, 400, "failed to get planned-activity"));
  }
};

export const updatePlannedActivityById = async (req, res, next) => {
  try {
    const userFound = await UserModel.findById(req.user.id);
    if (!userFound) return next(getErrorObj(400, "user not found"));

    const activityFound = userFound.planned_activities.id(
      req.body.planned_activity_id,
    );
    if (!activityFound)
      return next(getErrorObj(404, "planned-activity not found"));

    if ("type" in req.body) {
      const activityTypeFound = await ActivityConfigModel.findOne({
        type: req.body.type,
      });
      if (!activityTypeFound)
        return next(getErrorObj(400, "invalid activity type"));
      activityFound.type = req.body.type;
    }
    if ("activity_date" in req.body)
      activityFound.activity_date = req.body.activity_date;
    if ("distance_m" in req.body)
      activityFound.distance_m = req.body.distance_m;
    if ("duration_ms" in req.body)
      activityFound.duration_ms = req.body.duration_ms;
    if ("laps" in req.body) activityFound.laps = req.body.laps;
    if ("intensity_level" in req.body)
      activityFound.intensity_level = req.body.intensity_level;
    if ("comments" in req.body) activityFound.comments = req.body.comments;

    await userFound.save();
    res.json(getResponseJSON(undefined, "planned-activity updated"));
  } catch (error) {
    return next(setErrorObj(error, 400, "failed to update planned-activity"));
  }
};

export const deletePlannedActivityById = async (req, res, next) => {
  try {
    const userFound = await UserModel.findById(req.user.id);
    if (!userFound) return next(getErrorObj(400, "user not found"));

    const activityFound = userFound.planned_activities.id(
      req.body.planned_activity_id,
    );
    if (!activityFound)
      return next(getErrorObj(404, "planned-activity not found"));

    userFound.planned_activities.pull(req.body.planned_activity_id);
    await userFound.save();

    res.json(getResponseJSON(undefined, "planned-activity deleted"));
  } catch (error) {
    return next(setErrorObj(error, 400, "failed to delete planned-activity"));
  }
};
