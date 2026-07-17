/** Basväg för statisk export (t.ex. "/tum-till-millimeter" på GitHub Pages). Tom lokalt. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefixar en absolut sökväg med basvägen. withBase("/sw.js") -> "/repo/sw.js". */
export function withBase(path: string): string {
  return `${BASE_PATH}${path}`;
}
