import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import CourseSidebar, { type Lesson } from "@/components/CourseSidebar";
import LessonViewer from "@/components/LessonViewer";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Page-specific type
interface CourseDetails {
  id: number;
  title: string;
  description: string;
  instructorId: number;
  lessons: Lesson[];
}

export default function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);
        if (data.lessons && data.lessons.length > 0) {
          setActiveLessonId(data.lessons[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch course details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar Skeleton */}
        <div className="w-80 border-r border-border bg-card p-6 space-y-4 hidden md:block">
          <Skeleton className="h-8 w-3/4 mb-6" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        {/* Main Content Skeleton */}
        <div className="flex-1 p-8 space-y-6">
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-100 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Course not found</h2>
        <Button asChild variant="outline">
          <Link to="/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>
      </div>
    );
  }

  const activeLesson = course.lessons.find((l) => l.id === activeLessonId);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-background">
      {/* SIDEBAR */}
      <CourseSidebar
        courseTitle={course.title}
        lessons={course.lessons}
        activeLessonId={activeLessonId}
        onSelectLesson={setActiveLessonId}
      />

      {/* MAIN CONTENT AREA */}
      <main className="relative flex-1 overflow-y-auto">
        {/* Dotted Background - Applied only to the content area */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        <div className="mx-auto max-w-4xl p-6 md:p-10">
          <LessonViewer
            lesson={activeLesson}
            courseDescription={course.description}
          />
        </div>
      </main>
    </div>
  );
}