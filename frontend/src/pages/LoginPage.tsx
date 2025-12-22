import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, Command } from "lucide-react";
import { toast } from "sonner";
import { formatCurrentDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await api.post("/auth/login", data);
      login(response.data.access_token, response.data.user);
    } catch (error: any) {
      console.error(error);
      toast.error("Invalid credentials", {
        description: formatCurrentDateTime(),
        action: { label: "Undo", onClick: () => console.log("Undo") },
      });
      setError("root", { message: "Invalid credentials" });
    }
  };

  useEffect(() => {
    if (user && !isLoading) {
      user.role === "INSTRUCTOR" ? navigate("/dashboard") : navigate("/courses");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-5 w-5 animate-spin rounded-full border-[2.5px] border-zinc-200 border-t-zinc-900" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white relative isolate p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <Card className="w-full max-w-105 border border-zinc-200/60 bg-white shadow-[0px_0px_0px_1px_rgba(9,9,11,0.02),0px_1px_1px_-0.5px_rgba(9,9,11,0.02),0px_3px_3px_-1.5px_rgba(9,9,11,0.02),0px_6px_6px_-3px_rgba(9,9,11,0.02),0px_12px_12px_-6px_rgba(9,9,11,0.02),0px_24px_24px_-12px_rgba(9,9,11,0.02)] rounded-2xl">
        {/* Reduced padding top/bottom and logo margin */}
        <CardHeader className="space-y-1 pb-4 pt-2 text-center">
          <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-lg shadow-zinc-900/20">
            <Command className="h-4 w-4" />
          </div>
          {/* Smaller Title */}
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
            Welcome back
          </h2>
          <p className="text-xs text-zinc-500 font-medium">
            Enter your credentials to access the platform
          </p>
        </CardHeader>

        <CardContent>
          {/* Tighter space-y */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-0.5">
                Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                <Input
                  id="email"
                  {...register("email")}
                  placeholder="name@example.com"
                  className="pl-10 h-10 rounded-lg border-zinc-200 bg-white text-sm text-zinc-900 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                />
              </div>
              {errors.email && <p className="text-[10px] font-medium text-red-600 pl-1 mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-0.5">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                <Input
                  id="password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-10 rounded-lg border-zinc-200 bg-white text-sm text-zinc-900 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] font-medium text-red-600 pl-1 mt-1">{errors.password.message}</p>}
            </div>

            {errors.root && (
              <div className="rounded-lg border border-red-500/20 bg-red-50 p-2 text-center text-xs font-medium text-red-600">
                {errors.root.message}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 h-10 w-full rounded-lg bg-zinc-900 text-sm font-semibold text-white shadow-md hover:bg-zinc-800 transition-all"
            >
              {isSubmitting ? "Verifying..." : "Sign In"}
            </Button>
          </form>
        </CardContent>

        {/* Reduced Footer Padding */}
        <CardFooter className="flex justify-center pb-6 pt-0">
          <p className="text-xs text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-semibold text-zinc-900 hover:underline underline-offset-4 transition-all">
              Create account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}