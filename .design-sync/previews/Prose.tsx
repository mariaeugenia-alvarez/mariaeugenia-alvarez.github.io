import { Prose } from 'mariaeugenia-ui';

export const Articulo = () => (
  <Prose>
    <p>Mueve la línea para recorrer las cinco etapas. Al llegar al final, lo aprendido vuelve al principio como nuevo punto de partida.</p>
    <h2>Estructura del artículo</h2>
    <ol>
      <li><strong>Entender.</strong> Averiguar qué hay y para qué importa.</li>
      <li><strong>Acotar.</strong> Definir qué puedes hacer y qué no, y cuáles serán tus criterios.</li>
      <li><strong>Elegir.</strong> Lo que optimice tu resultado en base a tu contorno actual.</li>
    </ol>
    <blockquote><p>El texto completo de este artículo está en preparación.</p></blockquote>
    <p>Un agente que llama a <code>search()</code> en bucle no está decidiendo: está repitiendo.</p>
    <pre><code>{'if (criterio.cumplido) return probar(idea);'}</code></pre>
  </Prose>
);
