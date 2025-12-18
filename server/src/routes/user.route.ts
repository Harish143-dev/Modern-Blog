import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  changePassword,
  deleteCoverImage,
  updateCoverImage,
  updateProfile,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth";
import { upload } from "../middlewares/upload";

const router = Router();

/** Register user (with optional profile pic upload) */
router.post("/register", upload.single("profilePic"), registerUser);

// cover Image Route
router.put(
  "/cover-image",
  authMiddleware,
  upload.single("coverImage"),
  updateCoverImage
);
router.delete("/cover-image", authMiddleware, deleteCoverImage);

/** Login user */
router.post("/login", loginUser);

// update profile route
router.put(
  "/edit-profile",
  authMiddleware,
  upload.single("profilePic"),
  updateProfile
);

/** Get user info (JWT protected) */
router.get("/profile", authMiddleware, getUserProfile);

router.put("/change-password", authMiddleware, changePassword);

export default router;
