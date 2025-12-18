import { type Lesson } from './CourseSidebar';

interface LessonViewerProps {
  lesson?: Lesson; 
  courseDescription: string;
}

export default function LessonViewer({ lesson, courseDescription }: LessonViewerProps) {
  if (!lesson) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
        <h2 className="text-xl font-semibold text-gray-900">Welcome to the Course</h2>
        <p className="mt-2 max-w-md">{courseDescription}</p>
        <p className="mt-4 text-sm">Select a lesson from the sidebar to start learning.</p>
      </div>
    );
  }
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
      </div>
      
      <div className="prose prose-indigo max-w-none rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {lesson.content}
        </p>
      </div>
    </div>
  );
}