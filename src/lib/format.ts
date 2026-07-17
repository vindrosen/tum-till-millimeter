/** Svensk formatering av mått. */

const TUM_I_MM = 25.4;

/** Formaterar ett millimetervärde med svensk decimalkomma, t.ex. 50,8. */
export function mmValue(mm: number, decimals = 1): string {
  const factor = 10 ** decimals;
  const rounded = Math.round(mm * factor) / factor;
  return rounded.toLocaleString("sv-SE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/** Millimeter med enhet, t.ex. "50,8 mm". */
export function mm(value: number, decimals = 1): string {
  return `${mmValue(value, decimals)} mm`;
}

/** Formaterar ett tumvärde, t.ex. 1,5 → "1,5". */
export function tumValue(tum: number, decimals = 3): string {
  const factor = 10 ** decimals;
  const rounded = Math.round(tum * factor) / factor;
  return rounded.toLocaleString("sv-SE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function tumTillMm(tum: number): number {
  return tum * TUM_I_MM;
}

export function mmTillTum(millimeter: number): number {
  return millimeter / TUM_I_MM;
}

export { TUM_I_MM };
