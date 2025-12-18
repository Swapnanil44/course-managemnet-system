import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, BookOpen, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Ensure path matches your setup

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Helper to get initials
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="border-b bg-white px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
          <BookOpen className="h-6 w-6" />
          <span>Courses</span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {/* Role-Based Links */}
              <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
                {user.role === 'INSTRUCTOR' ? (
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                ) : (
                  <Link 
                    to="/courses" 
                    className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                  >
                    <BookOpen size={18} />
                    My Courses
                  </Link>
                )}
              </div>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-4 border-l pl-4">
                <div className="flex items-center gap-3">
                  <span className="hidden text-sm font-medium text-gray-700 md:block">
                    {user.name || user.email}
                  </span>
                  
                  <Avatar className="h-9 w-9 cursor-pointer bg-slate-100">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-medium">
                      {getInitials(user.name || user.email)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </>
          ) : (
            /* Guest View */
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}