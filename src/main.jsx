import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthContextProvider } from './context/Authcontext'
import { ModalContextProvider } from './context/Modalcontext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ModalContextProvider>
        <App />
      </ModalContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
