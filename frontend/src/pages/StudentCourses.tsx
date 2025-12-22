import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import CourseCard, { type Course } from "@/components/CourseCard";
import { BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/courses");
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white relative isolate p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] `mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-10 flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Explore Courses
          </h1>
          <p className="text-muted-foreground">
            Discover and enroll in new learning opportunities.
          </p>
        </div>

        {/* Grid Section */}
        {isLoading ? (
          <CoursesSkeleton />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component: Skeleton Loader (Updated to match card height)
function CoursesSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex h-70 flex-col rounded-xl border border-border bg-card p-6">
          <div className="flex justify-between">
             <Skeleton className="h-10 w-10 rounded-lg" />
             <Skeleton className="h-6 w-16 rounded-md" />
          </div>
          <div className="mt-5 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="mt-auto pt-4">
             <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Sub-component: Empty State
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
        <BookOpen className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground">
        No courses found
      </h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        There are no courses available at the moment. Please check back later.
      </p>
    </div>
  );
}