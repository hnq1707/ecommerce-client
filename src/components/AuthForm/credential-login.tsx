'use client';

import type React from 'react';

import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { login2 } from '@/lib/actions/action';
import { useState } from 'react';
import Link from 'next/link';

export default function CredentialLogin() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = (email: string, password: string) => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    // Validate form before submission
    if (!validateForm(email, password)) {
      return;
    }

    setLoading(true);
    try {
      const result = await login2('credentials', {
        email,
        password,
      });
      if (result.error) {
        throw new Error(result.error);
      }
      window.location.href = '/';
    } catch (err) {
      if (err instanceof Error) {
        alert(`Failed to log in: ${err.message}`);
      } else {
        alert('Failed to log in due to an unknown error.');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" autoComplete="email" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            </div>
            <Input id="password" type="password" />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  ></path>
                </svg>
                Logging In...
              </>
            ) : (
              'Log In'
            )}
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </div>
    </form>
  );
}
