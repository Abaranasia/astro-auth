import { defineAction } from "astro:actions";
import { z } from "astro:schema";

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
    
    console.log("cosos :>> ", name, email, password, remember_me);

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
    return {ok: true, msg: 'usuario creado'};
  },
});
