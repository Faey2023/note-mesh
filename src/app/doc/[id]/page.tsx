"use client";

import { useParams } from "next/navigation";

const DocumentEditor = () => {
  const params = useParams();
  const id = params?.id;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Document Editor</h1>
      <p className="mt-4 text-gray-600">Editing document ID: {id}</p>
    </div>
  );
};
export default DocumentEditor;
