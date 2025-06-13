"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const TinyEditor = ({ docId }: { docId: string }) => {
  const [content, setContent] = useState<string>("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load initial content
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doc/${docId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setContent(res.data.content);
      } catch (err) {
        console.error("Failed to load document:", err);
      }
    };

    if (docId && token) fetchDocument();
  }, [docId, token]);

  // save content
  const autoSaveContent = async (updatedContent: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doc/${docId}`,
        { content: updatedContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Auto-saved");
    } catch (err) {
      console.error("Auto-save failed:", err);
    }
  };


  const handleEditorChange = (newContent: string) => {
    setContent(newContent);

    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      autoSaveContent(newContent);
    }, 1000);
  };



  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      value={content}
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
      }}
    />
  );
};

export default TinyEditor;
