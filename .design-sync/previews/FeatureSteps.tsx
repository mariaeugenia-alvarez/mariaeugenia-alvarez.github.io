import { FeatureSteps } from 'mariaeugenia-ui';

export const TresPasos = () => (
  <FeatureSteps
    title="Qué incluye cada artículo"
    steps={[
      { title: 'Un modelo mental', description: 'Una idea concreta, explicada sin jerga y con un caso real.' },
      { title: 'De qué depende', description: 'En qué contexto funciona, en cuál no y qué límites tiene.' },
      { title: 'El patrón aplicable', description: 'Cómo se traduce a software y a sistemas agénticos. Todo artículo termina aquí.' },
    ]}
  />
);

export const CincoEtapas = () => (
  <FeatureSteps
    title="Marco mental de decisiones"
    steps={[
      { title: 'Entender', description: 'Averiguar qué hay y para qué importa.' },
      { title: 'Acotar', description: 'Definir qué puedes hacer y qué no, y cuáles serán tus criterios.' },
      { title: 'Elegir', description: 'Lo que optimice tu resultado en base a tu contorno actual.' },
      { title: 'Probar', description: 'Registrar el antes y el después. Lo que no se mide no se puede controlar.' },
      { title: 'Aprender', description: 'Lo que salió bien, pero sobre todo lo que salió mal.' },
    ]}
  />
);
