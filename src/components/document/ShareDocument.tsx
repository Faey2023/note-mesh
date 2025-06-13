"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ShareDocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onShare: (email: string) => void;
  dummyUsers: User[];
}

const ShareDocument = ({
  isOpen,
  onOpenChange,
  onShare,
  dummyUsers,
}: ShareDocumentDialogProps) => {
  const [email, setEmail] = useState("");

  const handleShare = () => {
    if (email.trim()) {
      onShare(email.trim());
      setEmail("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Enter the email address of the person you want to share this
            document with.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address..."
              onKeyDown={(e) => e.key === "Enter" && handleShare()}
            />
          </div>
          <div className="text-sm text-gray-600">
            Available users: {dummyUsers.map((u) => u.email).join(", ")}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleShare} disabled={!email.trim()}>
            Share Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDocument;
