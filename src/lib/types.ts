export interface TumRad {
  tum: string;
  tumDecimal: number;
  mm: number;
  namn: string;
  aliases?: string[];
}

export interface Matt {
  /** tjocklek i mm */
  t: number;
  /** bredd i mm */
  b: number;
}

export interface Dimension {
  id: string;
  namn: string;
  tum: string;
  ohyvlat: Matt;
  hyvlat: Matt;
  kategori: string;
  beskrivning: string;
  anvandning: string;
  bild: string;
  popular: boolean;
  aliases: string[];
  relaterade: string[];
}

export interface Byggord {
  id: string;
  ord: string;
  kort: string;
  beskrivning: string;
  exempel: string[];
  relaterade: string[];
  dimensioner: string[];
  bild: string;
  aliases: string[];
  /** "uttryck" visas i Byggspråk-sektionen, övriga i byggordboken. */
  grupp?: "ordbok" | "uttryck";
}

export interface Spik {
  id: string;
  /** Traditionellt namn, t.ex. "4″ spik (fyrtumsspik)". */
  namn: string;
  tum: string;
  mm: number;
  anvandning: string;
  bild: string;
  aliases: string[];
  relaterade: string[];
}

export interface Skruv {
  id: string;
  namn: string;
  tum: string;
  mm: number;
  anvandning: string;
  bild: string;
  aliases: string[];
  relaterade: string[];
}

export interface RorDim {
  id: string;
  /** Nominell storlek, t.ex. "1/2″". */
  namn: string;
  tum: string;
  /** DN-beteckning, t.ex. "DN15". */
  dn: string;
  /** Ungefärlig ytterdiameter i mm. */
  ytterdiameter: number;
  anvandning: string;
  aliases: string[];
}

export interface FaqItem {
  fraga: string;
  svar: string;
}

export type SokTraffTyp = "dimension" | "byggord" | "tum" | "spik" | "skruv" | "ror";

export interface SokTraff {
  typ: SokTraffTyp;
  score: number;
  exakt: boolean;
  dimension?: Dimension;
  byggord?: Byggord;
  tum?: TumRad;
  spik?: Spik;
  skruv?: Skruv;
  ror?: RorDim;
}
