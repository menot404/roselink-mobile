/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FFF1F6", 100: "#FDE2EC", 200: "#FBC4D8", 300: "#F79AB9", 400: "#F06A98",
          500: "#E8467C", 600: "#D6336C", 700: "#B02558", 800: "#8A1E46", 900: "#5E1530",
        },
        canvas: { DEFAULT: "#FFF7FA", dark: "#1A0F15" },
        surface: { DEFAULT: "#FFFFFF", dark: "#271821" },
        ink: { DEFAULT: "#2A1520", dark: "#FBEAF1", soft: "#6B4A5A", "soft-dark": "#CFA9BA" },
        primary: {
          DEFAULT: "#D6336C", dark: "#FF7AA8",
          soft: "#FDE2EC", "soft-dark": "#3A2230",
        },
        "on-primary": { DEFAULT: "#FFFFFF", dark: "#2A0A17" },
        line: { DEFAULT: "#F3D3E0", dark: "#3A2230" },
        success: { DEFAULT: "#2E8B57", dark: "#5FCB8C" },
        alert: { DEFAULT: "#C2410C", dark: "#FB923C" },
      },
      fontFamily: {
        jakarta: ["PlusJakartaSans_400Regular"],
        "jakarta-medium": ["PlusJakartaSans_500Medium"],
        "jakarta-semibold": ["PlusJakartaSans_600SemiBold"],
        "jakarta-bold": ["PlusJakartaSans_700Bold"],
      },
    },
  },
  plugins: [],
};