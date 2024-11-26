import type { MiddlewareNext } from "astro";
import { defineMiddleware } from "astro:middleware";

const privateRoutes = ["/protected"];

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request } = context;
  const userPath = url.pathname;

  if (privateRoutes.includes(userPath)) {
    const authHeaders = request.headers.get("authorization") ?? "";
    return checkLocalAuth(authHeaders, next);
  }

  return next();
});

const checkLocalAuth = (authHeaders: string, next: MiddlewareNext) => {
  if (authHeaders) {
    const { user, password } = getUserCredentials(authHeaders);

    if (user === "admin" && password === "admin") {
      return next();
    }
  }

  return new Response("Authorization needed", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic real="Secure Area"',
    },
  });
};

const getUserCredentials = (authHeaders: string) => {
  const authValue = authHeaders.split(" ").at(-1) ?? "user:pass"; // Removes 'Basic ' term
  const decodedValue = atob(authValue).split(":");
  console.log("decodedValue :>> ", decodedValue);
  const [user, password] = decodedValue;
  return { user, password };
};
