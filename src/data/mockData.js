export const contacts = [
  { id: 1, name: 'Олена Ковальчук',   initials: 'ОК', company: 'TechStart UA',      role: 'CEO',            email: 'o.kovalchuk@techstart.ua',  phone: '+38 050 123 4567', status: 'hot',  tag: 'гарячий',   color: 'teal',   deals: 1, lastContact: '2025-03-22' },
  { id: 2, name: 'Ігор Мельник',       initials: 'ІМ', company: 'Innovate Group',    role: 'CTO',            email: 'i.melnyk@innovate.com',     phone: '+38 067 234 5678', status: 'warm', tag: 'теплий',    color: 'blue',   deals: 2, lastContact: '2025-03-20' },
  { id: 3, name: 'Наталя Сидоренко',  initials: 'НС', company: 'Digital Solutions', role: 'Marketing Dir',  email: 'n.sydorenko@digital.ua',    phone: '+38 073 345 6789', status: 'new',  tag: 'новий',     color: 'amber',  deals: 0, lastContact: '2025-03-24' },
  { id: 4, name: 'Андрій Бондаренко', initials: 'АБ', company: 'ProLogic Ltd',      role: 'Operations VP',  email: 'a.bondarenko@prologic.ua',  phone: '+38 063 456 7890', status: 'cold', tag: 'холодний',  color: 'purple', deals: 1, lastContact: '2025-03-10' },
  { id: 5, name: 'Марія Шевченко',    initials: 'МШ', company: 'UkrFinance Group',  role: 'CFO',            email: 'm.shevchenko@ukrfin.ua',    phone: '+38 050 567 8901', status: 'hot',  tag: 'гарячий',   color: 'teal',   deals: 3, lastContact: '2025-03-23' },
  { id: 6, name: 'Дмитро Петренко',   initials: 'ДП', company: 'AgriTech UA',       role: 'Founder',        email: 'd.petrenko@agritech.ua',    phone: '+38 067 678 9012', status: 'warm', tag: 'теплий',    color: 'blue',   deals: 1, lastContact: '2025-03-18' },
];

export const deals = [
  { id: 1, name: 'CRM Впровадження',       company: 'TechStart UA',      contact: 'Олена Ковальчук',   amount: 480000,  stage: 'negotiation', stageLabel: 'Переговори',    probability: 75, closeDate: '2025-04-15', color: 'amber' },
  { id: 2, name: 'Розробка платформи',     company: 'Innovate Group',    contact: 'Ігор Мельник',       amount: 920000,  stage: 'proposal',    stageLabel: 'Пропозиція',    probability: 55, closeDate: '2025-04-30', color: 'blue'  },
  { id: 3, name: 'SEO + Digital Marketing',company: 'Digital Solutions', contact: 'Наталя Сидоренко',  amount: 155000,  stage: 'qualification',stageLabel: 'Кваліфікація',  probability: 30, closeDate: '2025-05-20', color: 'teal'  },
  { id: 4, name: 'Логістична система',     company: 'ProLogic Ltd',      contact: 'Андрій Бондаренко', amount: 840000,  stage: 'won',         stageLabel: 'Виграно',       probability: 100,closeDate: '2025-03-01', color: 'accent'},
  { id: 5, name: 'Фінансова аналітика',    company: 'UkrFinance Group',  contact: 'Марія Шевченко',    amount: 1200000, stage: 'negotiation', stageLabel: 'Переговори',    probability: 80, closeDate: '2025-04-10', color: 'amber' },
  { id: 6, name: 'IoT Платформа',          company: 'AgriTech UA',       contact: 'Дмитро Петренко',   amount: 680000,  stage: 'proposal',    stageLabel: 'Пропозиція',    probability: 50, closeDate: '2025-05-05', color: 'blue'  },
];

export const calendarEvents = [
  { id: 1, time: '09:30', title: 'Дзвінок — TechStart UA',         subtitle: 'Google Meet · 30 хв · Олена Ковальчук',    color: 'blue',  type: 'meet'   },
  { id: 2, time: '12:00', title: 'Презентація — Innovate Group',   subtitle: 'Офіс клієнта · 1 год · Ігор Мельник',       color: 'teal',  type: 'office' },
  { id: 3, time: '15:30', title: 'Знайомство — UkrFinance Group',  subtitle: 'Google Meet · 45 хв · Марія Шевченко',      color: 'amber', type: 'meet'   },
  { id: 4, time: '17:00', title: 'Ревʼю пропозиції — AgriTech',   subtitle: 'Zoom · 30 хв · Дмитро Петренко',            color: 'blue',  type: 'zoom'   },
];

export const activities = [
  { id: 1, type: 'email',    text: 'Надіслано пропозицію',        contact: 'Олена Ковальчук',   time: '10 хв тому',    color: 'blue'  },
  { id: 2, type: 'deal',     text: 'Угода закрита ₴840K',         contact: 'Андрій Бондаренко', time: '2 год тому',    color: 'accent'},
  { id: 3, type: 'call',     text: 'Дзвінок 25 хв',              contact: 'Марія Шевченко',    time: '3 год тому',    color: 'teal'  },
  { id: 4, type: 'contact',  text: 'Новий контакт додано',        contact: 'Наталя Сидоренко',  time: '5 год тому',    color: 'amber' },
  { id: 5, type: 'meet',     text: 'Зустріч заплановано',         contact: 'Дмитро Петренко',   time: 'вчора',         color: 'blue'  },
];

export const metrics = {
  contacts:    { value: 142,       label: 'Контактів',        trend: '+8 цього місяця',  up: true  },
  deals:       { value: 23,        label: 'Активних угод',    trend: '+3 цього тижня',   up: true  },
  revenue:     { value: '₴4.27M',  label: 'Сума угод',        trend: '+12% vs минулий',  up: true  },
  meetings:    { value: 4,         label: 'Зустрічей сьогодні',trend: 'Google Calendar', up: null  },
  conversion:  { value: '34%',     label: 'Конверсія',        trend: '+4% vs минулий',   up: true  },
  avgDeal:     { value: '₴625K',   label: 'Середня угода',    trend: '+₴80K vs минулий', up: true  },
};
