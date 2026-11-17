import React, { useEffect, useRef, useState } from 'react'
import { demoFetch } from './demo.mjs'

// ---------- api (falls back to in-browser demo store when no server) ----------
let DEMO = false
async function req(path, init) {
  if (!DEMO) {
    try {
      const r = await fetch(path, init)
      return await r.json()
    } catch (e) {
      DEMO = true
    }
  }
  return demoFetch(path, init)
}
export const api = {
  async get(path) {
    return req(path, { headers: Api.user() })
  },
  async send(path, method, body, isForm) {
    const h = Api.user()
    return req(path, {
      method,
      headers: isForm ? h : { 'Content-Type': 'application/json', ...h },
      body: isForm ? body : (body ? JSON.stringify(body) : undefined)
    })
  },
  user: () => ({ 'x-user': encodeURIComponent(localStorage.getItem('nvic-user') || 'guest') }),
  isDemo: () => DEMO
}
const Api = api

export async function mutate(path, method, body, isForm, onDone) {
  const res = await api.send(path, method, body, isForm)
  if (onDone) onDone(res)
  return res
}

// ---------- helpers ----------
const KA_MONTHS = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი']
const kaLang = () => (localStorage.getItem('nvic-lang') || 'ka') === 'ka'
export const fmtDate = (d) => {
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(dt)) return d
  if (kaLang()) return `${dt.getFullYear()} წლის ${dt.getDate()} ${KA_MONTHS[dt.getMonth()]}`
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
export const ago = (d) => {
  const s = (Date.now() - new Date(d).getTime()) / 1000
  if (kaLang()) {
    if (s < 60) return 'ახლახან'
    if (s < 3600) return `${Math.floor(s / 60)} წუთის წინ`
    if (s < 86400) return `${Math.floor(s / 3600)} საათის წინ`
    return `${Math.floor(s / 86400)} დღის წინ`
  }
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}
export const size = (b) => kaLang()
  ? (b > 1048576 ? (b / 1048576).toFixed(1) + ' მბ' : b > 1024 ? Math.round(b / 1024) + ' კბ' : b ? b + ' ბაიტი' : '')
  : (b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : b > 1024 ? Math.round(b / 1024) + ' KB' : b ? b + ' B' : '')

// ---------- icons ----------
const P = {
  dash: 'M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z',
  check: 'M20 6 9 17l-5-5',
  doc: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6M9 13h6M9 17h6',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  help: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-14a2 2 0 1 1 2 2c-1 0-2 .8-2 2m0 3.5v.5',
  link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  cal: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  note: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z',
  bolt: 'M13 2 3 14h9l-1 8 10-12h-9l1-8Z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-14v5l3.5 2',
  plus: 'M12 5v14M5 12h14',
  x: 'M18 6 6 18M6 6l12 12',
  up: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  down: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z',
  trash: 'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35',
  flag: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1Zm0 0v6',
  target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-6a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  building: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 10h.01M15 10h.01M9 13h.01M15 13h.01',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm18 3-10 6L2 7',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z',
  chev: 'm9 18 6-6-6-6',
  spark: 'M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.2 2.2m8.4 8.4 2.2 2.2m0-12.8-2.2 2.2M7.8 16.2l-2.2 2.2M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
  globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-11 2 2 4-4',
  trophy: 'M8 21h8m-4-4v4M6.5 4h11a1.5 1.5 0 0 1 1.5 1.5c0 4-2.5 7.5-7 7.5s-7-3.5-7-7.5A1.5 1.5 0 0 1 6.5 4ZM6.5 6H4a2 2 0 0 0-2 2c0 2 1.5 3 3 3m12.5-5H20a2 2 0 0 1 2 2c0 2-1.5 3-3 3',
  inbox: 'M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3Z',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  send: 'm22 2-7 20-4-9-9-4 20-7Z',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  rocket: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09ZM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2ZM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0m1 4v5s3.03-.55 4-2c1.08-1.62 0-5 0-5'
}
export function Icon({ n, s = 18, cls = '' }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden>
      <path d={P[n] || P.dash} />
    </svg>
  )
}

