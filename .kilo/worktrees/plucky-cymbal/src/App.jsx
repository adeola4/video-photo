import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Apply from './pages/Apply'

const App = () => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setReady(true)
    img.onerror = () => setReady(true)
    img.src = '/background.png'
  }, [])

  if (!ready) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-red-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen selection:bg-red-600 selection:text-white overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<Apply />} />
      </Routes>
    </div>
  )
}

export default App
