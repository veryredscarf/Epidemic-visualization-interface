import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // server 用来做代理，避免出现跨域的问题
  server:{
    host:'0.0.0.0',
    proxy:{
      '/api':{
        target:"https://c.m.163.com",
        changeOrigin:true,
        rewrite:(path) => path.replace(/^\/api/,'')
      }
    }
  }
})
