"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SharedWithEntry, User } from "@/types";
import axios from "axios";
import { FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const DocNav = ({ docId }: { docId: string }) => {
  const [currentUser, setCurrentUser] = useState<User>();
  const [sharedUsers, setSharedUsers] = useState<User[]>([]);

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

  useEffect(() => {
    const fetchDocument = async () => {
      const token = localStorage.getItem("token");
      if (!docId || !token) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doc/${docId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSharedUsers(
          res.data.sharedWith.map((data: SharedWithEntry) => data.user)
        );
      } catch (err) {
        console.error("Failed to load document:", err);
      }
    };

    fetchDocument();
  }, [docId]);
  console.log(sharedUsers);
  if (!currentUser) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-[#002172]" />
          <h1 className="text-2xl font-bold text-gray-900">Note Mesh</h1>
        </Link>

        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
          {sharedUsers.map((user, idx) => (
            <Avatar key={idx}>
              <AvatarImage
                src={user.avatar || ""}
                alt={`@${user.fullName || "user"}`}
              />
              <AvatarFallback>
                {user.fullName
                  ? user.fullName
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                  : "US"}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </header>
  );
};

export default DocNav;
