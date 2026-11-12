import { engineGuide } from '../data/engineGuide.js';

const documented = new Map(engineGuide.map(({ name, description }) => [
  name, { entry: name, summary: description.split('. ', 1)[0].replace(/\.?$/, '.') },
]));
for (const [term, entry, summary] of [
  ['move', 'CharacterController2D', 'Ustawia kierunek i prędkość ruchu obiektu.'],
  ['isKeyDown', 'InputManager', 'Sprawdza, czy klawisz jest przytrzymany.'],
  ['isKeyPressed', 'InputManager', 'Wykrywa początek naciśnięcia klawisza.'],
  ['onUpdate', 'Component', 'Silnik wywołuje tę metodę w każdym kroku aktualizacji.'],
  ['setWorldBounds', 'Game', 'Ustawia granice świata gry.'],
  ['hitLayers', 'Projectile2D', 'Wybiera warstwy, które pocisk może trafić.'],
]) documented.set(term, { entry, summary });

const projectTerms = new Set([
  'EnemyAI', 'FleeAI', 'PlayerController', 'BulletShooter', 'SpaceShooter',
  'ProjectileHit', 'Health', 'GameMain', 'Player', 'Slime', 'Bat', 'Enemy',
  'Coin', 'PlatformA', 'PlatformB', 'Fireball', 'dx', 'dy', 'speed',
  'controller', 'owner', 'lifetime', 'Math.hypot', 'shoot', 'shots',
]);
const terms = [...new Set([...documented.keys(), ...projectTerms])]
  .sort((first, second) => second.length - first.length)
  .map(term => term.replace(/[.*+?^$(){}|[\]\\]/g, '\\$&'));
const wordCharacter = '[\\p{L}\\p{M}\\p{N}_$]';
const pattern = new RegExp('(?<!' + wordCharacter + ')(' + terms.join('|') + ')(?!' + wordCharacter + ')', 'gu');

export default function GameDevTerms({ text }) {
  return text.split(pattern).map((part, index) => {
    const reference = documented.get(part);
    if (reference) return (
      <button key={index} type="button" className="pilot-term pilot-term--docs"
        aria-haspopup="dialog" aria-label={'Dokumentacja: ' + part}
        title={reference.summary} aria-description={reference.summary}
        data-summary={reference.summary}
        onKeyDown={event => {
          if (event.key === 'Escape') event.currentTarget.dataset.summaryDismissed = '';
        }}
        onBlur={event => delete event.currentTarget.dataset.summaryDismissed}
        onClick={event => window.dispatchEvent(new CustomEvent('java-lab-open-engine-guide', {
          detail: { entry: reference.entry, trigger: event.currentTarget },
        }))}>
        {part}
      </button>
    );
    return projectTerms.has(part) ? <span key={index} className="pilot-term">{part}</span> : part;
  });
}
