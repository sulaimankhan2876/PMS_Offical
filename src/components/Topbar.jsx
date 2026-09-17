import { useState } from 'react'
import { Avatar, Btn } from './ui.jsx'
import { useDb } from '../context/DbContext.jsx'

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  ai: 'AI Assistant',
  students: 'Student Management',
  teachers: 'Teacher Management',
  classes: 'Classes & Sections',
  subjects: 'Subject Management',
  timetable: 'Timetable',
  attendance: 'Attendance',
  exams: 'Exams & Results',
  homework: 'Homework',
  lms: 'Learning Management',
  fees: 'Fee Management',
  expenses: 'Expenses',
  parents: 'Parent Portal',
  announcements: 'Announcements',
  library: 'Library',
  reports: 'Reports',
  settings: 'Settings',
}

const ROLES = [
  'Super Admin',
  'Principal',
  'Teacher',
  'Student',
  'Parent',
  'Accountant',
  'Librarian',
]

export default function Topbar({ page, setPage, onMenuClick }) {
  const { currentRole, currentUser, onlinePayments, feeRecords, logout } =
    useDb()
  const [showNotifications, setShowNotifications] = useState(false)
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-PK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Generate dynamic system alerts
  const pendingFeesCount = feeRecords.filter(
    (f) => f.status === 'Pending'
  ).length
  const pendingVerifyPayments = onlinePayments.filter(
    (p) => p.status === 'Pending'
  ).length
  const systemAlerts = [
    pendingFeesCount > 0 ? `Fee Pending: ${pendingFeesCount} students` : null,
    pendingVerifyPayments > 0
      ? `Verification Alert: ${pendingVerifyPayments} payment pending`
      : null,
    `New Announcement Published: Class 9 & 10 finals schedule`,
  ].filter(Boolean)

  const handleLogout = () => {
    logout()
  }

  return (
    <header
      style={{
        height: 60,
        background: 'rgba(15,31,61,0.3)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        flexShrink: 0,
        position: 'relative',
        zIndex: 999,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          className="hide-on-laptop"
          onClick={onMenuClick}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--gold)',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          ☰
        </button>
        <h1
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--gold)',
            letterSpacing: 0.3,
          }}
          className="hide-on-mobile"
        >
          {PAGE_TITLES[page] || 'Dashboard'}
        </h1>
        <div
          style={{ width: 1, height: 20, background: 'var(--border)' }}
          className="hide-on-mobile"
        />
        <span
          style={{ fontSize: 11, color: 'var(--text-muted)' }}
          className="hide-on-mobile"
        >
          {dateStr}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(74,222,128,0.08)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: 20,
            padding: '4px 12px',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#4ade80',
              display: 'inline-block',
              animation: 'pulse-gold 2s infinite',
            }}
          />
          <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>
            System Online
          </span>
        </div>

        {/* Notification */}
        <div
          style={{ position: 'relative', cursor: 'pointer' }}
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
            }}
          >
            🔔
          </div>
          {systemAlerts.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'var(--gold)',
                color: 'var(--navy)',
                fontSize: 9,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {systemAlerts.length}
            </span>
          )}

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: 44,
                right: 0,
                width: 280,
                background: 'var(--navy-2)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: 12,
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                cursor: 'default',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--gold)',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: 6,
                }}
              >
                SYSTEM ALERTS
              </div>
              {systemAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: 11,
                    color: 'var(--text-primary)',
                    padding: '4px 0',
                    borderBottom:
                      idx < systemAlerts.length - 1
                        ? '1px solid rgba(255,255,255,0.03)'
                        : 'none',
                  }}
                >
                  ⚠️ {alert}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            background: 'rgba(234,179,8,0.04)',
          }}
        >
          <Avatar
            name={currentUser?.name || currentRole}
            size={28}
            fontSize={10}
          />
          <div className="hide-on-mobile">
            <div
              style={{ fontSize: 12, fontWeight: 600, color: 'var(--gold)' }}
            >
              {currentUser?.name
                ? currentUser.name.length > 15
                  ? currentUser.name.slice(0, 12) + '...'
                  : currentUser.name
                : currentRole}
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>
              {currentRole}
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              marginLeft: '8px',
              padding: '4px 8px',
              background: 'var(--navy-3)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '10px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
