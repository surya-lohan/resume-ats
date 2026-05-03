import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { FileUploader } from './components/FileUploader'
import { Sidebar } from './components/Sidebar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FileUploader />
    </>
  )
}

export default App
