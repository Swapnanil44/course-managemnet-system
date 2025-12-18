import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../lib/api';
import { Save, X } from 'lucide-react';

// --- Shared Types ---
export interface Lesson {
  id: number;
  title: string;
  content: string;
  courseId: number;
}

interface LessonFormProps {
  courseId: string; // We need the ID of the parent course to create a lesson
  initialData: Lesson | null;
  onCancel: () => void;
  onSuccess: () => void;
}

// --- Validation Schema ---
const lessonSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

type LessonFormInputs = z.infer<typeof lessonSchema>;

export default function LessonForm({ courseId, initialData, onCancel, onSuccess }: LessonFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LessonFormInputs>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
    },
  });

  // Reset form when switching between "Edit" and "Create" modes
  useEffect(() => {
    if (initialData) {
      reset({ title: initialData.title, content: initialData.content });
    } else {
      reset({ title: '', content: '' });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: LessonFormInputs) => {
    try {
      if (initialData) {
        await api.patch(`/lessons/${initialData.id}`, data);
      } else {
        await api.post('/lessons', {
          ...data,
          courseId: Number(courseId),
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save lesson');
    }
  };

  return (
    <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm ring-1 ring-indigo-100">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {initialData ? 'Edit Lesson' : 'Create New Lesson'}
        </h2>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Lesson Title</label>
          <input
            {...register('title')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Introduction to Hooks"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            {...register('content')}
            rows={6}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Write your lesson content here..."
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save size={16} />
            {isSubmitting ? 'Saving...' : 'Save Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
}