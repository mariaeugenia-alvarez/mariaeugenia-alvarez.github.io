import { Destacado } from 'mariaeugenia-ui';

export const EnTitular = () => (
  <h1 style={{ maxWidth: '22ch', margin: 0 }}>
    No todo se soluciona con IA. Saber <Destacado>cuándo</Destacado> usarla y <Destacado>cómo</Destacado>, es mi trabajo.
  </h1>
);

export const EnSubtitulo = () => (
  <h2 style={{ margin: 0 }}>
    Ideas de otros campos que acaban en el <Destacado>software</Destacado>
  </h2>
);
