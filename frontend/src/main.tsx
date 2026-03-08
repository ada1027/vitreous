import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ScanProvider } from './context/ScanContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScanProvider>
      <App />
    </ScanProvider>
  </StrictMode>,
)
