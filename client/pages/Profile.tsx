import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { userAPI, postAPI, followAPI } from "@/services/api";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Post from "@/components/Post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart,
  MapPin,
  Link as LinkIcon,
  Edit2,
  ArrowLeft,
  Users,
} from "lucide-react";

interface ProfileUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  profilePic: string;
  followers: any[];
  following: any[];
  createdAt: string;
}

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    bio: "",
    profilePic: "",
  });

  const isOwnProfile = userId === currentUser?.id;

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const [profileRes, postsRes] = await Promise.all([
        userAPI.getUserById(userId!),
        postAPI.getUserPosts(userId!),
      ]);

      setProfile(profileRes.data);
      setPosts(postsRes.data);
      setIsFollowing(
        profileRes.data.followers.some(
          (f: any) => f._id === currentUser?.id
        )
      );

      if (isOwnProfile) {
        setEditData({
          name: profileRes.data.name,
          bio: profileRes.data.bio,
          profilePic: profileRes.data.profilePic,
        });
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await followAPI.unfollowUser(userId!);
        setIsFollowing(false);
        toast.success("Unfollowed successfully");
      } else {
        await followAPI.followUser(userId!);
        setIsFollowing(true);
        toast.success("Followed successfully");
      }

      // Reload profile to get updated follower count
      await loadProfile();
    } catch (error) {
      console.error("Failed to update follow status:", error);
      toast.error("Failed to update follow status");
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await userAPI.updateProfile(editData);
      setProfile(response.data);
      updateUser({
        ...currentUser!,
        name: response.data.name,
        bio: response.data.bio,
        profilePic: response.data.profilePic,
      });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="md:ml-64 flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="md:ml-64 flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-muted-foreground">Profile not found</p>
            <Button onClick={() => navigate("/feed")} className="mt-4">
              Back to Feed
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Top Padding for Mobile */}
        <div className="md:hidden h-16"></div>

        <div className="max-w-2xl mx-auto p-4 md:p-6">
          {/* Back Button */}
          <button
            onClick={() => navigate("/feed")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {/* Profile Card */}
          <div className="bg-card border border-white/10 rounded-xl overflow-hidden mb-6 animate-fade-in">
            {/* Cover */}
            <div className="h-32 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 border-b border-white/10"></div>

            {/* Profile Info */}
            <div className="p-6 -mt-16 relative">
              {/* Avatar */}
              <div className="relative mb-4 w-fit">
                <img
                  src={profile.profilePic}
                  alt={profile.username}
                  className="w-32 h-32 rounded-full border-4 border-card shadow-lg"
                />
              </div>

              {/* Profile Details */}
              {isEditing && isOwnProfile ? (
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">
                      Name
                    </label>
                    <Input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="bg-white/5 border border-white/10 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">
                      Bio
                    </label>
                    <Input
                      type="text"
                      value={editData.bio}
                      onChange={(e) =>
                        setEditData({ ...editData, bio: e.target.value })
                      }
                      className="bg-white/5 border border-white/10 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">
                      Profile Picture URL
                    </label>
                    <Input
                      type="text"
                      value={editData.profilePic}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          profilePic: e.target.value,
                        })
                      }
                      className="bg-white/5 border border-white/10 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      className="gradient-btn text-white"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="bg-white/5 border-white/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-foreground">
                      {profile.name}
                    </h1>
                    <p className="text-muted-foreground">@{profile.username}</p>
                    {profile.bio && (
                      <p className="text-foreground mt-2">{profile.bio}</p>
                    )}
                    <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {profile.followers?.length || 0} followers
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>
                          {profile.following?.length || 0} following
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {isOwnProfile ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-foreground"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <Button
                        onClick={handleFollow}
                        className={
                          isFollowing
                            ? "bg-white/5 border border-white/10 text-foreground hover:bg-white/10"
                            : "gradient-btn text-white"
                        }
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Posts Section */}
          <div>
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Posts
            </h2>
            {posts.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-white/10">
                <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  {isOwnProfile ? "You haven't posted yet" : "No posts yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <Post key={post._id} {...post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
