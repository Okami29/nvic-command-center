import React, { useState } from 'react'
import { api, Icon, Badge, Btn, Modal, Field, inp, PageHead, Empty, ago, useToast } from '../ui.jsx'
import { useLang, useT, LINK_CAT_KA } from '../i18n.jsx'

const CATS = ['Tool', 'Reference', 'Account', 'Research', 'Design', 'School', 'Media', 'Other']

export default function Links({ data, refresh }) {
  const t = useT()
  const { lang } = useLang()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toast, toastNode] = useToast()
  const del = async (l) => { if (confirm(t('წაიშალოს ბმული?', 'Remove link?'))) { await api.send(`/api/links/${l.id}`, 'DELETE'); refresh(); toast(t('ბმული წაშლილია', 'Link removed')) } }

  return (
    <div>
      <PageHead title={t('ბმულები და რესურსები', 'Links & Resources')}
        ka={lang === 'ka' ? null : 'ბმულები და რესურსები'}
        desc={t('ყველა ინსტრუმენტი, ანგარიში, საცნობარო და სამეცნიერო ბმული, რომელიც გუნდს სჭირდება — ერთი დაწკაპუნებით, ჩატში აღარ მოიძებნება.', 'Every tool, account, reference and research link the team needs — one click away, no more digging through chats.')}
        right={<Btn tone="primary" icon="plus" onClick={() => setAdding(true)}>{t('ბმულის დამატება', 'Add link')}</Btn>}
      />
      {data.links.length === 0 && <Empty icon="link" title={t('ბმულები ჯერ არ არის', 'No links yet')} hint={t('ჩააგდეთ აქ ვებგვერდის მონახაზი, დომენის რეგისტრატორი, Canva-ს დაფა, Google Form, უნივერსიტეტის კონტაქტები — ყველაფერი, რაც გუნდს მუდმივად სჭირდება.', 'Drop the website draft, domain registrar, Canva board, Google Form, NVU contacts — everything the team keeps asking for.')} action={<Btn tone="primary" icon="plus" onClick={() => setAdding(true)}>{t('პირველი ბმულის დამატება', 'Add the first link')}</Btn>} />}
      <div className="grid md:grid-cols-2 gap-3">
        {data.links.map(l => (
          <div key={l.id} className="card card-hover p-4 flex items-center gap-3.5 rise group">
            <span className="w-9 h-9 rounded-xl bg-cy/10 border border-cy/25 text-cy flex items-center justify-center shrink-0"><Icon n="globe" s={16} /></span>
            <div className="min-w-0 flex-1">
              <a href={l.url} target="_blank" rel="noreferrer" className="font-semibold text-sm hover:text-cy transition-colors truncate block">{l.title}</a>
              <div className="flex items-center gap-2 mt-0.5">
                {l.category && <Badge tone="vio">{lang === 'ka' ? (LINK_CAT_KA[l.category] || l.category) : l.category}</Badge>}
                <span className="text-[11px] text-dim truncate">{l.url.replace(/^https?:\/\//, '').slice(0, 40)}</span>
              </div>
              {l.note && <div className="text-xs text-mut mt-1">{l.note}</div>}
            </div>
            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
              <Btn tone="quiet" icon="edit" onClick={() => setEditing(l)} />
              <Btn tone="quiet" icon="trash" onClick={() => del(l)} />
            </div>
          </div>
        ))}
      </div>
      <Modal open={adding || !!editing} onClose={() => { setAdding(false); setEditing(null) }} title={editing ? t('ბმულის რედაქტირება', 'Edit link') : t('ბმულის დამატება', 'Add link')}>
        <LinkForm link={editing} onDone={() => { setAdding(false); setEditing(null); refresh(); toast(t('შენახულია', 'Saved')) }} />
      </Modal>
      {toastNode}
    </div>
  )
}

function LinkForm({ link, onDone }) {
  const t = useT()
  const { lang } = useLang()
  const [f, setF] = useState({ title: '', url: 'https://', category: 'Tool', note: '', ...(link || {}) })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const save = async (e) => {
    e.preventDefault()
    if (!f.title.trim() || !f.url.trim()) return
    await api.send(link ? `/api/links/${link.id}` : '/api/links', link ? 'PATCH' : 'POST', f)
    onDone()
  }
  return (
    <form onSubmit={save} className="space-y-4">
      <Field label={t('სათაური', 'Title')}><input className={inp} value={f.title} onChange={set('title')} autoFocus required /></Field>
      <Field label="URL"><input className={inp} value={f.url} onChange={set('url')} required /></Field>
      <Field label={t('კატეგორია', 'Category')}><select className={inp} value={f.category} onChange={set('category')}>{CATS.map(c => <option key={c} value={c}>{lang === 'ka' ? (LINK_CAT_KA[c] || c) : c}</option>)}</select></Field>
      <Field label={t('შენიშვნა', 'Note')}><input className={inp} value={f.note} onChange={set('note')} placeholder={t('რისთვის არის, სად ინახება შესვლის მონაცემები, ვის ეკუთვნის…', "What it's for, login location, who owns it…")} /></Field>
      <div className="flex justify-end gap-2 pt-1">
        <Btn tone="ghost" onClick={onDone}>{t('გაუქმება', 'Cancel')}</Btn>
        <Btn tone="primary" type="submit">{t('შენახვა', 'Save')}</Btn>
      </div>
    </form>
  )
}
