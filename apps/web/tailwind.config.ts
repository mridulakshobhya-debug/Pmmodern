import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        emeraldGlow: {
          50: "#ecfdf5",
          100: "#d1fae5",
          300: "#6ee7b7",
          500: "#10b981",
          700: "#047857"
        },
        softGold: {
          200: "#f8e7b0",
          400: "#e3c87f",
          500: "#d6b164"
        },
        ink: {
          900: "#06130f",
          800: "#0d1e18",
          700: "#1a2e27"
        }
      },
      boxShadow: {
        glass: "0 20px 50px -12px rgba(2, 16, 11, 0.32)",
        card: "0 14px 26px -10px rgba(11, 41, 28, 0.28)"
      },
      backgroundImage: {
        aurora:
          "radial-gradient(circle at 15% 20%, rgba(16,185,129,0.18), transparent 45%), radial-gradient(circle at 85% 0%, rgba(214,177,100,0.16), transparent 35%), linear-gradient(135deg, #071f18 0%, #0b2d23 45%, #122f27 100%)"
      },
      animation: {
        "pulse-soft": "pulseSoft 4s ease-in-out infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite"
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" }
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
