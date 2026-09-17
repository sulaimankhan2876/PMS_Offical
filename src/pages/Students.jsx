import { useState } from 'react'
import {
  Card,
  Btn,
  StatusBadge,
  ProgressBar,
  SearchInput,
  Table,
  Avatar,
  Modal,
  Input,
  Badge,
  Dropdown,
} from '../components/ui.jsx'
import { useDb } from '../context/DbContext.jsx'

const CLASS_OPTIONS = [
  'All Classes',
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
const SECTION_OPTIONS = ['A', 'B', 'C']

function AddStudentModal({ onClose }) {
  const { addStudent } = useDb()
  const [form, setForm] = useState({
    name: '',
    father: '',
    mother: '',
    dob: '',
    gender: 'Male',
    bform: '',
    contact: '',
    address: '',
    class: 'Class 1',
    section: 'A',
    prevSchool: '',
    emergency: '',
    medical: '',
    customFee: '2500',
    photo: '',
  })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) =>
        setForm((f) => ({ ...f, photo: ev.target.result }))
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (!form.name || !form.father) {
      alert('Please fill out Name and Father Name fields.')
      return
    }
    addStudent(form)
    onClose()
  }

  return (
    <Modal title="➕ Enroll New Student" onClose={onClose} width={620}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Input
          label="Full Name *"
          value={form.name}
          onChange={set('name')}
          placeholder="Student's full name"
        />
        <Input
          label="Father's Name *"
          value={form.father}
          onChange={set('father')}
          placeholder="Father's name"
        />
        <Input
          label="Mother's Name"
          value={form.mother}
          onChange={set('mother')}
          placeholder="Mother's name"
        />
        <Input
          label="Date of Birth"
          type="date"
          value={form.dob}
          onChange={set('dob')}
        />
        <Input
          label="Gender"
          type="select"
          value={form.gender}
          onChange={set('gender')}
          options={['Male', 'Female']}
        />
        <Input
          label="CNIC / B-Form No."
          value={form.bform}
          onChange={set('bform')}
          placeholder="12301-1234567-1"
        />
        <Input
          label="Contact Number"
          type="tel"
          value={form.contact}
          onChange={set('contact')}
          placeholder="0313-9355501"
        />
        <Input
          label="Class *"
          type="select"
          value={form.class}
          onChange={set('class')}
          options={CLASS_OPTIONS.slice(1)}
        />
        <Input
          label="Section"
          type="select"
          value={form.section}
          onChange={set('section')}
          options={SECTION_OPTIONS}
        />
        <Input
          label="Previous School"
          value={form.prevSchool}
          onChange={set('prevSchool')}
          placeholder="Previous school name"
        />
        <Input
          label="Emergency Contact"
          value={form.emergency}
          onChange={set('emergency')}
          placeholder="Emergency contact number"
        />
        <div>
          <div
            style={{
              fontSize: 10,
              color: 'var(--text-muted)',
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            Student Photo
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{
              width: '100%',
              background: 'var(--navy)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: 6,
              fontSize: 11,
            }}
          />
          {form.photo && (
            <img
              src={form.photo}
              alt="Preview"
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                objectFit: 'cover',
                marginTop: 8,
              }}
            />
          )}
        </div>
        <Input
          label="Custom Monthly Fee (PKR)"
          type="number"
          value={form.customFee}
          onChange={set('customFee')}
          placeholder="e.g. 2500"
        />
      </div>
      <div style={{ marginTop: 14 }}>
        <Input
          label="Address"
          value={form.address}
          onChange={set('address')}
          placeholder="Full residential address"
        />
      </div>
      <div style={{ marginTop: 14 }}>
        <Input
          label="Medical Notes"
          type="textarea"
          value={form.medical}
          onChange={set('medical')}
          placeholder="Any medical conditions, allergies, or special needs..."
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
          💾 Save Student
        </Btn>
      </div>
    </Modal>
  )
}

