import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { postAPI, userAPI, followAPI } from "@/services/api";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Post from "@/components/Post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Image as ImageIcon, X, Users } from "lucide-react";

interface Post {
  _id: string;
  userId: {
    _id: string;
    username: string;
    name: string;
    profilePic: string;
  };
  content: string;
  image: string;
  likes: string[];
  commentsCount: number;
  createdAt: string;
}

interface User {
  _id: string;
  username: string;
  name: string;
  profilePic: string;
  bio: string;
  followers: string[];
  following: string[];
}

export default function Feed() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [followingSet, setFollowingSet] = useState<Set<string>>(
    new Set(user?.following || [])
  );

  useEffect(() => {
    loadFeed();
    loadSuggestedUsers();
  }, []);

  const loadFeed = async () => {
    try {
      setIsLoading(true);
      const response = await postAPI.getFeed();
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to load feed:", error);
      toast.error("Failed to load feed");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSuggestedUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      const currentUserFollowing = new Set(user?.following || []);
      const filtered = response.data.filter(
        (u: User) => u._id !== user?.id && !currentUserFollowing.has(u._id)
      );
      setSuggestedUsers(filtered.slice(0, 5));
    } catch (error) {
      console.error("Failed to load suggested users:", error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const newPost = await postAPI.createPost({
        content: postContent,
        image: postImage,
      });
      setPosts([newPost.data, ...posts]);
      setPostContent("");
      setPostImage("");
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  const handleFollowUser = async (userId: string, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        await followAPI.unfollowUser(userId);
        setFollowingSet((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
        toast.success("Unfollowed");
      } else {
        await followAPI.followUser(userId);
        setFollowingSet((prev) => {
          const next = new Set(prev);
          next.add(userId);
          return next;
        });
        toast.success("Followed");
      }

      // Reload suggested users
      loadSuggestedUsers();
    } catch (error) {
      console.error("Failed to follow/unfollow:", error);
      toast.error("Failed to update follow status");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Top Padding for Mobile */}
        <div className="md:hidden h-16"></div>

        <div className="max-w-5xl mx-auto p-4 md:p-6">
          <div className="flex gap-6">
            {/* Feed Section */}
            <div className="flex-1 min-w-0">
              {/* Create Post Card */}
              <div className="bg-card border border-white/10 rounded-xl p-6 mb-6 animate-fade-in">
                <div className="flex gap-4 mb-4">
                  <img
                    src={user?.profilePic}
                    alt={user?.username}
                    className="w-12 h-12 rounded-full border border-white/20 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="What's on your mind?"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg w-full mb-2"
                      disabled={isSubmitting}
                    />
                    {postImage && (
                      <div className="mb-3 relative inline-block">
                        <img
                          src={postImage}
                          alt="preview"
                          className="max-h-32 rounded-lg border border-white/10"
                        />
                        <button
                          onClick={() => setPostImage("")}
                          className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 hover:bg-red-700 transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const url = prompt("Enter image URL:");
                        if (url) setPostImage(url);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-sm">Image</span>
                    </button>
                  </div>
                  <Button
                    onClick={handleCreatePost}
                    disabled={!postContent.trim() || isSubmitting}
                    className="gradient-btn text-white font-semibold"
                  >
                    {isSubmitting ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>

              {/* Posts Section */}
              <div className="space-y-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                    <p className="text-muted-foreground">Loading feed...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-xl border border-white/10">
                    <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground">
                      No posts yet. Follow some users to see their posts!
                    </p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <Post
                      key={post._id}
                      {...post}
                      onDelete={handleDeletePost}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Sidebar - Suggested Users */}
            <div className="hidden lg:block w-72">
              <div className="bg-card border border-white/10 rounded-xl p-6 sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Suggested Users
                  </h2>
                </div>

                <div className="space-y-3">
                  {suggestedUsers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      You're following everyone!
                    </p>
                  ) : (
                    suggestedUsers.map((suggestedUser) => {
                      const isFollowingUser = followingSet.has(suggestedUser._id);
                      return (
                        <div
                          key={suggestedUser._id}
                          className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors group"
                        >
                          <div
                            className="flex items-center gap-3 flex-1 cursor-pointer"
                            onClick={() => navigate(`/profile/${suggestedUser._id}`)}
                          >
                            <img
                              src={suggestedUser.profilePic}
                              alt={suggestedUser.username}
                              className="w-10 h-10 rounded-full border border-white/20 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-foreground truncate">
                                {suggestedUser.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                @{suggestedUser.username}
                              </p>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            onClick={() =>
                              handleFollowUser(suggestedUser._id, isFollowingUser)
                            }
                            className={
                              isFollowingUser
                                ? "bg-white/5 hover:bg-red-600/10 text-red-400 border border-red-500/30 text-xs whitespace-nowrap"
                                : "gradient-btn text-white text-xs whitespace-nowrap"
                            }
                          >
                            {isFollowingUser ? "Following" : "Follow"}
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