// ---------- primitives ----------
export function Badge({ children, tone = 'mut', cls = '' }) {
  const tones = {
    mut: 'bg-ink-800 text-mut border-line',
    cy: 'bg-cy/10 text-cy border-cy/30',
    ok: 'bg-ok/10 text-ok border-ok/30',
    warn: 'bg-warn/10 text-warn border-warn/30',
    bad: 'bg-bad/10 text-bad border-bad/30',
    vio: 'bg-vio/10 text-vio border-vio/30',
    amb: 'bg-amb/10 text-amb border-amb/30'
  }
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap ${tones[tone]} ${cls}`}>{children}</span>
}

export function Btn({ children, onClick, tone = 'ghost', type = 'button', cls = '', icon, disabled }) {
  const tones = {
    primary: 'bg-cy text-ink-950 font-semibold hover:bg-cy/85 shadow-[0_4px_20px_-4px_rgba(56,189,248,.5)]',
    ghost: 'bg-ink-800 text-fg border border-line hover:border-line-strong hover:bg-ink-700',
    danger: 'bg-bad/10 text-bad border border-bad/30 hover:bg-bad/20',
    quiet: 'text-mut hover:text-fg hover:bg-ink-700/60'
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm transition-colors disabled:opacity-40 disabled:pointer-events-none ${tones[tone]} ${cls}`}>
      {icon && <Icon n={icon} s={16} />}{children}
    </button>
  )
}

export function Ring({ value, size = 46, stroke = 5, tone = 'var(--color-cy)' }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(0,42,65,.10)" strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={tone} strokeWidth={stroke} fill="none" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - (value || 0))} style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.2,.7,.3,1)' }} />
    </svg>
  )
}

export function Bar({ value, tone = 'bg-cy', h = 'h-2' }) {
  return (
    <div className={`w-full ${h} rounded-full bg-ink-700 overflow-hidden`}>
      <div className={`${h} rounded-full ${tone} transition-all duration-700`} style={{ width: `${Math.round((value || 0) * 100)}%` }} />
    </div>
  )
}

export function Modal({ open, onClose, title, children, wide }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    if (open) window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 overflow-y-auto">
      <div className="fixed inset-0 bg-cy-deep/40 backdrop-blur-sm fade" onClick={onClose} />
      <div className={`card relative w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} my-auto pop p-6 sm:p-7`}>
        <div className="flex items-start justify-between gap-4 mb-5">
          <h3 className="font-display text-xl font-bold tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-dim hover:text-fg p-1 -m-1 rounded-lg hover:bg-ink-700/60 transition-colors"><Icon n="x" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Field({ label, children, cls = '' }) {
  return (
    <label className={`block ${cls}`}>
      <span className="block text-[11px] uppercase tracking-[0.14em] text-dim font-semibold mb-1.5">{label}</span>
      {children}
    </label>
  )
}
export const inp = 'w-full bg-ink-950 border border-line rounded-xl px-3.5 py-2.5 text-sm text-fg placeholder:text-dim focus:border-cy/50 transition-colors'

export function Empty({ icon = 'inbox', title, hint, action }) {
  return (
    <div className="card p-10 text-center rise">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-ink-800 border border-line flex items-center justify-center text-cy mb-4">
        <Icon n={icon} s={26} />
      </div>
      <div className="font-display font-semibold text-lg">{title}</div>
      {hint && <div className="text-mut text-sm mt-1.5 max-w-md mx-auto">{hint}</div>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}

export function PageHead({ title, ka, desc, right }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6 rise">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
        {ka && <div className="text-mut text-sm mt-1">{ka}</div>}
        {desc && <p className="text-mut text-sm mt-1.5 max-w-2xl">{desc}</p>}
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  )
}

export function useToast() {
  const [t, setT] = useState(null)
  const timer = useRef()
  const show = (msg) => {
    setT(msg)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setT(null), 2600)
  }
  const node = t && (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] pop">
      <div className="card glow-cy px-5 py-3 text-sm font-medium flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-ok pulse-dot" />{t}
      </div>
    </div>
  )
  return [show, node]
}
