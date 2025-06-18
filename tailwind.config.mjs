import defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

const config = {
  content: [
      './index.html',
      './app/**/*.{js,ts,jsx,tsx,mdx}',  // 记得包含你的所有目录
      './components/**/*.{js,ts,jsx,tsx}', 
      './src/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      colors: {
        ...colors
      },
      extend: {
        
        animation: {
          'gradient-flow': 'gradient-flow 15s ease infinite',
        },
        keyframes: {
        'gradient-flow': {
            '0%, 100%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
          }
        },
        spacing: {
          ...defaultTheme.spacing,
          '2a': '20rem'
        },
        backgroundImage: {
        'aaa': 'linear-gradient(to right top, #2E3192, #662D8C, #ED1E79, #FBB03B)',
        'macos-sonoma-gradient': 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
        'mac-pro-wallpaper': 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        'ios-gradient': 'linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)',
        },
      },
    },
    plugins: ['@tailwindcss/typography'],
};

export default config;