import { useState } from 'react'
import { JitsiMeeting } from '@jitsi/react-sdk'
import {
  Card,
  Btn,
  StatusBadge,
  Table,
  Avatar,
  Badge,
  ProgressBar,
  TabRow,
  Sep,
  Input,
  Modal,
  Dropdown,
} from '../components/ui.jsx'
import { useDb } from '../context/DbContext.jsx'

// Generate attendance grid for a month
function genAttGrid() {
  const grid = {}
  for (let d = 1; d <= 30; d++) {
    const dow = (d + 2) % 7 // 0=Sun
    if (dow === 0 || dow === 6) {
      grid[d] = 'weekend'
      continue
    }
    const r = Math.random()
    grid[d] = r > 0.88 ? 'absent' : r > 0.8 ? 'late' : 'present'
  }
  return grid
}
const ATT_GRID = genAttGrid()
const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// ── ATTENDANCE ─────────────────────────────────────────────────────────────
export function Attendance() {
  const { students, recordAttendance, currentRole, currentUser, addLog } =
    useDb()
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
  const [selClass, setSelClass] = useState(CLASS_LIST[0])
  const [tab, setTab] = useState(0)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [attRecords, setAttRecords] = useState({})

  const statuses = {
    present: '#4ade80',
    absent: '#f87171',
    late: '#fbbf24',
    weekend: 'var(--border)',
  }

  // Filter students by selected class or ID if student
  const classStudents =
    currentRole === 'Student'
      ? students.filter((s) => s.id === currentUser?.id)
      : students.filter((s) => s.class === selClass)

  const handleSelectChange = (sid, status) => {
    setAttRecords((prev) => ({ ...prev, [sid]: status }))
  }

  const handleSaveAttendance = () => {
    const recordsToSave = {}
    classStudents.forEach((s) => {
      recordsToSave[s.id] = attRecords[s.id] || 'Present'
    })
    recordAttendance(date, selClass, recordsToSave)
    alert(`Attendance for ${selClass} on ${date} saved to local DBMS!`)
  }

  const handleNotifyParents = () => {
    const absentees = classStudents.filter(
      (s) => (attRecords[s.id] || 'Present') === 'Absent'
    )
    if (absentees.length === 0) {
      alert('No absent students marked today to notify.')
      return
    }
    absentees.forEach((s) => {
      addLog(
        'System',
        `WhatsApp/SMS Alert sent to parent of ${s.name}: "Dear Parent, your child was ABSENT today ${date} from PMS Dargai."`
      )
    })
    alert(
      `Automated WhatsApp & SMS alerts sent to ${absentees.length} parents regarding student absences.`
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {currentRole !== 'Student' && (
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
            }}
          >
            {CLASS_LIST.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        )}
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: 150 }}
        />
        <TabRow
          tabs={['Daily Sheet', 'Monthly Grid', 'Analytics']}
          active={tab}
          onChange={setTab}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {(currentRole === 'Super Admin' ||
            currentRole === 'Principal' ||
            currentRole === 'Teacher') && (
            <Btn size="sm" variant="primary" onClick={handleNotifyParents}>
              📱 Notify Parents (SMS/WA)
            </Btn>
          )}
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 14,
        }}
      >
        {[
          {
            label: 'Present',
            val:
              classStudents.length -
              Object.values(attRecords).filter((v) => v === 'Absent').length,
            color: '#4ade80',
          },
          {
            label: 'Absent',
            val: Object.values(attRecords).filter((v) => v === 'Absent').length,
            color: '#f87171',
          },
          {
            label: 'Late',
            val: Object.values(attRecords).filter((v) => v === 'Late').length,
            color: '#fbbf24',
          },
          { label: 'Attendance %', val: '92.5%', color: 'var(--gold)' },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: 'linear-gradient(135deg,var(--navy-3),var(--navy-2))',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
            }}
          >
            <div
              style={{
                fontFamily: 'Cinzel,serif',
                fontSize: 22,
                fontWeight: 700,
                color: s.color,
              }}
            >
              {s.val}
            </div>
            <div
              style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {tab === 0 && (
        <Card
          title={`📋 Daily Attendance — ${currentRole === 'Student' ? 'My Record' : selClass} · ${date}`}
          action={
            (currentRole === 'Super Admin' ||
              currentRole === 'Principal' ||
              currentRole === 'Teacher') && (
              <Btn size="sm" variant="primary" onClick={handleSaveAttendance}>
                💾 Save All Records
              </Btn>
            )
          }
        >
          <Table
            headers={['#', 'Student', 'Roll No', 'Status', 'Time In', 'Notes']}
            rows={classStudents.map((s, i) => [
              <span style={{ color: 'var(--text-muted)' }}>{i + 1}</span>,
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar name={s.name} size={26} fontSize={9} />
                <span style={{ fontWeight: 600 }}>{s.name}</span>
              </div>,
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 11,
                  color: 'var(--text-muted)',
                }}
              >
                {s.id}
              </span>,
              <select
                disabled={currentRole === 'Student'}
                value={attRecords[s.id] || 'Present'}
                onChange={(e) => handleSelectChange(s.id, e.target.value)}
                style={{
                  background: 'var(--navy)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  color: 'var(--text-primary)',
                  padding: '4px 8px',
                  fontSize: 11,
                  fontFamily: "'DM Sans',sans-serif",
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {['Present', 'Absent', 'Late', 'Leave'].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>,
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                08:0{i} AM
              </span>,
              <input
                disabled={currentRole === 'Student'}
                placeholder="Note..."
                style={{
                  background: 'var(--navy)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  color: 'var(--text-primary)',
                  padding: '4px 8px',
                  fontSize: 11,
                  fontFamily: "'DM Sans',sans-serif",
                  outline: 'none',
                  width: 120,
                }}
              />,
            ])}
          />
        </Card>
      )}

      {tab === 1 && (
        <Card title={`📅 Monthly Grid — June 2026 (${selClass})`}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7,1fr)',
              gap: 4,
              marginBottom: 8,
            }}
          >
            {DOW.map((d) => (
              <div
                key={d}
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                  padding: '4px 0',
                }}
              >
                {d}
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7,1fr)',
              gap: 4,
            }}
          >
            {[...Array(4)].map((_, i) => (
              <div key={`e${i}`} />
            ))}
            {Object.entries(ATT_GRID).map(([day, status]) => (
              <div
                key={day}
                style={{
                  background:
                    status === 'weekend'
                      ? 'rgba(255,255,255,0.03)'
                      : `${statuses[status]}18`,
                  border: `1px solid ${status === 'weekend' ? 'var(--border)' : statuses[status] + '44'}`,
                  borderRadius: 6,
                  padding: '6px 2px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: statuses[status],
                  }}
                >
                  {day}
                </div>
                {status !== 'weekend' && (
                  <div
                    style={{
                      fontSize: 9,
                      color: 'var(--text-muted)',
                      textTransform: 'capitalize',
                      marginTop: 1,
                    }}
                  >
                    {status.slice(0, 3)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 2 && (
        <Card title="📊 Attendance Analytics">
          {classStudents.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <Avatar name={s.name} size={28} fontSize={10} />
              <div style={{ width: 160, fontSize: 12, fontWeight: 500 }}>
                {s.name}
              </div>
              <ProgressBar
                value={s.att}
                color={s.att < 75 ? '#f87171' : 'var(--gold)'}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: s.att < 75 ? '#f87171' : 'var(--gold)',
                  minWidth: 36,
                }}
              >
                {s.att}%
              </span>
              {s.att < 75 && <Badge label="Low Attendance" variant="danger" />}
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}

// ── EXAMS & RESULTS ────────────────────────────────────────────────────────
export function Exams() {
  const {
    examResults,
    saveExamMarks,
    students,
    currentRole,
    examConfig,
    setExamConfig,
    currentUser,
    announcedResults,
    announceClassResults,
  } = useDb()
  const [tab, setTab] = useState(0)
  const [showAddMarks, setShowAddMarks] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
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
  const [selClass, setSelClass] = useState(CLASS_LIST[7])
  const [printModal, setPrintModal] = useState({
    show: false,
    action: null,
    student: null,
  })
  const [printConfig, setPrintConfig] = useState({
    topN: 3,
    termTitle: '',
    date: new Date().toISOString().split('T')[0],
  })
  const openPrintModal = (action, student = null) => {
    setPrintConfig({ ...printConfig, termTitle: examTypes[tab] })
    setPrintModal({ show: true, action, student })
  }

  // Marks Form States
  const [inputMarks, setInputMarks] = useState({})

  const examTypes = ['Mid-Term', 'Final Exam', 'Monthly Test', 'Weekly Quiz']
  const currentConfig = examConfig[examTypes[tab]] || examConfig['Mid-Term']
  const gradeColor = (g) => {
    if (!g) return '#f87171'
    return g.includes('A')
      ? '#4ade80'
      : g.includes('B')
        ? '#60a5fa'
        : g === 'C'
          ? '#fbbf24'
          : '#f87171'
  }

  // Filter students for marks entry
  const targetStudents = students.filter((s) => s.class === selClass)
  const studentResults =
    currentRole === 'Student'
      ? [...examResults].filter(
          (r) =>
            r.id === currentUser?.id &&
            announcedResults.includes(`${r.class}_${r.term || examTypes[0]}`)
        )
      : [...examResults]

  const calculateGrade = (pct) => {
    if (pct >= 90) return 'A+'
    if (pct >= 80) return 'A'
    if (pct >= 70) return 'B+'
    if (pct >= 60) return 'B'
    if (pct >= 50) return 'C'
    if (pct >= 33) return 'D'
    return 'F'
  }

  const handleOpenAddMarks = () => {
    const initialMarks = {}
    const currentTermResults = studentResults.filter(
      (r) => r.class === selClass && (r.term || 'Mid-Term') === examTypes[tab]
    )

    targetStudents.forEach((s) => {
      const existingRes = currentTermResults.find((r) => r.id === s.id)
      if (existingRes && existingRes.subjects) {
        existingRes.subjects.forEach((subj) => {
          initialMarks[`${s.id}_${subj.name}`] = subj.obtained
        })
      } else if (existingRes) {
        // Legacy support
        initialMarks[`${s.id}_Mathematics`] = existingRes.math || 0
        initialMarks[`${s.id}_English`] = existingRes.eng || 0
        initialMarks[`${s.id}_Urdu`] = existingRes.urdu || 0
        initialMarks[`${s.id}_Science`] = existingRes.sci || 0
        initialMarks[`${s.id}_Islamic Studies`] = existingRes.isl || 0
      }
    })
    setInputMarks(initialMarks)
    setShowAddMarks(true)
  }

  const handleSaveMarks = () => {
    const marksData = targetStudents.map((s) => {
      const studentId = s.id
      let total = 0
      let max = 0

      const subjectsData = currentConfig.subjects.map((subj) => {
        const obtained = Number(inputMarks[`${studentId}_${subj.name}`] || 0)
        total += obtained
        max += Number(subj.max)
        return { name: subj.name, obtained, max: Number(subj.max) }
      })

      const pct = max > 0 ? Math.round((total / max) * 100) : 0
      const grade = calculateGrade(pct)

      return {
        studentId,
        name: s.name,
        class: selClass,
        subjects: subjectsData,
        total,
        max,
        grade,
        term: examTypes[tab],
      }
    })

    saveExamMarks(marksData)
    setShowAddMarks(false)
    alert('Exam marks entered and student rankings recalculated successfully!')
  }

  const handlePrintReport = (r, customTerm, customDate) => {
    const printWindow = window.open('', '_blank')
    const date = customDate || new Date().toLocaleDateString('en-GB')
    const termTitle = customTerm || examTypes[tab]

    // Backwards compatibility for old records
    const subjectsToPrint =
      r.subjects && r.subjects.length > 0
        ? r.subjects
        : [
            { name: 'Mathematics', obtained: r.math, max: 100 },
            { name: 'English', obtained: r.eng, max: 100 },
            { name: 'Urdu', obtained: r.urdu, max: 100 },
            { name: 'Science', obtained: r.sci, max: 100 },
            { name: 'Islamic Studies', obtained: r.isl, max: 100 },
          ]

    const rowsHtml = subjectsToPrint
      .map(
        (s) => `
      <tr>
        <td style="font-weight: 700; padding: 12px 16px;">${s.name}</td>
        <td class="marks-col" style="color: #64748b;">${s.max}</td>
        <td class="marks-col" style="color: #0f172a; font-weight: 800;">${s.obtained}</td>
      </tr>
    `
      )
      .join('')

    printWindow.document.write(`
      <html>
        <head>
          <title>Academic Report Card - ${r.student}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Cinzel:wght@600;700;900&family=Mrs+Saint+Delafield&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; margin: 0; background: #e2e8f0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .report-wrapper { max-width: 850px; margin: 0 auto; background: #ffffff; padding: 12px; position: relative; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); border: 2px solid #cbd5e1; }
            .outer-border { border: 6px double #EAB308; padding: 6px; }
            .inner-border { border: 1px solid #0f172a; padding: 40px; position: relative; }
            
            .watermark-container { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; pointer-events: none; z-index: 0; }
            .watermark { opacity: 0.04; width: 60%; filter: grayscale(100%); }
            
            .report-body { position: relative; z-index: 1; }
            
            .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #0f172a; padding-bottom: 25px; margin-bottom: 35px; }
            /* LOGO FIX: Removed border-radius 50% and borders so the logo is completely uncropped and displays natively */
            .logo-container { width: 140px; height: 110px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
            .logo { width: 100%; height: 100%; object-fit: contain; background-color: transparent; }
            .school-info { text-align: center; flex-grow: 1; padding: 0 10px; }
            .school-info h1 { font-family: 'Cinzel', serif; font-size: 36px; font-weight: 900; color: #0B162C; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 2px; }
            .school-info p { margin: 0; font-size: 14px; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
            .document-type { background: #0f172a; color: #EAB308; display: inline-block; padding: 6px 20px; font-family: 'Cinzel', serif; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-top: 15px; border-radius: 2px; }
            
            .student-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 25px; border-radius: 4px; border: 2px solid #e2e8f0; margin-bottom: 35px; background: #f8fafc; }
            .student-field { display: flex; flex-direction: column; gap: 6px; }
            .field-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 800; letter-spacing: 1px; }
            .field-value { font-size: 16px; color: #0B162C; font-weight: 800; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px; }
            
            .content-row { display: flex; gap: 30px; align-items: flex-start; margin-bottom: 40px; }
            .table-container { flex: 1; }
            table { width: 100%; border-collapse: collapse; border: 2px solid #0f172a; margin-bottom: 0; }
            th { background: #0f172a; color: #EAB308; text-align: left; padding: 16px; font-family: 'Cinzel', serif; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800; border: 1px solid #0f172a; }
            td { padding: 12px 16px; font-size: 14px; color: #1e293b; border: 1px solid #cbd5e1; }
            tr:nth-child(even) td { background: #f8fafc; }
            .marks-col { text-align: center; font-family: 'Inter', monospace; font-size: 16px; font-weight: 800; }
            
            .summary-section { display: flex; justify-content: flex-end; margin-bottom: 0; }
            .summary-box { background: #f8fafc; color: #0f172a; padding: 25px; width: 320px; border: 2px solid #0f172a; border-radius: 4px; position: relative; }
            .summary-box::before { content: ''; position: absolute; top: -6px; left: -6px; right: -6px; bottom: -6px; border: 1px solid #EAB308; pointer-events: none; }
            .summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; color: #475569; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
            .summary-val { color: #0f172a; font-weight: 900; font-size: 15px; }
            .final-grade { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 20px; border-top: 2px solid #e2e8f0; }
            .grade-label { font-size: 16px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 1px; }
            .grade-val { font-family: 'Cinzel', serif; font-size: 42px; font-weight: 900; color: #EAB308; text-shadow: 1px 1px 0 #0f172a; }
            
            .signatures { display: flex; justify-content: space-between; padding: 0 40px; margin-top: 60px; align-items: flex-end; }
            .sig-block { text-align: center; width: 220px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; position: relative; }
            .auto-sig { font-family: 'Mrs Saint Delafield', cursive; font-size: 58px; color: #0B162C; line-height: 0.4; margin-bottom: -15px; position: relative; z-index: 10; transform: rotate(-3deg); display: inline-block; }
            .sig-line { border-bottom: 2px solid #0f172a; margin-top: 15px; margin-bottom: 8px; height: 1px; width: 100%; }
            .sig-title { font-size: 12px; text-transform: uppercase; color: #0f172a; font-weight: 800; letter-spacing: 1.5px; }
            
            .seal { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); width: 80px; height: 80px; border: 3px solid #EAB308; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Cinzel', serif; font-size: 10px; font-weight: 900; color: #EAB308; text-transform: uppercase; text-align: center; line-height: 1.2; opacity: 0.6; }
            
            .footer { text-align: center; margin-top: 40px; font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
            
            @media print { 
              @page { size: A4 portrait; margin: 0; }
              html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; background: #ffffff; overflow: hidden; }
              .report-wrapper { box-shadow: none; border: none; padding: 10mm; max-width: none; width: 100%; height: 100%; box-sizing: border-box; page-break-inside: avoid; }
              .outer-border { border-color: #000; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; }
              .inner-border { border-color: #000; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; flex-grow: 1; padding: 30px 40px; }
              .report-body { flex-grow: 1; display: flex; flex-direction: column; }
              
              /* Adjust margins & paddings for A4 portrait */
              .header { padding-bottom: 20px; margin-bottom: 25px; border-bottom: 2px solid #000; }
              .logo-container { width: 120px; height: 95px; }
              .school-info h1 { font-size: 32px; margin: 0 0 6px 0; }
              .school-info p { font-size: 13px; }
              .document-type { background: #fff; color: #000; border: 2px solid #000; margin-top: 10px; padding: 6px 20px; font-size: 12px; }
              
              .student-grid { padding: 15px 25px; margin-bottom: 25px; gap: 15px; }
              .field-value { font-size: 15px; }
              
              .content-row { display: flex; flex-direction: row; gap: 20px; margin-bottom: 20px; align-items: flex-start; }
              .table-container { flex: 1; }
              table { margin-bottom: 0; }
              th { background: #e2e8f0; color: #000; border-color: #000; padding: 8px 10px; font-size: 11px; }
              td { padding: 6px 10px; font-size: 12px; }
              
              .summary-section { margin-bottom: 0; display: flex; justify-content: flex-end; width: auto; }
              .summary-box { background: #fff; border-color: #000; padding: 15px 20px; width: 220px; }
              .summary-box::before { border-color: #000; }
              .summary-row { margin-bottom: 8px; font-size: 11px; }
              .final-grade { margin-top: 15px; padding-top: 15px; }
              .grade-label { font-size: 13px; }
              .grade-val { color: #000; text-shadow: none; font-size: 32px; }
              
              .signatures { margin-top: auto; padding-bottom: 10px; padding-top: 10px; }
              .sig-block { width: 160px; }
              .auto-sig { color: #000; font-size: 40px; margin-bottom: -10px; }
              .sig-line { margin-top: 10px; margin-bottom: 4px; }
              .sig-title { font-size: 10px; }
              
              .seal { border-color: #000; color: #000; bottom: 30px; width: 60px; height: 60px; font-size: 8px; border-width: 2px; }
              .footer { margin-top: 10px; font-size: 9px; }
              .watermark { opacity: 0.04; width: 35%; }
            }
          </style>
        </head>
        <body>
          <div class="report-wrapper">
            <div class="outer-border">
              <div class="inner-border">
                <div class="watermark-container">
                  <img src="${window.location.origin}/logo_print.png" class="watermark" onerror="this.style.display='none'" />
                </div>
                
                <div class="report-body">
                  <div class="header">
                    <div class="logo-container">
                      <img src="${window.location.origin}/logo_print.png" alt="School Logo" class="logo" onerror="this.style.display='none'" />
                    </div>
                    <div class="school-info">
                      <h1>Professor Model School</h1>
                      <p>Manga Dargai, Charsadda, KPK, Pakistan</p>
                      <div class="document-type">Official Academic Transcript</div>
                    </div>
                    <div style="width: 140px;"></div> <!-- Spacer for flex balance -->
                  </div>
                  
                  <div class="student-grid">
                    <div class="student-field"><span class="field-label">Student Name</span><span class="field-value">${r.student}</span></div>
                    <div class="student-field" style="text-align: right;"><span class="field-label">Student ID / Roll No</span><span class="field-value" style="font-family: monospace;">${r.id || 'PMS-' + Math.floor(Math.random() * 9000 + 1000)}</span></div>
                    <div class="student-field"><span class="field-label">Class & Section</span><span class="field-value">${r.class}</span></div>
                    <div class="student-field" style="text-align: right;"><span class="field-label">Examination Term</span><span class="field-value">${termTitle} - ${date}</span></div>
                  </div>
                  
                  <div class="content-row">
                    <div class="table-container">
                      <table>
                        <thead>
                          <tr><th>Subject Name</th><th style="text-align: center; width: 140px;">Max Marks</th><th style="text-align: center; width: 140px;">Marks Obtained</th></tr>
                        </thead>
                        <tbody>
                          ${rowsHtml}
                        </tbody>
                      </table>
                    </div>
                    
                    <div class="summary-section">
                      <div class="summary-box">
                        <div class="summary-row"><span>Total Marks</span><span class="summary-val">${r.max}</span></div>
                        <div class="summary-row"><span>Marks Obtained</span><span class="summary-val">${r.total}</span></div>
                        <div class="summary-row"><span>Percentage</span><span class="summary-val">${Math.round((r.total / r.max) * 100)}%</span></div>
                        <div class="summary-row"><span>Class Rank</span><span class="summary-val" style="font-family: 'Cinzel', serif;">Position #${r.pos || 1}</span></div>
                        <div class="final-grade"><span class="grade-label">Final Grade</span><span class="grade-val">${r.grade}</span></div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="seal">
                    <img src="${window.location.origin}/logo_print.png" alt="Seal" style="width: 90%; height: 90%; object-fit: contain; border-radius: 50%; mix-blend-mode: multiply;" />
                  </div>
                  
                  <div class="signatures">
                    <div class="sig-block">
                      <div style="height: 40px;"></div>
                      <div class="sig-line"></div>
                      <div class="sig-title">Class Teacher</div>
                    </div>
                    <div class="sig-block">
                      <div class="auto-sig">Prof. Daud Khan</div>
                      <div class="sig-line"></div>
                      <div class="sig-title">Principal</div>
                    </div>
                  </div>
                  
                  <div class="footer">This document is system generated and does not require a physical signature.</div>
                </div>
              </div>
            </div>
          </div>
          <script>setTimeout(() => window.print(), 800);</script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const handlePrintMasterSheet = (customTerm, customDate) => {
    const printWindow = window.open('', '_blank')
    const date = customDate || new Date().toLocaleDateString('en-GB')
    const termTitle = customTerm || examTypes[tab]
    const classResults = studentResults
      .filter(
        (r) => r.class === selClass && (r.term || 'Mid-Term') === examTypes[tab]
      )
      .sort((a, b) => b.total - a.total)

    if (classResults.length === 0) {
      alert('No results found for ' + selClass)
      return
    }

    const sampleSubjects =
      classResults[0].subjects && classResults[0].subjects.length > 0
        ? classResults[0].subjects.map((s) => s.name)
        : ['Mathematics', 'English', 'Urdu', 'Science', 'Islamic Studies']

    const rowsHtml = classResults
      .map((r, i) => {
        const subjectsToPrint =
          r.subjects && r.subjects.length > 0
            ? r.subjects
            : [
                { name: 'Mathematics', obtained: r.math },
                { name: 'English', obtained: r.eng },
                { name: 'Urdu', obtained: r.urdu },
                { name: 'Science', obtained: r.sci },
                { name: 'Islamic Studies', obtained: r.isl },
              ]
        const subjHtml = subjectsToPrint
          .map((s) => `<td style="text-align:center;">${s.obtained}</td>`)
          .join('')

        return `
        <tr>
          <td style="text-align:center; font-weight:700;">${i + 1}</td>
          <td style="font-family:monospace; font-size:12px;">${r.id}</td>
          <td style="font-weight:bold; color:#0f172a;">${r.student}</td>
          ${subjHtml}
          <td style="text-align:center; font-weight:bold; background:#f8fafc;">${r.total} / ${r.max}</td>
          <td style="text-align:center; font-weight:bold;">${Math.round((r.total / r.max) * 100)}%</td>
          <td style="text-align:center; font-weight:bold; color:#EAB308;">${r.pos}</td>
        </tr>
      `
      })
      .join('')

    printWindow.document.write(`
      <html>
        <head>
          <title>Master Result Sheet - ${selClass}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Cinzel:wght@700;900&family=Mrs+Saint+Delafield&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 20px; margin: 0; background: #ffffff; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-size: 12px; }
            .header { display: flex; align-items: center; justify-content: center; gap: 30px; border-bottom: 3px solid #0f172a; padding-bottom: 25px; margin-bottom: 25px; text-align: center; }
            .logo-container { width: 100px; height: 100px; }
            .logo { width: 100%; height: 100%; object-fit: contain; }
            .school-info h1 { font-family: 'Cinzel', serif; font-size: 32px; font-weight: 900; color: #0B162C; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1px; }
            .school-info p { margin: 0; font-size: 13px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; }
            .title-box { background: #0f172a; color: #fff; padding: 12px 20px; font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 25px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; border: 2px solid #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; border: 2px solid #0f172a; }
            th { background: #f1f5f9; color: #0f172a; text-align: left; padding: 12px 10px; font-size: 11px; text-transform: uppercase; font-weight: 800; border: 1px solid #cbd5e1; }
            td { padding: 10px; font-size: 13px; color: #1e293b; border: 1px solid #cbd5e1; }
            tr:nth-child(even) td { background: #fafafa; }
            
            .signatures { display: flex; justify-content: space-between; padding: 0 60px; margin-top: 60px; align-items: flex-end; }
            .sig-block { text-align: center; width: 200px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; position: relative; }
            .auto-sig { font-family: 'Mrs Saint Delafield', cursive; font-size: 50px; color: #0B162C; line-height: 0.4; margin-bottom: -15px; position: relative; z-index: 10; transform: rotate(-3deg); display: inline-block; }
            .sig-line { border-bottom: 2px solid #0f172a; margin-top: 15px; margin-bottom: 8px; height: 1px; width: 100%; }
            .sig-title { font-size: 12px; text-transform: uppercase; font-weight: 800; color: #0f172a; letter-spacing: 1px; }
            
            @media print {
              body { color: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; padding: 0; }
              .title-box { background: #fff !important; color: #000 !important; border: 2px solid #000; }
              .title-box span { color: #000 !important; }
              th { background: #e2e8f0 !important; color: #000 !important; border: 1px solid #000 !important; }
              td { border: 1px solid #000 !important; color: #000 !important; }
              table { border: 2px solid #000 !important; }
              .header { border-bottom: 3px solid #000 !important; }
              .auto-sig { color: #000; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-container">
              <img src="${window.location.origin}/logo_print.png" class="logo" onerror="this.style.display='none'" />
            </div>
            <div class="school-info">
              <h1>Professor Model School</h1>
              <p>Master Result Sheet — ${termTitle}</p>
            </div>
            <div style="width: 100px;"></div>
          </div>
          <div class="title-box">
            <span>Class: ${selClass}</span>
            <span style="color:#EAB308;">Date: ${date}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th style="text-align:center; width:40px;">#</th>
                <th style="width:100px;">Roll No</th>
                <th>Student Name</th>
                ${sampleSubjects.map((s) => `<th style="text-align:center;">${s.substring(0, 8)}</th>`).join('')}
                <th style="text-align:center;">Total</th>
                <th style="text-align:center;">%</th>
                <th style="text-align:center;">Pos</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <div class="signatures">
            <div class="sig-block"><div style="height: 30px;"></div><div class="sig-line"></div><div class="sig-title">Class Teacher</div></div>
            <div class="sig-block"><div style="height: 30px;"></div><div class="sig-line"></div><div class="sig-title">Examination Controller</div></div>
            <div class="sig-block"><div class="auto-sig">Prof. Daud Khan</div><div class="sig-line"></div><div class="sig-title">Principal</div></div>
          </div>
          <script>setTimeout(() => window.print(), 800);</script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const handlePrintPositions = (topN, termTitle, customDate) => {
    const printWindow = window.open('', '_blank')
    const date = customDate || new Date().toLocaleDateString('en-GB')
    const classResults = studentResults
      .filter(
        (r) => r.class === selClass && (r.term || 'Mid-Term') === examTypes[tab]
      )
      .sort((a, b) => b.total - a.total)
      .slice(0, topN)

    if (classResults.length === 0) {
      alert('No results found for ' + selClass)
      return
    }

    const medals = ['🥇', '🥈', '🥉', '🎖️', '🎖️']

    const rowsHtml = classResults
      .map(
        (r, i) => `
      <div style="display: flex; align-items: center; justify-content: space-between; background: #ffffff; border: 2px solid #0f172a; border-radius: 8px; padding: 25px; margin-bottom: 20px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; gap: 25px;">
          <div style="font-size: 50px;">${medals[i] || '🎖️'}</div>
          <div>
            <div style="font-family: 'Cinzel', serif; font-size: 26px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 1px;">${r.student}</div>
            <div style="font-size: 14px; color: #64748b; font-weight: 800; margin-top: 4px; text-transform: uppercase;">Roll No: <span style="font-family: monospace; color: #0f172a;">${r.id}</span> &nbsp;|&nbsp; Rank: <span style="color: #EAB308;">${r.pos}</span></div>
          </div>
        </div>
        <div style="text-align: right; background: #f8fafc; padding: 15px 25px; border-radius: 6px; border: 1px solid #e2e8f0;">
          <div style="font-size: 32px; font-weight: 900; color: #EAB308;">${r.total} <span style="font-size: 18px; color:#64748b;">/ ${r.max}</span></div>
          <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 4px;">${Math.round((r.total / r.max) * 100)}%</div>
        </div>
      </div>
    `
      )
      .join('')

    printWindow.document.write(`
      <html>
        <head>
          <title>Position Holders - ${termTitle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Cinzel:wght@700;900&family=Mrs+Saint+Delafield&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; margin: 0; background: #e2e8f0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .wrapper { max-width: 850px; margin: 0 auto; border: 8px double #EAB308; padding: 50px; border-radius: 4px; position: relative; background: #ffffff; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
            
            .watermark-container { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; pointer-events: none; z-index: 0; }
            .watermark { opacity: 0.03; width: 60%; filter: grayscale(100%); }
            
            .content-layer { position: relative; z-index: 1; }
            
            .header { text-align: center; margin-bottom: 50px; border-bottom: 3px solid #0f172a; padding-bottom: 30px; }
            .logo-container { width: 140px; height: 120px; margin: 0 auto 20px auto; }
            .logo { width: 100%; height: 100%; object-fit: contain; }
            h1 { font-family: 'Cinzel', serif; font-size: 42px; font-weight: 900; color: #0B162C; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 3px; }
            h2 { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 800; color: #EAB308; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 4px; }
            h3 { font-size: 16px; color: #0f172a; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 2px; background: #e2e8f0; display: inline-block; padding: 8px 25px; border-radius: 4px; }
            
            .signatures { display: flex; justify-content: space-around; margin-top: 80px; padding-top: 30px; align-items: flex-end; }
            .sig-block { text-align: center; width: 250px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; position: relative; }
            .auto-sig { font-family: 'Mrs Saint Delafield', cursive; font-size: 64px; color: #0B162C; line-height: 0.4; margin-bottom: -15px; position: relative; z-index: 10; transform: rotate(-3deg); display: inline-block; }
            .sig-line { border-bottom: 2px solid #0f172a; margin-top: 15px; margin-bottom: 8px; height: 1px; width: 100%; }
            .sig-title { font-size: 14px; text-transform: uppercase; font-weight: 900; color: #0f172a; letter-spacing: 2px; }
            
            @media print {
              body { background: #ffffff; padding: 0; color: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .wrapper { border: 8px double #000 !important; box-shadow: none; }
              h2, span, div { color: #000 !important; }
              .auto-sig { color: #000; }
              .medal-box { filter: grayscale(100%); }
              h3 { background: #fff !important; border: 2px solid #000; }
              .watermark { opacity: 0.03; }
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="watermark-container">
              <img src="${window.location.origin}/logo_print.png" class="watermark" onerror="this.style.display='none'" />
            </div>
            <div class="content-layer">
              <div class="header">
                <div class="logo-container">
                  <img src="${window.location.origin}/logo_print.png" class="logo" onerror="this.style.display='none'" />
                </div>
                <h1>Professor Model School</h1>
                <h2>Outstanding Academic Achievement</h2>
                <h3>Top ${topN} Position Holders — ${termTitle} (${selClass})</h3>
              </div>
              
              ${rowsHtml}
              
              <div class="signatures">
                <div class="sig-block">
                  <div class="auto-sig">Prof. Daud Khan</div>
                  <div class="sig-line"></div>
                  <div class="sig-title">Principal</div>
                </div>
              </div>
            </div>
          </div>
          <script>setTimeout(() => window.print(), 800);</script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  // Determine headers for table
  const subjectsConfig = currentConfig?.subjects || []
  const dynamicHeaders = [
    '#',
    'Student',
    'Class',
    ...subjectsConfig.map((s) => (s.name || '').substring(0, 6)),
    'Total',
    '%',
    'Grade',
    'Position',
    'Report Card',
  ]

  // 1. Current students in the selected class
  const currentStudents = currentRole === 'Student'
    ? students.filter((s) => s.id === currentUser?.id)
    : students.filter((s) => s.class === selClass)

  // 2. Historical results for this class and term
  const historicalResults = studentResults.filter(
    (res) => res.class === selClass && (res.term || 'Mid-Term') === examTypes[tab]
  )

  const rowsMap = new Map()

  historicalResults.forEach(r => {
    if (currentRole === 'Student' && r.id !== currentUser?.id) return;
    if (currentRole === 'Student' && !announcedResults.includes(`${r.class}_${r.term || 'Mid-Term'}`)) return;
    rowsMap.set(r.id, { ...r, _hasResult: true })
  })

  currentStudents.forEach(s => {
    if (!rowsMap.has(s.id)) {
      rowsMap.set(s.id, {
        id: s.id,
        student: s.name,
        class: s.class,
        _hasResult: false,
        total: 0,
        max: 0,
        pos: '-',
        grade: '-',
      })
    }
  })

  const rowsData = Array.from(rowsMap.values()).sort((a, b) => {
    if (a._hasResult && !b._hasResult) return -1
    if (!a._hasResult && b._hasResult) return 1
    return b.total - a.total
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TabRow tabs={examTypes} active={tab} onChange={setTab} />
        {(currentRole === 'Super Admin' ||
          currentRole === 'Principal' ||
          currentRole === 'Teacher') && (
          <Btn variant="outline" onClick={() => setShowConfig(true)}>
            ⚙️ Configure Exam Subjects
          </Btn>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 14,
        }}
      >
        {[
          { l: 'Class Average', v: '80.4%' },
          { l: 'Pass Rate', v: '95.1%' },
          { l: 'Top Score', v: '95.8%' },
          { l: 'Students Evaluated', v: studentResults.length },
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
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--gold)',
              }}
            >
              {s.v}
            </div>
            <div
              style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}
            >
              {s.l}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 10,
          background: 'var(--navy)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          alignItems: 'center',
        }}
      >
        <Input
          type="select"
          options={CLASS_LIST}
          value={selClass}
          onChange={(e) => setSelClass(e.target.value)}
        />
        <Btn variant="primary" onClick={() => openPrintModal('master')}>
          🖨️ Master Sheet
        </Btn>
        <Btn variant="outline" onClick={() => openPrintModal('positions')}>
          🏆 Position Holders
        </Btn>
      </div>

      <Card
        title={`📝 ${examTypes[tab]} — Result Sheet (${selClass})`}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            {(currentRole === 'Super Admin' || currentRole === 'Principal') && (
              <Btn
                size="sm"
                variant="outline"
                onClick={() => {
                  announceClassResults(selClass, examTypes[tab])
                  alert(
                    `Results for ${selClass} - ${examTypes[tab]} have been announced and published to the Student Portal!`
                  )
                }}
              >
                📢 Publish Results
              </Btn>
            )}
            {(currentRole === 'Super Admin' ||
              currentRole === 'Principal' ||
              currentRole === 'Teacher') && (
              <Btn size="sm" variant="success" onClick={handleOpenAddMarks}>
                + Enter Marks for {selClass}
              </Btn>
            )}
          </div>
        }
      >
        <Table
          headers={dynamicHeaders}
          rows={rowsData.map((r, i) => {
            const rowArr = [
              <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                {i + 1}
              </span>,
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar name={r.student} size={26} fontSize={9} />
                <span style={{ fontWeight: 600, fontSize: 12 }}>
                  {r.student}
                </span>
              </div>,
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {r.class}
              </span>,
            ]

            if (r._hasResult) {
              if (r.subjects && r.subjects.length > 0) {
                subjectsConfig.forEach((cfg) => {
                  const fnd = r.subjects.find((rs) => rs.name === cfg.name)
                  rowArr.push(fnd ? fnd.obtained : '-')
                })
              } else {
                // Legacy support
                subjectsConfig.forEach((cfg) => {
                  if (cfg.name === 'Mathematics') rowArr.push(r.math)
                  else if (cfg.name === 'English') rowArr.push(r.eng)
                  else if (cfg.name === 'Urdu') rowArr.push(r.urdu)
                  else if (cfg.name === 'Science') rowArr.push(r.sci)
                  else if (cfg.name === 'Islamic Studies') rowArr.push(r.isl)
                  else rowArr.push('-')
                })
              }

              rowArr.push(
                <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
                  {r.total}/{r.max}
                </span>,
                <span style={{ fontWeight: 700 }}>
                  {Math.round((r.total / r.max) * 100)}%
                </span>,
                <span
                  style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    background: `${gradeColor(r.grade)}18`,
                    color: gradeColor(r.grade),
                    border: `1px solid ${gradeColor(r.grade)}44`,
                  }}
                >
                  {r.grade}
                </span>,
                <span
                  style={{
                    color: r.pos < 4 ? 'var(--gold)' : 'var(--text-muted)',
                    fontWeight: r.pos < 4 ? 700 : 400,
                  }}
                >
                  #{r.pos || i + 1}
                </span>,
                <Dropdown
                  label="⋮ Actions"
                  buttonVariant="outline"
                  items={[
                    {
                      label: 'Report Card',
                      icon: '🖨️',
                      onClick: () => openPrintModal('report', r),
                    },
                  ]}
                />
              )
            } else {
              subjectsConfig.forEach(() => rowArr.push('-'))
              rowArr.push('-', '-', '-', '-', '-')
            }

            return rowArr
          })}
        />
      </Card>

      {showConfig && (
        <Modal
          title="⚙️ Configure Exam Subjects & Marks"
          onClose={() => setShowConfig(false)}
          width={600}
        >
          <div
            style={{
              marginBottom: 16,
              fontSize: 12,
              color: 'var(--text-muted)',
            }}
          >
            Define the subjects and maximum marks for the current exam session.
            These will be used for all newly entered marks.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {currentConfig.subjects.map((subj, idx) => (
              <div
                key={idx}
                style={{ display: 'flex', gap: 10, alignItems: 'center' }}
              >
                <Input
                  value={subj.name}
                  onChange={(e) => {
                    const newSubjs = [...currentConfig.subjects]
                    newSubjs[idx].name = e.target.value
                    setExamConfig({
                      ...examConfig,
                      [examTypes[tab]]: { subjects: newSubjs },
                    })
                  }}
                  placeholder="Subject Name"
                />
                <Input
                  type="number"
                  value={subj.max}
                  onChange={(e) => {
                    const newSubjs = [...currentConfig.subjects]
                    newSubjs[idx].max = Number(e.target.value)
                    setExamConfig({
                      ...examConfig,
                      [examTypes[tab]]: { subjects: newSubjs },
                    })
                  }}
                  placeholder="Max Marks"
                  style={{ width: 100 }}
                />
                <Btn
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    const newSubjs = currentConfig.subjects.filter(
                      (_, i) => i !== idx
                    )
                    setExamConfig({
                      ...examConfig,
                      [examTypes[tab]]: { subjects: newSubjs },
                    })
                  }}
                >
                  X
                </Btn>
              </div>
            ))}
            <Btn
              variant="outline"
              onClick={() => {
                setExamConfig({
                  ...examConfig,
                  [examTypes[tab]]: {
                    subjects: [
                      ...currentConfig.subjects,
                      { name: 'New Subject', max: 100 },
                    ],
                  },
                })
              }}
            >
              + Add Subject
            </Btn>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
              marginTop: 20,
            }}
          >
            <Btn variant="primary" onClick={() => setShowConfig(false)}>
              💾 Save Configuration
            </Btn>
          </div>
        </Modal>
      )}

      {showAddMarks && (
        <Modal
          title={`📝 Enter Student Marks - ${selClass}`}
          onClose={() => setShowAddMarks(false)}
          width={800}
        >
          <div
            style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: 6 }}
          >
            {targetStudents.length === 0 ? (
              <div
                style={{
                  color: 'var(--text-secondary)',
                  padding: 20,
                  textAlign: 'center',
                }}
              >
                No active student enrolled in this class.
              </div>
            ) : (
              targetStudents.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div
                    style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}
                  >
                    {s.name} ({s.id})
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: 8,
                    }}
                  >
                    {currentConfig.subjects.map((subj) => (
                      <Input
                        key={subj.name}
                        type="number"
                        label={`${subj.name} (Max ${subj.max})`}
                        placeholder={`0-${subj.max}`}
                        value={inputMarks[`${s.id}_${subj.name}`] || ''}
                        onChange={(e) =>
                          setInputMarks({
                            ...inputMarks,
                            [`${s.id}_${subj.name}`]: e.target.value,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              ))
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
            <Btn variant="ghost" onClick={() => setShowAddMarks(false)}>
              Cancel
            </Btn>
            <Btn variant="primary" onClick={handleSaveMarks}>
              💾 Save Result Records
            </Btn>
          </div>
        </Modal>
      )}

      {printModal.show && (
        <Modal
          title="🖨️ Customize Print Settings"
          onClose={() => setPrintModal({ show: false, action: null })}
          width={500}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <Input
              label="Exam Term Title"
              value={printConfig.termTitle}
              onChange={(e) =>
                setPrintConfig({ ...printConfig, termTitle: e.target.value })
              }
              placeholder="e.g. 1st Term Examination"
            />
            <Input
              type="date"
              label="Issue Date"
              value={printConfig.date}
              onChange={(e) =>
                setPrintConfig({ ...printConfig, date: e.target.value })
              }
            />

            {printModal.action === 'positions' && (
              <Input
                type="number"
                label="Number of Positions to Print"
                value={printConfig.topN}
                onChange={(e) =>
                  setPrintConfig({
                    ...printConfig,
                    topN: Number(e.target.value),
                  })
                }
                min={1}
                max={50}
              />
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
            <Btn
              variant="ghost"
              onClick={() => setPrintModal({ show: false, action: null })}
            >
              Cancel
            </Btn>
            <Btn
              variant="primary"
              onClick={() => {
                const formattedDate = new Date(
                  printConfig.date
                ).toLocaleDateString('en-GB')
                if (printModal.action === 'master')
                  handlePrintMasterSheet(printConfig.termTitle, formattedDate)
                else if (printModal.action === 'positions')
                  handlePrintPositions(
                    printConfig.topN,
                    printConfig.termTitle,
                    formattedDate
                  )
                else if (printModal.action === 'report')
                  handlePrintReport(
                    printModal.student,
                    printConfig.termTitle,
                    formattedDate
                  )
                setPrintModal({ show: false, action: null })
              }}
            >
              🖨️ Print Now
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── HOMEWORK ───────────────────────────────────────────────────────────────
export function Homework() {
  const {
    homework,
    assignHomework,
    submitHomework,
    gradeHomework,
    currentRole,
    currentUser,
  } = useDb()
  const [showAdd, setShowAdd] = useState(false)
  const [showSubmissionPortal, setShowSubmissionPortal] = useState(null)

  // Student Submit State
  const [subText, setSubText] = useState('')

  // Teacher grade state
  const [gradeVal, setGradeVal] = useState('A')
  const [feedText, setFeedText] = useState('')
  const [gradingSid, setGradingSid] = useState('')

  // Form State
  const [form, setForm] = useState({
    subject: 'Mathematics',
    class: 'Class 5-A',
    title: '',
    due: '',
    desc: '',
  })

  const handleAssign = () => {
    if (!form.title || !form.due) return
    assignHomework(form)
    setShowAdd(false)
    alert('Homework assigned and parent notifications triggered!')
  }

  const handleSubmitHW = () => {
    submitHomework(showSubmissionPortal.id, currentUser.id, subText, [
      'Attached Solution.pdf',
    ])
    setSubText('')
    setShowSubmissionPortal(null)
    alert('Homework solution uploaded successfully to LMS!')
  }

  const handleGradeSubmit = (hwId) => {
    gradeHomework(hwId, gradingSid, gradeVal, feedText)
    setFeedText('')
    setGradingSid('')
    alert('Grade saved successfully.')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        {(currentRole === 'Super Admin' ||
          currentRole === 'Principal' ||
          currentRole === 'Teacher') && (
          <Btn variant="primary" onClick={() => setShowAdd(true)}>
            + Assign Homework
          </Btn>
        )}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 14,
        }}
      >
        {[
          { l: 'Active Assignments', v: homework.length },
          {
            l: 'Due Soon',
            v: homework.filter((hw) => hw.status !== 'Closed').length,
          },
          { l: 'Submissions Today', v: '45' },
          { l: 'Completion rate', v: '84%' },
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
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--gold)',
              }}
            >
              {s.v}
            </div>
            <div
              style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}
            >
              {s.l}
            </div>
          </div>
        ))}
      </div>
      <Card title="📋 Active Homework & Daily SVT Tasks">
        {homework
          .filter(
            (h) =>
              currentRole !== 'Student' ||
              (h.class &&
                currentUser?.class &&
                h.class.startsWith(currentUser.class))
          )
          .map((h, i) => {
            const hasSubmitted = h.submissions?.some(
              (s) => s.studentId === currentUser?.id
            )
            return (
              <div
                key={i}
                style={{
                  padding: '16px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      {h.title}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--text-muted)',
                        marginTop: 3,
                      }}
                    >
                      📚 {h.subject} &nbsp;·&nbsp; 🏫 {h.class} &nbsp;·&nbsp; 📅
                      Due: {h.due}
                    </div>
                    {h.desc && (
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--text-secondary)',
                          marginTop: 6,
                        }}
                      >
                        {h.desc}
                      </div>
                    )}
                  </div>
                  <div
                    style={{ display: 'flex', gap: 8, alignItems: 'center' }}
                  >
                    <StatusBadge status={h.status} />
                    {currentRole === 'Student' && (
                      <Btn
                        size="sm"
                        variant={hasSubmitted ? 'success' : 'primary'}
                        onClick={() => setShowSubmissionPortal(h)}
                        disabled={hasSubmitted}
                      >
                        {hasSubmitted
                          ? '✓ Submitted'
                          : '📤 Upload SVT / Solution'}
                      </Btn>
                    )}
                    {(currentRole === 'Super Admin' ||
                      currentRole === 'Principal' ||
                      currentRole === 'Teacher') && (
                      <Btn
                        size="sm"
                        variant="outline"
                        onClick={() => setShowSubmissionPortal(h)}
                      >
                        Review submissions ({h.submissions?.length || 0})
                      </Btn>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ProgressBar value={h.submitted || 0} max={h.total || 30} />
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--gold)',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h.submitted || 0}/{h.total || 30} submitted (
                    {Math.round(((h.submitted || 0) / (h.total || 30)) * 100)}%)
                  </span>
                </div>
              </div>
            )
          })}
      </Card>

      {/* Upload/Review Modal */}
      {showSubmissionPortal && (
        <Modal
          title={
            currentRole === 'Student'
              ? `📤 Submit Homework - ${showSubmissionPortal.title}`
              : `Review Submissions - ${showSubmissionPortal.title}`
          }
          onClose={() => setShowSubmissionPortal(null)}
          width={550}
        >
          {currentRole === 'Student' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input
                label="Write Submission Text"
                type="textarea"
                value={subText}
                onChange={(e) => setSubText(e.target.value)}
                placeholder="Type description or answers here..."
              />
              <div
                style={{
                  border: '2px dashed var(--border)',
                  borderRadius: 8,
                  padding: 20,
                  textAlign: 'center',
                }}
              >
                <div>📎 Attach PDF / Daily SVT File / Image</div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  Files: Attached_Submission.pdf
                </span>
              </div>
              <Btn variant="primary" onClick={handleSubmitHW}>
                Submit Task / SVT
              </Btn>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div
                style={{ fontWeight: 700, fontSize: 12, color: 'var(--gold)' }}
              >
                Submissions Registry
              </div>
              {!showSubmissionPortal.submissions ||
              showSubmissionPortal.submissions.length === 0 ? (
                <div
                  style={{
                    padding: 16,
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                  }}
                >
                  No submissions uploaded yet.
                </div>
              ) : (
                showSubmissionPortal.submissions.map((sub, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: 10,
                      background: 'var(--navy)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 12,
                      }}
                    >
                      <strong>Student: {sub.studentId}</strong>
                      <span>Date: {sub.date}</span>
                    </div>
                    <p style={{ fontSize: 12, marginTop: 4 }}>{sub.text}</p>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--gold)',
                        marginTop: 4,
                      }}
                    >
                      📎 {sub.files.join(', ')}
                    </div>

                    {sub.grade !== 'Pending' ? (
                      <div
                        style={{
                          marginTop: 6,
                          borderTop: '1px solid var(--border)',
                          paddingTop: 4,
                          fontSize: 11,
                        }}
                      >
                        <strong>
                          Grade:{' '}
                          <span style={{ color: '#4ade80' }}>{sub.grade}</span>
                        </strong>{' '}
                        | Feedback: {sub.feedback}
                      </div>
                    ) : (
                      <div
                        style={{
                          marginTop: 8,
                          display: 'flex',
                          gap: 8,
                          alignItems: 'center',
                        }}
                      >
                        <select
                          value={gradeVal}
                          onChange={(e) => setGradeVal(e.target.value)}
                          style={{
                            background: 'var(--navy-4)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border)',
                            padding: 4,
                            borderRadius: 4,
                            fontSize: 11,
                          }}
                        >
                          <option>A+</option>
                          <option>A</option>
                          <option>B+</option>
                          <option>B</option>
                          <option>C</option>
                          <option>D</option>
                          <option>F</option>
                        </select>
                        <input
                          placeholder="Feedback remarks..."
                          value={gradingSid === sub.studentId ? feedText : ''}
                          onChange={(e) => {
                            setGradingSid(sub.studentId)
                            setFeedText(e.target.value)
                          }}
                          style={{
                            background: 'var(--navy-4)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border)',
                            padding: 4,
                            borderRadius: 4,
                            flex: 1,
                            fontSize: 11,
                          }}
                        />
                        <Btn
                          size="sm"
                          variant="success"
                          onClick={() =>
                            handleGradeSubmit(showSubmissionPortal.id)
                          }
                        >
                          Save Grade
                        </Btn>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </Modal>
      )}

      {showAdd && (
        <Modal
          title="📋 Assign New Homework / Daily SVT Task"
          onClose={() => setShowAdd(false)}
          width={520}
        >
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
          >
            <Input
              label="Subject"
              type="select"
              options={[
                'Mathematics',
                'English',
                'Urdu',
                'Science',
                'Islamic Studies',
                'Computer',
                'Pashto',
              ]}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <Input
              label="Class"
              type="select"
              options={[
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
              ]}
              value={form.class}
              onChange={(e) => setForm({ ...form, class: e.target.value })}
            />
            <Input
              label="Title *"
              placeholder="e.g. Daily SVT - 17 June"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              label="Due Date"
              type="date"
              value={form.due}
              onChange={(e) => setForm({ ...form, due: e.target.value })}
            />
          </div>
          <div style={{ marginTop: 14 }}>
            <Input
              label="Description"
              type="textarea"
              placeholder="Detailed instructions for students..."
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
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
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>
              Cancel
            </Btn>
            <Btn variant="primary" onClick={handleAssign}>
              📤 Assign Task
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── LMS ────────────────────────────────────────────────────────────────────
export function LMS() {
  const {
    lmsCourses,
    addLmsCourse,
    addLmsChapter,
    uploadLmsResource,
    currentRole,
    currentUser,
    liveClasses,
    startLiveClass,
    endLiveClass
  } = useDb()
  const [lmsTab, setLmsTab] = useState(0)
  const [activeLiveClass, setActiveLiveClass] = useState(null)
  const [selCourse, setSelCourse] = useState(0)
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [quizScore, setQuizScore] = useState(null)
  const [answers, setAnswers] = useState({})
  const [expandedChapter, setExpandedChapter] = useState(null)

  // Forms State
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [newCourse, setNewCourse] = useState({
    subject: '',
    icon: '📘',
    color: '#3b82f6',
  })

  const [showAddChapter, setShowAddChapter] = useState(false)
  const [newChapterTitle, setNewChapterTitle] = useState('')

  const [uploadType, setUploadType] = useState('PDF Notes')
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadChapter, setUploadChapter] = useState('')

  const course = lmsCourses[selCourse] || lmsCourses[0]

  const handleStartQuiz = () => {
    setActiveQuiz(quizQuestions)
    setAnswers({})
    setQuizScore(null)
  }

  const handleQuizSubmit = () => {
    let score = 0
    quizQuestions.forEach((q, idx) => {
      if (answers[idx] === q.ans) score += 1
    })
    setQuizScore({ score, total: quizQuestions.length })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!uploadChapter) return alert('Please select a chapter first!')

    const finalTitle = uploadTitle || file.name
    uploadLmsResource(course.id, uploadChapter, {
      type: uploadType,
      title: finalTitle,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    })
    setUploadTitle('')
    alert(`File "${file.name}" uploaded successfully!`)

    // reset input
    e.target.value = null
  }

  if (!course && !showAddCourse) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: 'center',
          background: 'var(--navy-2)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 16 }}>📚</div>
        <div style={{ fontSize: 16, color: 'var(--text-muted)' }}>
          LMS is currently empty. Courses will appear here once added by
          administrators.
        </div>
        {(currentRole === 'Super Admin' || currentRole === 'Principal') && (
          <Btn style={{ marginTop: 20 }} onClick={() => setShowAddCourse(true)}>
            ➕ Create First Course
          </Btn>
        )}
      </div>
    )
  }

  // Mock Quiz Questions
  const quizQuestions = [
    {
      q: 'What is the sum of fractions 1/4 and 2/4?',
      options: ['1/4', '3/4', '2/4', '3/8'],
      ans: '3/4',
    },
    {
      q: 'In Algebra, what is x if 2x + 5 = 15?',
      options: ['5', '10', '8', '4'],
      ans: '5',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <TabRow tabs={['Learning Materials', 'Live Classes']} active={lmsTab} onChange={setLmsTab} />
      
      {lmsTab === 0 && (
        <>
          {/* Course Selector */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {lmsCourses.map((c, i) => (
          <button
            key={i}
            onClick={() => {
              setSelCourse(i)
              setActiveQuiz(null)
              setExpandedChapter(null)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: selCourse === i ? `${c.color}18` : 'var(--navy-2)',
              border: `1px solid ${selCourse === i ? c.color + '44' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'var(--transition)',
              color: selCourse === i ? c.color : 'var(--text-secondary)',
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 13,
              fontWeight: selCourse === i ? 600 : 400,
            }}
          >
            {c.icon} {c.subject}
          </button>
        ))}
        {(currentRole === 'Super Admin' || currentRole === 'Principal') && (
          <Btn
            size="sm"
            variant="outline"
            onClick={() => setShowAddCourse(true)}
          >
            ➕ Add Course
          </Btn>
        )}
      </div>

      {showAddCourse && (
        <Modal
          title="Create LMS Course"
          onClose={() => setShowAddCourse(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Course Name (Subject)"
              value={newCourse.subject}
              onChange={(e) =>
                setNewCourse({ ...newCourse, subject: e.target.value })
              }
              placeholder="e.g. Mathematics 10th"
            />
            <Input
              label="Icon (Emoji)"
              value={newCourse.icon}
              onChange={(e) =>
                setNewCourse({ ...newCourse, icon: e.target.value })
              }
            />
            <Input
              label="Theme Color (Hex)"
              type="color"
              value={newCourse.color}
              onChange={(e) =>
                setNewCourse({ ...newCourse, color: e.target.value })
              }
            />
            <div
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'flex-end',
                marginTop: 10,
              }}
            >
              <Btn variant="outline" onClick={() => setShowAddCourse(false)}>
                Cancel
              </Btn>
              <Btn
                onClick={() => {
                  if (!newCourse.subject) return
                  addLmsCourse({
                    ...newCourse,
                    id: 'course_' + Date.now(),
                    chapters: [],
                  })
                  setShowAddCourse(false)
                  setNewCourse({ subject: '', icon: '📘', color: '#3b82f6' })
                }}
              >
                Create Course
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {showAddChapter && (
        <Modal title="Add New Chapter" onClose={() => setShowAddChapter(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Chapter Title"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              placeholder="e.g. Ch 1: Introduction"
            />
            <div
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'flex-end',
                marginTop: 10,
              }}
            >
              <Btn variant="outline" onClick={() => setShowAddChapter(false)}>
                Cancel
              </Btn>
              <Btn
                onClick={() => {
                  if (!newChapterTitle) return
                  addLmsChapter(course.id, {
                    title: newChapterTitle,
                    progress: 0,
                    resources: [],
                    quiz: false,
                  })
                  setShowAddChapter(false)
                  setNewChapterTitle('')
                }}
              >
                Add Chapter
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {course && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 20,
          }}
        >
          {/* Chapters */}
          <Card
            title={`${course.icon} ${course.subject} — Course Content`}
            action={
              currentRole === 'Super Admin' || currentRole === 'Teacher' ? (
                <Btn size="sm" onClick={() => setShowAddChapter(true)}>
                  + Chapter
                </Btn>
              ) : null
            }
          >
            {course.chapters.length === 0 ? (
              <div
                style={{
                  color: 'var(--text-muted)',
                  fontSize: 13,
                  padding: 20,
                  textAlign: 'center',
                }}
              >
                No chapters added yet.
              </div>
            ) : (
              course.chapters.map((ch, i) => (
                <div
                  key={i}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    padding: '14px 0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      setExpandedChapter(expandedChapter === i ? null : i)
                    }
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 'var(--radius-md)',
                        background: `${course.color}14`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {expandedChapter === i ? '📂' : '📁'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>
                        {ch.title}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--text-muted)',
                          marginTop: 2,
                        }}
                      >
                        📄 {ch.resources ? ch.resources.length : 0} resources
                        &nbsp;·&nbsp; {ch.quiz ? '✅ Quiz' : '— No quiz'}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginTop: 6,
                        }}
                      >
                        <ProgressBar
                          value={ch.progress}
                          color={course.color}
                          height={4}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            color: course.color,
                            fontWeight: 700,
                          }}
                        >
                          {ch.progress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Resources Area */}
                  {expandedChapter === i && (
                    <div
                      style={{
                        marginTop: 16,
                        marginLeft: 54,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        animation: 'fadeInUp 0.3s ease',
                      }}
                    >
                      {!ch.resources || ch.resources.length === 0 ? (
                        <div
                          style={{ fontSize: 11, color: 'var(--text-muted)' }}
                        >
                          No resources found.
                        </div>
                      ) : (
                        ch.resources.map((res, ridx) => (
                          <div
                            key={ridx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: 'rgba(255,255,255,0.02)',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border)',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                              }}
                            >
                              <span style={{ fontSize: 14 }}>
                                {res.type.includes('Video')
                                  ? '🎥'
                                  : res.type.includes('Presentation')
                                    ? '📊'
                                    : '📄'}
                              </span>
                              <div>
                                <div
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                  }}
                                >
                                  {res.title}
                                </div>
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: 'var(--text-muted)',
                                  }}
                                >
                                  {res.type} · Added {res.date}
                                </div>
                              </div>
                            </div>
                            <Btn
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                alert(`Opening ${res.type}: ${res.title}`)
                              }
                            >
                              Open
                            </Btn>
                          </div>
                        ))
                      )}

                      {ch.quiz && currentRole === 'Student' && (
                        <Btn
                          size="sm"
                          variant="success"
                          onClick={handleStartQuiz}
                          style={{ marginTop: 6 }}
                        >
                          Start Chapter Quiz
                        </Btn>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </Card>

          {/* Upload Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(currentRole === 'Super Admin' || currentRole === 'Teacher') &&
              course.chapters.length > 0 && (
                <Card title="📤 Upload Chapter Content">
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    <Input
                      label="Select Chapter"
                      type="select"
                      value={uploadChapter}
                      onChange={(e) => setUploadChapter(e.target.value)}
                      options={[
                        { value: '', label: '-- Select Chapter --' },
                        ...course.chapters.map((c) => c.title),
                      ]}
                    />
                    <Input
                      label="Content Type"
                      type="select"
                      value={uploadType}
                      onChange={(e) => setUploadType(e.target.value)}
                      options={[
                        'PDF Notes',
                        'Video Lecture',
                        'Presentation',
                        'Assignment',
                      ]}
                    />
                    <Input
                      label="Title"
                      placeholder="Content title..."
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                    />
                    <div
                      style={{
                        border: '2px dashed var(--border)',
                        borderRadius: 8,
                        padding: 20,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = 'var(--gold)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = 'var(--border)')
                      }
                      onClick={() =>
                        document.getElementById('lms-file-upload').click()
                      }
                    >
                      ☁️ Click to Upload Content
                      <br />
                      <span
                        style={{
                          fontSize: 11,
                          color: 'var(--text-muted)',
                          marginTop: 4,
                          display: 'block',
                        }}
                      >
                        Supports .pdf, .mp4, .pptx
                      </span>
                    </div>
                    <input
                      type="file"
                      id="lms-file-upload"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </div>
                </Card>
              )}

            {/* Interactive Quiz Area */}
            {activeQuiz && (
              <Card title="📝 Online assessment / Chapter Quiz">
                {quizScore ? (
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: 'var(--gold)',
                      }}
                    >
                      Quiz Completed!
                    </div>
                    <div
                      style={{
                        fontSize: 32,
                        fontWeight: 900,
                        margin: '16px 0',
                        color:
                          quizScore.score === quizScore.total
                            ? '#4ade80'
                            : '#fbbf24',
                      }}
                    >
                      {quizScore.score} / {quizScore.total}
                    </div>
                    <Btn variant="outline" onClick={() => setActiveQuiz(null)}>
                      Close Quiz
                    </Btn>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    {activeQuiz.map((q, qIdx) => (
                      <div
                        key={qIdx}
                        style={{
                          paddingBottom: 10,
                          borderBottom: '1px solid var(--border)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            marginBottom: 6,
                          }}
                        >
                          {qIdx + 1}. {q.q}
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 6,
                          }}
                        >
                          {q.options.map((opt) => (
                            <label
                              key={opt}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                fontSize: 11,
                                background: 'var(--navy)',
                                border: '1px solid var(--border)',
                                padding: 6,
                                borderRadius: 6,
                                cursor: 'pointer',
                              }}
                            >
                              <input
                                type="radio"
                                name={`q_${qIdx}`}
                                checked={answers[qIdx] === opt}
                                onChange={() =>
                                  setAnswers({ ...answers, [qIdx]: opt })
                                }
                                style={{ accentColor: 'var(--gold)' }}
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Btn
                      variant="primary"
                      onClick={handleQuizSubmit}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Submit Quiz Answers
                    </Btn>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      )}
      </>
      )}

      {lmsTab === 1 && (
        <Card title="🔴 Live Video Classes">
          {!activeLiveClass ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {(currentRole === 'Teacher' || currentRole === 'Super Admin' || currentRole === 'Principal') && (
                <div style={{ background: 'var(--navy)', padding: 20, borderRadius: 12, border: '1px solid var(--border)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: 16, color: 'var(--gold)' }}>Host a New Live Class</h3>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                    <Input label="Select Course" type="select" options={lmsCourses.map(c => c.subject)} id="live-course-sel" />
                    <Btn variant="primary" onClick={() => {
                      const selSubj = document.getElementById('live-course-sel').value;
                      const c = lmsCourses.find(x => x.subject === selSubj);
                      if (c) {
                        const r = startLiveClass(c);
                        setActiveLiveClass(r);
                      }
                    }}>🎥 Start Meeting</Btn>
                  </div>
                </div>
              )}
              
              <div>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 16 }}>Currently Live Sessions</h3>
                {liveClasses && liveClasses.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                    {liveClasses.map((lc, i) => (
                      <div key={i} style={{ background: 'linear-gradient(135deg, var(--navy-3), var(--navy-2))', padding: 20, borderRadius: 12, border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                          <span style={{ fontSize: 24 }}>🔴</span>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: 16 }}>{lc.subject}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Class: {lc.class}</div>
                          </div>
                        </div>
                        <Btn variant="outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setActiveLiveClass(lc.roomId)}>
                          Join Meeting
                        </Btn>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No live classes are currently running.</div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ height: 600, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
              <Btn variant="danger" style={{ position: 'absolute', top: 10, right: 10, zIndex: 100 }} onClick={() => {
                if (currentRole === 'Teacher' || currentRole === 'Super Admin') {
                   endLiveClass(activeLiveClass);
                }
                setActiveLiveClass(null);
              }}>
                Leave Meeting
              </Btn>
              <JitsiMeeting
                domain="meet.jit.si"
                roomName={activeLiveClass}
                configOverwrite={{
                  startWithAudioMuted: true,
                  disableModeratorIndicator: true,
                  startScreenSharing: true,
                  enableEmailInStats: false
                }}
                interfaceConfigOverwrite={{
                  DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
                }}
                userInfo={{
                  displayName: currentUser ? currentUser.name : 'Student'
                }}
                onApiReady={ (externalApi) => {
                    // attach events if needed
                } }
                getIFrameRef={ (iframeRef) => { iframeRef.style.height = '100%'; } }
              />
            </div>
          )}
        </Card>
      )}

    </div>
  )
}
