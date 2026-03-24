import React from 'react';
import { TrendingUp, TrendingDown, Minus, Mail, Phone, Video, Calendar, UserPlus, DollarSign } from 'lucide-react';
import { metrics, contacts, deals, calendarEvents, activities } from '../data/mockData';

const colorMap = {
  teal:   { bg: 'rgba(45,212,191,0.1)',   text: '#2dd4bf' },
  blue:   { bg: 'rgba(96,165,250,0.1)',   text: '#60a5fa' },
  amber:  { bg: 'rgba(251,191,36,0.1)',   text: '#fbbf24' },
  purple: { bg: 'rgba(167,139,250,0.1)',  text: '#a78bfa' },
  accent: { bg: 'rgba(200,245,90,0.1)',   text: '#c8f55a' },
  red:    { bg: 'rgba(248,113,113,0.1)',  text: '#f87171' },
};

const stageMap = {
  negotiation:   { label: 'Переговори',   color: 'amber'  },
  proposal:      { label: 'Пропозиція',   color: 'blue'   },
  qualification: { label: 'Кваліфікація', color: 'teal'   },
  won:           { label: 'Виграно',      color: 'accent' },
  lost:          { label: 'Програно',     color: 'red'    },
};

const activityIcons = {
  email:   Mail,
  deal:    DollarSign,
  call:    Phone,
  contact: UserPlus,
  meet:    Video,
};

function MetricCard({ data, delay = 0 }) {
  return (
    <div className="animate-fade" style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '18px 20px',
      animationDelay: `${delay}ms`,
    }}>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.7px', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>
        {data.label}
      </div>
      <div style={{ fontSize: '26px', fontWeight: '300', color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: '6px' }}>
        {data.value}
      </div>
      <div style={{ fontSize: '12px', color: data.up === true ? 'var(--accent)' : data.up === false ? 'var(--red)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
        {data.up === true && <TrendingUp size={11} />}
        {data.up === false && <TrendingDown size={11} />}
        {data.up === null && <Minus size={11} />}
        {data.trend}
      </div>
    </div>
  );
}

function ContactRow({ c }) {
  const col = colorMap[c.color] || colorMap.teal;
  const statusColors = { hot: colorMap.red, warm: colorMap.amber, cold: colorMap.blue, new: colorMap.accent };
  const sc = statusColors[c.status] || colorMap.teal;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: col.bg, border: `1px solid ${col.text}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '500', color: col.text, flexShrink: 0 }}>
        {c.initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{c.company}</div>
      </div>
      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: sc.bg, color: sc.text, whiteSpace: 'nowrap' }}>
        {c.tag}
      </span>
    </div>
  );
}

function DealRow({ d }) {
  const stage = stageMap[d.stage] || stageMap.proposal;
  const col = colorMap[stage.color] || colorMap.blue;
  const pct = d.probability;
  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--text-primary)' }}>{d.name}</div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{d.company}</div>
        </div>
        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: col.bg, color: col.text, whiteSpace: 'nowrap' }}>
          {stage.label}
        </span>
        <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', minWidth: '70px', textAlign: 'right' }}>
          ₴{(d.amount / 1000).toFixed(0)}K
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ flex: 1, height: '3px', background: 'var(--bg-hover)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: col.text, borderRadius: '2px', transition: 'width 1s ease' }} />
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', minWidth: '30px' }}>{pct}%</span>
      </div>
    </div>
  );
}

function CalEvent({ e }) {
  const col = colorMap[e.color] || colorMap.blue;
  return (
    <div style={{ display: 'flex', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', minWidth: '40px', paddingTop: '1px' }}>{e.time}</span>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.text, marginTop: '5px', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{e.title}</div>
        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{e.subtitle}</div>
      </div>
    </div>
  );
}

function ActivityItem({ a }) {
  const Icon = activityIcons[a.type] || Mail;
  const col = colorMap[a.color] || colorMap.blue;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-sm)', background: col.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={13} color={col.text} />
      </div>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{a.text}</span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}> · {a.contact}</span>
      </div>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{a.time}</span>
    </div>
  );
}

function Panel({ title, badge, action, children, span }) {
  return (
    <div className="animate-fade" style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      gridColumn: span ? `span ${span}` : undefined,
    }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--text-primary)', flex: 1 }}>{title}</span>
        {badge && <span style={{ fontSize: '11px', background: 'var(--bg-hover)', color: 'var(--text-muted)', padding: '1px 7px', borderRadius: '20px', fontFamily: 'var(--font-mono)' }}>{badge}</span>}
        {action && <span style={{ fontSize: '12px', color: 'var(--accent)', cursor: 'pointer' }}>{action}</span>}
      </div>
      <div style={{ padding: '0 18px' }}>{children}</div>
    </div>
  );
}

export default function Dashboard() {
  const metricList = Object.values(metrics);
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div className="animate-fade">
        <h1 style={{ fontSize: '22px', fontWeight: '300', color: 'var(--text-primary)', letterSpacing: '-0.4px', marginBottom: '4px' }}>
          Дашборд
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Вівторок, 24 березня 2025 · все актуально</p>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {metricList.slice(0, 6).map((m, i) => <MetricCard key={i} data={m} delay={i * 60} />)}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Panel title="Останні контакти" badge={`${contacts.length} з 142`} action="Всі →">
          {contacts.slice(0, 5).map(c => <ContactRow key={c.id} c={c} />)}
        </Panel>

        <Panel title="Активні угоди" badge="23 угоди" action="Всі →">
          {deals.slice(0, 5).map(d => <DealRow key={d.id} d={d} />)}
        </Panel>

        {/* Google Calendar — full width */}
        <div className="animate-fade" style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          gridColumn: 'span 2',
        }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--text-primary)', flex: 1 }}>Google Calendar — сьогодні</span>
            <span style={{ fontSize: '11px', background: 'rgba(66,133,244,0.15)', color: '#60a5fa', padding: '2px 8px', borderRadius: '20px' }}>підключено</span>
            <span style={{ fontSize: '12px', color: 'var(--accent)', cursor: 'pointer' }}>Відкрити →</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', padding: '0 18px' }}>
            <div style={{ borderRight: '1px solid var(--border)', paddingRight: '18px' }}>
              {calendarEvents.slice(0, 2).map(e => <CalEvent key={e.id} e={e} />)}
            </div>
            <div style={{ paddingLeft: '18px' }}>
              {calendarEvents.slice(2).map(e => <CalEvent key={e.id} e={e} />)}
            </div>
          </div>
        </div>

        {/* Activity feed */}
        <Panel title="Остання активність" action="Всі →" span={2}>
          {activities.map(a => <ActivityItem key={a.id} a={a} />)}
        </Panel>
      </div>
    </div>
  );
}
