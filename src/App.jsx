import React, { useEffect, useMemo, useState } from 'react'
import { api, Icon, Badge, Bar, Btn, Modal, Field, inp } from './ui.jsx'
import { demoReset } from './demo.mjs'
import { LangProvider, useLang, useT, kaTask, kaDoc, kaEvent, kaResp, kaQuestion, kaNote, kaActor } from './i18n.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Competition from './pages/Competition.jsx'
import Checklist from './pages/Checklist.jsx'
import Documents from './pages/Documents.jsx'
import Sponsors from './pages/Sponsors.jsx'
import Questions from './pages/Questions.jsx'
import Links from './pages/Links.jsx'
import People from './pages/People.jsx'
import Calendar from './pages/Calendar.jsx'
import Notes from './pages/Notes.jsx'
import Activity from './pages/Activity.jsx'

const NAV = [
  ['dashboard', 'მიმოხილვა', 'Dashboard', 'dash'],
  ['competition', 'კონკურსი — სრული აღწერა', 'The Competition', 'trophy'],
  ['checklist', 'დაწყებისთვის მოსამზადებელი ამოცანები', 'Launch Checklist', 'check'],
  ['documents', 'დოკუმენტები', 'Documents', 'doc'],
  ['sponsors', 'სპონსორები და პარტნიორები', 'Sponsors & Partners', 'users'],
  ['questions', 'გადასაწყვეტი საკითხები', 'Open Questions', 'help'],
  ['links', 'ბმულები და რესურსები', 'Links & Resources', 'link'],
  ['people', 'გუნდი და როლები', 'People & Roles', 'building'],
  ['calendar', 'კალენდარი', 'Calendar', 'cal'],
  ['notes', 'ჩანაწერები', 'Notes', 'note'],
  ['activity', 'ცვლილებების ისტორია', 'Activity', 'bolt']
]

const LAUNCH = new Date('2026-11-30T00:00:00+04:00').getTime()

