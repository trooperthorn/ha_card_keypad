/**
 * Inline emblems. Drawn with currentColor so the theme sets the colour; no
 * network fetch, no icon font.
 */

import { svg } from "lit";

/** A shield with a padlock on its face and a chain wrapped around it. */
export const SHIELD_LOCK = svg`<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="locked shield">
  <g fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <path d="M60 8 L104 24 V66 C104 96 84 118 60 132 C36 118 16 96 16 66 V24 Z"/>
    <path d="M60 22 L92 34 V66 C92 88 78 106 60 118 C42 106 28 88 28 66 V34 Z" stroke-width="2" opacity="0.6"/>
    <rect x="44" y="64" width="32" height="26" rx="4" fill="currentColor" fill-opacity="0.18"/>
    <path d="M50 64 V56 A10 10 0 0 1 70 56 V64"/>
    <circle cx="60" cy="76" r="3" fill="currentColor"/>
    <path d="M60 79 V85"/>
  </g>
  <g fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round">
    <path d="M4 52 C24 40 44 40 60 48 C76 56 96 56 116 44" stroke-dasharray="7 5"/>
    <path d="M4 96 C24 84 44 84 60 92 C76 100 96 100 116 88" stroke-dasharray="7 5"/>
    <ellipse cx="4" cy="52" rx="4" ry="6"/><ellipse cx="116" cy="44" rx="4" ry="6"/>
    <ellipse cx="4" cy="96" rx="4" ry="6"/><ellipse cx="116" cy="88" rx="4" ry="6"/>
  </g>
</svg>`;
