"use client";

import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type Delta from "quill-delta";

const QuillEditor = ({ docId }: { docId: string }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const { currentUser } = useCurrentUser();
  const [isReady, setIsReady] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // setup
  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Start writing...",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          ["link", "image"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
        ],
      },
    });

    quillRef.current = quill;
    setIsReady(true);
  }, []);

  // content
  useEffect(() => {
    if (!token || !docId || !quillRef.current) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doc/${docId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const delta = JSON.parse(res.data.content || "{}");
        quillRef.current?.setContents(delta);
      })
      .catch((err) => console.error("Failed to load document:", err));
  }, [token, docId, isReady]);

  // socket setup
  useEffect(() => {
    if (!token || !docId || !currentUser || !quillRef.current) return;

    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL!, {
      auth: { token },
    });

    socket.emit("join-room", docId, currentUser);
    socketRef.current = socket;

    const quill = quillRef.current;

    const handleReceive = (delta: Delta) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", handleReceive);

    const handleLocalChange = (
      delta: Delta,
      oldDelta: Delta,
      source: string
    ) => {
      if (source !== "user") return;
      socket.emit("send-changes", docId, delta);

      // auto save
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        const content = JSON.stringify(quill.getContents());
        axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doc/${docId}`,
          { content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }, 1000);
    };

    quill.on("text-change", handleLocalChange);

    return () => {
      socket.disconnect();
    };
  }, [token, docId, currentUser, isReady]);

  return (
    <div className="h-[500px] bg-white rounded border shadow p-2">
      <div ref={editorRef} className="h-full" />
    </div>
  );
};

export default QuillEditor;
