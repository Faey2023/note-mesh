"use client";

import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type Delta from "quill-delta";
import type { CursorsModule, QuillEditorProps, QuillRange, User } from "@/types";

Quill.register("modules/cursors", QuillCursors);

const QuillEditor = ({ docId, onActiveUsers }: QuillEditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const emitCursorTimeout = useRef<NodeJS.Timeout | null>(null);
  const { currentUser } = useCurrentUser();
  const [ready, setReady] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // quill cursor
  useEffect(() => {
    if (!editorRef.current) return;
    if (quillRef.current) return;

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
        cursors: true,
      },
    });

    quillRef.current = quill;
    setReady(true);
  }, []);

  // content loading
  useEffect(() => {
    if (!ready || !token || !docId || !quillRef.current) return;

    axios
      .get<{ content: string }>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doc/${docId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        const delta = res.data.content ? JSON.parse(res.data.content) : {};
        quillRef.current!.setContents(delta);
      })
      .catch(console.error);
  }, [token, docId, ready]);

  // setup socket and sync
  useEffect(() => {
    if (!ready || !token || !docId || !quillRef.current || !currentUser) return;

    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL!, {
      auth: { token },
    });

    socket.emit("join-room", docId, currentUser);
    socketRef.current = socket;

    const quill = quillRef.current!;

    // update active users list
    socket.on("active-users", (users: User[]) => {
      onActiveUsers?.(users);
    });

    // document changes
    socket.on("receive-changes", (delta: Delta) => {
      quill.updateContents(delta);
    });

    // cursor updates from other users
    socket.on(
      "cursor-change",
      ({
        userId,
        name,
        range,
      }: {
        userId: string;
        name: string;
        range: QuillRange;
      }) => {
        if (userId === currentUser._id) return;

        const cursors = quill.getModule("cursors") as CursorsModule;

        if (!cursors.cursors()[userId]) {
          cursors.createCursor(userId, name, randomColor(userId));
        }
        cursors.moveCursor(userId, range);
      }
    );

    // emit
    quill.on("text-change", (delta, _, source) => {
      if (source !== "user") return;

      socket.emit("send-changes", docId, delta);

      // save
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        const content = JSON.stringify(quill.getContents());
        axios
          .put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doc/${docId}`,
            { content },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .catch(console.error);
      }, 1000);

      emitCursor();
    });

    // emit cursor
    quill.on("selection-change", (range, _, source) => {
      if (source !== "user" || !range) return;
      emitCursor();
    });

    //
    function emitCursor() {
      if (emitCursorTimeout.current) clearTimeout(emitCursorTimeout.current);
      emitCursorTimeout.current = setTimeout(() => {
        const range = quill.getSelection();
        if (!range) return;
        socket.emit("cursor-change", docId, {
          userId: currentUser?._id,
          name: currentUser?.fullName || "Anonymous",
          range,
        });
      }, 50);
    }

    //
    return () => {
      socket.disconnect();
    };
  }, [ready, token, docId, currentUser, onActiveUsers]);

  return (
    <div className="h-[500px] bg-white rounded border shadow p-2">
      <div ref={editorRef} className="h-full" />
    </div>
  );
};

// unique color
function randomColor(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

export default QuillEditor;
