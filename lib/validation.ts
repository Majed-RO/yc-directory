import { z } from 'zod';

export const formSchema = z.object({
	title: z.string().min(3).max(100),
	description: z.string().min(20).max(500),
	category: z.string().min(3).max(20),
	link: z
		.string()
		.url()
		.refine(
			async url => {
				// custom check

				// get only the metadata of the image
				/* 
        A HEAD request is similar to a GET request, with one key difference: instead of retrieving the full response body, it only retrieves the response headers. This means that a HEAD request won't actually fetch the resource itself, but it will provide you with metadata about the resource, such as content type, content length, cache control, and other relevant headers.
        */
				const res = await fetch(url, {
					method: 'HEAD'
				});

				const contentType =
					res.headers.get('content-type');


				return contentType?.startsWith('image/');
			},
			{
				message: 'Url is not for image type.'
			}
		),

	pitch: z.string().min(10)
});
