import { Avatar } from './ui.jsx'
import { useDb } from '../context/DbContext.jsx'

const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
      { id: 'ai', icon: '✦', label: 'AI Assistant' },
    ],
  },
  {
    label: 'Academics',
    items: [
      { id: 'students', icon: '👥', label: 'Students' },
      { id: 'teachers', icon: '◈', label: 'Teachers' },
      { id: 'classes', icon: '⬡', label: 'Classes & Sections' },
      { id: 'subjects', icon: '◧', label: 'Subjects' },
      { id: 'timetable', icon: '⊟', label: 'Timetable' },
      { id: 'attendance', icon: '☑️', label: 'Attendance' },
    ],
  },
  {
    label: 'Examinations',
    items: [
      { id: 'exams', icon: '◫', label: 'Exams & Results' },
      { id: 'homework', icon: '◪', label: 'Homework' },
      { id: 'lms', icon: '◳', label: 'LMS / Courses' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { id: 'fees', icon: '◈', label: 'Fee Management' },
      { id: 'expenses', icon: '◧', label: 'Expenses' },
    ],
  },
  {
    label: 'Communication',
    items: [
      { id: 'parents', icon: '◎', label: 'Parent Portal' },
      { id: 'announcements', icon: '◉', label: 'Announcements' },
      { id: 'library', icon: '◫', label: 'Library' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { id: 'reports', icon: '◳', label: 'Reports' },
      { id: 'settings', icon: '⊙', label: 'Settings' },
    ],
  },
]

const ROLE_PERMISSIONS = {
  'Super Admin': [
    'dashboard',
    'ai',
    'students',
    'teachers',
    'classes',
    'subjects',
    'timetable',
    'attendance',
    'exams',
    'homework',
    'lms',
    'fees',
    'expenses',
    'parents',
    'announcements',
    'library',
    'reports',
    'settings',
  ],
  Principal: [
    'dashboard',
    'ai',
    'students',
    'teachers',
    'classes',
    'subjects',
    'timetable',
    'attendance',
    'exams',
    'fees',
    'expenses',
    'parents',
    'announcements',
    'library',
    'reports',
    'settings',
  ],
  Teacher: [
    'dashboard',
    'ai',
    'students',
    'classes',
    'subjects',
    'timetable',
    'attendance',
    'exams',
    'homework',
    'lms',
    'announcements',
    'settings',
  ],
  Student: [
    'dashboard',
    'ai',
    'timetable',
    'attendance',
    'exams',
    'homework',
    'lms',
    'fees',
    'announcements',
  ],
  Parent: [
    'dashboard',
    'ai',
    'timetable',
    'attendance',
    'exams',
    'homework',
    'announcements',
    'fees',
  ],
  Accountant: [
    'dashboard',
    'ai',
    'fees',
    'expenses',
    'announcements',
    'reports',
    'settings',
  ],
  Librarian: ['dashboard', 'ai', 'library', 'announcements', 'settings'],
}

export default function Sidebar({ page, setPage }) {
  const { currentRole, currentUser } = useDb()

  const allowedPages =
    ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS['Super Admin']

  return (
    <aside
      style={{
        width: 248,
        minWidth: 248,
        background: 'rgba(15,31,61,0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Logo Header */}
      <div
        onClick={() => setPage('dashboard')}
        style={{
          padding: '20px 16px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background:
            'linear-gradient(135deg, rgba(234,179,8,0.06), transparent)',
          cursor: 'pointer',
        }}
      >
        <img
          src="./logo.png"
          alt="PMS Logo"
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            border: '2px solid var(--gold-dark)',
            objectFit: 'cover',
            flexShrink: 0,
          }}
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, var(--gold-dark), var(--gold))',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Cinzel, serif',
            fontSize: 13,
            fontWeight: 900,
            color: 'var(--navy)',
            border: '2px solid var(--gold)',
            flexShrink: 0,
          }}
        >
          PMS
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--gold)',
              letterSpacing: 0.3,
              lineHeight: 1.3,
            }}
          >
            Professor Model
          </div>
          <div
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--gold)',
              lineHeight: 1.3,
            }}
          >
            School Dargai
          </div>
          <div
            style={{
              fontSize: 9,
              color: 'var(--text-muted)',
              marginTop: 2,
              letterSpacing: 0.5,
            }}
          >
            SCHOOL MANAGEMENT SYSTEM
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {NAV_SECTIONS.map((section) => {
          // Filter items within section
          const visibleItems = section.items.filter((item) =>
            allowedPages.includes(item.id)
          )
          if (visibleItems.length === 0) return null

          return (
            <div key={section.label} style={{ marginBottom: 4 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  color: 'var(--gold)',
                  padding: '12px 20px 6px',
                }}
              >
                {section.label}
              </div>
              {visibleItems.map((item) => {
                const active = page === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setPage(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 20px',
                      background: active
                        ? 'rgba(234,179,8,0.1)'
                        : 'transparent',
                      border: 'none',
                      borderLeft: `3px solid ${active ? 'var(--gold)' : 'transparent'}`,
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      textAlign: 'left',
                      color: active ? 'var(--gold)' : 'var(--text-secondary)',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background =
                          'rgba(234,179,8,0.05)'
                        e.currentTarget.style.color = 'var(--text-primary)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'var(--text-secondary)'
                      }
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        opacity: active ? 1 : 0.6,
                        width: 16,
                        textAlign: 'center',
                        fontFamily: 'monospace',
                      }}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* User Footer */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(234,179,8,0.03)',
        }}
      >
        <Avatar
          name={currentUser?.name || currentRole}
          size={34}
          fontSize={12}
        />
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--gold)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {currentUser?.name || currentRole}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            {currentRole} {currentUser?.id ? `(${currentUser.id})` : ''}
          </div>
        </div>
      </div>
    </aside>
  )
}
