import style from './layout.module.css'
import type { User } from '../../types/user'

export interface HeaderProps {
  user: User | null | any
  onLogout?: () => void
  onMenuToggle?: () => void
}

export const Header = ({ user, onLogout, onMenuToggle }: HeaderProps) => {
  return (
    <header className={style.header}>
      <div className={style.headerLeft}>
        <button
          type="button"
          className={`${style.mobileMenuToggle} mobile-menu-toggle`}
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <h2 className={style.headerTitle}>Kanban Dashboard</h2>
      </div>

      <div className={style.headerRight}>
        <button type="button" className={style.notificationBtn} aria-label="Notifications" title="Notifikasi">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className={style.notificationBadge} />
        </button>

        <div className={style.headerDivider} />

        <div className={style.profileInfo}>
          <img
            className={style.profileAvatar}
            src={user?.avatar || user?.image || 'https://dummyjson.com/icon/emilys/128'}
            alt={user?.name || user?.username || 'User'}
          />
          <div className={style.profileDetails}>
            <span className={style.profileName}>
              {user?.name || user?.username || 'Pengguna'}
            </span>
            {user?.email && (
              <span className={style.profileEmail}>{user.email}</span>
            )}
          </div>
          {onLogout && (
            <button type="button" onClick={onLogout} className={style.logoutBtn} title="Keluar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
