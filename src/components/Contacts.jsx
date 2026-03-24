import React, { useState } from 'react';
import { Search, Plus, Mail, Phone, MoreHorizontal, Filter } from 'lucide-react';
import { contacts } from '../data/mockData';

const colorMap = {
  teal:   { bg: 'rgba(45,212,191,0.1)',   text: '#2dd4bf' },
  blue:   { bg: 'rgba(96,165,250,0.1)',   text: '#60a5fa' },
  amber:  { bg: 'rgba(251,191,36,0.1)',   text: '#fbbf24' },
  purple: { bg: 'rgba(167,139,250,0.1)',  text: '#a78bfa' },
};

const statusMap = {
  hot:  { label: 'гарячий',  bg: 'rgba(248,113,113,0.12)', text: '#f87171' },
  warm: { label: 'теплий',   bg: 'rgba(251,191,36,0.12)',  text: '#fbbf24' },
  cold: { label: 'холодний', bg: 'rgba(96,165,250,0.12)',  text: '#60a5fa' },
  new:  { label: 'новий',    bg: 'rgba(200,245,90,0.12)',  text: '#c8f55a' },
};

export default function Contacts() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = contacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '300', color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>Контакти</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>142 контакти · 23 нові цього місяця</p>
        </div>
        <div style={{ flex: 1 }} />
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          <Plus size={14} /> Додати контакт
        </button>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Пошук за іменем або компанією..."
            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '9px 12px 9px 36px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
          />
        </div>
        {['all', 'hot', 'warm', 'cold', 'new'].map(f => {
          const labels = { all: 'Всі', hot: 'Гарячі', warm: 'Теплі', cold: 'Холодні', new: 'Нові' };
          const isActive = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 14px', background: isActive ? 'var(--accent-dim)' : 'var(--bg-card)', border: `1px solid ${isActive ? 'rgba(200,245,90,0.3)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', color: isActive ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>
              {labels[f]}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 100px 40px', gap: '12px', padding: '10px 18px', borderBottom: '1px solid var(--border)' }}>
          {['Контакт', 'Email', 'Телефон', 'Статус', 'Угоди', ''].map((h, i) => (
            <div key={i} style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: 'var(--font-mono)' }}>{h}</div>
          ))}
        </div>

        {filtered.map((c, idx) => {
          const col = colorMap[c.color] || colorMap.teal;
          const st = statusMap[c.status];
          return (
            <div key={c.id} className="animate-fade" style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 100px 40px', gap: '12px', padding: '12px 18px', borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center', animationDelay: `${idx * 40}ms', cursor: 'pointer', transition: 'background 0.15s' }}>
              {/* Name + company */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: col.bg, border: `1px solid ${col.text}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '500', color: col.text, flexShrink: 0 }}>
                  {c.initials}
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--text-primary)' }}>{c.name}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{c.company} · {c.role}</div>
                </div>
              </div>
              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                <Mail size={12} color="var(--text-muted)" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</span>
              </div>
              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                <Phone size={12} color="var(--text-muted)" />
                {c.phone}
              </div>
              {/* Status */}
              <div>
                <span style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '20px', background: st.bg, color: st.text }}>{st.label}</span>
              </div>
              {/* Deals */}
              <div style={{ fontSize: '13px', color: c.deals > 0 ? 'var(--accent)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {c.deals > 0 ? `${c.deals} угод${c.deals > 1 ? 'и' : 'а'}` : '—'}
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            Контактів не знайдено
          </div>
        )}
      </div>
    </div>
  );
}
