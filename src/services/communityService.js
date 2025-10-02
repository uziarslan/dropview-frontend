import axios from "./axiosInstance";

const communityService = {
    listPosts: (params = {}) => axios.get("/api/community/posts", { params }),
    createPost: (payload, imageFile = null) => {
        if (imageFile) {
            // Use FormData for file upload
            const formData = new FormData();
            formData.append('type', payload.type);
            formData.append('content', payload.content);
            if (payload.title) formData.append('title', payload.title);
            formData.append('image', imageFile);

            return axios.post("/api/community/posts", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            // Regular JSON request for posts without images
            return axios.post("/api/community/posts", payload);
        }
    },
    updatePost: (postId, payload, imageFile = null) => {
        if (imageFile) {
            // Use FormData for file upload
            const formData = new FormData();
            formData.append('content', payload.content);
            if (payload.title !== undefined) formData.append('title', payload.title);
            formData.append('image', imageFile);

            return axios.put(`/api/community/posts/${postId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            // Regular JSON request for posts without images
            return axios.put(`/api/community/posts/${postId}`, payload);
        }
    },
    deletePost: (postId) => axios.delete(`/api/community/posts/${postId}`),
    deletePostImage: (postId) => axios.delete(`/api/community/posts/${postId}/image`),
    togglePostLike: (postId) => axios.post(`/api/community/posts/${postId}/like`),

    listComments: (postId, params = {}) => axios.get(`/api/community/posts/${postId}/comments`, { params }),
    createComment: (postId, payload) => axios.post(`/api/community/posts/${postId}/comments`, payload),
    updateComment: (commentId, payload) => axios.put(`/api/community/comments/${commentId}`, payload),
    deleteComment: (commentId) => axios.delete(`/api/community/comments/${commentId}`),
    toggleCommentLike: (commentId) => axios.post(`/api/community/comments/${commentId}/like`),
};

export default communityService;


