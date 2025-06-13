"use client";

import { useParams } from "next/navigation";

const DocumentEditor = () => {
  const params = useParams();
  const documentId = params?.documentId;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Document Editor</h1>
      <p className="mt-4 text-gray-600">Editing document ID: {documentId}</p>
    </div>
  );
};
export default DocumentEditor;
