import { defineAction } from "astro:actions";

import { firebase } from "src/firebase/fb-config";
import { signOut } from "firebase/auth";

export const logout = defineAction({
  accept: "json",
  handler: async (_, { cookies }) => {
    return await signOut(firebase.auth);
  },
});