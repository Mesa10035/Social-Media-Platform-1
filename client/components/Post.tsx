import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { postAPI, followAPI, userAPI } from "@/services/api";
import { toast } from "sonner";
import CommentSection from "./CommentSection";
import {
  Heart,
  MessageCircle,
  Trash2,
  Share2,
  MoreVertical,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostProps {
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
  onDelete?: (postId: string) => void;
}

export default function Post({
  _id,
  userId,
  content,
  image,
  likes,
  commentsCount,
  createdAt,
  onDelete,
}: PostProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(likes.includes(user?.id || ""));
  const [likeCount, setLikeCount] = useState(likes.length);
  const [showComments, setShowComments] = useState(false);
  const [isFollowing, setIsFollowing] = useState(
    user?.following.includes(userId._id) || false
  );
  const [commentsCount_, setCommentsCount_] = useState(commentsCount);

  const formatDate = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return postDate.toLocaleDateString();
  };

  const handleLike = async () => {
    try {
      await postAPI.likePost(_id);
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      toast.error("Failed to like post");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await postAPI.deletePost(_id);
      toast.success("Post deleted successfully");
      onDelete?.(_id);
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await followAPI.unfollowUser(userId._id);
        setIsFollowing(false);
        toast.success("Unfollowed");
      } else {
        await followAPI.followUser(userId._id);
        setIsFollowing(true);
        toast.success("Followed");
      }
    } catch (error) {
      toast.error("Failed to update follow status");
    }
  };

  const handleShare = async () => {
    try {
      const postUrl = `${window.location.origin}/feed`;
      const text = `Check out this post by @${userId.username}: "${content}"`;

      // Copy to clipboard
      await navigator.clipboard.writeText(`${text}\n\n${postUrl}`);
      toast.success("Post link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to share post");
    }
  };

  const handleCommentAdded = () => {
    setCommentsCount_(commentsCount_ + 1);
  };

  return (
    <div className="bg-card border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all animate-slide-up">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate(`/profile/${userId._id}`)}
        >
          <img
            src={userId.profilePic}
            alt={userId.username}
            className="w-12 h-12 rounded-full border border-white/20"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground hover:text-purple-400 transition-colors">
              {userId.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              @{userId.username} · {formatDate(createdAt)}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex gap-1">
          {user?.id !== userId._id && (
            <button
              onClick={handleFollow}
              className={`p-2 rounded-lg transition-colors ${
                isFollowing
                  ? "hover:bg-red-600/10 text-red-400"
                  : "hover:bg-purple-600/10 text-purple-400"
              }`}
              title={isFollowing ? "Unfollow" : "Follow"}
            >
              {isFollowing ? (
                <UserCheck className="w-5 h-5" />
              ) : (
                <UserPlus className="w-5 h-5" />
              )}
            </button>
          )}

          {user?.id === userId._id && (
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-red-600/10 rounded-lg transition-colors"
              title="Delete post"
            >
              <Trash2 className="w-5 h-5 text-red-400" />
            </button>
          )}

          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-foreground mb-4 leading-relaxed">{content}</p>

      {/* Post Image */}
      {image && (
        <div className="mb-4 rounded-lg overflow-hidden border border-white/10">
          <img
            src={image}
            alt="Post"
            className="w-full h-auto object-cover max-h-96"
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground mb-4 py-3 border-y border-white/10">
        <button className="hover:text-cyan-400 transition-colors font-medium">
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </button>
        <button className="hover:text-cyan-400 transition-colors font-medium">
          {commentsCount_} {commentsCount_ === 1 ? "comment" : "comments"}
        </button>
      </div>

      {/* Post Actions */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={handleLike}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all font-medium ${
            isLiked
              ? "bg-pink-600/20 text-pink-400 border border-pink-500/30"
              : "hover:bg-white/5 text-muted-foreground border border-white/10"
          }`}
        >
          <Heart
            className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
          />
          <span className="text-sm">Like</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all font-medium ${
            showComments
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "hover:bg-white/5 text-muted-foreground border border-white/10"
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">Comment</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-white/5 text-muted-foreground transition-all font-medium border border-white/10"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          postId={_id}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
}
