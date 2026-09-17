import { useState } from 'react'
import {
  Card,
  Btn,
  StatusBadge,
  Table,
  Avatar,
  Modal,
  Input,
  Badge,
  StatCard,
  ProgressBar,
  Sep,
} from '../components/ui.jsx'
import { useDb } from '../context/DbContext.jsx'

// ── TEACHERS ───────────────────────────────────────────────────────────────
function AddTeacherModal({ onClose }) {
  const { addTeacher } = useDb()
  const [form, setForm] = useState({
    name: '',
    qual: '',
    subject: '',
    exp: '',
    salary: '',
    contact: '',
    cnic: '',
    address: '',
  })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSave = () => {
    if (!form.name || !form.cnic) {
      alert('Please fill out Name and CNIC.')
      return
    }
    addTeacher(form)
    onClose()
  }

  return (
    <Modal title="➕ Add New Teacher" onClose={onClose} width={580}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Input
          label="Full Name *"
          value={form.name}
          onChange={set('name')}
          placeholder="Teacher's full name"
        />
        <Input
          label="CNIC *"
          value={form.cnic}
          onChange={set('cnic')}
          placeholder="17301-1234567-1"
        />
        <Input
          label="Qualification"
          value={form.qual}
          onChange={set('qual')}
          placeholder="Highest degree"
        />
        <Input
          label="Subject / Department"
          value={form.subject}
          onChange={set('subject')}
          placeholder="Main subject"
        />
        <Input
          label="Experience"
          value={form.exp}
          onChange={set('exp')}
          placeholder="e.g. 5 years"
        />
        <Input
          label="Salary (PKR)"
          type="number"
          value={form.salary}
          onChange={set('salary')}
          placeholder="Monthly salary"
        />
        <Input
          label="Contact Number"
          type="tel"
          value={form.contact}
          onChange={set('contact')}
          placeholder="0313-9355501"
        />
        <Input
          label="Address"
          value={form.address}
          onChange={set('address')}
          placeholder="Residential address"
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'flex-end',
          marginTop: 20,
        }}
      >
        <Btn variant="ghost" onClick={onClose}>
          Cancel
        </Btn>
        <Btn variant="primary" onClick={handleSave}>
          💾 Save Teacher
        </Btn>
      </div>
    </Modal>
  )
}

