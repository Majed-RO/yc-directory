'use client';

import React, { useActionState, useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import MDEditor from '@uiw/react-md-editor';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { formSchema } from '@/lib/validation';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { stringifyError } from '@/lib/utils';
import { createPitch } from '@/lib/actions';
// import { StartupCardType } from './StartupCard';
import { useRouter } from 'next/navigation';

type FormDataType = {
	title?: string;
	description?: string;
	category?: string;
	link?: string;
	pitch?: string;
};
// data?: StartupCardType;
export type StateType = {
	data?: FormDataType;
	error?: string;
	status?: string;
};

const StartupForm = () => {
	/* 
  The Record type in TypeScript allows you to define objects with a fixed set of keys and a specific type for both the keys and the values. Think of it as a blueprint for your objects, ensuring consistency and catching errors early on.
  */
	const [errors, setErrors] = useState<Record<string, string>>({});

	const [pitch, setPitch] = useState('');

	const { toast } = useToast();

	const router = useRouter();

	// eslint11-disable-next-line
	const handleFormSubmit = async (
		prevState: StateType | undefined,
		formData: FormData
	) => {
		const formValues = {
			title: formData.get('title') as string,
			description: formData.get('description') as string,
			category: formData.get('category') as string,
			link: formData.get('link') as string,
			pitch
		};

		// console.log('FORMVALUES', formValues);

		try {
			await formSchema.parseAsync(formValues); // will throw an error if validation got failed

			// This is a server action
			const result = await createPitch(
				prevState,
				formData,
				pitch
			);

			if (result.status === 'SUCCESS') {
				toast({
					title: 'Success',
					description:
						'Your startup pitch has been created successfully.',
					variant: 'default'
				});

				router.push(`/startup/${result?._id}`);
			}

			return result;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const fieldsErrors =
					error.flatten().fieldErrors;

				console.log('Errors', fieldsErrors);

				setErrors(
					fieldsErrors as unknown as Record<
						string,
						string
					>
				);

				toast({
					title: 'Error',
					description:
						'Please check your inputs and try again',
					variant: 'destructive'
				});

				return {
					...prevState,
					data: formValues,
					error: 'Validation failed',
					status: 'ERROR'
				};
			} else {
				toast({
					title: 'Error',
					description:
						'unexpected error has occurred',
					variant: 'destructive'
				});

				return {
					...prevState,
					data: formValues,
					error: 'unexpected error has occurred',
					status: 'ERROR'
				};
			}
		}
	};

	const [state, formAction, isPending] = useActionState(
		handleFormSubmit,
		{
			data: {
				title: '',
				description: '',
				link: '',
				category: '',
				pitch: ''
			},
			error: '',
			status: 'initial'
		}
	);

	return (
		<form action={formAction} className="startup-form">
			<h1>{JSON.stringify(state)}</h1>
			<div>
				<label
					htmlFor="title"
					className="startup-form_label"
				>
					Title
				</label>
				<Input
					id="title"
					name="title"
					className="startup-form_input"
					required
					placeholder="Startup Title"
					defaultValue={state?.data?.title}
				/>

				{errors.title && (
					<p className="startup-form_error">
						{stringifyError(errors.title)}
					</p>
				)}
			</div>

			<div>
				<label
					htmlFor="description"
					className="startup-form_label"
				>
					description
				</label>
				<Textarea
					id="description"
					name="description"
					className="startup-form_textarea"
					required
					placeholder="Startup Description"
					defaultValue={state?.data?.description}
				/>

				{errors.description && (
					<p className="startup-form_error">
						{stringifyError(
							errors.description
						)}
					</p>
				)}
			</div>

			<div>
				<label
					htmlFor="category"
					className="startup-form_label"
				>
					Category
				</label>
				<Input
					id="category"
					name="category"
					className="startup-form_input"
					required
					placeholder="Startup Category (Tech, Health, Education...)"
					defaultValue={state?.data?.category}
				/>

				{errors.category && (
					<p className="startup-form_error">
						{stringifyError(
							errors.category
						)}
					</p>
				)}
			</div>

			<div>
				<label
					htmlFor="link"
					className="startup-form_label"
				>
					Image URL
				</label>
				<Input
					id="link"
					name="link"
					className="startup-form_input"
					required
					placeholder="Startup Image URL"
					defaultValue={state?.data?.link}
				/>

				{errors.link && (
					<p className="startup-form_error">
						{stringifyError(errors.link)}
					</p>
				)}
			</div>

			<div data-color-mode="light">
				<label
					htmlFor="pitch"
					className="startup-form_label"
				>
					Pitch
				</label>

				<MDEditor
					id="pitch"
					preview="edit"
					height={300}
					style={{
						borderRadius: 20,
						overflow: 'hidden'
					}}
					textareaProps={{
						placeholder:
							'Briefly describe your idea and what problem it solves..'
					}}
					previewOptions={{
						disallowedElements: ['style']
					}}
					value={pitch}
					onChange={value =>
						setPitch(value as string)
					}
				/>
				{/* <MDEditor.Markdown source={pitch} /> */}

				{errors.pitch && (
					<p className="startup-form_error">
						{stringifyError(errors.pitch)}
					</p>
				)}
			</div>

			<Button
				type="submit"
				className="startup-form_btn text-white"
				disabled={isPending}
			>
				{isPending
					? 'Submitting...'
					: 'Submit Your Idea'}
				<Send className="size-6 ml-2" />
			</Button>
		</form>
	);
};

export default StartupForm;
