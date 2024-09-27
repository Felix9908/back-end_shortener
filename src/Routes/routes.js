import express from "express";
import { login, logOut } from "../Controllers/AuthController.js";
import { verifyToken } from "../Controllers/Middleware/VerifyToken.js";
import { shortCode, shorten, getAllShortenedUrls, deleteShortenedUrl, editShortenedUrl } from "../Controllers/ShortenController.js";
import { createAccount, updateUserDetails, toggleUserActiveStatus, deleteUser } from "../Controllers/UserController.js";

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
router.get("/:shortCode", shortCode);
router.get("/getAllShortenedUrls", verifyToken, getAllShortenedUrls);
router.delete("/deleteShortenedUrl", verifyToken, deleteShortenedUrl);
router.put("/editShortenedUrl", verifyToken, editShortenedUrl);

export default router; 
