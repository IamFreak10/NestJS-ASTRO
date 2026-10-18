🚀 cPanel Shared Hosting-এ NestJS ডিপ্লয়মেন্ট গাইড
NestJS / Node.js প্রজেক্ট cPanel-এ লাইভ করার সম্পূর্ণ ধাপে ধাপে নির্দেশিকা
✅ সফল ডিপ্লয়মেন্টের ফলাফল
অভিনন্দন! NestJS API এখন সফলভাবে লাইভ এবং পারফেক্টলি রেসপন্স করছে (200 OK):
🔗 https://api.mahfuj-sends-greetings.xyz/api/tickets
যাচাই করার কমান্ড:
curl -i http://api.mahfuj-sends-greetings.xyz/api/tickets
curl -k -i https://api.mahfuj-sends-greetings.xyz/api/tickets
রেসপন্স:
[
{"id":1,"subject":"Ticket 1","priority":"low","status":"open","createdAt":"2023-01-01T00:00:00.000Z"},
{"id":2,"subject":"Ticket 2","priority":"medium","status":"closed","createdAt":"2023-01-02T00:00:00.000Z"},
{"id":3,"subject":"Ticket 3","priority":"high","status":"open","createdAt":"2023-01-03T00:00:00.000Z"}
]
📋 ডিপ্লয়মেন্টের ধাপসমূহ
ধাপ ১: ডোমেন / সাবডোমেন তৈরি

1. cPanel → Domains → Create A New Domain-এ যান।
2. সাবডোমেনের নাম দিন (যেমন: api.mahfuj-sends-greetings.xyz)।
3. Share document root আনচেকড (Unchecked) রাখুন, যাতে আলাদা ফোল্ডার তৈরি হয়।
4. Submit করুন।
   ধাপ ২: DNS পয়েন্টিং
   • ডোমেন যেখানে রেজিস্টার্ড (বা Cloudflare / DNS প্যানেল), সেখানে গিয়ে সাবডোমেনের (api) জন্য একটি A Record তৈরি করুন।
   • Value: cPanel-এর মূল ড্যাশবোর্ডের ডানপাশে থাকা Shared IP Address বসিয়ে দিন।
   ধাপ ৩: লোকাল কোড রেডি ও বিল্ড
5. বিল্ড করুন:
   npm run build
   এর ফলে dist/ ফোল্ডার তৈরি হবে।
6. Top-Level Await রিমুভ করুন: src/main.ts-এ await bootstrap();-এর বদলে সাধারণ bootstrap(); ব্যবহার করুন, যাতে cPanel-এর LiteSpeed / Passenger লোডার ক্র্যাশ না করে।
7. রুট ডিরেক্টরিতে app.js তৈরি করুন:
   import('./dist/main.js');
8. প্রোডাকশন package.json রাখুন: সার্ভারে devDependencies ছাড়া শুধু আসল dependencies রাখুন, যাতে npm install-এ কোনো মেমোরি বা ভার্সন কনফ্লিক্ট না হয়।
9. জিপ ফাইল তৈরি করুন: dist/, app.js ও package.json একসাথে জিপ (deploy.zip) করুন।
   ধাপ ৪: cPanel-এ Node.js App তৈরি
   cPanel → Setup Node.js App → Create Application-এ ক্লিক করে নিচের কনফিগারেশন দিন:
   • Node.js version: 20.x বা 22.x
   • Application mode: Production
   • Application root: আপনার ডোমেন ফোল্ডারের নাম (যেমন: api.mahfuj-sends-greetings.xyz)
   • Application URL: ড্রপডাউন থেকে আপনার ডোমেন সিলেক্ট করুন
   • Application startup file: app.js
   শেষে Create বাটনে ক্লিক করুন।
   ধাপ ৫: ফাইল আপলোড ও ডিপেনডেন্সি ইনস্টল
10. cPanel → File Manager-এ গিয়ে আপনার ডোমেন ফোল্ডারে ঢুকুন।
11. ডিফল্ট ডামি app.js মুছে দিন (যদি থাকে)।
12. তৈরি করা deploy.zip আপলোড করে Extract করুন।
13. Setup Node.js App-এ গিয়ে অ্যাপটি এডিট করুন এবং "Run NPM Install" বাটনে ক্লিক করুন।
    ধাপ ৬: SSL সক্রিয় ও রিস্টার্ট
14. cPanel → SSL/TLS Status-এ গিয়ে ডোমেন সিলেক্ট করে Run AutoSSL দিন, অথবা Issue a certificate দিয়ে ফ্রি SSL ইনস্টল করুন।
15. Setup Node.js App পেজের উপরে থাকা Restart বাটনে ক্লিক করুন।
    🔄 ভবিষ্যতে কোড আপডেট করতে চাইলে
    লোকালি npm run build করে শুধু নতুন dist ফোল্ডারটি cPanel-এ রিপ্লেস করুন, তারপর Setup Node.js App থেকে একবার Restart বাটনে ক্লিক করুন — আপডেট লাইভ হয়ে যাবে! ✨
