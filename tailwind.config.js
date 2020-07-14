/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
module.exports = {
  screens: {
    dark: { raw: '(prefers-color-scheme: dark)' }
  },
  theme: {
    darkSelector: '.dark-mode',
    colors: {
      blue: '#4A90E2',
      red: '#E74C3C',
      yellow: '#F1C40F',
      teal: '#50E3C2',
      gray: '#ECEFF4',
      white: '#ffffff',
      black: '#000000',
      'black-dark': '#2E3440',
      'gray-dark': '#3B4252',
      'yellow-dark': '#BF616A',
      'blue-dark': '#5E81AC'
    }
  },
  variants: {
    backgroundColor: ['dark', 'dark-hover', 'dark-group-hover', 'dark-even', 'dark-odd', 'hover', 'responsive'],
    borderColor: ['dark', 'dark-focus', 'dark-focus-within', 'hover', 'responsive'],
    textColor: ['dark', 'dark-hover', 'dark-active', 'hover', 'responsive']
  },
  plugins: [
    require('tailwindcss-dark-mode')()
  ]
}
