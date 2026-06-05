/**
 * Generates high-contrast, visually distinct colors for map pins.
 *
 * Strategy: work in HSL space with fixed saturation + lightness so every
 * color is vivid and readable on a light map background. Hues are spread
 * using the golden angle (137.508 deg) so sequential pins are always as
 * far apart as possible on the color wheel.
 */

const GOLDEN_ANGLE = 137.508;

// Saturation: 65-75% -- vibrant but not neon
// Lightness:  38-45% -- dark enough to read on white/grey map tiles
const SATURATION = 70;
const LIGHTNESS = 42;

/**
 * Returns a deterministic hex color for a given index.
 * Index 0, 1, 2 ... will each produce a maximally distinct hue.
 *
 * @example
 * pins.map((pin, i) => ({ ...pin, color: getPinColor(i) }))
 */
export function getPinColor(index: number): string {
  const hue = (index * GOLDEN_ANGLE) % 360;
  return hslToHex(hue, SATURATION, LIGHTNESS);
}

/**
 * Generates an array of `count` distinct hex colors in one call.
 *
 * @example
 * const colors = generatePinColors(pins.length);
 */
export function generatePinColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => getPinColor(i));
}

/**
 * Returns a single random high-contrast hex color.
 * Useful when you don't have an index and just need one good color.
 */
export function getRandomPinColor(): string {
  const hue = Math.random() * 360;
  return hslToHex(hue, SATURATION, LIGHTNESS);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s / 100, l / 100);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255),
  ];
}

function toHex(value: number): string {
  return value.toString(16).padStart(2, "0");
}