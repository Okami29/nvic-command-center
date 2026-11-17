import React from 'react'
import { Icon, Badge, Bar, Ring, fmtDate, ago } from '../ui.jsx'
import { useLang, useT, kaTask, kaWs, kaEvent, kaQuestion, kaActor, ACT_KA } from '../i18n.jsx'
import { useCountdown } from '../App.jsx'

export default function Dashboard({ data, go }) {
  const t = useT()
  const { lang } = useLang()
  const cd = useCountdown()

  const essential = data.tasks.filter(x => x.priority === 'essential')
  const doneEss = essential.filter(x => x.status === 'done').length
  const doneAll = data.tasks.filter(x => x.status === 'done').length
  const doing = data.tasks.filter(x => x.status === 'doing').length
  const openQ = data.questions.filter(q => q.status === 'open')
  const committed = data.sponsors.filter(s => s.stage === 'committed').length
  const readiness = essential.length ? Math.round(doneEss / essential.length * 100) : 0

  return (
    <div className="space-y-8">
      {/* hero */}
      <div className="card glow-cy relative overflow-hidden p-6 sm:p-8 rise">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(700px 240px at 88% 0%, rgba(0,97,111,.08), transparent 70%)' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-cy font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cy pulse-dot" /> {t('პირველი გასამართი 2026–27', 'First Edition 2026–27')}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              {lang === 'ka' ? <>ნიუ ვიჟენის ინოვაციების<br />კონკურსი</> : <>New Vision Innovation<br />Challenge</>}
            </h1>
            <p className="text-mut mt-3 max-w-xl text-sm sm:text-base">
              {lang === 'ka'
                ? <>ორგანიზატორი — ნიუ ვიჟენ უნივერსიტეტი · რეგისტრაცია იხსნება <b className="text-fg">2026 წლის 30 ნოემბერს</b> · ეროვნული ფინალი <b className="text-fg">2027 წლის 20 მარტს</b></>
                : <>Organized by New Vision University · Registration opens <b className="text-fg">Nov 30, 2026</b> · National Final <b className="text-fg">March 20, 2027</b></>}
            </p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <img src="/nvu-logo.svg" alt="New Vision University" className="h-10 w-auto opacity-90" />
            <div className="flex gap-3 sm:gap-4">
              {[[t('დღე', 'Days'), cd.d], [t('საათი', 'Hours'), cd.h], [t('წუთი', 'Min'), cd.m], [t('წამი', 'Sec'), cd.s]].map(([l, v]) => (
                <div key={l} className="card !rounded-2xl px-3 py-3 sm:px-5 sm:py-4 text-center min-w-[64px] sm:min-w-[76px] bg-ink-950">
                  <div className="font-display text-2xl sm:text-4xl font-bold tabular-nums text-cy">{String(v).padStart(2, '0')}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-dim mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon="target" tone="cy" ring={readiness}
          big={`${readiness}%`} label={t('დაწყების მზადყოფნა', 'Launch readiness')}
          sub={t(`${doneEss}/${essential.length} დაწყებამდე აუცილებელი ამოცანა`, `${doneEss}/${essential.length} essential tasks`)} />
        <Stat icon="check" tone="ok" big={`${doneAll}/${data.tasks.length}`} label={t('ყველა ამოცანა', 'All tasks')}
          sub={t(`${doing} მიმდინარეობს`, `${doing} in progress`)} />
        <Stat icon="help" tone="warn" big={openQ.length} label={t('გადასაწყვეტი საკითხები', 'Open questions')}
          sub={t('კომიტეტის პასუხის მოლოდინში', 'awaiting committee answers')} />
        <Stat icon="users" tone="vio" big={committed} label={t('სპონსორები და პარტნიორები', 'Sponsors & partners')}
          sub={t(`${data.sponsors.length} პიპლაინში · ${committed} დადასტურებული`, `${data.sponsors.length} in pipeline · ${committed} committed`)} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* workstreams */}
        <div className="card p-5 sm:p-6 rise">
          <h2 className="font-display font-bold tracking-tight mb-4">{t('სამუშაო მიმართულებების პროგრესი', 'Workstream progress')}</h2>
          <div className="space-y-4">
            {data.workstreams.map(ws => {
              const tasks = data.tasks.filter(x => x.ws === ws.id)
              const done = tasks.filter(x => x.status === 'done').length
              const w = lang === 'ka' ? kaWs(ws.id) : null
              return (
                <button key={ws.id} onClick={() => go('checklist')} className="w-full text-left group">
                  <div className="flex items-center justify-between text-sm mb-1.5 gap-3">
                    <span className="font-medium group-hover:text-cy transition-colors leading-snug">{w ? w.name : ws.name}</span>
                    <span className="text-dim tabular-nums text-xs shrink-0">{done}/{tasks.length}</span>
                  </div>
                  <Bar v={tasks.length ? done / tasks.length : 0} />
                </button>
              )
            })}
          </div>
        </div>

        {/* key dates */}
        <div className="card p-5 sm:p-6 rise">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold tracking-tight">{t('მთავარი თარიღები', 'Key dates')}</h2>
            <button onClick={() => go('calendar')} className="text-xs text-cy hover:underline shrink-0">{t('ყველას ნახვა', 'View all')}</button>
          </div>
          <div className="space-y-3">
            {data.events.slice(0, 5).map(e => {
              const ev = lang === 'ka' ? kaEvent(e.id) : null
              return (
                <div key={e.id} className="flex items-center gap-3">
                  <div className={`w-11 shrink-0 text-center rounded-xl py-1.5 border ${e.phase === 'launch' ? 'bg-cy/10 border-cy/30 text-cy' : e.phase === 'final' ? 'bg-vio/10 border-vio/30 text-vio' : 'bg-ink-800 border-line text-mut'}`}>
                    <div className="font-display font-bold text-sm leading-none">{new Date(e.date + 'T12:00').getDate()}</div>
                    <div className="text-[9px] uppercase mt-0.5">{new Date(e.date + 'T12:00').toLocaleDateString(lang === 'ka' ? 'ka-GE' : 'en-GB', { month: 'short' })}</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{ev ? ev.title : e.title}</div>
                    <div className="text-xs text-dim truncate">{ev ? ev.label : e.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* open questions */}
        <div className="card p-5 sm:p-6 rise">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold tracking-tight">{t('გადასაწყვეტი საკითხები', 'Open questions')}</h2>
            <button onClick={() => go('questions')} className="text-xs text-cy hover:underline shrink-0">{t('ყველას ნახვა', 'View all')}</button>
          </div>
          <div className="space-y-3">
            {openQ.slice(0, 4).map(q => {
              const qk = lang === 'ka' ? kaQuestion(q.id) : null
              return (
                <button key={q.id} onClick={() => go('questions')} className="w-full text-left card !bg-ink-950 !rounded-xl p-3.5 card-hover">
                  <div className="text-sm font-medium leading-snug">{qk ? qk.q : q.q}</div>
                  <div className="text-xs text-dim mt-1.5 flex items-center gap-1.5"><Icon n="clock" s={12} />{ago(q.created_at)}</div>
                </button>
              )
            })}
            {openQ.length === 0 && <div className="text-sm text-dim py-2">{t('ყველა საკითხი გადაწყვეტილია 🎉', 'All questions decided 🎉')}</div>}
          </div>
        </div>
      </div>

      {/* activity */}
      <div className="card p-5 sm:p-6 rise">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold tracking-tight">{t('ცვლილებების ისტორია', 'Recent activity')}</h2>
          <button onClick={() => go('activity')} className="text-xs text-cy hover:underline shrink-0">{t('ყველას ნახვა', 'View all')}</button>
        </div>
        <div className="space-y-2.5">
          {data.activity.slice(0, 6).map(a => {
            const rec = data.tasks.find(x => x.title === a.target)
            const tgt = lang === 'ka' ? (rec ? kaTask(rec.id) : ACT_KA[a.target] || a.target) : a.target
            return (
              <div key={a.id} className="flex items-center gap-3 text-sm">
                <span className="w-7 h-7 rounded-full bg-ink-800 border border-line flex items-center justify-center text-[10px] font-bold text-cy shrink-0">{kaActor(a.actor)[0].toUpperCase()}</span>
                {lang === 'ka'
                  ? <span className="truncate"><b className="font-semibold">{kaActor(a.actor)}</b> · <span className="text-mut">{ACT_KA[a.action] || a.action}</span> · <span className="text-cy/90">{tgt}</span></span>
                  : <span className="truncate"><b className="font-semibold">{a.actor}</b> <span className="text-mut">{a.action}</span> <span className="text-cy/90">{a.target}</span></span>}
                <span className="ml-auto text-xs text-dim shrink-0">{ago(a.created_at)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, tone, big, label, sub, ring }) {
  const tones = { cy: 'bg-cy/10 border-cy/25 text-cy', ok: 'bg-ok/10 border-ok/25 text-ok', warn: 'bg-warn/10 border-warn/25 text-warn', vio: 'bg-vio/10 border-vio/25 text-vio' }
  return (
    <div className="card p-5 rise relative">
      <div className="flex items-start justify-between">
        <span className={`w-10 h-10 rounded-xl border flex items-center justify-center ${tones[tone]}`}><Icon n={icon} s={18} /></span>
        {ring !== undefined && <Ring value={ring / 100} size={34} stroke={4} />}
      </div>
      <div className="font-display text-3xl font-bold tracking-tight mt-3 tabular-nums">{big}</div>
      <div className="text-sm font-medium mt-0.5">{label}</div>
      <div className="text-xs text-dim mt-1">{sub}</div>
    </div>
  )
}
