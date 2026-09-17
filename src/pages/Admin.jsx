import { useState, useRef } from 'react'
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

// ── FEES ───────────────────────────────────────────────────────────────────
export function Fees() {
  const {
    feeRecords,
    payFeeRecord,
    undoFeeRecord,
    generateFeesBulk,
    uploadEasypaisaReceipt,
    verifyOnlinePayment,
    undoOnlinePayment,
    onlinePayments,
    students,
    currentRole,
    currentUser,
  } = useDb()
  const [tab, setTab] = useState(0)
  const [genMonth, setGenMonth] = useState('July 2026')
  const [feeCategories, setFeeCategories] = useState([
    { name: 'Monthly Tuition Fee', amount: 2500, selected: true },
    { name: 'Exam Fee', amount: 500, selected: false },
    { name: 'Annual Fund', amount: 1000, selected: false },
    { name: 'Transport Fee', amount: 800, selected: false },
    { name: 'Fine / Late Fee', amount: 200, selected: false },
  ])
  const [easypaisaForm, setEasypaisaForm] = useState({
    studentId: '',
    name: '',
    amount: '',
    month: 'June 2026',
    txId: '',
    screenshot: '',
  })

  // ── 1. STRICT RBAC SECURITY GATEWAY ──
  if (currentRole === 'Teacher' || currentRole === 'Librarian') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          color: '#f87171',
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
        <h2
          style={{
            fontFamily: 'Cinzel,serif',
            fontSize: 24,
            margin: '0 0 8px 0',
          }}
        >
          Access Restricted
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          You do not have sufficient permissions to view the Financial
          Management module.
        </p>
      </div>
    )
  }

  if (currentRole === 'Student' || currentRole === 'Parent') {
    const studentId =
      currentRole === 'Student'
        ? currentUser?.id
        : currentUser?.childId || 'PMS-2026-001'
    const myStudent =
      students.find((s) => s.id === studentId) || students[0] || {}
    const myFees = feeRecords.filter(
      (f) => f.studentId === studentId || f.name === myStudent.name
    )
    const totalDue = myFees
      .filter((f) => f.status !== 'Paid')
      .reduce((sum, f) => sum + f.amount, 0)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div
          style={{
            background: 'linear-gradient(135deg, var(--navy-3), var(--navy-2))',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'Cinzel,serif',
                color: 'var(--gold)',
                margin: '0 0 12px 0',
                fontSize: 24,
              }}
            >
              Student Financial Profile
            </h2>
            <div
              style={{
                display: 'flex',
                gap: 24,
                fontSize: 13,
                color: 'var(--text-secondary)',
              }}
            >
              <div>
                <strong
                  style={{
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    fontSize: 10,
                  }}
                >
                  Student ID:
                </strong>{' '}
                <br />
                <span style={{ color: '#fff', fontSize: 15 }}>
                  {myStudent.id}
                </span>
              </div>
              <div>
                <strong
                  style={{
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    fontSize: 10,
                  }}
                >
                  Name:
                </strong>{' '}
                <br />
                <span style={{ color: '#fff', fontSize: 15 }}>
                  {myStudent.name}
                </span>
              </div>
              <div>
                <strong
                  style={{
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    fontSize: 10,
                  }}
                >
                  Class:
                </strong>{' '}
                <br />
                <span style={{ color: '#fff', fontSize: 15 }}>
                  {myStudent.class}-{myStudent.section}
                </span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Financial Status
            </div>
            <StatusBadge status={totalDue > 0 ? 'Overdue' : 'Paid'} />
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          <div
            style={{
              background: 'var(--navy)',
              border: '1px solid var(--border)',
              padding: 20,
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              boxShadow:
                totalDue > 0 ? '0 0 15px rgba(248,113,113,0.1)' : 'none',
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: totalDue > 0 ? '#f87171' : '#4ade80',
              }}
            >
              PKR {totalDue.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              Total Outstanding Dues
            </div>
          </div>
          <div
            style={{
              background: 'var(--navy)',
              border: '1px solid var(--border)',
              padding: 20,
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: '#4ade80' }}>
              {myFees.filter((f) => f.status === 'Paid').length}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              Successfully Paid Invoices
            </div>
          </div>
          <div
            style={{
              background: 'var(--navy)',
              border: '1px solid var(--border)',
              padding: 20,
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
            }}
          >
            <div
              style={{ fontSize: 28, fontWeight: 700, color: 'var(--gold)' }}
            >
              PKR {(myStudent.customFee || 2500).toLocaleString()}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              Standard Monthly Tuition
            </div>
          </div>
        </div>

        <Card title="📄 My Fee Vouchers & Transaction History">
          <Table
            headers={[
              'Month / Term',
              'Total Payable',
              'Current Status',
              'Action',
            ]}
            rows={myFees.map((f) => [
              <div style={{ fontWeight: 600 }}>{f.month}</div>,
              <span style={{ color: '#ffffff', fontWeight: 700 }}>
                PKR {f.amount.toLocaleString()}
              </span>,
              <StatusBadge status={f.status} />,
              f.status !== 'Paid' ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      alert(
                        'Redirecting to Easypaisa Secure Payment Gateway...'
                      )
                    }
                  >
                    💳 Pay Online
                  </Btn>
                  <Btn size="sm" variant="outline" onClick={() => {}}>
                    📥 Download Voucher
                  </Btn>
                </div>
              ) : (
                <Btn size="sm" variant="success" onClick={() => {}}>
                  🖨️ View Receipt
                </Btn>
              ),
            ])}
          />
        </Card>
      </div>
    )
  }

  // ── 2. ADMIN / ACCOUNTANT ADVANCED DASHBOARD ──
  const paid = feeRecords.filter((f) => f.status === 'Paid')
  const paidTotal = paid.reduce((s, f) => s + f.amount, 0)
  const pendingTotal = feeRecords
    .filter((f) => f.status !== 'Paid')
    .reduce((s, f) => s + f.amount, 0)
  const overdueCount = feeRecords.filter((f) => f.status === 'Overdue').length
  const pendingVerifications = onlinePayments.filter(
    (p) => p.status === 'Pending'
  ).length

  const familyGroups = students.reduce((acc, st) => {
    if (!st.father) return acc
    const key = `${st.father} - ${st.contact}`
    if (!acc[key]) acc[key] = []
    acc[key].push(st)
    return acc
  }, {})

  // Professional Printable Voucher Generation
  const printVoucher = (records) => {
    if (!records || records.length === 0) return
    const totalAmount = records.reduce((s, r) => s + r.amount, 0)
    const voucherNo =
      records[0].receipt || `VOU-${Math.floor(100000 + Math.random() * 900000)}`
    const student = students.find((s) => s.name === records[0].name) || {
      id: 'Unknown',
      father: 'Unknown',
    }
    const qrData = `PMS-${voucherNo}-${totalAmount}`

    const detailsHtml = records
      .map(
        (r) => `
      <tr style="border-bottom: 1px dashed #cbd5e1;">
        <td style="padding: 10px 0; font-size: 13px; color: #1e293b;">Tuition Fee - ${r.month}</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #0f172a;">PKR ${r.amount.toLocaleString()}</td>
      </tr>
    `
      )
      .join('')

    const voucherCopy = (copyType) => `
      <div style="flex: 1; border: 2px solid #0f172a; padding: 20px; border-radius: 12px; position: relative;">
        <div style="position: absolute; top: 0; right: 20px; background: #0f172a; color: #fff; padding: 4px 12px; font-size: 10px; font-weight: bold; border-radius: 0 0 8px 8px; text-transform: uppercase;">
          ${copyType} Copy
        </div>
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px; border-bottom: 2px solid #EAB308; padding-bottom: 15px;">
          <img src="${window.location.origin}/logo_print.png" style="width: 50px; height: 50px; object-fit: contain;" onerror="this.style.display='none'" />
          <div>
            <h1 style="font-family: 'Georgia', serif; font-size: 16px; margin: 0; color: #0f172a; text-transform: uppercase;">Professor Model School</h1>
            <p style="font-size: 9px; color: #64748b; margin: 2px 0 0 0;">Dargai, KPK | Phone: 0313-9355501</p>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; font-size: 11px;">
          <div>
            <div style="color: #64748b; font-size: 9px; text-transform: uppercase;">Voucher No</div>
            <strong style="color: #0f172a; font-family: monospace; font-size: 13px;">${voucherNo}</strong>
          </div>
          <div style="text-align: right;">
            <div style="color: #64748b; font-size: 9px; text-transform: uppercase;">Due Date</div>
            <strong style="color: #ef4444;">10th of Month</strong>
          </div>
          <div style="grid-column: span 2; background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0; margin-top: 5px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b; font-size: 10px;">Student ID:</span>
              <strong style="font-family: monospace;">${student.id}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b; font-size: 10px;">Name:</span>
              <strong>${records[0].name}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b; font-size: 10px;">Father/Guardian:</span>
              <strong>${student.father}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b; font-size: 10px;">Class/Section:</span>
              <strong>${records[0].class}</strong>
            </div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="border-bottom: 2px solid #0f172a;">
              <th style="text-align: left; padding: 8px 0; font-size: 11px; color: #64748b; text-transform: uppercase;">Description</th>
              <th style="text-align: right; padding: 8px 0; font-size: 11px; color: #64748b; text-transform: uppercase;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${detailsHtml}
            <tr style="border-bottom: 1px dashed #cbd5e1;">
              <td style="padding: 10px 0; font-size: 13px; color: #1e293b;">Late Fine (If paid after 10th)</td>
              <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #1e293b;">PKR 200</td>
            </tr>
          </tbody>
        </table>

        <div style="background: rgba(234,179,8,0.1); padding: 15px; border-radius: 8px; border: 1px solid #EAB308; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 14px; font-weight: bold; color: #0f172a; text-transform: uppercase;">Total Payable</span>
          <span style="font-size: 20px; font-weight: 900; color: #0f172a;">PKR ${totalAmount.toLocaleString()}</span>
        </div>

        <div style="display: flex; gap: 15px; align-items: center;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${qrData}" style="width: 60px; height: 60px;" />
          <div style="font-size: 9px; color: #64748b; line-height: 1.4;">
            <strong>Payment Instructions:</strong><br/>
            Deposit at administration office or pay via Easypaisa/JazzCash to 0313-9355501. Send screenshot to portal for verification.
          </div>
        </div>
      </div>
    `

    const html = `
      <html>
      <head>
        <title>Fee Voucher - ${records[0].name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
          body { font-family: 'Inter', sans-serif; padding: 20px; margin: 0; background: #ffffff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .voucher-container { display: flex; gap: 20px; width: 100%; max-width: 1000px; margin: 0 auto; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="voucher-container">
          ${voucherCopy('Bank / Office')}
          ${voucherCopy('Student')}
        </div>
        <script>setTimeout(() => window.print(), 800);</script>
      </body>
      </html>
    `
    const win = window.open('', '_blank')
    if (win) {
      win.document.write(html)
      win.document.close()
    }
  }

  const handleGenerate = () => {
    const selected = feeCategories.filter((fc) => fc.selected)
    if (selected.length === 0) {
      alert('Please select at least one fee category.')
      return
    }
    if (
      window.confirm(
        `Generate fee invoices for ALL ${students.length} students for ${genMonth}?`
      )
    ) {
      generateFeesBulk(genMonth, feeCategories)
      alert(`${students.length} fee invoices generated successfully!`)
    }
  }

  const handleEasypaisaSubmit = () => {
    if (!easypaisaForm.studentId || !easypaisaForm.txId) {
      alert('Please fill in required fields.')
      return
    }
    uploadEasypaisaReceipt(
      easypaisaForm.studentId,
      easypaisaForm.name,
      easypaisaForm.amount,
      easypaisaForm.month,
      easypaisaForm.txId,
      easypaisaForm.screenshot
    )
    setEasypaisaForm({
      studentId: '',
      name: '',
      amount: '',
      month: 'June 2026',
      txId: '',
      screenshot: '',
    })
    alert('Payment verification request submitted!')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── Advanced Analytics Dashboard ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: 16,
        }}
      >
        <div
          style={{
            background: 'linear-gradient(145deg, var(--navy-3), var(--navy-2))',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -20,
              right: -20,
              fontSize: 100,
              opacity: 0.05,
            }}
          >
            💰
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            Total Collected (YTD)
          </div>
          <div
            style={{
              fontFamily: 'Cinzel,serif',
              fontSize: 28,
              fontWeight: 800,
              color: '#4ade80',
            }}
          >
            PKR {paidTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: '#4ade80', marginTop: 8 }}>
            +12% from last month
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(145deg, var(--navy-3), var(--navy-2))',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -20,
              right: -20,
              fontSize: 100,
              opacity: 0.05,
            }}
          >
            ⚠️
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            Total Outstanding
          </div>
          <div
            style={{
              fontFamily: 'Cinzel,serif',
              fontSize: 28,
              fontWeight: 800,
              color: '#f87171',
            }}
          >
            PKR {pendingTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: '#f87171', marginTop: 8 }}>
            {overdueCount} students have overdue balances
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(145deg, var(--navy-3), var(--navy-2))',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -20,
              right: -20,
              fontSize: 100,
              opacity: 0.05,
            }}
          >
            📈
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            Collection Rate
          </div>
          <div
            style={{
              fontFamily: 'Cinzel,serif',
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--gold)',
            }}
          >
            {Math.round((paid.length / Math.max(1, feeRecords.length)) * 100)}%
          </div>
          <ProgressBar
            value={paid.length}
            max={Math.max(1, feeRecords.length)}
            color="var(--gold)"
            style={{ marginTop: 12 }}
          />
        </div>

        <div
          style={{
            background: 'linear-gradient(145deg, var(--navy-3), var(--navy-2))',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -20,
              right: -20,
              fontSize: 100,
              opacity: 0.05,
            }}
          >
            📸
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            Pending Verifications
          </div>
          <div
            style={{
              fontFamily: 'Cinzel,serif',
              fontSize: 28,
              fontWeight: 800,
              color: '#60a5fa',
            }}
          >
            {pendingVerifications}
          </div>
          <div
            style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}
          >
            Requires accountant approval
          </div>
        </div>
      </div>

      <TabRow
        tabs={[
          'Record Payments',
          'Pending Online Approvals',
          'Generate Vouchers',
          'Family Combined',
          'AI Defaulter Prediction',
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 0 && (
        <Card
          title="💰 Manual Payment Gateway & Ledgers"
          action={
            <Btn
              size="sm"
              variant="outline"
              onClick={() => {
                let csv =
                  'data:text/csv;charset=utf-8,ID,Student,Class,Month,Amount,Method,Status,Date\\n'
                feeRecords.forEach((f) => {
                  csv += `${f.id},${f.name},${f.class},${f.month},${f.amount},${f.method},${f.status},${f.date}\\n`
                })
                const link = document.createElement('a')
                link.href = encodeURI(csv)
                link.download = 'financial_ledger.csv'
                document.body.appendChild(link)
                link.click()
              }}
            >
              📥 Export General Ledger
            </Btn>
          }
        >
          <Table
            headers={[
              'Invoice ID',
              'Student',
              'Class',
              'Billing Month',
              'Amount Payable',
              'Method',
              'Status',
              'Actions',
            ]}
            rows={feeRecords.slice(0, 15).map((f, i) => [
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 11,
                  color: 'var(--text-muted)',
                }}
              >
                {f.id}
              </span>,
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={f.name} size={30} fontSize={11} />
                <span style={{ fontWeight: 600, fontSize: 13 }}>{f.name}</span>
              </div>,
              f.class,
              <span style={{ fontWeight: 600 }}>{f.month}</span>,
              <span
                style={{
                  color: f.status === 'Paid' ? '#4ade80' : '#ffffff',
                  fontWeight: 700,
                }}
              >
                PKR {f.amount.toLocaleString()}
              </span>,
              <span
                style={{
                  fontSize: 11,
                  background: 'rgba(255,255,255,0.05)',
                  padding: '4px 8px',
                  borderRadius: 4,
                }}
              >
                {f.method}
              </span>,
              <StatusBadge status={f.status} />,
              <Dropdown
                label="⋮ Actions"
                items={[
                  f.status !== 'Paid'
                    ? {
                        label: 'Receive Cash',
                        icon: '💵',
                        onClick: () => payFeeRecord(f.id, 'Cash'),
                      }
                    : {
                        label: 'Undo Payment',
                        icon: '↩️',
                        onClick: () => {
                          if (
                            window.confirm(
                              'Are you sure you want to undo this payment?'
                            )
                          ) {
                            undoFeeRecord(f.id)
                            alert('Payment undone successfully!')
                          }
                        },
                        variant: 'danger',
                      },
                  {
                    label: 'Print Voucher',
                    icon: '🖨️',
                    onClick: () => printVoucher([f]),
                  },
                ].filter(Boolean)}
              />,
            ])}
          />
        </Card>
      )}

      {tab === 1 && (
        <Card title="🔍 Online Payment Verification Workflow">
          <Table
            headers={[
              'Student Info',
              'Amount Transferred',
              'Gateway TXID',
              'Method',
              'Billing Month',
              'Status',
              'Accountant Action',
            ]}
            rows={onlinePayments.map((p, i) => [
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={p.name} size={30} fontSize={11} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    ID: {p.studentId}
                  </div>
                </div>
              </div>,
              <span style={{ color: '#4ade80', fontWeight: 700, fontSize: 14 }}>
                PKR {p.amount.toLocaleString()}
              </span>,
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 13,
                  color: 'var(--gold)',
                }}
              >
                {p.txId}
              </span>,
              <span style={{ fontWeight: 600 }}>{p.method}</span>,
              p.month,
              <StatusBadge
                status={p.status === 'Approved' ? 'Paid' : 'Pending'}
              />,
              p.status !== 'Approved' ? (
                <Dropdown
                  label="⋮ Actions"
                  buttonVariant="primary"
                  items={[
                    {
                      label: 'Approve Match',
                      icon: '✅',
                      onClick: () => {
                        verifyOnlinePayment(p.id)
                        alert(`TXID ${p.txId} Verified! Ledger updated.`)
                      },
                    },
                    {
                      label: 'Reject',
                      icon: '❌',
                      onClick: () => alert('Rejected'),
                      variant: 'danger',
                    },
                  ]}
                />
              ) : (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Badge label="Verified & Posted" variant="success" />
                  <Dropdown
                    label="⋮"
                    items={[
                      {
                        label: 'Undo Approval',
                        icon: '↩️',
                        onClick: () => {
                          if (window.confirm('Undo this approval?')) {
                            undoOnlinePayment(p.id)
                            alert('Online payment approval undone!')
                          }
                        },
                        variant: 'danger',
                      },
                    ]}
                  />
                </div>
              ),
            ])}
          />
        </Card>
      )}

      {tab === 2 && (
        <Card title="⚡ Automated Bulk Invoice Generation">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
              marginBottom: 20,
            }}
          >
            <Input
              label="Billing Month Cycle"
              type="select"
              options={[
                'July 2026',
                'August 2026',
                'September 2026',
                'October 2026',
              ]}
              value={genMonth}
              onChange={(e) => setGenMonth(e.target.value)}
            />
          </div>
          <div
            style={{
              background: 'var(--navy)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: 20,
              marginBottom: 20,
            }}
          >
            <h3
              style={{
                fontSize: 14,
                color: 'var(--gold)',
                margin: '0 0 16px 0',
                fontFamily: 'Cinzel,serif',
              }}
            >
              Global Fee Structure Configuration
            </h3>
            {feeCategories.map((fc, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '12px 0',
                  borderBottom: '1px dashed var(--border)',
                }}
              >
                <input
                  type="checkbox"
                  checked={fc.selected}
                  onChange={(e) =>
                    setFeeCategories((prev) =>
                      prev.map((f, idx) =>
                        idx === i ? { ...f, selected: e.target.checked } : f
                      )
                    )
                  }
                  style={{ accentColor: 'var(--gold)', width: 18, height: 18 }}
                />
                <input
                  type="text"
                  value={fc.name}
                  onChange={(e) =>
                    setFeeCategories((prev) =>
                      prev.map((f, idx) =>
                        idx === i ? { ...f, name: e.target.value } : f
                      )
                    )
                  }
                  style={{
                    flex: 1,
                    fontSize: 14,
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    outline: 'none',
                    fontWeight: 500,
                  }}
                />
                <span
                  style={{
                    color: 'var(--gold)',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 14,
                  }}
                >
                  PKR{' '}
                  <input
                    type="number"
                    value={fc.amount}
                    onChange={(e) =>
                      setFeeCategories((prev) =>
                        prev.map((f, idx) =>
                          idx === i
                            ? { ...f, amount: Number(e.target.value) }
                            : f
                        )
                      )
                    }
                    style={{
                      width: 100,
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--gold)',
                      borderRadius: 6,
                      color: 'var(--gold)',
                      padding: '8px 12px',
                      outline: 'none',
                      fontWeight: 800,
                    }}
                  />
                </span>
              </div>
            ))}
            <div
              style={{
                marginTop: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Btn
                size="sm"
                variant="outline"
                onClick={() =>
                  setFeeCategories([
                    ...feeCategories,
                    {
                      name: 'New Custom Fee Component',
                      amount: 0,
                      selected: true,
                    },
                  ])
                }
              >
                + Add Fee Component
              </Btn>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#4ade80' }}>
                Total Per Invoice: PKR{' '}
                {feeCategories
                  .filter((fc) => fc.selected)
                  .reduce((s, f) => s + Number(f.amount), 0)
                  .toLocaleString()}
              </div>
            </div>
          </div>
          <Btn
            variant="primary"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: 16,
              justifyContent: 'center',
            }}
            onClick={handleGenerate}
          >
            ⚡ Publish {students.length} Invoices for {genMonth}
          </Btn>
        </Card>
      )}

      {tab === 3 && (
        <Card title="👨‍👩‍👧‍👦 Consolidated Family Ledger (Sibling View)">
          <Table
            headers={[
              'Family Account / Guardian',
              'Primary Contact',
              'Enrolled Dependents',
              'Total Cumulative Dues',
              'Actions',
            ]}
            rows={Object.entries(familyGroups).map(([key, groupStudents]) => {
              const stIds = groupStudents.map((s) => s.id)
              const pendingRecords = feeRecords.filter(
                (f) => stIds.includes(f.studentId) && f.status !== 'Paid'
              )
              const totalPending = pendingRecords.reduce(
                (sum, f) => sum + f.amount,
                0
              )

              return [
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar
                    name={groupStudents[0].father}
                    size={30}
                    fontSize={11}
                  />
                  <span style={{ fontWeight: 600, fontSize: 13 }}>
                    {groupStudents[0].father}
                  </span>
                </div>,
                <span style={{ color: 'var(--gold)', fontWeight: 600 }}>
                  {groupStudents[0].contact || 'N/A'}
                </span>,
                <Badge
                  label={`${groupStudents.length} Students`}
                  variant="info"
                />,
                <span
                  style={{
                    color: totalPending > 0 ? '#f87171' : '#4ade80',
                    fontWeight: 800,
                    fontSize: 14,
                  }}
                >
                  PKR {totalPending.toLocaleString()}
                </span>,
                <Btn
                  size="sm"
                  variant="primary"
                  disabled={pendingRecords.length === 0}
                  onClick={() => printVoucher(pendingRecords)}
                >
                  🖨️ Generate Family Master Voucher
                </Btn>,
              ]
            })}
          />
        </Card>
      )}

      {tab === 4 && (
        <Card title="🤖 AI Defaulter Prediction & Revenue Forecasting">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '40px 20px',
              textAlign: 'center',
              background:
                'radial-gradient(ellipse at center, rgba(234,179,8,0.05) 0%, transparent 70%)',
            }}
          >
            <div style={{ fontSize: 60, marginBottom: 16 }}>🧠</div>
            <h3
              style={{
                fontFamily: 'Cinzel,serif',
                fontSize: 24,
                color: 'var(--gold)',
                margin: '0 0 12px 0',
              }}
            >
              AI Financial Analytics Engine
            </h3>
            <p
              style={{
                color: 'var(--text-secondary)',
                maxWidth: 600,
                lineHeight: 1.6,
                marginBottom: 30,
              }}
            >
              The AI model analyzes historical payment patterns to predict which
              students are likely to default on upcoming invoices. It also
              forecasts cash flow for the next quarter.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 20,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  background: 'var(--navy)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 20,
                  width: 250,
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  High Risk of Default
                </div>
                <div
                  style={{ fontSize: 24, fontWeight: 800, color: '#f87171' }}
                >
                  14 Students
                </div>
                <Btn
                  size="sm"
                  variant="outline"
                  style={{
                    marginTop: 12,
                    width: '100%',
                    justifyContent: 'center',
                  }}
                >
                  Send Automated SMS
                </Btn>
              </div>
              <div
                style={{
                  background: 'var(--navy)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 20,
                  width: 250,
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  Projected Revenue (July)
                </div>
                <div
                  style={{ fontSize: 24, fontWeight: 800, color: '#4ade80' }}
                >
                  PKR 1.25M
                </div>
                <Btn
                  size="sm"
                  variant="outline"
                  style={{
                    marginTop: 12,
                    width: '100%',
                    justifyContent: 'center',
                  }}
                >
                  View Trend Chart
                </Btn>
              </div>
            </div>
            <div
              style={{
                marginTop: 30,
                fontSize: 11,
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#4ade80',
                  display: 'inline-block',
                }}
              ></span>
              Model Status: Active & Syncing
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

// ── EXPENSES ───────────────────────────────────────────────────────────────
export function Expenses() {
  const { expenses, addExpenseItem, currentRole } = useDb()
  const [form, setForm] = useState({
    category: 'Teacher Salaries',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    desc: '',
  })
  const total = expenses.reduce((s, e) => s + e.amount, 0)

  const handleSave = () => {
    if (!form.amount) {
      alert('Please enter an amount.')
      return
    }
    addExpenseItem(form)
    setForm({ ...form, amount: '', vendor: '', desc: '' })
    alert('Expense logged successfully!')
  }

  const handleExport = () => {
    let csv = 'data:text/csv;charset=utf-8,Category,Amount (PKR),Percentage\n'
    expenses.forEach((e) => {
      csv += `${e.category},${e.amount},${Math.round((e.amount / total) * 100)}%\n`
    })
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', 'expenses_report.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 14,
        }}
      >
        {[
          { l: 'Total Expenses', v: `PKR ${(total / 1000).toFixed(0)}K` },
          {
            l: 'Salary Payroll',
            v: `PKR ${((expenses.find((e) => e.category.includes('Salaries'))?.amount || 0) / 1000).toFixed(0)}K`,
          },
          {
            l: 'Operating Costs',
            v: `PKR ${((total - (expenses.find((e) => e.category.includes('Salaries'))?.amount || 0)) / 1000).toFixed(0)}K`,
          },
          { l: 'Categories', v: expenses.length },
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
                fontSize: 20,
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
        style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}
      >
        <Card
          title="📊 Expense Breakdown — Current Month"
          action={
            <Btn size="sm" variant="outline" onClick={handleExport}>
              📥 Export CSV
            </Btn>
          }
        >
          {expenses.map((e, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-md)',
                  background: `${e.color}14`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {e.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 5,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    {e.category}
                  </span>
                  <span
                    style={{ fontSize: 13, color: e.color, fontWeight: 700 }}
                  >
                    PKR {e.amount.toLocaleString()}
                  </span>
                </div>
                <ProgressBar
                  value={e.amount}
                  max={total}
                  color={e.color}
                  height={5}
                />
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  minWidth: 32,
                }}
              >
                {Math.round((e.amount / total) * 100)}%
              </span>
            </div>
          ))}
        </Card>
        {(currentRole === 'Super Admin' || currentRole === 'Accountant') && (
          <Card title="➕ Add Expense Entry">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input
                label="Category"
                type="select"
                options={expenses.map((e) => e.category)}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <Input
                label="Amount (PKR)"
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Enter amount..."
              />
              <Input
                label="Date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <Input
                label="Paid To / Vendor"
                value={form.vendor}
                onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                placeholder="Name of vendor or staff..."
              />
              <Input
                label="Description"
                type="textarea"
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                placeholder="Details of expense..."
              />
            </div>
            <Sep />
            <Btn
              variant="primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleSave}
            >
              💾 Save Expense
            </Btn>
          </Card>
        )}
      </div>
    </div>
  )
}

