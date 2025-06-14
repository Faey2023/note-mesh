"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
import axios from "axios";
import { FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const DocNav = ({
  docId,
  activeUsers,
}: {
  docId: string;
  activeUsers: User[];
}) => {
  const [sharedUsers, setSharedUsers] = useState<User[]>([]);

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
          res.data.sharedWith.map((entry: { user: User }) => entry.user)
        );
      } catch (err) {
        console.error("Failed to load document:", err);
      }
    };

    fetchDocument();
  }, [docId]);

  const isActive = (userId: string) =>
    activeUsers.some((user) => user._id === userId);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-[#002172]" />
          <h1 className="text-2xl font-bold text-gray-900">Note Mesh</h1>
        </Link>

        <div className="flex -space-x-2">
          {sharedUsers.map((user) => {
            const active = isActive(user._id);
            return (
              <Avatar
                key={user._id}
                className={`ring-2 ${
                  active ? "ring-blue-500" : "grayscale ring-gray-300"
                }`}
              >
                <AvatarImage src={user.avatar || ""} alt={user.fullName} />
                <AvatarFallback>
                  {user.fullName
                    ? user.fullName
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()
                    : "US"}
                </AvatarFallback>
              </Avatar>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default DocNav;
