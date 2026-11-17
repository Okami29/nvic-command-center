import express from 'express'
import Database from 'better-sqlite3'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DATA = path.join(ROOT, 'data')
const UPLOADS = path.join(DATA, 'uploads')
fs.mkdirSync(UPLOADS, { recursive: true })

const db = new Database(path.join(DATA, 'nvic.db'))
db.pragma('journal_mode = WAL')

// ---------- schema ----------
db.exec(`
CREATE TABLE IF NOT EXISTS workstreams (
  id INTEGER PRIMARY KEY, code TEXT, name TEXT, ka TEXT, window TEXT, sort INTEGER
);
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY, ws INTEGER, title TEXT, ka TEXT,
  priority TEXT DEFAULT 'essential', status TEXT DEFAULT 'todo',
  owner TEXT DEFAULT '', due TEXT DEFAULT '', note TEXT DEFAULT '',
  sort INTEGER, updated_at TEXT
);
CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY, name TEXT, category TEXT, note TEXT,
  status TEXT DEFAULT 'draft', owner TEXT DEFAULT '',
  file TEXT DEFAULT '', orig TEXT DEFAULT '', mime TEXT DEFAULT '', size INTEGER DEFAULT 0,
  versions TEXT DEFAULT '[]', created_at TEXT, updated_at TEXT
);
CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY, title TEXT, url TEXT, category TEXT, note TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY, q TEXT, detail TEXT, asked_by TEXT, category TEXT,
  status TEXT DEFAULT 'open', created_at TEXT
);
CREATE TABLE IF NOT EXISTS answers (
  id INTEGER PRIMARY KEY, qid INTEGER, a TEXT, by_ TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS sponsors (
  id INTEGER PRIMARY KEY, name TEXT, type TEXT, stage TEXT,
  contact TEXT, email TEXT, phone TEXT, value TEXT, owner TEXT, note TEXT,
  verified INTEGER DEFAULT 0, created_at TEXT, updated_at TEXT
);
CREATE TABLE IF NOT EXISTS people (
  id INTEGER PRIMARY KEY, name TEXT, role TEXT, org TEXT, email TEXT, phone TEXT, note TEXT
);
CREATE TABLE IF NOT EXISTS responsibilities (
  id INTEGER PRIMARY KEY, func TEXT, lead TEXT, note TEXT
);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY, title TEXT, date TEXT, label TEXT, phase TEXT, note TEXT
);
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY, body TEXT, by_ TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS activity (
  id INTEGER PRIMARY KEY, actor TEXT, action TEXT, target TEXT, created_at TEXT
);
`)

// ---------- seed (first run only) ----------
const count = db.prepare('SELECT COUNT(*) c FROM workstreams').get().c
if (count === 0) {
  const { seed } = await import('./seed-data.mjs')
  seed(db)
  console.log('Database seeded.')
}

// ---------- helpers ----------
const now = () => new Date().toISOString()
const app = express()
app.use(express.json({ limit: '2mb' }))

const actor = (req) => decodeURIComponent(req.headers['x-user'] || 'guest')
const NAME_KEYS = ['title', 'name', 'q', 'func', 'url', 'body']
const label = (obj, cols) => {
  for (const k of NAME_KEYS) if (obj && obj[k]) return obj[k]
  return obj && obj[cols[0]] ? obj[cols[0]] : `#${obj?.id ?? '?'}`
}
const log = (req, action, target) => {
  try {
    db.prepare('INSERT INTO activity (actor, action, target, created_at) VALUES (?,?,?,?)')
      .run(actor(req), action, String(target).slice(0, 160), now())
  } catch (e) { console.error('log', e.message) }
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS),
    filename: (req, file, cb) => {
      const safe = Buffer.from(file.originalname, 'latin1').toString('utf8')
        .replace(/[\/\\:*?"<>|]/g, '_').slice(-120)
      cb(null, Date.now() + '-' + crypto.randomBytes(3).toString('hex') + '-' + safe)
    }
  }),
  limits: { fileSize: 80 * 1024 * 1024 }
})

