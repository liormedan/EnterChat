# EnterChat – אפיון רשמי (טכני)

## 🎯 מטרת המערכת
לבנות מערכת צ׳אט פנים-ארגונית...
ליאור, הנה **מסמך אפיון רשמי**, כמו שהיית מגיש בחממה Enter, + **מבנה תיקיות מלא** לפרויקט Next.js על Vercel, עם **Firebase** (Auth, Firestore, Storage, Realtime).
הכול בניסוח מקצועי, בעברית, מימין לשמאל, וברמה שמספיקה להתחיל פיתוח מיידי.

---

# 📘 **אפיון רשמי – Enter Build Chat**

צ׳אט צוות דמוי Slack למיזם Enter

---

## 🎯 **מטרת המערכת**

לבנות מערכת צ׳אט פנים-ארגונית לצוות הפיתוח/בנייה של Enter, המאפשרת תקשורת בצוות בזמן אמת, חלוקת ערוצים, ספר אורחים פנימי, וניהול נתונים תחת Firebase.
המערכת תהיה מבוססת Next.js ותופץ על גבי Vercel, עם פונקציות Serverless לצורך אבטחה, התממשקות ושכבת API מאוחדת.

---

# 🧱 **יעדים עיקריים**

### 1. תקשורת בזמן אמת

* שליחת וקבלת הודעות Live בכל ערוץ.
* אפשרות לפתוח ערוצים לפי פרויקטים/נושאים.
* הצגת משתמשים פעילים.

### 2. ניהול משתמשים והרשאות

* התחברות עם Firebase Authentication (Email/Password, Google).
* תפקידים:

  * **Admin** – יצירת ערוצים, מחיקת הודעות.
  * **Member** – שימוש שוטף במערכת.

### 3. ספר אורחים (Guestbook)

* עמוד נפרד: `/guestbook`
* משתמשים יכולים להשאיר פידבק, והודעות מוצגות בציר זמן.
* הודעות נשמרות באוסף Firestore ייעודי או בערוץ guestbook.

### 4. שכבת Serverless

המערכת תכלול פונקציות מאובטחות:

* שליחת הודעה לערוץ
* יצירת ערוץ חדש
* שליחת הודעת פידבק (guestbook)
* קבלת רשימת ההודעות
  כל הפונקציות רצות בגישת **API routes** של Next.js ב־Vercel.

### 5. Firestore Database

* שמירת ערוצים, הודעות, פרופילי משתמשים.
* שימוש ב־Security Rules כדי למנוע גישה לא מורשית.
* שימוש ב־Realtime Updates.

### 6. Observability

* ניהול לוגים ב־Vercel (גישה לכל פונקציות ה־Serverless).
* איתור שגיאות, בקשות כושלות ופעילות abnormal.

---

# 📐 **ארכיטקטורה ברמת-על**

```
Next.js (Frontend + Serverless)
     |
     |--- API Routes (Serverless)
     |
Firebase
     |--- Authentication
     |--- Firestore (Channels, Messages, Profiles, Guestbook)
     |--- Storage (קבצי תמונת פרופיל / אודיו)
     |--- Realtime listeners
```

---

# 📂 **מבנה תיקיות מומלץ – Next.js + Firebase + Vercel**

הכול מותאם ל-App Router (Next.js 14/15):

```
root/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx                  # Landing page
│  ├─ app/
│  │   ├─ page.tsx              # מסך הצ’אט הראשי
│  │   ├─ [channelId]/
│  │   │    ├─ page.tsx         # דף ערוץ מסוים
│  ├─ guestbook/
│  │   ├─ page.tsx              # ספר אורחים
│  ├─ login/
│  │   ├─ page.tsx
│  ├─ admin/
│  │   ├─ page.tsx              # לוח בקרה
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
│  ├─ firebase.ts               # init Firebase client
│  ├─ firestore.ts              # פקודות DB
│  ├─ auth.ts                   # פונקציות להתחברות
│  ├─ server/                   # ספרייה ייעודית לפונקציות שרת
│  │    ├─ messages.ts          # כתיבה/קריאה של הודעות
│  │    ├─ channels.ts          # יצירת ערוצים
│
├─ app/api/
│  ├─ messages/
│  │     ├─ route.ts            # POST / GET – הודעות
│  ├─ channels/
│  │     ├─ route.ts            # יצירת ערוץ חדש
│  ├─ guestbook/
│        ├─ route.ts            # פוסט חדש לספר אורחים
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
├─ utils/
│  ├─ date.ts
│  ├─ validation.ts
│  ├─ roles.ts
│
├─ firebase.json
├─ firestore.rules
├─ package.json
```

---

# 🔥 **מבנה נתונים (Firestore) מלא**

### 1. אוסף: `profiles`

```
profiles/
  uid/
    displayName: string
    role: "admin" | "member"
    photoURL: string
    createdAt: timestamp
```

### 2. אוסף: `channels`

```
channels/
  channelId/
    name: string
    description: string
    createdAt: timestamp
    createdBy: uid
```

### 3. תת-אוסף: `channels/{channelId}/messages`

```
channels/{channelId}/messages/
  msgId/
    userId: uid
    content: string
    createdAt: timestamp
    editedAt: timestamp | null
```

### 4. אוסף: `guestbook`

```
guestbook/
  entryId/
    userId: uid
    displayName: string
    message: string
    createdAt: timestamp
```

---

# 🔐 **כללי אבטחה (Security Rules) – תמצית**

### קריאת הודעות:

```txt
allow read: if request.auth != null;
```

### כתיבת הודעה:

```txt
allow write: if request.auth != null
             && request.resource.data.userId == request.auth.uid;
```

### ערוצים:

```txt
allow read: if true;
allow write: if request.auth.token.role == 'admin';
```

### Guestbook:

```txt
allow write: if request.auth != null;
```

---

# 🚀 **המשך – מה אתה רוצה שאכין לך עכשיו?**

אני יכול לכתוב לך אחד מתוך הבאים:

### ✔️ קוד התחלתי ל־`firebase.ts`

### ✔️ מסך צ׳אט ראשוני (UI מלא + התחברות לפיירסטור)

### ✔️ API routes מוכנים

### ✔️ גרסה ראשונית של Guestbook

### ✔️ UI שלם דמוי-Slack (עם Tailwind + Shadcn)

מה אתה רוצה להתחיל לפתח קודם?
