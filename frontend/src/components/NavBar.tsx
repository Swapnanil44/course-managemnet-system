import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, LayoutDashboard, BookOpen, Command } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Helper to get initials
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 1. Logo / Brand: Matching the Login Page Style */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 group-hover:bg-zinc-800 transition-colors">
            <Command className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-zinc-900">
            Courses
          </span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {/* Role-Based Links - Minimalist Text Links */}
              <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                {user.role === "INSTRUCTOR" ? (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/courses"
                    className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    <BookOpen className="h-4 w-4" />
                    My Courses
                  </Link>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="flex items-center gap-4 pl-6 border-l border-zinc-200">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full ring-offset-2 hover:ring-2 hover:ring-zinc-200 transition-all p-0"
                    >
                      <Avatar className="h-9 w-9 border border-zinc-200">
                        <AvatarImage src="" alt={user.name} />
                        <AvatarFallback className="bg-zinc-100 text-zinc-900 text-xs font-bold">
                          {getInitials(user.name || user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-zinc-900">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-zinc-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      {user.role === "INSTRUCTOR" ? (
                        <Link to="/dashboard" className="cursor-pointer">
                          Dashboard
                        </Link>
                      ) : (
                        <Link to="/courses" className="cursor-pointer">
                          My Courses
                        </Link>
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            /* Guest View */
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Log in
              </Link>
              <Link to="/register">
                <Button className="h-9 rounded-lg bg-zinc-900 text-sm font-semibold text-white shadow-md hover:bg-zinc-800 transition-all">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