function crud(name, fields, defaults = {}) {
  const cols = Object.keys(fields)
  app.get(`/api/${name}`, (req, res) => res.json(db.prepare(`SELECT * FROM ${name} ORDER BY id`).all()))
  app.post(`/api/${name}`, (req, res) => {
    const vals = {}
    for (const f of cols) vals[f] = req.body[f] !== undefined ? req.body[f] : (defaults[f] !== undefined ? defaults[f] : '')
    const keys = cols.join(',')
    const ph = cols.map(c => '@' + c).join(',')
    const info = db.prepare(`INSERT INTO ${name} (${keys}) VALUES (${ph})`).run(vals)
    log(req, `created ${name.slice(0, -1)}`, label(vals, cols))
    res.json(db.prepare(`SELECT * FROM ${name} WHERE id=?`).get(info.lastInsertRowid))
  })
  app.patch(`/api/${name}/:id`, (req, res) => {
    const cur = db.prepare(`SELECT * FROM ${name} WHERE id=?`).get(req.params.id)
    if (!cur) return res.status(404).json({ error: 'not found' })
    const sets = [], vals = {}
    for (const f of cols) if (req.body[f] !== undefined) { sets.push(`${f}=@${f}`); vals[f] = req.body[f] }
    if (sets.length) db.prepare(`UPDATE ${name} SET ${sets.join(',')} WHERE id=@__id`).run({ ...vals, __id: req.params.id })
    const upd = db.prepare(`SELECT * FROM ${name} WHERE id=?`).get(req.params.id)
    log(req, `updated ${name.slice(0, -1)}`, label(upd, cols))
    res.json(upd)
  })
  app.delete(`/api/${name}/:id`, (req, res) => {
    const cur = db.prepare(`SELECT * FROM ${name} WHERE id=?`).get(req.params.id)
    db.prepare(`DELETE FROM ${name} WHERE id=?`).run(req.params.id)
    log(req, `deleted ${name.slice(0, -1)}`, label(cur, cols) )
    res.json({ ok: true })
  })
}

crud('workstreams', { code: 1, name: 1, ka: 1, window: 1, sort: 1 })
crud('tasks', { ws: 1, title: 1, ka: 1, priority: 1, status: 1, owner: 1, due: 1, note: 1, sort: 1 }, { priority: 'essential', status: 'todo', sort: 999 })
crud('links', { title: 1, url: 1, category: 1, note: 1, created_at: 1 }, { created_at: now() })
crud('questions', { q: 1, detail: 1, asked_by: 1, category: 1, status: 1, created_at: 1 }, { status: 'open', created_at: now() })
crud('answers', { qid: 1, a: 1, by_: 1, created_at: 1 }, { created_at: now() })
crud('sponsors', { name: 1, type: 1, stage: 1, contact: 1, email: 1, phone: 1, value: 1, owner: 1, note: 1, verified: 1, created_at: 1, updated_at: 1 }, { stage: 'idea', created_at: now(), updated_at: now() })
crud('people', { name: 1, role: 1, org: 1, email: 1, phone: 1, note: 1 })
crud('responsibilities', { func: 1, lead: 1, note: 1 })
crud('events', { title: 1, date: 1, label: 1, phase: 1, note: 1 })
crud('notes', { body: 1, by_: 1, created_at: 1 }, { created_at: now() })

// ---------- documents (with file upload) ----------
app.get('/api/documents', (req, res) => res.json(db.prepare('SELECT * FROM documents ORDER BY id').all()))

app.post('/api/documents', upload.single('file'), (req, res) => {
  const b = req.body
  const f = req.file
  const info = db.prepare(
    'INSERT INTO documents (name, category, note, status, owner, file, orig, mime, size, versions, created_at, updated_at) VALUES (@name,@category,@note,@status,@owner,@file,@orig,@mime,@size,@versions,@created,@updated)'
  ).run({
    name: b.name || (f ? Buffer.from(f.originalname, 'latin1').toString('utf8') : 'Untitled'),
    category: b.category || 'Other', note: b.note || '', status: b.status || 'draft', owner: b.owner || '',
    file: f ? f.filename : '', orig: f ? Buffer.from(f.originalname, 'latin1').toString('utf8') : '',
    mime: f ? f.mimetype : '', size: f ? f.size : 0, versions: '[]', created_at: now(), updated_at: now()
  })
  log(req, 'added document', b.name || 'Untitled')
  res.json(db.prepare('SELECT * FROM documents WHERE id=?').get(info.lastInsertRowid))
})

