import React, { useContext, useEffect, useMemo, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import communityService from "../../services/communityService";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
// removed Tabs in favor of custom segmented control
import { 
  Users, 
  HelpCircle, 
  X, 
  Heart, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Gift, 
  Star,
  Search,
  Plus,
  MoreHorizontal,
  Check,
  Save,
  Menu,
  Pen
} from "lucide-react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Login } from "./Login";

export const Community = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ type: "question", title: "", content: "" });
  const [activeTab, setActiveTab] = useState("all");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPostForm, setShowPostForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // New create-post modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState(1); // 1: choose type, 2: content
  const [createType, setCreateType] = useState("question");
  const [createTitle, setCreateTitle] = useState("");
  const [createContent, setCreateContent] = useState("");
  const [createImage, setCreateImage] = useState(null);
  const [createImagePreview, setCreateImagePreview] = useState(null);
  // Edit post modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [editType, setEditType] = useState("question");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  // Loading states
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isUpdatingPost, setIsUpdatingPost] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [loadingImages, setLoadingImages] = useState(new Set());

  const loadPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await communityService.listPosts({ page: 1, limit: 50 });
      setPosts(data.items || []);
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to load posts");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const submitPost = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    if (!user) { setShowLoginModal(true); return; }
    try {
      await communityService.createPost(form);
      setForm({ type: form.type, title: "", content: "" });
      loadPosts();
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to create post");
    }
  };

  // Image handling functions
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCreateImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setCreateImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCreateImage(null);
    setCreateImagePreview(null);
  };

  // Edit modal functions
  const openEditModal = (post) => {
    setEditPost(post);
    setEditType(post.type);
    setEditTitle(post.title || '');
    setEditContent(post.content);
    setEditImage(null);
    setEditImagePreview(null);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditPost(null);
    setEditType("question");
    setEditTitle("");
    setEditContent("");
    setEditImage(null);
    setEditImagePreview(null);
  };

  const handleEditImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setEditImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeEditImage = () => {
    setEditImage(null);
    setEditImagePreview(null);
  };

  const submitEditPost = async () => {
    if (!editContent.trim()) return;
    
    setIsUpdatingPost(true);
    try {
      // If there's a new image, first delete the old one from Cloudinary
      if (editImage && editPost.image && editPost.image.path) {
        try {
          await communityService.deletePostImage(editPost._id);
        } catch (error) {
          // Continue with update even if old image deletion fails
        }
      }
      
      await communityService.updatePost(
        editPost._id,
        { type: editType, title: editTitle || undefined, content: editContent },
        editImage
      );
      closeEditModal();
      loadPosts();
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to update post");
    } finally {
      setIsUpdatingPost(false);
    }
  };

  // New: submit from modal
  const submitCreatePost = async () => {
    if (!user) { setShowLoginModal(true); return; }
    if (!createContent.trim()) return;
    
    setIsCreatingPost(true);
    try {
      await communityService.createPost(
        { type: createType, title: createTitle || undefined, content: createContent },
        createImage
      );
      // reset and close
      setShowCreateModal(false);
      setCreateStep(1);
      setCreateType("question");
      setCreateTitle("");
      setCreateContent("");
      setCreateImage(null);
      setCreateImagePreview(null);
      loadPosts();
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to create post");
    } finally {
      setIsCreatingPost(false);
    }
  };

  const toggleLike = async (postId) => {
    if (!user) { setShowLoginModal(true); return; }
    
    // Optimistic update
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post._id === postId) {
          const isLiked = post.likes?.some(like => like.toString() === user._id.toString());
          const newLikes = isLiked 
            ? post.likes.filter(like => like.toString() !== user._id.toString())
            : [...(post.likes || []), user._id];
          
          return {
            ...post,
            likes: newLikes
          };
        }
        return post;
      })
    );
    
    // Silent backend update
    try {
      await communityService.togglePostLike(postId);
    } catch (error) {
      // Revert on error
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post._id === postId) {
            const isLiked = post.likes?.some(like => like.toString() === user._id.toString());
            const revertedLikes = isLiked 
              ? post.likes.filter(like => like.toString() !== user._id.toString())
              : [...(post.likes || []), user._id];
            
            return {
              ...post,
              likes: revertedLikes
            };
          }
          return post;
        })
      );
    }
  };

  const deletePost = async (postId) => {
    if (!user) return;
    
    // Optimistic update - remove post immediately
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    
    // Silent backend update
    try {
      await communityService.deletePost(postId);
    } catch (error) {
      // Revert on error - reload posts
      loadPosts();
    }
  };

  const deletePostImage = async (postId) => {
    if (!user) return;
    
    setIsDeletingImage(true);
    try {
      await communityService.deletePostImage(postId);
      // Update local state after successful deletion
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { ...post, image: undefined }
            : post
        )
      );
    } catch (error) {
      setError('Failed to delete image');
    } finally {
      setIsDeletingImage(false);
    }
  };

  const filteredPosts = useMemo(() => {
    let filtered = posts;
    if (activeTab !== "all") {
      filtered = posts.filter((p) => p.type === (activeTab === "questions" ? "question" : "experience"));
    }
    if (searchQuery) {
      filtered = filtered.filter((p) => 
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [posts, activeTab, searchQuery]);

  const counts = useMemo(() => {
    const questions = posts.filter((p) => p.type === "question").length;
    const experiences = posts.filter((p) => p.type === "experience").length;
    return { all: posts.length, questions, experiences };
  }, [posts]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('[data-mobile-menu]')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const MobileMenu = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-30"
    >
      <div className="px-4 py-4 space-y-3">
        <Button 
          onClick={() => {
            if (!user) { setShowLoginModal(true); setMobileMenuOpen(false); return; }
            setShowCreateModal(true);
            setCreateStep(1);
            setMobileMenuOpen(false);
          }}
          className="w-full justify-start bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
        <Button 
          onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
          variant="outline"
          className="w-full justify-start border-[#A7DADC] text-[#2d2d2d] hover:bg-[#A7DADC]/10"
        >
          <Gift className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Beta Pioneer
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD1DC]/10 via-white to-[#A7DADC]/10">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl text-[#2d2d2d]">
                  DropView
                </h1>
                <p className="text-sm text-[#2d2d2d]/70 hidden sm:block">
                  {user?.name || "Community"}
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90 px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Dashboard
              </Button>
              {user && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  Beta Pioneer
                </Badge>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-2">
              {user && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                  Beta
                </Badge>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full text-[#2d2d2d]/60 hover:bg-gray-100 transition-colors"
                title="Menu"
                data-mobile-menu
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && <MobileMenu />}
          </AnimatePresence>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-[#A7DADC]" />
            <h1 className="font-display text-4xl md:text-5xl text-[#2d2d2d]">
              Community
            </h1>
            <Sparkles className="h-8 w-8 text-[#FFD1DC]" />
          </div>
          <h2 className="font-display text-2xl text-[#2d2d2d]/80 mb-4">
            Where Smart Shopping Begins ✨
          </h2>
          <p className="text-lg text-[#2d2d2d]/70 max-w-3xl mx-auto mb-8">
            Ask before buying, share experiences, help others shop smarter. Join thousands of authentic reviewers making informed decisions together.
          </p>
          
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative">
              {/* Decorative gradient glow */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#FFD1DC]/40 to-[#A7DADC]/40 blur-xl opacity-70" />
              {/* Input wrapper with gradient ring */}
              <div className="relative rounded-full p-[2px] bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC]">
                <div className="relative rounded-full bg-white/90 backdrop-blur-md shadow-xl">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-[#2d2d2d]/60 pointer-events-none" />
                  <input
                    placeholder="Search posts, questions, experiences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 pr-5 text-base md:text-xl rounded-full border-0 focus:outline-none focus:ring-0 bg-transparent"
                    style={{ paddingLeft: '60px' }}
                  />
                </div>
              </div>
            </div>
            {/* Quick topic chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {['#skincare', '#budget-finds', '#first-drop', '#shopping-tips'].map((chip, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-sm bg-[#A7DADC]/10 text-[#2d2d2d]/70 border border-[#A7DADC]/20">
                  {chip}
                </span>
              ))}
            </div>
            
            {/* Mobile Create Post Button */}
            <div className="md:hidden mt-6">
              <Button
                onClick={() => {
                  if (!user) { setShowLoginModal(true); return; }
                  setShowCreateModal(true);
                  setCreateStep(1);
                }}
                className="w-full max-w-sm mx-auto h-14 px-8 text-lg bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-6 w-6 mr-2" />
                Create Post
              </Button>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Filter Segmented Control */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-3 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <div className="relative rounded-full border border-[#A7DADC]/30 bg-white/60 overflow-hidden">
                  {(() => {
                    const activeIndex = activeTab === 'all' ? 0 : activeTab === 'questions' ? 1 : 2;
                    return (
                      <motion.div
                        className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] shadow-md"
                        initial={false}
                        animate={{ x: `${activeIndex * 100}%` }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{ width: '33.3333%' }}
                      />
                    );
                  })()}
                  <div className="relative z-10 grid grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('all')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 text-sm md:text-base transition-colors ${activeTab === 'all' ? 'text-[#2d2d2d]' : 'text-[#2d2d2d]/60 hover:text-[#2d2d2d]'}`}
                    >
                      <Users className="h-4 w-4" />
                      <span className="font-medium">All</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${activeTab === 'all' ? 'bg-white/70 border-white/80 text-[#2d2d2d]' : 'bg-transparent border-[#A7DADC]/40 text-[#2d2d2d]/60'}`}>{counts.all}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('questions')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 text-sm md:text-base transition-colors ${activeTab === 'questions' ? 'text-[#2d2d2d]' : 'text-[#2d2d2d]/60 hover:text-[#2d2d2d]'}`}
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span className="font-medium">Questions</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${activeTab === 'questions' ? 'bg-white/70 border-white/80 text-[#2d2d2d]' : 'bg-transparent border-[#A7DADC]/40 text-[#2d2d2d]/60'}`}>{counts.questions}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('experiences')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 text-sm md:text-base transition-colors ${activeTab === 'experiences' ? 'text-[#2d2d2d]' : 'text-[#2d2d2d]/60 hover:text-[#2d2d2d]'}`}
                    >
                      <Star className="h-4 w-4" />
                      <span className="font-medium">Experiences</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${activeTab === 'experiences' ? 'bg-white/70 border-white/80 text-[#2d2d2d]' : 'bg-transparent border-[#A7DADC]/40 text-[#2d2d2d]/60'}`}>{counts.experiences}</span>
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Post Form */}
            <AnimatePresence>
              {showPostForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-[#FFD1DC]/10 to-[#A7DADC]/10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-display text-lg text-[#2d2d2d]">Share something amazing</h3>
                    </div>
                    <form onSubmit={submitPost} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <select
                          className="border border-[#A7DADC]/30 rounded-lg px-3 py-2 bg-white focus:border-[#A7DADC] focus:ring-2 focus:ring-[#A7DADC]/20"
                          value={form.type}
                          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                        >
                          <option value="question">🤔 Ask a question</option>
                          <option value="experience">✨ Share an experience</option>
                        </select>
                        <Input
                          placeholder="Title (optional for questions)"
                          value={form.title}
                          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                          className="border-[#A7DADC]/30 focus:border-[#A7DADC] focus:ring-2 focus:ring-[#A7DADC]/20"
                        />
                      </div>
                      <Textarea
                        placeholder={user ? "What's on your mind? Share your thoughts..." : "Log in to post and join the conversation..."}
                        value={form.content}
                        onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                        className="min-h-[120px] border-[#A7DADC]/30 focus:border-[#A7DADC] focus:ring-2 focus:ring-[#A7DADC]/20"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button type="submit" className="bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90">
                            <Send className="h-4 w-4 mr-2" />
                            Post
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowPostForm(false)}
                            className="border-[#A7DADC]/30"
                          >
                            Cancel
                          </Button>
                        </div>
                        {!user && (
                          <span className="text-sm text-[#2d2d2d]/60">You need to log in to post</span>
                        )}
                      </div>
                    </form>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Posts Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {error && (
                <Card className="p-4 border-red-200 bg-red-50">
                  <div className="text-red-600">{error}</div>
                </Card>
              )}
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A7DADC]"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredPosts.map((p, index) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <PostItem 
                        post={p} 
                        onToggleLike={toggleLike} 
                        onDeletePost={deletePost}
                        onEditPost={openEditModal}
                        onDeleteImage={deletePostImage}
                        loadingImages={loadingImages}
                        setLoadingImages={setLoadingImages}
                        onCommentCountChange={(postId, delta) => {
                          setPosts(prevPosts => 
                            prevPosts.map(post => 
                              post._id === postId 
                                ? { ...post, commentsCount: (post.commentsCount || 0) + delta }
                                : post
                            )
                          );
                        }} 
                      />
                    </motion.div>
                  ))}
                  {!filteredPosts.length && (
                    <Card className="p-12 text-center border-0 shadow-lg bg-white/80">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD1DC]/20 to-[#A7DADC]/20 flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-8 w-8 text-[#A7DADC]" />
                      </div>
                      <h3 className="font-display text-xl text-[#2d2d2d] mb-2">No posts yet</h3>
                      <p className="text-[#2d2d2d]/70 mb-4">Be the first to share something amazing!</p>
                      <Button
                        onClick={() => setShowPostForm(true)}
                        className="bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Post
                      </Button>
                    </Card>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating New Post Button - Desktop Only */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="hidden md:block fixed bottom-6 right-6 z-30"
      >
        <Button
          onClick={() => {
            if (!user) { setShowLoginModal(true); return; }
            setShowCreateModal(true);
            setCreateStep(1);
          }}
          className="h-12 px-5 rounded-full bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 group inline-flex items-center gap-2"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-medium">Create Post</span>
        </Button>
      </motion.div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowLoginModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative" 
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => setShowLoginModal(false)}>
              <X className="h-5 w-5 text-gray-600" />
            </button>
            <div className="p-6 border-b">
              <h3 className="font-display text-xl text-[#2d2d2d] mb-2">Join the Conversation</h3>
              <p className="text-sm text-[#2d2d2d]/70">Log in to like, comment, and share your thoughts</p>
            </div>
            <div className="p-6">
              <Login onLogin={() => { setShowLoginModal(false); loadPosts(); }} />
              <div className="text-center text-sm mt-4">
                <span className="text-[#2d2d2d]/60">New here? </span>
                <button 
                  className="text-[#A7DADC] hover:underline font-medium" 
                  onClick={() => {
                    setShowLoginModal(false);
                    window.location.href = `/signup?redirect=${encodeURIComponent('/community')}`;
                  }}
                >
                  Create an account
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Post Modal (Two-Step) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-display text-xl text-[#2d2d2d]">Create a post</h3>
              <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => setShowCreateModal(false)}>
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {createStep === 1 && (
              <div className="p-6 space-y-5">
                <div className="flex items-center">
                  <p className="text-sm text-[#2d2d2d]/70">Pick a vibe for your post</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setCreateType('question'); setCreateStep(2); }}
                    className={`relative overflow-hidden rounded-2xl p-5 text-left transition-all border ${
                      createType==='question'
                        ? 'border-[#A7DADC] bg-gradient-to-br from-[#FFD1DC]/20 to-[#A7DADC]/20 shadow-lg'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#FFD1DC]/30 to-[#A7DADC]/30 blur opacity-50" />
                    <div className="relative z-10 flex items-start gap-3">
                      <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow">
                        <span className="text-2xl">🤔</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-[#2d2d2d]">Question</h4>
                          {createType==='question' && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#A7DADC]/20 text-[#2d2d2d]">Selected</span>
                          )}
                        </div>
                        <p className="text-xs text-[#2d2d2d]/70 mt-1">Ask the community before buying</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setCreateType('experience'); setCreateStep(2); }}
                    className={`relative overflow-hidden rounded-2xl p-5 text-left transition-all border ${
                      createType==='experience'
                        ? 'border-[#A7DADC] bg-gradient-to-br from-[#FFD1DC]/20 to-[#A7DADC]/20 shadow-lg'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#FFD1DC]/30 to-[#A7DADC]/30 blur opacity-50" />
                    <div className="relative z-10 flex items-start gap-3">
                      <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow">
                        <span className="text-2xl">✨</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-[#2d2d2d]">Experience</h4>
                          {createType==='experience' && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#A7DADC]/20 text-[#2d2d2d]">Selected</span>
                          )}
                        </div>
                        <p className="text-xs text-[#2d2d2d]/70 mt-1">Share what you’ve tried</p>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>
            )}

            {createStep === 2 && (
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary"
                    className={`${createType==='question' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-purple-100 text-purple-700 border-purple-200'}`}
                  >
                    {createType==='question' ? '🤔 Question' : '✨ Experience'}
                  </Badge>
                  <button className="text-xs text-[#A7DADC] hover:underline" onClick={() => setCreateStep(1)}>Change</button>
                </div>
                {createType==='experience' && (
                  <Input
                    placeholder="Title (optional)"
                    value={createTitle}
                    onChange={(e) => setCreateTitle(e.target.value)}
                    className="border-[#A7DADC]/30 focus:border-[#A7DADC] focus:ring-2 focus:ring-[#A7DADC]/20"
                  />
                )}
                <Textarea
                  placeholder={createType==='question' ? 'What do you want to ask?' : 'Share your experience...'}
                  value={createContent}
                  onChange={(e) => setCreateContent(e.target.value)}
                  className="min-h-[140px] border-[#A7DADC]/30 focus:border-[#A7DADC] focus:ring-2 focus:ring-[#A7DADC]/20"
                />
                
                {/* Image Upload Section */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[#2d2d2d]">Add an image (optional)</label>
                  {!createImagePreview ? (
                    <div className="border-2 border-dashed border-[#A7DADC]/30 rounded-lg p-6 text-center hover:border-[#A7DADC]/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD1DC]/20 to-[#A7DADC]/20 flex items-center justify-center">
                          <Plus className="h-6 w-6 text-[#A7DADC]" />
                        </div>
                        <span className="text-sm text-[#2d2d2d]/70">Click to upload an image</span>
                        <span className="text-xs text-[#2d2d2d]/50">PNG, JPG up to 5MB</span>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={createImagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" className="border-[#A7DADC]/30" onClick={() => setShowCreateModal(false)} disabled={isCreatingPost}>Cancel</Button>
                  <Button onClick={submitCreatePost} disabled={!createContent.trim() || isCreatingPost} className="bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90">
                    {isCreatingPost ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2d2d2d] mr-1"></div>
                    ) : (
                      <Send className="h-4 w-4 mr-1" />
                    )}
                    {isCreatingPost ? 'Creating...' : 'Post'}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Edit Post Modal */}
      {showEditModal && editPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeEditModal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-display text-xl text-[#2d2d2d]">Edit post</h3>
              <button className="p-2 hover:bg-gray-100 rounded-full" onClick={closeEditModal}>
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary"
                  className={`${editType==='question' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-purple-100 text-purple-700 border-purple-200'}`}
                >
                  {editType==='question' ? '🤔 Question' : '✨ Experience'}
                </Badge>
                <button className="text-xs text-[#A7DADC] hover:underline" onClick={() => {
                  // Toggle between question and experience
                  setEditType(editType === 'question' ? 'experience' : 'question');
                }}>Change type</button>
              </div>
              
              {editType==='experience' && (
                <Input
                  placeholder="Title (optional)"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border-[#A7DADC]/30 focus:border-[#A7DADC] focus:ring-2 focus:ring-[#A7DADC]/20"
                />
              )}
              
              <Textarea
                placeholder={editType==='question' ? 'What do you want to ask?' : 'Share your experience...'}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[140px] border-[#A7DADC]/30 focus:border-[#A7DADC] focus:ring-2 focus:ring-[#A7DADC]/20"
              />
              
              {/* Current Image Display */}
              {editPost.image && editPost.image.path && !editImagePreview && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2d2d2d]">Current image</label>
                  <div className="relative">
                    <img
                      src={editPost.image.path}
                      alt={editPost.image.filename || "Current image"}
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-5 flex gap-1">
                      <button
                        onClick={() => {
                          // Trigger file picker
                          document.getElementById('edit-image-upload').click();
                        }}
                        className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                        title="Change image"
                      >
                        <Pen className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          // Delete current image using the main component's delete function
                          deletePostImage(editPost._id);
                          // Update edit post state
                          setEditPost({ ...editPost, image: undefined });
                        }}
                        disabled={isDeletingImage}
                        className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50"
                        title="Delete image"
                      >
                        {isDeletingImage ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* New Image Preview */}
              {editImagePreview && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2d2d2d]">New image preview</label>
                  <div className="relative">
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-3 right-5 flex gap-1">
                      <button
                        onClick={() => {
                          // Trigger file picker to change image
                          document.getElementById('edit-image-upload').click();
                        }}
                        className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                        title="Change image"
                      >
                        <Pen className="h-4 w-4" />
                      </button>
                      <button
                        onClick={removeEditImage}
                        className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Image Upload Section - Only show when no current image */}
              {(!editPost.image || !editPost.image.path) && !editImagePreview && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[#2d2d2d]">Add an image (optional)</label>
                  <div className="border-2 border-dashed border-[#A7DADC]/30 rounded-lg p-6 text-center hover:border-[#A7DADC]/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageSelect}
                      className="hidden"
                      id="edit-image-upload"
                    />
                    <label
                      htmlFor="edit-image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD1DC]/20 to-[#A7DADC]/20 flex items-center justify-center">
                        <Plus className="h-6 w-6 text-[#A7DADC]" />
                      </div>
                      <span className="text-sm text-[#2d2d2d]/70">Click to upload an image</span>
                      <span className="text-xs text-[#2d2d2d]/50">PNG, JPG up to 5MB</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Hidden file input for when there is an image */}
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageSelect}
                className="hidden"
                id="edit-image-upload"
              />
              
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" className="border-[#A7DADC]/30" onClick={closeEditModal} disabled={isUpdatingPost}>Cancel</Button>
                <Button onClick={submitEditPost} disabled={!editContent.trim() || isUpdatingPost} className="bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90">
                  {isUpdatingPost ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2d2d2d] mr-1"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-1" />
                  )}
                  {isUpdatingPost ? 'Updating...' : 'Update Post'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const PostItem = ({ post, onToggleLike, onDeletePost, onEditPost, onDeleteImage, onCommentCountChange, loadingImages, setLoadingImages }) => {
  const [showComments, setShowComments] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const actionsRef = useRef(null);
  const imageTimeoutRef = useRef(null);
  const imageRef = useRef(null);
  const { user } = useContext(AuthContext);
  
  const isLikedByUser = post.likes?.some(like => like.toString() === user?._id?.toString());
  const likeCount = post.likes?.length || 0;
  const isAuthor = user?._id?.toString() === post.author?._id?.toString();

  const handleEdit = () => {
    onEditPost(post);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
    setImageLoading(false);
    // Clear timeout if image loads successfully
    if (imageTimeoutRef.current) {
      clearTimeout(imageTimeoutRef.current);
      imageTimeoutRef.current = null;
    }
    // Remove from global loading state
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(post._id);
      return newSet;
    });
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
    // Clear timeout if image errors
    if (imageTimeoutRef.current) {
      clearTimeout(imageTimeoutRef.current);
      imageTimeoutRef.current = null;
    }
    // Remove from global loading state
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(post._id);
      return newSet;
    });
  };

  // Intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const currentImageRef = imageRef.current;
    if (currentImageRef) {
      observer.observe(currentImageRef);
    }

    return () => {
      if (currentImageRef) {
        observer.unobserve(currentImageRef);
      }
    };
  }, []);

  // Initialize image loading state when component mounts and is in view
  useEffect(() => {
    if (post.image && post.image.path && isInView) {
      setImageLoading(true);
      setImageError(false);
      
      // Add to global loading state
      setLoadingImages(prev => new Set([...prev, post._id]));
      
      // Set timeout for image loading (10 seconds)
      imageTimeoutRef.current = setTimeout(() => {
        setImageError(true);
        setImageLoading(false);
        setLoadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(post._id);
          return newSet;
        });
      }, 10000);
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (imageTimeoutRef.current) {
        clearTimeout(imageTimeoutRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post._id, post.image?.path, isInView, setLoadingImages]); // Use post.image?.path to avoid infinite loops


  const triggerHeartAnimation = () => {
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 600);
  };

  const handleLike = () => {
    triggerHeartAnimation();
    onToggleLike(post._id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  return (
    <>
      <Card className="p-4 border border-gray-100 shadow-sm bg-white hover:shadow-md transition-all duration-300 group rounded-xl">
      {/* Main Body */}
      <div>
          {/* Header */}
          <div className="flex items-start justify-between mb-2 relative">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-sm font-medium text-[#2d2d2d]">{post.author?.name || post.author?.username}</span>
                <span className="text-xs text-[#2d2d2d]/50">•</span>
                <span className="text-xs text-[#2d2d2d]/60">
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                <Badge 
                  variant="secondary" 
                  className={`ml-2 text-xs ${post.type === 'question' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-purple-100 text-purple-700 border-purple-200'}`}
                >
                  {post.type === 'question' ? '🤔 Question' : '✨ Experience'}
                </Badge>
              </div>
            </div>
            {isAuthor ? (
              <div className="relative" ref={actionsRef}>
                <button 
                  onClick={() => setShowActions((v) => !v)}
                  className="px-2 py-1 rounded-full text-[#2d2d2d]/60 hover:bg-gray-100 transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={showActions}
                  title="More actions"
                >
                  <MoreHorizontal className="h-4 w-4 text-[#2d2d2d]/60" />
                </button>
                {showActions && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                    <button 
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => { setShowActions(false); handleEdit(); }}
                    >
                      Edit
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => { setShowActions(false); handleDelete(); }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Title & Content */}
          {post.title && (
            <h3 className="font-display text-lg text-[#2d2d2d] mb-1">{post.title}</h3>
          )}
          <div className="text-[#2d2d2d]/80 leading-relaxed whitespace-pre-wrap mb-2">{post.content}</div>
          {post.image && post.image.path && (
            <div className="mt-3 relative" ref={imageRef}>
              {/* Placeholder when not in view */}
              {!isInView && (
                <div className="w-full max-w-md h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm text-gray-400">Image will load when visible</span>
                </div>
              )}
              
              {/* Loading state */}
              {isInView && imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A7DADC]"></div>
                    <span className="text-sm text-gray-500">Loading image...</span>
                  </div>
                </div>
              )}
              
              {/* Error state */}
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-sm">Failed to load image</span>
                    <button 
                      onClick={() => {
                        setImageError(false);
                        setImageLoading(true);
                        // Retry loading
                        const img = new Image();
                        img.onload = handleImageLoad;
                        img.onerror = handleImageError;
                        img.src = post.image.path;
                      }}
                      className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
              
              {/* Image - only render when in view */}
              {isInView && (
                <img
                  src={post.image.path}
                  alt={post.image.filename || "Post image"}
                  className={`w-full max-w-md h-auto rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  } ${imageError ? 'opacity-0' : ''}`}
                  onClick={() => window.open(post.image.path, '_blank')}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button 
              className="flex items-center gap-2 text-[#2d2d2d]/70 hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors"
              onClick={handleLike}
            >
              <motion.div
                animate={isHeartAnimating ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart className={`h-4 w-4 ${isLikedByUser ? 'text-red-500 fill-red-500' : ''}`} />
              </motion.div>
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
            <button 
              className="flex items-center gap-2 text-[#2d2d2d]/70 hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors"
              onClick={() => setShowComments((v) => !v)}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">{post.commentsCount || 0} Comments</span>
            </button>
          </div>

        {/* Comments */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3"
            >
                <Comments postId={post._id} onCommentCountChange={onCommentCountChange} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
    {showDeleteModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowDeleteModal(false)}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
          <h4 className="font-display text-lg text-[#2d2d2d] mb-2">Delete post?</h4>
          <p className="text-sm text-[#2d2d2d]/70 mb-4">This action cannot be undone.</p>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" className="border-[#A7DADC]/30" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => { setShowDeleteModal(false); onDeletePost(post._id); }}>Delete</Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

const Comments = ({ postId, onCommentCountChange }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [heartAnimations, setHeartAnimations] = useState({});
  const [newCommentIds, setNewCommentIds] = useState(new Set());
  const menuRefs = useRef({});
  const { user } = useContext(AuthContext);
  
  const COMMENTS_CAP = 5; // Show only 5 comments initially

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await communityService.listComments(postId, { page: 1, limit: 50 });
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    load();
  }, [load]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is on a button inside the dropdown
      if (event.target.closest('button[aria-haspopup="menu"]') || 
          event.target.closest('.dropdown-menu')) {
        return; // Don't close if clicking on the menu button or dropdown content
      }
      
      Object.values(menuRefs.current).forEach(ref => {
        if (ref && !ref.contains(event.target)) {
          setOpenMenuId(null);
        }
      });
    };

    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!user) { window.location.href = `/login?redirect=${encodeURIComponent('/community')}`; return; }
    
    const commentText = text.trim();
    setText("");
    
    // Optimistic update - add comment to local state immediately
    const newComment = {
      _id: `temp-${Date.now()}`, // temporary ID
      content: commentText,
      author: { _id: user._id, name: user.name, username: user.username },
      createdAt: new Date().toISOString(),
      likes: []
    };
    
    setItems(prevItems => [...prevItems, newComment]);
    setNewCommentIds(prev => new Set([...prev, newComment._id]));
    
    // Update parent post's comment count
    if (onCommentCountChange) {
      onCommentCountChange(postId, 1);
    }
    
    // Silent backend update
    try {
      const response = await communityService.createComment(postId, { content: commentText });
      // Replace temporary comment with real one from backend
      if (response.data) {
        const real = response.data;
        setItems(prevItems => 
          prevItems.map(comment => 
            comment._id === newComment._id ? real : comment
          )
        );
        // Keep it highlighted and pinned until component unmounts/toggles
        setNewCommentIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(newComment._id);
          newSet.add(real._id);
          return newSet;
        });
      }
    } catch (error) {
      // Revert on error
      setItems(prevItems => prevItems.filter(comment => comment._id !== newComment._id));
      setNewCommentIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(newComment._id);
        return newSet;
      });
      if (onCommentCountChange) {
        onCommentCountChange(postId, -1);
      }
    }
  };

  const triggerHeartAnimation = (commentId) => {
    setHeartAnimations(prev => ({ ...prev, [commentId]: true }));
    setTimeout(() => {
      setHeartAnimations(prev => ({ ...prev, [commentId]: false }));
    }, 600);
  };

  const like = async (commentId) => {
    if (!user) { window.location.href = `/login?redirect=${encodeURIComponent('/community')}`; return; }
    
    // Trigger heart animation
    triggerHeartAnimation(commentId);
    
    // Optimistic update
    setItems(prevItems => 
      prevItems.map(comment => {
        if (comment._id === commentId) {
          const isLiked = comment.likes?.some(like => like.toString() === user._id.toString());
          const newLikes = isLiked 
            ? comment.likes.filter(like => like.toString() !== user._id.toString())
            : [...(comment.likes || []), user._id];
          
          return {
            ...comment,
            likes: newLikes
          };
        }
        return comment;
      })
    );
    
    // Silent backend update
    try {
      await communityService.toggleCommentLike(commentId);
    } catch (error) {
      // Revert on error
      setItems(prevItems => 
        prevItems.map(comment => {
          if (comment._id === commentId) {
            const isLiked = comment.likes?.some(like => like.toString() === user._id.toString());
            const revertedLikes = isLiked 
              ? comment.likes.filter(like => like.toString() !== user._id.toString())
              : [...(comment.likes || []), user._id];
            
            return {
              ...comment,
              likes: revertedLikes
            };
          }
          return comment;
        })
      );
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    
    // Optimistic update
    setItems(prevItems => 
      prevItems.map(comment => 
        comment._id === editingComment 
          ? { ...comment, content: editText }
          : comment
      )
    );
    
    // Silent backend update
    try {
      await communityService.updateComment(editingComment, { content: editText });
    } catch (error) {
      // Revert on error
      load();
    }
    
    setEditingComment(null);
    setEditText("");
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText("");
  };

  const handleDeleteComment = async (commentId) => {
    // Optimistic update
    setItems(prevItems => prevItems.filter(comment => comment._id !== commentId));
    if (onCommentCountChange) {
      onCommentCountChange(postId, -1);
    }
    
    // Silent backend update
    try {
      await communityService.deleteComment(commentId);
    } catch (error) {
      // Revert on error
      load();
      if (onCommentCountChange) {
        onCommentCountChange(postId, 1);
      }
    }
  };

  return (
    <>
      <div className="space-y-4">

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#A7DADC]"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {(() => {
            if (showAllComments) {
              return items;
            }
            const base = items.slice(0, COMMENTS_CAP);
            // Always ensure the newest just-posted comment is visible within the cap
            const newestNew = [...items].reverse().find(c => newCommentIds.has(c._id));
            if (newestNew && !base.some(b => b._id === newestNew._id)) {
              if (base.length < COMMENTS_CAP) {
                return [...base, newestNew];
              }
              return [...base.slice(0, COMMENTS_CAP - 1), newestNew];
            }
            return base;
          })().map((c) => {
            const isCommentAuthor = user?._id?.toString() === c.author?._id?.toString();
            const isEditing = editingComment === c._id;
            const isHeartAnimating = heartAnimations[c._id];
            const isNewComment = newCommentIds.has(c._id);
            
            return (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 p-3 rounded-lg hover:bg-gray-50/50 transition-colors group ${
                  isNewComment ? 'bg-gradient-to-r from-[#FFD1DC]/10 to-[#A7DADC]/10 border border-[#A7DADC]/30' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD1DC]/20 to-[#A7DADC]/20 flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-[#A7DADC]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#2d2d2d]">{c.author?.name || c.author?.username}</span>
                      <span className="text-xs text-[#2d2d2d]/60">
                        {new Date(c.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {isCommentAuthor && !isEditing && (
                      <div className="relative" ref={el => menuRefs.current[c._id] = el}>
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === c._id ? null : c._id)}
                          className="px-2 py-1 rounded-full text-xs text-[#2d2d2d]/60 hover:bg-gray-100 transition-colors"
                          aria-haspopup="menu"
                          aria-expanded={openMenuId === c._id}
                          title="More actions"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5 text-[#2d2d2d]/60" />
                        </button>
                        {openMenuId === c._id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50 dropdown-menu">
                            <button 
                              className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                              onClick={() => { 
                                setOpenMenuId(null); 
                                handleEditComment(c); 
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                              onClick={() => { 
                                setOpenMenuId(null); 
                                setConfirmDeleteId(c._id); 
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="min-h-[60px] text-sm border-[#A7DADC]/30 focus:border-[#A7DADC] focus:ring-2 focus:ring-[#A7DADC]/20"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={handleSaveEdit}
                          size="sm"
                          className="bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90 h-7 px-3"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          size="sm"
                          className="border-[#A7DADC]/30 h-7 px-3"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-[#2d2d2d]/80 leading-relaxed">{c.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button 
                          className="flex items-center gap-1 text-xs text-[#2d2d2d]/60 hover:text-[#A7DADC] transition-colors"
                          onClick={() => like(c._id)}
                        >
                          <motion.div
                            animate={isHeartAnimating ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            <Heart className={`h-3 w-3 ${
                              c.likes?.some(like => like.toString() === user?._id?.toString()) 
                                ? 'text-red-500 fill-red-500' 
                                : ''
                            }`} />
                          </motion.div>
                          <span>{c.likes?.length || 0}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
          {!items.length && (
            <div className="text-center py-8 text-[#2d2d2d]/60">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No comments yet. Be the first to comment!</p>
            </div>
          )}
          {items.length > COMMENTS_CAP && !showAllComments && (
            <div className="text-center py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllComments(true)}
                className="border-[#A7DADC]/30 text-[#A7DADC] hover:bg-[#A7DADC]/10"
              >
                View {items.length - COMMENTS_CAP} more comments
              </Button>
            </div>
          )}
          {showAllComments && items.length > COMMENTS_CAP && (
            <div className="text-center py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllComments(false)}
                className="border-[#A7DADC]/30 text-[#A7DADC] hover:bg-[#A7DADC]/10"
              >
                Show less
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Comment Input - Always visible at bottom */}
      <div className="bg-gradient-to-r from-[#FFD1DC]/5 to-[#A7DADC]/5 rounded-xl p-4 mt-4">
        <form onSubmit={submit} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD1DC] to-[#A7DADC] flex items-center justify-center flex-shrink-0">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <Input 
              placeholder={user ? "Add a comment..." : "Log in to comment..."}
              value={text} 
              onChange={(e) => setText(e.target.value)}
              className="border-[#A7DADC]/30 focus:border-[#A7DADC] focus:ring-2 focus:ring-[#A7DADC]/20"
            />
          </div>
          <Button 
            type="submit" 
            disabled={!text.trim() || !user}
            className="bg-gradient-to-r from-[#FFD1DC] to-[#A7DADC] text-[#2d2d2d] hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setConfirmDeleteId(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-display text-lg text-[#2d2d2d] mb-2">Delete comment?</h4>
            <p className="text-sm text-[#2d2d2d]/70 mb-4">This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" className="border-[#A7DADC]/30" onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => { const id = confirmDeleteId; setConfirmDeleteId(null); handleDeleteComment(id); }}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


