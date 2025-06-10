// import NextAuth, { DefaultSession } from 'next-auth';

// declare module 'next-auth' {
//   type UserSession = DefaultSession['user'];
//   interface Session {
//     user: UserSession;
//   }

//   interface CredentialsInputs {
//     email: string;
//     password: string;
//   }
// }

// types/next-auth.d.ts (atau di mana saja asal masuk ke project dan dikenali TypeScript)
import NextAuth, { DefaultSession } from 'next-auth';
import { JWT as DefaultJWT } from '@auth/core/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      name: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth' {
  interface User {
    id: string;
    username: string;
    name: string;
    role: string;
  }
}

declare module '@auth/core/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    username: string;
    role: string;
  }
}
