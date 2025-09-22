import axios from "./axiosInstance";

const communityService = {
    listPosts: (params = {}) => axios.get("/api/community/posts", { params }),
    createPost: (payload) => axios.post("/api/community/posts", payload),
    updatePost: (postId, payload) => axios.put(`/api/community/posts/${postId}`, payload),
    deletePost: (postId) => axios.delete(`/api/community/posts/${postId}`),
    togglePostLike: (postId) => axios.post(`/api/community/posts/${postId}/like`),

    listComments: (postId, params = {}) => axios.get(`/api/community/posts/${postId}/comments`, { params }),
    createComment: (postId, payload) => axios.post(`/api/community/posts/${postId}/comments`, payload),
    updateComment: (commentId, payload) => axios.put(`/api/community/comments/${commentId}`, payload),
    deleteComment: (commentId) => axios.delete(`/api/community/comments/${commentId}`),
    toggleCommentLike: (commentId) => axios.post(`/api/community/comments/${commentId}/like`),
};

export default communityService;


