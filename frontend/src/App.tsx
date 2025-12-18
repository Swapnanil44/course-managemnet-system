import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import InstructorDashboard from "./pages/InstructorDashboard";
import Navbar from "./components/NavBar";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import StudentCourses from "./pages/StudentCourses";
import InstructorCourseManager from "./pages/InstructorCourseManager";

const Unauthorized = () => <h1>403 - Unauthorized</h1>;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Instructor only routes */}
            <Route element={<ProtectedRoute allowedRoles={["INSTRUCTOR"]} />}>
              <Route path="/dashboard" element={<InstructorDashboard />} />
              <Route
                path="/dashboard/courses/:id"
                element={<InstructorCourseManager />}
              />
            </Route>

            {/* User only routes */}
            <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
              <Route path="/courses" element={<StudentCourses />} />
              <Route path="/courses/:id" element={<CourseDetailsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
