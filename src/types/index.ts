export interface Document {
  id: string
  title: string
  content: string
  owner: string
  sharedWith: string[]
  createdAt: string
  updatedAt: string
}

export interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  image: FileList;
}
