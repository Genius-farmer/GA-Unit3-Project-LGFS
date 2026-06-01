import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import {
  validateRegister,
  validateLogin,
} from "../validators/authValidator.js";
import { checkErrors } from "../validators/checkErrors.js";

const router = Router();

router.put("/accounts/register", validateRegister, checkErrors, register);
router.post("/accounts/login", validateLogin, checkErrors, login);

export default router;
