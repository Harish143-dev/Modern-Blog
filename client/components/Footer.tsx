import { CATEGORIES, NAV_LINKS } from "@/constant";
import Link from "next/link";
import React from "react";
import {
  FaAngleRight,
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="bg-card text-card-foreground px-10 py-5 mt-10 border shadow-md w-full">
      <div className="w-full flex justify-between items-baseline">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold">Modern Blogs</h1>
          <p className="text-muted-foreground mt-2">
            Delivering independent journalism, thought-provoking insights, and
            trustworthy reporting to keep you informed, inspired, and engaged
            with the world every day.
          </p>
          <div className="flex-base gap-2 mt-5">
            <Link href="#">
              <FaInstagram className="text-xl" />
            </Link>
            <Link href="#">
              <FaFacebookF className="text-xl" />
            </Link>
            <Link href="#">
              <FaXTwitter className="text-xl" />
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-baseline gap-20">
          <div>
            <h1 className="text-lg font-semibold">Quick Link</h1>
            {NAV_LINKS.map((link) => (
              <div key={link.href} className="my-2">
                <Link
                  className="text-sm text-muted-foreground"
                  href={link.href}
                >
                  {link.title}
                </Link>
              </div>
            ))}
          </div>
          <div>
            <h1 className="text-lg font-semibold">Categories</h1>
            {CATEGORIES.map((link) => (
              <div key={link.id} className="my-1">
                <Link
                  className="text-sm text-muted-foreground"
                  href={link.href}
                >
                  {link.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-between w-full mt-5 text-sm">
        <div className="flex-base gap-5">
          <p>© 2023 Modern Blog. All rights reserved.</p>
          <div className="flex-center gap-3">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <FaAngleRight />
          </div>
          <div className="flex-center gap-2">
            <Link href="/terms-of-service">Terms of Service</Link>
            <FaAngleRight />
          </div>
        </div>
        <div>
          <p>Created by Harish</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
