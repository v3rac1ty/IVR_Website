import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted, latin-only font subsets (no render-blocking Google Fonts request)
import '@fontsource/russo-one/latin-400.css'
import '@fontsource-variable/manrope/wght.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
