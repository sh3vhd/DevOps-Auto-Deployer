/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0f1115',
        neon: '#00ffff',
        accent: '#11ff99',
        text: '#ffffff'
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        neon: '0 0 20px rgba(0, 255, 255, 0.35)',
        accent: '0 0 20px rgba(17, 255, 153, 0.35)'
      },
      backgroundImage: {
        'grid-glow':
          'radial-gradient(circle at 20% 20%, rgba(0,255,255,0.12), transparent 40%), radial-gradient(circle at 80% 0%, rgba(17,255,153,0.2), transparent 45%)'
      }
    }
  },
  plugins: []
};
