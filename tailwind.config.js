/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        black: 'rgb(var(--color-black) / <alpha-value>)'
      },
      fontFamily: {
        'sans': [
          'Noto Sans',
          'Noto Sans KR', 
          'Noto Sans JP', 
          'Noto Sans SC',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        'ko': ['Noto Sans KR', 'Noto Sans', 'system-ui', 'sans-serif'],
        'ja': ['Noto Sans JP', 'Noto Sans', 'system-ui', 'sans-serif'],
        'zh': ['Noto Sans SC', 'Noto Sans', 'system-ui', 'sans-serif'],
        'en': ['Noto Sans', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.6' }],
        '2xl': ['1.5rem', { lineHeight: '1.5' }],
        '3xl': ['1.875rem', { lineHeight: '1.4' }],
        '4xl': ['2.25rem', { lineHeight: '1.3' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }]
      }
    }
  },
  plugins: []
}
