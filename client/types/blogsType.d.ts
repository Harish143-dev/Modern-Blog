export interface BlogType {
  _id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  author: mongoose.Types.ObjectId | any;
  blogImages: string;
  tags: string[];
  category: string;
  views: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    profilePic: string;
  };
}
