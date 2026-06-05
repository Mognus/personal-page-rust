// Project-local Prettier config. Prettier uses the *nearest* config and does
// not merge with the global ~/.prettierrc.json, so the base style is repeated
// here. Kept local so other projects don't need the Tailwind plugin installed.

/** @type {import("prettier").Config} */
export default {
    tabWidth: 4, // match global style
    singleQuote: false, // match global style
    semi: true, // match global style

    // Auto-sorts Tailwind classes into the recommended order on format.
    plugins: ["prettier-plugin-tailwindcss"],

    // Tailwind v4 has no JS config — point the plugin at the CSS entry so it
    // reads the theme (custom fonts, colors) for correct ordering.
    tailwindStylesheet: "./app/globals.css",

    // Also sort classes inside cn(...) / cva(...), not just className="...".
    tailwindFunctions: ["cn", "cva"],
};
