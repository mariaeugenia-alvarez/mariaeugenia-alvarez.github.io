import { SiteHeader } from 'mariaeugenia-ui';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/proyectos/', label: 'Proyectos' },
  { href: '/transversales/', label: 'Transversales' },
  { href: '/contacto/', label: 'Contacto', destacado: true },
];

export const Inicio = () => (
  <SiteHeader name="Maria Eugenia" links={links.map((l) => ({ ...l, current: l.href === '/' }))} />
);

export const EnTransversales = () => (
  <SiteHeader name="Maria Eugenia" links={links.map((l) => ({ ...l, current: l.href === '/transversales/' }))} />
);
