import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { signInWithEmailAndPassword, type AuthError } from "firebase/auth";
import { firebase } from "src/firebase/fb-config";

export const login = defineAction({
  accept: "form",
  input: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional(),
  }),
  handler: async (input, { cookies }) => {
    const { email, password, remember_me } = input;

    // Cookies handling
    if (remember_me) {
      cookies.set("email", email, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
        path: "/",
      });
    } else {
      cookies.delete("email", {
        path: "/",
      });
    }

    // user login procedure
    try {
      const user = await signInWithEmailAndPassword(
        firebase.auth,
        email,
        password
      );
      console.log("user :>> ", user);
      return;
    } catch (error) {
      const firebaseError = error as AuthError;

      if (firebaseError.code === "auth/email-already-in-use") {
        throw new Error("Ouch, the email is already in use");
      };

      throw new Error(`Someting failed during the login process ${error}`);
    }
  },
});
