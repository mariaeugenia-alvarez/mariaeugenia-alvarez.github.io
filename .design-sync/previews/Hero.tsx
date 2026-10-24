import { Destacado, Hero } from 'mariaeugenia-ui';

export const Inicio = () => (
  <Hero
    label="Ingeniera de IA"
    title={<>No todo se soluciona con IA. Saber <Destacado>cuándo</Destacado> usarla y <Destacado>cómo</Destacado>, es mi trabajo.</>}
    bio="Implemento sistemas de IA con desarrollo propio o integrando herramientas de terceros."
    cta={{ href: '/transversales/', label: 'Leer el último artículo' }}
  />
);

export const SinBoton = () => (
  <Hero
    label="Transversales"
    title={<>Ideas de otros campos que acaban en el <Destacado>software</Destacado></>}
    bio="Modelos mentales de otros ámbitos que, bien entendidos, sirven para tomar mejores decisiones al construir software y sistemas agénticos."
  />
);
