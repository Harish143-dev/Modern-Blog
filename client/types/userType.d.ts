export interface UserType extends Document {
  name: string;
  email: string;
  password: string;
  profilePic?: string;
  bio?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}