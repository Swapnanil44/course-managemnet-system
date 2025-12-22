import { Link } from "react-router-dom";
import { ArrowLeft, PlayCircle, CheckCircle, Lock } from "lucide-react";

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
  onSelectLesson,
}: CourseSidebarProps) {
  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-r border-border bg-card/50 backdrop-blur-sm">
      
      <div className="flex flex-col border-b border-border p-5">
        <Link
          to="/courses"
          className="group mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md border border-border bg-background transition-colors group-hover:border-primary/50 group-hover:text-primary">
            <ArrowLeft size={14} />
          </div>
          Back to Courses
        </Link>
        <h2 className="line-clamp-2 text-lg font-bold tracking-tight text-foreground">
          {courseTitle}
        </h2>
        <p className="mt-1 text-xs font-medium text-muted-foreground">
          {lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"}
        </p>
      </div>

      
      <div className="flex-1 overflow-y-auto">
        {lessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-sm text-muted-foreground">
            <div className="mb-2 rounded-full bg-muted p-2">
              <Lock size={16} />
            </div>
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
                  className={`group flex items-start gap-3 border-b border-border/50 px-5 py-4 text-left transition-all hover:bg-accent/50 ${
                    isActive
                      ? "bg-primary/5 border-l-2 border-l-primary pl-4.5"
                      : "border-l-2 border-l-transparent"
                  }`}
                >
                  <div
                    className={`mt-0.5 shrink-0 transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {isActive ? (
                      <PlayCircle size={18} className="fill-current text-primary" />
                    ) : (
                      <CheckCircle size={18} />
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      Lesson {index + 1}
                    </span>
                    <h4
                      className={`text-sm font-medium leading-snug ${
                        isActive ? "text-primary" : "text-foreground"
                      }`}
                    >
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