import { useState, type ReactNode } from 'react'
import { useAuth } from '../../store/useAuthStore'
import Header from './Header'
import Sidebar from './Sidebar'

interface WorkspaceLayoutProps {
  children: ReactNode
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const closeMobileSidebar = () => setIsSidebarOpen(false)

  return (
    <div className="app-container">
        <Sidebar
          isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((collapsed) => !collapsed)}
        isOpen={isSidebarOpen}
        onNavigate={closeMobileSidebar}
        />
        <div className="content-wrapper">
          <Header user={user} onLogout={logout} onMenuToggle={() => setIsSidebarOpen((open) => !open)} />
          {children}
        </div>
    </div>
  )
}

export default WorkspaceLayout
