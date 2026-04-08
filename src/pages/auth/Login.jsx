import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser, clearError } from '../../store/slices/authSlice'

export default function Login() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { loading, error, role } = useSelector((s) => s.auth)

  const [form, setForm] = useState({ email: '', password: '' })

  // إلا راه logged in — redirect مباشرة
  useEffect(() => {
    if (role) redirectByRole(role)
  }, [role])

  const redirectByRole = (r) => {
    if (r == '1') navigate('/client/dashboard')
    else if (r == '2') navigate('/freelancer/browse-projects')
    else if (r == '3') navigate('/admin/dashboard')
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) {
      redirectByRole(result.payload.user.role_id)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(24,95,165,0.08)' }}>
        
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src="/img/logon.png" alt="Jobsy" style={{ height: '50px' }} />
          <p style={{ color: '#888780', fontSize: '14px', marginTop: '8px' }}>
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ backgroundColor: '#FCEBEB', color: '#A32D2D', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {error.message || 'Email ou mot de passe incorrect'}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#172A39', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="exemple@email.com"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #B5D4F4', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#172A39', marginBottom: '6px' }}>
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #B5D4F4', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#85B7EB' : '#185FA5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#888780' }}>
          Pas encore de compte ?{' '}
          <Link to="/auth/register" style={{ color: '#185FA5', fontWeight: '600', textDecoration: 'none' }}>
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}
