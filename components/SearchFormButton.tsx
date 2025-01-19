'use client';
import { Search } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export default function SearchFormButton() {
	const status = useFormStatus();
	return (
		<button type="submit" disabled={status.pending} className="search-btn text-white">
			{status.pending ? (
			 <p className='animate-spin'>...</p>
			) : (
				<Search className="size-5" />
			)}
		</button>
	);
}
