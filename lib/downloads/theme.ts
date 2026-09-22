// Colors mirror app/globals.css tokens so downloaded files read as part of the program.
export const DOWNLOAD_THEME = {
  navy: "003865",
  navyDeep: "002244",
  green: "2E6B12",
  greenSoft: "F3F9EA",
  ink: "181817",
  muted: "353532",
  line: "DDDDD9",
  panel: "F5F5F3",
  amberSoft: "FFF7E0",
  amberStrong: "7A4D00",
  fontFamily: "Aptos",
} as const;

export function hex(color: string): string {
  return `#${color}`;
}
