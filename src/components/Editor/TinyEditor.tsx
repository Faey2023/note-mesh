import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";

const TinyEditor = () => {
  const [content, setContent] = useState("");

  console.log(content);

  const handleEditorChange = (content: string) => {
    setContent(content);
    console.log("Edited content:", content);
  };

  return (
    <div>
      <Editor
        apiKey={`${process.env.NEXT_PUBLIC_TINYMCE_API_KEY}`}
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
        onEditorChange={handleEditorChange}
      />
    </div>
  );
};

export default TinyEditor;
