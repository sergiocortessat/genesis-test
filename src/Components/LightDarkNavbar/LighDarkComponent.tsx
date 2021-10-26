import { useEffect, useState } from 'react'

export default function LightDarkToggle () {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark')
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('theme', 'light')
    }
  }
  , [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return [darkMode, toggleDarkMode]
}
