export const fragmaTokens = {
  colors: {
    warmIvory: "#FAF7F2",
    neutralSand: "#EEE9E1",
    limestone: "#D9D1C6",
    taupe: "#C8B6A7",
    lightWood: "#B69A80",
    earth: "#8E7867",
    ink: "#1F1F1F",
    horizonLight: "linear-gradient(115deg, #DCE4E5 0%, #EEE9E1 42%, #F2D8C3 72%, #DCA58B 100%)",
  },
  typography: { display: "var(--fragma-font-display)", body: "var(--fragma-font-body)" },
  spacing: { pageMobile: "1.5rem", pageDesktop: "2.5rem", sectionMobile: "5.5rem", sectionDesktop: "10rem", contentMax: "1360px" },
  borders: { hairline: "1px solid color-mix(in srgb, var(--fragma-ink) 14%, transparent)", radiusXs: "2px", radiusSm: "4px", radiusMd: "8px" },
  motion: { reveal: "700ms cubic-bezier(0.22, 1, 0.36, 1)", editorial: "1200ms cubic-bezier(0.22, 1, 0.36, 1)" },
} as const;
