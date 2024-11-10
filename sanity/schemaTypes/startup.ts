import { defineType, defineField } from 'sanity';

export const startup = defineType({
	name: 'startup',
	title: 'Startup',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			type: 'string'
		}),
		defineField({
			name: 'slug',
			type: 'slug',
			options: {
				source: 'title'
			}
		}),
		defineField({
			name: 'author',
			type: 'reference',
			to: { type: 'author' }
		}),
		defineField({
			name: 'views',
			type: 'number'
		}),
		defineField({
			name: 'category',
			type: 'string',
			validation: Rule =>
				Rule.min(1)
					.max(20)
					.required()
					.error('Please enter a category')
		}),
		defineField({
			name: 'image',
			type: 'url',
			validation: Rule => Rule.required()
		}),
    defineField({
      name: "description",
      type: "text",
    }),
		defineField({
			name: 'pitch',
			type: 'markdown' // this will use custom type, so we have to install it by: npm i sanity-plugin-markdown
		})
	]
});
