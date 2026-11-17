import React, { useMemo } from 'react'
import { Icon, PageHead, ago } from '../ui.jsx'
import { useLang, useT, kaTask, kaDoc, kaEvent, kaResp, kaQuestion, kaNote, kaActor, ACT_KA } from '../i18n.jsx'

export default function Activity({ data }) {
  const t = useT()
  const { lang } = useLang()

  // Map English record titles (stored in activity targets) → Georgian display text
  const byText = useMemo(() => {
    const m = {}
    data.tasks.forEach(x => { const k = kaTask(x.id); if (k) m[x.title] = k })
    data.documents.forEach(x => { const k = kaDoc(x.id); if (k) m[x.name] = k.name })
    data.events.forEach(x => { const k = kaEvent(x.id); if (k) m[x.title] = k.title })
    data.responsibilities.forEach(x => { const k = kaResp(x.id); if (k) m[x.func] = k.func })
    data.questions.forEach(x => { const k = kaQuestion(x.id); if (k) m[x.q] = k.q })
    data.notes.forEach(x => { const k = kaNote(x.id); if (k) m[x.body] = k })
    return m
  }, [data])

  const target = (a) => {
    if (lang !== 'ka') return a.target
    if (ACT_KA[a.target]) return ACT_KA[a.target]
    const k = byText[a.target]
    if (k) return k.length > 60 ? k.slice(0, 60) + '…' : k
    return a.target.length > 60 ? a.target.slice(0, 60) + '…' : a.target
  }

  return (
    <div>
      <PageHead title={t('ცვლილებების ისტორია', 'Activity Log')}
        ka={lang === 'ka' ? null : 'აქტივობის ჟურნალი'}
        desc={t('ყველა ცვლილება პლატფორმაში — ვინ შეასრულა და როდის. სრული გამჭვირვალობა კომიტეტისთვის — არაფერი დაიკარგება.', 'Every change in the platform, who made it and when. Full transparency for the committee — nothing gets lost.')} />
      <div className="card divide-y divide-line overflow-hidden rise">
        {data.activity.map(a => (
          <div key={a.id} className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-ink-950/70 transition-colors">
            <span className="w-8 h-8 rounded-full bg-ink-800 border border-line flex items-center justify-center text-[11px] font-bold text-cy shrink-0">{kaActor(a.actor)[0].toUpperCase()}</span>
            <div className="min-w-0 flex-1">
              {lang === 'ka'
                ? <div className="text-sm truncate"><b className="font-semibold">{kaActor(a.actor)}</b> · <span className="text-mut">{ACT_KA[a.action] || a.action}</span> · <span className="text-cy/90">{target(a)}</span></div>
                : <div className="text-sm truncate"><b className="font-semibold">{a.actor}</b> <span className="text-mut">{a.action}</span> <span className="text-cy/90">{a.target}</span></div>}
            </div>
            <span className="text-xs text-dim shrink-0 tabular-nums">{ago(a.created_at)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
