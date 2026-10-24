// Patrones de la web (cabecera, pie, portada, listados), portados de src/layouts y src/pages.
import type { ReactNode } from 'react';
import { Button, Dato, Label } from './kit';

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(' ');
const fmt = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
const fecha = (d: string | Date) => fmt.format(typeof d === 'string' ? new Date(d) : d);

export interface ContainerProps {
  children: ReactNode;
  as?: 'div' | 'section' | 'header' | 'main' | 'article';
  className?: string;
}

/** Contenedor de página: ancho máximo 1040 px con gutter lateral de 16 px. */
export function Container({ children, as: Tag = 'div', className }: ContainerProps) {
  return <Tag className={cx('container', className)}>{children}</Tag>;
}

export interface ProseProps {
  children: ReactNode;
  className?: string;
}

/** Columna de lectura (65ch) para texto largo: estiliza h2, h3, p, listas, blockquote, code, pre y hr hijos. */
export function Prose({ children, className }: ProseProps) {
  return <div className={cx('prose', className)}>{children}</div>;
}

export interface NavLink {
  href: string;
  label: string;
  /** Página actual: subrayada y en color de enlace. */
  current?: boolean;
  /** Enlace destacado (p. ej. Contacto), en color de enlace. */
  destacado?: boolean;
}

export interface SiteHeaderProps {
  /** Nombre de la marca, en Newsreader. */
  name: string;
  brandHref?: string;
  links: NavLink[];
}

/** Cabecera del sitio: marca a la izquierda y navegación principal a la derecha. */
export function SiteHeader({ name, brandHref = '/', links }: SiteHeaderProps) {
  return (
    <header className="container me-site-header">
      <a className="me-brand" href={brandHref}>{name}</a>
      <nav aria-label="Principal">
        {links.map((l) => (
          <a key={l.href} href={l.href} className={l.destacado ? 'destacado' : undefined} aria-current={l.current ? 'page' : undefined}>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

export interface SiteFooterProps {
  name: string;
  role: string;
  year?: number;
}

/** Pie del sitio en tinta con texto arena y enlaces en oro. */
export function SiteFooter({ name, role, year = new Date().getFullYear() }: SiteFooterProps) {
  return (
    <footer className="me-site-footer">
      <div className="container me-footer-inner">
        <span>{name} · {role}</span>
        <Dato>© {year}</Dato>
      </div>
    </footer>
  );
}

export interface HeroProps {
  /** Etiqueta mono sobre el titular. */
  label: string;
  /** Titular h1; usa `<Destacado>` para resaltar palabras. */
  title: ReactNode;
  /** Entradilla bajo el titular. */
  bio?: ReactNode;
  cta?: { href: string; label: string };
}

/** Portada de página: etiqueta, titular grande, entradilla y botón opcional. */
export function Hero({ label, title, bio, cta }: HeroProps) {
  return (
    <section className="container me-hero">
      <Label>{label}</Label>
      <h1>{title}</h1>
      {bio && <p className="me-lead">{bio}</p>}
      {cta && <Button href={cta.href}>{cta.label}</Button>}
    </section>
  );
}

export interface LatestPostProps {
  /** Sección de la que viene el artículo (p. ej. "Transversales"). */
  section: string;
  title: string;
  href: string;
  description: string;
  /** Fecha (ISO o Date); se muestra en formato es-ES. */
  date?: string | Date;
  /** Si es true, muestra "En preparación" en lugar de la fecha. */
  enPreparacion?: boolean;
}

/** Bloque "Último en …": etiqueta con fecha, título enlazado y descripción, con filete superior. */
export function LatestPost({ section, title, href, description, date, enPreparacion }: LatestPostProps) {
  return (
    <section className="container me-latest">
      <Label>
        Último en {section} · {enPreparacion ? 'En preparación' : date ? <Dato>{fecha(date)}</Dato> : null}
      </Label>
      <h2><a href={href}>{title}</a></h2>
      <p>{description}</p>
    </section>
  );
}

export interface FeatureStepsProps {
  /** Título de la sección, en estilo etiqueta. */
  title: string;
  /** Pasos numerados 01, 02, 03… Se reparten en columnas (una sola en móvil). */
  steps: Array<{ title: string; description: string }>;
}

/** Lista numerada de pasos o características en columnas, con número mono en color de marca. */
export function FeatureSteps({ title, steps }: FeatureStepsProps) {
  return (
    <section className="container me-steps">
      <Label as="h2">{title}</Label>
      <ol style={{ gridTemplateColumns: `repeat(${Math.min(steps.length, 3)}, minmax(0, 1fr))` }}>
        {steps.map((s, i) => (
          <li key={s.title}>
            <Dato className="me-num">{String(i + 1).padStart(2, '0')}</Dato>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export interface ArticleCardProps {
  href: string;
  title: string;
  description: string;
  date?: string | Date;
  enPreparacion?: boolean;
  /** Marca "· borrador" junto a la fecha. */
  draft?: boolean;
  /** Imagen 1200×630 a la izquierda; sin ella la tarjeta es solo texto. */
  thumbnail?: string;
}

/** Tarjeta de artículo para listados: miniatura 1200×630 + fecha, título y descripción. */
export function ArticleCard({ href, title, description, date, enPreparacion, draft, thumbnail }: ArticleCardProps) {
  return (
    <a className={cx('me-article-card', !thumbnail && 'me-article-card--sin-imagen')} href={href}>
      {thumbnail && <img src={thumbnail} alt="" width={1200} height={630} loading="lazy" decoding="async" />}
      <span className="me-article-text">
        <Label>
          {enPreparacion ? 'En preparación' : date ? <Dato>{fecha(date)}</Dato> : null}
          {draft && ' · borrador'}
        </Label>
        <span className="me-article-title">{title}</span>
        <span className="me-article-desc">{description}</span>
      </span>
    </a>
  );
}

export interface PostHeaderProps {
  section: string;
  sectionHref: string;
  title: string;
  /** Entradilla (dek) bajo el titular. */
  description: string;
  date?: string | Date;
  enPreparacion?: boolean;
}

/** Cabecera de artículo: miga con sección y fecha, titular h1 y entradilla, en columna de lectura. */
export function PostHeader({ section, sectionHref, title, description, date, enPreparacion }: PostHeaderProps) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return (
    <header className="me-post-head">
      <Label>
        <a href={sectionHref}>{section}</a> ·{' '}
        {enPreparacion ? 'En preparación' : d ? <time className="dato" dateTime={d.toISOString()}>{fecha(d)}</time> : null}
      </Label>
      <h1>{title}</h1>
      <p className="me-dek">{description}</p>
    </header>
  );
}
