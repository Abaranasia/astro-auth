import { defineMiddleware } from 'astro:middleware';
import { firebase } from './firebase/fb-config';

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware((context, next) => {
  console.log ('Middleware executed');
  const user = firebase.auth.currentUser;
  const isLoggedIn = !!user;

  context.locals.isLoggedIn = isLoggedIn; // locals.isLoggedIn has to be declared as intercade in env.d


  return next()
});