import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  MessageCircle,
  User,
  LogOut,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      label: "Feed",
      path: "/feed",
      icon: Home,
    },
    {
      label: "Chat",
      path: "/chat",
      icon: MessageCircle,
    },
    {
      label: "Profile",
      path: `/profile/${user?.id}`,
      icon: User,
    },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:bg-card md:border-r md:border-white/10 md:flex md:flex-col md:p-6 md:z-40">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate("/feed")}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              SocialHub
            </h1>
            <p className="text-xs text-muted-foreground">Connect & Share</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "text-muted-foreground hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Info & Logout */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-muted-foreground mb-1">Logged in as</p>
            <p className="font-semibold text-sm text-foreground truncate">
              @{user?.username}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-red-600/10 text-red-400 border border-red-500/30 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-card border-b border-white/10 p-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
            SocialHub
          </h1>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-white/5 rounded-lg"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-card border-b border-white/10 p-4 space-y-2 z-40">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "text-muted-foreground hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
          <Button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-red-600/10 text-red-400 border border-red-500/30 rounded-lg mt-4"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      )}
    </>
  );
}
