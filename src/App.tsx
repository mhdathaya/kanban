import { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppRouter } from './routes/routes'
import { useAuth } from './store/useAuthStore'

function App() {
  const { checkAuthOnLoad } = useAuth()

  useEffect(() => {
    checkAuthOnLoad()
  }, [checkAuthOnLoad])

  return (
    <Router>
      <AppRouter />
    </Router>
  )
}

export default App
