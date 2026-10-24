import { LatestPost } from 'mariaeugenia-ui';

const post = {
  section: 'Transversales',
  title: 'Marco mental de decisiones según problemas',
  href: '/transversales/marco-mental-de-decisiones-segun-problemas/',
  description: 'Cómo pasa una idea de la intuición al aprendizaje en cinco etapas, y por qué lo que aprendes al final se convierte en el punto de partida de la siguiente vuelta.',
};

export const Publicado = () => <LatestPost {...post} date="2026-10-23" />;

export const EnPreparacion = () => <LatestPost {...post} enPreparacion />;
