export type Scheme = "light" | "dark";

export const palette = {
  light: {
    canvas: "#FFF7FA", surface: "#FFFFFF", ink: "#2A1520", inkSoft: "#6B4A5A",
    primary: "#D6336C", primarySoft: "#FDE2EC", onPrimary: "#FFFFFF",
    border: "#F3D3E0", success: "#2E8B57", alert: "#C2410C",
  },
  dark: {
    canvas: "#1A0F15", surface: "#271821", ink: "#FBEAF1", inkSoft: "#CFA9BA",
    primary: "#FF7AA8", primarySoft: "#3A2230", onPrimary: "#2A0A17",
    border: "#3A2230", success: "#5FCB8C", alert: "#FB923C",
  },
} as const;