// Cabecera interactiva "Bombillas de ideas": entender → acotar → elegir → probar → aprender.
// Canvas + JavaScript propio, sin dependencias. Se pausa sola fuera de pantalla.
import { useEffect, useRef } from 'react';
import { mountBombillas } from './bombillas-engine';

export interface BombillasIdeasProps {
  /** Recorre sola las cinco etapas al montarse y vuelve a iterar al llegar al 100 %. Por defecto `true`. */
  autoplay?: boolean;
  /** Progreso inicial 0–100 (cada etapa ocupa 20). Útil con `autoplay={false}` para mostrar una etapa fija. */
  initialProgress?: number;
  /** Sale del ancho de lectura a 1040 px como en los artículos. Ponlo a `false` dentro de tarjetas o columnas estrechas. */
  bleed?: boolean;
}

/**
 * Animación interactiva en panel noche: las ideas (bombillas) avanzan por cinco etapas y lo aprendido
 * vuelve al principio. Se arrastra la línea o se pulsa una etapa. Respeta `prefers-reduced-motion`.
 */
export function BombillasIdeas({ autoplay = true, initialProgress = 0, bleed = true }: BombillasIdeasProps) {
  const ref = useRef<HTMLElement>(null);
  // El motor es imperativo y guarda su propio estado: se monta una vez por instancia.
  useEffect(() => mountBombillas(ref.current!, { autoplay, initialProgress }), []);
  return (
    <figure
      ref={ref}
      className={`me-bombillas panel-noche${bleed ? ' me-bombillas--bleed' : ''}`}
      aria-label="Animación interactiva: las ideas avanzan por cinco etapas, de entender a aprender"
    >
      <div className="wrap">
        <div className="head">
          <span className="name">Ideas <span className="iter" data-el="iter" /></span>
          <span className="pct" data-el="pct" />
        </div>
        <div className="scene" data-el="scene">
          <canvas data-el="cv" />
          <input type="range" data-el="range" min={0} max={100} step={0.1} defaultValue={initialProgress} aria-label="Progreso del flujo de ideas" />
        </div>
        <div className="stages" data-el="stages">
          {['entender', 'acotar', 'elegir', 'probar', 'aprender'].map((s, i) => (
            <button key={s} type="button" data-i={i}>{s}</button>
          ))}
        </div>
        <div className="foot">
          <p className="caption" data-el="caption" aria-live="polite" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }} hidden>
            <span className="hint">Arrastra la línea</span>
            <button className="reset" data-el="reset" type="button" hidden>Reiniciar</button>
            <button className="play" data-el="play" type="button" />
          </div>
        </div>
      </div>
    </figure>
  );
}
