import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import CourseSidebar, { type Lesson } from '../components/CourseSidebar';
import LessonViewer from '../components/LessonViewer';

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
        console.error('Failed to fetch course details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading course content...</div>;
  if (!course) return <div className="p-10 text-center">Course not found</div>;

  const activeLesson = course.lessons.find((l) => l.id === activeLessonId);

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      <CourseSidebar 
        courseTitle={course.title}
        lessons={course.lessons}
        activeLessonId={activeLessonId}
        onSelectLesson={setActiveLessonId}
      />
      <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-64px)]">
        <div className="mx-auto max-w-3xl">
          <LessonViewer 
            lesson={activeLesson} 
            courseDescription={course.description} 
          />
        </div>
      </main>

    </div>
  );
}