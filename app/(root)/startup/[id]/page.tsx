import { formatDate } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import {
	PLAYLIST_BY_SLUG_QUERY,
	STARTUP_BY_ID_QUERY
} from '@/sanity/lib/queries';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import markdownit from 'markdown-it';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Views } from '@/components/Views';
import StartupCard, { StartupCardType } from '@/components/StartupCard';

const md = markdownit();

export const experimental_ppr = true;

/* NOTE: 
due to the nature of async/await, an awaited request inside the same segment or component will block any requests below it.

To fetch data in parallel, you can eagerly initiate requests by defining them outside the components that use the data. This saves time by initiating both requests in parallel, however, the user won't see the rendered result until both promises are resolved.
*/

async function getPost(id: string) {
	const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });

	return post;
}

async function getPlaylist() {
	const playlist = await client.fetch(PLAYLIST_BY_SLUG_QUERY, {
		slug: 'editors-pick'
	});

	return playlist;
}

const StartupPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const id = (await params).id;

	/* 
  **** Sequential data fetching 
  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });

	const { select: editorPosts } = await client.fetch(
		PLAYLIST_BY_SLUG_QUERY,
		{ slug: 'editors-pick' }
	); */

	/* Parallel Data Fetching */
	// first way
	const startupData = getPost(id);
	const playlistData = getPlaylist();

	const [post, playlist] = await Promise.all([startupData, playlistData]);

	// second way
	/* const [post, playlist ] = await Promise.all([
		client.fetch(STARTUP_BY_ID_QUERY, { id }),
		client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: 'editors-pick' }) 
	]); */

	if (!post) return notFound();

	const {
		title,
		description,
		category,
		pitch,
		image,
		_createdAt,
		author
	} = post;

	const editorPosts = playlist?.select || [];

	const parsedContent = pitch && md.render((pitch as string) || '');

	return (
		<>
			<section className="pink_container !min-h-[230px]">
				<p className="tag">{formatDate(_createdAt)}</p>

				<h1 className="heading">{title}</h1>
				<p className="sub-heading !max-w-5xl capitalize-first">
					{description}
				</p>
			</section>

			<section className="section_container">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				{/* <img
					src={image || ''}
					alt="thumbnail"
					className="w-full h-auto rounded-xl"
				/> */}

				{/* width and height used to reserve a place for the image, to prevent layout shift */}
				<Image
					src={image || ''}
					alt="thumbnail"
					width={500}
					height={500}
					className="w-full h-[500px] rounded-xl"
					style={{
						objectFit: 'cover',
						objectPosition: '0 0'
					}}
					quality={100}
				/>

				<div className="space-y-5 mt-10 max-w-4xl mx-auto">
					<div className="flex-between gap-5">
						<Link
							href={`/user/${author?._id}`}
							className="flex gap-2 items-center mb-3"
						>
							<Image
								src={
									author?.image ||
									''
								}
								alt="avatar"
								width={64}
								height={64}
								className="rounded-full drop-shadow-lg"
							/>

							<p className="text-20-medium ">
								{author?.name}
							</p>
							<p className="text-20-medium !text-black-300">
								@
								{
									author?.username
								}
							</p>
						</Link>

						<p className="category-tag">
							{category}
						</p>
					</div>

					<h3 className="text-30-bold">
						Pitch Details
					</h3>
					{/* to show pitch details with markdown, we have to install : npm i markdown-it 
        npm i --save-dev @types/markdown-it
        */}
					{parsedContent ? (
						<article
							className="prose max-w-4xl font-work-sans break-all"
							dangerouslySetInnerHTML={{
								__html: parsedContent
							}}
						/>
					) : (
						<p className="no-result">
							No details provided!
						</p>
					)}
				</div>

				{/* Editor selected startups */}
				{editorPosts?.length > 0 && (
					<>
						<hr className="divider" />

						<div className="max-w-4xl mx-auto">
							<p className="text-30-semibold">
								Editor Picks
							</p>

							<ul className="mt-7 card_grid-sm">
								{editorPosts.map(
									(
										post,
										i: number
									) => (
										<StartupCard
											key={
												i
											}
											post={
												post as StartupCardType
											}
										/>
									)
								)}
							</ul>
						</div>
					</>
				)}

				{/* this piece of data will be rendered dynamically in realtime  */}
				<Suspense
					fallback={
						<Skeleton className="view-skeleton" />
					}
				>
					<Views id={id} />
				</Suspense>
			</section>
		</>
	);
};

export default StartupPage;
