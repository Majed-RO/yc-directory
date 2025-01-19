import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { AUTHOR_BY_GITHUB_ID_QUERY } from './sanity/lib/queries';
import { client } from './sanity/lib/client';
import { writeClient } from './sanity/lib/write-client';

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [GitHub],
	callbacks: {
		// see Frame 1 in Miro: https://miro.com/app/board/uXjVLKE6GuA=/ ; a diagram shows the authorization flow
		async signIn({ user: { name, email, image }, profile }) {
			/* 
      The non-null assertion operator (!) is a concise way of avoiding unnecessary null and undefined checks in our code. We should only use this when we definitely know the variable or expression can't be null or undefined.
      */
     // 	const { id, login, bio } = profile!;
			// note: I couldn't destructure profile in the function declaration like I did with user, since the profile may be undefined

			if (!profile) return false; // to get rid of the non-null assertion operator (!)
			const { id, login, bio } = profile;
			// 1- check if the current user is exist in the db
			const existingUser = await client
				.withConfig({ useCdn: false })
				.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
					id
				});

			// 2- if not exist create it
			if (!existingUser) {
				await writeClient.create({
					_type: 'author',
					id,
					name,
					username: login,
					email,
					image,
					bio: bio || ''
				});
			}

			return true; // continuo the signin process
		},

		// add author id to the session
		async jwt({ token, account, profile }) {
			if (account && profile) {
				const user = await client
					.withConfig({ useCdn: false })
					.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
						id: profile?.id
					});

				token.id = user?._id;
			}

			return token;
		},

		async session({ session, token }) {
			// Object.assign(session, { id: token.id });
			session.user.id = token.id as string;

			return session;
		}
	}
});
