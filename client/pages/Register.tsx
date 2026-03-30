import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { authAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { Heart } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      login(response.data.user, response.data.token);
      toast.success("Account created successfully!");
      navigate("/feed");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-pink-900/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
              Join SocialHub
            </h1>
            <p className="text-muted-foreground">Create your account today</p>
          </div>

          {/* Register Form Card */}
          <div className="glass p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-white/5 border border-white/10 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30"
                />
              </div>

              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Username
                </label>
                <Input
                  type="text"
                  name="username"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-white/5 border border-white/10 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-white/5 border border-white/10 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-white/5 border border-white/10 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30"
                />
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-white/5 border border-white/10 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-btn font-semibold text-white py-2 rounded-lg"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">or</span>
              </div>
            </div>

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-pink-400 hover:text-pink-300 transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
