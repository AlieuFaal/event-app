/** @type {import('tailwindcss').Config} */
export const content = ["app/index.tsx", "./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"];
export const presets = [require("nativewind/preset")];
export const theme = {
  extend: {},
};
export const plugins = [];