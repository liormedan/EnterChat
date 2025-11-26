# AGENT.md
## 🧠 EnterChat – AI Agent Contract & Project Source of Truth

This document defines the complete ruleset, constraints, architecture, and operational boundaries for any AI agent contributing code to the EnterChat project.

### 📘 1. Project Overview

EnterChat הוא פרויקט תקשורת צוותית (Slack-like) עבור צוותי Enter.
המערכת מאפשרת:

*   צ׳אט בזמן אמת בין ערוצים
*   העלאת קבצים
*   ספר אורחים (Guestbook)
*   ניהול משתמשים והרשאות
*   ממשק דמוי-Slack

המערכת נבנית ב־Next.js, Firebase ו־Vercel.

### 🧱 2. Tech Stack (MANDATORY)

**Frontend**

*   Next.js 14/15 (App Router)
*   React 18+
*   TypeScript חובה
*   TailwindCSS + Shadcn/UI

**Backend / BaaS**

*   Supabase
    *   Authentication
    *   PostgreSQL (DB)
    *   Storage (File uploads)
    *   Realtime (Subscriptions)

**Deployment**

*   Vercel
*   Serverless Functions
*   Logging & Observability

**Important**

🔴 The agent must never replace Supabase or Vercel with any other service.

### 📂 3. Project Folder Structure (STRICT CONTRACT)

כל סוכן AI חייב ליצור / לערוך קבצים אך ורק בתוך התיקיות הבאות:

```
root/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ app/
│  │   ├─ page.tsx
│  │   ├─ [channelId]/page.tsx
│  ├─ login/page.tsx
│  ├─ guestbook/page.tsx
│  ├─ admin/page.tsx
│
├─ components/
│  ├─ ChatSidebar.tsx
│  ├─ ChatRoom.tsx
│  ├─ MessageInput.tsx
│  ├─ MessageBubble.tsx
│  ├─ GuestbookForm.tsx
│  ├─ GuestbookList.tsx
│
├─ lib/
│  ├─ supabase.ts
│  ├─ auth.ts
│  ├─ database.ts
│  ├─ server/
│  │    ├─ messages.ts
│  │    ├─ channels.ts
│
├─ app/api/
│  ├─ messages/route.ts
│  ├─ channels/route.ts
│  ├─ guestbook/route.ts
│
├─ styles/
│  ├─ globals.css
│  ├─ theme.css
│
├─ types/
│  ├─ message.d.ts
│  ├─ channel.d.ts
│  ├─ user.d.ts
│
└─ utils/
    ├─ date.ts
    ├─ validation.ts
    ├─ roles.ts
```

🔵 אסור להוסיף תיקיות חדשות ללא אישור מפורש.
🔵 אסור למקם קבצים מחוץ למבנה הזה.

### 🗄️ 4. Supabase Data Model (PostgreSQL Schema)

**Table: profiles**
```sql
create table profiles (
  id uuid references auth.users not null primary key,
  display_name text,
  role text check (role in ('admin', 'member')),
  photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

**Table: channels**
```sql
create table channels (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

**Table: messages**
```sql
create table messages (
  id uuid default uuid_generate_v4() primary key,
  channel_id uuid references channels(id) not null,
  user_id uuid references profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  edited_at timestamp with time zone
);
```

**Table: guestbook**
```sql
create table guestbook (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 🔐 5. Row Level Security (RLS) Contract

The agent must assume the following enforced rules:

**General**

*   Enable RLS on all tables.
*   Authenticated users can read all tables (unless specific restrictions apply).

**Messages**
*   Insert: Authenticated users can insert their own messages.
*   Select: Authenticated users can read messages.

**Channels**
*   Insert: Only Admins can create channels.
*   Select: Authenticated users can read channels.

**Guestbook**
*   Insert: Authenticated users can sign the guestbook.
*   Select: Public/Authenticated read access.

### ⚙️ 6. API ROUTES Contract (Strict Input/Output)

**POST /api/messages**
Input:
```json
{
  "channelId": "string",
  "content": "string"
}
```

Output:
```json
{
  "id": "string",
  "channelId": "string",
  "content": "string",
  "createdAt": "timestamp",
  "userId": "string"
}
```

**POST /api/channels**
Input:
```json
{
  "name": "string",
  "description": "string"
}
```

**POST /api/guestbook**
Input:
```json
{
  "message": "string"
}
```

### 🧩 7. UI/UX Standards (STRICT)

Components must follow:

*   Functional React components
*   TypeScript strict mode
*   TailwindCSS for styling
*   Shadcn UI for complex components
*   RTL support where needed

UI sections required:

*   Sidebar כמו Slack
*   Message list
*   Input bar
*   Channel browser

### 🧼 8. Coding Guidelines

**Mandatory**

*   No `any`
*   Use TypeScript interfaces
*   Export only default components
*   Use React hooks only inside components
*   Avoid business logic in components → logic goes to `/lib`

**Styling**

*   Tailwind utility-first
*   No inline styles (except dynamic cases)
*   Use Shadcn components when possible

### 🛑 9. Agent Restrictions (Allowed / Forbidden)

✔️ **Allowed**

*   ליצור קבצים בתוך התיקיות המותרות בלבד
*   לכתוב קומפוננטים חדשים לפי הקונבנציות
*   לשנות קבצי API בהתאם לחוזה
*   לכתוב פונקציות Supabase לפי הסכמה

❌ **Forbidden**

*   לשנות `.env`
*   ליצור שירותים חדשים (MongoDB, Firebase וכו')
*   למחוק קבצים קיימים ללא הוראה
*   להמציא שמות חדשים לטבלאות או שדות
*   לשנות את מבנה הפרויקט
*   להשתמש ב־CSS קלאסי במקום Tailwind

### 🧪 10. Testing Protocol (Optional)

If tests are written:

*   Framework: Jest + React Testing Library
*   Scope: component-level + utils
*   No e2e tests required at this stage

### 🧭 11. Agent Goal Summary

The agent’s purpose is:

“To generate safe, correct, stylistically consistent code for the EnterChat system, following Supabase + Next.js conventions and adhering strictly to this AGENT.md contract.”

✔️ End of AGENT.md

This file overrides any previous assumptions.
All AI agents must treat this file as the single source of truth.
