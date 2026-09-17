import { useState, useRef, useEffect } from 'react'

// ── Stat Card ──────────────────────────────────────────────────────────────
export function StatCard({
  icon,
  value,
  label,
  sub,
  color = 'var(--gold)',
  delay = 0,
  onClick,
}) {
  return (
    <div
      style={{
        background: 'rgba(15,31,61,0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        animation: `fadeInUp 0.4s ease ${delay}s both`,
        transition: 'var(--transition)',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
      className={onClick ? 'card-3d' : ''}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-strong)'
        if (onClick)
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)'
        if (onClick) e.currentTarget.style.transform = 'translateY(0) scale(1)'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `${color}08`,
        }}
      />
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 28,
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 12,
          color: 'var(--text-secondary)',
          marginTop: 6,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

// ── Card ───────────────────────────────────────────────────────────────────
export function Card({ children, style = {}, title, action, className = '' }) {
  return (
    <div
      className={`card-3d ${className}`}
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--padding-card)',
        animation: 'fadeInUp 0.35s ease both',
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          {title && (
            <h3
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--gold)',
                letterSpacing: 0.5,
              }}
            >
              {title}
            </h3>
          )}
          {action && <div style={{ display: 'flex', gap: 8 }}>{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

// ── Button ─────────────────────────────────────────────────────────────────
export function Btn({
  children,
  onClick,
  variant = 'outline',
  size = 'md',
  style = {},
  disabled = false,
}) {
  const base = {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    transition: 'var(--transition)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    opacity: disabled ? 0.5 : 1,
    ...style,
  }
  const sizes = {
    sm: { padding: '5px 12px', fontSize: 11 },
    md: { padding: '8px 18px', fontSize: 13 },
    lg: { padding: '10px 24px', fontSize: 14 },
  }
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
      color: 'var(--navy)',
      boxShadow: '0 2px 12px rgba(234,179,8,0.25)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--gold)',
      border: '1px solid var(--border-strong)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent',
    },
    danger: {
      background: 'transparent',
      color: '#f87171',
      border: '1px solid rgba(248,113,113,0.3)',
    },
    success: {
      background: 'rgba(74,222,128,0.1)',
      color: '#4ade80',
      border: '1px solid rgba(74,222,128,0.3)',
    },
  }
  return (
    <button
      style={{ ...base, ...sizes[size], ...variants[variant] }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          if (variant === 'primary') e.currentTarget.style.opacity = '0.9'
          else if (variant === 'outline')
            e.currentTarget.style.background = 'var(--gold)15'
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') e.currentTarget.style.opacity = '1'
        else if (variant === 'outline')
          e.currentTarget.style.background = 'transparent'
      }}
    >
      {children}
    </button>
  )
}

// ── Input ──────────────────────────────────────────────────────────────────
export function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  name,
  required,
  options,
  style = {},
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && (
        <label
          style={{
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            color: 'var(--gold-dim)',
          }}
        >
          {label}
          {required && ' *'}
        </label>
      )}
      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={{
            background: 'var(--navy)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            padding: '9px 12px',
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            outline: 'none',
            width: '100%',
            cursor: 'pointer',
            ...style,
          }}
        >
          {options?.map((o) => (
            <option key={o.value ?? o} value={o.value ?? o}>
              {o.label ?? o}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          style={{
            background: 'var(--navy)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            padding: '9px 12px',
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            outline: 'none',
            resize: 'vertical',
            width: '100%',
            ...style,
          }}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            background: 'var(--navy)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            padding: '9px 12px',
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            outline: 'none',
            width: '100%',
            ...style,
          }}
        />
      )}
    </div>
  )
}

// ── Badge / Status ─────────────────────────────────────────────────────────
export function Badge({ label, variant = 'default' }) {
  const variants = {
    default: {
      bg: 'rgba(234,179,8,0.12)',
      color: 'var(--gold)',
      border: 'rgba(234,179,8,0.25)',
    },
    success: {
      bg: 'rgba(74,222,128,0.1)',
      color: '#4ade80',
      border: 'rgba(74,222,128,0.25)',
    },
    danger: {
      bg: 'rgba(248,113,113,0.1)',
      color: '#f87171',
      border: 'rgba(248,113,113,0.25)',
    },
    warning: {
      bg: 'rgba(251,191,36,0.1)',
      color: '#fbbf24',
      border: 'rgba(251,191,36,0.25)',
    },
    info: {
      bg: 'rgba(96,165,250,0.1)',
      color: '#60a5fa',
      border: 'rgba(96,165,250,0.25)',
    },
  }
  const v = variants[variant] || variants.default
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
      }}
    >
      {label}
    </span>
  )
}

export function StatusBadge({ status }) {
  const map = {
    Paid: 'success',
    Active: 'success',
    Pending: 'warning',
    Overdue: 'danger',
    'On Leave': 'warning',
    Inactive: 'danger',
    'Due Today': 'danger',
    Available: 'success',
    'All Issued': 'danger',
  }
  return <Badge label={status} variant={map[status] || 'default'} />
}

