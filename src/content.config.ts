import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tutoriais = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tutoriais' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    level: z.enum(['Iniciante', 'Intermediário', 'Avançado']).optional(),
    thumbnail: z.string().optional(),
  }),
});

export const collections = { tutoriais };