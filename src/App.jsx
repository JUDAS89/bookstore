//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LibroProvider } from './contexts/LibroContext';
import AppRouter from './AppRouter';


function App() {
//  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <LibroProvider>
        <AppRouter />
      </LibroProvider>
    </AuthProvider>
  )
}

export default App