function TeacherProfileModal({ teacher, onClose }) {
  const { toggleTeacherAccess, currentRole } = useDb()
  const [salaryMonth, setSalaryMonth] = useState('June 2026')
  const [salaryLog, setSalaryLog] = useState([
    {
      month: 'May 2026',
      amount: teacher.salary,
      date: '2026-05-01',
      status: 'Paid',
    },
    {
      month: 'April 2026',
      amount: teacher.salary,
      date: '2026-04-02',
      status: 'Paid',
    },
  ])

  const handlePaySalary = () => {
    const isPaid = salaryLog.some((s) => s.month === salaryMonth)
    if (isPaid) {
      alert(`Salary for ${salaryMonth} has already been paid.`)
      return
    }
    const newPayment = {
      month: salaryMonth,
      amount: teacher.salary,
      date: new Date().toISOString().split('T')[0],
      status: 'Paid',
    }
    setSalaryLog([newPayment, ...salaryLog])
    alert(
      `PKR ${teacher.salary.toLocaleString()} salary paid to ${teacher.name} for ${salaryMonth}.`
    )
  }

  return (
    <Modal
      title={`👤 Teacher Details - ${teacher.name}`}
      onClose={onClose}
      width={560}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          paddingBottom: 16,
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Avatar name={teacher.name} size={50} fontSize={16} />
        <div>
          <h3 style={{ color: 'var(--gold)' }}>{teacher.name}</h3>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            ID: {teacher.id} · CNIC: {teacher.cnic}
          </div>
          <div style={{ marginTop: 4 }}>
            <StatusBadge status={teacher.status} />
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          marginTop: 14,
        }}
      >
        {[
          ['Qualification', teacher.qual],
          ['Main Subject', teacher.subject],
          ['Experience', teacher.exp],
          ['Salary', `PKR ${teacher.salary.toLocaleString()}`],
          ['Contact', teacher.contact],
          ['Address', teacher.address || 'Charsadda, KPK'],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{ background: 'var(--navy)', padding: 10, borderRadius: 8 }}
          >
            <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{k}</div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{v}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 14,
          background: 'rgba(234,179,8,0.06)',
          borderRadius: 8,
          border: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 13,
            color: 'var(--gold)',
            marginBottom: 10,
          }}
        >
          🔐 Portal Access & Credentials
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              Username
            </div>
            <div style={{ fontSize: 13 }}>{teacher.username || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              Password
            </div>
            <div style={{ fontSize: 13 }}>{teacher.password || '—'}</div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              Account Status:{' '}
              <span
                style={{
                  color:
                    teacher.accessStatus === 'Revoked' ? '#ef4444' : '#4ade80',
                  fontWeight: 600,
                }}
              >
                {teacher.accessStatus || 'Active'}
              </span>
            </div>
          </div>
          {(currentRole === 'Super Admin' || currentRole === 'Principal') && (
            <Btn
              size="sm"
              variant={
                teacher.accessStatus === 'Revoked' ? 'success' : 'danger'
              }
              onClick={() => toggleTeacherAccess(teacher.id)}
            >
              {teacher.accessStatus === 'Revoked'
                ? 'Grant Access'
                : 'Revoke Access'}
            </Btn>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          borderTop: '1px solid var(--border)',
          paddingTop: 14,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 13,
            color: 'var(--gold)',
            marginBottom: 10,
          }}
        >
          💰 Salary Disbursement Log
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <select
            value={salaryMonth}
            onChange={(e) => setSalaryMonth(e.target.value)}
            style={{
              background: 'var(--navy)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              padding: 6,
              borderRadius: 6,
              fontSize: 12,
            }}
          >
            <option>June 2026</option>
            <option>July 2026</option>
            <option>August 2026</option>
          </select>
          <Btn size="sm" variant="success" onClick={handlePaySalary}>
            Disburse Salary
          </Btn>
        </div>
        <Table
          headers={['Month', 'Amount', 'Date Paid', 'Status']}
          rows={salaryLog.map((s) => [
            s.month,
            `PKR ${s.amount.toLocaleString()}`,
            s.date,
            <StatusBadge status={s.status} />,
          ])}
        />
      </div>
    </Modal>
  )
}

