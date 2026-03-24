import React from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import { deals } from '../data/mockData';

const stages = [
  { id: 'qualification', label: 'Кваліфікація', color: 'teal'   },
  { id: 'proposal',      label: 'Пропозиція',   color: 'blue'   },
  { id: 'negotiation',   label: 'Переговори',   color: 'amber'  },
  { id: 'won',           label: 'Виграно',      color: 'accent' },
];

const colorMap = {
  teal:   { bg: 'rgba(45,212,191,0.08)',  border: 'rgba(45,212,191,0.2)',  text: '#2dd4bf',  header: 'rgba(45,212,191,0.15)'  },
  blue:   { bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)',  text: '#60a5fa',  header: 'rgba(96,165,250,0.15)'  },
  amber:  { bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.2)',  text: '#fbbf24',  header: 'rgba(251,191,36,0.15)'  },
  accent: { bg: 'rgba(200,245,90,0.08)',  border: 'rgba(200,245,90,0.2)',  text: '#c8f55a',  header: 'rgba(200,245,90,0.15)'  },
};

function DealCard({ d }) {
  const col = colorMap[d.color] || colorMap.blue;
  return (
    <div style={{ background: 'var(--bg-card)', border: `1px solid ${col.border}`, borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: '8px', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.borderColor = col.text; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = col.border; }}>
      <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>{d.name}</div>
      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '10px' }}>{d.company}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '15px', fontWeight: '400', color: col.text, fontFamily: 'var(--font-mono)' }}>
          ₴{(d.amount / 1000).toFixed(0)}K
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{d.probability}%</span>
      </div>
      <div style={{ marginTop: '8px', height: '2px', background: 'var(--bg-hover)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${d.probability}%`, height: '100%', background: col.text, transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

export default function Deals() {
  const totalValue = deals.reduce((s, d) => s + d.amount, 0);
  const wonValue   = deals.filter(d => d.stage === 'won').reduce((s, d) => s + d.amount, 0);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '300', color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>Угоди</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Загальна сума: <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>₴{(totalValue/1000000).toFixed(2)}M</span>
            &nbsp;·&nbsp;Закрито: <span style={{ color: '#2dd4bf', fontFamily: 'var(--font-mono)' }}>₴{(wonValue/1000).toFixed(0)}K</span>
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          <Plus size={14} /> Нова угода
        </button>
      </div>

      {/* Kanban */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', flex: 1, overflow: 'hidden' }}>
        {stages.map(stage => {
          const col = colorMap[stage.color];
          const stageDeals = deals.filter(d => d.stage === stage.id);
          const stageTotal = stageDeals.reduce((s, d) => s + d.amount, 0);
          return (
            <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {/* Column header */}
              <div style={{ padding: '12px 14px', background: col.header, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: col.text, flex: 1 }}>{stage.label}</span>
                <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.2)', color: col.text, padding: '1px 7px', borderRadius: '20px', fontFamily: 'var(--font-mono)' }}>{stageDeals.length}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '6px 14px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }}>
                ₴{(stageTotal/1000).toFixed(0)}K
              </div>
              {/* Cards */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px 10px' }}>
                {stageDeals.map(d => <DealCard key={d.id} d={d} />)}
                <button style={{ width: '100%', padding: '8px', background: 'none', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'var(--font-sans)' }}>
                  <Plus size={12} /> Додати
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
