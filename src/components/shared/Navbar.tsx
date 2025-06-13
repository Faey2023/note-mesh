"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
import axios from "axios";
import { FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState<User>();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/currentUser`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(undefined);
    router.push("/login");
  };

  if (!currentUser) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-[#002172]" />
          <h1 className="text-2xl font-bold text-gray-900">Note Mesh</h1>
        </Link>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={currentUser.avatar || "/placeholder.svg"}
              alt={currentUser.fullName}
            />
            <AvatarFallback>
              {currentUser.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-gray-700">
            {currentUser.fullName}
          </span>
          <button
            onClick={handleLogout}
            className="ml- cursor-pointer px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
