import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import GameMap from './GameMap.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GameMap />
  </StrictMode>,
)
