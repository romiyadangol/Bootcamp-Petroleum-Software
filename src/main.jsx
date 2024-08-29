import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './redux/store.js'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'

const store = configureStore({reducer: rootReducer});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>
      <App />
    </Provider>
  </StrictMode>,
)
