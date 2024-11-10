// eslint-disable-next-line
import NextAuth, { DefaultSession } from 'next-auth';

// this is to extend types of some objects in next-auth
// https://next-auth.js.org/getting-started/typescript
declare module 'next-auth' {
	interface Session {
		// id: string
    user : {
      id: string
    } & DefaultSession["user"]
	}

	interface JWT {
		id: string;
	}
}
