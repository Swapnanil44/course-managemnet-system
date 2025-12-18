import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";

export interface Course {
  id: number;
  title: string;
  description: string;
  instructorId: number;
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="flex flex-col rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        <BookOpen size={24} />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        {course.title}
      </h3>
      <p className="mb-6 grow text-sm text-gray-600 line-clamp-3">
        {course.description}
      </p>
      <Link
        to={`/courses/${course.id}`}
        className="group flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
      >
        Start Learning
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}
