export interface User {
   uid?: string;
   correo: string;
   name: string;
   lastname: string;
   photoURL?: string;
   emailVerified?: boolean;
   pin: string;
   rol: string;
}