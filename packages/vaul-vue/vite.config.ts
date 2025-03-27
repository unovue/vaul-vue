import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin({ useStrictCSP: true }),
    dts({
      tsconfigPath: 'tsconfig.build.json',
      cleanVueFileName: true,
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      name: 'vaul-vue',
      fileName: 'index',
      entry: resolve(__dirname, 'src/index.ts'),
    },
    outDir: 'dist',
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library (Vue)
      external: ['vue', 'reka-ui'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'style.css')
            return 'index.css'
          return chunkInfo.name as string
        },
      },
    },
  },
})
