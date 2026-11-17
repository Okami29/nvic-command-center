import React, { useState } from 'react'
import { api, Icon, Badge, Btn, Modal, Field, inp, PageHead, Empty, ago, useToast } from '../ui.jsx'
import { useLang, useT, QST_KA, kaQuestion, kaActor } from '../i18n.jsx'

const ST = {
  open: { ka: 'გადასაწყვეტია', en: 'Open', tone: 'warn' },
  answered: { ka: 'პასუხგაცემულია', en: 'Answered', tone: 'cy' },
  decided: { ka: 'გადაწყვეტილება მიღებულია', en: 'Decided', tone: 'ok' }
}
const QCAT_KA = { Governance: 'მართვა', Legal: 'სამართლებრივი საკითხები', 'Finance & Prizes': 'ფინანსები და ჯილდოები', Website: 'ვებგვერდი', Judging: 'შეფასება', Communications: 'კომუნიკაცია', Event: 'ღონისძიება', Other: 'სხვა' }

export default function Questions({ data, refresh }) {
  const t = useT()
  const { lang } = useLang()
  const [ask, setAsk] = useState(false)
  const [filter, setFilter] = useState('open')
  const [toast, toastNode] = useToast()
  const answersByQ = {}
  data.answers.forEach(a => (answersByQ[a.qid] ||= []).push(a))

  const qs = data.questions.filter(q => filter === 'all' || q.status === filter)

  const setStatus = async (q, status) => {
    await api.send(`/api/questions/${q.id}`, 'PATCH', { status })
    refresh()
    toast(lang === 'ka' ? `მონიშნულია, როგორც „${ST[status].ka}“` : `Marked ${ST[status].en.toLowerCase()}`)
  }
  const answer = async (qid, a) => {
    if (!a.trim()) return
    await api.send('/api/answers', 'POST', { qid, a: a.trim() })
    refresh()
  }

  return (
    <div>
      <PageHead title={t('გადასაწყვეტი საკითხები', 'Open Questions & Decisions')}
        ka={lang === 'ka' ? null : 'ღია კითხვები და გადაწყვეტილებები'}
        desc={t('ყველა საკითხი, რომელიც კომიტეტმა კონკურსის გამოცხადებამდე უნდა გადაწყვიტოს. დასვით კითხვა, გასცით პასუხი, შემდეგ დააფიქსირეთ გადაწყვეტილება — გადაწყვეტილებები დებულებისა და ვებგვერდისთვის ერთიან ჭეშმარიტების წყაროდ იქცევა.', 'Everything the committee must resolve before launch. Ask, answer, then mark as Decided — decisions become the single source of truth for the regulations and website.')}
        right={<Btn tone="primary" icon="plus" onClick={() => setAsk(true)}>{t('კითხვის დასმა', 'Ask a question')}</Btn>}
      />

      <div className="flex gap-2 mb-6 rise">
        {[['open', t('გადასაწყვეტი', 'Open')], ['answered', t('პასუხგაცემული', 'Answered')], ['decided', t('გადაწყვეტილი', 'Decided')], ['all', t('ყველა', 'All')]].map(([v, l]) => {
          const n = v === 'all' ? data.questions.length : data.questions.filter(q => q.status === v).length
          return (
            <button key={v} onClick={() => setFilter(v)} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filter === v ? 'bg-cy/15 text-cy border-cy/40' : 'bg-ink-800 text-mut border-line hover:text-fg'}`}>
              {l} · {n}
            </button>
          )
        })}
      </div>

      {qs.length === 0 && <Empty icon="help" title={t('აქ არაფერია', 'Nothing here')} hint={t('ამ მდგომარეობაში საკითხი არ არის.', 'No questions in this state right now.')} />}

      <div className="space-y-4">
        {qs.map(q => {
          const qk = lang === 'ka' ? kaQuestion(q.id) : null
          return (
            <div key={q.id} className="card card-hover p-5 sm:p-6 rise">
              <div className="flex items-start gap-4">
                <span className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${q.status === 'decided' ? 'text-ok bg-ok/10 border-ok/25' : q.status === 'answered' ? 'text-cy bg-cy/10 border-cy/25' : 'text-warn bg-warn/10 border-warn/25'}`}>
                  <Icon n={q.status === 'decided' ? 'check' : 'help'} s={17} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold tracking-tight leading-snug">{qk ? qk.q : q.q}</div>
                  {(q.detail || qk) && <p className="text-sm text-mut mt-1.5 leading-relaxed">{qk ? qk.note : q.detail}</p>}
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <Badge tone="vio">{lang === 'ka' ? (QCAT_KA[q.category] || q.category) : q.category}</Badge>
                    <Badge tone={ST[q.status].tone}>{lang === 'ka' ? ST[q.status].ka : ST[q.status].en}</Badge>
                    <span className="text-[11px] text-dim">{lang === 'ka' ? `ავტორი: ${kaActor(q.asked_by)} · ${ago(q.created_at)}` : `asked by ${q.asked_by} · ${ago(q.created_at)}`}</span>
                  </div>

                  {(answersByQ[q.id] || []).length > 0 && (
                    <div className="mt-4 space-y-2.5 border-l-2 border-cy/25 pl-4">
                      {answersByQ[q.id].map(a => (
                        <div key={a.id} className="text-sm">
                          <span className="font-semibold text-cy">{kaActor(a.by_)}</span>
                          <span className="text-dim text-xs ml-2">{ago(a.created_at)}</span>
                          <p className="text-mut mt-0.5 leading-relaxed">{a.a}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <form onSubmit={e => { e.preventDefault(); const i = e.target.elements.a; answer(q.id, i.value); i.value = '' }} className="flex-1 min-w-[220px] flex gap-2">
                      <input name="a" placeholder={q.status === 'open' ? t('პასუხი / კომიტეტის მოსაზრება…', 'Answer / committee input…') : t('დაამატეთ კიდევ ერთი ხედი…', 'Add another perspective…')} className={inp + ' !py-2'} />
                      <Btn tone="ghost" type="submit" icon="send" cls="shrink-0" />
                    </form>
                    {q.status !== 'answered' && <Btn tone="quiet" onClick={() => setStatus(q, 'answered')}>{t('პასუხგაცემულად მონიშვნა', 'Mark answered')}</Btn>}
                    {q.status !== 'decided' && <Btn tone="quiet" icon="check" onClick={() => setStatus(q, 'decided')}>{t('გადაწყვეტილების დაფიქსირება', 'Decided')}</Btn>}
                    {q.status !== 'open' && <Btn tone="quiet" onClick={() => setStatus(q, 'open')}>{t('საკითხის ხელახლა გახსნა', 'Reopen')}</Btn>}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Modal open={ask} onClose={() => setAsk(false)} title={t('კითხვა კომიტეტისთვის', 'Ask the committee')} wide>
        <AskForm onDone={() => { setAsk(false); refresh(); toast(t('კითხვა გამოქვეყნდა', 'Question posted')) }} />
      </Modal>
      {toastNode}
    </div>
  )
}

function AskForm({ onDone }) {
  const t = useT()
  const { lang } = useLang()
  const [f, setF] = useState({ q: '', detail: '', category: 'Governance' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const save = async (e) => {
    e.preventDefault()
    if (!f.q.trim()) return
    await api.send('/api/questions', 'POST', f)
    onDone()
  }
  return (
    <form onSubmit={save} className="space-y-4">
      <Field label={t('კითხვა', 'Question')}><input className={inp} value={f.q} onChange={set('q')} autoFocus required placeholder={t('რა უნდა გადაწყდეს?', 'What needs to be decided?')} /></Field>
      <Field label={t('კონტექსტი', 'Context')}><textarea className={inp} rows={3} value={f.detail} onChange={set('detail')} placeholder={t('რატომ არის მნიშვნელოვანი, ვარიანტები, შეზღუდვები…', 'Why it matters, options, constraints…')} /></Field>
      <Field label={t('კატეგორია', 'Category')}>
        <select className={inp} value={f.category} onChange={set('category')}>
          {['Governance', 'Legal', 'Finance & Prizes', 'Website', 'Judging', 'Communications', 'Event', 'Other'].map(c => <option key={c} value={c}>{lang === 'ka' ? (QCAT_KA[c] || c) : c}</option>)}
        </select>
      </Field>
      <div className="flex justify-end gap-2 pt-1">
        <Btn tone="ghost" onClick={onDone}>{t('გაუქმება', 'Cancel')}</Btn>
        <Btn tone="primary" type="submit">{t('კითხვის გამოქვეყნება', 'Post question')}</Btn>
      </div>
    </form>
  )
}
