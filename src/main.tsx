import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AgentOrchestra from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AgentOrchestra />
  </StrictMode>,
)
