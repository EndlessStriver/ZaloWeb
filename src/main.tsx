import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { NotifyProvider } from './context/NotifyContext.tsx'
import Notify from './component/Notify.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotifyProvider>
      <App />
      <Notify />
    </NotifyProvider>
  </StrictMode>,
)
