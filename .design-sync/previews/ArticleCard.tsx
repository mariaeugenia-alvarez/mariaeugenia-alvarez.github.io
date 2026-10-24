import { ArticleCard } from 'mariaeugenia-ui';

const base = {
  href: '/transversales/marco-mental-de-decisiones-segun-problemas/',
  title: 'Marco mental de decisiones según problemas',
  description: 'Cómo pasa una idea de la intuición al aprendizaje en cinco etapas, y por qué lo que aprendes al final se convierte en el punto de partida de la siguiente vuelta.',
};

export const ConMiniatura = () => (
  <ArticleCard {...base} enPreparacion thumbnail="https://mariaeugenia-alvarez.github.io/img/transversales/marco-mental-de-decisiones-segun-problemas.jpg" />
);

export const SoloTexto = () => <ArticleCard {...base} date="2026-10-23" />;

export const Borrador = () => <ArticleCard {...base} date="2026-10-23" draft />;
