import { NavLink } from 'react-router-dom'
import style from './layout.module.css'

export interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  isOpen?: boolean
  onNavigate?: () => void
}

export const Sidebar = ({ isCollapsed, onToggle, isOpen, onNavigate }: SidebarProps) => {
  const sidebarClasses = [
    style.sidebar,
    isCollapsed ? style.sidebarCollapsed : '',
    isOpen ? style.sidebarOpen : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={sidebarClasses}>
      <div className={style.sidebarBrand}>
        <div className={style.brandIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
        </div>
        <span className={style.brandText}>TaskBoard</span>
      </div>

      <nav className={style.sidebarMenu}>
        <span className={style.menuLabel}>Menu</span>

        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) => `${style.sidebarMenuItem} ${isActive ? style.sidebarMenuItemActive : ''}`}
          onClick={onNavigate}
        >
          <svg className={style.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span className={style.text}>Dashboard</span>
        </NavLink>

        <NavLink to="/tasks" className={({ isActive }) => `${style.sidebarMenuItem} ${isActive ? style.sidebarMenuItemActive : ''}`} onClick={onNavigate}>
          <svg className={style.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <span className={style.text}>My Tasks</span>
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => `${style.sidebarMenuItem} ${isActive ? style.sidebarMenuItemActive : ''}`} onClick={onNavigate}>
          <svg className={style.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span className={style.text}>Settings</span>
        </NavLink>
      </nav>

      <div className={style.sidebarFooter}>
        <button
          type="button"
          onClick={onToggle}
          className={style.collapseBtn}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={`${style.collapseIcon} ${isCollapsed ? style.collapseIconRotated : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className={style.collapseBtnText}>
            {isCollapsed ? 'Expand' : 'Collapse'}
          </span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
