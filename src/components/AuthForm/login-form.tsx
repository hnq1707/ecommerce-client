'use client';
import { cn } from '@/lib/utils/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import GitHubLogin from './github-login';
import GoogleLogin from './google-login';
import CredentialLogin from './credential-login';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Github or Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <GitHubLogin />
            <GoogleLogin />
          </div>
          <div>
            <CredentialLogin />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
