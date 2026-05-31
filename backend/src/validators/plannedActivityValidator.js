import { body } from "express-validator";

export const checkPlannedActivity = [
  body("type").notEmpty().withMessage("type is required"),
  body("activity_date")
    .notEmpty()
    .withMessage("activity_date is required")
    .custom((value) => {
      const inputDate = new Date(value);
      inputDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (inputDate < today) {
        throw new Error("activity_date must be today or a future date");
      }
      return true;
    }),
];

export const planned_activity_id_isMongoId = [
  body("planned_activity_id")
    .isMongoId()
    .withMessage("invalid planned_activity_id"),
];
