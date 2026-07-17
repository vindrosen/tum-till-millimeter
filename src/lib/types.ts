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
}

export interface FaqItem {
  fraga: string;
  svar: string;
}

export type SokTraffTyp = "dimension" | "byggord" | "tum";

export interface SokTraff {
  typ: SokTraffTyp;
  score: number;
  exakt: boolean;
  dimension?: Dimension;
  byggord?: Byggord;
  tum?: TumRad;
}