// ── PARENTS ────────────────────────────────────────────────────────────────
export function Parents() {
  const { students, currentRole, addLog } = useDb()
  const [notifForm, setNotifForm] = useState({
    to: 'All Parents',
    channel: 'WhatsApp',
    message: '',
  })

  const [loading, setLoading] = useState(false)

  const handleSendNotification = async () => {
    if (!notifForm.message) {
      alert('Please enter a message.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifForm)
      });
      const data = await res.json();
      
      if (data.success) {
        addLog(
          currentRole,
          `Notification sent via ${notifForm.channel} to "${notifForm.to}"`
        )
        if (data.mock) {
          alert(`✅ [MOCK MODE] Notification sent via ${notifForm.channel} to ${notifForm.to}!\n(Add Twilio keys to .env for real delivery)`);
        } else {
          alert(`✅ Notification successfully sent via Twilio!`);
        }
        setNotifForm({ ...notifForm, message: '' })
      } else {
        alert('❌ Failed to send: ' + data.error);
      }
    } catch (e) {
      alert('❌ Error: ' + e.message);
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 14,
        }}
      >
        {[
          { l: 'Registered Parents', v: students.length },
          { l: 'Active This Week', v: Math.round(students.length * 0.6) },
          { l: 'Messages Sent', v: '1.2K' },
          { l: 'Online Fee Payments', v: 78 },
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
        style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}
      >
        <Card title="👪 Parent Directory">
          <Table
            headers={[
              'Parent Name',
              'Child',
              'Class',
              'Last Login',
              'Fee Status',
              'Actions',
            ]}
            rows={students.slice(0, 8).map((s, i) => [
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar name={s.father} size={26} fontSize={9} />
                <span style={{ fontWeight: 600, fontSize: 12 }}>
                  {s.father}
                </span>
              </div>,
              s.name,
              `${s.class}-${s.section}`,
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {i < 3 ? 'Today' : `${i + 1}d ago`}
              </span>,
              <StatusBadge status={s.fee} />,
              <Btn
                size="sm"
                variant="outline"
                onClick={() => {
                  const phone = s.contact ? s.contact.replace(/\D/g, '') : ''
                  if (phone) {
                    window.open(
                      `https://wa.me/${phone}?text=Dear%20${encodeURIComponent(s.father)},%20`,
                      '_blank'
                    )
                  } else {
                    alert(`No contact number registered for ${s.father}.`)
                  }
                }}
              >
                📲 Message
              </Btn>,
            ])}
          />
        </Card>
        <Card title="📱 Bulk Notification Broadcast">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input
              label="Send To"
              type="select"
              options={[
                'All Parents',
                'Class 5 Parents',
                'Fee Defaulters',
                'Absent Students Parents',
                'All Students',
              ]}
              value={notifForm.to}
              onChange={(e) =>
                setNotifForm({ ...notifForm, to: e.target.value })
              }
            />
            <Input
              label="Channel"
              type="select"
              options={['WhatsApp', 'SMS', 'Email', 'All Channels']}
              value={notifForm.channel}
              onChange={(e) =>
                setNotifForm({ ...notifForm, channel: e.target.value })
              }
            />
            <Input
              label="Message"
              type="textarea"
              value={notifForm.message}
              onChange={(e) =>
                setNotifForm({ ...notifForm, message: e.target.value })
              }
              placeholder="Type your message to parents..."
            />
          </div>
          <Sep />
          <Btn
            variant="primary"
            style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
            onClick={handleSendNotification}
            disabled={loading}
          >
            {loading ? '⏳ Sending...' : '📤 Send Notification'}
          </Btn>
        </Card>
      </div>
    </div>
  )
}

