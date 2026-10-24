import { Button, Surface } from 'mariaeugenia-ui';

export const Primario = () => <Button href="/transversales/">Leer el último artículo</Button>;

export const Variantes = () => (
  <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
    <Button variant="primario">Leer el artículo</Button>
    <Button variant="oro">Escríbeme</Button>
    <Button variant="borde">Ver proyectos</Button>
  </div>
);

export const SobreNoche = () => (
  <Surface variant="noche" padding={6}>
    <Button variant="oro">Escríbeme</Button>
  </Surface>
);
