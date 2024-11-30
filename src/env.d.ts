/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface user {
    email: string;
    name: string;
    avatar: string;
    emailVerified: boolean;
}
declare namespace App {
    interface Locals {
        isLoggedIn: boolean;
        user: User | null;
    }
}