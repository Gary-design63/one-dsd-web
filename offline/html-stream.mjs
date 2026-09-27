/**
 * Rebuild a streamed Next.js page into its final HTML, as the browser would.
 * React streams late content as hidden segments (<div hidden id="S:n">) plus
 * script calls that move them into place:
 *   $RC("B:x","S:y")  replace the loading fallback of boundary B:x with S:y
 *   $RS("S:y","P:x")  replace the placeholder <template id="P:x"> with S:y
 */
export function resolveStream(html) {
  const segments = new Map();
  const boundaryFor = new Map();
  const placeholderFor = new Map();
  for (const call of html.matchAll(/\$RC\("B:([0-9]+)","S:([0-9]+)"\)/g)) boundaryFor.set(call[1], call[2]);
  for (const call of html.matchAll(/\$RS\("S:([0-9]+)","P:([0-9]+)"\)/g)) placeholderFor.set(call[2], call[1]);

  let at;
  while ((at = html.search(/<div hidden(?:="")? id="S:[0-9]+">/)) >= 0) {
    const open = html.slice(at).match(/^<div hidden(?:="")? id="S:([0-9]+)">/);
    const tag = /<(\/?)div\b[^>]*>/g;
    tag.lastIndex = at + open[0].length;
    let depth = 1, t;
    while (depth > 0 && (t = tag.exec(html))) depth += t[1] ? -1 : 1;
    const end = t ? tag.lastIndex : html.length;
    segments.set(open[1], html.slice(at + open[0].length, end - "</div>".length));
    html = html.slice(0, at) + html.slice(end);
  }

  for (let pass = 0; pass < 200; pass++) {
    let changed = false;
    // Placeholders: a bare template replaced by its segment.
    html = html.replace(/<template id="P:([0-9]+)"><\/template>/g, (m, id) => {
      const segment = segments.get(placeholderFor.get(id) ?? id);
      if (segment === undefined) return m;
      changed = true;
      return segment;
    });
    // Boundaries: the fallback between <!--$?--><template id="B:n"> and the matching <!--/$-->.
    const pattern = /<!--\$\?--><template id="B:([0-9]+)"><\/template>/g;
    let m;
    while ((m = pattern.exec(html))) {
      const segment = segments.get(boundaryFor.get(m[1]) ?? m[1]);
      if (segment === undefined) continue;
      const marks = /<!--(\$\??|\$!|\/\$)-->/g;
      marks.lastIndex = m.index + m[0].length;
      let depth = 1, k;
      while (depth > 0 && (k = marks.exec(html))) depth += k[1] === "/$" ? -1 : 1;
      const end = k ? marks.lastIndex : html.length;
      html = html.slice(0, m.index) + segment + html.slice(end);
      changed = true;
      break;
    }
    if (!changed) break;
  }
  return html;
}
