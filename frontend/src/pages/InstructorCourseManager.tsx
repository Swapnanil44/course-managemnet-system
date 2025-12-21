import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowLeft, Plus, Edit2, Trash2, FileText, ChevronRight, GripVertical } from 'lucide-react';
import LessonForm, { type Lesson } from '../components/LessonForm'; 
import { Button } from "@/components/ui/button";

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

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="h-5 w-5 animate-spin rounded-full border-[2.5px] border-zinc-200 border-t-zinc-900" />
    </div>
  );

  if (!course) return (
    <div className="flex h-screen flex-col items-center justify-center bg-white gap-4">
        <h2 className="text-xl font-bold text-zinc-900">Course not found</h2>
        <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
        </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white relative isolate p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="mb-10">
          <Link 
            to="/dashboard" 
            className="group mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> 
            Back to Dashboard
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-950">{course.title}</h1>
              <p className="text-zinc-500 flex items-center gap-2">
                <span>Manage Curriculum</span>
                <ChevronRight className="h-3 w-3 text-zinc-300" />
                <span className="text-zinc-900 font-medium">{course.lessons.length} Lessons</span>
              </p>
            </div>
            
            {!isFormOpen && (
              <Button
                onClick={handleCreateClick}
                className="gap-2 bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-all"
              >
                <Plus className="h-4 w-4" /> Add Lesson
              </Button>
            )}
          </div>
        </div>

        {/* Form Area */}
        {isFormOpen && id && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/40 p-6">
            <LessonForm 
              courseId={id}
              initialData={editingLesson}
              onCancel={handleFormCancel}
              onSuccess={handleFormSuccess}
            />
          </div>
        )}

        {/* Lesson List */}
        <div className="space-y-4">
            {course.lessons.length === 0 && !isFormOpen && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 py-16 text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-zinc-200 shadow-sm">
                        <FileText className="h-6 w-6 text-zinc-400" />
                    </div>
                    <p className="text-zinc-900 font-medium">No lessons yet</p>
                    <p className="text-sm text-zinc-500 mt-1">Start building your curriculum by adding a lesson.</p>
                </div>
            )}

            {course.lessons.map((lesson, index) => (
                <div 
                    key={lesson.id} 
                    className={`group relative flex items-start gap-4 rounded-xl border bg-white p-5 transition-all duration-300 ${
                        editingLesson?.id === lesson.id 
                            ? 'border-zinc-900 ring-1 ring-zinc-900 shadow-lg' 
                            : 'border-zinc-200 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50'
                    }`}
                >
                    {/* Index Number / Drag Handle Aesthetic */}
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 text-xs font-bold text-zinc-400">
                        {(index + 1).toString().padStart(2, '0')}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-zinc-900 group-hover:text-black transition-colors">
                                {lesson.title}
                            </h3>
                            {editingLesson?.id === lesson.id && (
                                <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-800">
                                    Editing
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                            {lesson.content}
                        </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => handleEditClick(lesson)}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-all"
                            title="Edit Lesson"
                        >
                            <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(lesson.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-all"
                            title="Delete Lesson"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}