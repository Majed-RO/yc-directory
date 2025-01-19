import { auth } from '@/auth';
import StartupForm from '@/components/StartupForm';
import { redirect } from 'next/navigation';
import React from 'react';

const CreateStartupPage = async () => {
	const session = await auth();

	// console.log('SESSION====', session);

  // If user is not logged in, redirect to home page
	if (!session) redirect('/');

	return (
		<>
			<section className="pink_container !min-h-[230px]">
				<h1 className="heading">Submit Your Startup</h1>
			</section>
			<StartupForm />
		</>
	);
};

export default CreateStartupPage;
