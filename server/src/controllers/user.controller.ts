import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadTocloudinary } from "../services/cloudinary.service";
import dotenv from "dotenv";
dotenv.config();

interface AuthRequest extends Request {
  user?: { userId: string };
}

// -------------------------- REGISTER --------------------------
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, bio } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle profile picture upload
    let profilePic = "";
    if (req.file) {
      try {
        const result = (await uploadTocloudinary(
          req.file.buffer,
          "profile"
        )) as { secure_url: string };
        profilePic = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        return res.status(500).json({
          message: "Failed to upload profile picture",
        });
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePic,
      coverImage: "", // Initialize empty cover image
      bio: bio || "",
    });

    // Prepare safe response (exclude password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      coverImage: user.coverImage,
      bio: user.bio,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "An error occurred during registration" });
  }
};

// -------------------------- LOGIN --------------------------
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        coverImage: user.coverImage,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};

// -------------------------- GET USER PROFILE --------------------------
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Check if userId exists
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find user
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching profile" });
  }
};

// -------------------------- UPDATE PROFILE --------------------------
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Check if userId exists
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Prevent password updates through this endpoint
    const { password, email, ...updates } = req.body;

    if (password) {
      return res.status(400).json({
        message: "Use the change password endpoint to update password",
      });
    }

    // Don't allow email changes
    if (email) {
      return res.status(400).json({
        message: "Email cannot be changed",
      });
    }

    // Validate bio length if provided
    if (updates.bio && updates.bio.length > 250) {
      return res.status(400).json({
        message: "Bio must be 250 characters or less",
      });
    }

    // Handle profile picture upload
    if (req.file) {
      try {
        const result = (await uploadTocloudinary(
          req.file.buffer,
          "profile"
        )) as { secure_url: string };
        updates.profilePic = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        return res.status(500).json({
          message: "Failed to upload profile picture",
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating profile" });
  }
};

// -------------------------- UPDATE COVER IMAGE --------------------------
export const updateCoverImage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Check if userId exists
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "Cover image file is required",
      });
    }

    // Upload to cloudinary
    try {
      const result = (await uploadTocloudinary(req.file.buffer, "cover")) as {
        secure_url: string;
      };

      // Update user's cover image
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { coverImage: result.secure_url },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Cover image updated successfully",
        coverImage: updatedUser.coverImage,
        user: updatedUser,
      });
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError);
      return res.status(500).json({
        message: "Failed to upload cover image",
      });
    }
  } catch (error) {
    console.error("Update cover image error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating cover image" });
  }
};

// -------------------------- DELETE COVER IMAGE --------------------------
export const deleteCoverImage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Check if userId exists
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Remove cover image
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { coverImage: "" },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Cover image removed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Delete cover image error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting cover image" });
  }
};

// -------------------------- CHANGE PASSWORD --------------------------
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    // Check if userId exists
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    // Find user (include password)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while changing password" });
  }
};
