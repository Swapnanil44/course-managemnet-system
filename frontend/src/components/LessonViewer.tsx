import { BookOpen, MonitorPlay } from "lucide-react";
import { type Lesson } from "./CourseSidebar";

interface LessonViewerProps {
  lesson?: Lesson;
  courseDescription: string;
}

export default function LessonViewer({
  lesson,
  courseDescription,
}: LessonViewerProps) {
  
  if (!lesson) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 text-center p-8">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BookOpen size={32} />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Welcome to the Course
        </h2>
        <p className="mt-2 max-w-lg text-muted-foreground">
          {courseDescription ||
            "Select a lesson from the sidebar to begin your learning journey."}
        </p>
        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
          <MonitorPlay size={16} />
          Select a lesson to start watching
        </div>
      </div>
    );
  }

  
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-6 space-y-2">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary">
          Now Playing
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {lesson.title}
        </h1>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-10">
        <article className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap leading-7 text-card-foreground">
            {lesson.content}
          </p>
        </article>
      </div>

      <div className="mt-8 flex justify-end">
        <p className="text-xs text-muted-foreground italic">
          Completed this lesson? Select the next one from the sidebar.
        </p>
      </div>
    </div>
  );
}
