import { PostHeader } from 'mariaeugenia-ui';

const base = {
  section: 'Transversales',
  sectionHref: '/transversales/',
  title: 'Marco mental de decisiones según problemas',
  description: 'Cómo pasa una idea de la intuición al aprendizaje en cinco etapas, y por qué lo que aprendes al final se convierte en el punto de partida de la siguiente vuelta.',
};

export const Publicado = () => <PostHeader {...base} date="2026-10-23" />;

export const EnPreparacion = () => <PostHeader {...base} enPreparacion />;
