import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "../lib/api";
import { X, Type, AlignLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Types
export interface Course {
  id: number;
  title: string;
  description: string;
}

// Props Definition
interface CourseFormProps {
  initialData: Course | null;
  onCancel: () => void;
  onSuccess: () => void;
}

// Validation Schema
const courseSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type CourseFormInputs = z.infer<typeof courseSchema>;

export default function CourseForm({ initialData, onCancel, onSuccess }: CourseFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormInputs>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
    },
  });

  // Reset form when switching between "Edit" and "Create" modes
  useEffect(() => {
    if (initialData) {
      reset({ title: initialData.title, description: initialData.description });
    } else {
      reset({ title: "", description: "" });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: CourseFormInputs) => {
    try {
      if (initialData) {
        // Edit Mode
        await api.patch(`/courses/${initialData.id}`, data);
      } else {
        // Create Mode
        await api.post("/courses", data);
      }
      onSuccess(); 
    } catch (error) {
      console.error("Operation failed", error);
      alert("Failed to save course");
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-zinc-900">
            {initialData ? "Edit Course" : "Create New Course"}
          </h2>
          <p className="text-sm text-zinc-500">
            {initialData ? "Update the course details below." : "Fill in the details to create a new course."}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Course Title Field */}
        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-0.5">
            Course Title
          </Label>
          <div className="relative group">
            <Type className="absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g., Advanced React Patterns"
              className="pl-10 h-10 rounded-lg border-zinc-200 bg-white text-sm text-zinc-900 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
            />
          </div>
          {errors.title && (
            <p className="text-[10px] font-medium text-red-600 pl-1 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-0.5">
            Description
          </Label>
          <div className="relative group">
            <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
            <textarea
              id="description"
              {...register("description")}
              rows={4}
              className="flex min-h-30 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 pl-10 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
              placeholder="Briefly describe what students will learn in this course..."
            />
          </div>
          {errors.description && (
            <p className="text-[10px] font-medium text-red-600 pl-1 mt-1">{errors.description.message}</p>
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
            className="h-9 bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </div>
            ) : initialData ? (
              "Update Course"
            ) : (
              "Create Course"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}