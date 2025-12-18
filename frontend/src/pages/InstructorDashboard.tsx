import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Plus, Trash2, Edit2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import CourseForm,  { type Course } from "../components/CourseForm"; // Import the new component

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Instructor Dashboard
            </h1>
            <p className="text-gray-600">Manage your courses and content</p>
          </div>
          {!isFormOpen && (
            <button
              onClick={handleCreateClick}
              className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              <Plus size={20} /> New Course
            </button>
          )}
        </div>

        
        {isFormOpen && (
          <CourseForm
            initialData={editingCourse}
            onCancel={handleFormCancel}
            onSuccess={handleFormSuccess}
          />
        )}

        {/* Course Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col justify-between rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {course.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  {course.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <span className="text-xs font-medium text-gray-400">
                  ID: {course.id}
                </span>
                <div className="flex gap-2">
                  <Link
                    to={`/dashboard/courses/${course.id}`}
                    className="mr-auto flex items-center gap-1 rounded bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                  >
                    Manage Content
                  </Link>
                  <button
                    onClick={() => handleEditClick(course)}
                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {courses.length === 0 && !isFormOpen && (
            <div className="col-span-full py-12 text-center text-gray-500">
              <p>No courses found. Create your first course to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}