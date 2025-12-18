import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "../lib/api"; // Adjust path as needed
import { X } from "lucide-react";

// Types (You might want to move this to a types.ts file eventually)
export interface Course {
  id: number;
  title: string;
  description: string;
}

// Props Definition
interface CourseFormProps {
  initialData: Course | null; // If null, we are creating. If object, we are editing.
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
      onSuccess(); // Tell parent to refresh
    } catch (error) {
      console.error("Operation failed", error);
      alert("Failed to save course");
    }
  };

  return (
    <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {initialData ? "Edit Course" : "Create New Course"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Course Title
          </label>
          <input
            {...register("title")}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., Advanced NestJS Patterns"
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="What will students learn?"
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : initialData
              ? "Update Course"
              : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}