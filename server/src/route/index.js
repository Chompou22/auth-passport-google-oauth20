import express from "express";
import { login, signup } from "../controller/authController.js";
import dashboard from "../controller/dashboardController.js";
import {
  googleAuth,
  googleAuthRedirect,
} from "../controller/googleController.js";

const router = express.Router();

// Authentication
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.get("/dashboard", dashboard);

// Oauth2 third party authentication
router.get("/google", googleAuth);
router.get("/google/redirect", googleAuthRedirect);

export default router;
