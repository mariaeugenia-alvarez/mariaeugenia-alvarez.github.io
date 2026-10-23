// Textos tomados de brand/BRAND.md (kit de marca v1.0).
export const SITE = {
  name: 'Maria Eugenia',
  role: 'Ingeniera de IA',
  description:
    'Ingeniera de IA. Implemento sistemas de IA con desarrollo propio o integrando herramientas de terceros. Con rigor y sin humo.',
};

// Todas las secciones previstas. Solo las que tienen enabled: true
// aparecen en el menú; las demás se activan cuando tengan contenido.
export const NAV = [
  { href: '/', label: 'Inicio', enabled: true },
  { href: '/proyectos/', label: 'Proyectos', enabled: false },
  { href: '/sobre-mi/', label: 'Sobre mí', enabled: false },
  { href: '/charlas/', label: 'Charlas', enabled: false },
  { href: '/transversales/', label: 'Transversales', enabled: true },
  { href: '/contacto/', label: 'Contacto', enabled: false, destacado: true },
];
