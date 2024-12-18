import { defineAction } from "astro:actions";
import { z } from "astro:schema";

import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, type AuthError } from "firebase/auth";
import { firebase } from "src/firebase/fb-config";

export const registerUser = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional(),
  }),
  handler: async (input, context) => {
    const { name, email, password, remember_me } = input;
    const { cookies } = context;
    
    // Cookies handling
    if (remember_me) {
        cookies.set('email', email, {
            expires: new Date(Date.now() + 1000 *60 *60 *24 *365), // 1 year
            path: '/'
        })
    } else {
        cookies.delete('email', {
            path:'/',
        });
    }

    // user creation via firebase
    try {
      const user = await createUserWithEmailAndPassword(
        firebase.auth, 
        email, 
        password,
      );

      // Update name
      updateProfile(firebase.auth.currentUser!, {
        displayName:name,
      });

      // Verify email
      await sendEmailVerification(firebase.auth.currentUser!, {
        url: `${import.meta.env.WEBSITE_URL}/protected?emailVerified=true`
      })

      return;
    } catch (error) {
      const firebaseError = error as AuthError;

      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error ('Ouch, the email is already in use')
      };

      throw new Error (`Someting failed during user creation: ${error}`)
    }
  },
});
