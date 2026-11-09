import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/useAuthStore'
import style from '../styles/login.module.css'

interface LoginForm {
  username: string
  password: string
}

interface FormErrors {
  username?: string
  password?: string
}

export const Login = () => {
  const { login, isAuthenticated, isLoading, error: authError, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState<LoginForm>({ username: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

                                      
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!form.username.trim()) {
      newErrors.username = 'Username wajib diisi'
    }

    if (!form.password) {
      newErrors.password = 'Password wajib diisi'
    } else if (form.password.length < 4) {
      newErrors.password = 'Password minimal 4 karakter'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
                                             
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    if (submitError || authError) {
      setSubmitError(null)
      clearError()
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    clearError()

    if (!validateForm()) {
      return
    }

    try {
      await login(form.username.trim(), form.password, 30)
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Autentikasi gagal. Silakan periksa kembali username dan password Anda.'
      setSubmitError(message)
    }
  }

  const displayedError = submitError || authError

  return (
    <div className={style.loginContainer}>
      <div className={style.loginBox}>
        <div className={style.loginHeader}>
          <div className={style.logoIcon}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="8" y1="3" x2="8" y2="21" />
              <line x1="16" y1="3" x2="16" y2="21" />
              <line x1="3" y1="8" x2="8" y2="8" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="16" y1="8" x2="21" y2="8" />
            </svg>
          </div>
          <h2>Masuk Akun</h2>
          <p className={style.loginSubtitle}>
            Silakan masuk untuk mengakses Kanban Dashboard
          </p>
        </div>

        {displayedError && (
          <div className={style.errorAlert} role="alert">
            <svg
              className={style.errorIcon}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            <div>{displayedError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={style.loginForm} noValidate>
          <div className={style.formGroup}>
            <label htmlFor="username">
              Username <span className={style.required}>*</span>
            </label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              disabled={isLoading}
              className={`${style.input} ${errors.username ? style.inputError : ''}`}
              placeholder="Masukkan username"
              autoComplete="username"
            />
            {errors.username && (
              <p className={style.fieldError}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </p>
            )}
          </div>

          <div className={style.formGroup}>
            <label htmlFor="password">
              Password <span className={style.required}>*</span>
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              disabled={isLoading}
              className={`${style.input} ${errors.password ? style.inputError : ''}`}
              placeholder="Masukkan password"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className={style.fieldError}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </p>
            )}
          </div>

          <button
            type="submit"
            className={style.btn}
            disabled={isLoading}
          >
            <span>{isLoading ? 'Sedang masuk...' : 'Masuk'}</span>
          </button>
        </form>

        <div className={style.divider}>
          <span>Info</span>
        </div>

        <p className={style.registerLink}>
          Belum punya akun?{' '}
          <a href="https://dummyjson.com/docs/auth" target="_blank" rel="noreferrer">
            Dokumentasi DummyJSON
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
