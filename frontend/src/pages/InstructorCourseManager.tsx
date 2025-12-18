import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowLeft, Plus, Edit2, Trash2, FileText } from 'lucide-react';
import LessonForm, { type Lesson } from '../components/LessonForm'; // Import new component

interface CourseData {
  id: number;
  title: string;
  lessons: Lesson[];
}

export default function InstructorCourseManager() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const fetchCourseDetails = async () => {
    if (!id) return;
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data);
    } catch (error) {
      console.error('Failed to fetch course', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const handleDelete = async (lessonId: number) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await api.delete(`/lessons/${lessonId}`);
      if (course) {
        setCourse({
            ...course,
            lessons: course.lessons.filter(l => l.id !== lessonId)
        });
      }
    } catch (error) {
      console.error('Delete failed', error);
      alert('Failed to delete lesson');
    }
  };

  const handleCreateClick = () => {
    setEditingLesson(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingLesson(null);
    fetchCourseDetails();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingLesson(null);
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!course) return <div className="p-10 text-center text-red-600">Course not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-500">Manage Lessons</p>
            </div>
            {!isFormOpen && (
              <button
                onClick={handleCreateClick}
                className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                <Plus size={20} /> Add Lesson
              </button>
            )}
          </div>
        </div>

        {isFormOpen && id && (
          <LessonForm 
            courseId={id}
            initialData={editingLesson}
            onCancel={handleFormCancel}
            onSuccess={handleFormSuccess}
          />
        )}

        <div className="space-y-4">
            {course.lessons.length === 0 && !isFormOpen && (
                <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
                    No lessons found. Click "Add Lesson" to start creating content.
                </div>
            )}

            {course.lessons.map((lesson) => (
                <div 
                    key={lesson.id} 
                    className={`flex items-start justify-between rounded-lg border bg-white p-5 shadow-sm transition-all ${
                        editingLesson?.id === lesson.id ? 'ring-2 ring-indigo-500' : 'hover:border-indigo-200'
                    }`}
                >
                    <div className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{lesson.content}</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEditClick(lesson)}
                            className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-indigo-600"
                            title="Edit"
                        >
                            <Edit2 size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(lesson.id)}
                            className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}