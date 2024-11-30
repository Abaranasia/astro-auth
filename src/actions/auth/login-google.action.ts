import {  defineAction } from 'astro:actions';
import { z } from 'astro:schema';

import { firebase } from 'src/firebase/fb-config';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

export const loginWithGoogle = defineAction({
    accept: 'json',
    input: z.any(),
    handler: async (credentials) => {
        try {
            const credential = GoogleAuthProvider.credentialFromResult(credentials);
            //@ts-ignore
            await signInWithCredential(firebase.auth, credential)  
        } catch (error) {
            throw new Error(`Google SingIn process failed ${error}`)    
        }     
        return;
    }
});