import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'amplify-vendor': ['aws-amplify', '@aws-amplify/ui-react'],
          // Feature chunks
          'messaging': [
            './src/components/MessagingInbox.tsx',
            './src/components/MessagingOutbox.tsx',
            './src/components/ComposeMessage.tsx',
            './src/components/ConversationView.tsx',
            './src/MessagingPage.tsx'
          ],
          'profile': [
            './src/MyAccountPage.tsx',
            './src/PublicProfilePage.tsx',
            './src/components/SkillsMultiSelect.tsx'
          ],
          'pages': [
            './src/ExpertsPage.tsx',
            './src/VenturesPage.tsx',
            './src/AboutPage.tsx',
            './src/StartPage.tsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1MB
    sourcemap: false, // Disable sourcemaps for production
    minify: 'esbuild',
    target: 'es2015'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'aws-amplify'],
    exclude: ['@aws-amplify/ui-react'] // Exclude from pre-bundling to reduce initial bundle
  },
  esbuild: {
    drop: ['console', 'debugger'], // Remove console and debugger in production
  }
})
