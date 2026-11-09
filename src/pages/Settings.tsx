import { useState } from 'react'
import { message } from 'antd'
import { useAuth } from '../store/useAuthStore'
import type { User } from '../types/user'
import WorkspaceLayout from '../components/layout/WorkspaceLayout'

const Settings = () => {
  const { user, logout } = useAuth()
  const [saved, setSaved] = useState(false)

  const saveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const firstName = String(formData.get('firstName') || '').trim()
    const lastName = String(formData.get('lastName') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const updatedUser: User = {
      ...user!,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim() || user?.username || '',
      email,
    }
    useAuth.setState({ user: updatedUser })
    localStorage.setItem('user_info', JSON.stringify(updatedUser))
    setSaved(true)
    message.success('Pengaturan profil berhasil disimpan')
  }

  return (
    <WorkspaceLayout>
      <main className="main-content utility-page">
        <header className="utility-page-heading">
          <div><p className="utility-eyebrow">Preferensi akun</p><h1>Pengaturan</h1><p>Perbarui informasi profil dan kelola sesi akun Anda.</p></div>
        </header>
        <section className="settings-card">
          <div className="settings-card-heading">
            <span className="settings-avatar">{(user?.name || user?.username || 'U').slice(0, 1).toUpperCase()}</span>
            <div><h2>Profil Pengguna</h2><p>Informasi ini tersimpan di perangkat Anda.</p></div>
          </div>
          <form className="settings-form" onSubmit={saveProfile} onChange={() => setSaved(false)}>
            <label>Nama depan<input name="firstName" defaultValue={user?.firstName || user?.name?.split(' ')[0] || ''} autoComplete="given-name" /></label>
            <label>Nama belakang<input name="lastName" defaultValue={user?.lastName || user?.name?.split(' ').slice(1).join(' ') || ''} autoComplete="family-name" /></label>
            <label className="settings-field-wide">Email<input type="email" name="email" defaultValue={user?.email || ''} autoComplete="email" /></label>
            <div className="settings-form-actions">
              <button className="btn-add-task" type="submit">{saved ? 'Tersimpan' : 'Simpan pengaturan'}</button>
            </div>
          </form>
        </section>
        <section className="settings-card settings-session-card">
          <div><h2>Sesi akun</h2><p>Keluar dari akun pada perangkat ini.</p></div>
          <button className="settings-logout" type="button" onClick={logout}>Keluar dari akun</button>
        </section>
      </main>
    </WorkspaceLayout>
  )
}

export default Settings
