/* eslint-disable react/no-unescaped-entities */
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center text-center max-w-md mx-auto p-6">
        <ShieldAlert className="h-24 w-24 text-destructive mb-6" />
        <h1 className="text-3xl font-bold tracking-tight mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. Please contact your administrator if you
          believe this is an error.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
