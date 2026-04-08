import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser, clearError } from '../../store/slices/authSlice'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.auth)

  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '', role_id: '1',
  })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    const result = await dispatch(registerUser(form))
    if (registerUser.fulfilled.match(result)) {
      const role = result.payload.user.role_id
      if (role == 1) navigate('/client/dashboard')
      else if (role == 2) navigate('/freelancer/browse-projects')
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '440px', boxShadow: '0 4px 24px rgba(24,95,165,0.08)' }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src="/img/logon.png" alt="Jobsy" style={{ height: '50px' }} />
          <p style={{ color: '#888780', fontSize: '14px', marginTop: '8px' }}>
            Créez votre compte gratuitement
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FCEBEB', color: '#A32D2D', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {error.message || 'Une erreur est survenue'}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#172A39', marginBottom: '6px' }}>Nom complet</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Votre nom"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #B5D4F4', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#172A39', marginBottom: '6px' }}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="exemple@email.com"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #B5D4F4', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#172A39', marginBottom: '6px' }}>Mot de passe</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="••••••••"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #B5D4F4', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#172A39', marginBottom: '6px' }}>Confirmer le mot de passe</label>
            <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} required placeholder="••••••••"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #B5D4F4', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          {/* Role */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#172A39', marginBottom: '8px' }}>Je suis...</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[{ value: '1', label: '🏢 Client', desc: 'Je poste des projets' },
                { value: '2', label: '💼 Freelancer', desc: 'Je cherche du travail' }].map((opt) => (
                <label key={opt.value} style={{
                  flex: 1, padding: '12px', border: `2px solid ${form.role_id === opt.value ? '#185FA5' : '#B5D4F4'}`,
                  borderRadius: '8px', cursor: 'pointer', textAlign: 'center',
                  backgroundColor: form.role_id === opt.value ? '#E6F1FB' : '#fff', transition: 'all 0.2s'
                }}>
                  <input type="radio" name="role_id" value={opt.value} checked={form.role_id === opt.value}
                    onChange={handleChange} style={{ display: 'none' }} />
                  <div style={{ fontWeight: '600', color: '#172A39', fontSize: '14px' }}>{opt.label}</div>
                  <div style={{ color: '#888780', fontSize: '12px', marginTop: '2px' }}>{opt.desc}</div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#85B7EB' : '#185FA5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#888780' }}>
          Déjà un compte ?{' '}
          <Link to="/auth/login" style={{ color: '#185FA5', fontWeight: '600', textDecoration: 'none' }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}