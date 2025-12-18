import { Link } from 'react-router-dom';
import { ArrowLeft, PlayCircle, CheckCircle } from 'lucide-react';

// Define types locally or import from a shared types file
export interface Lesson {
  id: number;
  title: string;
  content: string;
}

interface CourseSidebarProps {
  courseTitle: string;
  lessons: Lesson[];
  activeLessonId: number | null;
  onSelectLesson: (id: number) => void;
}

export default function CourseSidebar({ 
  courseTitle, 
  lessons, 
  activeLessonId, 
  onSelectLesson 
}: CourseSidebarProps) {
  return (
    <aside className="w-80 shrink-0 border-r bg-white h-[calc(100vh-64px)] flex flex-col">

      <div className="p-4 border-b bg-white">
        <Link 
          to="/courses" 
          className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={16} /> Back to Courses
        </Link>
        <h2 className="font-bold text-gray-900 line-clamp-2">{courseTitle}</h2>
        <p className="mt-1 text-xs text-gray-500">{lessons.length} Lessons</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {lessons.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            No lessons uploaded yet.
          </div>
        ) : (
          <div className="flex flex-col">
            {lessons.map((lesson, index) => {
              const isActive = activeLessonId === lesson.id;
              
              return (
                <button
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson.id)}
                  className={`flex items-start gap-3 border-b border-gray-50 px-4 py-4 text-left transition-colors hover:bg-gray-50 ${
                    isActive ? 'bg-indigo-50 border-indigo-100' : ''
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                    {isActive ? <PlayCircle size={20} /> : <CheckCircle size={20} />}
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500">Lesson {index + 1}</span>
                    <h4 className={`text-sm font-medium ${isActive ? 'text-indigo-700' : 'text-gray-700'}`}>
                      {lesson.title}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}