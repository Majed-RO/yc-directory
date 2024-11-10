import React from 'react';
import Ping from './Ping';
import { client } from '@/sanity/lib/client';
import { STARTUP_VIEWS_QUERY } from '@/sanity/lib/queries';
import { writeClient } from '@/sanity/lib/write-client';

import { unstable_after as after } from 'next/server'


export const Views = async ({ id }: { id: string }) => {
	const viewsResult = await client
		.withConfig({ useCdn: false })
		.fetch(STARTUP_VIEWS_QUERY, { id });

    const totalViews = viewsResult !== null  ? viewsResult?.views : 0;

	// update the number of views whenever someone sees the startup

  after(async () => await writeClient
  .patch(id)
  .set({views: totalViews ? totalViews  + 1 : 1})
  .commit());

	return (
		<div className="view-container">
			<div className="absolute -top-2 -right-2">
				<Ping />
			</div>

			<p className="view-text">
				<span className="font-black">
					Views: {totalViews}
				</span>
			</p>
		</div>
	);
};
