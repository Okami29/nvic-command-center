import React, { useState } from 'react'
import { api, Icon, Badge, Btn, Modal, Field, inp, PageHead, useToast } from '../ui.jsx'
import { useLang, useT, PHASE_KA, kaEvent } from '../i18n.jsx'

const PHASES = {
  launch: { ka: 'დაწყება', en: 'Launch', tone: 'cy' },
  competition: { ka: 'კონკურსი', en: 'Competition', tone: 'vio' },
  final: { ka: 'ფინალი', en: 'Final', tone: 'ok' }
}

export default function Calendar({ data, refresh }) {
  const t = useT()
  const { lang } = useLang()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toast, toastNode] = useToast()
  const del = async (e) => { if (confirm(t('წაიშალოს ეს თარიღი?', 'Remove this date?'))) { await api.send(`/api/events/${e.id}`, 'DELETE'); refresh(); toast(t('წაშლილია', 'Removed')) } }

  return (
    <div>
      <PageHead title={t('კონკურსის კალენდარი', 'Competition Calendar')}
        ka={lang === 'ka' ? null : 'კალენდარი'}
        desc={t('სეზონის წინასწარი კალენდარი. თარიღები შიდა დოკუმენტია უნივერსიტეტის დამტკიცებამდე — საჯარო ვებგვერდი ზუსტად ამ სიას უნდა შეესაბამებოდეს.', 'The provisional season calendar. Dates are internal until NVU approves them — the public site must always match this list exactly.')}
        right={<Btn tone="primary" icon="plus" onClick={() => setAdding(true)}>{t('თარიღის დამატება', 'Add date')}</Btn>}
      />
      <div className="relative">
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-cy/50 via-vio/30 to-ok/50" />
        <div className="space-y-4">
          {data.events.map(e => {
            const days = Math.ceil((new Date(e.date + 'T23:59:59') - Date.now()) / 86400e3)
            const ph = PHASES[e.phase] || PHASES.competition
            const ev = lang === 'ka' ? kaEvent(e.id) : null
            return (
              <div key={e.id} className="relative pl-14 group rise">
                <span className={`absolute left-0 top-3 w-10 h-10 rounded-2xl border flex items-center justify-center font-display font-bold text-sm tabular-nums ${e.phase === 'launch' ? 'bg-cy/15 border-cy/40 text-cy glow-cy' : e.phase === 'final' ? 'bg-ok/10 border-ok/40 text-ok' : 'bg-ink-800 border-line text-mut'}`}>
                  {new Date(e.date + 'T12:00').getDate()}
                </span>
                <div className="card card-hover p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-bold tracking-tight">{ev ? ev.title : e.title}</h3>
                    <Badge tone={ph.tone}>{lang === 'ka' ? ph.ka : ph.en}</Badge>
                    {days > 0 && <span className="text-xs text-dim">{lang === 'ka' ? `${days} დღეში` : `in ${days} day${days > 1 ? 's' : ''}`}</span>}
                    {days <= 0 && <Badge tone="ok">{t('მიღწეულია', 'reached')}</Badge>}
                    <div className="ml-auto flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <Btn tone="quiet" icon="edit" onClick={() => setEditing(e)} />
                      <Btn tone="quiet" icon="trash" onClick={() => del(e)} />
                    </div>
                  </div>
                  <div className="text-sm text-cy/90 mt-1 font-medium">{ev ? ev.label : e.label}</div>
                  {(e.note || ev) && <p className="text-sm text-mut mt-2 leading-relaxed">{ev ? ev.note : e.note}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Modal open={adding || !!editing} onClose={() => { setAdding(false); setEditing(null) }} title={editing ? t('თარიღის რედაქტირება', 'Edit date') : t('თარიღის დამატება', 'Add date')}>
        <EventForm event={editing} onDone={() => { setAdding(false); setEditing(null); refresh(); toast(t('შენახულია', 'Saved')) }} />
      </Modal>
      {toastNode}
    </div>
  )
}

function EventForm({ event, onDone }) {
  const t = useT()
  const { lang } = useLang()
  const [f, setF] = useState({ title: '', date: '2026-11-30', label: '', phase: 'competition', note: '', ...(event || {}) })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const save = async (e) => {
    e.preventDefault()
    if (!f.title.trim() || !f.date) return
    await api.send(event ? `/api/events/${event.id}` : '/api/events', event ? 'PATCH' : 'POST', { ...f, label: f.label || f.date })
    onDone()
  }
  return (
    <form onSubmit={save} className="space-y-4">
      <Field label={t('სათაური', 'Title')}><input className={inp} value={f.title} onChange={set('title')} autoFocus required /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label={t('თარიღი', 'Date')}><input type="date" className={inp} value={f.date} onChange={set('date')} required /></Field>
        <Field label={t('ეტაპი', 'Phase')}>
          <select className={inp} value={f.phase} onChange={set('phase')}>
            {Object.entries(PHASES).map(([k, v]) => <option key={k} value={k}>{lang === 'ka' ? v.ka : v.en}</option>)}
          </select>
        </Field>
      </div>
      <Field label={t('საჩვენებელი წარწერა', 'Display label')}><input className={inp} value={f.label} onChange={set('label')} placeholder={t('მაგ.: 16–22 იანვარი, 2027', 'e.g. January 16–22, 2027')} /></Field>
      <Field label={t('შენიშვნები', 'Notes')}><textarea className={inp} rows={2} value={f.note} onChange={set('note')} /></Field>
      <div className="flex justify-end gap-2 pt-1">
        <Btn tone="ghost" onClick={onDone}>{t('გაუქმება', 'Cancel')}</Btn>
        <Btn tone="primary" type="submit">{t('შენახვა', 'Save')}</Btn>
      </div>
    </form>
  )
}
