import { useState } from "react";

export default function ConsoleOutput({ output, label = "Wyjście konsoli", revealWhitespace = false }) {
  const [visible, setVisible] = useState(revealWhitespace);
  const text = String(output).replace(/\r\n/g, "\n");
  const displayed = visible ? text.replace(/ /g, "·").replace(/\t/g, "⇥").replace(/\n/g, "↵\n") : text;
  return <div className="terminal-output">
    <div className="terminal-output-heading"><strong>{label}</strong><button type="button" aria-pressed={visible} onClick={() => setVisible(!visible)}>Pokaż białe znaki</button></div>
    <pre tabIndex={0} aria-label={label}><code>{displayed}</code></pre>
    {visible && <p className="terminal-output-legend">· spacja · ↵ nowa linia · ⇥ tabulator — oznaczeń nie wpisuj w kodzie.</p>}
  </div>;
}
