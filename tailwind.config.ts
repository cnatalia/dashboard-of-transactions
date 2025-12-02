import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        boldBlue: "#121E6C",
        boldRed: "#EE424E",
        boldYellow: "#FFD166",
        boldGrayStrong: "#606060",
        boldGrayLight: "#F3F3F3",
        boldBackground: "#F6F4F9",
        boldBackgroundDark: "#131D6B",
        boldGreenLight: "#89E3B7",
      },
      backgroundImage: {
        'bold-gradient': 'linear-gradient(90deg, rgba(19, 29, 107, 1) 0%, rgba(240, 65, 81, 1) 100%, rgba(54, 35, 103, 1) 61%)',
        'bold-red-gradient': 'linear-gradient(90deg,rgba(86, 61, 83, 1) 0%, rgba(173, 104, 125, 1) 100%)',
    },
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1920px",
      },
    },
  },
  plugins: [],
};

export default config;

