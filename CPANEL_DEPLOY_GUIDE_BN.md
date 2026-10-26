# 🏛️ University of Barishal — CampusFix
## 🎬 cPanel ফুল-স্ট্যাক ডিপ্লয়মেন্ট: সম্পূর্ণ ভিডিও টিউটোরিয়াল লেকচার গাইড ও মাস্টার নোট

> **🎙️ ইনস্ট্রাক্টর নোট:**  
> এই গাইডটি বিশেষভাবে তৈরি করা হয়েছে আপনার **ভিডিও টিউটোরিয়াল বা লেকচার** উপস্থাপনার সুবিধার জন্য। যে কোনো সাধারণ ছাত্র বা ডেভেলপার যেন স্ক্র্যাচ থেকে বুঝতে পারে—ডোমেন ও DNS কীভাবে পয়েন্ট করতে হয়, কোড কেন বিল্ড করতে হয়, `app.js` কেন লাগে, কোন ফাইলগুলো জিপ করতে হয় আর কোনগুলো করা যাবে না, এবং cPanel-এর ভেতরের মেকানিজম কীভাবে কাজ করে। প্রতিটি পয়েন্টে **"কেন করছি"**, **"ম্যানুয়াল পদ্ধতি"**, **"অটোমেশন ট্রিক"**, এবং **"শিক্ষার্থীরা যেখানে ভুল করবে"** স্পষ্ট করে উল্লেখ করা হয়েছে।

---

## 🧭 লেকচার আউটলাইন (ভিডিওর টাইমস্ট্যাম্প প্ল্যান)

