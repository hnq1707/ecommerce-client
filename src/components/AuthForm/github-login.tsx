import { login } from '@/lib/actions/action';
import { Button } from '../ui/button';
import { Github } from 'lucide-react';

export default function GitHubLogin() {
  return (
    <form
      action={() => {
        login('github');
      }}
    >
      <Button
        type="submit"
        variant="outline"
        className="w-full h-10 font-normal flex items-center gap-2 border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-all"
      >
        <Github className="h-4 w-4" />
        <span>Đăng nhập với GitHub</span>
      </Button>
    </form>
  );
}
