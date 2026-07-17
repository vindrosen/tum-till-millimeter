import dimensionerData from "@/data/dimensioner.json";
import byggordData from "@/data/byggord.json";
import faqData from "@/data/faq.json";
import tumData from "@/data/tumtabell.json";
import spikData from "@/data/spik.json";
import skruvData from "@/data/skruv.json";
import rorData from "@/data/ror.json";
import type { Dimension, Byggord, FaqItem, TumRad, Spik, Skruv, RorDim } from "./types";

export const dimensioner: Dimension[] = dimensionerData as Dimension[];
export const byggord: Byggord[] = byggordData as Byggord[];
export const faq: FaqItem[] = faqData as FaqItem[];
export const tumtabell: TumRad[] = tumData as TumRad[];
export const spik: Spik[] = spikData as Spik[];
export const skruv: Skruv[] = skruvData as Skruv[];
export const ror: RorDim[] = rorData as RorDim[];

/** Termer som visas som kort i Byggspråk-sektionen. */
export const bygguttryck: Byggord[] = byggord.filter((b) => b.grupp === "uttryck");
/** Termer som visas i byggordboken (allt som inte är uttryck). */
export const ordbok: Byggord[] = byggord.filter((b) => b.grupp !== "uttryck");

export function dimensionById(id: string): Dimension | undefined {
  return dimensioner.find((d) => d.id === id);
}

export function byggordById(id: string): Byggord | undefined {
  return byggord.find((b) => b.id === id);
}

export const populäraDimensioner: Dimension[] = dimensioner.filter((d) => d.popular);