export function useCountdown() {
  const [ms, setMs] = useState(LAUNCH - Date.now())
  useEffect(() => {
    const t = setInterval(() => setMs(LAUNCH - Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const s = Math.max(0, Math.floor(ms / 1000))
  return { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60, past: ms <= 0 }
}

export default function App() {
  return (
    <LangProvider>
      <Shell />
    </LangProvider>
  )
}

function Shell() {
  const t = useT()
  const { lang, setLang } = useLang()
  const [data, setData] = useState(null)
  const [page, setPage] = useState(localStorage.getItem('nvic-page') || 'dashboard')
  const [user, setUser] = useState(localStorage.getItem('nvic-user') || '')
  const [picker, setPicker] = useState(!localStorage.getItem('nvic-user'))
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null)
  const [demo, setDemo] = useState(false)

  const refresh = () => api.get('/api/bootstrap').then((d) => { setData(d); setDemo(api.isDemo()) })
  useEffect(() => { refresh() }, [])
  useEffect(() => { localStorage.setItem('nvic-page', page) }, [page])

  useEffect(() => {
    if (!q.trim()) return setResults(null)
    const t2 = setTimeout(() => api.get('/api/search?q=' + encodeURIComponent(q)).then(setResults), 180)
    return () => clearTimeout(t2)
  }, [q])

  const go = (p) => { setPage(p); setQ(''); setResults(null) }
  const jump = (r) => {
    const map = { tasks: 'checklist', documents: 'documents', sponsors: 'sponsors', questions: 'questions', links: 'links', notes: 'notes', people: 'people' }
    go(map[r._t] || 'dashboard')
  }

  const typeKa = { tasks: 'ამოცანა', documents: 'დოკუმენტი', sponsors: 'სპონსორი', questions: 'საკითხი', links: 'ბმული', notes: 'ჩანაწერი', people: 'გუნდის წევრი' }
  const typeEn = { tasks: 'Task', documents: 'Document', sponsors: 'Sponsor', questions: 'Question', links: 'Link', notes: 'Note', people: 'Person' }
  const resultText = (r) => {
    if (lang !== 'ka') return r.title || r.name || r.q || r.body || r.url || ''
    const m = { tasks: kaTask, documents: kaDoc, events: kaEvent, responsibilities: kaResp, questions: kaQuestion, notes: kaNote }
    if (m[r._t]) { const v = m[r._t](r.id); return (typeof v === 'string' ? v : v?.name || v?.title || v?.q || v?.func) || r.title || r.name || r.q || r.body || '' }
    return r.title || r.name || r.q || r.body || r.url || ''
  }

  const cd = useCountdown()
  if (!data) return (
    <div className="h-full blueprint flex items-center justify-center">
      <div className="text-center">
        <img src="/nvu-logo.svg" alt="New Vision University" className="h-14 w-auto mx-auto mb-5" />
        <div className="font-display text-xl font-semibold tracking-tight">{t('საორგანიზაციო სივრცე იტვირთება…', 'Preparing the organizing hub…')}</div>
        <div className="text-mut text-sm mt-2 pulse-dot">New Vision Innovation Challenge</div>
      </div>
    </div>
  )

  return (
    <div className="h-full flex blueprint">
      {/* sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-line bg-white/85 backdrop-blur-md flex-col">
        <div className="px-5 pt-6 pb-5 border-b border-line">
          <img src="/nvu-logo.svg" alt="New Vision University" className="h-11 w-auto" />
          <div className="mt-3.5">
            <div className="font-display font-bold tracking-tight leading-tight text-lg">NVIC <span className="text-cy">{t('საორგანიზაციო სივრცე', 'Launch Hub')}</span></div>
            <div className="text-[11px] text-dim mt-0.5">New Vision Innovation Challenge</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV.map(([id, ka, en, icon]) => {
            const active = page === id
            const badge =
              id === 'checklist' ? `${data.tasks.filter(x => x.status === 'done').length}/${data.tasks.length}` :
              id === 'documents' ? `${data.documents.filter(x => x.status === 'approved').length}/${data.documents.length}` :
              id === 'questions' ? data.questions.filter(x => x.status === 'open').length :
              id === 'sponsors' ? data.sponsors.filter(x => x.stage === 'committed').length || '' : ''
            return (
              <button key={id} onClick={() => go(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${active ? 'bg-cy/10 text-cy border border-cy/25' : 'text-mut hover:text-fg hover:bg-ink-950 border border-transparent'}`}>
                <Icon n={icon} s={17} />
                <span className="flex-1 leading-snug">{lang === 'ka' ? ka : en}</span>
                {badge !== '' && <span className={`text-[10px] px-1.5 py-0.5 rounded-full tabular-nums ${active ? 'bg-cy/15 text-cy' : 'bg-ink-800 text-mut'}`}>{badge}</span>}
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-line">
          <div className="card p-3.5 !rounded-xl">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-dim mb-1">
              <span>{t('დაწყების თარიღი', 'Launch day')}</span>
              <span className="text-cy font-semibold">{t('30 ნოემბერი', 'Nov 30')}</span>
            </div>
            <div className="font-display text-2xl font-bold tracking-tight">{cd.past ? t('გახსნილია', 'LIVE') : `${cd.d} ${t('დღე', 'days')}`}</div>
            <div className="text-[11px] text-dim mt-0.5">{t('რეგისტრაციის გახსნამდე', 'until registration opens')}</div>
            <Bar value={cd.past ? 1 : 1 - cd.d / 13} h="h-1.5" />
          </div>
        </div>
      </aside>

      {/* main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="shrink-0 h-16 border-b border-line bg-white/85 backdrop-blur-md flex items-center gap-3 px-4 sm:px-6">
          <select value={page} onChange={e => go(e.target.value)} className="md:hidden bg-ink-950 border border-line rounded-xl px-2 py-2 text-sm">
            {NAV.map(([id, ka, en]) => <option key={id} value={id}>{lang === 'ka' ? ka : en}</option>)}
          </select>
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dim"><Icon n="search" s={16} /></span>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('ძებნა ამოცანებში, დოკუმენტებში, სპონსორებში, საკითხებში…', 'Search tasks, documents, sponsors, questions…')}
              className="w-full bg-ink-950 border border-line rounded-xl pl-9 pr-3 py-2 text-sm placeholder:text-dim focus:border-cy/50 transition-colors" />
            {results && q.trim() && (
              <div className="absolute top-full mt-2 w-full card overflow-hidden pop max-h-96 overflow-y-auto z-40">
                {['tasks', 'documents', 'sponsors', 'questions', 'links', 'notes', 'people'].flatMap(t2 => (results[t2] || []).map(r => ({ ...r, _t: t2 }))).slice(0, 12).map(r => (
                  <button key={r._t + r.id} onClick={() => jump(r)} className="w-full text-left px-4 py-2.5 hover:bg-ink-950 flex items-center gap-3 border-b border-line last:border-0">
                    <Badge tone="mut">{(lang === 'ka' ? typeKa : typeEn)[r._t]}</Badge>
                    <span className="text-sm truncate">{resultText(r)}</span>
                  </button>
                ))}
                {['tasks', 'documents', 'sponsors', 'questions', 'links', 'notes', 'people'].reduce((n, t2) => n + (results[t2] || []).length, 0) === 0 && (
                  <div className="px-4 py-3 text-sm text-dim">{t('ვერ მოიძებნა', 'Not found')}</div>
                )}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className={`hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${cd.past ? 'bg-ok/10 border-ok/30 text-ok' : 'bg-ink-950 border-line text-mut'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cd.past ? 'bg-ok' : 'bg-cy'} pulse-dot`} />
              {cd.past ? t('რეგისტრაცია გახსნილია', 'Registration is live') : t(`დაწყებამდე: ${cd.d} დღე ${cd.h} სთ ${cd.m} წთ`, `Launch in ${cd.d}d ${cd.h}h ${cd.m}m`)}
            </div>
            {/* language switcher */}
            <button onClick={() => setLang(lang === 'ka' ? 'en' : 'ka')} title={lang === 'ka' ? 'Switch to English' : 'ქართულზე გადართვა'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-950 border border-line hover:border-line-strong transition-colors text-xs font-semibold">
              <Icon n="globe" s={14} />
              {lang === 'ka' ? 'ქართული' : 'English'}
            </button>
            <button onClick={() => setPicker(true)} className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full bg-ink-800 border border-line hover:border-line-strong transition-colors">
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-cy to-cy-deep flex items-center justify-center text-white text-xs font-bold">{kaActor(user || '?')[0].toUpperCase()}</span>
              <span className="text-sm font-medium hidden sm:inline">{user ? kaActor(user) : t('სტუმარი', 'guest')}</span>
            </button>
          </div>
        </header>

        {demo && (
          <div className="px-4 sm:px-8 pt-4 -mb-4">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-amb/30 bg-amb/10 text-amb px-4 py-2.5 text-xs sm:text-sm">
              <span className="font-bold">◈ {t('წინასწარი ნახვის რეჟიმი', 'Preview mode')}</span>
              <span className="opacity-90">{t('სრული პლატფორმა მუშაობს ბრაუზერში — ყველა ცვლილება ინახება მხოლოდ ამ მოწყობილობაზე.', 'The full platform runs in your browser — every change is saved on this device only.')}</span>
              <button onClick={() => confirm(t('მონაცემები საწყის მდგომარეობაში დაბრუნდეს?', 'Reset demo data to the original state?')) && demoReset()}
                className="ml-auto underline underline-offset-2 font-semibold opacity-80 hover:opacity-100">{t('დემოს გადატვირთვა', 'Reset demo')}</button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
          {page === 'dashboard' && <Dashboard data={data} refresh={refresh} go={go} />}
          {page === 'competition' && <Competition />}
          {page === 'checklist' && <Checklist data={data} refresh={refresh} />}
          {page === 'documents' && <Documents data={data} refresh={refresh} />}
          {page === 'sponsors' && <Sponsors data={data} refresh={refresh} />}
          {page === 'questions' && <Questions data={data} refresh={refresh} />}
          {page === 'links' && <Links data={data} refresh={refresh} />}
          {page === 'people' && <People data={data} refresh={refresh} />}
          {page === 'calendar' && <Calendar data={data} refresh={refresh} />}
          {page === 'notes' && <Notes data={data} refresh={refresh} />}
          {page === 'activity' && <Activity data={data} />}
        </main>
      </div>

      <Modal open={picker} onClose={() => setPicker(false)} title={t('ვინ მუშაობს?', "Who's working?")}>
        <img src="/nvu-logo.svg" alt="New Vision University" className="h-9 w-auto mb-4 -mt-2" />
        <p className="text-mut text-sm mb-4 -mt-2">{t('თქვენი სახელი ემაგრება ყველა ცვლილებას, რომელსაც აკეთებთ, რათა საორგანიზაციო გუნდმა ყოველთვის იცოდეს, ვინ რა შეცვალა. პაროლი არ სჭირდება — ეს შიდა საგუნდო ინსტრუმენტია.', 'Your name is attached to every change you make, so the organizing team always knows who did what. No password — this is an internal team tool.')}</p>
        <IdentityPicker onDone={(name) => { setUser(name); localStorage.setItem('nvic-user', name); setPicker(false); refresh() }} />
      </Modal>
    </div>
  )
}

function IdentityPicker({ onDone }) {
  const t = useT()
  const quick = ['Nata', 'Anri']
  const [name, setName] = useState('')
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {quick.map(n => <Btn key={n} onClick={() => onDone(n)} tone="primary" cls="!rounded-full">{n}</Btn>)}
      </div>
      <form onSubmit={e => { e.preventDefault(); if (name.trim()) onDone(name.trim()) }} className="flex gap-2">
        <input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder={t('ან ჩაწერეთ თქვენი სახელი…', 'Or type your name…')} className={inp} />
        <Btn type="submit" tone="primary">{t('შესვლა', 'Enter')}</Btn>
      </form>
    </div>
  )
}
