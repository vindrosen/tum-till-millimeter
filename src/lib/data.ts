import dimensionerData from "@/data/dimensioner.json";
import byggordData from "@/data/byggord.json";
import faqData from "@/data/faq.json";
import tumData from "@/data/tumtabell.json";
import type { Dimension, Byggord, FaqItem, TumRad } from "./types";

export const dimensioner: Dimension[] = dimensionerData as Dimension[];
export const byggord: Byggord[] = byggordData as Byggord[];
export const faq: FaqItem[] = faqData as FaqItem[];
export const tumtabell: TumRad[] = tumData as TumRad[];

export function dimensionById(id: string): Dimension | undefined {
  return dimensioner.find((d) => d.id === id);
}

export function byggordById(id: string): Byggord | undefined {
  return byggord.find((b) => b.id === id);
}

export const populäraDimensioner: Dimension[] = dimensioner.filter((d) => d.popular);
