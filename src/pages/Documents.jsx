import React, { useMemo, useState } from 'react'
import { api, Icon, Badge, Btn, Modal, Field, inp, PageHead, Empty, size, ago, useToast } from '../ui.jsx'
import { useLang, useT, DOCST_KA, DOCST_ACT_KA, DOC_CAT_KA, kaDoc } from '../i18n.jsx'

const CATS = ['Concept', 'Legal', 'Application', 'Judging', 'Finance', 'Communications', 'Event', 'Operations', 'Other']
const ST = {
  draft: { ka: 'სამუშაო ვერსია', en: 'Draft', tone: 'mut' },
  review: { ka: 'განხილვის პროცესშია', en: 'In review', tone: 'warn' },
  approved: { ka: 'დამტკიცებულია', en: 'Approved', tone: 'ok' }
}
const NEXT = { draft: 'review', review: 'approved', approved: 'draft' }

export default function Documents({ data, refresh }) {
  const t = useT()
  const { lang } = useLang()
  const [cat, setCat] = useState('all')
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toast, toastNode] = useToast()

  const docs = useMemo(() => {
    const d = cat === 'all' ? data.documents : data.documents.filter(x => x.category === cat)
    return [...d].sort((a, b) => (a.status === b.status ? 0 : a.status === 'approved' ? 1 : b.status === 'approved' ? -1 : a.status === 'draft' ? 1 : -1))
  }, [data.documents, cat])

  const name = (d) => (lang === 'ka' && kaDoc(d.id)) ? kaDoc(d.id).name : d.name
  const cycle = async (d) => {
    await api.send(`/api/documents/${d.id}`, 'PATCH', { status: NEXT[d.status] })
    refresh()
    toast(lang === 'ka' ? `„${name(d)}“ → ${DOCST_KA[NEXT[d.status]]}` : `“${d.name}” → ${ST[NEXT[d.status]].en}`)
  }

  return (
    <div>
      <PageHead title={t('დოკუმენტები', 'Documents')}
        ka={lang === 'ka' ? null : 'დოკუმენტაცია'}
        desc={t('ყველა საწყისი დოკუმენტი ერთ სივრცეში — ატვირთეთ ფაილები, თვალი ადევნეთ დამტკიცების სტატუსს, შეინახეთ ვერსიების ისტორია. კონკურსის დებულება პირველი დოკუმენტია, რომელიც უნივერსიტეტს უნდა წარედგინოს.', 'Every launch document in one place — upload files, track approval status, keep version history. The regulations (დებულება) are the first document for NVU approval.')}
        right={<Btn tone="primary" icon="plus" onClick={() => setAdding(true)}>{t('ახალი დოკუმენტი', 'New document')}</Btn>}
      />

      <div className="flex flex-wrap gap-2 mb-6 rise">
        <Chip active={cat === 'all'} onClick={() => setCat('all')}>{t('ყველა', 'All')} · {data.documents.length}</Chip>
        {CATS.map(c => {
          const n = data.documents.filter(d => d.category === c).length
          return n ? <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{lang === 'ka' ? (DOC_CAT_KA[c] || c) : c} · {n}</Chip> : null
        })}
      </div>

      {docs.length === 0 && <Empty icon="doc" title={t('აქ დოკუმენტები ჯერ არ არის', 'No documents here yet')} hint={t('ატვირთეთ კონცეფცია, კონკურსის დებულება, შეფასების სქემა, თანხმობების პაკეტი — ყველაფერი, რაც კომიტეტს გასახსნელად და დასამტკიცებლად სჭირდება.', 'Upload the concept, regulations, rubric, consent pack — everything the committee needs to open and approve.')} action={<Btn tone="primary" icon="up" onClick={() => setAdding(true)}>{t('დოკუმენტის ატვირთვა', 'Upload document')}</Btn>} />}

      <div className="grid md:grid-cols-2 gap-4">
        {docs.map(d => {
          const versions = JSON.parse(d.versions || '[]')
          const dk = lang === 'ka' ? kaDoc(d.id) : null
          return (
            <div key={d.id} className="card card-hover p-5 rise flex flex-col">
              <div className="flex items-start gap-3.5">
                <span className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${d.file ? 'text-cy bg-cy/10 border-cy/25' : 'text-dim bg-ink-800 border-line'}`}>
                  <Icon n={d.file ? 'doc' : 'plus'} s={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm leading-snug">{name(d)}</div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <Badge tone="vio">{lang === 'ka' ? (DOC_CAT_KA[d.category] || d.category) : d.category}</Badge>
                    <Badge tone={ST[d.status]?.tone}>{lang === 'ka' ? (DOCST_KA[d.status] || d.status) : (ST[d.status]?.en || d.status)}</Badge>
                    {d.owner && <Badge tone="mut">{d.owner}</Badge>}
                  </div>
                </div>
              </div>
              {(d.note || dk) && <p className="text-xs text-mut mt-3 leading-relaxed">{dk ? dk.note : d.note}</p>}
              <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                <div className="text-[11px] text-dim">
                  {d.file
                    ? <a href={`/uploads/${encodeURIComponent(d.file)}`} download={d.orig} className="text-cy hover:underline flex items-center gap-1"><Icon n="down" s={13} />{d.orig.slice(-28)} · {size(d.size)}{versions.length ? ` · v${versions.length + 1}` : ''}</a>
                    : <span className="flex items-center gap-1"><Icon n="up" s={13} />{t('ფაილი ჯერ არ არის ატვირთული', 'No file uploaded yet')}</span>}
                </div>
                <div className="flex items-center gap-1">
                  <Btn tone="quiet" icon="check" onClick={() => cycle(d)}>{lang === 'ka' ? DOCST_ACT_KA[NEXT[d.status]] : (NEXT[d.status] === 'approved' ? 'Approve' : NEXT[d.status] === 'review' ? 'Review' : 'Reopen')}</Btn>
                  <Btn tone="quiet" icon="edit" onClick={() => setEditing(d)} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title={t('ახალი დოკუმენტი', 'New document')} wide>
        <DocForm onDone={() => { setAdding(false); refresh(); toast(t('დოკუმენტი დამატებულია', 'Document added')) }} />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={t('დოკუმენტის რედაქტირება', 'Edit document')} wide>
        {editing && <DocForm doc={editing} onDone={() => { setEditing(null); refresh(); toast(t('დოკუმენტი განახლებულია', 'Document updated')) }} />}
      </Modal>
      {toastNode}
    </div>
  )
}

function DocForm({ doc, onDone }) {
  const t = useT()
  const { lang } = useLang()
  const [f, setF] = useState({ name: doc?.name || '', category: doc?.category || 'Concept', note: doc?.note || '', status: doc?.status || 'draft', owner: doc?.owner || '' })
  const [file, setFile] = useState(null)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const save = async (e) => {
    e.preventDefault()
    if (file) {
      const fd = new FormData()
      fd.append('file', file)
      Object.entries(f).forEach(([k, v]) => fd.append(k, v))
      await api.send(doc ? `/api/documents/${doc.id}` : '/api/documents', doc ? 'PATCH' : 'POST', fd, true)
    } else {
      await api.send(doc ? `/api/documents/${doc.id}` : '/api/documents', doc ? 'PATCH' : 'POST', f)
    }
    onDone()
  }
  const del = async () => {
    if (!confirm(t('წაიშალოს ეს დოკუმენტი და მისი ფაილი?', 'Delete this document and its file?'))) return
    await api.send(`/api/documents/${doc.id}`, 'DELETE')
    onDone()
  }
  return (
    <form onSubmit={save} className="space-y-4">
      <Field label={t('დოკუმენტის სათაური', 'Document name')}><input className={inp} value={f.name} onChange={set('name')} placeholder={t('მაგ.: 02. კონკურსის დებულება', 'e.g. 02. Official Regulations / დებულება')} required /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label={t('კატეგორია', 'Category')}>
          <select className={inp} value={f.category} onChange={set('category')}>{CATS.map(c => <option key={c} value={c}>{lang === 'ka' ? (DOC_CAT_KA[c] || c) : c}</option>)}</select>
        </Field>
        <Field label={t('სტატუსი', 'Status')}>
          <select className={inp} value={f.status} onChange={set('status')}>{Object.entries(ST).map(([k, v]) => <option key={k} value={k}>{lang === 'ka' ? v.ka : v.en}</option>)}</select>
        </Field>
        <Field label={t('პასუხისმგებელი პირი', 'Owner / responsible')}><input className={inp} value={f.owner} onChange={set('owner')} placeholder={t('პასუხისმგებელი არ არის დანიშნული', 'Unassigned')} /></Field>
        <Field label={doc ? t('ფაილი (ახალი ვერსია)', 'File (new version)') : t('ფაილი', 'File')}>
          <input type="file" onChange={e => setFile(e.target.files[0])}
            className="w-full text-sm text-mut file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-cy/15 file:text-cy file:font-semibold file:cursor-pointer bg-ink-900/80 border border-line rounded-xl px-3 py-2" />
        </Field>
      </div>
      <Field label={t('დანიშნულება / შენიშვნები', 'Purpose / notes')}><textarea className={inp} rows={2} value={f.note} onChange={set('note')} /></Field>
      {doc && JSON.parse(doc.versions || '[]').length > 0 && (
        <div className="text-xs text-dim space-y-1">
          {JSON.parse(doc.versions).map((v, i) => (
            <div key={i}>v{i + 1} · <a className="text-cy hover:underline" href={`/uploads/${encodeURIComponent(v.file)}`} download={v.orig}>{v.orig}</a> · {size(v.size)} · {ago(v.at)}</div>
          ))}
        </div>
      )}
      <div className="flex justify-between pt-2">
        {doc ? <Btn tone="danger" icon="trash" onClick={del}>{t('წაშლა', 'Delete')}</Btn> : <span />}
        <div className="flex gap-2">
          <Btn tone="ghost" onClick={onDone}>{t('გაუქმება', 'Cancel')}</Btn>
          <Btn tone="primary" type="submit">{doc ? t('შენახვა', 'Save') : t('დოკუმენტის დამატება', 'Add document')}</Btn>
        </div>
      </div>
    </form>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${active ? 'bg-cy/15 text-cy border-cy/40' : 'bg-ink-800 text-mut border-line hover:border-line-strong hover:text-fg'}`}>
      {children}
    </button>
  )
}
