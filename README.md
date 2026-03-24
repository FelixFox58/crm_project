# MyCRM — Smart Business Platform

> Сучасна CRM система з повною інтеграцією Google Workspace

![MyCRM Screenshot](https://img.shields.io/badge/React-18-61dafb?style=flat&logo=react)
![Google API](https://img.shields.io/badge/Google_API-OAuth2-4285f4?style=flat&logo=google)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## Можливості

- **Дашборд** — метрики, угоди, контакти, активність
- **Контакти** — пошук, фільтри, статуси (гарячий/теплий/холодний)
- **Угоди** — Kanban pipeline з воронкою продажів
- **Google Workspace** — Gmail, Calendar, Drive, Contacts, Sheets, Meet
- **Темна тема** — повністю dark UI

## Технології

| Шар | Технологія |
|-----|-----------|
| Frontend | React 18, CSS Variables |
| Icons | Lucide React |
| Auth | Google OAuth 2.0 |
| Deploy | GitHub Pages |
| Fonts | DM Sans, DM Mono |

## Швидкий старт

```bash
# Клонуйте репозиторій
git clone https://github.com/YOUR_USERNAME/my-crm.git
cd my-crm

# Встановіть залежності
npm install

# Запустіть локально
npm start
```

Відкрийте [http://localhost:3000](http://localhost:3000)

## Деплой на GitHub Pages

### 1. Відредагуйте `package.json`

```json
"homepage": "https://YOUR_USERNAME.github.io/my-crm"
```

### 2. Задеплойте

```bash
npm run deploy
```

Сайт буде доступний на: `https://YOUR_USERNAME.github.io/my-crm`

## Підключення Google API

### Крок 1 — Google Cloud Console

1. Зайдіть на [console.cloud.google.com](https://console.cloud.google.com)
2. Створіть новий проєкт: **"MyCRM"**
3. Перейдіть у **APIs & Services → Library**
4. Увімкніть:
   - Gmail API
   - Google Calendar API
   - People API (Contacts)
   - Google Drive API

### Крок 2 — OAuth Credentials

1. **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
2. Application type: **Web application**
3. Authorized origins: `http://localhost:3000` та `https://YOUR_USERNAME.github.io`
4. Скопіюйте **Client ID**

### Крок 3 — Додайте в проєкт

Встановіть бібліотеку:

```bash
npm install @react-oauth/google
```

В `src/index.js`:

```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

root.render(
  <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
    <App />
  </GoogleOAuthProvider>
);
```

Кнопка входу:

```jsx
import { useGoogleLogin } from '@react-oauth/google';

const login = useGoogleLogin({
  onSuccess: (token) => console.log(token),
  scope: [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/contacts.readonly',
  ].join(' '),
});
```

## Структура проєкту

```
my-crm/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Навігація
│   │   ├── Dashboard.jsx        # Головна сторінка
│   │   ├── Contacts.jsx         # Список контактів
│   │   ├── Deals.jsx            # Kanban угод
│   │   └── GoogleIntegration.jsx # Google Workspace
│   ├── data/
│   │   └── mockData.js          # Тестові дані
│   ├── App.jsx                  # Роутинг
│   ├── index.js                 # Точка входу
│   └── index.css                # Глобальні стилі
└── package.json
```

## Наступні кроки

- [ ] Backend API (Node.js + Express)
- [ ] База даних (PostgreSQL / MongoDB)
- [ ] Реальна Gmail синхронізація
- [ ] Email-відправка з CRM
- [ ] Мобільна версія
- [ ] Мультикористувач + ролі

## Ліцензія

MIT © 2025 MyCRM
