import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Cada artículo de Transversales es un archivo .md o .mdx en src/content/transversales/
// draft: true → se ve en local, pero no se publica en la web.
const transversales = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/transversales' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    // Imagen para la tarjeta del listado y para compartir en redes (ruta dentro de public/)
    thumbnail: z.string().optional(),
    // Publicado como adelanto: se ve la página, marcada como "En preparación"
    enPreparacion: z.boolean().default(false),
  }),
});

export const collections = { transversales };
