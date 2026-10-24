import { Container, Label } from 'mariaeugenia-ui';

export const Default = () => (
  <Container as="section">
    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
      <Label>Contenedor · máx. 1040 px con gutter de 16 px</Label>
      <p style={{ margin: 'var(--space-2) 0 0' }}>
        Todas las secciones de la web van dentro de un contenedor para alinear sus bordes con la cabecera.
      </p>
    </div>
  </Container>
);
