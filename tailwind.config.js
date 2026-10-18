/** @type {import('tailwindcss').Config} */
// Shared theme for every Tailwind page (was an inline `tailwind.config` per page with the Play CDN).
// Build: `npm run build` → assets/styles.css (also run by .github/workflows/static.yml).
module.exports = {
  // Classes are also built inside JS template strings (inline <script> blocks and assets/*.js),
  // so those files are scanned as raw text too. Keep class names whole: no `'text-' + color`.
  content: ['./*.html', './discord/**/*.html', './assets/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        pt: { red: '#da291c', green: '#046a38' },
      },
    },
  },
}
