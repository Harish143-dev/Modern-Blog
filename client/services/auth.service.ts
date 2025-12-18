import api from "@/lib/api";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  // Register
  register: async (data: RegisterData, profilePic?: File) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.bio) formData.append("bio", data.bio);
    if (profilePic) formData.append("profilePic", profilePic);

    const response = await api.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },

  // Login
  login: async (data: LoginData) => {
    const response = await api.post("/auth/login", data);

    // Save token to localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // Update profile
  updateProfile: async (data: any, profilePic?: File) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    if (profilePic) formData.append("profilePic", profilePic);

    const response = await api.put("/auth/edit-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },

  // Update cover image
  coverImage: async (formData: FormData) => {
    const response = await api.put("/auth/cover-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },

  // Delete cover image
  deleteCoverImage: async () => {
    const response = await api.delete("/auth/cover-image");
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  }
};
