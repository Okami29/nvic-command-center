import React, { useState } from 'react'
import { api, Icon, Badge, Btn, Modal, Field, inp, PageHead, useToast } from '../ui.jsx'
import { useLang, useT, kaPerson, kaResp } from '../i18n.jsx'

export default function People({ data, refresh }) {
  const t = useT()
  const { lang } = useLang()
  const [addP, setAddP] = useState(false)
  const [editP, setEditP] = useState(null)
  const [addR, setAddR] = useState(false)
  const [editR, setEditR] = useState(null)
  const [toast, toastNode] = useToast()

  const delP = async (p) => { if (confirm(t(`წაიშალოს ${p.name}?`, `Remove ${p.name}?`))) { await api.send(`/api/people/${p.id}`, 'DELETE'); refresh(); toast(t('წაშლილია', 'Removed')) } }
  const delR = async (r) => { if (confirm(t('წაიშალოს ეს პასუხისმგებლობა?', 'Remove this responsibility?'))) { await api.send(`/api/responsibilities/${r.id}`, 'DELETE'); refresh(); toast(t('წაშლილია', 'Removed')) } }

  return (
    <div>
      <PageHead title={t('გუნდი და როლები', 'People & Responsibilities')}
        ka={lang === 'ka' ? null : 'გუნდი და პასუხისმგებლობები'}
        desc={t('ვინ დგას საორგანიზაციო მხარეს და რომელი ფუნქცია ვის აკისრია. თითოეულ ფუნქციას ჰყავს ზუსტად ერთი კონკრეტული პასუხისმგებელი — ამოცანა გუნდებს შორის სივრცეში არ უნდა დარჩეს.', 'Who is on the organizing side, and who owns which function. Every function has exactly one named lead — no task may be left in the gap between teams.')}
        right={<Btn tone="primary" icon="plus" onClick={() => setAddP(true)}>{t('პირის დამატება', 'Add person')}</Btn>}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {data.people.map(p => {
          const pk = lang === 'ka' ? kaPerson(p.name) : null
          return (
            <div key={p.id} className="card card-hover p-5 rise group">
              <div className="flex items-start gap-3.5">
                <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cy to-cy-deep flex items-center justify-center font-display font-bold text-white text-lg shrink-0">{(pk ? pk.name : p.name || '?')[0].toUpperCase()}</span>
                <div className="min-w-0">
                  <div className="font-display font-bold tracking-tight truncate">{pk ? pk.name : p.name}</div>
                  <div className="text-xs text-cy mt-0.5 leading-snug">{pk ? pk.role : p.role}</div>
                  {(p.org || pk) && <div className="text-xs text-dim mt-0.5">{pk ? pk.org : p.org}</div>}
                </div>
              </div>
              {(p.email || p.phone) && (
                <div className="mt-3 space-y-1 text-xs text-mut">
                  {p.email && <a href={`mailto:${p.email}`} className="flex items-center gap-2 hover:text-cy"><Icon n="mail" s={13} /><span className="truncate">{p.email}</span></a>}
                  {p.phone && <a href={`tel:${p.phone}`} className="flex items-center gap-2 hover:text-cy"><Icon n="phone" s={13} />{p.phone}</a>}
                </div>
              )}
              {p.note && <p className="text-xs text-dim mt-2">{p.note}</p>}
              <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity -mb-1">
                <Btn tone="quiet" icon="edit" onClick={() => setEditP(p)} />
                <Btn tone="quiet" icon="trash" onClick={() => delP(p)} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="card overflow-hidden rise">
        <div className="px-5 sm:px-6 py-4 border-b border-line bg-ink-850/40 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-bold tracking-tight">{t('პასუხისმგებლობების მატრიცა', 'Responsibility matrix')}</h2>
            <div className="text-xs text-dim mt-0.5">{t('სამუშაო განაწილება უნივერსიტეტსა და დამფუძნებელ გუნდს შორის — ყველა სათაური და უფლებამოსილება ოფიციალური წესით უნდა იყოს განსაზღვრული.', 'The division of work between NVU and the founding team — formalize every title and authority.')}</div>
          </div>
          <Btn tone="ghost" icon="plus" onClick={() => setAddR(true)}>{t('ფუნქციის დამატება', 'Add function')}</Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-dim">
                <th className="px-5 sm:px-6 py-3 font-semibold">{t('ფუნქცია', 'Function')}</th>
                <th className="px-5 py-3 font-semibold">{t('პასუხისმგებელი', 'Lead')}</th>
                <th className="px-5 py-3 font-semibold w-24"></th>
              </tr>
            </thead>
            <tbody>
              {data.responsibilities.map(r => {
                const rk = lang === 'ka' ? kaResp(r.id) : null
                return (
                  <tr key={r.id} className="border-t border-line hover:bg-ink-950/70 transition-colors group">
                    <td className="px-5 sm:px-6 py-3.5">
                      <div className="font-medium">{rk ? rk.func : r.func}</div>
                      {r.note && <div className="text-xs text-dim mt-0.5">{r.note}</div>}
                    </td>
                    <td className="px-5 py-3.5"><Badge tone="cy">{rk ? rk.lead : r.lead}</Badge></td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Btn tone="quiet" icon="edit" onClick={() => setEditR(r)} />
                        <Btn tone="quiet" icon="trash" onClick={() => delR(r)} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={addP || !!editP} onClose={() => { setAddP(false); setEditP(null) }} title={editP ? editP.name : t('პირის დამატება', 'Add person')}>
        <PersonForm person={editP} onDone={() => { setAddP(false); setEditP(null); refresh(); toast(t('შენახულია', 'Saved')) }} />
      </Modal>
      <Modal open={addR || !!editR} onClose={() => { setAddR(false); setEditR(null) }} title={editR ? t('ფუნქციის რედაქტირება', 'Edit function') : t('ფუნქციის დამატება', 'Add function')}>
        <RespForm resp={editR} onDone={() => { setAddR(false); setEditR(null); refresh(); toast(t('შენახულია', 'Saved')) }} />
      </Modal>
      {toastNode}
    </div>
  )
}

function PersonForm({ person, onDone }) {
  const t = useT()
  const [f, setF] = useState({ name: '', role: '', org: 'NVIC organizing team', email: '', phone: '', note: '', ...(person || {}) })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const save = async (e) => {
    e.preventDefault()
    if (!f.name.trim()) return
    await api.send(person ? `/api/people/${person.id}` : '/api/people', person ? 'PATCH' : 'POST', f)
    onDone()
  }
  return (
    <form onSubmit={save} className="space-y-4">
      <Field label={t('სახელი', 'Name')}><input className={inp} value={f.name} onChange={set('name')} autoFocus required /></Field>
      <Field label={t('როლი / ფუნქცია', 'Role / function')}><input className={inp} value={f.role} onChange={set('role')} placeholder={t('მაგ.: ჟიურის კოორდინატორი, სკოლებთან კომუნიკაციის პასუხისმგებელი', 'e.g. Jury coordinator, School outreach lead')} /></Field>
      <Field label={t('ორგანიზაცია', 'Organization')}><input className={inp} value={f.org} onChange={set('org')} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email"><input className={inp} type="email" value={f.email} onChange={set('email')} /></Field>
        <Field label={t('ტელეფონი', 'Phone')}><input className={inp} value={f.phone} onChange={set('phone')} /></Field>
      </div>
      <Field label={t('შენიშვნები', 'Notes')}><textarea className={inp} rows={2} value={f.note} onChange={set('note')} /></Field>
      <div className="flex justify-end gap-2 pt-1">
        <Btn tone="ghost" onClick={onDone}>{t('გაუქმება', 'Cancel')}</Btn>
        <Btn tone="primary" type="submit">{t('შენახვა', 'Save')}</Btn>
      </div>
    </form>
  )
}

function RespForm({ resp, onDone }) {
  const t = useT()
  const [f, setF] = useState({ func: '', lead: '', note: '', ...(resp || {}) })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const save = async (e) => {
    e.preventDefault()
    if (!f.func.trim() || !f.lead.trim()) return
    await api.send(resp ? `/api/responsibilities/${resp.id}` : '/api/responsibilities', resp ? 'PATCH' : 'POST', f)
    onDone()
  }
  return (
    <form onSubmit={save} className="space-y-4">
      <Field label={t('ფუნქცია', 'Function')}><input className={inp} value={f.func} onChange={set('func')} autoFocus required placeholder={t('მაგ.: სკოლებთან კომუნიკაცია', 'e.g. School outreach')} /></Field>
      <Field label={t('პასუხისმგებელი (პირი / ორგანო)', 'Lead (person / body)')}><input className={inp} value={f.lead} onChange={set('lead')} required placeholder={t('მაგ.: უნივერსიტეტის კომუნიკაციის სამსახური და საორგანიზაციო გუნდი', 'e.g. NVU communications + organizing team')} /></Field>
      <Field label={t('შენიშვნები', 'Notes')}><input className={inp} value={f.note} onChange={set('note')} /></Field>
      <div className="flex justify-end gap-2 pt-1">
        <Btn tone="ghost" onClick={onDone}>{t('გაუქმება', 'Cancel')}</Btn>
        <Btn tone="primary" type="submit">{t('შენახვა', 'Save')}</Btn>
      </div>
    </form>
  )
}
