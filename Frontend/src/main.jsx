import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './styles/variables.css'
import App from './App.jsx'
import "./styles/login.css";
import "./styles/dashboard.css";
import "react-day-picker/dist/style.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
