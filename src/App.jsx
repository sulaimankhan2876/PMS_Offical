import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Students from './pages/Students.jsx'
import { Teachers, Classes, Subjects, Timetable } from './pages/Academic.jsx'
import { Attendance, Exams, Homework, LMS } from './pages/Exams.jsx'
import {
  Fees,
  Expenses,
  Parents,
  Announcements,
  Library,
  Reports,
  Settings,
} from './pages/Admin.jsx'
import AIAssistant from './pages/AIAssistant.jsx'
import Login from './pages/Login.jsx'
import { DbProvider, useDb } from './context/DbContext.jsx'

const PAGES = {
  dashboard: Dashboard,
  students: Students,
  teachers: Teachers,
  classes: Classes,
  subjects: Subjects,
  timetable: Timetable,
  attendance: Attendance,
  exams: Exams,
  homework: Homework,
  lms: LMS,
  fees: Fees,
  expenses: Expenses,
  parents: Parents,
  announcements: Announcements,
  library: Library,
  reports: Reports,
  settings: Settings,
  ai: AIAssistant,
}

function GlobalToaster() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const originalAlert = window.alert
    window.alert = (msg) => {
      const id = Date.now() + Math.random()
      setToasts((prev) => [...prev, { id, msg }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 3500)
    }
    return () => {
      window.alert = originalAlert
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => {
        const isError =
          t.msg.toLowerCase().includes('error') ||
          t.msg.toLowerCase().includes('invalid')
        const icon = isError ? '❌' : '✅'
        const color = isError ? '#f87171' : '#4ade80'

        return (
          <div
            key={t.id}
            className="modern-toast animate-in"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              pointerEvents: 'auto',
              maxWidth: 400,
            }}
          >
            <span
              style={{ fontSize: 18, filter: `drop-shadow(0 0 8px ${color})` }}
            >
              {icon}
            </span>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1.4,
                color: '#f8fafc',
              }}
            >
              {t.msg}
            </div>
            {/* Dynamic left border glow color based on status */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 4,
                height: '100%',
                background: `linear-gradient(to bottom, ${color}, transparent)`,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

function AppContent() {
  const getPageFromHash = () => {
    const hash = window.location.hash.replace('#', '')
    return PAGES[hash] ? hash : 'dashboard'
  }

  const [page, setPageState] = useState(getPageFromHash)

  useEffect(() => {
    const handleHashChange = () => setPageState(getPageFromHash())
    window.addEventListener('hashchange', handleHashChange)
    if (!window.location.hash) window.location.hash = 'dashboard'
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const setPage = (p) => {
    window.location.hash = p
  }
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { currentRole, isAuthenticated } = useDb()

  if (!isAuthenticated) {
    return <Login />
  }

  // Role based route safeguard - if switching role makes a page inaccessible, fallback to dashboard
  const PageComponent = PAGES[page] || Dashboard

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse at center, var(--navy-3) 0%, var(--navy) 100%)',
        position: 'relative',
      }}
    >
      {/* 3D Animated Orbs Global Background */}
      <div
        className="glow-orb"
        style={{
          top: '10%',
          left: '20%',
          width: 300,
          height: 300,
          background: 'rgba(234,179,8,0.12)',
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
          background: 'rgba(96,165,250,0.08)',
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
          background: 'rgba(74,222,128,0.06)',
          animationDuration: '10s',
        }}
      />

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="hide-on-laptop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
        />
      )}

      <div
        className={`mobile-sidebar ${isSidebarOpen ? 'mobile-sidebar-visible' : 'mobile-sidebar-hidden'} hide-on-laptop`}
        style={{ zIndex: 1000, height: '100%' }}
      >
        <Sidebar
          page={page}
          setPage={(p) => {
            setPage(p)
            setIsSidebarOpen(false)
          }}
        />
      </div>
      <div className="hide-on-mobile" style={{ height: '100%' }}>
        <Sidebar page={page} setPage={setPage} />
      </div>

      <div
        className="main-content"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Topbar
          page={page}
          setPage={setPage}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: 'var(--padding-page)',
            background: 'transparent',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <PageComponent setPage={setPage} />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <DbProvider>
      <AppContent />
      <GlobalToaster />
    </DbProvider>
  )
}
