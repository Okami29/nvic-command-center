import React, { useMemo, useState } from 'react'
import { api, Icon, Badge, Bar, Ring, Btn, Modal, Field, inp, PageHead, useToast } from '../ui.jsx'
import { useLang, useT, STATUS_KA, PRIO_KA, kaTask, kaWs } from '../i18n.jsx'

const STATUS = {
  todo: { ka: 'შესასრულებელია', en: 'To do', tone: 'mut', icon: 'clock' },
  doing: { ka: 'მიმდინარეობს', en: 'In progress', tone: 'cy', icon: 'bolt' },
  done: { ka: 'შესრულებულია', en: 'Done', tone: 'ok', icon: 'check' },
  blocked: { ka: 'შეფერხებულია', en: 'Blocked', tone: 'bad', icon: 'flag' }
}
const CYCLE = { todo: 'doing', doing: 'done', done: 'todo', blocked: 'doing' }

export default function Checklist({ data, refresh }) {
  const t = useT()
  const { lang } = useLang()
  const [filter, setFilter] = useState('all')
  const [statusF, setStatusF] = useState('all')
  const [ownerF, setOwnerF] = useState('all')
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [toast, toastNode] = useToast()

  const owners = useMemo(() => [...new Set(data.tasks.map(x => x.owner).filter(Boolean))].sort(), [data.tasks])
  const title = (x) => (lang === 'ka' && kaTask(x.id)) ? kaTask(x.id) : x.title

  const setTask = async (task, patch) => {
    await api.send(`/api/tasks/${task.id}`, 'PATCH', patch)
    refresh()
  }

  const addTask = async (ws) => {
    if (!newTitle.trim()) return
    const maxSort = Math.max(0, ...data.tasks.filter(x => x.ws === ws).map(x => x.sort || 0))
    await api.send('/api/tasks', 'POST', { ws, title: newTitle.trim(), priority: 'essential', status: 'todo', sort: maxSort + 1 })
    setNewTitle(''); setAdding(null); refresh(); toast(t('ამოცანა დამატებულია', 'Task added'))
  }

  const totals = data.tasks
  const doneAll = totals.filter(x => x.status === 'done').length
  const ess = totals.filter(x => x.priority === 'essential')
  const essDone = ess.filter(x => x.status === 'done').length

  return (
    <div>
      <PageHead title={t('დაწყებისთვის მოსამზადებელი ამოცანები', 'Launch Checklist')}
        ka={lang === 'ka' ? null : 'გაშვების ჩექ-ლისტი'}
        desc={t('რვა სამუშაო მიმართულება — ყველა ამოცანა კონცეფციის დამტკიცებიდან კონკურსის გამოცხადებამდე. დააჭირეთ სტატუსის წრეს ამოცანის გადასაყვან შემდეგ მდგომარეობაში. მონიშნული „შეიძლება მოგვიანებით“ ამოცანები შეიძლება დასრულდეს რეგისტრაციის გახსნის შემდეგ.', 'Eight workstreams, every task from concept approval to go-live. Click a status circle to advance a task. Items marked “can follow” may be finished after registration opens.')}
        right={
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold tabular-nums">{doneAll}/{totals.length} <span className="text-dim font-normal">{t('ამოცანა', 'tasks')}</span></div>
              <div className="text-xs text-dim tabular-nums">{essDone}/{ess.length} {t('აუცილებელი', 'essential')}</div>
            </div>
            <div className="relative"><Ring value={totals.length ? doneAll / totals.length : 0} size={52} stroke={6} tone={doneAll === totals.length ? 'var(--color-ok)' : 'var(--color-cy)'} /><span className="absolute inset-0 flex items-center justify-center text-xs font-bold tabular-nums">{Math.round((doneAll / (totals.length || 1)) * 100)}%</span></div>
          </div>
        }
      />

      {/* filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6 rise">
        {[['all', t('ყველა ამოცანა', 'All tasks')], ['essential', t('დაწყებამდე აუცილებელი', 'Launch-essential')], ['later', t('შეიძლება მოგვიანებით', 'Can follow')]].map(([v, l]) => (
          <Chip key={v} active={filter === v} onClick={() => setFilter(v)}>{l}</Chip>
        ))}
        <span className="w-px h-6 bg-line mx-1 hidden sm:block" />
        <select value={statusF} onChange={e => setStatusF(e.target.value)} className={inp + ' !w-auto !py-1.5 !rounded-full text-xs'}>
          <option value="all">{t('ყველა სტატუსი', 'Any status')}</option>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{lang === 'ka' ? v.ka : v.en}</option>)}
        </select>
        <select value={ownerF} onChange={e => setOwnerF(e.target.value)} className={inp + ' !w-auto !py-1.5 !rounded-full text-xs'}>
          <option value="all">{t('ყველა პასუხისმგებელი', 'Any owner')}</option>
          {owners.map(o => <option key={o} value={o}>{o}</option>)}
          <option value="__none">{t('პასუხისმგებელი არ არის დანიშნული', 'Unassigned')}</option>
        </select>
      </div>

      <div className="space-y-5">
        {data.workstreams.map(w => {
          let ts = data.tasks.filter(x => x.ws === w.id)
          const all = ts
          if (filter !== 'all') ts = ts.filter(x => x.priority === filter)
          if (statusF !== 'all') ts = ts.filter(x => x.status === statusF)
          if (ownerF !== 'all') ts = ts.filter(x => ownerF === '__none' ? !x.owner : x.owner === ownerF)
          const done = all.filter(x => x.status === 'done').length
          const ratio = all.length ? done / all.length : 0
          const wk = lang === 'ka' ? kaWs(w.id) : null
          return (
            <section key={w.id} className="card card-hover overflow-hidden rise">
              <div className="px-5 sm:px-6 py-4 flex items-center gap-4 border-b border-line bg-ink-950/70">
                <div className="relative shrink-0">
                  <Ring value={ratio} size={44} tone={ratio === 1 ? 'var(--color-ok)' : 'var(--color-cy)'} />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tabular-nums">{done}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-cy bg-cy/10 border border-cy/25 rounded-md px-1.5 py-0.5">{w.code}</span>
                    <h2 className="font-display font-bold tracking-tight">{wk ? wk.name : w.name}</h2>
                  </div>
                  <div className="text-xs text-dim mt-0.5">{wk ? t(`სამუშაო პერიოდი: ${wk.window}`, '') : `${w.ka} · Window: ${w.window}`}</div>
                </div>
                <div className="hidden sm:block w-36 shrink-0"><Bar value={ratio} tone={ratio === 1 ? 'bg-ok' : 'bg-cy'} h="h-1.5" /></div>
              </div>

              <div className="p-2 sm:p-3">
                {ts.length === 0 && <div className="text-dim text-sm px-3 py-3">{t('მიმდინარე ფილტრით ამოცანა არ მოიძებნა.', 'No tasks match the current filters.')}</div>}
                {ts.map(x => (
                  <div key={x.id} className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-ink-950 transition-colors">
                    <button onClick={() => setTask(x, { status: CYCLE[x.status] })} title={lang === 'ka' ? STATUS[x.status].ka : STATUS[x.status].en}
                      className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${x.status === 'done' ? 'bg-ok border-ok text-ink-950' : x.status === 'doing' ? 'border-cy text-cy' : x.status === 'blocked' ? 'border-bad text-bad' : 'border-ink-600 text-transparent hover:border-cy/60'}`}>
                      <Icon n={STATUS[x.status].icon} s={13} />
                    </button>
                    <button onClick={() => setEditing(x)} className="flex-1 min-w-0 text-left">
                      <div className={`text-sm leading-snug ${x.status === 'done' ? 'text-dim line-through' : 'text-fg'}`}>{title(x)}</div>
                      {(x.owner || x.due || x.note) && (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-dim mt-0.5">
                          {x.owner && <span className="flex items-center gap-1"><span className="w-3.5 h-3.5 rounded-full bg-vio/20 text-vio flex items-center justify-center text-[8px] font-bold">{x.owner[0]}</span>{x.owner}</span>}
                          {x.due && <span className="flex items-center gap-1"><Icon n="cal" s={11} />{x.due}</span>}
                          {x.note && <span className="italic truncate max-w-[220px]">“{x.note}”</span>}
                        </div>
                      )}
                    </button>
                    {x.priority === 'essential'
                      ? <Badge tone="cy" cls="shrink-0 hidden sm:inline-flex">{t('აუცილებელი', 'essential')}</Badge>
                      : <Badge tone="mut" cls="shrink-0">{t('მოგვიანებით', 'can follow')}</Badge>}
                    {x.status === 'doing' && <Badge tone="cy" cls="shrink-0">{t('მიმდინარეობს', 'doing')}</Badge>}
                    {x.status === 'blocked' && <Badge tone="bad" cls="shrink-0">{t('შეფერხებულია', 'blocked')}</Badge>}
                  </div>
                ))}
                {adding === w.id ? (
                  <form onSubmit={e => { e.preventDefault(); addTask(w.id) }} className="flex gap-2 px-3 py-2">
                    <input autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder={t('ახალი ამოცანის სათაური… (Enter — შენახვა)', 'New task title… (Enter to save)')} className={inp + ' !py-2'} />
                    <Btn type="submit" tone="primary" icon="plus">{t('დამატება', 'Add')}</Btn>
                    <Btn tone="quiet" onClick={() => { setAdding(null); setNewTitle('') }}>{t('გაუქმება', 'Cancel')}</Btn>
                  </form>
                ) : (
                  <button onClick={() => { setAdding(w.id); setNewTitle('') }} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-dim hover:text-cy hover:bg-ink-950 transition-colors">
                    <Icon n="plus" s={15} /> {t(`ამოცანის დამატება (${w.code})`, `Add task to ${w.code}`)}
                  </button>
                )}
              </div>
            </section>
          )
        })}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={t('ამოცანის რედაქტირება', 'Edit task')} wide={!!editing}>
        {editing && <TaskForm task={editing} owners={owners} onDone={() => { setEditing(null); refresh(); toast(t('ამოცანა განახლებულია', 'Task updated')) }} />}
      </Modal>
      {toastNode}
    </div>
  )
}

function TaskForm({ task, owners, onDone }) {
  const t = useT()
  const { lang } = useLang()
  const [f, setF] = useState({ ...task })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const save = async (e) => {
    e.preventDefault()
    await api.send(`/api/tasks/${task.id}`, 'PATCH', f)
    onDone()
  }
  const del = async () => {
    if (!confirm(t('წაიშალოს ეს ამოცანა?', 'Delete this task?'))) return
    await api.send(`/api/tasks/${task.id}`, 'DELETE')
    onDone()
  }
  return (
    <form onSubmit={save} className="space-y-4">
      <Field label={t('სათაური', 'Title')}><input className={inp} value={f.title} onChange={set('title')} required /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label={t('სტატუსი', 'Status')}>
          <select className={inp} value={f.status} onChange={set('status')}>
            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{lang === 'ka' ? v.ka : v.en}</option>)}
          </select>
        </Field>
        <Field label={t('პრიორიტეტი', 'Priority')}>
          <select className={inp} value={f.priority} onChange={set('priority')}>
            <option value="essential">{t('დაწყებამდე აუცილებელია', 'Launch-essential')}</option>
            <option value="later">{t('შეიძლება მოგვიანებით', 'Can follow')}</option>
          </select>
        </Field>
        <Field label={t('პასუხისმგებელი პირი', 'Owner')}>
          <input className={inp} list="owners" value={f.owner} onChange={set('owner')} placeholder={t('პასუხისმგებელი არ არის დანიშნული', 'Unassigned')} />
          <datalist id="owners">{owners.map(o => <option key={o} value={o} />)}</datalist>
        </Field>
        <Field label={t('ვადა (თავისუფალი ტექსტი)', 'Due (free text)')}><input className={inp} value={f.due} onChange={set('due')} placeholder={t('მაგ.: 22 ნოემბერი', 'e.g. Nov 22')} /></Field>
      </div>
      <Field label={t('შენიშვნები', 'Notes')}><textarea className={inp} rows={3} value={f.note} onChange={set('note')} placeholder={t('კონტექსტი, შეფერხებები, ბმულები…', 'Context, blockers, links…')} /></Field>
      <div className="flex justify-between pt-2">
        <Btn tone="danger" icon="trash" onClick={del}>{t('წაშლა', 'Delete')}</Btn>
        <div className="flex gap-2">
          <Btn tone="ghost" onClick={onDone}>{t('გაუქმება', 'Cancel')}</Btn>
          <Btn tone="primary" type="submit">{t('შენახვა', 'Save')}</Btn>
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
