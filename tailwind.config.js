module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx,mdx}',  // 记得包含你的所有目录
      './components/**/*.{js,ts,jsx,tsx}', 
    ],
    theme: {
      extend: {},
    },
    plugins: ['@tailwindcss/typography'],
  }