// NVIC Command Center — seed data (from the board presentation + pre-launch tracker)
export function seed(db) {
  const now = new Date().toISOString()
  const W = [
    [1, 'WS1', 'Institutional Approval & Ownership', 'ინსტიტუციური დამტკიცება და პასუხისმგებლობა', 'Nov 17–19'],
    [2, 'WS2', 'Rules & Legal Documentation', 'წესები და იურიდიული დოკუმენტაცია', 'Nov 18–22'],
    [3, 'WS3', 'Finance & Prizes', 'ფინანსები და ჯილდოები', 'Nov 19–23'],
    [4, 'WS4', 'Application System & Public Website', 'სააპლიკაციო სისტემა და ვებგვერდი', 'Nov 21–26'],
    [5, 'WS5', 'Academic Team & Judging', 'აკადემიური გუნდი და ჟიური', 'Nov 20–27'],
    [6, 'WS6', 'Branding, Schools & Communications', 'ბრენდინგი, სკოლები და კომუნიკაცია', 'Nov 22–29'],
    [7, 'WS7', 'Final Event & Participant Development', 'ფინალური ღონისძიება და მონაწილეთა განვითარება', 'Nov 23–28'],
    [8, 'WS8', 'Quality Assurance & Go-Live', 'ხარისხის უზრუნველყოფა და გაშვება', 'Nov 27–30']
  ]
  const insW = db.prepare('INSERT INTO workstreams (id, code, name, ka, window, sort) VALUES (?,?,?,?,?,?)')
  W.forEach(w => insW.run(...w, w[0]))

  // [ws, title, priority, status]
  const T = [
    // WS1 — Institutional approval and ownership
    [1, 'Officially approve NVIC as an NVU initiative', 'essential', 'done'],
    [1, 'Confirm NVU as the legal organizer and responsible entity', 'essential', 'done'],
    [1, 'Confirm final competition name', 'essential', 'done'],
    [1, 'Appoint competition director and operational coordinator', 'essential', 'done'],
    [1, 'Approve four categories and participating academic units', 'essential', 'todo'],
    [1, 'Approve proposed eligibility and three competition rounds', 'essential', 'todo'],
    [1, 'Approve provisional competition calendar', 'essential', 'todo'],
    [1, 'Confirm who may authorize public announcements and use the NVU logo', 'essential', 'todo'],
    [1, 'Name university contact persons for finance, legal, academics and communications', 'essential', 'todo'],
    [1, 'Agree who owns and administers the website, applications and participant data', 'essential', 'todo'],
    // WS2 — Rules and legal documentation
    [2, 'Draft and approve the official competition regulations (დებულება)', 'essential', 'todo'],
    [2, 'Define precise participant eligibility and permitted team compositions', 'essential', 'todo'],
    [2, 'Set project eligibility, prior-work and originality rules', 'essential', 'todo'],
    [2, 'Establish AI use and disclosure policy', 'essential', 'todo'],
    [2, 'Publish evaluation criteria and scoring weights', 'essential', 'todo'],
    [2, 'Define selection thresholds, tie-breaks, appeals and disqualification', 'essential', 'todo'],
    [2, 'Establish jury independence and conflict-of-interest rules', 'essential', 'todo'],
    [2, 'Create privacy notice and data retention policy', 'essential', 'todo'],
    [2, 'Prepare parent/guardian consent and supervisor acknowledgement', 'essential', 'todo'],
    [2, 'Prepare project IP and confidentiality terms', 'essential', 'todo'],
    [2, 'Prepare separate photo/video publication permission', 'essential', 'todo'],
    [2, 'Define prohibited unsafe projects and ethical review procedures', 'essential', 'todo'],
    // WS3 — Finance and prizes
    [3, 'Set maximum approved operating budget', 'essential', 'todo'],
    [3, 'Decide if scholarships or tuition benefits will be offered', 'essential', 'todo'],
    [3, 'Approve all prizes promised at launch', 'essential', 'todo'],
    [3, 'Identify who pays for software, publicity and event expenses', 'essential', 'todo'],
    [3, 'Approve procurement and spending authority', 'essential', 'todo'],
    [3, 'Prepare a finalist travel-support policy, if offered', 'essential', 'todo'],
    [3, 'Find potential sponsors or in-kind equipment partners', 'later', 'todo'],
    [3, 'Order trophies and certificates', 'later', 'todo'],
    // WS4 — Application system and public website
    [4, 'Confirm competition domain or NVU subdomain', 'essential', 'todo'],
    [4, 'Build mobile-responsive bilingual (KA/EN) landing page', 'essential', 'todo'],
    [4, 'Publish full rules, categories, eligibility, timeline and FAQ', 'essential', 'todo'],
    [4, 'Build project registration form and secure file uploads', 'essential', 'todo'],
    [4, 'Provide supervisor/guardian consent process', 'essential', 'todo'],
    [4, 'Create automatic application confirmations', 'essential', 'todo'],
    [4, 'Create secure applicant database and role-based staff access', 'essential', 'todo'],
    [4, 'Configure clear submission deadline and timestamp handling', 'essential', 'todo'],
    [4, 'Set up official support email and request-handling workflow', 'essential', 'todo'],
    [4, 'Add privacy and consent notices to the website', 'essential', 'todo'],
    [4, 'Test accessibility, language switcher and mobile experience', 'essential', 'todo'],
    [4, 'Test duplicate, incomplete and invalid submissions', 'essential', 'todo'],
    [4, 'Set up applicant ID and submission tracking', 'essential', 'todo'],
    [4, 'Prepare evaluator interface or exportable scoring sheets', 'essential', 'todo'],
    [4, 'Prepare status notification and semifinal invitation templates', 'later', 'todo'],
    // WS5 — Academic team and judging
    [5, 'Appoint academic representatives for all four tracks', 'essential', 'todo'],
    [5, 'Confirm available jury chair or evaluation coordinator', 'essential', 'todo'],
    [5, 'Identify a minimum viable preliminary evaluator pool', 'essential', 'todo'],
    [5, 'Confirm evaluator recruitment and conflict-of-interest procedures', 'essential', 'todo'],
    [5, 'Create standardized scoring rubric', 'essential', 'todo'],
    [5, 'Create project review instructions and confidentiality agreement', 'essential', 'todo'],
    [5, 'Build shortlist of semifinal and final judges', 'essential', 'todo'],
    [5, 'Create semifinal presentation instructions', 'later', 'todo'],
    [5, 'Create finalist mentorship structure and meeting rules', 'later', 'todo'],
    [5, 'Confirm faculty and lab availability for February–March', 'later', 'todo'],
    // WS6 — Branding, schools and communications
    [6, 'Approve official competition logo and brand assets', 'essential', 'todo'],
    [6, 'Write Georgian and English public competition announcements', 'essential', 'todo'],
    [6, 'Create digital competition poster', 'essential', 'todo'],
    [6, 'Prepare concise information pack for schools', 'essential', 'todo'],
    [6, 'Compile verified school and educational organization contacts', 'essential', 'todo'],
    [6, 'Prepare principal and teacher invitation emails', 'essential', 'todo'],
    [6, 'Prepare public FAQ and participant guidance', 'essential', 'todo'],
    [6, 'Approve announcement on NVU website and social channels', 'essential', 'todo'],
    [6, 'Create planned posting calendar and outreach ownership', 'essential', 'todo'],
    [6, 'Coordinate first wave of direct school outreach', 'essential', 'todo'],
    [6, 'Prepare introductory webinar and press materials', 'essential', 'todo'],
    [6, 'Identify regional partners and educational communities', 'later', 'todo'],
    [6, 'Produce promotional video', 'later', 'todo'],
    // WS7 — Final event and participant development
    [7, 'Obtain provisional NVU venue approval for March final', 'essential', 'todo'],
    [7, 'Confirm the final date is institutionally feasible', 'essential', 'todo'],
    [7, 'Identify event capacity and basic accessibility requirements', 'essential', 'todo'],
    [7, 'Establish first-draft logistics and safety plan', 'essential', 'todo'],
    [7, 'Plan exhibition booths and demonstration spaces', 'later', 'todo'],
    [7, 'Plan judging sequence and awards ceremony', 'later', 'todo'],
    [7, 'Determine rules for technical equipment and potentially hazardous demonstrations', 'later', 'todo'],
    [7, 'Arrange finalist accommodation or transportation where approved', 'later', 'todo'],
    [7, 'Recruit mentors and schedule development sessions', 'later', 'todo'],
    // WS8 — Quality assurance and go-live
    [8, 'Complete formal final review of all public statements', 'essential', 'todo'],
    [8, 'Confirm rule and website dates match', 'essential', 'todo'],
    [8, 'Verify categories match approved institutional terminology', 'essential', 'todo'],
    [8, 'Test registration from start to finish using student and guardian scenarios', 'essential', 'todo'],
    [8, 'Test automated emails and uploaded document access', 'essential', 'todo'],
    [8, 'Check data permissions and public/private file exposure', 'essential', 'todo'],
    [8, 'Verify prizes and university commitments are accurate', 'essential', 'todo'],
    [8, 'Assign website and email support owners for launch day', 'essential', 'todo'],
    [8, 'Approve and publish final announcement', 'essential', 'todo'],
    [8, 'Open registration and send first school invitations', 'essential', 'todo'],
    [8, 'Confirm first live registration can be processed', 'essential', 'todo'],
    [8, 'Monitor launch issues and collect feedback', 'essential', 'todo']
  ]
  const insT = db.prepare('INSERT INTO tasks (ws, title, priority, status, sort, updated_at) VALUES (?,?,?,?,?,?)')
  T.forEach((t, i) => insT.run(t[0], t[1], t[2], t[3], i + 1, now))

  // Documents — Part III deliverables
  const D = [
    ['01. Competition Concept', 'Concept', 'Full approved description, mission, objectives and model', 'essential'],
    ['02. Official Regulations / დებულება', 'Legal', 'Legally and administratively authoritative participant rules', 'essential'],
    ['03. Application Form', 'Application', 'Standardized information collected from students', 'essential'],
    ['04. Evaluation Rubric', 'Judging', 'Points and instructions used by the judges', 'essential'],
    ['05. Privacy and Consent Pack', 'Legal', 'Data protection, parent/guardian and supervisor permissions', 'essential'],
    ['06. Awards Policy', 'Finance', 'Precise scholarship and prize eligibility and conditions', 'essential'],
    ['07. Budget and Responsibility Matrix', 'Finance', 'Financial limits and who does what', 'essential'],
    ['08. School Invitation Pack', 'Communications', 'Official letters, poster, short competition summary and FAQ', 'essential'],
    ['09. Jury and Mentor Pack', 'Judging', 'Invitations, guidance and conflict-of-interest declarations', 'essential'],
    ['10. Final Event Plan', 'Event', 'Venue, exhibition, judging, safety and ceremony logistics', 'later'],
    ['11. Communication Plan', 'Communications', 'Website text, emails, social posts and press announcement', 'essential'],
    ['12. Operational Runbook', 'Operations', 'Administrative procedures from registration through awards', 'essential']
  ]
  const insD = db.prepare('INSERT INTO documents (name, category, note, status, versions, created_at, updated_at) VALUES (?,?,?,?,?,?,?)')
  D.forEach(d => insD.run(d[0], d[1], d[2], 'draft', '[]', now, now))

  // Calendar — Part II
  const E = [
    ['Public announcement & registration opens', '2026-11-30', 'November 30, 2026', 'launch', 'The single fixed date. Everything essential must be live.'],
    ['Application deadline', '2027-01-15', 'January 15, 2027', 'competition', 'Applications close 23:59 Tbilisi time.'],
    ['Preliminary evaluation', '2027-01-16', 'January 16–22, 2027', 'competition', 'Remote evaluation by qualified reviewers.'],
    ['Semifinalist announcement', '2027-01-22', 'January 22, 2027', 'competition', '~24 projects advance.'],
    ['Online semifinals', '2027-01-30', 'January 30–31, 2027', 'competition', '5 min presentation + 5 min Q&A per team. ~12 advance.'],
    ['Finalist development & mentorship', '2027-02-01', 'February 1 – March 12, 2027', 'competition', 'Structured mentorship period.'],
    ['National Final & Awards Ceremony', '2027-03-20', 'March 20, 2027', 'final', 'Final exhibition + defense + awards at New Vision University, Tbilisi.']
  ]
  const insE = db.prepare('INSERT INTO events (title, date, label, phase, note) VALUES (?,?,?,?,?)')
  E.forEach(e => insE.run(...e))

  // Responsibility matrix — Part IV
  const R = [
    ['Institutional authority and official approvals', 'NVU management', ''],
    ['Competition concept, regulations and methodology', 'Nata & Anri, with NVU approval', ''],
    ['Website, registration and technical systems', 'Technical team', ''],
    ['Academic quality and disciplinary guidance', 'NVU academic representatives', ''],
    ['Jury recruitment and oversight', 'Joint academic committee', ''],
    ['School outreach', 'NVU communications + organizing team', ''],
    ['Project mentorship', 'NVU faculty and approved external experts', ''],
    ['Sponsorships, funding and procurement', 'NVU / designated partnership lead', ''],
    ['Final exhibition and awards', 'Joint organizing team', ''],
    ['Legal, privacy and scholarship approval', 'NVU authorized departments', '']
  ]
  const insR = db.prepare('INSERT INTO responsibilities (func, lead, note) VALUES (?,?,?)')
  R.forEach(r => insR.run(...r))

  // Open questions to resolve
  const Q = [
    ['What are the exact titles and decision authority of the organizing committee roles?', 'Formalize internally so tasks are never left unassigned while both sides assume the other is handling them.', 'Governance', 'open'],
    ['Which prizes and scholarship benefits can be publicly promised at launch?', 'Only approved commitments may appear in public materials. Everything else stays generic ("educational opportunities").', 'Finance & Prizes', 'open'],
    ['Own competition domain (e.g. nvic.ge) or NVU subdomain (nvu.edu.ge/nvic)?', 'Decides hosting, email, branding and data ownership. Blocks website build.', 'Website', 'open'],
    ['Will regional finalists receive travel/lodging support, and who pays?', 'Accessibility promise vs budget reality. Decide before launch messaging.', 'Finance & Prizes', 'open'],
    ['Who signs and issues the official regulations (კონკურსის დებულება)?', 'The regulations govern eligibility, evaluation, advancement, winners, appeals and rights. First document for NVU approval.', 'Legal', 'open'],
    ['What is the maximum approved operating budget for the first season?', 'Needed before any procurement, software, publicity or event commitments.', 'Finance & Prizes', 'open']
  ]
  const insQ = db.prepare('INSERT INTO questions (q, detail, asked_by, category, status, created_at) VALUES (?,?,?,?,?,?)')
  Q.forEach(q => insQ.run(q[0], q[1], 'Nata', q[2], q[3], now))

  // People
  const P = [
    ['Nata', 'Co-founder · Competition methodology & coordination', 'NVIC founding team', '', '', ''],
    ['Anri', 'Co-founder · Competition methodology & coordination', 'NVIC founding team', '', '', '']
  ]
  const insP = db.prepare('INSERT INTO people (name, role, org, email, phone, note) VALUES (?,?,?,?,?,?)')
  P.forEach(p => insP.run(...p))

  // Notes
  const N = [
    'Launch principle: do NOT delay November 30 for exhibition design, promotional video or trophy designs. What must be complete on launch day: the legal & academic foundation, accurate public information, a functioning application process, and credible commitments from the organizer.',
    'Priority order: Nov 17–20 lock rules & institutional decisions → Nov 21–26 build application infrastructure → Nov 27–30 test, approve, launch.',
    'First document for formal NVU approval: the Competition Regulations (კონკურსის დებულება). Website, school announcements and the application form must all use exactly the same approved rules.'
  ]
  const insN = db.prepare('INSERT INTO notes (body, by_, created_at) VALUES (?,?,?)')
  N.forEach(n => insN.run(n, 'Nata', now))

  db.prepare('INSERT INTO activity (actor, action, target, created_at) VALUES (?,?,?,?)').run('system', 'created', 'NVIC Command Center initialized with 89 tasks, 12 documents, calendar & roles', now)
}
