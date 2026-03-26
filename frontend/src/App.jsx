import { useState } from 'react'
import './index.css'
import LandingPage from './LandingPage'
import AppView from './AppView'

export default function App() {
  const [view, setView] = useState('landing') // 'landing' | 'app'

  if (view === 'app') {
    return <AppView onBack={() => setView('landing')} />
  }

  return <LandingPage onStart={() => setView('app')} />
}
