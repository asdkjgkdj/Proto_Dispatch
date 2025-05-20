
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
const container = document.getElementById('root')   // ← 여기만 바라봅니다
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)