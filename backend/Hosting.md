# 🚀 cPanel Shared Hosting-এ NestJS ডিপ্লয়মেন্ট গাইড

> NestJS / Node.js প্রজেক্ট cPanel-এ লাইভ করার সম্পূর্ণ ধাপে ধাপে নির্দেশিকা ও রেফারেন্স।

---

## 🌐 লাইভ API স্ট্যাটাস & ভেরিফিকেশন

NestJS API সফলভাবে লাইভ এবং পারফেক্টলি রেসপন্স করছে (**200 OK**):

- 🔗 **লাইভ URL:** [https://api.mahfuj-sends-greetings.xyz/api/tickets](https://api.mahfuj-sends-greetings.xyz/api/tickets)

### 🧪 যাচাই করার কমান্ড (cURL)

```bash
# HTTP টেস্ট
curl -i http://api.mahfuj-sends-greetings.xyz/api/tickets

# HTTPS টেস্ট
curl -k -i https://api.mahfuj-sends-greetings.xyz/api/tickets
```

<details open>
<summary><b>📄 স্যাম্পল রেসপন্স (200 OK)</b></summary>

```json
[
  {
    "id": 1,
    "subject": "Ticket 1",
    "priority": "low",
    "status": "open",
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "subject": "Ticket 2",
    "priority": "medium",
    "status": "closed",
    "createdAt": "2023-01-02T00:00:00.000Z"
  },
  {
    "id": 3,
    "subject": "Ticket 3",
    "priority": "high",
    "status": "open",
    "createdAt": "2023-01-03T00:00:00.000Z"
  }
]
```

</details>

---

## 📋 ডিপ্লয়মেন্টের ধাপসমূহ

### ধাপ ১: ডোমেন / সাবডোমেন তৈরি

1. **cPanel** ড্যাশবোর্ডে লগইন করুন।
2. **Domains** &rarr; **Create A New Domain**-এ যান।
3. সাবডোমেনের নাম দিন (যেমন: `api.mahfuj-sends-greetings.xyz`)।
4. **Share document root** অপশনটি **আনচেকড (Unchecked)** রাখুন, যাতে আলাদা ফোল্ডার তৈরি হয়।
5. **Submit** বাটনে ক্লিক করুন।

---

### ধাপ ২: DNS পয়েন্টিং

- ডোমেন যেখানে রেজিস্টার্ড (অথবা Cloudflare / DNS ম্যানেজার প্যানেল), সেখানে যান।
- সাবডোমেনের (`api`) জন্য একটি **A Record** যোগ করুন:
  - **Type:** `A`
  - **Name:** `api`
  - **Value / Target IP:** cPanel-এর মূল ড্যাশবোর্ডের ডানপাশে থাকা **Shared IP Address** বসিয়ে দিন।
  - **TTL:** Auto বা `3600`

---

### ধাপ ৩: লোকাল কোড রেডি ও বিল্ড

1. **প্রজেক্ট বিল্ড করুন:**
   ```bash
   npm run build
   ```
   *এর ফলে `dist/` ফোল্ডারে ট্রান্সপাইল করা জাভাস্ক্রিপ্ট কোড তৈরি হবে।*

2. **Top-Level Await হ্যান্ডলিং:**
   `src/main.ts`-এ `await bootstrap();`-এর বদলে সাধারণ `bootstrap();` ব্যবহার করুন, যাতে cPanel-এর LiteSpeed / Passenger লোডার ক্র্যাশ না করে:
   ```typescript
   bootstrap();
   ```

3. **রুট ডিরেক্টরিতে `app.js` তৈরি করুন:**
   ```javascript
   // app.js
   import('./dist/main.js');
   ```

4. **প্রোডাকশন `package.json` প্রস্তুত করুন:**
   সার্ভারে `devDependencies` ছাড়া শুধু আসল `dependencies` রাখুন, যাতে `npm install`-এর সময় কোনো মেমোরি লিমিটেশন বা ভার্সন কনফ্লিক্ট না হয়।

5. **জিপ ফাইল তৈরি করুন:**
   নিচের ফাইল ও ফোল্ডারগুলো একসাথে জিপ (`deploy.zip`) করুন:
   - `dist/`
   - `app.js`
   - `package.json`

---

### ধাপ ৪: cPanel-এ Node.js App তৈরি

1. cPanel &rarr; **Setup Node.js App** &rarr; **Create Application**-এ ক্লিক করুন।
2. নিচের তথ্যগুলো দিয়ে ফর্ম পূরণ করুন:

| ফিল্ড | মান / সেটিং |
| :--- | :--- |
| **Node.js version** | `20.x` বা `22.x` |
| **Application mode** | `Production` |
| **Application root** | আপনার ডোমেন ফোল্ডারের নাম (যেমন: `api.mahfuj-sends-greetings.xyz`) |
| **Application URL** | ড্রপডাউন থেকে আপনার ডোমেন সিলেক্ট করুন |
| **Application startup file** | `app.js` |

3. সবশেষে নিচে থাকা **Create** বাটনে ক্লিক করুন।

---

### ধাপ ৫: ফাইল আপলোড ও ডিপেনডেন্সি ইনস্টল

1. cPanel &rarr; **File Manager**-এ গিয়ে আপনার ডোমেন ফোল্ডারে ঢুকুন।
2. ডিফল্ট ডামি `app.js` ফাইল থাকলে তা মুছে দিন।
3. তৈরি করা `deploy.zip` ফাইলটি আপলোড করে **Extract** করুন।
4. **Setup Node.js App**-এ গিয়ে অ্যাপটি এডিট মোডে ওপেন করুন এবং **Run NPM Install** বাটনে ক্লিক করুন।

---

### ধাপ ৬: SSL সক্রিয় ও রিস্টার্ট

1. cPanel &rarr; **SSL/TLS Status**-এ গিয়ে ডোমেন সিলেক্ট করে **Run AutoSSL** দিন (অথবা Let's Encrypt / Issue a certificate দিয়ে ফ্রি SSL ইনস্টল করুন)।
2. **Setup Node.js App** পেজের উপরে থাকা **Restart** বাটনে ক্লিক করে অ্যাপটি চালু করুন।

---

## 🔄 ভবিষ্যতে কোড আপডেট করার নিয়ম

ভবিষ্যতে যখনই কোডে কোনো পরিবর্তন আনবেন:

```bash
# ১. লোকালি বিল্ড করুন
npm run build
```

1. লোকালি বিল্ড করে শুধু নতুন তৈরি হওয়া **`dist/`** ফোল্ডারটি cPanel-এ পূর্বের `dist` ফোল্ডারের সাথে রিপ্লেস করুন।
2. **Setup Node.js App** পেজে গিয়ে একবার **Restart** বাটনে ক্লিক করুন — পরিবর্তনটি তৎক্ষণাৎ লাইভ হয়ে যাবে! ✨

> [!TIP]
> প্রতিবার ডিপ্লয়মেন্টের সময় সম্পূর্ণ প্যাকেজ বা `node_modules` আপলোড করার প্রয়োজন নেই; শুধু `dist` ফোল্ডার আপডেট করে রিস্টার্ট দিলেই চলবে।

4. **প্রোডাকশন `package.json` প্রস্তুত করুন:**
   সার্ভারে `devDependencies` ছাড়া শুধু আসল `dependencies` রাখুন, যাতে `npm install`-এর সময় কোনো মেমোরি লিমিটেশন বা ভার্সন কনফ্লিক্ট না হয়।

5. **জিপ ফাইল তৈরি করুন:**
   নিচের ফাইল ও ফোল্ডারগুলো একসাথে জিপ (`deploy.zip`) করুন:
   - `dist/`
   - `app.js`
   - `package.json`

---

### ধাপ ৪: cPanel-এ Node.js App তৈরি

1. cPanel &rarr; **Setup Node.js App** &rarr; **Create Application**-এ ক্লিক করুন।
2. নিচের তথ্যগুলো দিয়ে ফর্ম পূরণ করুন:

| ফিল্ড | মান / সেটিং |
| :--- | :--- |
| **Node.js version** | `20.x` বা `22.x` |
| **Application mode** | `Production` |
| **Application root** | আপনার ডোমেন ফোল্ডারের নাম (যেমন: `api.mahfuj-sends-greetings.xyz`) |
| **Application URL** | ড্রপডাউন থেকে আপনার ডোমেন সিলেক্ট করুন |
| **Application startup file** | `app.js` |

3. সবশেষে নিচে থাকা **Create** বাটনে ক্লিক করুন।

---

### ধাপ ৫: ফাইল আপলোড ও ডিপেনডেন্সি ইনস্টল

1. cPanel &rarr; **File Manager**-এ গিয়ে আপনার ডোমেন ফোল্ডারে ঢুকুন।
2. ডিফল্ট ডামি `app.js` ফাইল থাকলে তা মুছে দিন।
3. তৈরি করা `deploy.zip` ফাইলটি আপলোড করে **Extract** করুন।
4. **Setup Node.js App**-এ গিয়ে অ্যাপটি এডিট মোডে ওপেন করুন এবং **Run NPM Install** বাটনে ক্লিক করুন।

---

### ধাপ ৬: SSL সক্রিয় ও রিস্টার্ট

1. cPanel &rarr; **SSL/TLS Status**-এ গিয়ে ডোমেন সিলেক্ট করে **Run AutoSSL** দিন (অথবা Let's Encrypt / Issue a certificate দিয়ে ফ্রি SSL ইনস্টল করুন)।
2. **Setup Node.js App** পেজের উপরে থাকা **Restart** বাটনে ক্লিক করে অ্যাপটি চালু করুন।

---

## 🔄 ভবিষ্যতে কোড আপডেট করার নিয়ম

ভবিষ্যতে যখনই কোডে কোনো পরিবর্তন আনবেন:

```bash
# ১. লোকালি বিল্ড করুন
npm run build
```

1. লোকালি বিল্ড করে শুধু নতুন তৈরি হওয়া **`dist/`** ফোল্ডারটি cPanel-এ পূর্বের `dist` ফোল্ডারের সাথে রিপ্লেস করুন।
2. **Setup Node.js App** পেজে গিয়ে একবার **Restart** বাটনে ক্লিক করুন — পরিবর্তনটি তৎক্ষণাৎ লাইভ হয়ে যাবে! ✨

> [!TIP]
> প্রতিবার ডিপ্লয়মেন্টের সময় সম্পূর্ণ প্যাকেজ বা `node_modules` আপলোড করার প্রয়োজন নেই; শুধু `dist` ফোল্ডার আপডেট করে রিস্টার্ট দিলেই চলবে।

