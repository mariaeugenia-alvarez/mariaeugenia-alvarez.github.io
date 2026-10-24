// Piezas del kit de marca v1.0: envuelven las clases de brand.css sin añadir estilo propio.
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(' ');

export interface LabelProps {
  children: ReactNode;
  /** Elemento HTML a renderizar (por defecto `span`; usa `h2` para títulos de sección en forma de etiqueta). */
  as?: 'span' | 'p' | 'div' | 'h2' | 'h3';
  className?: string;
}

/** Etiqueta mono en mayúsculas del kit ("01 / CASOS"). Color `--color-label`; sobre `Surface variant="campo"` pasa a oro. */
export function Label({ children, as: Tag = 'span', className }: LabelProps) {
  return <Tag className={cx('label', className)}>{children}</Tag>;
}

export interface DestacadoProps {
  children: ReactNode;
}

/** Palabra destacada dentro de un titular, en el color de marca (terracota en claro, oro en oscuro). */
export function Destacado({ children }: DestacadoProps) {
  return <span className="destacado">{children}</span>;
}

export interface TextoOroProps {
  children: ReactNode;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3';
  className?: string;
}

/** Texto con brillo oro metálico. Solo para texto grande o sobre fondos oscuros/oliva. */
export function TextoOro({ children, as: Tag = 'span', className }: TextoOroProps) {
  return <Tag className={cx('texto-oro', className)}>{children}</Tag>;
}

export interface DatoProps {
  children: ReactNode;
  as?: 'span' | 'time' | 'p';
  className?: string;
}

/** Fechas, cifras y datos en Geist Mono con números tabulares. */
export function Dato({ children, as: Tag = 'span', className }: DatoProps) {
  return <Tag className={cx('dato', className)}>{children}</Tag>;
}

type ButtonBase = {
  /** `primario` (oliva/oro según tema), `oro` (degradado metálico) o `borde` (transparente con filete). */
  variant?: 'primario' | 'oro' | 'borde';
  children: ReactNode;
  className?: string;
};
export type ButtonProps = ButtonBase &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'>)
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>)
  );

/** Botón del kit. Con `href` se renderiza como enlace `<a>`; sin él, como `<button>`. */
export function Button({ variant = 'primario', children, className, ...rest }: ButtonProps) {
  const cls = cx('btn', `btn-${variant}`, className);
  if (typeof rest.href === 'string') {
    return <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>;
  }
  const { type = 'button', ...btn } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return <button type={type} className={cls} {...btn}>{children}</button>;
}

const SURFACE_CLASS = {
  arena: 'bloque-arena',
  terracota: 'bloque-terracota',
  campo: 'seccion-campo',
  tarjeta: 'tarjeta',
  noche: 'panel-noche',
} as const;

export interface SurfaceProps {
  /**
   * `arena` bloque cálido · `terracota` solo con texto de 24 px o más · `campo` sección con degradado oliva ·
   * `tarjeta` papel con padding propio · `noche` panel oscuro.
   */
  variant: keyof typeof SURFACE_CLASS;
  children: ReactNode;
  /** Padding interior con la escala del kit (`--space-*`). `tarjeta` ya trae 4. */
  padding?: 0 | 4 | 6 | 8 | 12 | 16;
  as?: 'div' | 'section' | 'article' | 'aside';
  className?: string;
}

/** Superficies de color del kit: bloques, tarjeta, sección campo y panel noche. */
export function Surface({ variant, children, padding, as: Tag = 'div', className }: SurfaceProps) {
  const style = padding != null ? { padding: padding === 0 ? 0 : `var(--space-${padding})` } : undefined;
  return <Tag className={cx(SURFACE_CLASS[variant], className)} style={style}>{children}</Tag>;
}
