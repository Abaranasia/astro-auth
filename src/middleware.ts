import { defineMiddleware } from "astro:middleware";
import { firebase } from "./firebase/fb-config";

const privateRoutes = ["/protected"];
const notAuthenticatedRoutes = ['/login', '/register']

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware((context, next) => {
  console.log("Middleware executed");
  const { locals, url, redirect } = context;

  const user = firebase.auth.currentUser;
  const isLoggedIn = !!user;

  locals.isLoggedIn = isLoggedIn; // locals.isLoggedIn has to be declared as intercade in env.d

  if (user) { // This logic avoid adding it to protected page
    locals.user = {
      email: user.email!,
      name: user.displayName!,
      avatar: user.photoURL ?? "",
      emailVerified: user.emailVerified,
    };
  }

  // This condition disallow the access to protected routes if user is not logged in
  if (!isLoggedIn && privateRoutes.includes(url.pathname) ) {
    return redirect('/')
  }

  // This condition disallow the access to no authenticated routes if user is logged in (to avoid login twice)
  if (isLoggedIn && notAuthenticatedRoutes.includes(url.pathname) ) {
    return redirect('/')
  }

  return next();
});
