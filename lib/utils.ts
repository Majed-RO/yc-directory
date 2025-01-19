import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
	return new Date(date).toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
}

export function stringifyError(error: string[] | string) {
	return typeof error === 'string' ? error : error.join(', ');
}

 /* 
    1- JSON.parse() takes a JSON string and transforms it into a JavaScript object.
    2- JSON.stringify() takes a JavaScript object and transforms it into a JSON string.
    3- JSON.parse(JSON.stringify(response)) is a common pattern to deep clone an object.
    */
export function parseServerActionResponse<T>(response: T) {
	return JSON.parse(JSON.stringify(response));
}
