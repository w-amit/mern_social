import express from "express";
import {
  deleteMyProfile,
  followUser,
  forgotPassword,
  getAllUsers,
  getUserProfile,
  login,
  logout,
  myProfile,
  register,
  resetPassword,
  updatePassword,
  updateProfile,
} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

router.get("/follow/:id", isAuthenticated, followUser);

router.put("/update/password", isAuthenticated, updatePassword);

router.put("/update/profile", isAuthenticated, updateProfile);

router.delete("/delete/me", isAuthenticated, deleteMyProfile);

router.get("/me", isAuthenticated, myProfile);

router.get("/users", isAuthenticated, getAllUsers);

router.post("/forgot/password", isAuthenticated, forgotPassword);

router.get("/user/:id", isAuthenticated, getUserProfile);

router.put("/password/reset/:token", resetPassword);

export default router;
