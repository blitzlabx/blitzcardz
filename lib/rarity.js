export const RARITIES = {
  "1": { label: "Common", color: "#94a3b8" },
  "2": { label: "Uncommon", color: "#34d399" },
  "3": { label: "Rare", color: "#38bdf8" },
  "4": { label: "Epic", color: "#a78bfa" },
  "5": { label: "Legendary", color: "#fbbf24" },
  "6": { label: "Mythic", color: "#fb7185" },
  S: { label: "Special", color: "#f0abfc" }
};

export const TIER_ORDER = ["1", "2", "3", "4", "5", "6", "S"];

export function rarityOf(tier) {
  return RARITIES[String(tier)] || { label: "Unknown", color: "#64748b" };
}
