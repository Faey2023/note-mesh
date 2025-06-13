"use client";

const TinyEditor = dynamic(() => import("@/components/Editor/TinyEditor"), {
  ssr: false,
});
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const DocumentEditor = () => {
  const { id } = useParams<{ id: string }>();

  console.log(id);

  return (
    <div className="p-6">
      <TinyEditor docId={id} />
    </div>
  );
};
export default DocumentEditor;
