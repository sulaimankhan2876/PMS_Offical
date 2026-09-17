import {
  StatCard,
  Card,
  Badge,
  StatusBadge,
  MiniBar,
  ProgressBar,
  Btn,
  Avatar,
} from '../components/ui.jsx'
import { useDb } from '../context/DbContext.jsx'
import { useState } from 'react'

export default function Dashboard({ setPage }) {
  const {
    students,
    teachers,
    feeRecords,
    examResults,
    announcements,
    expenses,
    homework,
    currentRole,
    currentUser,
    onlinePayments,
    books,
    switchRole,
  } = useDb()

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const paidFees = feeRecords
    .filter((f) => f.status === 'Paid')
    .reduce((s, f) => s + f.amount, 0)
  const pendingFees = feeRecords
    .filter((f) => f.status !== 'Paid')
    .reduce((s, f) => s + f.amount, 0)
  const pendingCount = feeRecords.filter((f) => f.status !== 'Paid').length

  const now = new Date()
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const monthData = [112000, 128000, 98000, 135000, 124000, paidFees || 108000]

  // Render Admin / Principal Dashboard
  if (currentRole === 'Super Admin' || currentRole === 'Principal') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Hero Banner */}
        <div
          style={{
            background:
              'linear-gradient(135deg, var(--navy-3) 0%, var(--navy-4) 50%, var(--navy-3) 100%)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-xl)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Cinzel, serif',
                fontSize: 18,
                fontWeight: 900,
                color: 'var(--navy)',
                border: '2px solid var(--gold)',
              }}
            >
              PMS
            </div>
            <div>
              <h2
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--gold)',
                  letterSpacing: 0.5,
                }}
              >
                Professor Model School Dargai
              </h2>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                {[
                  `AY 2025–26`,
                  `${students.length} Students`,
                  `${teachers.length} Staff`,
                ].map((t, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: 'var(--gold)',
                      background: 'rgba(234,179,8,0.1)',
                      border: '1px solid var(--border)',
                      borderRadius: 20,
                      padding: '3px 10px',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: 16,
          }}
        >
          <StatCard
            icon="🎓"
            value={students.length}
            label="Total Students"
            sub="Active enrollments"
            delay={0}
            onClick={() => setPage('students')}
          />
          <StatCard
            icon="👩‍🏫"
            value={teachers.length}
            label="Teaching Staff"
            sub="Active educators"
            color="#60a5fa"
            delay={0.05}
            onClick={() => setPage('teachers')}
          />
          <StatCard
            icon="✅"
            value="89.5%"
            label="Today's Attendance"
            sub="School average"
            color="#4ade80"
            delay={0.1}
            onClick={() => setPage('attendance')}
          />
          <StatCard
            icon="💰"
            value={`PKR ${(paidFees / 1000).toFixed(1)}K`}
            label="Collected Fees"
            sub={`${pendingCount} invoices unpaid`}
            color="#f97316"
            delay={0.15}
            onClick={() => setPage('fees')}
          />
        </div>

        {/* Charts Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 20,
          }}
        >
          <Card
            title="📈 Monthly Fee Collection (2026)"
            action={
              <Btn size="sm" onClick={() => setPage('fees')}>
                View All
              </Btn>
            }
          >
            {monthData.reduce((a, b) => a + b, 0) === 0 ? (
              <div style={{ textAlign: 'center', padding: '35px 0', color: 'var(--text-muted)' }}>
                No data available for this period
              </div>
            ) : (
              <MiniBar
                data={monthData}
                labels={monthNames}
                color="var(--gold)"
                height={90}
              />
            )}
            <div
              style={{
                display: 'flex',
                gap: 24,
                marginTop: 14,
                paddingTop: 14,
                borderTop: '1px solid var(--border)',
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Total YTD
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: 'var(--gold)',
                    fontFamily: 'Cinzel,serif',
                  }}
                >
                  PKR {(monthData.reduce((a, b) => a + b, 0) / 1000).toFixed(0)}
                  K
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Collected
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#4ade80',
                    fontFamily: 'Cinzel,serif',
                  }}
                >
                  PKR {(paidFees / 1000).toFixed(0)}K
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Expenses
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#f87171',
                    fontFamily: 'Cinzel,serif',
                  }}
                >
                  PKR {(totalExpenses / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          </Card>

          <Card
            title="📊 School Operations Surplus"
            action={
              <Btn size="sm" onClick={() => setPage('expenses')}>
                Expenses
              </Btn>
            }
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                padding: '10px 0',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    marginBottom: 4,
                  }}
                >
                  <span>Fee Collection</span>
                  <span style={{ color: '#4ade80', fontWeight: 600 }}>
                    PKR {paidFees.toLocaleString()}
                  </span>
                </div>
                <ProgressBar
                  value={paidFees}
                  max={Math.max(paidFees + totalExpenses, 1)}
                  color="#4ade80"
                />
              </div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    marginBottom: 4,
                  }}
                >
                  <span>School Expenses</span>
                  <span style={{ color: '#f87171', fontWeight: 600 }}>
                    PKR {totalExpenses.toLocaleString()}
                  </span>
                </div>
                <ProgressBar
                  value={totalExpenses}
                  max={Math.max(paidFees + totalExpenses, 1)}
                  color="#f87171"
                />
              </div>
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  background: 'rgba(234,179,8,0.06)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600 }}>
                  Net Operational Surplus:
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color:
                      paidFees - totalExpenses >= 0 ? '#4ade80' : '#f87171',
                  }}
                >
                  PKR {(paidFees - totalExpenses).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="⚡ Quick Actions">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 110px), 1fr))',
              gap: 10,
            }}
          >
            {[
              { icon: '➕', label: 'Add Student', page: 'students' },
              { icon: '✅', label: 'Attendance', page: 'attendance' },
              { icon: '💳', label: 'Collect Fee', page: 'fees' },
              { icon: '📢', label: 'Announce', page: 'announcements' },
              { icon: '📝', label: 'Enter Marks', page: 'exams' },
              { icon: '📋', label: 'Homework', page: 'homework' },
              { icon: '🤖', label: 'AI Assistant', page: 'ai' },
              { icon: '📈', label: 'Reports', page: 'reports' },
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => setPage(q.page)}
                className="card-3d"
                style={{
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans',sans-serif",
                  border: '1px solid rgba(234,179,8,0.15)',
                  background: 'linear-gradient(145deg, rgba(15, 31, 61, 0.5), rgba(20, 40, 80, 0.3))',
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 6 }}>{q.icon}</div>
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--gold)',
                    fontWeight: 600,
                  }}
                >
                  {q.label}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Bottom Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 20,
          }}
        >
          {/* Top Performers */}
          <Card
            title="🏆 Top Performers"
            action={
              <Btn size="sm" onClick={() => setPage('exams')}>
                View All
              </Btn>
            }
          >
            {[...examResults]
              .sort((a, b) => b.total - a.total)
              .slice(0, 5)
              .map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      width: 20,
                      textAlign: 'center',
                      color:
                        i === 0
                          ? 'var(--gold)'
                          : i === 1
                            ? '#c0c0c0'
                            : i === 2
                              ? '#cd7f32'
                              : 'var(--text-muted)',
                      fontWeight: 700,
                    }}
                  >
                    #{i + 1}
                  </div>
                  <Avatar name={r.student} size={28} fontSize={10} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {r.student}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      {r.class}
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
                      {Math.round((r.total / r.max) * 100)}%
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      {r.grade}
                    </div>
                  </div>
                </div>
              ))}
          </Card>

          {/* Fee Alerts */}
          <Card
            title="⚠️ Fee Alerts"
            action={
              <Btn size="sm" onClick={() => setPage('fees')}>
                Manage
              </Btn>
            }
          >
            {feeRecords
              .filter((f) => f.status !== 'Paid')
              .slice(0, 5)
              .map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <Avatar name={f.name} size={28} fontSize={10} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>
                      {f.name}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      {f.class}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color:
                          f.status === 'Overdue' ? '#f87171' : 'var(--gold)',
                      }}
                    >
                      PKR {f.amount.toLocaleString()}
                    </div>
                    <StatusBadge status={f.status} />
                  </div>
                </div>
              ))}
          </Card>

          {/* Announcements */}
          <Card
            title="📢 Announcements"
            action={
              <Btn size="sm" onClick={() => setPage('announcements')}>
                All
              </Btn>
            }
          >
            {announcements.slice(0, 4).map((a, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 10,
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border)',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: 14, marginTop: 1 }}>
                  {a.type === 'High' ? '🚨' : a.type === 'Medium' ? '⚠️' : 'ℹ️'}
                </span>
                <div>
                  <div
                    style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}
                  >
                    {a.title}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      marginTop: 2,
                    }}
                  >
                    {a.date}
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    )
  }

  // Render Teacher Dashboard
  if (currentRole === 'Teacher') {
    const assignedClasses = ['Class 5-A', 'Class 6-B', 'Class 10-A']
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div
          style={{
            background: 'rgba(234,179,8,0.06)',
            padding: 18,
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <h3>Welcome back, {currentUser?.name}! 👩‍🏫</h3>
          <p
            style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              marginTop: 4,
            }}
          >
            You are logged in as the Class Teacher for Class 5. Manage your
            classroom actions below.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          <StatCard
            icon="🏫"
            value="3"
            label="Assigned Classes"
            sub="Class 5-A, 6-B, 10-A"
            color="var(--gold)"
          />
          <StatCard
            icon="📋"
            value={homework.length}
            label="Active Assignments"
            sub="Manage homework submissions"
            color="#60a5fa"
          />
          <StatCard
            icon="📝"
            value="Pending"
            label="Marks Entry Status"
            sub="Final term exams coming up"
            color="#4ade80"
          />
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
        >
          <Card title="✅ Quick Attendance Roll Call">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {assignedClasses.map((cls, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: 'var(--navy)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600 }}>{cls}</span>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      Roll Call not taken today
                    </div>
                  </div>
                  <Btn
                    size="sm"
                    variant="primary"
                    onClick={() => setPage('attendance')}
                  >
                    Take Roll Call
                  </Btn>
                </div>
              ))}
            </div>
          </Card>

          <Card title="📋 Active Homework Assignments tracker">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {homework.slice(0, 3).map((hw, idx) => (
                <div
                  key={idx}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: 8,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    <span>{hw.title}</span>
                    <span style={{ color: 'var(--gold)' }}>
                      {hw.submitted}/{hw.total} Sub
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      marginTop: 2,
                    }}
                  >
                    {hw.subject} · Due: {hw.due}
                  </div>
                  <ProgressBar value={hw.submitted} max={hw.total} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Render Student Dashboard
  if (currentRole === 'Student') {
    const studentInfo = students.find((s) => s.id === currentUser?.id) ||
      students[0] ||
      currentUser || {
        id: '—',
        name: 'Unknown',
        class: '—',
        section: '—',
        att: 0,
        fee: '—',
      }
    const studentMarks =
      examResults.find((r) => r.id === studentInfo?.id) ||
      examResults[0] ||
      null
    const pendingHw = homework.filter(
      (hw) =>
        hw.class && studentInfo.class && hw.class.startsWith(studentInfo.class)
    )

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: 'rgba(234,179,8,0.06)',
            padding: 18,
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <Avatar name={studentInfo.name} size={48} fontSize={16} />
          <div>
            <h3>Assalam-o-Alaikum, {studentInfo.name}! 🎓</h3>
            <p
              style={{
                fontSize: 12,
                color: 'var(--text-secondary)',
                marginTop: 4,
              }}
            >
              Student ID: {studentInfo.id} · {studentInfo.class}-
              {studentInfo.section}
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}
        >
          <StatCard
            icon="✅"
            value={`${studentInfo.att}%`}
            label="My Attendance"
            sub="Required: 75% minimum"
            color="#4ade80"
          />
          <StatCard
            icon="📋"
            value={pendingHw.length}
            label="Assigned Homework"
            sub="Check due dates"
            color="var(--gold)"
          />
          <StatCard
            icon="🏆"
            value={studentMarks?.grade || 'A'}
            label="Academic Grade"
            sub={`Class Position: #${studentMarks?.pos || 'N/A'}`}
            color="#60a5fa"
          />
          <StatCard
            icon="💳"
            value={studentInfo.fee}
            label="Fee Invoice Status"
            sub="June 2026 Invoice"
            color="#f97316"
          />
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}
        >
          <Card title="📅 Daily Timetable Classes">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 10,
              }}
            >
              {[
                '08:00 AM\nMath',
                '08:45 AM\nEnglish',
                '09:30 AM\nUrdu',
                '10:15 AM\nScience',
                '11:20 AM\nComputer',
              ].map((slot, idx) => {
                const [time, sub] = slot.split('\n')
                return (
                  <div
                    key={idx}
                    style={{
                      padding: 10,
                      background: 'var(--navy)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        color: 'var(--text-muted)',
                        marginBottom: 4,
                      }}
                    >
                      {time}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--gold)',
                      }}
                    >
                      {sub}
                    </div>
                  </div>
                )
              })}
            </div>
            <Btn
              size="sm"
              variant="outline"
              style={{ marginTop: 14 }}
              onClick={() => setPage('timetable')}
            >
              View Full Timetable
            </Btn>
          </Card>

          <Card title="🤖 AI Tutor Support">
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🤖</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>
                Stuck on Homework?
              </div>
              <p
                style={{
                  fontSize: 10,
                  color: 'var(--text-secondary)',
                  marginTop: 4,
                  marginBottom: 12,
                }}
              >
                Talk to your AI Learning Assistant available 24/7 for math help,
                Pashto, or science.
              </p>
              <Btn
                size="sm"
                variant="primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setPage('ai')}
              >
                Chat with AI Tutor
              </Btn>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Render Parent Dashboard
  if (currentRole === 'Parent') {
    const childId = currentUser?.childId || 'PMS-2026-001'
    const child = students.find((s) => s.id === childId) ||
      students[0] || {
        id: '—',
        name: 'Unknown',
        class: '—',
        section: '—',
        att: 0,
        fee: '—',
      }
    const childMarks =
      examResults.find((r) => r.id === child?.id) || examResults[0] || null

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div
          style={{
            background: 'rgba(234,179,8,0.06)',
            padding: 18,
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <h3>Assalam-o-Alaikum, Parent of {child.name}! 👪</h3>
          <p
            style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              marginTop: 4,
            }}
          >
            Child Roll Number: {child.id} · {child.class}-{child.section}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}
        >
          <StatCard
            icon="📈"
            value={`${child.att}%`}
            label="Child Attendance"
            sub="Daily presence rate"
            color="#4ade80"
          />
          <StatCard
            icon="🏆"
            value={childMarks?.grade || 'A+'}
            label="Latest Exam Grade"
            sub={`Total: ${childMarks?.total}/${childMarks?.max}`}
            color="var(--gold)"
          />
          <StatCard
            icon="💳"
            value={child.fee}
            label="Child Fee Status"
            sub={child.fee === 'Paid' ? 'No action needed' : 'Action Required'}
            color="#f87171"
          />
          <StatCard
            icon="📩"
            value="Online"
            label="Parent Portal Hub"
            sub="Direct messaging enabled"
            color="#60a5fa"
          />
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}
        >
          <Card title="💳 Student Fee Payment Invoice">
            <div
              style={{
                padding: 12,
                background: 'var(--navy)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  June 2026 Tuition Fee:
                </span>
                <span style={{ fontWeight: 700, color: 'var(--gold)' }}>
                  PKR 2,500
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Status:
                </span>
                <StatusBadge status={child.fee} />
              </div>
              {child.fee !== 'Paid' && (
                <Btn
                  variant="primary"
                  size="sm"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: 10,
                  }}
                  onClick={() => setPage('fees')}
                >
                  Pay via Easypaisa
                </Btn>
              )}
            </div>
          </Card>

          <Card title="📢 Recent Notifications">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {announcements.slice(0, 3).map((ann, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: 11,
                    paddingBottom: 6,
                    borderBottom: idx < 2 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--gold)' }}>
                    {ann.title}
                  </span>
                  <div
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: 10,
                      marginTop: 2,
                    }}
                  >
                    {ann.date}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Render Accountant Dashboard
  if (currentRole === 'Accountant') {
    const unverifiedCount = onlinePayments.filter(
      (p) => p.status === 'Pending'
    ).length
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 16,
          }}
        >
          <StatCard
            icon="💰"
            value={`PKR ${(paidFees / 1000).toFixed(0)}K`}
            label="Collected (June)"
            sub="Paid tuition fees"
            color="#4ade80"
          />
          <StatCard
            icon="⚠️"
            value={`PKR ${(pendingFees / 1000).toFixed(0)}K`}
            label="Pending Payments"
            sub={`${pendingCount} unpaid students`}
            color="#fbbf24"
          />
          <StatCard
            icon="📉"
            value={`PKR ${(totalExpenses / 1000).toFixed(0)}K`}
            label="Total Expenses"
            sub="Operating disbursements"
            color="#f87171"
          />
          <StatCard
            icon="📸"
            value={unverifiedCount}
            label="Pending Verifications"
            sub="Easypaisa transactions"
            color="var(--gold)"
          />
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}
        >
          <Card
            title="📸 Online Payments (Easypaisa/JazzCash) Verification Requests"
            action={
              <Btn size="sm" onClick={() => setPage('fees')}>
                Verification Page
              </Btn>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {onlinePayments.filter((p) => p.status === 'Pending').length ===
              0 ? (
                <div
                  style={{
                    padding: 16,
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                  }}
                >
                  No pending payment verifications today.
                </div>
              ) : (
                onlinePayments
                  .filter((p) => p.status === 'Pending')
                  .map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyItems: 'center',
                        justifyContent: 'space-between',
                        padding: 8,
                        background: 'var(--navy)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600, fontSize: 12 }}>
                          {p.name} ({p.studentId})
                        </span>
                        <div
                          style={{
                            fontSize: 9,
                            color: 'var(--text-secondary)',
                          }}
                        >
                          Amt: PKR {p.amount} · TXID: {p.txId}
                        </div>
                      </div>
                      <Btn
                        size="sm"
                        variant="success"
                        onClick={() => setPage('fees')}
                      >
                        Verify
                      </Btn>
                    </div>
                  ))
              )}
            </div>
          </Card>

          <Card title="💸 Expense Categories">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {expenses.slice(0, 4).map((e, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 11,
                  }}
                >
                  <span>{e.category}</span>
                  <span style={{ fontWeight: 600, color: 'var(--gold)' }}>
                    PKR {e.amount.toLocaleString()}
                  </span>
                </div>
              ))}
              <Btn
                size="sm"
                variant="outline"
                style={{ marginTop: 10 }}
                onClick={() => setPage('expenses')}
              >
                Add New Expense
              </Btn>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Render Librarian Dashboard
  if (currentRole === 'Librarian') {
    const totalQty = books.reduce((s, b) => s + b.qty, 0)
    const totalIssued = books.reduce((s, b) => s + b.issued, 0)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 16,
          }}
        >
          <StatCard
            icon="📚"
            value={books.length}
            label="Total Book Titles"
            sub="Unique cataloged works"
            color="var(--gold)"
          />
          <StatCard
            icon="📥"
            value={totalQty}
            label="Total Volume Stock"
            sub="Physical books owned"
            color="#60a5fa"
          />
          <StatCard
            icon="📤"
            value={totalIssued}
            label="Active Loans"
            sub="Books checked out"
            color="#fbbf24"
          />
          <StatCard
            icon="✅"
            value={totalQty - totalIssued}
            label="Books Available"
            sub="Ready for circulation"
            color="#4ade80"
          />
        </div>

        <Card
          title="📖 Library Quick Circulation Operations"
          action={
            <Btn size="sm" onClick={() => setPage('library')}>
              Library Catalog
            </Btn>
          }
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 14,
              textAlign: 'center',
              padding: '10px 0',
            }}
          >
            <div
              style={{
                padding: 12,
                background: 'rgba(234,179,8,0.04)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
              onClick={() => setPage('library')}
            >
              <div style={{ fontSize: 20, marginBottom: 4 }}>📥</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Issue Book</div>
            </div>
            <div
              style={{
                padding: 12,
                background: 'rgba(234,179,8,0.04)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
              onClick={() => setPage('library')}
            >
              <div style={{ fontSize: 20, marginBottom: 4 }}>📤</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Return Book</div>
            </div>
            <div
              style={{
                padding: 12,
                background: 'rgba(234,179,8,0.04)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
              onClick={() => setPage('library')}
            >
              <div style={{ fontSize: 20, marginBottom: 4 }}>➕</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Catalog Book</div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return null
}
