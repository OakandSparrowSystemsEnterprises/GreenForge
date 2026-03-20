<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
=======
﻿import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './GreenForge.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
>>>>>>> 6e27fce22fdff12a6eba6f18af99adc0d939c133
)
