import { useState } from 'react';
import './StepTrial.css';

const stroke = '#173c52';
const teal = '#2a9d8f';
const orange = '#e76f51';
const gold = '#f4a261';

function ArrayRow({ values, highlight = [], compare, swap, sortedFrom, sortedUntil }) {
  const n = values.length;
  const cw = Math.min(52, Math.floor(560 / n) - 6);
  const ch = 42;
  const gap = 6;
  const top = 34;
  const pad = 8;
  const row = n * cw + (n - 1) * gap;
  const W = row + pad * 2;
  const H = top + ch + 24 + pad;
  const x0 = (W - row) / 2;
  const marks = new Set(highlight);
  const pair = new Set(compare || []);
  const swapped = new Set(swap || []);
  const sorted = (i) => (sortedFrom != null && i >= sortedFrom) || (sortedUntil != null && i <= sortedUntil);
  return <svg className="step-trial-row" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Tablica: ${values.join(', ')}`}>
    {swap && <path
      d={`M${x0 + swap[0] * (cw + gap) + cw / 2} ${top - 6} Q ${x0 + (swap[0] + swap[1]) * (cw + gap) / 2 + cw / 2} ${top - 22 - Math.abs(swap[1] - swap[0]) * 5} ${x0 + swap[1] * (cw + gap) + cw / 2} ${top - 6}`}
      fill="none" stroke={orange} strokeWidth="3" strokeLinecap="round" markerEnd="url(#step-trial-arrow)" markerStart="url(#step-trial-arrow)" />}
    <defs>
      <marker id="step-trial-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse">
        <path d="M1 1 L7 4 L1 7 Z" fill={orange} />
      </marker>
    </defs>
    {values.map((value, i) => {
      const x = x0 + i * (cw + gap);
      const on = marks.has(i);
      const comparing = pair.has(i);
      const swapping = swapped.has(i);
      const label = String(value);
      return <g key={i}>
        <rect x={x} y={top} width={cw} height={ch} rx="8"
          fill={on ? teal : sorted(i) ? gold : '#fff8ea'}
          fillOpacity={on ? 1 : sorted(i) ? .45 : 1}
          stroke={comparing || swapping ? orange : stroke}
          strokeWidth={on || comparing || swapping ? 4 : 2.5} />
        {label !== '' && <text x={x + cw / 2} y={top + 27} textAnchor="middle"
          fontSize={label.length > 3 ? 11 : 15} fontWeight="800" fill={on ? '#fff' : stroke}>{label}</text>}
        <text x={x + cw / 2} y={top + ch + 16} textAnchor="middle" fontSize="11" fontWeight="700" fill="#5c6b72">{i}</text>
      </g>;
    })}
  </svg>;
}

export default function StepTrial({ trace }) {
  const steps = trace.steps || [];
  const [index, setIndex] = useState(0);
  const step = steps[index] || {};
  let values = trace.values;
  for (let k = 0; k <= index; k++) {
    if (steps[k].values) values = steps[k].values;
  }
  const last = steps.length - 1;
  return <div className="step-trial">
    <div className="step-trial-stage">
      {values && <ArrayRow values={values} highlight={step.highlight} compare={step.compare} swap={step.swap}
        sortedFrom={step.sortedFrom} sortedUntil={step.sortedUntil} />}
      {step.vars && <table className="step-trial-vars"><tbody>
        {Object.entries(step.vars).map(([name, value]) => <tr key={name}><th scope="row">{name}</th><td>{String(value)}</td></tr>)}
      </tbody></table>}
      {step.stack && <div className="step-trial-stack" aria-label="Stos wywołań">
        <span>Stos wywołań (wierzch na górze)</span>
        <ol>{step.stack.map((frame, i) => <li key={`${i}-${frame}`} data-top={i === 0 || undefined}>{frame}</li>)}</ol>
      </div>}
    </div>
    <p className="step-trial-caption" role="status">{step.caption}</p>
    <div className="step-trial-controls">
      <button type="button" className="step-trial-button" onClick={() => setIndex(i => i - 1)} disabled={index <= 0}>◀ Wstecz</button>
      <span className="step-trial-counter">Krok {index + 1} / {steps.length}</span>
      <button type="button" className="button button--primary pilot-trial-play" onClick={() => setIndex(i => i + 1)} disabled={index >= last}>Następny krok ▶</button>
      <button type="button" className="step-trial-button" onClick={() => setIndex(0)} disabled={index <= 0}>Od początku</button>
    </div>
  </div>;
}
