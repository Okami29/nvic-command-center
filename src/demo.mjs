// Client-side demo store: mirrors the server API when no backend is reachable
// (GitHub Pages static hosting). Data persists in localStorage.
import SEED from './demo-seed.json'

const KEY = 'nvic-demo-db-v1'
const now = () => new Date().toISOString()
const TABLES = ['workstreams', 'tasks', 'documents', 'links', 'questions', 'answers', 'sponsors', 'people', 'responsibilities', 'events', 'notes', 'activity']
const DEFAULTS = {
  tasks: { priority: 'essential', status: 'todo', sort: 999 },
  links: { created_at: now },
  questions: { status: 'open', created_at: now },
  answers: { created_at: now },
  sponsors: { stage: 'idea', created_at: now, updated_at: now },
  notes: { created_at: now },
  documents: { status: 'draft', created_at: now, updated_at: now, versions: '[]' }
}
const FIELDS = {
  workstreams: ['code', 'name', 'ka', 'window', 'sort'],
  tasks: ['ws', 'title', 'ka', 'priority', 'status', 'owner', 'due', 'note', 'sort'],
  links: ['title', 'url', 'category', 'note', 'created_at'],
  questions: ['q', 'detail', 'asked_by', 'category', 'status', 'created_at'],
  answers: ['qid', 'a', 'by_', 'created_at'],
  sponsors: ['name', 'type', 'stage', 'contact', 'email', 'phone', 'value', 'owner', 'note', 'verified', 'created_at', 'updated_at'],
  people: ['name', 'role', 'org', 'email', 'phone', 'note'],
  responsibilities: ['func', 'lead', 'note'],
  events: ['title', 'date', 'label', 'phase', 'note'],
  notes: ['body', 'by_', 'created_at'],
  documents: ['name', 'category', 'note', 'status', 'owner']
}
const NAME_KEYS = ['title', 'name', 'q', 'func', 'url', 'body']

let db = null
function load() {
  if (db) return db
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) { db = JSON.parse(raw); return db }
  } catch (e) { /* fall through */ }
  db = JSON.parse(JSON.stringify(SEED))
  for (const t of TABLES) if (!db[t]) db[t] = []
  save()
  return db
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(db)) } catch (e) { /* quota */ } }
const nextId = (rows) => rows.reduce((m, r) => Math.max(m, r.id || 0), 0) + 1
const label = (o) => { for (const k of NAME_KEYS) if (o && o[k]) return String(o[k]); return '#' + (o?.id ?? '?') }
function log(actor, action, target) {
  const d = load()
  d.activity.unshift({ id: nextId(d.activity), actor, action, target: String(target).slice(0, 160), created_at: now() })
  d.activity = d.activity.slice(0, 200)
}

export async function demoFetch(path, init = {}) {
  const d = load()
  const method = (init.method || 'GET').toUpperCase()
  const u = new URL(path, 'http://x')
  const parts = u.pathname.replace(/^\/api\//, '').split('/')
  const table = parts[0]
  const id = parts[1] ? Number(parts[1]) : null
  const actor = decodeURIComponent((init.headers && (init.headers['x-user'] || (init.headers.get && init.headers.get('x-user')))) || 'guest')
  let body = {}
  if (init.body && typeof init.body === 'string') { try { body = JSON.parse(init.body) } catch (e) { /* empty */ } }
  const json = (v) => v

  if (table === 'bootstrap') {
    const sorted = { ...d }
    return json(d)
  }
  if (table === 'search') {
    const q = (u.searchParams.get('q') || '').trim().toLowerCase()
    if (!q) return json([])
    const spec = { tasks: ['title', 'note'], documents: ['name', 'category', 'note'], sponsors: ['name', 'contact', 'note', 'type'], questions: ['q', 'detail', 'category'], links: ['title', 'url', 'note'], notes: ['body'], people: ['name', 'role', 'org'] }
    const out = []
    for (const [t, cols] of Object.entries(spec))
      for (const r of d[t] || [])
        if (cols.some(c => String(r[c] || '').toLowerCase().includes(q))) { out.push({ ...r, _t: t }); if (out.length >= 40) return json(out) }
    return json(out)
  }
  if (table === 'activity' && method === 'GET') return json(d.activity.slice(0, 200))

  if (!TABLES.includes(table)) return json({ error: 'not found' })
  const rows = d[table]

  if (method === 'GET') {
    if (id) return json(rows.find(r => r.id === id) || { error: 'not found' })
    return json([...rows].sort((a, b) => a.id - b.id))
  }
  if (method === 'POST') {
    let fileMeta = {}
    if (init.body instanceof FormData) {
      for (const [k, v] of init.body.entries()) if (typeof v === 'string') body[k] = v
      const f = init.body.get('file')
      if (f && f.name) fileMeta = { name: body.name || f.name, orig: f.name, mime: f.type, size: f.size, file: '' }
    }
    const row = { id: nextId(rows) }
    for (const f of FIELDS[table] || []) {
      const dv = (DEFAULTS[table] || {})[f]
      row[f] = body[f] !== undefined ? body[f] : (typeof dv === 'function' ? dv() : (dv !== undefined ? dv : ''))
    }
    Object.assign(row, fileMeta)
    if (table === 'documents') { row.file = ''; row.versions = '[]'; row.created_at = now(); row.updated_at = now() }
    rows.push(row)
    log(actor, `created ${table.slice(0, -1)}`, label(row))
    save()
    return json(row)
  }
  if (method === 'PATCH' || method === 'PUT') {
    const row = rows.find(r => r.id === id)
    if (!row) return json({ error: 'not found' })
    if (init.body instanceof FormData) for (const [k, v] of init.body.entries()) if (typeof v === 'string') body[k] = v
    for (const f of FIELDS[table] || []) if (body[f] !== undefined) row[f] = body[f]
    if (table === 'sponsors' || table === 'documents') row.updated_at = now()
    if (table === 'tasks') row.updated_at = now()
    log(actor, `updated ${table.slice(0, -1)}`, label(row))
    save()
    return json(row)
  }
  if (method === 'DELETE') {
    const i = rows.findIndex(r => r.id === id)
    const cur = i >= 0 ? rows.splice(i, 1)[0] : null
    log(actor, `deleted ${table.slice(0, -1)}`, label(cur))
    save()
    return json({ ok: true })
  }
  return json({ error: 'method not allowed' })
}

export function demoReset() {
  localStorage.removeItem(KEY)
  db = null
  location.reload()
}