function StudentDetailModal({ student, onClose }) {
  const { promoteStudent, currentRole, toggleStudentAccess, feeRecords } =
    useDb()
  const [showPromote, setShowPromote] = useState(false)
  const [pClass, setPClass] = useState(student.class)
  const [pSection, setPSection] = useState(student.section)

  if (!student) return null

  const handlePromoteSubmit = () => {
    promoteStudent(student.id, pClass, pSection)
    setShowPromote(false)
    alert('Student promoted successfully!')
  }

  const fields = [
    ['Student ID', student.id],
    ['Full Name', student.name],
    ['Father', student.father],
    ['Mother', student.mother],
    ['Date of Birth', student.dob],
    ['Gender', student.gender],
    ['CNIC/B-Form', student.bform],
    ['Contact', student.contact],
    ['Class', `${student.class}-${student.section}`],
    ['Admission Date', student.admDate || '2026-06-06'],
    ['Address', student.address],
    ['Portal Username', student.username || '—'],
    ['Portal Password', student.password || '—'],
    ['Account Status', student.accessStatus || 'Active'],
    ['Custom Monthly Fee', `PKR ${student.customFee || 2500}`],
  ]

  // Printable ID Card mockup
  const handlePrintCard = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Student ID Card - ${student.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;500;600;700;800&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              display: flex; align-items: center; justify-content: center; 
              height: 100vh; margin: 0; background: #e2e8f0; 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact; 
            }
            .card-wrapper {
              width: 320px; height: 530px; 
              position: relative;
              filter: drop-shadow(0 25px 35px rgba(0,0,0,0.3));
            }
            .card { 
              width: 100%; height: 100%; 
              border-radius: 18px; 
              background: radial-gradient(circle at top right, #1a2942 0%, #060b14 100%); 
              color: #E8EDF5; 
              border: 1px solid rgba(234,179,8,0.4); 
              box-shadow: inset 0 0 0 4px #060b14, inset 0 0 0 6px #EAB308; 
              overflow: hidden; 
              position: relative; 
              padding: 20px; 
              box-sizing: border-box;
              text-align: center; 
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            /* Subtle texture overlay for premium feel */
            .card::before {
              content: '';
              position: absolute; inset: 0;
              background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
              z-index: 1; pointer-events: none;
            }
            /* Studio light glare effect */
            .card::after {
              content: '';
              position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
              background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%);
              transform: rotate(30deg);
              z-index: 2; pointer-events: none;
            }
            .content-layer {
              position: relative; z-index: 10;
              display: flex; flex-direction: column; height: 100%;
            }
            .header { 
              border-bottom: 1px solid rgba(234,179,8,0.3); 
              padding-bottom: 10px; margin-bottom: 12px; 
              display: flex; flex-direction: column; align-items: center; gap: 4px;
            }
            .school-name { 
              font-family: 'Cinzel', serif;
              font-size: 14px; font-weight: 800; color: #EAB308; 
              text-transform: uppercase; letter-spacing: 1px; 
              text-shadow: 0 2px 4px rgba(0,0,0,0.5);
              display: flex; align-items: center; gap: 8px;
            }
            /* School Logo */
            .school-icon { width: 32px; height: auto; border-radius: 4px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
            .address { font-size: 8px; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 500; }
            
            .photo-box { 
              width: 100px; height: 100px; 
              border-radius: 50%; 
              margin: 0 auto 10px; 
              background: #EAB30833; 
              display: flex; align-items: center; justify-content: center; 
              font-size: 36px; font-weight: 700; color: #EAB308; 
              /* Sculpted gold ring */
              box-shadow: 0 0 0 3px #060b14, 0 0 0 6px #EAB308, 0 10px 20px rgba(0,0,0,0.6);
            }
            .photo-box img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
            
            .name { font-size: 20px; font-weight: 800; color: #FFFFFF; margin-bottom: 2px; letter-spacing: -0.5px; }
            .role { 
              font-size: 10px; font-weight: 700; text-transform: uppercase; 
              color: #EAB308; letter-spacing: 2px; margin-bottom: 12px; 
              background: rgba(234,179,8,0.1); padding: 4px 12px; border-radius: 20px; display: inline-block;
              border: 1px solid rgba(234,179,8,0.2);
            }
            
            .details { 
              display: grid; grid-template-columns: 1fr; gap: 6px; 
              text-align: left; background: rgba(255,255,255,0.03); 
              padding: 12px 16px; border-radius: 12px; 
              border: 1px solid rgba(255,255,255,0.05);
              font-size: 11px; margin-bottom: auto;
            }
            .detail-row { display: flex; align-items: center; gap: 8px; }
            .detail-icon { font-size: 14px; opacity: 0.8; }
            .detail-label { color: #94a3b8; font-weight: 500; width: 65px; }
            .detail-value { color: #f8fafc; font-weight: 700; }
            
            .bottom-section {
              display: flex; justify-content: space-between; align-items: flex-end;
              margin-top: 10px; padding-top: 10px; border-top: 1px dashed rgba(234,179,8,0.3);
            }
            .qr-code { 
              width: 50px; height: 50px; background: white; padding: 4px; border-radius: 6px; 
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            }
            .qr-code img { width: 100%; height: 100%; }
            
            .auth-block { text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; }
            /* Cursive signature mockup */
            .signature { font-family: 'Brush Script MT', cursive, 'Cinzel'; font-size: 24px; color: #EAB308; margin-bottom: 4px; transform: rotate(-8deg); opacity: 0.9; line-height: 1; }
            .sig-line { width: 110px; height: 1px; background: rgba(255,255,255,0.2); margin: 0 auto 4px; }
            .auth-label { font-size: 8px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
            .issue-date { font-size: 8px; color: #64748b; margin-top: 4px; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="card-wrapper">
            <div class="card">
              <div class="content-layer">
                
                <div class="header">
                  <div class="school-name">
                    <img src="/assets/logo_print.png" class="school-icon" alt="Logo" onerror="this.style.display='none'" /> Professor Model School
                  </div>
                  <div class="address">Dargai Charsadda KPK</div>
                </div>
                
                <div class="photo-box">
                  ${
                    student.photo
                      ? `<img src="${student.photo}" />`
                      : student.name
                          .split(' ')
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join('')
                          .toUpperCase()
                  }
                </div>
                
                <div style="text-align: center;">
                  <div class="name">${student.name}</div>
                  <div class="role">Official Student</div>
                </div>
                
                <div class="details">
                  <div class="detail-row">
                    <span class="detail-icon">🪪</span>
                    <span class="detail-label">ID No:</span>
                    <span class="detail-value" style="color: #EAB308; font-family: monospace; font-size: 13px;">${student.id}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-icon">🎒</span>
                    <span class="detail-label">Class:</span>
                    <span class="detail-value">${student.class} - ${student.section}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-icon">👨‍👩‍👧‍👦</span>
                    <span class="detail-label">Father:</span>
                    <span class="detail-value">${student.father}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-icon">📱</span>
                    <span class="detail-label">Contact:</span>
                    <span class="detail-value">${student.contact}</span>
                  </div>
                </div>
                
                <div class="bottom-section">
                  <div class="qr-code">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=PMS-ID-${student.id}" alt="QR" />
                  </div>
                  <div class="auth-block">
                    <div class="signature">M. Daud</div>
                    <div class="sig-line"></div>
                    <div class="auth-label">Principal Signature</div>
                    <div class="issue-date">ISSUED: ${new Date().toLocaleDateString('en-GB').replace(/\//g, '.')}</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <script>setTimeout(() => window.print(), 500);</script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const studentFees = feeRecords
    ? feeRecords.filter(
        (f) => f.studentId === student.id || f.name === student.name
      )
    : []

  return (
    <Modal title="👤 Student Profile" onClose={onClose} width={560}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          paddingBottom: 16,
          borderBottom: '1px solid var(--border)',
        }}
      >
        {student.photo ? (
          <img
            src={student.photo}
            alt={student.name}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              objectFit: 'cover',
              border: '2px solid var(--gold)',
            }}
          />
        ) : (
          <Avatar name={student.name} size={50} fontSize={16} />
        )}
        <div>
          <div
            style={{
              fontFamily: 'Cinzel,serif',
              fontSize: 16,
              color: 'var(--gold)',
              fontWeight: 700,
            }}
          >
            {student.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              marginTop: 2,
            }}
          >
            {student.id} · {student.class}-{student.section}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <StatusBadge status={student.fee} />
            <Badge label={student.grade} variant="success" />
          </div>
        </div>
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <Btn variant="primary" size="sm" onClick={handlePrintCard}>
            🖨️ Printable QR ID Card
          </Btn>
          {(currentRole === 'Super Admin' || currentRole === 'Principal') && (
            <>
              <Btn
                variant="outline"
                size="sm"
                onClick={() => setShowPromote(!showPromote)}
              >
                🚀 Class Promotion
              </Btn>
              <Btn
                variant={
                  student.accessStatus === 'Revoked' ? 'success' : 'danger'
                }
                size="sm"
                onClick={() => toggleStudentAccess(student.id)}
              >
                {student.accessStatus === 'Revoked'
                  ? 'Grant Portal Access'
                  : 'Revoke Portal Access'}
              </Btn>
            </>
          )}
        </div>
      </div>

      {showPromote && (
        <div
          style={{
            background: 'rgba(234,179,8,0.06)',
            padding: 14,
            borderRadius: 'var(--radius-md)',
            margin: '14px 0',
            border: '1px solid var(--gold)',
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--gold)',
              marginBottom: 10,
            }}
          >
            Promote/Transfer Student
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Input
              label="Target Class"
              type="select"
              value={pClass}
              onChange={(e) => setPClass(e.target.value)}
              options={CLASS_OPTIONS.slice(1)}
            />
            <Input
              label="Target Section"
              type="select"
              value={pSection}
              onChange={(e) => setPSection(e.target.value)}
              options={SECTION_OPTIONS}
            />
            <Btn
              variant="success"
              size="sm"
              style={{ alignSelf: 'flex-end' }}
              onClick={handlePromoteSubmit}
            >
              Promote
            </Btn>
          </div>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          marginTop: 16,
        }}
      >
        {fields.map(
          ([k, v]) =>
            v && (
              <div
                key={k}
                style={{
                  background: 'var(--navy)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    marginBottom: 2,
                  }}
                >
                  {k}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                  }}
                >
                  {v}
                </div>
              </div>
            )
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 10,
          marginTop: 14,
        }}
      >
        {[
          [
            'Attendance',
            `${student.att}%`,
            student.att >= 80 ? '#4ade80' : '#f87171',
          ],
          ['Grade', student.grade, 'var(--gold)'],
          [
            'Fee Status',
            student.fee,
            student.fee === 'Paid' ? '#4ade80' : '#f87171',
          ],
        ].map(([k, v, c]) => (
          <div
            key={k}
            style={{
              background: 'rgba(234,179,8,0.06)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px',
              textAlign: 'center',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: c,
                fontFamily: 'Cinzel,serif',
              }}
            >
              {v}
            </div>
            <div
              style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}
            >
              {k}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--gold)',
            marginBottom: 10,
            borderBottom: '1px solid var(--border)',
            paddingBottom: 6,
          }}
        >
          💰 Student Fee Records
        </div>
        {studentFees.length === 0 ? (
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: 10,
            }}
          >
            No fee records found for this student.
          </div>
        ) : (
          <div
            style={{
              background: 'var(--navy)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
            }}
          >
            {studentFees.map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderBottom:
                    i < studentFees.length - 1
                      ? '1px solid var(--border)'
                      : 'none',
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{f.month}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    Date: {f.date} · Method: {f.method}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--gold)',
                    }}
                  >
                    PKR {f.amount.toLocaleString()}
                  </div>
                  <StatusBadge status={f.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'flex-end',
          marginTop: 20,
        }}
      >
        <Btn variant="outline" onClick={onClose}>
          Close
        </Btn>
      </div>
    </Modal>
  )
}

