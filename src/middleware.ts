import { defineMiddleware } from "astro:middleware";
import { firebase } from "./firebase/fb-config";

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware((context, next) => {
  console.log("Middleware executed");
  const user = firebase.auth.currentUser;
  const isLoggedIn = !!user;

  const { locals } = context;
  locals.isLoggedIn = isLoggedIn; // locals.isLoggedIn has to be declared as intercade in env.d

  if (user) { // This logic avoid adding it to protected page
    locals.user = {
      email: user.email!,
      name: user.displayName!,
      avatar: user.photoURL ?? "",
      emailVerified: user.emailVerified,
    };
  }

  return next();
});
