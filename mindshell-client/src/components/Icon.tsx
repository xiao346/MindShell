import type { CSSProperties } from 'react'

const paths = {
  terminal: 'm5 6 6 6-6 6M13 18h6',
  server: 'M4 3h16v7H4zM4 14h16v7H4zM7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6',
  folder: 'M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z',
  transfer: 'M4 7h15m-4-4 4 4-4 4M20 17H5m4-4-4 4 4 4',
  plus: 'M12 5v14M5 12h14',
  search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  settings: 'M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1 1-3Zm6 9a3 3 0 1 0-6 0 3 3 0 0 0 6 0',
  chat: 'M4 4h16v13H8l-4 4V4Z',
  panel: 'M3 4h18v16H3zM9 4v16',
  close: 'm6 6 12 12M6 18 18 6',
  refresh: 'M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 13 2M18 18a8 8 0 0 1-13-2',
  edit: 'm15 4 5 5M4 20l5-1L21 7l-4-4L5 15l-1 5Z',
  trash: 'M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7',
  power: 'M12 2v10M6 5a9 9 0 1 0 12 0',
  chevron: 'm9 5 7 7-7 7',
  sparkle: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
  send: 'm21 3-7 18-3-8-8-3 18-7ZM11 13 21 3',
  copy: 'M9 8h12v13H9zM15 8V3H3v13h6',
} as const

export function Icon({ name, size = 18, style }: { name: keyof typeof paths; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, ...style }}><path d={paths[name]} /></svg>
}
