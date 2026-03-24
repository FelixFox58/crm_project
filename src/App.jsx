import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Deals from './components/Deals';
import GoogleIntegration from './components/GoogleIntegration';

const topbarTitles = {
  dashboard: 'Дашборд',
  contacts:  'Контакти',
  deals:     'Угоди',
  calendar:  'Календар',
  gmail:     'Google Workspace',
  reports:   'Звіти',
};

function Placeholder({ title }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--text-muted)' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>✦</div>
      <div style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>{title}</div>
      <div style={{ fontSize: '13px' }}>Розділ в розробці</div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState('dashboard');

  const renderPage = () => {
    switch (active) {
      case 'dashboard': return <Dashboard />;
      case 'contacts':  return <Contacts />;
      case 'deals':     return <Deals />;
      case 'gmail':     return <GoogleIntegration />;
      default:          return <Placeholder title={topbarTitles[active]} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>
      <Sidebar active={active} setActive={setActive} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{ height: '56px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '12px', flexShrink: 0, background: 'var(--bg-surface)' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>MyCRM</span>
          <span style={{ color: 'var(--border-md)', fontSize: '16px' }}>›</span>
          <span style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: '500' }}>{topbarTitles[active]}</span>
          <div style={{ flex: 1 }} />
          {/* Google status pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#60a5fa', background: 'rgba(66,133,244,0.1)', border: '1px solid rgba(66,133,244,0.2)', padding: '4px 12px', borderRadius: '20px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google підключено
          </div>
          {/* Date */}
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
