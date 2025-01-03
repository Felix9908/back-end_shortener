import express from "express";
import { login, logOut } from "../Controllers/AuthController.js";
import { verifyToken } from "../Controllers/Middleware/VerifyToken.js";
import {
  shorten,
  getAllShortenedUrls,
  deleteShortenedUrl,
  editShortenedUrl,
  redirectToOriginalUrl,
} from "../Controllers/ShortenController.js";
import {
  createAccount,
  updateUserDetails,
  toggleUserActiveStatus,
  deleteUser,
} from "../Controllers/UserController.js";
import {
  createGeneralInformation,
  getAllGeneralInformation,
  updateGeneralInformation,
  deleteGeneralInformation,
} from "../Controllers/GeneralInformationController.js";
const router = express.Router();

// Login routes
router.post("/login", login); 
router.put("/logout", verifyToken, logOut);

// User routes
router.post("/createAccount", createAccount);
router.post("/toggleUserActiveStatus", verifyToken, toggleUserActiveStatus);
router.put("/updateUserDetails", updateUserDetails);
router.delete("/deleteUser", deleteUser);

// Shorten URL routes
router.post("/shorten", verifyToken, shorten);
router.get("/getAllShortenedUrls", verifyToken, getAllShortenedUrls);
router.delete("/deleteShortenedUrl", verifyToken, deleteShortenedUrl);
router.put("/editShortenedUrl", verifyToken, editShortenedUrl);
router.get("/redirect/:shortCode", redirectToOriginalUrl);

// General Information
router.post("/CreateGeneralInformation", verifyToken, createGeneralInformation);
router.get("/GetGeneralInformation", verifyToken, getAllGeneralInformation);
router.put("/UpdateGeneralInformation/:id", verifyToken, updateGeneralInformation);
router.delete("/deleteGeneralInformation/:id", verifyToken, deleteGeneralInformation);

export default router;
