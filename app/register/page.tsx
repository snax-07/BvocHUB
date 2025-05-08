'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { signIn } from '../api/auth/[...nextauth]/route';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter()
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formState.password !== formState.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('/api/v1/register', {
        name: formState.name,
        email: formState.email,
        password: formState.password,
        confirmPassword : formState.confirmPassword
      });

      toast.success(res.data.message || 'Registration successful');
      router.push('/login')
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || 'Registration failed';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Create Account</h1>
        <p className="text-zinc-400 text-center mb-6">Join our futuristic learning platform</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name" className="text-zinc-400">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
                className="pl-10 text-white"
                value={formState.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-zinc-400">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10 text-white"
                value={formState.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-zinc-400">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 text-white"
                value={formState.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-zinc-400">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="pl-10 text-white"
                value={formState.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-6 text-lg font-medium text-white">
            Register
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-purple-400 hover:text-purple-300">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