export default function Students() {
  const { students, deleteStudent, currentRole } = useDb()
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('All Classes')
  const [showAdd, setShowAdd] = useState(false)
  const [selected, setSelected] = useState(null)

  const filtered = students.filter((s) => {
    const q = search.toLowerCase()
    const matchQ =
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.father.toLowerCase().includes(q)
    const matchC = classFilter === 'All Classes' || s.class === classFilter
    return matchQ && matchC
  })

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete student ID ${id}?`)) {
      deleteStudent(id)
    }
  }

  const handleExportCSV = () => {
    let csvContent =
      'data:text/csv;charset=utf-8,ID,Name,Father Name,Class,Section,Gender,Attendance,Grade,Fee Status\n'
    filtered.forEach((s) => {
      csvContent += `${s.id},${s.name},${s.father},${s.class},${s.section},${s.gender},${s.att}%,${s.grade},${s.fee}\n`
    })
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `student_register_${classFilter.replace(' ', '_')}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const rows = filtered.map((s) => [
    <span
      style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        fontFamily: 'monospace',
      }}
    >
      {s.id}
    </span>,
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Avatar name={s.name} size={28} fontSize={10} />
      <div>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          {s.father}
        </div>
      </div>
    </div>,
    <span>
      {s.class}-{s.section}
    </span>,
    s.gender,
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <ProgressBar value={s.att} height={5} />
      <span
        style={{
          fontSize: 11,
          color: s.att < 75 ? '#f87171' : 'var(--gold)',
          minWidth: 30,
        }}
      >
        {s.att}%
      </span>
    </div>,
    <Badge
      label={s.grade}
      variant={
        s.grade.includes('A')
          ? 'success'
          : s.grade === 'B' || s.grade === 'B+'
            ? 'info'
            : 'warning'
      }
    />,
    <StatusBadge status={s.fee} />,
    <Dropdown
      label="⋮ Actions"
      buttonVariant="outline"
      items={[
        { label: 'View Profile', icon: '👁️', onClick: () => setSelected(s) },
        currentRole === 'Super Admin' || currentRole === 'Principal'
          ? {
              label: 'Delete Student',
              icon: '🗑️',
              onClick: () => handleDelete(s.id),
              variant: 'danger',
            }
          : null,
      ].filter(Boolean)}
    />,
  ])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
          gap: 16,
        }}
      >
        {[
          {
            label: 'Total Registered',
            val: students.length,
            color: 'var(--gold)',
          },
          {
            label: 'Male',
            val: students.filter((s) => s.gender === 'Male').length,
            color: '#60a5fa',
          },
          {
            label: 'Female',
            val: students.filter((s) => s.gender === 'Female').length,
            color: '#f472b6',
          },
          { label: 'Attendance Rate', val: '87.3%', color: '#4ade80' },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background:
                'linear-gradient(135deg, var(--navy-3),var(--navy-2))',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 20px',
            }}
          >
            <div
              style={{
                fontFamily: 'Cinzel,serif',
                fontSize: 26,
                fontWeight: 700,
                color: s.color,
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

      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, ID or father..."
        />
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          style={{
            background: 'var(--navy)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            padding: '9px 12px',
            fontSize: 13,
            fontFamily: "'DM Sans',sans-serif",
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {CLASS_OPTIONS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Btn size="sm" variant="outline" onClick={handleExportCSV}>
            📥 Export Excel/CSV
          </Btn>
          {(currentRole === 'Super Admin' || currentRole === 'Principal') && (
            <Btn size="sm" variant="primary" onClick={() => setShowAdd(true)}>
              + Enroll Student
            </Btn>
          )}
        </div>
      </div>

      {/* Table */}
      <Card title={`👨‍🎓 Student Register — ${filtered.length} students`}>
        <Table
          headers={[
            'ID',
            'Student',
            'Class',
            'Gender',
            'Attendance',
            'Grade',
            'Fee Status',
            'Actions',
          ]}
          rows={rows}
        />
      </Card>

      {showAdd && <AddStudentModal onClose={() => setShowAdd(false)} />}
      {selected && (
        <StudentDetailModal
          student={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