// ── Progress Bar ──────────────────────────────────────────────────────────
export function ProgressBar({
  value,
  max = 100,
  color = 'var(--gold)',
  height = 6,
}) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div
      style={{
        height,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 4,
        overflow: 'hidden',
        flex: 1,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background:
            pct < 70
              ? 'linear-gradient(90deg, #dc2626, #f87171)'
              : `linear-gradient(90deg, ${color}99, ${color})`,
          borderRadius: 4,
          transition: 'width 0.6s ease',
        }}
      />
    </div>
  )
}

// ── Tab Row ────────────────────────────────────────────────────────────────
export function TabRow({ tabs, active, onChange }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        marginBottom: 24,
        flexWrap: 'wrap',
        borderBottom: '1px solid var(--border)',
        paddingBottom: 0,
      }}
    >
      {tabs.map((t, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          style={{
            padding: '9px 18px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            color: active === i ? 'var(--gold)' : 'var(--text-secondary)',
            borderBottom:
              active === i ? '2px solid var(--gold)' : '2px solid transparent',
            marginBottom: '-1px',
            transition: 'var(--transition)',
          }}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, width = 560 }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, var(--navy-3), var(--navy-2))',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--padding-card)',
          width,
          maxWidth: '95vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'fadeInUp 0.25s ease both',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--gold)',
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 20,
              lineHeight: 1,
              padding: 4,
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Table ─────────────────────────────────────────────────────────────────
export function Table({ headers, rows, emptyMsg = 'No data available.' }) {
  return (
    <div className="responsive-table-wrapper">
      <table
        style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}
      >
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: '10px 14px',
                  textAlign: 'left',
                  color: 'var(--gold)',
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  borderBottom: '1px solid var(--border)',
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                style={{
                  padding: '32px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                }}
              >
                {emptyMsg}
              </td>
            </tr>
          ) : (
            rows.map((row, ri) => (
              <tr
                key={ri}
                style={{ borderBottom: '1px solid rgba(234,179,8,0.06)' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'rgba(234,179,8,0.04)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'transparent')
                }
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: '11px 14px',
                      color: 'var(--text-primary)',
                      verticalAlign: 'middle',
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

// ── Search Input ──────────────────────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: 12,
          color: 'var(--text-muted)',
          fontSize: 14,
          pointerEvents: 'none',
        }}
      >
        🔍
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: 'var(--navy)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-primary)',
          padding: '9px 12px 9px 34px',
          fontSize: 13,
          fontFamily: "'DM Sans', sans-serif",
          outline: 'none',
          width: 260,
        }}
      />
    </div>
  )
}

// ── Avatar ────────────────────────────────────────────────────────────────
export function Avatar({ name, size = 36, fontSize = 13 }) {
  const safeName = name || 'Unknown'
  const initials = safeName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase()
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize,
        color: 'var(--navy)',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

// ── Separator ─────────────────────────────────────────────────────────────
export function Sep() {
  return (
    <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />
  )
}

// ── Loading Spinner ───────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div
      style={{
        width: 20,
        height: 20,
        border: '2px solid var(--border)',
        borderTopColor: 'var(--gold)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  )
}

// ── Mini Chart Bar ────────────────────────────────────────────────────────
export function MiniBar({ data, labels, color = 'var(--gold)', height = 80 }) {
  const max = Math.max(...data)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height }}>
        {data.map((v, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <div
              style={{
                width: '100%',
                borderRadius: '3px 3px 0 0',
                background: `linear-gradient(180deg, ${color}, ${color}66)`,
                height: `${Math.round((v / max) * height)}px`,
                minHeight: 4,
                transition: 'height 0.5s ease',
              }}
            />
          </div>
        ))}
      </div>
      {labels && (
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          {labels.map((l, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 9,
                color: 'var(--text-muted)',
              }}
            >
              {l}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Dropdown ──────────────────────────────────────────────────────────────
export function Dropdown({
  label = '⋮ Actions',
  icon,
  items,
  style = {},
  buttonVariant = 'outline',
}) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <div
      ref={dropdownRef}
      style={{ position: 'relative', display: 'inline-block', ...style }}
    >
      <Btn size="sm" variant={buttonVariant} onClick={() => setOpen(!open)}>
        {icon && <span style={{ marginRight: label ? 6 : 0 }}>{icon}</span>}
        {label}
      </Btn>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 4,
            minWidth: 180,
            background: 'var(--navy)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
            zIndex: 9999,
            overflow: 'hidden',
            animation: 'fadeInUp 0.15s ease both',
          }}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
                item.onClick()
              }}
              style={{
                width: '100%',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'transparent',
                border: 'none',
                borderBottom:
                  idx < items.length - 1
                    ? '1px solid rgba(255,255,255,0.03)'
                    : 'none',
                color:
                  item.variant === 'danger' ? '#f87171' : 'var(--text-primary)',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  item.variant === 'danger'
                    ? 'rgba(248,113,113,0.1)'
                    : 'rgba(234,179,8,0.08)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              {item.icon && (
                <span style={{ width: 16, textAlign: 'center' }}>
                  {item.icon}
                </span>
              )}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
