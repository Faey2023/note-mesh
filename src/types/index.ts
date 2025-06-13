export interface Document {
  _id: string;
  title: string;
  content: string;
  owner: string;
  sharedWith: string[];
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
  allUsers: User[];
}
