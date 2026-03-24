import React from 'react';
import {
  LayoutDashboard, Users, Briefcase, Calendar,
  Mail, BarChart2, Settings, Zap, ChevronRight
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Дашборд',   icon: LayoutDashboard, badge: null },
  { id: 'contacts',  label: 'Контакти',  icon: Users,           badge: 142  },
  { id: 'deals',     label: 'Угоди',     icon: Briefcase,       badge: 23   },
  { id: 'calendar',  label: 'Календар',  icon: Calendar,        badge: null },
  { id: 'gmail',     label: 'Gmail',     icon: Mail,            badge: 7    },
  { id: 'reports',   label: 'Звіти',     icon: BarChart2,       badge: null },
];

const styles = {
  sidebar: {
    width: '220px',
    height: '100%',
    background: 'var(--bg-surface)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    flexShrink: 0,
  },
  logoWrap: {
    padding: '20px 20px 16px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    width: '28px',
    height: '28px',
    background: 'var(--accent)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: '15px', fontWeight: '500', color: 'var(--text-primary)', letterSpacing: '-0.3px' },
  logoSub:  { fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' },
  nav:    { flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '2px' },
  item:   (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    background: active ? 'var(--accent-dim)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--text-secondary)',
    fontWeight: active ? '500' : '400',
    fontSize: '13.5px',
    border: active ? '1px solid rgba(200,245,90,0.15)' : '1px solid transparent',
  }),
  badge: (active) => ({
    marginLeft: 'auto',
    fontSize: '11px',
    background: active ? 'var(--accent)' : 'var(--bg-hover)',
    color: active ? 'var(--accent-text)' : 'var(--text-secondary)',
    padding: '1px 7px',
    borderRadius: '20px',
    fontFamily: 'var(--font-mono)',
  }),
  googleSection: {
    padding: '12px 10px',
    borderTop: '1px solid var(--border)',
  },
  googleLabel: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    padding: '4px 10px 8px',
    fontFamily: 'var(--font-mono)',
  },
  googleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '7px 10px',
    borderRadius: 'var(--radius-md)',
    fontSize: '12.5px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  dot: (color) => ({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  }),
  footer: {
    padding: '12px 10px',
    borderTop: '1px solid var(--border)',
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'var(--accent-dim)',
    border: '1px solid rgba(200,245,90,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    color: 'var(--accent)',
    fontWeight: '500',
    flexShrink: 0,
  },
  userName:  { fontSize: '12.5px', color: 'var(--text-primary)',   fontWeight: '500', lineHeight: 1.2 },
  userEmail: { fontSize: '11px',   color: 'var(--text-muted)', lineHeight: 1.2 },
};

export default function Sidebar({ active, setActive }) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoWrap}>
        <div style={styles.logoIcon}>
          <Zap size={14} color="var(--accent-text)" />
        </div>
        <div>
          <div style={styles.logoText}>MyCRM</div>
          <div style={styles.logoSub}>Business Platform</div>
        </div>
      </div>

      <nav style={styles.nav}>
        {navItems.map(({ id, label, icon: Icon, badge }) => (
          <div key={id} style={styles.item(active === id)} onClick={() => setActive(id)}>
            <Icon size={15} />
            {label}
            {badge != null && <span style={styles.badge(active === id)}>{badge}</span>}
          </div>
        ))}
      </nav>

      <div style={styles.googleSection}>
        <div style={styles.googleLabel}>Google Workspace</div>
        <div style={styles.googleItem}>
          <span style={styles.dot('#34A853')} /> Gmail синхронізовано
        </div>
        <div style={styles.googleItem}>
          <span style={styles.dot('#4285F4')} /> Calendar підключено
        </div>
        <div style={styles.googleItem}>
          <span style={styles.dot('#FBBC05')} /> Drive активний
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.userRow}>
          <div style={styles.avatar}>ВА</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.userName}>Ваш Акаунт</div>
            <div style={styles.userEmail}>admin@mycrm.ua</div>
          </div>
          <Settings size={13} color="var(--text-muted)" />
        </div>
      </div>
    </aside>
  );
}
