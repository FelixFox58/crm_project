import React, { useState } from 'react';
import { CheckCircle, Circle, ExternalLink, ChevronRight, Shield, Zap } from 'lucide-react';

const services = [
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Вся переписка з клієнтами прямо в картці контакту',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#EA4335"/>
      </svg>
    ),
    connected: true,
    color: '#EA4335',
    scopes: ['gmail.readonly', 'gmail.send', 'gmail.labels'],
    features: ['Читати листи', 'Надсилати з CRM', 'Синхронізація теток'],
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    description: 'Зустрічі та нагадування синхронізовані з контактами',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill="#4285F4"/>
      </svg>
    ),
    connected: true,
    color: '#4285F4',
    scopes: ['calendar.readonly', 'calendar.events'],
    features: ['Перегляд подій', 'Створення зустрічей', 'Нагадування'],
  },
  {
    id: 'contacts',
    name: 'Google Contacts',
    description: 'Двостороння синхронізація контактів',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#34A853"/>
      </svg>
    ),
    connected: false,
    color: '#34A853',
    scopes: ['contacts.readonly', 'contacts.readwrite'],
    features: ['Імпорт контактів', 'Синхронізація змін', 'Уникнення дублікатів'],
  },
  {
    id: 'drive',
    name: 'Google Drive',
    description: 'Документи та файли клієнтів в одному місці',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M7.71 3.5L1.15 15l3.43 6 6.57-11.5L7.71 3.5zm.01 9.5H4.56l4.29-7.5 3.17 5.5-4.3 2zm7.99-9.5l-3.43 6L15.7 18H22l-6.29-14.5z" fill="#FBBC05"/>
      </svg>
    ),
    connected: true,
    color: '#FBBC05',
    scopes: ['drive.readonly', 'drive.file'],
    features: ['Перегляд файлів', 'Прикріплення до угод', 'Пошук документів'],
  },
  {
    id: 'sheets',
    name: 'Google Sheets',
    description: 'Експорт та імпорт даних у форматі таблиць',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="#34A853"/>
      </svg>
    ),
    connected: false,
    color: '#34A853',
    scopes: ['spreadsheets.readonly', 'spreadsheets'],
    features: ['Експорт контактів', 'Імпорт даних', 'Звіти в таблицях'],
  },
  {
    id: 'meet',
    name: 'Google Meet',
    description: 'Відеозустрічі прямо з картки контакту',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" fill="#4285F4"/>
      </svg>
    ),
    connected: false,
    color: '#4285F4',
    scopes: ['meet.readonly'],
    features: ['Створення кімнат', 'Посилання в Calendar', 'Запис дзвінків'],
  },
];

export default function GoogleIntegration() {
  const [expanded, setExpanded] = useState(null);
  const connectedCount = services.filter(s => s.connected).length;

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: '300', color: 'var(--text-primary)', letterSpacing: '-0.4px', marginBottom: '4px' }}>
          Google Workspace
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {connectedCount} з {services.length} сервісів підключено
        </p>
      </div>

      {/* OAuth explanation */}
      <div style={{ background: 'rgba(66,133,244,0.08)', border: '1px solid rgba(66,133,244,0.2)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <Shield size={18} color="#60a5fa" style={{ flexShrink: 0, marginTop: '1px' }} />
        <div>
          <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>Безпечна авторизація через OAuth 2.0</div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            MyCRM використовує офіційний Google OAuth 2.0. Ваші паролі ніколи не передаються. Ви авторизуєтесь через Google і самі контролюєте доступи.
          </div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
            <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#60a5fa', background: 'rgba(96,165,250,0.1)', padding: '4px 10px', borderRadius: 'var(--radius-sm)' }}>
              <ExternalLink size={11} /> Google Cloud Console
            </a>
            <a href="https://developers.google.com/identity/protocols/oauth2" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#60a5fa', background: 'rgba(96,165,250,0.1)', padding: '4px 10px', borderRadius: 'var(--radius-sm)' }}>
              <ExternalLink size={11} /> Документація OAuth
            </a>
          </div>
        </div>
      </div>

      {/* Services grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {services.map(s => (
          <div key={s.id} className="animate-fade" style={{ background: 'var(--bg-card)', border: `1px solid ${s.connected ? 'rgba(200,245,90,0.2)' : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {/* Card header */}
            <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '2px' }}>{s.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.description}</div>
              </div>
              {s.connected
                ? <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--accent)', background: 'var(--accent-dim)', padding: '4px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                    <CheckCircle size={12} /> підключено
                  </div>
                : <button style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#60a5fa', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', padding: '4px 10px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>
                    <Zap size={11} /> Підключити
                  </button>
              }
            </div>

            {/* Expandable features */}
            <div
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              style={{ padding: '8px 18px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-muted)' }}>
              <ChevronRight size={12} style={{ transform: expanded === s.id ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              Деталі доступу
            </div>
            {expanded === s.id && (
              <div style={{ padding: '10px 18px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>Scopes (дозволи)</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {s.scopes.map(sc => (
                    <span key={sc} style={{ fontSize: '11px', background: 'var(--bg-hover)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)' }}>{sc}</span>
                  ))}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>Функції</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {s.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={12} color={s.connected ? 'var(--accent)' : 'var(--text-muted)'} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Code snippet */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>Приклад: підключення Google OAuth 2.0</span>
          <span style={{ marginLeft: 'auto', fontSize: '11px', background: 'var(--bg-hover)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '20px', fontFamily: 'var(--font-mono)' }}>JavaScript</span>
        </div>
        <pre style={{ padding: '16px 18px', fontSize: '12px', color: '#c8f55a', fontFamily: 'var(--font-mono)', overflowX: 'auto', lineHeight: 1.7, background: 'transparent' }}>{`// 1. Встановіть залежності:
// npm install @react-oauth/google

// 2. Ініціалізація в App.jsx:
import { GoogleOAuthProvider } from '@react-oauth/google';

<GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
  <App />
</GoogleOAuthProvider>

// 3. Кнопка входу:
import { useGoogleLogin } from '@react-oauth/google';

const login = useGoogleLogin({
  onSuccess: (tokenResponse) => {
    // Зберігаємо access_token
    localStorage.setItem('google_token', tokenResponse.access_token);
    fetchGmailMessages(tokenResponse.access_token);
  },
  scope: 'https://www.googleapis.com/auth/gmail.readonly ' +
         'https://www.googleapis.com/auth/calendar.readonly',
});

// 4. Запит до Gmail API:
const fetchGmailMessages = async (token) => {
  const res = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages',
    { headers: { Authorization: \`Bearer \${token}\` } }
  );
  const data = await res.json();
  return data.messages;
};`}</pre>
      </div>
    </div>
  );
}