app.patch('/api/documents/:id', upload.single('file'), (req, res) => {
  const cur = db.prepare('SELECT * FROM documents WHERE id=?').get(req.params.id)
  if (!cur) return res.status(404).json({ error: 'not found' })
  const b = req.body, f = req.file
  let versions = JSON.parse(cur.versions || '[]')
  if (f && cur.file) versions.push({ file: cur.file, orig: cur.orig, size: cur.size, at: cur.updated_at })
  const sets = [], vals = {}
  for (const fld of ['name', 'category', 'note', 'status', 'owner']) if (b[fld] !== undefined) { sets.push(`${fld}=@${fld}`); vals[fld] = b[fld] }
  if (f) {
    sets.push('file=@file', 'orig=@orig', 'mime=@mime', 'size=@size')
    vals.file = f.filename; vals.orig = Buffer.from(f.originalname, 'latin1').toString('utf8')
    vals.mime = f.mimetype; vals.size = f.size
    sets.push('versions=@versions'); vals.versions = JSON.stringify(versions)
  }
  sets.push('updated_at=@u'); vals.u = now()
  db.prepare(`UPDATE documents SET ${sets.join(',')} WHERE id=@__id`).run({ ...vals, __id: req.params.id })
  log(req, f ? 'uploaded new version of' : 'updated document', b.name || cur.name)
  res.json(db.prepare('SELECT * FROM documents WHERE id=?').get(req.params.id))
})

app.delete('/api/documents/:id', (req, res) => {
  const cur = db.prepare('SELECT * FROM documents WHERE id=?').get(req.params.id)
  db.prepare('DELETE FROM documents WHERE id=?').run(req.params.id)
  log(req, 'deleted document', cur ? cur.name : `#${req.params.id}`)
  res.json({ ok: true })
})

// ---------- bootstrap (everything in one shot) ----------
app.get('/api/bootstrap', (req, res) => {
  const all = (t, order = 'id') => db.prepare(`SELECT * FROM ${t} ORDER BY ${order}`).all()
  res.json({
    workstreams: all('workstreams', 'sort, id'),
    tasks: all('tasks', 'sort, id'),
    documents: all('documents'),
    links: all('links', 'id DESC'),
    questions: all('questions', 'id DESC'),
    answers: all('answers', 'id ASC'),
    sponsors: all('sponsors', 'id DESC'),
    people: all('people', 'id ASC'),
    responsibilities: all('responsibilities', 'id ASC'),
    events: all('events', 'date ASC'),
    notes: all('notes', 'id DESC'),
    activity: all('activity', 'id DESC').slice(0, 200)
  })
})

// ---------- search ----------
app.get('/api/search', (req, res) => {
  const q = `%${(req.query.q || '').trim()}%`
  if (q === '%%') return res.json([])
  const like = (t, cols, extra = '') =>
    db.prepare(`SELECT id, ${cols.join(',')} FROM ${t} WHERE ${cols.map(c => `${c} LIKE ?`).join(' OR ')} ${extra}`).all(...cols.map(() => q)).map(r => ({ ...r, _t: t }))
  const out = [
    ...like('tasks', ['title', 'note']),
    ...like('documents', ['name', 'category', 'note']),
    ...like('sponsors', ['name', 'contact', 'note', 'type']),
    ...like('questions', ['q', 'detail', 'category']),
    ...like('links', ['title', 'url', 'note']),
    ...like('notes', ['body']),
    ...like('people', ['name', 'role', 'org'])
  ]
  res.json(out.slice(0, 40))
})

app.get('/api/activity', (req, res) => res.json(db.prepare('SELECT * FROM activity ORDER BY id DESC LIMIT 200').all()))

// ---------- static ----------
app.use('/uploads', express.static(UPLOADS))
const dist = path.join(ROOT, 'dist')
if (fs.existsSync(dist)) {
  app.use(express.static(dist))
  app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next()
    res.sendFile(path.join(dist, 'index.html'))
  })
}

const PORT = process.env.PORT || 5181
app.listen(PORT, () => console.log(`NVIC Command Center → http://localhost:${PORT}`))
