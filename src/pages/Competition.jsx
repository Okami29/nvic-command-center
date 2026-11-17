import React, { useState } from 'react'
import { Icon, PageHead } from '../ui.jsx'
import { useLang, useT } from '../i18n.jsx'

const D = {
"overview": [
[
"New Vision Innovation Challenge (NVIC) არის ინოვაციებისა და კვლევის ეროვნული კონკურსი, რომელსაც ნიუ ვიჟენ უნივერსიტეტი აწყობს. კონკურსი საქართველოს მასშტაბით გამოავლენს, წაახალისებს და მხარს უჭერს ნიჭიერ მოსწავლეებს, აძლევს მათ შესაძლებლობას, ორიგინალური იდეები ღირებულ პროექტებად, კვლევით ინიციატივებად, ტექნოლოგიურ გადაწყვეტილებებად და პრაქტიკულ ინოვაციებად აქციონ.",
"The New Vision Innovation Challenge (NVIC) is a national innovation and research competition organized by New Vision University. It identifies, encourages and supports talented school students across Georgia, giving them the opportunity to transform original ideas into meaningful projects, research initiatives, technological solutions and practical innovations."
],
[
"იმ კონკურსებისგან განსხვავებით, რომლებიც მხოლოდ მეცნიერებაზე, ტექნოლოგიასა და ინჟინერიაზეა ორიენტირებული, NVIC ინოვაციას უფრო ფართო, ინტერდისციპლინური გაგებით განიხილავს. მოსწავლეებს მოუწოდებენ, გამოიკვლიონ ჯანდაცვის, ტექნოლოგიების, განათლების, სამართლის, ბიზნესის, მდგრადი განვითარების, კომუნიკაციებისა და თანამედროვე საზოგადოების სხვა სფეროებში არსებული გამოწვევები.",
"Unlike competitions focused exclusively on science, technology and engineering, NVIC embraces a broader, interdisciplinary understanding of innovation. Students are encouraged to explore challenges in healthcare, technology, education, law, business, sustainability, communications and other areas of contemporary society."
],
[
"კონკურსი ერთმანეთთან აკავშირებს საშუალო განათლებასა და საუნივერსიტეტო დონის აკადემიურ გამოცდილებას, მონაწილეებისთვის გამოცდილი მკვლევრების, პედაგოგების, ინდუსტრიის პროფესიონალებისა და მენტორების მხარდაჭერის ხელმისაწვდომობით. მონაწილეები გადიან შერჩევის სტრუქტურირებულ პროცესს, რომელიც სრულდება ეროვნული ფინალური გამოფენითა და დაჯილდოების ცერემონიით New Vision University-ში.",
"The competition connects secondary education with university-level academic expertise by providing access to experienced researchers, educators, industry professionals and mentors. Participants progress through a structured selection process culminating in a national final exhibition and awards ceremony at New Vision University."
]
],
"vision": [
"ხედვა — შეიქმნას ეროვნულ დონეზე აღიარებული პლატფორმა, სადაც ახალგაზრდები შეძლებენ ინოვაციური იდეების განვითარებას, კვლევისა და პრობლემების გადაჭრის უნარების გაძლიერებას და უმაღლესი განათლების, სამეცნიერო კვლევისა და პროფესიული შესაძლებლობების საფუძვლიანად გაცნობას, რითაც ნიჭიერ მოსწავლეებსა და New Vision University-ს შორის მყარი კავშირი ჩამოყალიბდება.",
"To establish a nationally recognized platform where young people can develop innovative ideas, strengthen their research and problem-solving abilities, and gain meaningful exposure to higher education, scientific research and professional opportunities, creating a lasting connection between talented school students and New Vision University."
],
"mission": [
"მისიაა, შთააგონოს და შესაძლებლობები მისცეს სკოლის მოსწავლეებს, გამოავლინონ მნიშვნელოვანი გამოწვევები, შეიმუშაონ ორიგინალური გადაწყვეტილებები და თავიანთი იდეები კვლევის, ექსპერიმენტების, შემოქმედებითობისა და დისციპლინათაშორისი თანამშრომლობის გზით წარმოაჩინონ. ინოვაცია წარმოჩენილია როგორც ყველასთვის ხელმისაწვდომი საქმიანობა, რომელიც სცდება მეცნიერების, ტექნოლოგიების, ინჟინერიისა და მათემატიკის (STEM) ტრადიციულ სფეროებს.",
"To inspire and empower school students to identify important challenges, develop original solutions, and communicate their ideas through research, experimentation, creativity and interdisciplinary collaboration. Innovation is promoted as an accessible activity that extends beyond traditional STEM fields."
],
"eligibility": [
[
"საქართველოს საჯარო ან კერძო სკოლების VII–XII კლასებში ჩარიცხული მოსწავლეები.",
"Grades VII–XII students enrolled in public or private schools in Georgia."
],
[
"ცალკეული მონაწილეები ან 1–6 მოსწავლისგან შემდგარი გუნდები; თითოეულ პროექტში მაქსიმუმ ექვსი მოსწავლე.",
"Individual participants or teams of 1–6 students; maximum six students per project."
],
[
"სხვადასხვა სკოლის მოსწავლეებს შეუძლიათ ერთი გუნდის შექმნა.",
"Students from different schools may form one team."
],
[
"თითოეულ პროექტს უნდა ჰყავდეს სრულწლოვანი ხელმძღვანელი, მაგალითად, მასწავლებელი ან სხვა დამტკიცებული პასუხისმგებელი სრულწლოვანი პირი.",
"Each project must have an adult supervisor, such as a teacher or another approved responsible adult."
],
[
"მონაწილეობა უფასოა; კონკურსებში მონაწილეობის წინა გამოცდილება აუცილებელი არ არის.",
"Participation is free; previous competition experience is not required."
],
[
"ადრე წარმოდგენილი პროექტები შეიძლება მიღებულ იქნეს, თუ განმცხადებლები მიუთითებენ თავიანთ ადრინდელ ნამუშევარზე და წარმოაჩენენ მნიშვნელოვან ახალ განვითარებას.",
"Previously presented projects may be accepted if applicants disclose their earlier work and demonstrate meaningful new development."
],
[
"პროექტები უნდა ასახავდეს მოსწავლეების საკუთარ ინტელექტუალურ წვლილს; ხელმძღვანელებს შეუძლიათ მათი მიმართულების მიცემა, მაგრამ პროექტი მათ ნაცვლად არ უნდა შეასრულონ.",
"Projects must represent the students' own intellectual contributions; supervisors may guide but must not complete the project."
],
[
"ხელოვნური ინტელექტის, ონლაინრესურსებისა და გარე ინსტრუმენტების გამოყენება ნებადართულია შესაბამისი გამჟღავნების შემთხვევაში; მოქმედებს აკადემიური კეთილსინდისიერების, ეთიკისა და ინტელექტუალური საკუთრების წესები.",
"AI, online resources and external tools are permitted when appropriately disclosed; academic integrity, ethics and IP rules apply."
]
],
"categories": [
{
"n": [
"ჯანდაცვა და სიცოცხლის შემსწავლელი მეცნიერებები",
"Health & Life Sciences"
],
"d": [
"ინოვაციები და კვლევები, რომლებიც მიზნად ისახავს ადამიანის ჯანმრთელობის გაუმჯობესებას, სამედიცინო ცოდნის გაღრმავებას, პაციენტებზე ზრუნვისა და ცხოვრების ხარისხის ამაღლებას.",
"Innovations and research intended to improve human health, medical knowledge, patient care and quality of life."
],
"f": [
[
"მედიცინა და ჯანდაცვა",
"სტომატოლოგია და პირის ღრუს ჯანმრთელობა",
"ბიოტექნოლოგია",
"სამედიცინო ტექნოლოგიები",
"საზოგადოებრივი ჯანმრთელობა",
"რეაბილიტაცია და ხელმისაწვდომობა",
"ჯანმრთელობის განათლება",
"დამხმარე მოწყობილობები და სისტემები"
],
[
"Medicine and healthcare",
"Dentistry and oral health",
"Biotechnology",
"Medical technologies",
"Public health",
"Rehabilitation and accessibility",
"Health education",
"Assistive devices and systems"
]
],
"e": [
[
"ჯანმრთელობის მონიტორინგის დაბალბიუჯეტიანი მოწყობილობები",
"ჯანდაცვის ციფრული აპლიკაციები",
"შეზღუდული შესაძლებლობის მქონე პირთა დამხმარე ტექნოლოგიები",
"სამედიცინო სიმულაციის ან სწავლების ინსტრუმენტები",
"ინოვაციები სტომატოლოგიური ჯანმრთელობის განათლებაში",
"საზოგადოებრივი ჯანმრთელობის შესახებ ცნობიერების ამაღლებისა და პრევენციის პროექტები"
],
[
"Low-cost health monitoring devices",
"Digital healthcare applications",
"Assistive technologies for people with disabilities",
"Medical simulation or training tools",
"Innovations in dental health education",
"Public health awareness and prevention projects"
]
]
},
{
"n": [
"ტექნოლოგიები და გამოყენებითი ინოვაციები",
"Technology & Applied Innovation"
],
"d": [
"ტექნოლოგიური და საინჟინრო გადაწყვეტილებები პრაქტიკული, სამრეწველო, სამეცნიერო თუ გარემოსდაცვითი გამოწვევების გადასაჭრელად.",
"Technological and engineering solutions addressing practical, industrial, scientific or environmental challenges."
],
"f": [
[
"ხელოვნური ინტელექტი და მანქანური სწავლება",
"პროგრამული უზრუნველყოფის ინჟინერია",
"რობოტიკა და ავტომატიზაცია",
"ელექტრონიკა და ნივთების ინტერნეტი",
"ადიტიური წარმოება და 3D ბეჭდვა",
"გამოყენებითი ინჟინერია",
"მასალათმცოდნეობა",
"გარემოსდაცვითი ტექნოლოგიები",
"ენერგეტიკა და მდგრადობა"
],
[
"Artificial intelligence and machine learning",
"Software engineering",
"Robotics and automation",
"Electronics and Internet of Things",
"Additive manufacturing and 3D printing",
"Applied engineering",
"Materials science",
"Environmental technologies",
"Energy and sustainability"
]
],
"e": [
[
"ხელოვნურ ინტელექტზე დაფუძნებული აპლიკაციები",
"რობოტული სისტემები და ჭკვიანი მოწყობილობები",
"მდგრადი წარმოების გადაწყვეტილებები",
"გარემოს მონიტორინგის სისტემები",
"გადამუშავებისა და წრიული ეკონომიკის ტექნოლოგიები",
"ინოვაციური საინჟინრო პროტოტიპები"
],
[
"AI-powered applications",
"Robotic systems and smart devices",
"Sustainable manufacturing solutions",
"Environmental monitoring systems",
"Recycling and circular-economy technologies",
"Innovative engineering prototypes"
]
]
},
{
"n": [
"საზოგადოება, სამართალი და განათლება",
"Society, Law & Education"
],
"d": [
"ინოვაციური მიდგომები სოციალური, საგანმანათლებლო, სამართლებრივი, სამოქალაქო და ინსტიტუციური გამოწვევებისადმი.",
"Innovative approaches to social, educational, legal, civic and institutional challenges."
],
"f": [
[
"სამართალი და მართლმსაჯულებაზე ხელმისაწვდომობა",
"ადამიანის უფლებები",
"განათლება და სწავლის ტექნოლოგიები",
"პოლიტიკა და საერთაშორისო ურთიერთობები",
"დიპლომატია",
"სოციალური ინოვაცია",
"საჯარო პოლიტიკა",
"სამოქალაქო მონაწილეობა",
"ინკლუზია და ხელმისაწვდომობა"
],
[
"Law and access to justice",
"Human rights",
"Education and learning technologies",
"Politics and international relations",
"Diplomacy",
"Social innovation",
"Public policy",
"Civic participation",
"Inclusion and accessibility"
]
],
"e": [
[
"ხელმისაწვდომი სასწავლო პლატფორმები",
"საგანმანათლებლო მეთოდები და საკლასო ინოვაციები",
"ციფრული ხელსაწყოები, რომლებიც სამართლებრივ ინფორმაციაზე წვდომას აუმჯობესებს",
"სოციალური უთანასწორობის დაძლევაზე მიმართული გადაწყვეტილებები",
"სამოქალაქო ჩართულობის პლატფორმები",
"კვლევაზე დაფუძნებული საჯარო პოლიტიკის წინადადებები"
],
[
"Accessible learning platforms",
"Educational methods and classroom innovations",
"Digital tools improving access to legal information",
"Solutions addressing social inequality",
"Civic engagement platforms",
"Research-based public policy proposals"
]
]
},
{
"n": [
"ბიზნესი, მედია და შემოქმედებითი ინოვაციები",
"Business, Media & Creative Innovation"
],
"d": [
"ინოვაციური მეწარმეობა, კომუნიკაცია, ბიზნესმოდელები, შემოქმედებითი გადაწყვეტილებები და პროექტები, რომლებიც ტექნოლოგიას კულტურულ ან კომერციულ განვითარებას აკავშირებს.",
"Innovative entrepreneurship, communication, business models, creative solutions, and projects connecting technology with cultural or commercial development."
],
"f": [
[
"ბიზნესი და მეწარმეობა",
"სტარტაპები და ინოვაციები",
"ეკონომიკა და მენეჯმენტი",
"ციფრული მედია და კომუნიკაცია",
"შემოქმედებითი ინდუსტრიები",
"მარკეტინგი და საზოგადოებასთან ურთიერთობა",
"ხელოვნება და კულტურული მემკვიდრეობა",
"სოციალური მეწარმეობა"
],
[
"Business and entrepreneurship",
"Startup innovation",
"Economics and management",
"Digital media and communication",
"Creative industries",
"Marketing and public engagement",
"Arts and cultural heritage",
"Social enterprise"
]
],
"e": [
[
"ინოვაციური სტარტაპების კონცეფციები",
"ციფრული მედიის პლატფორმები",
"ახალი საგანმანათლებლო ან კომერციული სერვისები",
"შემოქმედებითი ტექნოლოგიები",
"კულტურული მემკვიდრეობის შენარჩუნების გზები",
"მდგრადი ბიზნესმოდელები",
"მედიაწიგნიერების ინიციატივები"
],
[
"Innovative startup concepts",
"Digital media platforms",
"New educational or commercial services",
"Creative technologies",
"Cultural heritage preservation solutions",
"Sustainable business models",
"Media literacy initiatives"
]
]
}
],
"inter": [
"ინტერდისციპლინური პროექტები: თითოეული განმცხადებელი შეფასებისთვის ირჩევს ერთ ძირითად კატეგორიას და შეუძლია დამატებითი სფეროების მითითებაც. საჭიროების შემთხვევაში, საორგანიზაციო კომიტეტს შეუძლია გამჭვირვალე პროცედურების დაცვით რეკომენდაცია გაუწიოს პროექტის სხვა კატეგორიაში გადატანას.",
"Interdisciplinary projects: each applicant selects one primary category for evaluation and may identify secondary fields. The organizing committee may recommend reassignment to another category when necessary, subject to transparent procedures."
],
"rounds": [
{
"t": [
"რაუნდი 1 — განაცხადების მიღება და წინასწარი შერჩევა",
"Round 1 — Open Application & Preliminary Selection"
],
"d": [
"მოსწავლეები რეგისტრირდებიან ოფიციალურ ვებგვერდზე და წარადგენენ პროექტის აღწერას: რა პრობლემას ეხება პროექტი, რატომ არის ეს პრობლემა მნიშვნელოვანი, რა არის შემოთავაზებული გადაწყვეტა, რით გამოირჩევა იდეა ორიგინალურობით, როგორ შეიძლება პროექტის განვითარება ან გამოცდა, რა რესურსებია საჭირო და რა სამუშაოა უკვე შესრულებული. შესაძლებელია დამატებითი სურათების, ესკიზების, კვლევის მასალების, პრეზენტაციების ან სადემონსტრაციო ვიდეოების დართვა. დასრულებული პროტოტიპი სავალდებულო არ არის. განაცხადებს დისტანციურად აფასებენ კვალიფიციური შემფასებლები გამოქვეყნებული შეფასების კრიტერიუმების მიხედვით. ნახევარფინალში დაახლოებით 24 პროექტი გადადის.",
"Students register on the official website and submit a project description: the problem addressed, why it matters, the proposed solution, what makes the idea original, how the project could be developed or tested, resources required, and work already completed. Supplementary images, sketches, research materials, presentations or demonstration videos may be attached. A completed prototype is not required. Applications are evaluated remotely by qualified reviewers using published assessment criteria. About 24 projects advance to the semifinals."
],
"badge": "~24"
},
{
"t": [
"მეორე ტური — ეროვნული ნახევარფინალები",
"Round 2 — National Semifinals"
],
"d": [
"შერჩეული გუნდები თავიანთ პროექტებს ონლაინ წარუდგენენ შემფასებელთა პანელს: 5 წუთი პრეზენტაციისთვის და 5 წუთი კითხვა-პასუხისთვის. მონაწილეები აჩვენებენ, რომ ესმით თავიანთი პროექტის მიზანი, მეთოდოლოგია, ორიგინალურობა და განხორციელებადობა. მათ შეუძლიათ წარმოადგინონ პროექტის დამადასტურებელი კვლევა, ესკიზები, ადრეული პროტოტიპები, სიმულაციები ან წინასწარი შედეგები. ფინალში დაახლოებით 12 პროექტი გადადის.",
"Selected teams present online before an evaluation panel: 5 minutes of presentation plus 5 minutes of questions and answers. Participants demonstrate understanding of their project's purpose, methodology, originality and feasibility. Supporting research, sketches, early prototypes, simulations or preliminary results may be presented. About 12 projects advance to the final."
],
"badge": "~12"
},
{
"t": [
"მენტორობა და განვითარება",
"Mentorship & Development"
],
"d": [
"ნახევარფინალის შემდეგ ფინალისტები განვითარების სტრუქტურირებულ ეტაპზე გადადიან. რესურსების შესაძლებლობის ფარგლებში, ნიუ ვიჟენ უნივერსიტეტი და პარტნიორები უზრუნველყოფენ კვლევის მეთოდოლოგიასთან დაკავშირებულ მითითებებს, სამეცნიერო და ტექნიკურ კონსულტაციებს, პროტოტიპის შემუშავების შესახებ რჩევებს, ბიზნესისა და ბაზრის თვალსაზრისით ვალიდაციას, პრეზენტაციის მომზადებაში მხარდაჭერას, ეთიკური და მარეგულირებელი საკითხების განხილვას და უნივერსიტეტის შესაბამის რესურსებზე წვდომას. ფინალისტები საკუთარ პროექტებს თავად ავითარებენ; საბოლოო შეფასებისას მათ უნდა გაამჟღავნონ მიღებული დახმარების მოცულობა.",
"After the semifinals, finalists enter a structured development period. Where resources permit, New Vision University and partners provide research methodology guidance, scientific and technical consultation, prototype development advice, business and market validation, presentation support, ethical and regulatory considerations, and access to appropriate university resources. Finalists develop their own projects; the level of assistance received must be disclosed during final evaluation."
],
"badge": ""
},
{
"t": [
"რაუნდი 3 — ეროვნული ფინალური გამოფენა",
"Round 3 — National Final Exhibition"
],
"d": [
"ფინალი თბილისში, ნიუ ვიჟენ უნივერსიტეტში გაიმართება. ფინალისტები საჯარო გამოფენასა და პროექტების ოფიციალურ დაცვაზე წარადგენენ დასრულებულ ან მნიშვნელოვნად განვითარებულ პროექტებს — ფიზიკურ პროტოტიპებს, მოქმედ პროგრამულ უზრუნველყოფას, კვლევის მიგნებებს, ექსპერიმენტების შედეგებს, საგანმანათლებლო საპილოტე პროექტებს, ვალიდირებულ ბიზნესმოდელებს, კვლევაზე დაფუძნებულ სამართლებრივ ან საჯარო პოლიტიკის წინადადებებს, შემოქმედებით და მედია ინოვაციებს. დამოუკიდებელი ჟიური გამოავლენს საერთო გამარჯვებულსა და კატეგორიების გამარჯვებულებს, ხოლო ღონისძიება დაჯილდოების ცერემონიით დასრულდება.",
"The final takes place at New Vision University in Tbilisi. Finalists present completed or substantially developed projects — physical prototypes, functional software, research findings, experimental results, educational pilots, validated business models, research-based legal or policy proposals, creative and media innovations — in a public exhibition and formal project defense. An independent jury selects the overall winner and category winners, and the event concludes with an awards ceremony."
],
"badge": "★"
}
],
"criteria": [
[
[
"ორიგინალურობა და ინოვაციურობა",
"იდეის სიახლე და შემოთავაზებული მიდგომის შემოქმედებითობა."
],
[
"Originality and innovation",
"the novelty of the idea and the creativity of the proposed approach."
]
],
[
[
"პრობლემის მნიშვნელობა და გავლენა",
"განსახილველი პრობლემის აქტუალურობა და მნიშვნელობა."
],
[
"Problem significance and impact",
"the relevance and importance of the problem being addressed."
]
],
[
[
"მეთოდოლოგია და განხორციელებადობა",
"შემოთავაზებული მიდგომის ხარისხი და მისი რეალისტურად განხორციელების პოტენციალი."
],
[
"Methodology and feasibility",
"the quality of the proposed approach and its realistic implementation potential."
]
],
[
[
"კვლევისა და განვითარების ხარისხი",
"მტკიცებულებები, ტესტირება, ექსპერიმენტები, ვალიდაცია და თვალსაჩინო პროგრესი."
],
[
"Research and development quality",
"evidence, testing, experimentation, validation and demonstrable progress."
]
],
[
[
"პრეზენტაცია და დაცვა",
"პროექტის ახსნის, გადაწყვეტილებების დასაბუთებისა და კითხვებზე პასუხის გაცემის უნარი."
],
[
"Presentation and defense",
"the ability to explain the project, justify decisions and respond to questions."
]
]
],
"critn": [
"პროექტები 100-ქულიანი შკალით ფასდება; შეფასების კომპონენტების წონები შესაძლოა შეიცვალოს წინასწარ ეტაპზე, ნახევარფინალსა და ფინალში. შეფასებისას გათვალისწინებულია მოსწავლის განათლების დონე, დისციპლინა და რესურსებზე გონივრული ხელმისაწვდომობა — პროექტებს ქულები არ აკლდებათ ძვირადღირებული აღჭურვილობის არქონის გამო, როდესაც კვლევის ან შედეგების დადასტურების სხვა ფორმაა შესაფერისი.",
"Projects are evaluated on a 100-point scale; scoring weights may be adjusted between preliminary stage, semifinals and final. Assessment accounts for the student's educational level, discipline and reasonable access to resources — projects are not penalized for lacking expensive equipment when another form of research or validation is appropriate."
],
"awards": [
[
[
"მთავარი პრიზი",
"New Vision-ის ინოვაციების ჩემპიონი, გადაეცემა ყველა კატეგორიაში წარმოდგენილ საუკეთესო პროექტს."
],
[
"Grand Prize",
"New Vision Innovation Champion, awarded to the strongest overall project across all categories."
]
],
[
[
"კატეგორიების ჯილდოები",
"თითო გამარჯვებული პროექტი კონკურსის ოთხივე კატეგორიაში."
],
[
"Category Awards",
"one winning project in each of the four competition categories."
]
],
[
[
"სპეციალური აღიარება",
"ჯილდოები შეიძლება გადაეცეს სოციალური ზემოქმედების, რეგიონული ინოვაციების, სამეცნიერო კვლევებში მიღწეული ბრწყინვალე შედეგებისა და აუდიტორიის ჩართულობის სფეროებში განსაკუთრებული მიღწევებისთვის."
],
[
"Special Recognition",
"distinctions may recognize exceptional achievements in social impact, regional innovation, research excellence and audience engagement."
]
]
],
"awn": [
"ჯილდოები შეიძლება მოიცავდეს სერტიფიკატებს, თასებს, აკადემიურ მენტორობას, საგანმანათლებლო შესაძლებლობებს, პროტოტიპის შემუშავებაში დახმარებას, სპონსორების მიერ დაფინანსებულ პრიზებსა და საუნივერსიტეტო სტიპენდიის მიღების შესაძლებლობებს. ჯილდოების საბოლოო სტრუქტურა და ნებისმიერი ფინანსური ვალდებულება საჯაროდ გამოცხადებამდე უნდა დაამტკიცოს ნიუ ვიჟენ უნივერსიტეტმა. კონკურსში წარმატება არ იძლევა უნივერსიტეტში ჩარიცხვის გარანტიას; სტიპენდიები გაიცემა უნივერსიტეტში ჩარიცხვის წესების შესაბამისად.",
"Awards may include certificates, trophies, academic mentorship, educational opportunities, prototype development assistance, sponsor-supported prizes and university scholarship opportunities. The final award structure and any financial commitments must be approved by New Vision University before public announcement. Competition success does not guarantee admission; scholarships comply with the university's admissions policies."
],
"ethics": [
"აკადემიური კეთილსინდისიერება, ეთიკა და საკუთრების უფლებები — მონაწილეები წარადგენენ საკუთარ ნამუშევრებს და მიუთითებენ გარე პირების წვლილზე. პროცედურები მოიცავს პლაგიატს, ხელოვნური ინტელექტის მიერ გენერირებული შინაარსის გამჟღავნებას, ინტელექტუალურ საკუთრებას (მოსწავლეები ინარჩუნებენ საკუთრების უფლებას თავიანთ ორიგინალურ ნამუშევრებზე), ადამიანების მონაწილეობით ჩატარებულ კვლევას, ჯანმრთელობისა და ლაბორატორიულ უსაფრთხოებას, გამოუქვეყნებელი იდეების კონფიდენციალურობას, პერსონალური მონაცემების დაცვას და არასრულწლოვნებისთვის მშობლის თანხმობას. საჯარო გაშუქებისთვის თანხმობა ცალკე მოიპოვება, სადაც ამას კანონი მოითხოვს.",
"Academic integrity, ethics & ownership — participants present authentic work and acknowledge external contributions. Procedures cover plagiarism, disclosure of AI-generated content, intellectual property (students retain ownership of their original work), research involving human participants, health and laboratory safety, confidentiality of unpublished ideas, personal data protection, and parental consent for minors. Publicity consent is obtained separately where legally required."
],
"access": [
"ხელმისაწვდომობა და მონაწილეობა ქვეყნის მასშტაბით — განაცხადები წარდგენილია ონლაინ; წინასწარი შეფასება და ნახევარფინალური პრეზენტაციები დისტანციურად ტარდება; კონკურსის შესახებ ინფორმაცია ხელმისაწვდომია ციფრულ ფორმატში; მონაწილეებს მხარს უჭერს ონლაინ საინფორმაციო შეხვედრები; ხელმისაწვდომი რესურსების მიხედვით, შესაძლოა განხილულ იქნეს რეგიონების ფინალისტებისთვის ფინანსური ან ლოგისტიკური მხარდაჭერა. კონკურსი ხელს უწყობს თანაბარ შესაძლებლობებსა და ინკლუზიურ მონაწილეობას.",
"Accessibility & national participation — applications are submitted online; preliminary evaluation and semifinal presentations are conducted remotely; competition information is available digitally; online information sessions support participants; financial or logistical support for regional finalists may be considered depending on available resources. The competition promotes equal opportunity and inclusive participation."
]
}

