"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Document, DocumentListProps } from "@/types";
import { Share, Trash2, Users } from "lucide-react";

const DocumentList = ({
  documents,
  onDelete,
  onShare,
  onOpen,
  isOwnerView = false,
  getUserName,
}: DocumentListProps) => {
  return (
    <>
      {documents.length === 0 && (
        <p className="text-gray-500">No documents found.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc: Document) => (
          <Card
            key={doc._id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-1">
                  {doc.title}
                </CardTitle>
                {isOwnerView && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare(doc._id);
                      }}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(doc._id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <CardDescription className="line-clamp-2">
                {doc.content || "Empty document"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {doc.sharedWith.length > 0 && (
                    <Badge
                      variant={isOwnerView ? "secondary" : "outline"}
                      className="flex items-center gap-1"
                    >
                      <Users className="h-3 w-3" />
                      {doc.sharedWith.length}
                    </Badge>
                  )}
                  {!isOwnerView && getUserName && (
                    <Badge variant="outline">by {getUserName(doc.owner)}</Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpen(doc._id)}
                >
                  Open
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default DocumentList;