1. [পার্ট ১: আর্কিটেকচার ওভারভিউ — কেন ফ্রন্টএন্ড ও ব্যাকএন্ড আলাদা?](#পার্ট-১-আর্কিটেকচার-ওভারভিউ)
2. [পার্ট ২: ডোমেন, সাবডোমেন সেটআপ ও DNS পয়েন্টিং (A-Record, Cloudflare & SSL)](#পার্ট-২-ডোমেন-সাবডোমেন-সেটআপ-ও-dns-পয়েন্টিং)
3. [পার্ট ৩: লোকাল ডাটাবেজ এক্সপোর্ট ও phpMyAdmin-এ ইমপোর্ট](#পার্ট-৩-লোকাল-ডাটাবেজ-এক্সপোর্ট-ও-phpmyadmin-এ-ইমপোর্ট)
4. [পার্ট ৪: NestJS ব্যাকএন্ড প্রস্তুতি — `app.js`-এর রহস্য ও জিপ তৈরি](#পার্ট-৪-nestjs-ব্যাকএন্ড-প্রস্তুতি--appjs-এর-রহস্য-ও-জিপ-তৈরি)
5. [পার্ট ৫: cPanel-এ Node.js App কনফিগারেশন ও লাইভ রান](#পার্ট-৫-cpanel-এ-nodejs-app-কনফিগারেশন-ও-লাইভ-রান)
6. [পার্ট ৬: Astro ফ্রন্টএন্ড বিল্ড, `.htaccess` ও `public_html`-এ ডিপ্লয়](#পার্ট-৬-astro-ফ্রন্টএন্ড-বিল্ড-htaccess-ও-public_html-এ-ডিপ্লয়)
7. [পার্ট ৭: ক্রস-সাবডোমেন কুকি ও CORS সমাধান (যেখানে ৯০% মানুষ আটকে যায়)](#পার্ট-৭-ক্রস-সাবডোমেন-কুকি-ও-cors-সমাধান)
8. [পার্ট ৮: লাইভ ভেরিফিকেশন, টেস্ট ক্রেডেনশিয়াল ও লাইভ ডেমো](#পার্ট-৮-লাইভ-ভেরিফিকেশন-টেস্ট-ক্রেডেনশিয়াল-ও-লাইভ-ডেমো)
9. [পার্ট ৯: ট্রাবলশুটিং — কোনো সমস্যা হলে কীভাবে ডিবাগ করবেন](#পার্ট-৯-ট্রাবলশুটিং--কোনো-সমস্যা-হলে-কীভাবে-ডিবাগ-করবেন)

---

## পার্ট ১: আর্কিটেকচার ওভারভিউ

### 🎙️ ভিডিওতে যা বলবেন:
> *"বন্ধুগণ, আজকের টিউটোরিয়ালে আমরা একটি আধুনিক ফুল-স্ট্যাক অ্যাপ্লিকেশন (Astro Frontend + NestJS Backend + MySQL Database) সম্পূর্ণ cPanel Shared Hosting-এ লাইভ করব। প্রফেশনাল সিস্টেমে আমরা ফ্রন্টএন্ড ও ব্যাকএন্ডকে আলাদা রাখি পারফরম্যান্স ও সিকিউরিটির জন্য।"*

- **মূল ডোমেন (`mahfuj-sends-greetings.xyz`):**  
  এখানে চলবে **Astro ফ্রন্টএন্ড**। এটি Apache/LiteSpeed দিয়ে আল্ট্রাফাস্ট স্ট্যাটিক ফাইল ও HTML হিসেবে লোড হবে।
- **সাবডোমেন (`api.mahfuj-sends-greetings.xyz`):**  
  এখানে চলবে **NestJS ব্যাকএন্ড API**। cPanel-এর **Phusion Passenger** ইঞ্জিন ব্যাকগ্রাউন্ডে Node.js প্রসেস হিসেবে এটি চালু রাখবে।
- **ডাটাবেজ:**  
  cPanel-এর নিজস্ব **MySQL Database Engine** (যা `localhost:3306`-এ রান করে)।

---

## পার্ট ২: ডোমেন, সাবডোমেন সেটআপ ও DNS পয়েন্টিং

> **🎙️ ইনস্ট্রাক্টর টিপ:**  
> শিক্ষার্থীরা ডোমেন কিনে কিভাবে cPanel-এর সাথে যুক্ত করতে হয় এবং সাবডোমেনের জন্য DNS কীভাবে সেট করতে হয় তা নিয়ে সবচেয়ে বেশি কনফিউশনে থাকে। এই অংশটি স্ক্রিনে স্টেপ-বাই-স্টেপ দেখাবেন।

### ১. cPanel-এর Shared IP খুঁজে বের করা
1. cPanel ড্যাশবোর্ডে লগইন করুন।
2. ডানপাশের সাইডবারে **General Information** সেকশন লক্ষ্য করুন।
3. সেখানে **Shared IP Address** দেওয়া থাকে (যেমন: `192.0.2.1` বা আপনার হোস্টিং সার্ভারের আইপি)। এটি নোট করুন।

---

### ২. DNS রেকর্ড কনফিগারেশন (Cloudflare / Namecheap / GoDaddy)

আপনার ডোমেন যেখানে ম্যানেজ করা হচ্ছে (যেমন Cloudflare বা ডোমেন প্রোভাইডারের DNS Manager), সেখানে গিয়ে নিচের রেকর্ডগুলো যোগ করুন:

| Type | Name / Host | Target / Value | TTL | প্রক্সি স্ট্যাটাস (Cloudflare হলে) | ব্যাখ্যা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (বা রুট ডোমেন) | `আপনার cPanel Shared IP` | Auto | Proxied (Orange) অথবা DNS Only | মূল ফ্রন্টএন্ড ডোমেন পয়েন্ট করার জন্য |
| **A** | `api` | `আপনার cPanel Shared IP` | Auto | DNS Only (Grey Cloud) সুপারিশকৃত* | সাবডোমেন ব্যাকএন্ড এপিআই পয়েন্ট করার জন্য |
| **CNAME** | `www` | `mahfuj-sends-greetings.xyz` | Auto | Proxied / DNS Only | `www` প্রিফিক্স দিয়ে ভিজিট করার জন্য |

> [!IMPORTANT]
> **Cloudflare ব্যবহারকারীদের জন্য টিপ:**  
> সাবডোমেন `api`-এর জন্য শুরুতে Cloudflare-এ **Proxy off (Grey Cloud / DNS Only)** রাখা ভালো, যাতে cPanel-এর নিজস্ব **AutoSSL** ভ্যালিডেশন সহজে সার্টিফিকেট ইস্যু করতে পারে। আর যদি Cloudflare Proxy চালু রাখেন, তবে Cloudflare SSL সেটিংসে গিয়ে **SSL/TLS Encryption Mode** অবশ্যই **Full** বা **Full (strict)** সিলেক্ট করতে হবে, নয়তো "Redirect Loop (Too Many Redirects)" এরর আসবে।

---

### ৩. cPanel-এ সাবডোমেন তৈরি করা (`api.mahfuj-sends-greetings.xyz`)
1. cPanel ➔ **Domains** ➔ **Create A New Domain**-এ যান।
2. **Domain** ঘরে লিখুন: `api.mahfuj-sends-greetings.xyz`
3. ⚠️ **সবচেয়ে গুরুত্বপূর্ণ পয়েন্ট (ভিডিওতে হাইলাইট করবেন):**  
   **"Share document root"** অপশনটির টিকচিহ্ন **অবশ্যই তুলে দিন (Uncheck করুন)**।
   - কেন তুলে দেবেন? টিক দেওয়া থাকলে ব্যাকএন্ড ফাইলগুলো `public_html`-এ গিয়ে ফ্রন্টএন্ড ফাইলের সাথে জগাখিচুড়ি পাকিয়ে যাবে!
   - টিক তুলে দিলে cPanel এর জন্য সম্পূর্ণ আলাদা একটি ফোল্ডার (যেমন `api.mahfuj-sends-greetings.xyz`) তৈরি করবে।
4. **Submit** বাটনে ক্লিক করুন।

---

### ৪. ফ্রি SSL সক্রিয়করণ (HTTPS)
1. cPanel ➔ **Security** ➔ **SSL/TLS Status**-এ যান।
2. আপনার ডোমেন ও সাবডোমেনের নামের পাশে টিক দিন।
3. উপরে থাকা **Run AutoSSL** বাটনে ক্লিক করুন।
4. ১-২ মিনিটের মধ্যে ডোমেনের পাশে সবুজ রঙের প্যাডলক (Lock) আইকন চলে আসবে, যা নির্দেশ করে আপনার ফ্রি cPanel/Let's Encrypt SSL সক্রিয় হয়ে গেছে।

---

## পার্ট ৩: লোকাল ডাটাবেজ এক্সপোর্ট ও phpMyAdmin-এ ইমপোর্ট

### 💡 কেন করছি?
আপনার কম্পিউটারের লোকালহোস্টে যে টেবিল, ইউজার অ্যাকাউন্ট, এবং অভিযোগগুলো তৈরি হয়েছে, সেগুলোকে লাইভ সার্ভারে নিতে হবে।

### 🛠️ যে কোনো সাধারণ প্রজেক্টে ম্যানুয়াল পদ্ধতি (শিক্ষার্থীদের শেখাবেন):
1. **লোকাল ডাটা এক্সপোর্ট:**
   - লোকালহোস্টের phpMyAdmin (`http://localhost/phpmyadmin`) ওপেন করুন।
   - আপনার ডাটাবেজ সিলেক্ট করে **Export** ট্যাবে যান এবং **Quick - display only the minimal options** দিয়ে `SQL` ফরম্যাটে ডাউনলোড করুন।
2. **⚠️ সতর্কবার্তা (খুঁটিনাটি বিষয়):**
   - **বাংলা লেখা ও ইমোজি:** ডাটাবেজের Collation অবশ্যই `utf8mb4_unicode_ci` হতে হবে, নয়তো বাংলা টেক্সট বা ইমোজি `????` হয়ে যাবে।
   - **ফরেন কী কনস্ট্রেইন্ট এরর (Error 1215):** যদি এক টেবিল অন্য টেবিলের সাথে যুক্ত থাকে, এক্সপোর্ট ফাইলের শুরুতে অবশ্যই `SET FOREIGN_KEY_CHECKS = 0;` এবং শেষে `SET FOREIGN_KEY_CHECKS = 1;` থাকতে হবে।

### ⚡ আমাদের প্রজেক্টের অটোমেশন ফাইল:
আমাদের প্রজেক্টে অলরেডি এই কাজ সম্পূর্ণ রেডি করে রাখা আছে:  
👉 [`backend/drizzle/cpanel_database_import.sql`](backend/drizzle/cpanel_database_import.sql)

### 🖥️ cPanel-এ সরাসরি দেখাবেন (Action Steps):
1. cPanel ➔ **MySQL® Databases**-এ গিয়ে:
   - নতুন ডাটাবেজ তৈরি করুন (যেমন: `cpaneluser_campusfix`)।
   - নতুন ইউজার তৈরি করুন (যেমন: `cpaneluser_dbuser`) এবং পাসওয়ার্ডটি নোট করুন।
   - ইউজারকে ডাটাবেজে **Add** করে **ALL PRIVILEGES** বক্সে টিক দিন।
2. cPanel ➔ **phpMyAdmin** ওপেন করুন।
3. বামপাশ থেকে ডাটাবেজে ক্লিক করে উপরে **Import** ট্যাবে যান।
4. **Choose File** দিয়ে `cpanel_database_import.sql` সিলেক্ট করে নিচে **Go** চাপুন।  
   *মুহূর্তেই টেবিল ও সমস্ত সিড ডাটা লাইভ হয়ে যাবে!*

---

## পার্ট ৪: NestJS ব্যাকএন্ড প্রস্তুতি — `app.js`-এর রহস্য ও জিপ তৈরি

### 💡 `app.js` কেন লাগে? (শিক্ষার্থীদের সবচেয়ে বেশি করা প্রশ্ন!)
NestJS যখন TypeScript থেকে JavaScript-এ রূপান্তরিত হয় (`npm run build`), তখন মূল ফাইলটি তৈরি হয় `dist/main.js` হিসেবে।  
কিন্তু cPanel-এর **Setup Node.js App** তৈরি হয়েছে Express বা স্ট্যান্ডার্ড Node অ্যাপের কথা মাথায় রেখে, যা সার্ভার বুটস্ট্র্যাপ করার জন্য রুটে একটি `app.js` ফাইল খোঁজে।  
যদি cPanel-কে বলা হয় `dist/main.js` চালাতে, অনেক সময় রিলেটিভ পাথ জটিলতায় সার্ভার ক্র্যাশ করে।

### 🛠️ ম্যানুয়াল সমাধান (যে কারো সাধারণ NestJS প্রজেক্টের জন্য):
যাদের প্রজেক্টে অটোমেশন নেই, তারা কী করবে?
1. প্রজেক্টের রুট ডিরেক্টরিতে (যেখানে `package.json` আছে) একটি নতুন ফাইল তৈরি করবেন: **`app.js`**
2. ফাইলের ভেতর লিখবেন:
   - **ES Modules হলে (`"type": "module"` থাকলে):**
     ```javascript
     import './dist/main.js';
     ```
   - **CommonJS হলে:**
     ```javascript
     require('./dist/main.js');
     ```
3. **Top-Level Await সমাধান:**  
   `src/main.ts`-এ `await bootstrap();` না লিখে লিখবেন `void bootstrap();` বা `bootstrap();`। এতে Passenger ইঞ্জিন কোনো ব্লকিং ছাড়াই দ্রুত সার্ভার চালু করতে পারে।

### ⚠️ কোন ফাইলগুলো জিপ করবেন, আর কোনটা ভুলেও করবেন না?
> [!CAUTION]
> **শিক্ষার্থীদের বলবেন:** ভুলেও কম্পিউটারের `node_modules` ফোল্ডার জিপ করবেন না!  
> ১. এটি ৫০০-৮০০ মেগাবাইট হয়ে যায়, আপলোড হতে সময় নেয়।  
> ২. Windows/Mac-এ বিল্ড হওয়া বাইনারি (যেমন bcrypt, sharp) Linux সার্ভারে ক্র্যাশ করবে।

**শুধু এই ৪-৫টি ফাইল/ফোল্ডার জিপ করতে হবে:**
1. `dist/` ফোল্ডার (বিল্ড করা কোড)
2. `app.js` (বুটস্ট্র্যাপ ব্রিজ)
3. `package.json` (ডিপেনডেন্সি তালিকা)
4. `package-lock.json`
5. `.env.production.example` (কনফিগারেশনের জন্য)

### ⚡ প্রো-লেভেল অটোমেশন স্ক্রিপ্ট (আপনার প্রজেক্ট ট্রিক):
শিক্ষার্থীদের দেখাবেন কীভাবে `package.json`-এ একটি স্ক্রিপ্ট লিখে এই পুরো প্রক্রিয়াটি ১ ক্লিকে করে ফেলা যায়:
```json
"scripts": {
  "build": "nest build",
  "zip": "nest build && zip -r -q ../backend-deploy.zip dist app.js package.json package-lock.json .env.production.example"
}
```
*টার্মিনালে শুধু `npm run zip:backend` চালালেই স্বয়ংক্রিয়ভাবে `backend-deploy.zip` তৈরি হয়ে যায়!*

---

## পার্ট ৫: cPanel-এ Node.js App কনফিগারেশন ও লাইভ রান

### 🖥️ স্ক্রিনে দেখানোর ধাপসমূহ:
1. cPanel ➔ **Setup Node.js App** ➔ **Create Application**:
   - **Node.js version:** `20.x` বা `22.x`
   - **Application mode:** `Production`
   - **Application root:** `api.mahfuj-sends-greetings.xyz`
   - **Application URL:** `api.mahfuj-sends-greetings.xyz`
   - **Application startup file:** `app.js`
   - ক্লিক করুন **Create**।
2. cPanel ➔ **File Manager**:
   - `api.mahfuj-sends-greetings.xyz` ফোল্ডারে ঢুকুন।
   - cPanel যে ডামি `app.js` তৈরি করেছে, সেটি **Delete** করে দিন।
   - তৈরি করা `backend-deploy.zip` ফাইলটি আপলোড করে **Extract** করুন।
3. **`.env` ফাইল কনফিগারেশন:**
   - `.env.production.example` ফাইলটিকে রিনেম করে **`.env`** বানান এবং ডাটাবেজ তথ্য ও সিক্রেট দিন:
     ```ini
     PORT=3000
     NODE_ENV=production
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=cpaneluser_dbuser
     DB_PASSWORD=আপনার_ডাটাবেজ_পাসওয়ার্ড
     DB_NAME=cpaneluser_campusfix
     
     BETTER_AUTH_SECRET=53a2b70a970981ce5708a93d50cbbdfbf36818bc773ee03b81b572b9bc9df16a
     BETTER_AUTH_URL=https://api.mahfuj-sends-greetings.xyz
     TRUSTED_ORIGINS=https://mahfuj-sends-greetings.xyz,https://api.mahfuj-sends-greetings.xyz
     COOKIE_DOMAIN=.mahfuj-sends-greetings.xyz
     ```
4. **ডিপেনডেন্সি ইনস্টল ও রান:**
   - আবার **Setup Node.js App**-এ গিয়ে **Run NPM Install** বাটনে ক্লিক করুন।
   - ইনস্টল শেষে উপরে **Restart** বাটনে ক্লিক করুন।

---

## পার্ট ৬: Astro ফ্রন্টএন্ড বিল্ড, `.htaccess` ও `public_html`-এ ডিপ্লয়

### 💡 ফ্রন্টএন্ডে বিল্ড করার সময় বড় ভুল:
ভিডিওতে উল্লেখ করবেন: ফ্রন্টএন্ড কোডে যেন লোকালহোস্টের URL (`http://localhost:3000/api`) হার্ডকোড করা না থাকে।  
বিল্ড করার আগে `frontend/.env`-এ লাইভ এপিআই ইউআরএল সেট করতে হবে:
```ini
PUBLIC_API_URL=https://api.mahfuj-sends-greetings.xyz/api
```

### 💡 `.htaccess` কেন জীবন বাঁচায়?
Astro, React, বা Next.js-এর মতো অ্যাপ যখন Apache বা LiteSpeed সার্ভারে চলে:
- সরাসরি কেউ যদি `mahfuj-sends-greetings.xyz/vault` লিঙ্কে ঢোকে বা রিলোড দেয়, তখন Apache সার্ভার `vault` নামের ফোল্ডার খোঁজে। না পেলে **404 Not Found** দেয়!
- এছাড়া HTTPS রিডাইরেকশন এবং ক্যাশিং হ্যান্ডেল করার জন্য `.htaccess` ফাইল প্রয়োজন।

### 🛠️ ফ্রন্টএন্ডের জন্য আদর্শ `.htaccess` কোড:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Force HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Clean URLs for HTML files
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}\.html -f
  RewriteRule ^(.*)$ $1.html [NC,L]
</IfModule>
```

### ⚠️ cPanel-এ ফাইল এক্সট্রাক্টের সময় বিরাট ভুল (The Nested Folder Trap):
> [!WARNING]
> **শিক্ষার্থীদের অবশ্যই সতর্ক করবেন:**  
> আপনি যদি `dist` ফোল্ডারটিকে পুরো জিপ করেন এবং `public_html`-এ এক্সট্রাক্ট করেন, তবে ফাইলগুলো চলে যাবে `public_html/dist/`-এর ভেতর! ফলে ওয়েবসাইট দেখতে ভিজিট করতে হবে `yourdomain.com/dist`।  
> **সঠিক নিয়ম:** `dist` ফোল্ডারের **ভেতরে ঢুকে** ভেতরের ফাইলগুলোকে সিলেক্ট করে জিপ করতে হবে, অথবা আমাদের স্ক্রিপ্ট ব্যবহার করতে হবে যাতে ফাইলগুলো সরাসরি `public_html`-এর রুটে বসে (`public_html/index.html`)।

---

## পার্ট ৭: ক্রস-সাবডোমেন কুকি ও CORS সমাধান

### 🎙️ ভিডিওতে যা বলবেন (গোল্ডেন টিপ):
> *"ডিপ্লয়মেন্টে এসে ৯০% ছাত্র-ছাত্রী বা জুনিয়র ডেভেলপার যে সমস্যায় পড়ে তা হলো—লগইন তো সাকসেসফুল হচ্ছে, কিন্তু রিফ্রেশ দিলেই আবার লগআউট হয়ে যাচ্ছে! অথবা কনসোলে লাল রঙের CORS Policy Error দিচ্ছে। এর পেছনের কারণটা কী?"*

### ৩টি সমাধান যা ক্লায়েন্ট ও সার্ভারে মেলাতে হবে:
1. **Frontend Fetch-এ `credentials: 'include'`:**  
   লগইন রিকোয়েস্ট বা ডাটা ফেচ করার সময় ব্রাউজারকে বলতে হবে কুকি সাথে পাঠাও।
2. **Backend CORS-এ নির্দিষ্ট অরিজিন:**  
   কুকি শেয়ার করার সময় `origin: '*'` দিলে কাজ করবে না। অরিজিন হতে হবে সুস্পষ্ট:  
   `TRUSTED_ORIGINS=https://mahfuj-sends-greetings.xyz`
3. **ডোমেনের শুরুতে ডট (`.`):**  
   ব্যাকএন্ডের Better Auth বা সেশন কনফিগারেশনে কুকি ডোমেন অবশ্যই ডট দিয়ে শুরু হতে হবে:  
   `COOKIE_DOMAIN=.mahfuj-sends-greetings.xyz`  
   *(এই ডট থাকার কারণেই `mahfuj-sends-greetings.xyz` এবং `api.mahfuj-sends-greetings.xyz` একে অপরের কুকি পড়তে পারে!)*

---

## পার্ট ৮: লাইভ ভেরিফিকেশন, টেস্ট ক্রেডেনশিয়াল ও লাইভ ডেমো

### ১. লাইভ API যাচাই (টার্মিনালে cURL কমান্ড):
```bash
# পাবলিক কমপ্লেইন্টস API রেসপন্স যাচাই
curl -i https://api.mahfuj-sends-greetings.xyz/api/complaints/public
```
*স্ক্রিনে 200 OK রেসপন্স এবং JSON ডাটা প্রদর্শন করে দর্শকদের আশ্বস্ত করবেন।*

### ২. রোল-বেসড টেস্ট ক্রেডেনশিয়াল টেবিল:

ভিডিওতে প্রতিটি অ্যাকাউন্টে লগইন করে বিভিন্ন রোল ও ইন্টারফেস দেখাবেন:

| রোল | নাম | ইমেইল | পাসওয়ার্ড | ভিডিওতে কী দেখাবেন? |
| :--- | :--- | :--- | :--- | :--- |
| **👑 Admin (Proctor)** | Dr. Rafiqul Islam | `proctor@kcku.edu` | `admin123` | অভিযোগ ট্রায়াজ করা, স্ট্যাটাস পরিবর্তন, রেজোলিউশন লক করা |
| **👷 Staff (Technician)** | Kamal Uddin | `technician@kcku.edu` | `tech1234` | টেকনিশিয়ান লগ ও ইন্টারনাল নোটস যোগ করা |
| **🚌 Staff (Transport)** | Jashim Uddin | `transport@kcku.edu` | `transport123` | পরিবহন ও বাস সম্পর্কিত টিকিট আপডেট করা |
| **👤 Student (Tanvir)** | Tanvir Hossain | `student@kcku.edu` | `student123` | নতুন অভিযোগ দায়ের, আপভোট, কমেন্ট এডিট/ডিলিট, স্টুডেন্ট ভল্ট |

---

## পার্ট ৯: ট্রাবলশুটিং — কোনো সমস্যা হলে কীভাবে ডিবাগ করবেন

ভিডিওর শেষ অংশে দর্শকদের এই জরুরি ট্রাবলশুটিং টিপসগুলো দিয়ে গাইড শেষ করবেন:

| সমস্যা | আসল কারণ | ৩০ সেকেন্ডে সমাধান |
| :--- | :--- | :--- |
| **503 Service Unavailable** | Node.js অ্যাপ রান করেনি বা ক্র্যাশ করেছে | File Manager-এ গিয়ে **Show Hidden Files** অন করে `stderr.log` ফাইলটি ওপেন করুন। ভেতরে আসল এরর লাইন দেখা যাবে। |
| **লগইনের পর বারবার লগআউট** | ব্রাউজারে সেশন কুকি সেভ হচ্ছে না | `.env`-এ `COOKIE_DOMAIN` ঠিক আছে কি না এবং সামনে ডট (`.`) আছে কি না চেক করে অ্যাপ রিস্টার্ট দিন। |
| **404 Not Found on Refresh** | সার্ভারে `.htaccess` মিসিং | `frontend/dist` থেকে `.htaccess` ফাইলটি `public_html`-এ আপলোড হয়েছে কি না নিশ্চিত করুন। |
| **কোড পরিবর্তনের পর লাইভ না হওয়া** | ক্যাশিং বা সার্ভার রিস্টার্ট না দেওয়া | cPanel-এর **Setup Node.js App**-এ গিয়ে **Restart** বাটনে চাপুন। |

---

### 🎁 টিউটোরিয়াল উপহার (শিক্ষার্থীদের দেওয়ার জন্য):
আপনার ভিডিওর ডেসক্রিপশনে শিক্ষার্থীদের এই ৩টি রেডিমেড ফাইলের কথা বলে দিতে পারেন:
- `backend/drizzle/cpanel_database_import.sql` (ডাটাবেজ ইমপোর্ট)
- `backend-deploy.zip` (ব্যাকএন্ড ডিপ্লয়মেন্ট জিপ)
- `frontend-dist.zip` (ফ্রন্টএন্ড ডিপ্লয়মেন্ট জিপ)

*শুভকামনা আপনার টিউটোরিয়ালের জন্য! University of Barishal CampusFix Portal এখন সম্পূর্ণ গাইড সহ তৈরি!* 🎓🎬✨
