import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

const approutes =createBrowserRouter(
  [
    {
      path: '/',
      element: < />,
    },
    {
      path: '/about/contact',
      element: <ContactPage />,
    },
  ]
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
