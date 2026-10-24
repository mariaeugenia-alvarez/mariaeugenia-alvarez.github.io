import { Label, Surface } from 'mariaeugenia-ui';

export const Arena = () => (
  <Surface variant="arena" padding={6}>
    <Label>Nota</Label>
    <p style={{ margin: 'var(--space-2) 0 0' }}>Lo que no se mide no se puede controlar.</p>
  </Surface>
);

export const Terracota = () => (
  <Surface variant="terracota" padding={6}>
    <h3 style={{ margin: 0 }}>Saber cuándo usar IA</h3>
  </Surface>
);

export const CampoConTarjeta = () => (
  <Surface variant="campo" padding={8}>
    <Label>Transversales</Label>
    <h2 style={{ margin: 'var(--space-3) 0 var(--space-6)' }}>Modelos mentales aplicados</h2>
    <Surface variant="tarjeta">
      <Label>01 / Entender</Label>
      <p style={{ margin: 'var(--space-2) 0 0' }}>Averiguar qué hay y para qué importa.</p>
    </Surface>
  </Surface>
);

export const Noche = () => (
  <Surface variant="noche" padding={8}>
    <h3 style={{ margin: '0 0 var(--space-2)' }}>Aprender</h3>
    <p style={{ margin: 0 }}>Lo que salió bien, pero sobre todo lo que salió mal.</p>
  </Surface>
);
