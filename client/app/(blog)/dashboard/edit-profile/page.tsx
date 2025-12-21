"use client";
import React, { useState, useEffect } from "react";
import {
  Camera,
  Eye,
  EyeOff,
  User,
  Mail,
  FileText,
  Save,
  Lock,
  Loader2,
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { UserType } from "@/types/userType";

const ProfileUpdate = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("profile");

  // Profile state
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
  });
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState("");

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.user);
      setProfileData({
        name: response.user.name || "",
        bio: response.user.bio || "",
      });
      setProfilePicPreview(response.user.profilePic || "");
    } catch (error) {
      console.error("Error loading profile:", error);
      showMessage("error", "Failed to load profile");
    }
  };

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showMessage("error", "Image must be less than 5MB");
        return;
      }
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async () => {
    if (!profileData.name.trim()) {
      showMessage("error", "Name is required");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.updateProfile(
        profileData,
        profilePic || undefined
      );
      setUser(response.user);
      setProfilePic(null);
      showMessage("success", "Profile updated successfully!");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Failed to update profile";
      showMessage("error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      showMessage("error", "All password fields are required");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage("error", "New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage("error", "New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      showMessage("success", "Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Failed to change password";
      showMessage("error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-8 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="relative px-6 pt-6 pb-20">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-background-foreground shadow-lg overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                  {profilePicPreview ? (
                    <img
                      src={profilePicPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-primary/80 hover:bg-primary p-2 rounded-full cursor-pointer transition shadow-lg">
                  <Camera className="w-4 h-4 text-primary-foreground" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1 mt-2">
                <h1 className="text-3xl font-bold text-foreground/80">
                  {user?.name}
                </h1>
                <p className="text-muted-foreground mt-1">{user?.email}</p>
                {user?.bio && (
                  <p className=" bg-background p-4 rounded-lg shadow-inner text-muted-foreground mt-3 text-sm leading-relaxed">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg shadow-md ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="font-medium">{message.text}</div>
            </div>
          </div>
        )}

        <div className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b ">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === "profile"
                  ? "bg-primary text-primary-foreground shadow-inner"
                  : "bg-background text-foreground hover:bg-primary/80 hover:text-primary-foreground"
              }`}
            >
              <User className="w-5 h-5 inline mr-2" />
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === "password"
                  ? "bg-primary text-primary-foreground shadow-inner"
                  : "bg-background text-foreground hover:bg-primary/80 hover:text-primary-foreground"
              }`}
            >
              <Lock className="w-5 h-5 inline mr-2" />
              Change Password
            </button>
          </div>

          <div className="p-8">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-semibold text-muted-foreground mb-2">
                    <User className="w-4 h-4 mr-2 text-secondary" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border rounded-lg transition"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-muted-foreground mb-2">
                    <Mail className="w-4 h-4 mr-2 text-secondary" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 border  rounded-lg text-muted-foreground cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm font-semibold text-muted-foreground mb-2">
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-secondary" />
                      Bio
                    </span>
                    <span
                      className={`text-xs font-normal ${
                        profileData.bio.length > 250
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {profileData.bio.length}/250
                    </span>
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    maxLength={250}
                    rows={4}
                    className="w-full px-4 py-3 border  rounded-lg resize-none transition"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {profilePic && (
                  <div className="bg-background border rounded-lg p-3 text-sm text-secondary">
                    New profile picture selected. Click "Update Profile" to save
                    changes.
                  </div>
                )}

                <button
                  onClick={handleProfileUpdate}
                  disabled={loading}
                  className="w-full font-semibold py-3 bg-primary/80 text-primary-foreground hover:bg-primary rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Update Profile
                    </>
                  )}
                </button>
              </div>
            )}

            {activeTab === "password" && (
              <div className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-semibold text-muted-foreground mb-2">
                    <Lock className="w-4 h-4 mr-2 text-secondary" />
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border rounded-lg pr-12 transition"
                      placeholder="Enter current password"
                    />
                    <button
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/80 hover:text-secondary transition"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-muted-foreground mb-2">
                    <Lock className="w-4 h-4 mr-2 text-secondary" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border rounded-lg pr-12 transition"
                      placeholder="Enter new password"
                    />
                    <button
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/80 hover:text-secondary transition"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be at least 6 characters
                  </p>
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-muted-foreground mb-2">
                    <Lock className="w-4 h-4 mr-2 text-secondary" />
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border rounded-lg pr-12 transition"
                      placeholder="Confirm new password"
                    />
                    <button
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/80 hover:text-secondary transition"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="w-full bg-primary/80 hover:bg-primary text-primary-foreground font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
