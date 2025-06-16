"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { User } from "@/types";
import DocNav from "@/components/shared/DocNav";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import QuillEditor from "@/components/Editor/QuillEditor";

const DocumentEditor = () => {
  const { id } = useParams<{ id: string }>();
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const { currentUser } = useCurrentUser();
  const socketRef = useRef<Socket | null>(null);

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
        {/* <TinyEditor docId={id} /> */}
        <QuillEditor docId={id} />
      </div>
    </>
  );
};

export default DocumentEditor;
