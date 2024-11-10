import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { AUTHOR_BY_GITHUB_ID_QUERY } from './sanity/lib/queries';
import { client } from './sanity/lib/client';
import { writeClient } from './sanity/lib/write-client';

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [GitHub],
	callbacks: {
		async signIn({ user: { name, email, image }, profile }) {
			// 1- check if the current user is exist in the db
			const existingUser = await client
				.withConfig({ useCdn: false })
				.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
					id: profile?.id
				});

			// 2- if not exist create it
			if (!existingUser) {
				await writeClient.create({
					_type: 'author',
					id: profile?.id,
					name,
					username: profile?.login,
					email,
					image,
					bio: profile?.bio || ''
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

      session.user.id = token.id as string

			return session;
		}
	}
});
