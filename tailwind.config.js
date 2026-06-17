export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        sentinel: {
          bg: "#020408",
          panel: "#0A0E14",
          border: "#1A1F26",
          cyan: "#00F5FF",
          amber: "#FFB000",
          text: "#E2E8F0",
        },
      },
      boxShadow: {
        cyan: "0 0 32px rgba(0, 245, 255, 0.22)",
        amber: "0 0 28px rgba(255, 176, 0, 0.2)",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 1px)" },
          "40%": { transform: "translate(2px, -1px)" },
          "60%": { transform: "translate(-1px, -1px)" },
          "80%": { transform: "translate(1px, 1px)" },
        },
        blink: {
          "0%, 45%": { opacity: "1" },
          "46%, 100%": { opacity: "0" },
        },
        ring: {
          "0%": { transform: "scale(0.82)", opacity: "0.85" },
          "100%": { transform: "scale(1.36)", opacity: "0" },
        },
      },
      animation: {
        glitch: "glitch 0.7s steps(2, end) infinite",
        blink: "blink 1s steps(1, end) infinite",
        ring: "ring 1.8s ease-out infinite",
      },
    },
  },
  plugins: [],
};
