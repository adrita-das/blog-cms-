import { build, defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'


export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
   server: {
    port: 5173,
    open: true
  },
   
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        auth: resolve(__dirname, 'auth.html'),
        post: resolve(__dirname, 'post.html'),
        profile: resolve(__dirname, 'profile.html'),
        read: resolve(__dirname, 'read.html'),
        stories: resolve(__dirname, 'stories.html'),
      }
    }
  }
  })

