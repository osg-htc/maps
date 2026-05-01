import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import reactCompiler from "eslint-plugin-react-compiler"; // 1. IMPORT PLUGIN

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig =[
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "react-compiler": reactCompiler, // 2. REGISTER PLUGIN
    },
    rules: {
      "react-compiler/react-compiler": "error", // 3. TURN ON ERRORS
    },
  },
  {
    ignores:[".next/**", "out/**", "node_modules/**", "public/**"],
  },
];

export default eslintConfig;