import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { commentAPI } from "@/services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Send } from "lucide-react";

interface Comment {
  _id: string;
  userId: {
    _id: string;
    username: string;
    name: string;
    profilePic: string;
  };
  text: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
  onCommentAdded?: () => void;
}

export default function CommentSection({
  postId,
  onCommentAdded,
}: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const response = await commentAPI.getComments(postId);
      setComments(response.data);
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await commentAPI.addComment(postId, { text: commentText });
      setCommentText("");
      loadComments();
      onCommentAdded?.();
      toast.success("Comment added");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await commentAPI.deleteComment(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
      loadComments();
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;

    return commentDate.toLocaleDateString();
  };

  return (
    <div className="space-y-4 pt-4 border-t border-white/10">
      {/* Comments List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            No comments yet
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="flex gap-2 group hover:bg-white/5 p-2 rounded-lg transition-colors"
            >
              <img
                src={comment.userId.profilePic}
                alt={comment.userId.username}
                className="w-7 h-7 rounded-full border border-white/20 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-foreground">
                    {comment.userId.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @{comment.userId.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
                <p className="text-sm text-foreground mt-1">{comment.text}</p>
              </div>

              {user?.id === comment.userId._id && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600/10 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="flex gap-2">
        <img
          src={user?.profilePic}
          alt={user?.username}
          className="w-7 h-7 rounded-full border border-white/20 flex-shrink-0"
        />
        <div className="flex-1 flex gap-1">
          <Input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={isSubmitting}
            className="bg-white/5 border border-white/10 rounded-lg text-sm h-8"
          />
          <Button
            type="submit"
            disabled={isSubmitting || !commentText.trim()}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white h-8"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </form>
    </div>
  );
}