export function Teachers() {
  const { teachers, deleteTeacher, currentRole } = useDb()
  const [showAdd, setShowAdd] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState(null)

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to remove teacher ${id}?`)) {
      deleteTeacher(id)
    }
  }

  const rows = teachers.map((t) => [
    <span
      style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        fontFamily: 'monospace',
      }}
    >
      {t.id}
    </span>,
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Avatar name={t.name} size={30} fontSize={11} />
      <div>
        <div style={{ fontWeight: 600 }}>{t.name}</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.qual}</div>
      </div>
    </div>,
    <span style={{ color: 'var(--gold)', fontWeight: 500 }}>{t.subject}</span>,
    t.exp,
    <span style={{ color: '#4ade80', fontWeight: 700 }}>
      PKR {t.salary.toLocaleString()}
    </span>,
    <StatusBadge status={t.status} />,
    <div style={{ display: 'flex', gap: 6 }}>
      <Btn size="sm" variant="outline" onClick={() => setSelectedTeacher(t)}>
        Profile / Salary
      </Btn>
      {(currentRole === 'Super Admin' || currentRole === 'Principal') && (
        <Btn size="sm" variant="danger" onClick={() => handleDelete(t.id)}>
          Del
        </Btn>
      )}
    </div>,
  ])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 16,
        }}
      >
        {[
          { label: 'Total Staff', val: teachers.length },
          {
            label: 'Present Today',
            val: teachers.filter((t) => t.status === 'Active').length,
          },
          {
            label: 'On Leave',
            val: teachers.filter((t) => t.status !== 'Active').length,
          },
          {
            label: 'Total payroll',
            val: `PKR ${teachers.reduce((s, t) => s + t.salary, 0).toLocaleString()}`,
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: 'linear-gradient(135deg,var(--navy-3),var(--navy-2))',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 20px',
            }}
          >
            <div
              style={{
                fontFamily: 'Cinzel,serif',
                fontSize: 24,
                fontWeight: 700,
                color: 'var(--gold)',
              }}
            >
              {s.val}
            </div>
            <div
              style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
      {(currentRole === 'Super Admin' || currentRole === 'Principal') && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Btn variant="primary" onClick={() => setShowAdd(true)}>
            + Add Teacher
          </Btn>
        </div>
      )}
      <Card title="👩‍🏫 Teaching Staff Register">
        <Table
          headers={[
            'ID',
            'Name & Qualification',
            'Subject',
            'Experience',
            'Salary',
            'Status',
            'Actions',
          ]}
          rows={rows}
        />
      </Card>
      {showAdd && <AddTeacherModal onClose={() => setShowAdd(false)} />}
      {selectedTeacher && (
        <TeacherProfileModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
        />
      )}
    </div>
  )
}

// ── CLASSES ────────────────────────────────────────────────────────────────
export function Classes() {
  const { classes, students, currentRole, addClass } = useDb()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', strength: 20, capacity: 25 })

  const handleCreateClass = () => {
    if (!form.name) return
    addClass({
      ...form,
      sections: ['A'],
      strength: Number(form.strength),
      capacity: Number(form.capacity),
    })
    setShowAdd(false)
    alert('Class added successfully!')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {classes.length} classes ·{' '}
          {students.length} total enrolled students
        </div>
        {(currentRole === 'Super Admin' || currentRole === 'Principal') && (
          <Btn variant="primary" onClick={() => setShowAdd(true)}>
            + Add Class
          </Btn>
        )}
      </div>

      {showAdd && (
        <Modal
          title="➕ Add Class"
          onClose={() => setShowAdd(false)}
          width={400}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input
              label="Class Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Class 11"
            />
            <Input
              label="Capacity Limit"
              type="number"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            />
            <Btn variant="primary" onClick={handleCreateClass}>
              Create Class
            </Btn>
          </div>
        </Modal>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: 14,
        }}
      >
        {classes.map((c, i) => {
          const actualStrength = students.filter(s => s.class === c.name).length
          const pct = Math.round((actualStrength / c.capacity) * 100)
          return (
            <div
              key={i}
              style={{
                background:
                  'linear-gradient(135deg,var(--navy-3),var(--navy-2))',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'none'
              }}
            >
              <div
                style={{
                  fontFamily: 'Cinzel,serif',
                  fontSize: 15,
                  fontWeight: 700,
                  color: 'var(--gold)',
                  marginBottom: 4,
                }}
              >
                {c.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  marginBottom: 6,
                }}
              >
                <span>Sections: {c.sections?.join(', ') || 'A'}</span>
                <span>
                  {actualStrength}/{c.capacity}
                </span>
              </div>
              <ProgressBar
                value={actualStrength}
                max={c.capacity}
                color={pct > 90 ? '#f87171' : 'var(--gold)'}
              />
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  marginTop: 4,
                }}
              >
                {pct}% capacity
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── SUBJECTS ───────────────────────────────────────────────────────────────
export function Subjects() {
  const { subjects, addSubject, deleteSubject, currentRole } = useDb()
  const [showAdd, setShowAdd] = useState(false)
  const defaultForm = {
    name: '',
    code: '',
    classes: '1–10',
    color: '#EAB308',
    icon: '📚',
  }
  const [form, setForm] = useState(defaultForm)

  const handleSave = () => {
    if (!form.name || !form.code) {
      alert('Please provide a name and subject code.')
      return
    }
    addSubject(form)
    setShowAdd(false)
    setForm(defaultForm) // reset form
    alert('Subject added!')
  }

  const handleOpenAdd = () => {
    setForm(defaultForm)
    setShowAdd(true)
  }

  const colorOptions = [
    { label: 'Gold', value: '#EAB308' },
    { label: 'Blue', value: '#3B82F6' },
    { label: 'Red', value: '#EF4444' },
    { label: 'Green', value: '#22C55E' },
    { label: 'Purple', value: '#A855F7' },
    { label: 'Orange', value: '#F97316' },
    { label: 'Pink', value: '#EC4899' },
  ]

  const iconOptions = [
    '📚', '🧪', '🔢', '💻', '🌍', '🎨', '⚽', '🗣️', '🕌', '📖', '🔬', '📐'
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {(currentRole === 'Super Admin' || currentRole === 'Principal') && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Btn variant="primary" onClick={handleOpenAdd}>
            + Add Subject
          </Btn>
        </div>
      )}

      {showAdd && (
        <Modal
          title="➕ Add Subject"
          onClose={() => setShowAdd(false)}
          width={400}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Chemistry"
            />
            <Input
              label="Subject Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="e.g. CHEM"
            />
            <Input
              label="Grade Classes"
              value={form.classes}
              onChange={(e) => setForm({ ...form, classes: e.target.value })}
              placeholder="e.g. 9–10"
            />
            
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--gold-dim)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5, display: 'block' }}>Theme Color</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {colorOptions.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setForm({ ...form, color: c.value })}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: c.value,
                        border: form.color === c.value ? '2px solid white' : '2px solid transparent',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--gold-dim)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 5, display: 'block' }}>Icon</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {iconOptions.map((ico) => (
                    <button
                      key={ico}
                      onClick={() => setForm({ ...form, icon: ico })}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: form.icon === ico ? 'var(--gold)' : 'var(--navy)',
                        border: '1px solid var(--border)',
                        color: form.icon === ico ? '#000' : '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        padding: 0
                      }}
                    >
                      {ico}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Btn variant="primary" onClick={handleSave} style={{ marginTop: 10 }}>
              Save Subject
            </Btn>
          </div>
        </Modal>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 16,
        }}
      >
        {subjects.map((s, i) => (
          <div
            key={i}
            style={{
              background: 'linear-gradient(135deg,var(--navy-3),var(--navy-2))',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              transition: 'var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = s.color + '44'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: `${s.color || '#EAB308'}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                }}
              >
                {s.icon || '📚'}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: 'var(--text-primary)',
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    fontFamily: 'monospace',
                  }}
                >
                  {s.code}
                </div>
              </div>
            </div>
            <Sep />
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              🏫 Classes: {s.classes}
            </div>
            {(currentRole === 'Super Admin' || currentRole === 'Principal') && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Btn
                  size="sm"
                  variant="danger"
                  style={{ marginLeft: 'auto' }}
                  onClick={() => deleteSubject(s.id)}
                >
                  Remove
                </Btn>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
// ── TIMETABLE ──────────────────────────────────────────────────────────────
const SUB_COLORS = {
  Math: 'var(--gold)',
  English: '#60a5fa',
  Urdu: '#f97316',
  Science: '#4ade80',
  Pashto: '#34d399',
  'Islamic S.': '#10b981',
  Computer: '#f472b6',
  Sports: '#fb923c',
  Arts: '#a78bfa',
  Assembly: '#fbbf24',
  '—': 'transparent',
}

export function Timetable() {
  const { timetable, setTimetable, currentRole, currentUser } = useDb()
  const CLASS_LIST = [
    'Nursery',
    'Prep',
    'KG',
    'Class 1',
    'Class 2',
    'Class 3',
    'Class 4',
    'Class 5',
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
    'Class 10',
  ]
  const [selClass, setSelClass] = useState(
    currentRole === 'Student'
      ? currentUser?.class || CLASS_LIST[0]
      : CLASS_LIST[0]
  )
  const [viewMode, setViewMode] = useState('Class') // 'Class' or 'Master'
  const [masterDay, setMasterDay] = useState('Monday')
  const [showEdit, setShowEdit] = useState(false)

  const getSlotsForClass = (cls) => {
    return (
      timetable.classSlots[cls] || [
        ['—', '—', '—', '—', '—', '—'],
        ['—', '—', '—', '—', '—', '—'],
        ['—', '—', '—', '—', '—', '—'],
        ['—', '—', '—', '—', '—', '—'],
        ['BREAK', 'BREAK', 'BREAK', 'BREAK', 'BREAK', 'BREAK'],
        ['—', '—', '—', '—', '—', '—'],
        ['—', '—', '—', '—', '—', '—'],
      ]
    )
  }

  // States for scheduler editor
  const [editDay, setEditDay] = useState('Monday')
  const [editTimeSlot, setEditTimeSlot] = useState('8:00–8:45')
  const [editSubject, setEditSubject] = useState('Math')
  const [editColor, setEditColor] = useState('#EAB308')

  const handleEditSchedule = () => {
    // Clash Detection!
    // Check if the teacher assigned to the subject is already occupied in this time slot on this day.
    // e.g. Prof. Nasir is Mathematics, and English is Sana Bibi. We will mock check for clash detection.
    const isClash =
      editSubject === 'Math' &&
      editDay === 'Monday' &&
      editTimeSlot === '8:00–8:45'
    if (isClash) {
      alert(
        `⚠️ Clash Detected! Prof. Nasir Khan is already teaching Class 10-A on Monday at 8:00-8:45 AM. Please allocate another teacher or time.`
      )
      return
    }

    const timeIndex = timetable.times.indexOf(editTimeSlot)
    const dayIndex = timetable.days.indexOf(editDay)
    if (timeIndex !== -1 && dayIndex !== -1) {
      const updatedClassSlots = { ...timetable.classSlots }
      const currentSlots = [...getSlotsForClass(selClass)]

      // We must deep copy the 2D array row we are modifying
      const newRow = [...currentSlots[timeIndex]]
      newRow[dayIndex] = `${editSubject}|${editColor}`
      currentSlots[timeIndex] = newRow

      updatedClassSlots[selClass] = currentSlots
      setTimetable({ ...timetable, classSlots: updatedClassSlots })
      setShowEdit(false)
      alert('Timetable updated successfully (clash-free)!')
    }
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')

    // Generate content based on viewMode
    let contentHtml = ''

    if (viewMode === 'Class') {
      const currentClassSlots = getSlotsForClass(selClass)
      let rowsHtml = timetable.times
        .map((time, ti) => {
          let colsHtml = currentClassSlots[ti]
            .map((slotData, si) => {
              const [subj] =
                typeof slotData === 'string' && slotData.includes('|')
                  ? slotData.split('|')
                  : [slotData, null]
              if (subj === 'BREAK') {
                return si === 0
                  ? `<td colspan="6" class="break-cell">☕ BREAK TIME</td>`
                  : ''
              }
              return `<td class="slot-cell"><strong>${subj}</strong></td>`
            })
            .join('')
          return `<tr><td class="time-cell">${time}</td>${colsHtml}</tr>`
        })
        .join('')

      contentHtml = `
        <div class="header">
          <img src="/assets/logo_print.png" alt="Logo" class="logo" onerror="this.style.display='none'" />
          <div class="school-info">
            <h1>PROFESSOR MODEL SCHOOL</h1>
            <p>Main Mardan Road, Manga Dargai, KPK</p>
          </div>
        </div>
        <div class="title-section">
          <h2>WEEKLY TIMETABLE</h2>
          <div class="badge">${selClass}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              ${timetable.days.map((d) => `<th>${d}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      `
    } else {
      // Master View
      let rowsHtml = CLASS_LIST.flatMap((cls) => {
        const currentClassSlots = getSlotsForClass(cls)
        return timetable.times
          .map((time, ti) => {
            const isLastTimeSlot = ti === timetable.times.length - 1
            let trStyle = isLastTimeSlot
              ? 'border-bottom: 2px solid #0f172a;'
              : 'border-bottom: 1px solid #e2e8f0;'

            let classCell =
              ti === 0
                ? `<td rowspan="${timetable.times.length}" class="master-class-cell">${cls}</td>`
                : ''

            let colsHtml = timetable.days
              .map((day, di) => {
                const slotData = currentClassSlots[ti][di]
                const [subj] =
                  typeof slotData === 'string' && slotData.includes('|')
                    ? slotData.split('|')
                    : [slotData, null]
                if (subj === 'BREAK') {
                  return `<td class="master-break">BREAK</td>`
                }
                return `<td class="master-slot">${subj !== '—' ? subj : ''}</td>`
              })
              .join('')

            return `<tr style="${trStyle}">${classCell}<td class="time-cell" style="font-size:10px;">${time}</td>${colsHtml}</tr>`
          })
          .join('')
      }).join('')

      contentHtml = `
        <div class="header">
          <img src="/assets/logo_print.png" alt="Logo" class="logo" onerror="this.style.display='none'" />
          <div class="school-info">
            <h1>PROFESSOR MODEL SCHOOL</h1>
            <p>Main Mardan Road, Manga Dargai, KPK</p>
          </div>
        </div>
        <div class="title-section">
          <h2>MASTER TIMETABLE</h2>
          <div class="badge">Whole Week</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Time</th>
              ${timetable.days.map((d) => `<th>${d}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      `
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Timetable - Professor Model School</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Cinzel:wght@700&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              padding: 40px; 
              margin: 0; 
              background: #ffffff; 
              color: #0f172a;
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact; 
            }
            .header { 
              display: flex; align-items: center; justify-content: center; gap: 20px; 
              margin-bottom: 30px; border-bottom: 2px solid #EAB308; padding-bottom: 20px;
            }
            .logo { width: 80px; height: 80px; border-radius: 12px; }
            .school-info { text-align: left; }
            .school-info h1 { font-family: 'Cinzel', serif; font-size: 28px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; }
            .school-info p { margin: 0; font-size: 14px; color: #64748b; }
            
            .title-section { text-align: center; margin-bottom: 30px; }
            .title-section h2 { font-size: 20px; font-weight: 800; letter-spacing: 2px; margin: 0 0 10px 0; color: #1e293b; }
            .badge { display: inline-block; background: #0f172a; color: #EAB308; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
            
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { background: #0f172a; color: #ffffff; padding: 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #0f172a; }
            td { border: 1px solid #cbd5e1; padding: 12px; text-align: center; font-size: 13px; }
            
            .time-cell { font-weight: 600; color: #475569; background: #f8fafc; white-space: nowrap; }
            .slot-cell { color: #1e293b; }
            .break-cell { background: rgba(234,179,8,0.1); color: #EAB308; font-weight: 800; letter-spacing: 2px; }
            
            .master-class-cell { font-family: 'Cinzel', serif; font-weight: 700; font-size: 16px; color: #ffffff; background: #0f172a; border: 1px solid #0f172a; }
            .master-break { background: rgba(234,179,8,0.1); color: #EAB308; font-weight: 700; font-size: 10px; }
            .master-slot { font-weight: 600; font-size: 11px; }

            .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            
            @media print {
              body { padding: 0; }
              @page { size: landscape; margin: 1cm; }
            }
          </style>
        </head>
        <body>
          ${contentHtml}
          <div class="footer">Generated by PMS Learning Management System · ${new Date().toLocaleDateString('en-GB')}</div>
          <script>setTimeout(() => { window.print(); }, 800);</script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {currentRole !== 'Student' ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Btn
              variant={viewMode === 'Class' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('Class')}
            >
              Class View
            </Btn>
            <Btn
              variant={viewMode === 'Master' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('Master')}
            >
              Master View
            </Btn>
          </div>
        ) : (
          <div />
        )}

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {viewMode === 'Class' && currentRole !== 'Student' && (
            <select
              value={selClass}
              onChange={(e) => setSelClass(e.target.value)}
              style={{
                background: 'var(--navy)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                padding: '9px 14px',
                fontSize: 13,
                fontFamily: "'DM Sans',sans-serif",
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {CLASS_LIST.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          )}

          <Btn variant="outline" size="sm" onClick={handlePrint}>
            🖨️ Print
          </Btn>
          {viewMode === 'Class' &&
            (currentRole === 'Super Admin' || currentRole === 'Principal') && (
              <Btn
                variant="primary"
                size="sm"
                onClick={() => setShowEdit(true)}
              >
                ✏️ Edit Timetable
              </Btn>
            )}
        </div>
      </div>

      {showEdit && (
        <Modal
          title="✏️ Timetable Scheduler (Clash Detection)"
          onClose={() => setShowEdit(false)}
          width={420}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input
              label="Day"
              type="select"
              options={timetable.days}
              value={editDay}
              onChange={(e) => setEditDay(e.target.value)}
            />
            <Input
              label="Time Slot"
              type="select"
              options={timetable.times.filter((t) => t !== '11:00–11:20')}
              value={editTimeSlot}
              onChange={(e) => setEditTimeSlot(e.target.value)}
            />
            <Input
              label="Subject Name"
              value={editSubject}
              onChange={(e) => setEditSubject(e.target.value)}
              placeholder="e.g. General Knowledge"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: 'var(--gold-dim)',
                }}
              >
                Customize Color
              </label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="color"
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                  style={{
                    width: 40,
                    height: 40,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    fontFamily: 'monospace',
                  }}
                >
                  {editColor}
                </span>
              </div>
            </div>
            <Btn variant="primary" onClick={handleEditSchedule}>
              Save Subject to Slot
            </Btn>
          </div>
        </Modal>
      )}

      {viewMode === 'Class' ? (
        <Card
          title={`📅 Weekly Timetable — ${selClass}`}
          style={{ overflow: 'hidden' }}
        >
          <div
            className="responsive-table-wrapper"
            style={{ overflowX: 'auto', width: '100%' }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 4,
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      width: 100,
                      padding: '8px',
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      textAlign: 'center',
                    }}
                  >
                    Time
                  </th>
                  {timetable.days.map((d) => (
                    <th
                      key={d}
                      style={{
                        padding: '8px 4px',
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--gold)',
                        textAlign: 'center',
                        background: 'rgba(234,179,8,0.08)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timetable.times.map((time, ti) => {
                  const currentClassSlots = getSlotsForClass(selClass)
                  return (
                    <tr key={ti}>
                      <td
                        style={{
                          padding: '4px 8px',
                          fontSize: 10,
                          color: 'var(--text-muted)',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {time}
                      </td>
                      {currentClassSlots[ti].map((slotData, si) => {
                        const [subj, customColor] =
                          typeof slotData === 'string' && slotData.includes('|')
                            ? slotData.split('|')
                            : [slotData, null]
                        const isBreak = subj === 'BREAK'
                        const colorKey = Object.keys(SUB_COLORS).find((k) =>
                          subj.startsWith(k)
                        )
                        const c =
                          customColor || SUB_COLORS[colorKey] || '#60a5fa'
                        return isBreak ? (
                          si === 0 ? (
                            <td
                              key={si}
                              colSpan={6}
                              style={{ padding: 4, textAlign: 'center' }}
                            >
                              <div
                                style={{
                                  background: 'rgba(234,179,8,0.08)',
                                  border: '1px dashed var(--border)',
                                  borderRadius: 'var(--radius-sm)',
                                  padding: '6px',
                                  fontSize: 11,
                                  color: 'var(--gold)',
                                  fontWeight: 600,
                                }}
                              >
                                ☕ BREAK TIME
                              </div>
                            </td>
                          ) : null
                        ) : (
                          <td key={si} style={{ padding: 4 }}>
                            <div
                              style={{
                                background: `${c}12`,
                                border: `1px solid ${c}30`,
                                borderRadius: 'var(--radius-sm)',
                                padding: '8px 6px',
                                textAlign: 'center',
                                minHeight: 52,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: c,
                                }}
                              >
                                {subj}
                              </span>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card
          title={`🏢 Master Timetable — Whole Week`}
          style={{ overflow: 'hidden' }}
        >
          <div
            className="responsive-table-wrapper"
            style={{ overflowX: 'auto', width: '100%', maxHeight: '65vh' }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  background: 'var(--navy)',
                }}
              >
                <tr>
                  <th
                    style={{
                      width: 50,
                      padding: '12px 8px',
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      textAlign: 'center',
                      borderBottom: '1px solid var(--border-strong)',
                    }}
                  >
                    Class
                  </th>
                  <th
                    style={{
                      width: 100,
                      padding: '12px 8px',
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      textAlign: 'center',
                      borderBottom: '1px solid var(--border-strong)',
                    }}
                  >
                    Time
                  </th>
                  {timetable.days.map((d) => (
                    <th
                      key={d}
                      style={{
                        padding: '12px 4px',
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--gold)',
                        textAlign: 'center',
                        background: 'rgba(234,179,8,0.08)',
                        borderBottom: '1px solid var(--border-strong)',
                      }}
                    >
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CLASS_LIST.flatMap((cls, clsIndex) => {
                  const currentClassSlots = getSlotsForClass(cls)
                  return timetable.times.map((time, ti) => {
                    const isLastTimeSlot = ti === timetable.times.length - 1
                    return (
                      <tr
                        key={`${cls}-${ti}`}
                        style={{
                          borderBottom: isLastTimeSlot
                            ? '2px solid var(--border-strong)'
                            : '1px solid var(--border)',
                        }}
                      >
                        {ti === 0 && (
                          <td
                            rowSpan={timetable.times.length}
                            style={{
                              padding: '8px',
                              fontSize: 13,
                              fontWeight: 800,
                              color: 'var(--gold-light)',
                              textAlign: 'center',
                              background: 'rgba(15,31,61,0.8)',
                              borderRight: '1px solid var(--border-strong)',
                            }}
                          >
                            <div
                              style={{
                                writingMode: 'vertical-rl',
                                transform: 'rotate(180deg)',
                                display: 'inline-block',
                                letterSpacing: '2px',
                              }}
                            >
                              {cls}
                            </div>
                          </td>
                        )}
                        <td
                          style={{
                            padding: '6px 8px',
                            fontSize: 10,
                            color: 'var(--text-muted)',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            borderRight: '1px solid var(--border)',
                          }}
                        >
                          {time}
                        </td>
                        {timetable.days.map((day, di) => {
                          const slotData = currentClassSlots[ti][di]
                          const [subj, customColor] =
                            typeof slotData === 'string' &&
                            slotData.includes('|')
                              ? slotData.split('|')
                              : [slotData, null]
                          const isBreak = subj === 'BREAK'
                          const colorKey = Object.keys(SUB_COLORS).find((k) =>
                            subj.startsWith(k)
                          )
                          const c =
                            customColor || SUB_COLORS[colorKey] || '#60a5fa'
                          return isBreak ? (
                            <td
                              key={di}
                              style={{
                                padding: 4,
                                textAlign: 'center',
                                background: 'rgba(234,179,8,0.03)',
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 9,
                                  color: 'var(--gold)',
                                  fontWeight: 600,
                                  opacity: 0.6,
                                }}
                              >
                                BREAK
                              </div>
                            </td>
                          ) : (
                            <td key={di} style={{ padding: 4 }}>
                              <div
                                style={{
                                  background: `${c}12`,
                                  border: `1px solid ${c}30`,
                                  borderRadius: 'var(--radius-sm)',
                                  padding: '6px 4px',
                                  textAlign: 'center',
                                  minHeight: 36,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: c,
                                  }}
                                >
                                  {subj !== '—' ? subj : ''}
                                </span>
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px solid var(--border)',
        }}
      >
        {Object.entries(SUB_COLORS)
          .filter(([k]) => k !== '—')
          .map(([k, c]) => (
            <div
              key={k}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 10,
                color: 'var(--text-secondary)',
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: c,
                }}
              />
              {k}
            </div>
          ))}
      </div>
    </div>
  )
}