// ── ANNOUNCEMENTS ──────────────────────────────────────────────────────────
export function Announcements() {
  const { announcements, addAnnouncementItem, currentRole } = useDb()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    title: '',
    priority: 'Medium',
    body: '',
    channels: 'All Channels',
  })

  const priorityColor = (p) =>
    p === 'High' ? '#f87171' : p === 'Medium' ? '#fbbf24' : '#60a5fa'

  const handlePublish = () => {
    if (!form.title || !form.body) {
      alert('Title and body are required.')
      return
    }
    addAnnouncementItem(form)
    setShowAdd(false)
    setForm({
      title: '',
      priority: 'Medium',
      body: '',
      channels: 'All Channels',
    })
    alert('Announcement published and delivered to all selected channels!')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {(currentRole === 'Super Admin' || currentRole === 'Principal') && (
          <Btn variant="primary" onClick={() => setShowAdd(true)}>
            + New Announcement
          </Btn>
        )}
      </div>
      <Card title="📢 All Announcements">
        {announcements.map((a, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 14,
              padding: '16px 0',
              borderBottom: '1px solid var(--border)',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: `${priorityColor(a.type)}12`,
                border: `1px solid ${priorityColor(a.type)}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              {a.type === 'High' ? '🚨' : a.type === 'Medium' ? '⚠️' : 'ℹ️'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{a.title}</div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  marginTop: 4,
                  lineHeight: 1.5,
                }}
              >
                {a.body}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 8,
                  flexWrap: 'wrap',
                }}
              >
                <Badge
                  label={`Priority: ${a.type}`}
                  variant={
                    a.type === 'High'
                      ? 'danger'
                      : a.type === 'Medium'
                        ? 'warning'
                        : 'info'
                  }
                />
                {(a.channels || []).map((c) => (
                  <span
                    key={c}
                    style={{
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                      padding: '2px 8px',
                    }}
                  >
                    📡 {c}
                  </span>
                ))}
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  📅 {a.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </Card>
      {showAdd && (
        <Modal
          title="📢 New Announcement"
          onClose={() => setShowAdd(false)}
          width={520}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input
              label="Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Announcement title..."
            />
            <Input
              label="Priority"
              type="select"
              options={['High', 'Medium', 'Low']}
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            />
            <Input
              label="Message Body"
              type="textarea"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Announcement content..."
            />
            <Input
              label="Delivery Channels"
              type="select"
              options={[
                'All Channels',
                'Dashboard Only',
                'WhatsApp',
                'SMS',
                'Email',
              ]}
              value={form.channels}
              onChange={(e) => setForm({ ...form, channels: e.target.value })}
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
            <Btn variant="primary" onClick={handlePublish}>
              📤 Publish Now
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── LIBRARY ────────────────────────────────────────────────────────────────
export function Library() {
  const {
    books,
    checkoutBookItem,
    returnBookItem,
    addLibraryBook,
    students,
    currentRole,
  } = useDb()
  const [showAdd, setShowAdd] = useState(false)
  const [showIssue, setShowIssue] = useState(null)
  const [issueForm, setIssueForm] = useState({ studentId: '', dueDate: '' })
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    qty: '',
  })

  const totalQty = books.reduce((s, b) => s + b.qty, 0)
  const totalIssued = books.reduce((s, b) => s + b.issued, 0)

  const handleIssue = () => {
    if (!issueForm.studentId || !issueForm.dueDate) {
      alert('Please select student and due date.')
      return
    }
    const student = students.find((s) => s.id === issueForm.studentId)
    if (!student) {
      alert('Student ID not found.')
      return
    }
    checkoutBookItem(
      showIssue.id,
      issueForm.studentId,
      student.name,
      issueForm.dueDate
    )
    setShowIssue(null)
    setIssueForm({ studentId: '', dueDate: '' })
    alert(`Book "${showIssue.title}" issued to ${student.name}!`)
  }

  const handleReturn = (book) => {
    if (!book.checkouts || book.checkouts.length === 0) {
      alert('No active checkouts for this book.')
      return
    }
    const lastCheckout = book.checkouts.find((c) => c.status === 'Issued')
    if (!lastCheckout) {
      alert('All checkouts already returned.')
      return
    }
    const today = new Date()
    const due = new Date(lastCheckout.dueDate)
    const daysLate = Math.max(
      0,
      Math.ceil((today - due) / (1000 * 60 * 60 * 24))
    )
    const fine = daysLate * 10 // PKR 10 per day fine
    returnBookItem(book.id, lastCheckout.id, fine)
    alert(
      `Book returned! ${fine > 0 ? `Late fine: PKR ${fine} (${daysLate} days overdue)` : 'Returned on time, no fine.'}`
    )
  }

  const handleAddBook = () => {
    if (!bookForm.title || !bookForm.qty) {
      alert('Please fill in title and quantity.')
      return
    }
    addLibraryBook(bookForm)
    setShowAdd(false)
    setBookForm({ title: '', author: '', isbn: '', qty: '' })
    alert('Book added to library catalog!')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
          gap: 14,
        }}
      >
        {[
          { l: 'Total Titles', v: books.length },
          { l: 'Total Stock', v: totalQty },
          { l: 'Issued / Loans', v: totalIssued },
          { l: 'Available Now', v: totalQty - totalIssued },
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
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        {(currentRole === 'Super Admin' || currentRole === 'Librarian') && (
          <Btn variant="primary" onClick={() => setShowAdd(true)}>
            + Add Book to Catalog
          </Btn>
        )}
      </div>
      <Card title="📖 Book Catalog">
        <Table
          headers={[
            'Book ID',
            'Title',
            'Author',
            'ISBN',
            'Qty',
            'Issued',
            'Available',
            'Status',
            'Actions',
          ]}
          rows={books.map((b, i) => [
            <span
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                fontFamily: 'monospace',
              }}
            >
              {b.id}
            </span>,
            <span style={{ fontWeight: 600 }}>{b.title}</span>,
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {b.author}
            </span>,
            <span
              style={{
                fontSize: 11,
                fontFamily: 'monospace',
                color: 'var(--text-muted)',
              }}
            >
              {b.isbn}
            </span>,
            b.qty,
            <span style={{ color: '#fbbf24' }}>{b.issued}</span>,
            <span
              style={{ color: b.qty - b.issued > 0 ? '#4ade80' : '#f87171' }}
            >
              {b.qty - b.issued}
            </span>,
            <StatusBadge
              status={b.qty - b.issued > 0 ? 'Available' : 'All Issued'}
            />,
            <div style={{ display: 'flex', gap: 6 }}>
              {(currentRole === 'Super Admin' || currentRole === 'Librarian') &&
                b.qty - b.issued > 0 && (
                  <Btn
                    size="sm"
                    variant="outline"
                    onClick={() => setShowIssue(b)}
                  >
                    📥 Issue
                  </Btn>
                )}
              {(currentRole === 'Super Admin' || currentRole === 'Librarian') &&
                b.issued > 0 && (
                  <Btn
                    size="sm"
                    variant="success"
                    onClick={() => handleReturn(b)}
                  >
                    📤 Return
                  </Btn>
                )}
            </div>,
          ])}
        />
      </Card>

      {showIssue && (
        <Modal
          title={`📥 Issue Book — ${showIssue.title}`}
          onClose={() => setShowIssue(null)}
          width={420}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input
              label="Student ID"
              value={issueForm.studentId}
              onChange={(e) =>
                setIssueForm({ ...issueForm, studentId: e.target.value })
              }
              placeholder="e.g. PMS-2026-001"
            />
            <Input
              label="Return Due Date"
              type="date"
              value={issueForm.dueDate}
              onChange={(e) =>
                setIssueForm({ ...issueForm, dueDate: e.target.value })
              }
            />
          </div>
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
              marginTop: 16,
            }}
          >
            <Btn variant="ghost" onClick={() => setShowIssue(null)}>
              Cancel
            </Btn>
            <Btn variant="primary" onClick={handleIssue}>
              Confirm Issue
            </Btn>
          </div>
        </Modal>
      )}

      {showAdd && (
        <Modal
          title="➕ Add New Book"
          onClose={() => setShowAdd(false)}
          width={420}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input
              label="Book Title *"
              value={bookForm.title}
              onChange={(e) =>
                setBookForm({ ...bookForm, title: e.target.value })
              }
              placeholder="e.g. Physics Class 10"
            />
            <Input
              label="Author"
              value={bookForm.author}
              onChange={(e) =>
                setBookForm({ ...bookForm, author: e.target.value })
              }
              placeholder="Publisher name"
            />
            <Input
              label="ISBN"
              value={bookForm.isbn}
              onChange={(e) =>
                setBookForm({ ...bookForm, isbn: e.target.value })
              }
              placeholder="978-XXXXXXXXX"
            />
            <Input
              label="Quantity *"
              type="number"
              value={bookForm.qty}
              onChange={(e) =>
                setBookForm({ ...bookForm, qty: e.target.value })
              }
              placeholder="Number of copies"
            />
          </div>
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
              marginTop: 16,
            }}
          >
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>
              Cancel
            </Btn>
            <Btn variant="primary" onClick={handleAddBook}>
              Add to Catalog
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── REPORTS ────────────────────────────────────────────────────────────────
export function Reports() {
  const {
    students,
    teachers,
    feeRecords,
    examResults,
    homework,
    expenses,
    auditLogs,
  } = useDb()

  const exportCSV = (name, headers, rows) => {
    let csv = `data:text/csv;charset=utf-8,${headers.join(',')}\n`
    rows.forEach((r) => {
      csv += r.join(',') + '\n'
    })
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', `${name}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportWordDoc = (filename, title, headers, rows) => {
    // Get absolute URL for the logo so MS Word can load it
    const logoUrl = window.location.origin + '/logo_print.png'

    const headerHtml = `
      <table style="width: 100%; border-bottom: 3pt double #EAB308; padding-bottom: 15pt; margin-bottom: 20pt;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width: 110px; text-align: center; vertical-align: middle;">
            <img src="${logoUrl}" width="90" height="90" alt="Logo" style="border-radius: 8px;" />
          </td>
          <td style="vertical-align: middle; text-align: center;">
            <h1 style="font-family: 'Georgia', 'Times New Roman', serif; font-size: 26pt; font-weight: bold; color: #0B162C; margin: 0 0 4pt 0; text-transform: uppercase; letter-spacing: 1px;">Professor Model School</h1>
            <p style="font-family: 'Arial', sans-serif; font-size: 11pt; color: #EAB308; font-weight: bold; margin: 0 0 6pt 0; letter-spacing: 2px;">EXCELLENCE IN EDUCATION</p>
            <p style="font-family: 'Arial', sans-serif; font-size: 10pt; color: #475569; margin: 0;">Main Mardan Road, Manga Dargai, KPK &nbsp;|&nbsp; Phone: 0313-9355501</p>
          </td>
          <td style="width: 110px;"></td> <!-- Balance the table -->
        </tr>
      </table>
      
      <div style="text-align: center; margin-bottom: 25pt;">
        <div style="display: inline-block; background-color: #0f172a; padding: 8pt 25pt; border: 1pt solid #EAB308;">
          <h2 style="font-family: 'Arial', sans-serif; font-size: 14pt; font-weight: bold; color: #ffffff; margin: 0; text-transform: uppercase; letter-spacing: 2px;">${title}</h2>
        </div>
        <p style="font-family: 'Arial', sans-serif; font-size: 10pt; color: #64748b; margin-top: 12pt; font-style: italic;">
          Generated on: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} &nbsp;|&nbsp; Official Administrative Record
        </p>
      </div>
    `

    const tableHtml = `
      <table cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse; font-family: 'Arial', sans-serif; font-size: 10.5pt; border: 1pt solid #e2e8f0;">
        <thead>
          <tr>
            ${headers.map((h) => `<th style="background-color: #0f172a; color: #ffffff; text-align: left; padding: 12pt 10pt; border-bottom: 3pt solid #EAB308; font-weight: bold; text-transform: uppercase; font-size: 9pt; letter-spacing: 0.5px;">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row, i) => `
            <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
              ${row.map((cell) => `<td style="padding: 10pt; color: #1e293b; border-bottom: 1pt solid #e2e8f0; border-right: 1pt solid #f1f5f9;">${cell}</td>`).join('')}
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `

    const docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            @page {
              size: 21cm 29.7cm; /* A4 size */
              margin: 1.5cm 1.5cm;
            }
            body {
              font-family: 'Arial', sans-serif;
              color: #1e293b;
              background-color: #ffffff;
            }
          </style>
        </head>
        <body>
          ${headerHtml}
          ${tableHtml}
          <div style="margin-top: 40pt; font-family: 'Arial', sans-serif; font-size: 9pt; color: #94a3b8; text-align: center; border-top: 1pt solid #e2e8f0; padding-top: 12pt;">
            <strong>Confidentiality Notice:</strong> This document contains sensitive institutional data. Unauthorized distribution is prohibited.<br/>
            &copy; ${new Date().getFullYear()} Professor Model School Management System
          </div>
        </body>
      </html>
    `

    // Convert to Blob and trigger download
    const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.doc`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const reports = [
    {
      icon: '👨‍🎓',
      title: 'Student Register',
      desc: 'Complete student list with all enrolled details including attendance and fee status.',
      formats: ['Word Doc', 'CSV'],
      data: () => ({
        filename: 'student_register',
        title: 'STUDENT REGISTER REPORT',
        headers: [
          'ID',
          'Name',
          'Father Name',
          'Class',
          'Section',
          'Gender',
          'Attendance',
          'Grade',
          'Fee Status',
        ],
        rows: students.map((s) => [
          s.id,
          s.name,
          s.father,
          s.class,
          s.section,
          s.gender,
          s.att + '%',
          s.grade,
          s.fee,
        ]),
      }),
    },
    {
      icon: '📅',
      title: 'Attendance Report',
      desc: 'Student-wise attendance percentage summary to track overall engagement.',
      formats: ['Word Doc', 'CSV'],
      data: () => ({
        filename: 'attendance_report',
        title: 'ATTENDANCE SUMMARY REPORT',
        headers: ['Student Name', 'Class', 'Attendance %', 'Status'],
        rows: students.map((s) => [
          s.name,
          s.class,
          s.att + '%',
          s.att >= 75 ? 'OK' : 'LOW',
        ]),
      }),
    },
    {
      icon: '💰',
      title: 'Fee Collection',
      desc: 'Monthly fee invoices, collection totals, and defaulter tracking.',
      formats: ['Word Doc', 'CSV'],
      data: () => ({
        filename: 'fee_report',
        title: 'FEE COLLECTION REPORT',
        headers: [
          'Student Name',
          'Class',
          'Month',
          'Amount',
          'Method',
          'Status',
        ],
        rows: feeRecords.map((f) => [
          f.name,
          f.class,
          f.month,
          `PKR ${f.amount}`,
          f.method,
          f.status,
        ]),
      }),
    },
    {
      icon: '📝',
      title: 'Exam Result Analysis',
      desc: 'Class-wise exam result distribution, subject scores, and final grades.',
      formats: ['Word Doc', 'CSV'],
      data: () => ({
        filename: 'exam_results',
        title: 'EXAM RESULT ANALYSIS',
        headers: [
          'Student',
          'Class',
          'Math',
          'English',
          'Urdu',
          'Science',
          'Islamic',
          'Total',
          '%',
          'Grade',
          'Position',
        ],
        rows: examResults.map((r) => [
          r.student,
          r.class,
          r.math,
          r.eng,
          r.urdu,
          r.sci,
          r.isl,
          r.total,
          Math.round((r.total / r.max) * 100) + '%',
          r.grade,
          '#' + (r.pos || 1),
        ]),
      }),
    },
    {
      icon: '🏆',
      title: 'Top Performers',
      desc: 'Ranked list of best-performing students across the school.',
      formats: ['Word Doc', 'CSV'],
      data: () => ({
        filename: 'top_performers',
        title: 'TOP PERFORMERS LIST',
        headers: ['Rank', 'Student Name', 'Class', 'Total Score', 'Grade'],
        rows: [...examResults]
          .sort((a, b) => b.total - a.total)
          .slice(0, 10)
          .map((r, i) => [i + 1, r.student, r.class, r.total, r.grade]),
      }),
    },
    {
      icon: '📊',
      title: 'Financial Statement',
      desc: 'Income statement balancing fee revenue versus logged operating expenses.',
      formats: ['Word Doc', 'CSV'],
      data: () => ({
        filename: 'financial_report',
        title: 'FINANCIAL STATEMENT',
        headers: ['Category / Source', 'Amount (PKR)', 'Transaction Type'],
        rows: [
          ...feeRecords
            .filter((f) => f.status === 'Paid')
            .map((f) => [f.name + ' Tuition Fee', `PKR ${f.amount}`, 'Income']),
          ...expenses.map((e) => [e.category, `PKR ${e.amount}`, 'Expense']),
        ],
      }),
    },
    {
      icon: '👩‍🏫',
      title: 'Staff & Payroll',
      desc: 'Full teaching staff profiles, assigned subjects, and salary information.',
      formats: ['Word Doc', 'CSV'],
      data: () => ({
        filename: 'teacher_register',
        title: 'TEACHING STAFF & PAYROLL REGISTER',
        headers: [
          'ID',
          'Name',
          'Main Subject',
          'Qualification',
          'Experience',
          'Salary',
          'Status',
        ],
        rows: teachers.map((t) => [
          t.id,
          t.name,
          t.subject,
          t.qual,
          t.exp,
          `PKR ${t.salary}`,
          t.status,
        ]),
      }),
    },
    {
      icon: '🔍',
      title: 'System Audit Logs',
      desc: 'Security report detailing system activity and user action logs.',
      formats: ['Word Doc', 'CSV'],
      data: () => ({
        filename: 'audit_logs',
        title: 'SYSTEM AUDIT LOGS',
        headers: ['Timestamp', 'User Role', 'Action Taken', 'IP Address'],
        rows: auditLogs
          .slice(0, 50)
          .map((l) => [l.time, l.user, l.action, l.ip]),
      }),
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
        gap: 24,
      }}
    >
      {reports.map((r, i) => (
        <div
          key={i}
          style={{
            background: 'linear-gradient(145deg, #1e293b, #0f172a)',
            border: '1px solid #334155',
            borderRadius: '20px',
            padding: '28px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)'
            e.currentTarget.style.borderColor = '#EAB308'
            e.currentTarget.style.boxShadow =
              '0 25px 30px -5px rgba(0, 0, 0, 0.6), 0 0 20px rgba(234,179,8,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.borderColor = '#334155'
            e.currentTarget.style.boxShadow =
              '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #EAB308, #F3E5AB)',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                flexShrink: 0,
                boxShadow: '0 8px 15px rgba(234,179,8,0.3)',
              }}
            >
              {r.icon}
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 800,
                  fontSize: 20,
                  color: '#ffffff',
                  letterSpacing: '0.5px',
                }}
              >
                {r.title}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {r.formats.map((f) => (
                  <span
                    key={f}
                    style={{
                      fontSize: 10,
                      color: '#EAB308',
                      background: 'rgba(234,179,8,0.1)',
                      border: '1px solid rgba(234,179,8,0.3)',
                      borderRadius: 20,
                      padding: '4px 12px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontWeight: 800,
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 15,
              color: '#e2e8f0',
              marginBottom: 28,
              lineHeight: 1.7,
              flexGrow: 1,
              fontWeight: 500,
            }}
          >
            {r.desc}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
            <Btn
              size="md"
              variant="primary"
              style={{
                flex: 1,
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #EAB308, #CA8A04)',
                color: '#000000',
                fontWeight: 800,
                fontSize: 13,
                border: 'none',
                boxShadow: '0 4px 10px rgba(234,179,8,0.3)',
              }}
              onClick={() => {
                const d = r.data()
                exportWordDoc(d.filename, d.title, d.headers, d.rows)
              }}
            >
              📥 WORD DOC
            </Btn>
            <Btn
              size="md"
              variant="outline"
              style={{
                flex: 1,
                justifyContent: 'center',
                borderColor: '#475569',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 13,
                background: 'rgba(255,255,255,0.05)',
              }}
              onClick={() => {
                const d = r.data()
                exportCSV(d.filename, d.headers, d.rows)
              }}
            >
              📊 CSV FILE
            </Btn>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── SETTINGS ───────────────────────────────────────────────────────────────
export function Settings() {
  const {
    getBackupPayload,
    restoreFromPayload,
    auditLogs,
    complaints,
    logComplaint,
    resolveComplaint,
    visitors,
    logVisitorEntry,
    logVisitorExit,
    currentRole,
  } = useDb()
  const [tab, setTab] = useState(0)
  const [complaintForm, setComplaintForm] = useState({
    type: 'Student',
    from: '',
    body: '',
  })
  const [visitorForm, setVisitorForm] = useState({
    name: '',
    purpose: '',
    contact: '',
  })
  const fileInputRef = useRef(null)

  const handleBackupDownload = () => {
    const payload = getBackupPayload()
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `pms_backup_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    alert('✅ Full database backup downloaded successfully!')
  }

  const handleRestoreUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (
        window.confirm(
          '⚠️ This will REPLACE all current data with backup data. Are you sure?'
        )
      ) {
        const result = restoreFromPayload(ev.target.result)
        if (result.success) {
          alert(
            '✅ Database restored from backup successfully! Reload the page to see changes.'
          )
        } else {
          alert(`❌ Restore failed: ${result.error}`)
        }
      }
    }
    reader.readAsText(file)
  }

  const handleFactoryReset = () => {
    const confirmation = window.prompt(
      '🚨 DANGER: This will permanently wipe ALL data (students, fees, teachers, etc.) from this browser. This cannot be undone.\n\nType "RESET" to confirm:'
    )
    if (confirmation === 'RESET') {
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) && localStorage.key(i).startsWith('pms_')) {
          keysToRemove.push(localStorage.key(i))
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k))
      alert(
        'All data has been wiped. The system will now reload into a completely blank slate.'
      )
      window.location.reload()
    } else if (confirmation !== null) {
      alert('Factory reset cancelled. Invalid confirmation text.')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <TabRow
        tabs={[
          'School Info',
          'Security',
          'Backup & Restore',
          'Complaints',
          'Visitor Log',
          'Audit Logs',
          'User Roles',
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 0 && (
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
        >
          <Card title="🏫 School Information">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['School Name', 'Professor Model School Dargai'],
                ['Principal Name', 'Muhammad Daud Khan'],
                ['Location', 'Main Mardan Road, Manga Dargai'],
                ['District', 'Charsadda, KPK, Pakistan'],
                ['Phone / WhatsApp', '03139355501'],
                ['Email', 'sulaimanpms855@gmail.com'],
                ['Easypaisa', '03139355501'],
              ].map(([l, v]) => (
                <Input key={l} label={l} defaultValue={v} />
              ))}
            </div>
            <Sep />
            <Btn variant="primary" onClick={() => alert('School info saved!')}>
              💾 Save Changes
            </Btn>
          </Card>
          <Card title="🎓 Academic Settings">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input label="Current Academic Year" defaultValue="2025–2026" />
              <Input
                label="Grading System"
                type="select"
                options={['A+/A/B+/B/C/D/F', 'Percentage Only', 'GPA 4.0']}
              />
              <Input label="Pass Percentage (%)" defaultValue="33" />
              <Input
                label="Fee Due Date (Monthly)"
                defaultValue="10th of each month"
              />
              <Input label="Late Fee Fine (PKR)" defaultValue="200" />
              <Input label="School Timing" defaultValue="8:00 AM – 1:00 PM" />
            </div>
            <Sep />
            <Btn
              variant="primary"
              onClick={() => alert('Academic settings saved!')}
            >
              💾 Save Settings
            </Btn>
          </Card>
        </div>
      )}

      {tab === 1 && (
        <Card title="🔐 Security & Access Control">
          {[
            {
              icon: '🔒',
              label: 'SSL/TLS Encryption',
              desc: 'All data transmitted via HTTPS encryption',
              status: 'Active',
            },
            {
              icon: '🛡️',
              label: 'Two-Factor Authentication',
              desc: 'Require 2FA for admin accounts',
              status: 'Enabled',
            },
            {
              icon: '📋',
              label: 'Audit Logs',
              desc: 'Track all admin activities and changes',
              status: 'Active',
            },
            {
              icon: '🔑',
              label: 'Role-Based Access Control',
              desc: 'Users only see their permitted modules',
              status: 'Enabled',
            },
            {
              icon: '⏱️',
              label: 'Session Timeout',
              desc: 'Auto logout after 30 mins of inactivity',
              status: '30 min',
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    marginTop: 2,
                  }}
                >
                  {s.desc}
                </div>
              </div>
              <Badge label={s.status} variant="success" />
              <Btn
                size="sm"
                variant="outline"
                onClick={() => alert(`${s.label} configuration panel`)}
              >
                Configure
              </Btn>
            </div>
          ))}
        </Card>
      )}

      {tab === 2 && (
        <Card title="☁️ Data Backup & Recovery">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                background: 'rgba(74,222,128,0.06)',
                border: '1px solid rgba(74,222,128,0.2)',
                borderRadius: 'var(--radius-lg)',
                padding: 20,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📥</div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                Export Full Backup
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  marginBottom: 14,
                }}
              >
                Download all database records as a JSON backup file. Store it
                safely for recovery purposes.
              </p>
              <Btn
                variant="success"
                onClick={handleBackupDownload}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                ⬇️ Download JSON Backup
              </Btn>
            </div>
            <div
              style={{
                background: 'rgba(248,113,113,0.06)',
                border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: 'var(--radius-lg)',
                padding: 20,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📤</div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                Restore From Backup
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  marginBottom: 14,
                }}
              >
                Upload a previously exported JSON file to restore the complete
                database state.
              </p>
              <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleRestoreUpload}
              />
              <Btn
                variant="primary"
                onClick={() => fileInputRef.current?.click()}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                ⬆️ Upload & Restore
              </Btn>
            </div>
          </div>
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: 20,
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            <div style={{ fontWeight: 700, color: '#ef4444', marginBottom: 8 }}>
              ⚠️ DANGER ZONE: Factory Reset
            </div>
            <p
              style={{
                fontSize: 12,
                color: 'var(--text-secondary)',
                marginBottom: 14,
              }}
            >
              This will instantly wipe the entire database and reset the system
              to a clean, empty state. Only do this if you want to clear all
              demo or testing data.
            </p>
            <Btn variant="danger" onClick={handleFactoryReset}>
              🗑️ Wipe All Database Records
            </Btn>
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              padding: 12,
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 8,
            }}
          >
            💡 <strong>Tip:</strong> The backup includes students, teachers,
            fees, exam results, library, homework, and all system logs. Schedule
            regular exports for data safety.
          </div>
        </Card>
      )}

      {tab === 3 && (
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}
        >
          <Card title="📋 Complaint Registry">
            <Table
              headers={[
                '#',
                'Type',
                'From',
                'Description',
                'Date',
                'Status',
                'Action',
              ]}
              rows={complaints.map((c, i) => [
                i + 1,
                c.type,
                c.from,
                <span style={{ fontSize: 11 }}>{c.body.slice(0, 60)}...</span>,
                c.date,
                <StatusBadge status={c.status} />,
                c.status !== 'Resolved' ? (
                  <Btn
                    size="sm"
                    variant="success"
                    onClick={() => resolveComplaint(c.id)}
                  >
                    ✅ Resolve
                  </Btn>
                ) : (
                  <Badge label="Done" variant="success" />
                ),
              ])}
            />
          </Card>
          <Card title="➕ Submit Complaint">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input
                label="Complaint Type"
                type="select"
                options={['Student', 'Parent', 'Teacher', 'Facility']}
                value={complaintForm.type}
                onChange={(e) =>
                  setComplaintForm({ ...complaintForm, type: e.target.value })
                }
              />
              <Input
                label="Submitted By"
                value={complaintForm.from}
                onChange={(e) =>
                  setComplaintForm({ ...complaintForm, from: e.target.value })
                }
                placeholder="Name or ID"
              />
              <Input
                label="Complaint Details"
                type="textarea"
                value={complaintForm.body}
                onChange={(e) =>
                  setComplaintForm({ ...complaintForm, body: e.target.value })
                }
                placeholder="Describe the issue..."
              />
              <Btn
                variant="primary"
                onClick={() => {
                  logComplaint(complaintForm)
                  setComplaintForm({ type: 'Student', from: '', body: '' })
                  alert('Complaint logged!')
                }}
              >
                Submit
              </Btn>
            </div>
          </Card>
        </div>
      )}

      {tab === 4 && (
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}
        >
          <Card title="🏢 Visitor Log">
            <Table
              headers={[
                '#',
                'Name',
                'Purpose',
                'Contact',
                'In Time',
                'Out Time',
                'Date',
                'Action',
              ]}
              rows={visitors.map((v, i) => [
                i + 1,
                v.name,
                v.purpose,
                v.contact,
                v.inTime,
                v.outTime,
                v.date,
                v.outTime === '—' ? (
                  <Btn
                    size="sm"
                    variant="outline"
                    onClick={() => logVisitorExit(v.id)}
                  >
                    Check Out
                  </Btn>
                ) : (
                  <Badge label="Exited" variant="success" />
                ),
              ])}
            />
          </Card>
          <Card title="🚪 Log Visitor Entry">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input
                label="Visitor Name"
                value={visitorForm.name}
                onChange={(e) =>
                  setVisitorForm({ ...visitorForm, name: e.target.value })
                }
                placeholder="Full name"
              />
              <Input
                label="Purpose"
                type="select"
                options={[
                  'Admissions Inquiry',
                  'Parent Meeting',
                  'Vendor Delivery',
                  'Official Visit',
                  'Other',
                ]}
                value={visitorForm.purpose}
                onChange={(e) =>
                  setVisitorForm({ ...visitorForm, purpose: e.target.value })
                }
              />
              <Input
                label="Contact Number"
                value={visitorForm.contact}
                onChange={(e) =>
                  setVisitorForm({ ...visitorForm, contact: e.target.value })
                }
                placeholder="03XX-XXXXXXX"
              />
              <Btn
                variant="primary"
                onClick={() => {
                  logVisitorEntry(visitorForm)
                  setVisitorForm({
                    name: '',
                    purpose: 'Admissions Inquiry',
                    contact: '',
                  })
                  alert('Visitor logged in!')
                }}
              >
                Log Entry
              </Btn>
            </div>
          </Card>
        </div>
      )}

      {tab === 5 && (
        <Card title="🔍 System Audit Logs">
          <Table
            headers={[
              'Timestamp',
              'User / Role',
              'Action Performed',
              'IP Address',
            ]}
            rows={auditLogs
              .slice(0, 30)
              .map((l) => [
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'monospace',
                    color: 'var(--text-muted)',
                  }}
                >
                  {l.time}
                </span>,
                <Badge label={l.user} variant="info" />,
                <span style={{ fontSize: 12 }}>{l.action}</span>,
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {l.ip}
                </span>,
              ])}
          />
        </Card>
      )}

      {tab === 6 && (
        <Card title="👥 User Roles & Permissions">
          <Table
            headers={[
              'Role',
              'Permissions',
              'Students',
              'Fees',
              'Reports',
              'Settings',
            ]}
            rows={[
              [
                'Super Admin',
                '✅ Full Access',
                '✅ CRUD',
                '✅ All',
                '✅ All',
                '✅ All',
              ],
              [
                'Principal',
                '✅ View + Approve',
                '✅ View',
                '✅ View',
                '✅ All',
                '✅ Info',
              ],
              [
                'Teacher',
                '✅ Own Classes',
                '✅ Own Class',
                '—',
                '⚡ Partial',
                '⚡ Profile',
              ],
              [
                'Accountant',
                '⚡ Finance Only',
                '—',
                '✅ All',
                '✅ Financial',
                '⚡ Profile',
              ],
              [
                'Librarian',
                '⚡ Library Only',
                '—',
                '—',
                '⚡ Library',
                '⚡ Profile',
              ],
              ['Student', '📖 Learning Only', '—', '📋 Own', '—', '—'],
              ['Parent', '👪 Child Only', '—', '📋 Own Child', '—', '—'],
            ].map((r) => [
              <span style={{ fontWeight: 600, color: 'var(--gold)' }}>
                {r[0]}
              </span>,
              ...r
                .slice(1)
                .map((v) => <span style={{ fontSize: 12 }}>{v}</span>),
            ])}
          />
        </Card>
      )}
    </div>
  )
}
