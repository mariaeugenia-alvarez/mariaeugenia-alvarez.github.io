import { Dato, Label } from 'mariaeugenia-ui';

export const Fecha = () => <Dato>23 oct 2026</Dato>;

export const EnEtiqueta = () => (
  <Label>
    Último en Transversales · <Dato>23 oct 2026</Dato>
  </Label>
);

export const Cifras = () => (
  <p style={{ margin: 0 }}>
    Iteración <Dato>3</Dato> · progreso <Dato>60%</Dato> · <Dato>1.040 px</Dato> de ancho máximo
  </p>
);
