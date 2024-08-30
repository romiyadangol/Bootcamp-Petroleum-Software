import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './redux/store.js'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { ChakraProvider } from '@chakra-ui/react'

const store = configureStore({reducer: rootReducer});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider>
    <Provider store = {store}>
      <App />
    </Provider>
    </ChakraProvider>   
  </StrictMode>,
)
