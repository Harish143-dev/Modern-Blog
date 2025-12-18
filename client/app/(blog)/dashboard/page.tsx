import Link from "next/link";
import React, { Suspense } from "react";
import { authService } from "@/services/auth.service";
import UserProfile from "@/components/userProfile";


const dashboard = async () => {
  return (
    <div className="h-full flex-center">
      <UserProfile />
    </div>
  );
};

export default dashboard;
