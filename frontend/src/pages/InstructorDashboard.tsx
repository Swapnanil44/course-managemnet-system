import { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  Plus,
  Trash2,
  Edit2,
  BookOpen,
  Command,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import CourseForm, { type Course } from "../components/CourseForm";
import { Button } from "@/components/ui/button"; // Assuming you have shadcn button
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/courses");
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleCreateClick = () => {
    setEditingCourse(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (course: Course) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingCourse(null);
    fetchCourses();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingCourse(null);
  };

  return (
    <div className="min-h-screen bg-white relative isolate p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
              Instructor Dashboard
            </h1>
            <p className="text-zinc-500">Manage your courses and content</p>
          </div>

          {!isFormOpen && (
            <Button
              onClick={handleCreateClick}
              className="h-10 gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white shadow-md hover:bg-zinc-800 transition-all"
            >
              <Plus className="h-4 w-4" />
              New Course
            </Button>
          )}
        </div>

        {isFormOpen && (
          <div className="mb-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/40">
            <CourseForm
              initialData={editingCourse}
              onCancel={handleFormCancel}
              onSuccess={handleFormSuccess}
            />
          </div>
        )}

        {/* Course Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all duration-300 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50"
            >
              <div className="flex flex-col p-6">
                {/* Top Row: Icon + ID Badge */}
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 text-zinc-900 shadow-sm transition-colors group-hover:bg-zinc-100 group-hover:text-black">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="rounded-md border border-zinc-100 bg-zinc-50 px-2.5 py-1 font-mono text-[10px] font-medium text-zinc-500">
                    ID: {course.id.toString().padStart(3, "0")}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-5 space-y-2">
                  <h3 className="font-bold text-zinc-900 group-hover:text-black transition-colors text-lg">
                    {course.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-500 line-clamp-2 h-10">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Technical Footer: Dashed Top Border + Action Layout */}
              <div className="mt-auto flex items-center justify-between border-t border-dashed border-zinc-200 bg-zinc-50/50 px-6 py-4">
                {/* Secondary Actions (Left) */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditClick(course)}
                    className="text-zinc-400 hover:text-zinc-900 transition-colors"
                    title="Edit Details"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <div className="h-4 w-px bg-zinc-200" /> {/* Divider */}
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="text-zinc-400 hover:text-red-600 transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Primary Action (Right) */}
                <Link
                  to={`/dashboard/courses/${course.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 hover:bg-zinc-800"
                >
                  Manage
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Card>
          ))}

          {courses.length === 0 && !isFormOpen && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 mb-4">
                <Plus className="h-6 w-6 text-zinc-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900">
                No courses yet
              </h3>
              <p className="text-sm text-zinc-500 mt-1 max-w-sm">
                Get started by creating your first course. It will appear here
                once created.
              </p>
              <Button
                onClick={handleCreateClick}
                variant="outline"
                className="mt-6 border-zinc-200 bg-white hover:bg-zinc-50"
              >
                Create Course
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
