"use client";

import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { User } from "@/types";

const TinyEditor = ({ docId }: { docId: string }) => {
  const [content, setContent] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const emitTimeout = useRef<NodeJS.Timeout | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch current user
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/currentUser`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCurrentUser(res.data))
      .catch((err) => console.error("Error fetching user:", err));
  }, [token]);

  // Fetch document content
  useEffect(() => {
    if (!docId || !token) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doc/${docId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setContent(res.data.content))
      .catch((err) => console.error("Failed to load document:", err));
  }, [docId, token]);

  // Setup socket connection and events
  useEffect(() => {
    if (!docId || !token || !currentUser) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_API_BASE_URL!, {
      auth: { token },
    });

    socketRef.current.emit("join-room", docId, currentUser);

    socketRef.current.on("receive-changes", (newContent: string) => {
      const editor = editorRef.current;
      if (!editor) return;
      if (editor.getContent() !== newContent) {
        const bookmark = editor.selection.getBookmark(2);
        editor.setContent(newContent);
        editor.selection.moveToBookmark(bookmark);
      }
    });

    // Removed cursor-update and user-disconnected listeners

    return () => {
      socketRef.current?.disconnect();
    };
  }, [docId, token, currentUser]);

  // Debounced send changes
  const sendChanges = (newContent: string) => {
    if (emitTimeout.current) clearTimeout(emitTimeout.current);
    emitTimeout.current = setTimeout(() => {
      socketRef.current?.emit("send-changes", docId, newContent);
    }, 300);
  };

  // Auto-save with debounce
  const autoSaveContent = async (updatedContent: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doc/${docId}`,
        { content: updatedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Auto-save failed:", err);
    }
  };

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
    sendChanges(newContent);

    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => autoSaveContent(newContent), 1000);
  };

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      value={content}
      onInit={(evt, editor) => (editorRef.current = editor)}
      onEditorChange={handleEditorChange}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
    />
  );
};

export default TinyEditor;
