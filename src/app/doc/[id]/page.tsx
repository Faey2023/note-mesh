"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { User } from "@/types";

const TinyEditor = dynamic(() => import("@/components/Editor/TinyEditor"), {
  ssr: false,
});
import DocNav from "@/components/shared/DocNav";

const DocumentEditor = () => {
  const { id } = useParams<{ id: string }>();
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // current user
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

  // socket connection
  useEffect(() => {
    if (!id || !currentUser) return;

    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL!);
    socketRef.current = socket;

    socket.emit("join-room", id, {
      id: currentUser._id,
      fullName: currentUser.fullName,
      avatar: currentUser.avatar || "",
    });

    socket.on("active-users", (users: User[]) => {
      setActiveUsers(users);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [id, currentUser]);

  return (
    <>
      <DocNav docId={id} activeUsers={activeUsers} />
      <div className="p-6">
        <TinyEditor docId={id} />
      </div>
    </>
  );
};

export default DocumentEditor;
