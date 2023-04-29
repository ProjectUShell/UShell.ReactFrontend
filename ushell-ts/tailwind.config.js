/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        supercool: { 50: "#d2bab0" },
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        backgroundone: "rgb(var(--color-background-one) / <alpha-value>)",
        backgroundtwo: "rgb(var(--color-background-two) / <alpha-value>)",
        backgroundthree: "rgb(var(--color-background-three) / <alpha-value>)",
        backgroundfour: "rgb(var(--color-background-four) / <alpha-value>)",
        texttest: "#d2bab0",
        textone: "rgb(var(--color-text-one) / <alpha-value>)",
        texttwo: "rgb(var(--color-text-two) / <alpha-value>)",
        backgroundonedark:
          "rgb(var(--color-background-one-dark) / <alpha-value>)",
        backgroundtwodark:
          "rgb(var(--color-background-two-dark) / <alpha-value>)",
        backgroundthreedark:
          "rgb(var(--color-background-three-dark) / <alpha-value>)",
        backgroundfourdark:
          "rgb(var(--color-background-four-dark) / <alpha-value>)",
        textonedark: "rgb(var(--color-text-one-dark) / <alpha-value>)",
        texttwodark: "rgb(var(--color-text-two-dark) / <alpha-value>)",
      },
    },
    fontFamily: {
      'custom': ["rubik"]
    },
  },
  plugins: [],
};
