import http from "@/utils/http";

export interface Post {
  id: number;
  body: string;
  title: string;
  userId: number;
}

export const getPosts = async () => {
  const response = await http.get<Post[]>("/posts");
  return response.data;
};

export const createPosts = async (post: Omit<Post, "id">) => {
  const response = await http.post<Post>("/posts", post);
  return response.data;
};

export const updatePost = async (post: Post) => {
  const response = await http.put<Post>(`/posts/${post.id}`, post);
  return response.data;
};

export const deletePost = async (id: number) => {
  const response = await http.delete<Post>(`/posts/${id}`);
  return response.data;
};
