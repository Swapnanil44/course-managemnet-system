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
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-ring/50 hover:shadow-lg hover:shadow-primary/5">
      {/* Main Content Body */}
      <div className="flex flex-col p-6">
        {/* Top Row: Icon + ID Badge */}
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="rounded-md border border-border bg-muted/30 px-2.5 py-1 font-mono text-[10px] font-medium text-muted-foreground">
            ID: {course.id.toString().padStart(3, "0")}
          </span>
        </div>

        {/* Content Text */}
        <div className="mt-5 space-y-2">
          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-lg">
            {course.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2 h-10">
            {course.description}
          </p>
        </div>
      </div>

      {/* Technical Footer: Dashed Top Border */}
      <div className="mt-auto flex items-center justify-end border-t border-dashed border-border bg-muted/30 px-6 py-4">
        <Link
          to={`/courses/${course.id}`}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-transform active:scale-95 hover:bg-primary/90"
        >
          Start Learning
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}