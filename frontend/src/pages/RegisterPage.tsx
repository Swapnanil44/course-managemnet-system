import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, ShieldCheck, Command, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'INSTRUCTOR']),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'USER' }
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await api.post('/auth/register', data);
      navigate('/login'); 
    } catch (error: any) {
      console.error(error);
      setError('root', { 
        message: error.response?.data?.message || 'Registration failed' 
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white relative isolate p-4">
     
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <Card className="w-full max-w-110 border border-zinc-200/60 bg-white shadow-[0px_0px_0px_1px_rgba(9,9,11,0.02),0px_1px_1px_-0.5px_rgba(9,9,11,0.02),0px_3px_3px_-1.5px_rgba(9,9,11,0.02),_0px_6px_6px_-3px_rgba(9,9,11,0.02),0px_12px_12px_-6px_rgba(9,9,11,0.02),0px_24px_24px_-12px_rgba(9,9,11,0.02)] rounded-2xl">
        
       
        <CardHeader className="space-y-1 pb-2 pt-2 text-center">
          <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-lg shadow-zinc-900/20">
            <Command className="h-4 w-4" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
            Create account
          </h2>
          <p className="text-xs text-zinc-500 font-medium">
            Enter your details to get started
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            
            
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-0.5">
                Full Name
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="John Doe"
                  className="pl-10 h-10 rounded-lg border-zinc-200 bg-white text-sm text-zinc-900 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                />
              </div>
              {errors.name && <p className="text-[10px] font-medium text-red-600 mt-1 pl-1">{errors.name.message}</p>}
            </div>

           
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-0.5">
                Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="name@example.com"
                  className="pl-10 h-10 rounded-lg border-zinc-200 bg-white text-sm text-zinc-900 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm"
                />
              </div>
              {errors.email && <p className="text-[10px] font-medium text-red-600 mt-1 pl-1">{errors.email.message}</p>}
            </div>

           
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-0.5">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                <Input
                  id="password"
                  {...register('password')}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
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
              {errors.password && <p className="text-[10px] font-medium text-red-600 mt-1 pl-1">{errors.password.message}</p>}
            </div>

            
            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 ml-0.5">
                Account Type
              </Label>
              <div className="relative group">
                <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 pointer-events-none transition-colors" />
                <div className="relative">
                  <select
                    id="role"
                    {...register('role')}
                    className="w-full appearance-none pl-10 pr-8 h-10 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all shadow-sm cursor-pointer"
                  >
                    <option value="USER">User</option>
                    <option value="INSTRUCTOR">Instructor</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
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
              {isSubmitting ? 'Creating account...' : 'Register'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center pb-6 pt-0">
          <p className="text-xs text-zinc-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-zinc-900 hover:underline underline-offset-4 transition-all">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}