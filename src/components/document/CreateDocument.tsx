"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const CreateDocument = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    console.log(loading);

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doc/create-doc`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({ title: trimmed }),
        }
      );

      if (!res.ok) throw new Error("Failed to create document");

      const data = await res.json();
      setTitle("");
      setIsOpen(false);
      router.push(`/doc/${data.id}`);
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        title: "Failed to create document. Try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          New Document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
          <DialogDescription>
            Enter a title for your new document.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title..."
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={!title.trim()}>
            Create Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDocument;
