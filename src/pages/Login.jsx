import { useState } from 'react'
import { useDb } from '../context/DbContext.jsx'
import { Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { login } = useDb()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    const success = login(username, password)
    if (!success) {
      setError('Invalid username or password')
    }
  }

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(ellipse at center, var(--navy-3) 0%, var(--navy) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 3D Animated Orbs */}
      <div
        className="glow-orb"
        style={{
          top: '10%',
          left: '20%',
          width: 300,
          height: 300,
          background: 'rgba(234,179,8,0.15)',
          animationDuration: '8s',
        }}
      />
      <div
        className="glow-orb"
        style={{
          bottom: '15%',
          right: '15%',
          width: 400,
          height: 400,
          background: 'rgba(96,165,250,0.1)',
          animationDuration: '12s',
          animationDirection: 'reverse',
        }}
      />
      <div
        className="glow-orb"
        style={{
          top: '40%',
          right: '40%',
          width: 200,
          height: 200,
          background: 'rgba(74,222,128,0.08)',
          animationDuration: '10s',
        }}
      />

      <div
        className="card-3d"
        style={{
          width: '100%',
          maxWidth: 420,
          padding: '40px 30px',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
          animation: 'fadeInUp 0.6s ease out',
        }}
      >
        <img
          src="/assets/logo.png"
          alt="PMS Logo"
          style={{
            width: '80px',
            height: 'auto',
            marginBottom: '16px',
            filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))',
          }}
        />

        <h2
          style={{
            color: 'var(--gold)',
            fontFamily: 'Cinzel, serif',
            fontSize: '24px',
            fontWeight: 700,
            margin: '0 0 4px 0',
            letterSpacing: '1px',
          }}
        >
          PMS DARGAI
        </h2>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
            margin: '0 0 24px 0',
            fontWeight: 500,
          }}
        >
          Enter your credentials to access the portal
        </p>

        <form
          onSubmit={handleLogin}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              placeholder="e.g. admin, pms_1998"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '14px',
                background: 'rgba(15,31,61,0.6)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'var(--transition)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = 'var(--gold)')
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = 'var(--border-strong)')
              }
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 16px',
                  fontSize: '14px',
                  background: 'rgba(15,31,61,0.6)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'var(--transition)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = 'var(--gold)')
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = 'var(--border-strong)')
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(248,113,113,0.1)',
                border: '1px solid rgba(248,113,113,0.3)',
                color: '#f87171',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                animation: 'fadeInUp 0.2s ease forwards',
              }}
            >
              <span>⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="premium-btn"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '14px',
              borderRadius: 'var(--radius-md)',
              marginTop: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            Access Portal
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          <p>
            Super Admin: <b>admin</b> / <b>admin</b>
          </p>
          <p>
            Student: <b>pms_1998</b> / <b>pass</b>
          </p>
          <p style={{ marginTop: 8 }}>
            &copy; {new Date().getFullYear()} PMS Dargai
          </p>
        </div>
      </div>
    </div>
  )
}
