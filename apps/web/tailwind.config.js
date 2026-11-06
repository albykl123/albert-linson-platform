/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Theme 1: Swiss Editorial (Main Identity & Hero)
        swiss: {
          white: "#FFFFFF",
          light: "#F4F6F8",
          navy: "#14243A",
          blue: "#4776A8",
          divider: "#DCE4ED",
        },
        // Theme 2: Warm Ivory (Personal Storytelling, About & Journey)
        ivory: {
          base: "#FAF8F2",
          cream: "#EEEAE0",
          charcoal: "#26352E",
          sage: "#879C85",
          beige: "#D7C9B5",
        },
        // Theme 3: Modern Corporate (Technology, Skills & Projects)
        corporate: {
          white: "#FFFFFF",
          pale: "#EDF3FA",
          slate: "#26364B",
          cobalt: "#3979CB",
          border: "#D5E3F4",
        },
        // Theme 4: Paper & Typography (Resume & Academic Publications)
        paper: {
          offwhite: "#F7F5EF",
          surface: "#EAE6DA",
          graphite: "#252525",
          beige: "#A79D8B",
          border: "#D5CFC2",
        },
        // Legacy palette compatibility
        midnight: {
          950: "#07090e",
          900: "#0b0f19",
          850: "#101626",
          800: "#151d33",
          700: "#1e294b",
          600: "#2d3b66",
        },
        electric: {
          500: "#3b82f6",
          400: "#60a5fa",
          300: "#93c5fd",
        },
        violet: {
          500: "#8b5cf6",
          400: "#a78bfa",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cal)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
