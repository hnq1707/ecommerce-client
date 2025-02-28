import { auth } from '@/auth';

export default auth((req) => {

  const isAuthPage = ['/login', '/signup'].includes(req.nextUrl.pathname);

  if (req.auth && isAuthPage) {
    const newUrl = new URL('/', req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});
