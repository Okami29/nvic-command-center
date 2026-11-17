import React, { useState } from 'react'
import { api, Icon, Btn, PageHead, Empty, ago, useToast } from '../ui.jsx'
import { useLang, useT, kaNote, kaActor } from '../i18n.jsx'

export default function Notes({ data, refresh }) {
  const t = useT()
  const { lang } = useLang()
  const [body, setBody] = useState('')
  const [toast, toastNode] = useToast()
  const user = localStorage.getItem('nvic-user') || 'guest'

  const post = async (e) => {
    e.preventDefault()
    if (!body.trim()) return
    await api.send('/api/notes', 'POST', { body: body.trim() })
    setBody(''); refresh(); toast(t('ჩანაწერი გამოქვეყნდა', 'Note posted'))
  }
  const del = async (n) => {
    if (confirm(t('წაიშალოს ჩანაწერი?', 'Delete note?'))) { await api.send(`/api/notes/${n.id}`, 'DELETE'); refresh() }
  }

  return (
    <div>
      <PageHead title={t('გუნდის ჩანაწერები', 'Team Notes')}
        ka={lang === 'ka' ? null : 'შენიშვნები'}
        desc={t('სწრაფი გადაწყვეტილებები, პრინციპები და შეხსენებები საორგანიზაციო გუნდისთვის. მოკლე, სამიძებნელი, დროის მისაღწევი.', 'Quick decisions, principles and reminders for the organizing team. Short, searchable, timestamped.')} />

      <form onSubmit={post} className="card p-4 mb-6 rise">
        <textarea value={body} onChange={e => setBody(e.target.value)} rows={3}
          placeholder={t('დაწერეთ ჩანაწერი… (Ctrl+Enter — გამოქვეყნება)', 'Write a note… (Ctrl+Enter to post)')}
          onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) post(e) }}
          className="w-full bg-transparent text-sm text-fg placeholder:text-dim/70 resize-none" />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-dim">{t('ავტორი:', 'Posting as')} <b className="text-mut">{kaActor(user)}</b></span>
          <Btn tone="primary" type="submit" icon="send">{t('გამოქვეყნება', 'Post')}</Btn>
        </div>
      </form>

      {data.notes.length === 0 && <Empty icon="note" title={t('ჩანაწერები ჯერ არ არის', 'No notes yet')} hint={t('აქ ჩაწერეთ დაწყების პრინციპები, რომ არაფერი დარჩეს მხოლოდ ვინმეს თავში.', 'Capture the launch principles here so nothing lives only in someone’s head.')} />}

      <div className="space-y-3">
        {data.notes.map(n => (
          <div key={n.id} className="card card-hover p-5 group rise">
            <div className="flex items-start gap-3.5">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-cy to-cy-deep flex items-center justify-center text-white text-xs font-bold shrink-0">{kaActor(n.by_)[0].toUpperCase()}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{kaActor(n.by_)}</span>
                  <span className="text-[11px] text-dim">{ago(n.created_at)}</span>
                  <button onClick={() => del(n)} className="ml-auto text-dim hover:text-bad opacity-0 group-hover:opacity-100 transition-opacity"><Icon n="trash" s={14} /></button>
                </div>
                <p className="text-sm text-mut mt-1.5 leading-relaxed whitespace-pre-wrap">{(lang === 'ka' && kaNote(n.id)) ? kaNote(n.id) : n.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {toastNode}
    </div>
  )
}
