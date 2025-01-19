import SearchForm from '@/components/SearchForm';
import StartupCard, { StartupCardType } from '@/components/StartupCard';
// import { client } from '@/sanity/lib/client';
import { sanityFetch, SanityLive } from '@/sanity/lib/live';
import { STARTUPS_QUERY } from '@/sanity/lib/queries';
// import { Suspense } from 'react';

export default async function Home({
	searchParams
}: {
	searchParams: Promise<{ query?: string }>;
}) {
	const query = (await searchParams).query;

	return (
		<>
			<section className="pink_container">
				<h1 className="heading">
					Pitch Your Startup, <br /> Connect With
					Entrepreneurs
				</h1>

				<p className="sub-heading !max-w-3xl">
					Submit Ideas, Vote on Pitches, and Get
					Noticed in Virtual Competitions.
				</p>

				<SearchForm query={query} />
			</section>

			{/* <Suspense fallback={<p className='text-red-500 text-5xl'>LLoading...</p>}> */}
			<StartupsList query={query} />
			{/* </Suspense> */}

			{/* uses with sanityFetch to get immediate results from the db */}
			<SanityLive />
		</>
	);
}

const StartupsList = async ({ query }: { query?: string }) => {
	const params = { search: query || null };

	// const posts = await client.fetch(STARTUPS_QUERY);// normal fetch - no support for live api

	// using the follows method, it will fetch the data from the live api, whenever there as change!
	const { data: posts } = await sanityFetch({
		query: STARTUPS_QUERY,
		params
	});

	// console.log(JSON.stringify(posts, null, 2));

	return (
		<section className="section_container">
			<p className="text-30-semibold">
				{query
					? `Search results for "${query}"`
					: 'All Startups'}
			</p>

			<ul className="mt-7 card_grid">
				{posts.length > 0 ? (
					posts.map(post => (
						<StartupCard
							key={post?._id}
							post={
								post as StartupCardType
							}
						/>
					))
				) : (
					<p className="no-results">
						No startups found.
					</p>
				)}
			</ul>
		</section>
	);
};
