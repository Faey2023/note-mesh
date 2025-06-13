"use client";

const TinyEditor = dynamic(() => import("@/components/Editor/TinyEditor"), {
  ssr: false,
});
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const DocumentEditor = () => {
  const params = useParams();
  const id = params?.id;

  console.log(id);

  return (
    <div className="p-6">
      <TinyEditor />
    </div>
  );
};
export default DocumentEditor;
