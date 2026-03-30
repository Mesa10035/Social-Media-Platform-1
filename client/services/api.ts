import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
};

// User API
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  getAllUsers: () => api.get("/users/all"),
  getUserById: (userId: string) => api.get(`/users/${userId}`),
  updateProfile: (data: {
    name?: string;
    bio?: string;
    profilePic?: string;
  }) => api.put("/users/update", data),
  getFollowers: (userId: string) => api.get(`/users/${userId}/followers`),
  getFollowing: (userId: string) => api.get(`/users/${userId}/following`),
};

// Follow API
export const followAPI = {
  followUser: (userId: string) => api.post(`/follow/${userId}/follow`),
  unfollowUser: (userId: string) => api.post(`/follow/${userId}/unfollow`),
};

// Post API
export const postAPI = {
  createPost: (data: { content: string; image?: string }) =>
    api.post("/posts", data),
  getFeed: () => api.get("/posts/feed"),
  getPostById: (postId: string) => api.get(`/posts/${postId}`),
  updatePost: (postId: string, data: { content?: string; image?: string }) =>
    api.put(`/posts/${postId}`, data),
  deletePost: (postId: string) => api.delete(`/posts/${postId}`),
  likePost: (postId: string) => api.post(`/posts/${postId}/like`),
  getUserPosts: (userId: string) => api.get(`/posts/user/${userId}`),
};

// Comment API
export const commentAPI = {
  addComment: (postId: string, data: { text: string }) =>
    api.post(`/posts/${postId}/comments`, data),
  getComments: (postId: string) => api.get(`/posts/${postId}/comments`),
  deleteComment: (commentId: string) => api.delete(`/posts/comment/${commentId}`),
};

// Message API
export const messageAPI = {
  sendMessage: (data: {
    receiverId: string;
    message: string;
    image?: string;
  }) => api.post("/messages/send", data),
  getMessages: (userId: string) => api.get(`/messages/with/${userId}`),
  getConversations: () => api.get("/messages/conversations"),
};

export default api;
