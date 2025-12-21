import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../lib/api';
import { Save, X, Type, AlignLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- Shared Types ---
export interface Lesson {
  id: number;
  title: string;
  content: string;
  courseId: number;
}

interface LessonFormProps {
  courseId: string;
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
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-zinc-900">
            {initialData ? 'Edit Lesson' : 'Create New Lesson'}
          </h2>
          <p className="text-sm text-zinc-500">
            {initialData ? 'Update the lesson content below.' : 'Add a new lesson to your course curriculum.'}
          </p>
        </div>
        <button 
          type="button" 
          onClick={onCancel} 
          className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Title Field */}
        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-0.5">
            Lesson Title
          </Label>
          <div className="relative group">
            <Type className="absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
            <Input
              id="title"
              {...register('title')}
              className="pl-10 h-10 rounded-lg border-zinc-200 bg-white text-sm text-zinc-900 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
              placeholder="e.g., Introduction to Hooks"
            />
          </div>
          {errors.title && (
            <p className="text-[10px] font-medium text-red-600 pl-1 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Content Field */}
        <div className="space-y-1.5">
          <Label htmlFor="content" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-0.5">
            Content
          </Label>
          <div className="relative group">
            <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
            <textarea
              id="content"
              {...register('content')}
              rows={6}
              className="flex min-h-[160px] w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 pl-10 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
              placeholder="Write your lesson content here..."
            />
          </div>
          {errors.content && (
            <p className="text-[10px] font-medium text-red-600 pl-1 mt-1">{errors.content.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-9 border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-9 gap-2 bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Lesson
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}