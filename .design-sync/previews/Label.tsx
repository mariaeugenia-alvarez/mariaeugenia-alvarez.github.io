import { Label, Surface } from 'mariaeugenia-ui';

export const Default = () => <Label>Ingeniera de IA</Label>;

export const Numerada = () => <Label>01 / Casos</Label>;

export const ComoTituloDeSeccion = () => <Label as="h2">Qué incluye cada artículo</Label>;

export const SobreCampo = () => (
  <Surface variant="campo" padding={6}>
    <Label>Transversales</Label>
  </Surface>
);
