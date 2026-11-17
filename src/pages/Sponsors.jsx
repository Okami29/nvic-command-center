import React, { useState } from 'react'
import { api, Icon, Badge, Btn, Modal, Field, inp, PageHead, Empty, ago, useToast } from '../ui.jsx'
import { useLang, useT, STAGE_KA, SPONSOR_TYPE_KA } from '../i18n.jsx'

const STAGES = [
  ['idea', 'Ideas', 'mut'],
  ['contacted', 'Contacted', 'cy'],
  ['replied', 'Replied', 'vio'],
  ['meeting', 'In talks', 'amb'],
  ['verified', 'Verified', 'warn'],
  ['committed', 'Committed', 'ok'],
  ['declined', 'Declined', 'bad']
]
const TYPES = ['Sponsor', 'Media partner', 'School', 'NGO / Foundation', 'Industry / Tech', 'Government / Agency', 'Mentor source', 'Other']

export default function Sponsors({ data, refresh }) {
  const t = useT()
  const { lang } = useLang()
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)
  const [toast, toastNode] = useToast()

  const move = async (s, stage) => {
    await api.send(`/api/sponsors/${s.id}`, 'PATCH', { stage })
    refresh()
    toast(lang === 'ka' ? `${s.name} → ${STAGE_KA[stage]}` : `${s.name} → ${STAGES.find(x => x[0] === stage)[1]}`)
  }

  return (
    <div>
      <PageHead title={t('სპონსორები და პარტნიორები', 'Sponsors & Partners')}
        ka={lang === 'ka' ? null : 'პარტნიორები და სპონსორები'}
        desc={t('სრული საკომუნიკაციო მიმდევნობა — იდეიდან დადასტურებამდე. თვალი ადევნეთ, ვინ დაგვიკავშირდა, ვინ გამოგვიგზავნა პასუხი, ვინ არის გადამოწმებული და რა შეაქვს თითოეულ პარტნიორს.', 'The full outreach pipeline — from idea to committed. Track who was contacted, who replied, who is verified, and what each partner brings.')}
        right={<Btn tone="primary" icon="plus" onClick={() => setAdding(true)}>{t('სპონსორის / პარტნიორის დამატება', 'Add sponsor / partner')}</Btn>}
      />

      {data.sponsors.length === 0 && (
        <Empty icon="users" title={t('პიპლაინი ცარიელია', 'Pipeline is empty')}
          hint={t('აქ დაამატეთ ყველა პოტენციური სპონსორი, მედიაპარტნიორი, სკოლების ქსელი, არასამთავრობო ორგანიზაცია და ინდუსტრიის კონტაქტი. ბარათები მიმდევნობაში წინ გადაიტანეთ მოლაპარაკების მიმდინარეობის შესაბამისად — „გადამოწმებულია“ ნიშნავს, რომ საკონტაქტო ინფორმაცია და განზრახვა რეალური საუბრით დადასტურდა.', 'Add every potential sponsor, media partner, school network, NGO and industry contact here. Move cards through the pipeline as conversations progress — “Verified” means the contact and commitment were confirmed by a real conversation.')}
          action={<Btn tone="primary" icon="plus" onClick={() => setAdding(true)}>{t('პირველი პარტნიორის დამატება', 'Add the first partner')}</Btn>}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {STAGES.map(([stage, label, tone]) => {
          const items = data.sponsors.filter(s => s.stage === stage)
          return (
            <div key={stage} className="card p-4 rise">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${stage === 'contacted' ? 'pulse-dot' : ''}`} style={{ background: { mut: '#8a94a0', cy: '#00616f', vio: '#5b4b8a', amb: '#a8761c', warn: '#b45309', ok: '#1a7f4e', bad: '#b3261e' }[tone] }} />
                  <span className="font-display font-bold text-sm tracking-tight">{lang === 'ka' ? STAGE_KA[stage] : label}</span>
                </div>
                <span className="text-xs text-dim tabular-nums">{items.length}</span>
              </div>
              <div className="space-y-2.5">
                {items.length === 0 && <div className="text-dim/60 text-xs px-1 py-3 border border-dashed border-line rounded-xl text-center">{t('ცარიელი', 'empty')}</div>}
                {items.map(s => (
                  <div key={s.id} className="card !rounded-xl !bg-ink-950 p-3.5 card-hover cursor-pointer" onClick={() => setEditing(s)}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm leading-snug flex items-center gap-1.5">
                          <span className="truncate">{s.name}</span>
                          {!!s.verified && <span className="text-ok shrink-0" title={t('გადამოწმებულია', 'Verified')}><Icon n="shield" s={14} /></span>}
                        </div>
                        <div className="text-[11px] text-dim mt-0.5">{lang === 'ka' ? (SPONSOR_TYPE_KA[s.type] || s.type) : s.type}</div>
                      </div>
                      {s.value && <Badge tone="ok" cls="shrink-0">{s.value}</Badge>}
                    </div>
                    {s.contact && <div className="text-xs text-mut mt-2 truncate">{s.contact}{s.email ? ` · ${s.email}` : ''}</div>}
                    {s.note && <div className="text-xs text-dim mt-1 italic line-clamp-2">{s.note}</div>}
                    <div className="flex items-center gap-1 mt-2.5" onClick={e => e.stopPropagation()}>
                      {stage !== 'idea' && <Btn tone="quiet" cls="!px-2 !py-1 !text-[11px]" onClick={() => move(s, STAGES[Math.max(0, STAGES.findIndex(x => x[0] === stage) - 1)][0])}>{t('← წინა ეტაპი', '← back')}</Btn>}
                      {stage !== 'committed' && stage !== 'declined' && <Btn tone="quiet" cls="!px-2 !py-1 !text-[11px]" onClick={() => move(s, STAGES[Math.min(5, STAGES.findIndex(x => x[0] === stage) + 1)][0])}>{t('შემდეგი ეტაპი →', 'advance →')}</Btn>}
                      {stage !== 'declined' && stage !== 'committed' && <Btn tone="quiet" cls="!px-2 !py-1 !text-[11px] !text-bad ml-auto" onClick={() => move(s, 'declined')}>{t('უარი', '✕')}</Btn>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <Modal open={adding || !!editing} onClose={() => { setAdding(false); setEditing(null) }} title={editing ? editing.name : t('ახალი სპონსორი / პარტნიორი', 'New sponsor / partner')} wide>
        <SponsorForm sponsor={editing} types={TYPES} stages={STAGES} onDone={() => { setAdding(false); setEditing(null); refresh(); toast(editing ? t('პარტნიორი განახლებულია', 'Partner updated') : t('პარტნიორი დამატებულია', 'Partner added')) }} />
      </Modal>
      {toastNode}
    </div>
  )
}

function SponsorForm({ sponsor, types, stages, onDone }) {
  const t = useT()
  const { lang } = useLang()
  const [f, setF] = useState({ name: '', type: 'Sponsor', stage: 'idea', contact: '', email: '', phone: '', value: '', owner: '', note: '', verified: 0, ...(sponsor || {}) })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value })
  const save = async (e) => {
    e.preventDefault()
    if (!f.name.trim()) return
    await api.send(sponsor ? `/api/sponsors/${sponsor.id}` : '/api/sponsors', sponsor ? 'PATCH' : 'POST', f)
    onDone()
  }
  const del = async () => {
    if (!confirm(t('წაიშალოს ეს პარტნიორი?', 'Remove this partner?'))) return
    await api.send(`/api/sponsors/${sponsor.id}`, 'DELETE')
    onDone()
  }
  return (
    <form onSubmit={save} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label={t('ორგანიზაცია', 'Organization')} cls="col-span-2"><input className={inp} value={f.name} onChange={set('name')} required placeholder={t('მაგ.: Bank of Georgia Foundation', 'e.g. Bank of Georgia Foundation')} /></Field>
        <Field label={t('ტიპი', 'Type')}><select className={inp} value={f.type} onChange={set('type')}>{types.map(ty => <option key={ty} value={ty}>{lang === 'ka' ? (SPONSOR_TYPE_KA[ty] || ty) : ty}</option>)}</select></Field>
        <Field label={t('პიპლაინის ეტაპი', 'Pipeline stage')}><select className={inp} value={f.stage} onChange={set('stage')}>{stages.map(([v, l]) => <option key={v} value={v}>{lang === 'ka' ? STAGE_KA[v] : l}</option>)}</select></Field>
        <Field label={t('საკონტაქტო პირი', 'Contact person')}><input className={inp} value={f.contact} onChange={set('contact')} /></Field>
        <Field label={t('პასუხისმგებელი პირი (ჩვენი მხრიდან)', 'Owner (our side)')}><input className={inp} value={f.owner} onChange={set('owner')} placeholder={t('ვინ მართავს ურთიერთობას', 'Who leads this relationship')} /></Field>
        <Field label="Email"><input className={inp} type="email" value={f.email} onChange={set('email')} /></Field>
        <Field label={t('ტელეფონი', 'Phone')}><input className={inp} value={f.phone} onChange={set('phone')} /></Field>
        <Field label={t('ღირებულება / შეთავაზება', 'Value / offer')} cls="col-span-2"><input className={inp} value={f.value} onChange={set('value')} placeholder={t('მაგ.: 5,000 ₾ თანხა · ლაბორატორიული აღჭურვილობა · მედიის გაშლა', 'e.g. ₾5,000 cash · lab equipment · media reach')} /></Field>
        <Field label={t('შენიშვნები და შემდეგი ნაბიჯი', 'Notes & next step')} cls="col-span-2"><textarea className={inp} rows={3} value={f.note} onChange={set('note')} placeholder={t('საუბრის ისტორია, რა ითხოვეს, ვადა…', 'Conversation history, what they asked for, deadline…')} /></Field>
      </div>
      <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
        <input type="checkbox" checked={!!f.verified} onChange={set('verified')} className="w-4 h-4 accent-[#1a7f4e]" />
        <span className="flex items-center gap-1.5"><span className="text-ok"><Icon n="shield" s={15} /></span>{t('გადამოწმებულია — საკონტაქტო ინფორმაცია და განზრახვა რეალური საუბრით დადასტურდა', 'Verified — contact details and intent confirmed by a real conversation')}</span>
      </label>
      <div className="flex justify-between pt-2">
        {sponsor ? <Btn tone="danger" icon="trash" onClick={del}>{t('წაშლა', 'Remove')}</Btn> : <span />}
        <div className="flex gap-2">
          <Btn tone="ghost" onClick={onDone}>{t('გაუქმება', 'Cancel')}</Btn>
          <Btn tone="primary" type="submit">{sponsor ? t('შენახვა', 'Save') : t('პიპლაინში დამატება', 'Add to pipeline')}</Btn>
        </div>
      </div>
    </form>
  )
}
