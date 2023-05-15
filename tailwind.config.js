/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Arial, Helvetica, sans-serif"],
      },
      gridTemplateColumns: {
        "layout-wide":
          "0 [col-1-start] 1fr [col-1-end col-2-start] 1fr [col-2-end] 0",
        "layout-narrow":
          "0 [col-1-start col-2-start] 1fr [col-1-end col-2-end] 0",
      },
    },
  },
  plugins: [],
};
