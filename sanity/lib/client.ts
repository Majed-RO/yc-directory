import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR/ Incremental Static Regeneration or tag-based revalidation
  /* if useCdn is true, it will return cached result within 60 seconds */
})