const SECTIONS = [
  ['overview', 'მიმოხილვა', 'Overview', 'eye'],
  ['vision', 'ხედვა და მიზანი', 'Vision & Mission', 'spark'],
  ['eligibility', 'მონაწილეობა', 'Eligibility', 'users'],
  ['categories', 'კატეგორიები', 'Categories', 'grid'],
  ['structure', 'სტრუქტურა', 'Structure', 'rocket'],
  ['evaluation', 'შეფასება', 'Evaluation', 'check'],
  ['awards', 'ჯილდოები', 'Awards', 'trophy'],
  ['ethics', 'ეთიკა და წესები', 'Ethics & Rules', 'shield'],
]

export default function Competition() {
  const t = useT()
  const { lang } = useLang()
  const i = lang === 'ka' ? 0 : 1
  const [sec, setSec] = useState('overview')
  const go = (id) => {
    setSec(id)
    document.getElementById('cmp-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const H = ({ id, icon, ka, en }) => (
    <div id={'cmp-' + id} className="flex items-center gap-3 mb-5 scroll-mt-40">
      <span className="w-9 h-9 rounded-xl bg-cy/10 border border-cy/25 text-cy flex items-center justify-center"><Icon n={icon} s={17} /></span>
      <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight">{lang === 'ka' ? ka : en}</h2>
    </div>
  )
  return (
    <div>
      <PageHead title={t('კონკურსი — სრული აღწერა', 'The Competition — Full Description')}
        ka={lang === 'ka' ? null : 'კონკურსის სრული აღწერა'}
        desc={t('კატეგორიები, მონაწილეობის პირობები, რაუნდები, შეფასების კრიტერიუმები და ჯილდოები — ერთ ადგილას. ეს ტექსტი არის საფუძველი ოფიციალური დებულების, ვებგვერდისა და სკოლებისთვის საინფორმაციო პაკეტის.', 'Categories, eligibility, rounds, evaluation criteria and awards — all in one place. This text is the foundation for the official regulations, the website and the school information pack.')}
      />

      <div className="flex flex-wrap gap-1.5 mb-8 sticky top-0 z-20 py-3 -mt-1 bg-paper/95 backdrop-blur rounded-xl">
        {SECTIONS.map(([id, ka, en, ic]) => (
          <button key={id} onClick={() => go(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${sec === id ? 'bg-cy text-white border-cy' : 'bg-ink-800 text-mut border-line hover:text-fg'}`}>
            <Icon n={ic} s={13} />{lang === 'ka' ? ka : en}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {/* overview */}
        <section>
          <H id="overview" icon="eye" ka="მიმოხილვა" en="Overview" />
          <div className="card glow-cy p-6 sm:p-8 space-y-4 rise">
            <img src="nvu-logo.svg" alt="New Vision University" className="h-9 w-auto opacity-90" />
            {D.overview.map(([ka, en], k) => <p key={k} className="text-mut leading-relaxed text-sm sm:text-base">{lang === 'ka' ? ka : en}</p>)}
            <div className="flex flex-wrap gap-2 pt-1">
              {[[t('სეზონი', 'Season'), '2026–2027'], [t('გახსნა', 'Launch'), 'Nov 30, 2026'], [t('ფინალი', 'Final'), 'Mar 20, 2027'], [t('კატეგორიები', 'Categories'), '4'], [t('რაუნდები', 'Rounds'), '3']].map(([l, v]) => (
                <span key={l} className="px-3 py-1.5 rounded-full bg-ink-950 border border-line text-xs"><b className="text-cy font-bold">{v}</b> <span className="text-dim">{l}</span></span>
              ))}
            </div>
          </div>
        </section>

        {/* vision & mission */}
        <section>
          <H id="vision" icon="spark" ka="ხედვა და მიზანი" en="Vision & Mission" />
          <div className="grid md:grid-cols-2 gap-4">
            {[['ხედვა', 'Vision', D.vision], ['მიზანი', 'Mission', D.mission]].map(([ka, en, v]) => (
              <div key={en} className="card p-6 rise">
                <div className="text-[11px] uppercase tracking-[0.2em] text-cy font-semibold mb-2">{lang === 'ka' ? ka : en}</div>
                <p className="text-mut leading-relaxed text-sm">{lang === 'ka' ? v[0] : v[1]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* eligibility */}
        <section>
          <H id="eligibility" icon="users" ka="მონაწილეობა და დასაშვებობა" en="Participation & Eligibility" />
          <div className="card p-6 rise">
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3">
              {D.eligibility.map(([ka, en], k) => (
                <li key={k} className="flex gap-2.5 text-sm text-mut leading-relaxed">
                  <span className="text-ok mt-0.5 shrink-0"><Icon n="check" s={15} /></span>{lang === 'ka' ? ka : en}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* categories */}
        <section>
          <H id="categories" icon="grid" ka="ოთხი საკონკურსო კატეგორია" en="Four Competition Categories" />
          <div className="grid lg:grid-cols-2 gap-4">
            {D.categories.map((c, k) => (
              <div key={k} className="card card-hover p-6 rise relative overflow-hidden">
                <div className="absolute -top-6 -right-2 font-display font-bold text-[110px] leading-none text-cy/5 select-none pointer-events-none">{k + 1}</div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-cy to-cy-deep text-white flex items-center justify-center font-display font-bold">{k + 1}</span>
                  <h3 className="font-display font-bold tracking-tight text-lg leading-snug">{c.n[i]}</h3>
                </div>
                <p className="text-sm text-mut leading-relaxed mb-4">{c.d[i]}</p>
                <div className="text-[11px] uppercase tracking-[0.16em] text-dim font-semibold mb-1.5">{t('მიმართულებები', 'Relevant fields')}</div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {c.f[i].map((f, j) => <span key={j} className="px-2.5 py-1 rounded-full bg-ink-950 border border-line text-[11px] text-mut">{f}</span>)}
                </div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-dim font-semibold mb-1.5">{t('მაგალითი პროექტები', 'Example projects')}</div>
                <ul className="space-y-1">
                  {c.e[i].map((e, j) => (
                    <li key={j} className="flex gap-2 text-xs text-mut leading-relaxed"><span className="text-vio shrink-0">◆</span>{e}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="card !bg-vio/5 !border-vio/25 p-4 mt-4 text-sm text-mut leading-relaxed rise flex gap-3">
            <span className="text-vio shrink-0 mt-0.5"><Icon n="bolt" s={16} /></span>{D.inter[i]}
          </p>
        </section>

        {/* structure */}
        <section>
          <H id="structure" icon="rocket" ka="კონკურსის სტრუქტურა — სამი რაუნდი" en="Competition Structure — Three Rounds" />
          <div className="relative">
            <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-cy/50 via-vio/30 to-ok/50" />
            <div className="space-y-4">
              {D.rounds.map((r, k) => (
                <div key={k} className="relative pl-14 rise">
                  <span className={`absolute left-0 top-4 w-10 h-10 rounded-2xl border flex items-center justify-center font-display font-bold text-[11px] tabular-nums ${k === 3 ? 'bg-ok/10 border-ok/40 text-ok' : k === 2 ? 'bg-vio/10 border-vio/40 text-vio' : 'bg-cy/15 border-cy/40 text-cy'}`}>
                    {r.badge || <Icon n="users" s={15} />}
                  </span>
                  <div className="card card-hover p-5">
                    <h3 className="font-display font-bold tracking-tight mb-1.5">{r.t[i]}</h3>
                    <p className="text-sm text-mut leading-relaxed">{r.d[i]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* evaluation */}
        <section>
          <H id="evaluation" icon="check" ka="შეფასების კრიტერიუმები" en="Evaluation Criteria" />
          <div className="card overflow-hidden rise">
            {D.criteria.map(([ka, en], k) => (
              <div key={k} className="flex gap-4 px-5 sm:px-6 py-4 border-b border-line last:border-0">
                <span className="w-8 h-8 rounded-full bg-cy/10 border border-cy/25 text-cy flex items-center justify-center font-display font-bold text-sm shrink-0">{k + 1}</span>
                <div>
                  <div className="font-semibold text-sm">{(lang === 'ka' ? ka : en)[0]}</div>
                  <p className="text-xs text-mut mt-0.5 leading-relaxed">{(lang === 'ka' ? ka : en)[1]}</p>
                </div>
              </div>
            ))}
            <p className="px-5 sm:px-6 py-4 text-xs text-dim leading-relaxed bg-ink-950/60">{D.critn[i]}</p>
          </div>
        </section>

        {/* awards */}
        <section>
          <H id="awards" icon="trophy" ka="ჯილდოები და აღიარება" en="Awards & Recognition" />
          <div className="grid md:grid-cols-3 gap-4">
            {D.awards.map(([ka, en], k) => (
              <div key={k} className={`card p-6 rise ${k === 0 ? '!border-amb/40 !bg-amb/5 md:scale-[1.02]' : ''}`}>
                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${k === 0 ? 'bg-amb/15 text-amb' : k === 1 ? 'bg-cy/10 text-cy' : 'bg-vio/10 text-vio'}`}>
                  <Icon n={k === 0 ? 'trophy' : k === 1 ? 'flag' : 'spark'} s={18} />
                </span>
                <div className="font-display font-bold tracking-tight">{(lang === 'ka' ? ka : en)[0]}</div>
                {(lang === 'ka' ? ka : en)[1] && <p className="text-xs text-mut mt-1.5 leading-relaxed">{(lang === 'ka' ? ka : en)[1]}</p>}
              </div>
            ))}
          </div>
          <p className="card p-4 mt-4 text-xs text-dim leading-relaxed rise flex gap-3"><span className="text-warn shrink-0"><Icon n="flag" s={15} /></span>{D.awn[i]}</p>
        </section>

        {/* ethics */}
        <section className="pb-4">
          <H id="ethics" icon="shield" ka="ეთიკა, კეთილსინდისიერება და საკუთრება" en="Ethics, Integrity & Ownership" />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-6 rise">
              <p className="text-sm text-mut leading-relaxed">{D.ethics[i]}</p>
            </div>
            <div className="card p-6 rise">
              <div className="flex items-center gap-2 mb-2 text-cy font-semibold text-sm"><Icon n="globe" s={16} />{t('ხელმისაწვდომობა და ეროვნული მასშტაბი', 'Accessibility & National Reach')}</div>
              <p className="text-sm text-mut leading-relaxed">{D.access[i]}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
