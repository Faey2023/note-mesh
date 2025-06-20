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
import { ShareDocumentProps } from "@/types";

const ShareDocument = ({
  isOpen,
  onOpenChange,
  onShare,
}: ShareDocumentProps) => {
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
