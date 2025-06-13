"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User, Document } from "@/types";
import CreateDocument from "@/components/document/CreateDocument";
import DocumentList from "@/components/document/DocumentList";
import ShareDocument from "@/components/document/ShareDocument";
import Swal from "sweetalert2";

const Home = () => {
  const [currentUser, setCurrentUser] = useState<User>();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [ownedDocs, setOwnedDocs] = useState<Document[]>([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // fetch current user
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/currentUser`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [token, router]);

  // fetch all users (for sharing)
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAllUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [token]);

  // fetch current user's documents (owned + shared)
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }

    const fetchUserAndDocs = async () => {
      try {
        const resUser = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/currentUser`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCurrentUser(resUser.data);

        const resDocs = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doc/allDoc`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOwnedDocs(resDocs.data);
      } catch (err) {
        console.error("Error fetching user or documents:", err);
      }
    };

    fetchUserAndDocs();
  }, [token, router]);

  const handleDeleteDocument = async (docId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete the document permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doc/${docId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOwnedDocs((prev) => prev.filter((doc) => doc._id !== docId));

      await Swal.fire("Deleted!", "Your document has been deleted.", "success");
    } catch (error) {
      console.error("Failed to delete document:", error);
      await Swal.fire("Error", "Failed to delete document.", "error");
    }
  };

  const handleOpenDocument = (docId: string) => {
    router.push(`/doc/${docId}`);
  };

  const handleShareDocument = (docId: string) => {
    setSelectedDocId(docId);
    setShareDialogOpen(true);
  };

  const handleConfirmShare = async (email: string) => {
    const user = allUsers.find((u) => u.email === email);
    if (!user) {
      Swal.fire({
        title: "User not found.",
        icon: "error",
      });
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doc/share`,
        {
          docId: selectedDocId,
          userId: user._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOwnedDocs((prev) =>
        prev.map((doc) =>
          doc._id === selectedDocId && !doc.sharedWith.includes(user._id)
            ? { ...doc, sharedWith: [...doc.sharedWith, user._id] }
            : doc
        )
      );
    } catch (err) {
      console.error("Error sharing document:", err);
    }

    setShareDialogOpen(false);
    setSelectedDocId(null);
  };

  const getUserName = (userId: string) =>
    allUsers.find((u) => u._id === userId)?.fullName || "Unknown";

  if (!currentUser) return <p>Loading user...</p>;

  // Filter docs for owned and shared separately:
  const ownedDocuments = ownedDocs.filter(
    (doc) => doc.owner === currentUser._id
  );

  const sharedDocuments = ownedDocs.filter(
    (doc) =>
      doc.owner !== currentUser._id && doc.sharedWith.includes(currentUser._id)
  );

  return (
    <main className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Welcome, {currentUser.fullName}</h2>
        <CreateDocument />
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-2">Your Documents</h3>
          <DocumentList
            documents={ownedDocuments}
            onDelete={handleDeleteDocument}
            onShare={handleShareDocument}
            onOpen={handleOpenDocument}
            isOwnerView={true}
          />
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Shared With You</h3>
          <DocumentList
            documents={sharedDocuments}
            onDelete={() => {}}
            onShare={() => {}}
            onOpen={handleOpenDocument}
            isOwnerView={false}
            getUserName={getUserName}
          />
        </section>
      </div>

      <ShareDocument
        isOpen={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onShare={handleConfirmShare}
        allUsers={allUsers}
      />
    </main>
  );
};

export default Home;
