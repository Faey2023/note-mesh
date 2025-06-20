export interface SharedWithEntry {
  user: string;
  role: "viewer" | "editor";
  _id?: string;
}
export interface Document {
  _id: string;
  title: string;
  content: string;
  owner: string;
  sharedWith: SharedWithEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  image: FileList;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
}

export interface ShareDocumentProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onShare: (email: string) => void;
}

export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface DocumentListProps {
  documents: Document[];
  onDelete: (docId: string) => void;
  onShare: (docId: string) => void;
  onOpen: (docId: string) => void;
  isOwnerView?: boolean;
  getUserName?: (userId: string) => string;
}

export interface QuillEditorProps {
  docId: string;
  onActiveUsers?: (users: User[]) => void;
}

export interface QuillRange {
  index: number;
  length: number;
}

export interface CursorsModule {
  createCursor(id: string, name: string, color: string): void;
  moveCursor(id: string, range: QuillRange): void;
  cursors(): Record<
    string,
    {
      name: string;
      color: string;
      range: QuillRange;
    }
  >;
}
