export enum Colors {
  GIALLO_CHIARO= "#FFEBB6",
  GIALLO="#E5F382",
  VERDE="#0A734C",
  BIANCO="#FFFAF1",
  ARANCIONE="#FFFAF1",
}

export const ThemeColors = {
  light: {
    text: "#11181C",
    background: Colors.BIANCO,
    tint: Colors.VERDE,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: Colors.GIALLO,
  },
} as const;