/**
 * Ultra-Lightweight, Zero-Dependency i18n Translation Engine
 * University of Barishal (বরিশাল বিশ্ববিদ্যালয়)
 * Uses O(1) tuple dictionary hashing for <0.5ms zero-overhead switching.
 */

export type SupportedLanguage = 'en' | 'bn';

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const EN_DIGITS_MAP: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
};

/**
 * Converts Western digits to Bengali digits (0-9 -> ০-৯)
 */
export function toBengaliDigits(input: number | string): string {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)] || d);
}

/**
 * Converts Bengali digits to Western digits (০-৯ -> 0-9)
 */
export function toEnglishDigits(input: number | string): string {
  return String(input).replace(/[০-৯]/g, (d) => EN_DIGITS_MAP[d] || d);
}

/**
 * Formats a Date into standard pure Bengali date format
 */
export function formatBengaliDate(dateInput: string | Date | number): string {
  try {
    return new Intl.DateTimeFormat('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateInput));
  } catch {
    return String(dateInput);
  }
}

/**
 * High-performance O(1) Flat Tuple Dictionary: [English, Bengali]
 */
const DICTIONARY: Record<string, [string, string]> = {
  // Brand
  'brand.title': ['CAMPUSFIX', 'ক্যাম্পাসফিক্স'],
  'brand.uni': ['UNIVERSITY OF BARISHAL', 'বরিশাল বিশ্ববিদ্যালয়'],
  'brand.osBadge': ['v2.0 OS', 'সংস্করণ ২.০'],
  'brand.drawerTitle': ['BU_NAVIGATION_MENU.SYS', 'বিইউ_নেভিগেশন_মেনু.সিস্টেম'],
  'brand.sosHotlineLabel': ['SOS HOTLINE:', 'জরুরি হটলাইন:'],

  // Navigation
  'nav.publicFeed': ['Public Feed', 'উন্মুক্ত ফিড'],
  'nav.myComplaints': ['My Grievances', 'আমার অভিযোগসমূহ'],
  'nav.trackId': ['Track ID', 'ট্র্যাক করুন'],
  'nav.emergency': ['Emergency', 'জরুরি সেবা'],
  'nav.blueprint': ['Blueprint', 'ব্লুপ্রিন্ট'],
  'nav.fileTicketBtn': ['+ FILE TICKET', '+ অভিযোগ দাখিল'],
  'nav.loginBtn': ['LOGIN', 'লগইন'],
  'nav.logoutBtn': ['LOGOUT', 'লগআউট'],

  // Hero Section
  'hero.engineStatus': ['RESOLUTION ENGINE ONLINE', 'অভিযোগ সমাধান ইঞ্জিন সক্রিয়'],
  'hero.subOfficial': ['UNIVERSITY OF BARISHAL OFFICIAL STUDENT WELFARE', 'বরিশাল বিশ্ববিদ্যালয় অফিশিয়াল ছাত্রকল্যাণ প্ল্যাটফর্ম'],
  'hero.headline': [
    'Resolve Campus Problems. <br /><span class="headline-highlight">Empower Student Voices.</span>',
    'ক্যাম্পাসের সমস্যা সমাধান হোক দ্রুত। <br /><span class="headline-highlight">শিক্ষার্থীদের কণ্ঠস্বর হোক শক্তিশালী।</span>',
  ],
  'hero.description': [
    'The official real-time complaint and grievance redressal system of the <strong>University of Barishal</strong>. File classroom maintenance, hostel mess hygiene, campus bus delays, or confidential anti-ragging reports with cryptographic anonymity.',
    '<strong>বরিশাল বিশ্ববিদ্যালয়ের</strong> দাপ্তরিক রিয়েল-টাইম অভিযোগ ও সমস্যা সমাধান পোর্টাল। ক্লাসরুমের বৈদ্যুতিক ত্রুটি, হল ডাইনিংয়ের খাবারের মান, পরিবহন বাসের শিডিউল বা গোপনীয় অ্যান্টি-র‍্যাগিং অভিযোগ দাখিল করুন শতভাগ নিরাপত্তার সাথে।',
  ],
  'hero.fileBtn': ['+ FILE A COMPLAINT', '+ নতুন অভিযোগ দাখিল'],
  'hero.trackBtn': ['TRACK TICKET BY ID', 'অভিযোগ ট্র্যাক করুন'],
  'hero.emergencyBtn': ['Emergency Hotlines', 'জরুরি হেল্পলাইন'],

  // Feed & Filters
  'feed.searchPlaceholder': ['Search complaints by keyword, room, or issue...', 'শিরোনাম, স্থান, হল বা সমস্যা দিয়ে অনুসন্ধান করুন...'],
  'feed.filterTitle': ['CAMPUS SECTOR FILTERS', 'ক্যাম্পাস বিভাগসমূহ'],

  // Categories
  'categories.all': ['All Sectors', 'সকল বিভাগ'],
  'categories.facilities': ['Facilities', 'অবকাঠামো ও ল্যাব'],
  'categories.hostel_canteen': ['Hostel & Mess', 'হল ও ডাইনিং'],
  'categories.transport': ['Transport', 'বাস ও পরিবহন'],
  'categories.academics': ['Academics', 'শিক্ষা ও পরীক্ষা'],
  'categories.safety_bullying': ['Safety & Ragging', 'অ্যান্টি-র‍্যাগিং'],
  'categories.administration': ['Admin', 'প্রশাসনিক দপ্তর'],

  // Cards
  'card.upvoteBtn': ['+1 Me Too', '+১ আমিও ভুক্তভোগী'],
  'card.upvotedBtn': ['Upvoted', 'সমর্থন দিয়েছেন'],
  'card.anonymousAuthor': ['Anonymous Student', 'বেনামি শিক্ষার্থী'],
  'card.viewDetails': ['Timeline', 'অগ্রগতি ও টাইমলাইন'],
  'card.close': ['Close Window', 'উইন্ডো বন্ধ করুন'],

  // Vault
  'vault.eyebrow': ['STUDENT CONFIDENTIAL VAULT', 'শিক্ষার্থী গোপনীয় ভল্ট'],
  'vault.headline': [
    'Personal Grievance Desk. <br /><span class="vault-headline-highlight">Track Your Lodged Reports.</span>',
    'ব্যক্তিগত অভিযোগ ডেস্ক। <br /><span class="vault-headline-highlight">দাখিলকৃত সকল রিপোর্ট পর্যবেক্ষণ করুন।</span>',
  ],
  'vault.subtext': [
    'Inspect real-time technician dispatches, proctorial triage notes, and verified resolution certificates for all complaints lodged under your university credentials.',
    'আপনার বিশ্ববিদ্যালয়ের আইডির অধীনে দাখিলকৃত সকল অভিযোগ, টেকনিশিয়ান টিম ডিসপ্যাচ ও প্রক্টরিয়াল নোট পর্যবেক্ষণ করুন।',
  ],
  'vault.totalFiled': ['Total Lodged', 'মোট দাখিলকৃত'],
  'vault.inProgress': ['In Progress / Review', 'কাজ চলমান / পর্যালোচনায়'],
  'vault.resolved': ['Verified Resolved', 'যাচাইকৃত সমাধান'],
  'vault.confidential': ['Confidential Vault', 'গোপনীয় রিপোর্ট'],
  'vault.fileNewBtn': ['+ FILE NEW TICKET', '+ নতুন অভিযোগ দাখিল করুন'],
  'vault.unauthTitle': ['Student Authentication Required', 'শিক্ষার্থী লগইন আবশ্যক'],
  'vault.unauthDesc': [
    'Your personal grievance vault contains confidential submissions protected by university privacy standards. Sign in with your university account to inspect ticket progression and proctorial notes.',
    'ব্যক্তিগত অভিযোগের অবস্থা এবং গোপনীয় রিপোর্ট দেখতে বরিশাল বিশ্ববিদ্যালয়ের একাউন্ট দিয়ে লগইন করুন।',
  ],
  'vault.signInBtn': ['SIGN IN WITH STUDENT ID', 'শিক্ষার্থী আইডি দিয়ে লগইন করুন'],

  // How It Works
  'howItWorks.badge': ['FAST & TRANSPARENT', 'দ্রুত ও স্বচ্ছ ব্যবস্থা'],
  'howItWorks.title': ['Campus Redressal Pipeline', 'অভিযোগ সমাধান প্রক্রিয়া'],
  'howItWorks.subtitle': [
    'From initial submission to verified maintenance fix, every ticket follows a strict 4-step university protocol.',
    'অভিযোগ দাখিল থেকে শুরু করে সরাসরি সমাধান ও প্রমাণ যাচাই পর্যন্ত প্রতিটি ধাপ পুরোপুরি স্বচ্ছ ও জবাবদিহিতামূলক।',
  ],
  'howItWorks.step1Title': ['File Complaint', '১. অভিযোগ দাখিল'],
  'howItWorks.step1Desc': [
    'Submit issue with location and priority. Toggle Public Wall or sealed Confidential Vault with Anonymous Protection.',
    'ছবি, অবস্থান ও বিস্তারিত বিবরণ দিয়ে অভিযোগ জমা দিন। সংবেদনশীল বিষয়ে পরিচয় সম্পূর্ণ গোপন রাখতে পারবেন।',
  ],
  'howItWorks.step2Title': ['Proctorial Triage', '২. প্রক্টরিয়াল যাচাই'],
  'howItWorks.step2Desc': [
    'Proctor Office verifies ticket validity within 2 hours. Ragging, harassment, and electrical hazards trigger emergency dispatch.',
    'প্রক্টর অফিস ২ ঘণ্টার মধ্যে টিকিট যাচাই করে। র‍্যাগিং ও নিরাপত্তা ঝুঁকির ক্ষেত্রে অবিলম্বে জরুরি টিম পাঠানো হয়।',
  ],
  'howItWorks.step3Title': ['Technician Action', '৩. মেরামত কার্যক্রম'],
  'howItWorks.step3Desc': [
    'Campus electricians, plumbers, or transport mechanics are assigned. Real-time updates and parts orders are logged on your ticket.',
    'বিশ্ববিদ্যালয়ের অভিজ্ঞ টেকনিশিয়ান ও মেকানিক টিমকে দ্রুত মেরামতের দায়িত্ব দেওয়া হয়।',
  ],
  'howItWorks.step4Title': ['Verified Fix', '৪. সমাধান ও যাচাই'],
  'howItWorks.step4Desc': [
    'Once inspected and completed, an official written resolution note is published. The ticket gets the green RESOLVED stamp.',
    'মেরামত সম্পন্ন হওয়ার পর ফটোগ্রাফিক প্রমাণ ও সমাপ্তি নোটের মাধ্যমে টিকিট নিশ্চিতভাবে সমাধান করা হয়।',
  ],

  // Track Page
  'track.badge': ['INSTANT TICKET RADAR', 'ইনস্ট্যান্ট টিকিট রাডার'],
  'track.title': ['Track Complaint Progress', 'অভিযোগের অগ্রগতি পর্যবেক্ষণ'],
  'track.subtitle': [
    'Enter any complaint ticket number (or click a test ticket below) to inspect real-time maintenance dispatches, proctorial triage notes, and verified resolution sign-offs.',
    'রিয়েল-টাইম মেরামত অগ্রগতি, প্রক্টরিয়াল নোট এবং ভেরিফাইড সমাধানের সনদ দেখতে যে কোনো টিকিট নম্বর লিখুন।',
  ],
  'track.inputPlaceholder': ['Enter Ticket ID (e.g. 101, 103, 105)...', 'টিকিট নম্বর লিখুন (যেমন: ১০১, ১০৩, ১০৫)...'],
  'track.scanBtn': ['SCAN TICKET STATUS', 'টিকিট স্ট্যাটাস ট্র্যাক করুন'],
  'track.scanningText': ['RADAR SCANNING UNIVERSITY OF BARISHAL DATABASE...', 'বরিশাল বিশ্ববিদ্যালয় ডাটাবেজ অনুসন্ধান করা হচ্ছে...'],
  'track.quickTicketsLabel': ['Quick Test Tickets:', 'দ্রুত পরীক্ষার টিকিট:'],

  // Emergency Page
  'emergency.badge': ['24/7 RAPID TRIAGE', '২৪/৭ জরুরি সেবা'],
  'emergency.title': ['Emergency Hotlines & Student Welfare', 'জরুরি হেল্পলাইন ও ছাত্রকল্যাণ ডেস্ক'],
  'emergency.subtitle': [
    'Direct rapid-response telephone hotlines and confidential support desks across the University of Barishal. All safety reports receive immediate emergency dispatch.',
    'বরিশাল বিশ্ববিদ্যালয়ের সকল দ্রুত-সাড়া প্রদানকারী টেলিফোন হটলাইন ও গোপনীয় সহায়তা কেন্দ্র। সকল নিরাপত্তা রিপোর্টে তাৎক্ষণিক মোবাইল টিম পাঠানো হয়।',
  ],
  'emergency.sosBannerTitle': ['FACING AN IMMEDIATE SAFETY THREAT OR RAGGING?', 'তাৎক্ষণিক নিরাপত্তা ঝুঁকি বা র‍্যাগিংয়ের মুখোমুখি?'],
  'emergency.sosBannerDesc': [
    'Do not wait for standard ticket processing. Call the Proctorial Mobile Patrol immediately or file a Sealed Confidential Grievance.',
    'সাধারণ টিকিটের অপেক্ষা না করে অবিলম্বে প্রক্টরিয়াল মোবাইল টহল দলকে কল করুন অথবা গোপনীয় অভিযোগ দাখিল করুন।',
  ],
  'emergency.sosHotlineBtn': ['CALL SOS HOTLINE', 'সরাসরি কল: +৮৮০-১৭০০-BU-HELP'],

  // Modals
  'modals.createTitle': ['FILE_CAMPUS_COMPLAINT.EXE', 'ক্যাম্পাসের নতুন অভিযোগ দাখিল'],
  'modals.titleLabel': ['Problem Title *', 'অভিযোগের শিরোনাম *'],
  'modals.titlePlaceholder': ['e.g. AC not cooling in CSE Lab 4, Hall 2 WiFi down...', 'সংক্ষেপে সমস্যাটি লিখুন (যেমন: ৩ নং হলের ৪ তলার ওয়াটার ফিল্টার নষ্ট)...'],
  'modals.categoryLabel': ['Category *', 'সমস্যার বিভাগ নির্বাচন করুন *'],
  'modals.priorityLabel': ['Urgency Level', 'জরুরি মাত্রা / তীব্রতা'],
  'modals.descLabel': ['Detailed Description *', 'বিস্তারিত বিবরণ *'],
  'modals.descPlaceholder': ['Describe the exact location, symptoms, and how long this issue has persisted...', 'নির্দিষ্ট স্থান, সমস্যাটির ধরন এবং কতদিন ধরে সমস্যাটি চলছে তা বিস্তারিত লিখুন...'],
  'modals.anonTitle': ['Student Privacy & Anonymity Gate', 'শিক্ষার্থী গোপনীয়তা ও পরিচয় সুরক্ষা গেইট'],
  'modals.anonLabel': ['Submit Anonymously', 'বেনামে জমা দিন (পরিচয় গোপন রাখুন)'],
  'modals.anonHint': ['Hides your name and student ID on the public campus board. Your identity remains protected.', 'পাবলিক বোর্ডে আপনার নাম এবং স্টুডেন্ট আইডি সম্পূর্ণ লুকানো থাকবে। আপনার পরিচয় গোপন রাখা হবে।'],
  'modals.confidentialLabel': ['Seal in Confidential Proctor Vault', 'শুধুমাত্র প্রক্টর ভল্টে সিলগালা করুন'],
  'modals.confidentialHint': ['For sensitive issues (ragging, personal harassment, exam disputes). Sent directly to the Proctor Office; not visible on public feed.', 'সংবেদনশীল বিষয়ে (র‍্যাগিং, ব্যক্তিগত হয়রানি)। সাধারণ নোটিশ বোর্ডে প্রদর্শিত হবে না।'],
  'modals.submitComplaintBtn': ['SUBMIT COMPLAINT', 'অভিযোগ দাখিল করুন'],
  'modals.cancelBtn': ['Cancel', 'বাতিল'],

  'modals.authTitle': ['BU_STUDENT_IDENTITY.SYS', 'বিইউ_শিক্ষার্থী_পরিচয়.সিস্টেম'],
  'modals.tabSignIn': ['Sign In (লগইন)', 'সাইন ইন (লগইন)'],
  'modals.tabRegister': ['Register (নতুন একাউন্ট)', 'রেজিস্ট্রেশন (নতুন একাউন্ট)'],
  'modals.emailLabel': ['University Email', 'বিশ্ববিদ্যালয় ইমেইল'],
  'modals.passwordLabel': ['Password', 'পাসওয়ার্ড'],
  'modals.fullNameLabel': ['Full Name', 'পূর্ণ নাম'],
  'modals.studentIdLabel': ['Student ID', 'স্টুডেন্ট আইডি'],
  'modals.departmentLabel': ['Department', 'বিভাগ (ডিপার্টমেন্ট)'],
  'modals.signInActionBtn': ['LOGIN TO CAMPUSFIX', 'পোর্টাল লগইন করুন'],
  'modals.registerActionBtn': ['CREATE STUDENT ACCOUNT', 'নতুন শিক্ষার্থী একাউন্ট তৈরি করুন'],

  'modals.detailTitle': ['TICKET_TIMELINE_INSPECTOR.SYS', 'অভিযোগ ও সমাধান বিবরণী'],
  'modals.discussionTitle': ['Community & Department Discussion', 'শিক্ষার্থী আলোচনা ও প্রতিক্রিয়া'],
  'modals.commentPlaceholder': ['Write a comment or follow-up note (requires login)...', 'আপনার মন্তব্য বা মতামত জানান...'],
  'modals.postCommentBtn': ['POST', 'মন্তব্য প্রকাশ করুন'],

  // Footer
  'footer.portalTitle': ['CAMPUSFIX PORTAL', 'ক্যাম্পাসফিক্স পোর্টাল'],
  'footer.desc': [
    'Official grievance and student welfare redressal system of the University of Barishal (বরিশাল বিশ্ববিদ্যালয়). Dedicated to protecting student rights, resolving facility outages, and enforcing zero-tolerance campus safety.',
    'বরিশাল বিশ্ববিদ্যালয়ের শিক্ষার্থী কল্যাণ ও অভিযোগ প্রতিকার ব্যবস্থা। শিক্ষার্থীদের অধিকার সুরক্ষা, দ্রুত মেরামত ও নিরাপদ ক্যাম্পাস প্রতিষ্ঠায় নিবেদিত।',
  ],
  'footer.antiRaggingBadge': ['ANTI-RAGGING CELL', 'অ্যান্টি-র‍্যাগিং সেল'],
  'footer.astroBadge': ['ZERO-JS ASTRO 7', 'অ্যাস্ট্রো ৭ ইঞ্জিন'],
  'footer.navHeading': ['NAVIGATION', 'ওয়েবসাইট লিংক'],
  'footer.triageHeading': ['EMERGENCY TRIAGE', 'জরুরি যোগাযোগ'],
  'footer.specsHeading': ['SYSTEM SPECS', 'প্রযুক্তি কাঠামো'],
  'footer.copyright': [
    '© 2026 University of Barishal (বরিশাল বিশ্ববিদ্যালয়). All complaints securely moderated.',
    '© ২০২৬ বরিশাল বিশ্ববিদ্যালয়। সকল অধিকার সংরক্ষিত।',
  ],
};

/**
 * Direct O(1) hash translation resolver
 */
export function resolveTranslation(lang: SupportedLanguage, keyPath: string): string | undefined {
  const item = DICTIONARY[keyPath];
  if (!item) return undefined;
  return lang === 'bn' ? item[1] : item[0];
}

export const TRANSLATIONS = {
  get en() {
    return (key: string) => resolveTranslation('en', key);
  },
  get bn() {
    return (key: string) => resolveTranslation('bn', key);
  },
};

/**
 * Status translations
 */
const STATUS_MAP: Record<string, [string, string]> = {
  progress: ['IN PROGRESS', 'কাজ চলমান'],
  resolve: ['RESOLVED', 'সমাধানকৃত'],
  review: ['IN REVIEW', 'পর্যালোচনাধীন'],
  dismiss: ['DISMISSED', 'বাতিলকৃত'],
  submitted: ['SUBMITTED', 'দাখিলকৃত'],
};

export function translateStatus(status: string, lang: SupportedLanguage): string {
  const norm = status?.toLowerCase() || '';
  const idx = lang === 'bn' ? 1 : 0;
  for (const key in STATUS_MAP) {
    if (norm.includes(key)) return STATUS_MAP[key][idx];
  }
  return STATUS_MAP.submitted[idx];
}

/**
 * Priority translations
 */
const PRIORITY_MAP: Record<string, [string, string]> = {
  urgent: ['URGENT', 'সর্বোচ্চ অগ্রাধিকার'],
  high: ['HIGH', 'জরুরি'],
  low: ['LOW', 'সাধারণ'],
  medium: ['MEDIUM', 'মাঝারি'],
};

export function translatePriority(priority: string, lang: SupportedLanguage): string {
  const norm = priority?.toLowerCase() || '';
  const idx = lang === 'bn' ? 1 : 0;
  return (PRIORITY_MAP[norm] || PRIORITY_MAP.medium)[idx];
}

/**
 * Category translations
 */
export function translateCategory(cat: string, lang: SupportedLanguage): string {
  return resolveTranslation(lang, `categories.${cat}`) || cat;
}

/**
 * Master Client-Side Translator:
 * Ultra-lightweight DOM mutator with zero external dependencies.
 */
export function translateEntirePage(lang: SupportedLanguage = 'bn'): void {
  document.documentElement.lang = lang;
  if (lang === 'bn') {
    document.body.classList.add('font-bangla');
  } else {
    document.body.classList.remove('font-bangla');
  }

  // 1. All [data-i18n] nodes
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const text = resolveTranslation(lang, key);
    if (text) {
      if (text.includes('<br') || text.includes('<span') || text.includes('<strong>')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    }
  });

  // 2. All [data-i18n-placeholder] input fields
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (!key) return;
    const placeholder = resolveTranslation(lang, key);
    if (placeholder) el.placeholder = placeholder;
  });

  // 3. Category chips
  document.querySelectorAll<HTMLElement>('.category-chip, .category-pill, .tab-btn').forEach((btn) => {
    const cat = btn.getAttribute('data-category');
    if (cat) {
      const label = translateCategory(cat, lang);
      const iconSpan = btn.querySelector('.tab-icon');
      if (iconSpan) {
        btn.innerHTML = `${iconSpan.outerHTML} ${label}`;
      } else {
        btn.textContent = label;
      }
    }
  });

  // 4. Status stamps
  document.querySelectorAll<HTMLElement>('.status-stamp, .card-status-badge').forEach((badge) => {
    const raw = badge.getAttribute('data-status') || badge.textContent?.trim() || '';
    badge.textContent = translateStatus(raw, lang);
  });

  // 5. Priority badges
  document.querySelectorAll<HTMLElement>('.priority-badge, .card-priority-badge').forEach((badge) => {
    const raw = badge.getAttribute('data-priority') || badge.textContent?.trim() || '';
    badge.textContent = translatePriority(raw, lang);
  });

  // 6. Upvote buttons
  document.querySelectorAll<HTMLElement>('.card-upvote-btn, .upvote-btn').forEach((btn) => {
    const isUpvoted = btn.getAttribute('data-upvoted') === 'true' || btn.classList.contains('upvoted');
    const countEl = btn.querySelector('.upvote-count');
    const rawCount = countEl?.textContent?.replace(/[^0-9০-৯]/g, '') || '';
    const formattedCount = lang === 'bn' ? toBengaliDigits(rawCount) : toEnglishDigits(rawCount);
    const label = isUpvoted
      ? (lang === 'bn' ? 'সমর্থিত' : 'Upvoted')
      : (lang === 'bn' ? '+১ ভুক্তভোগী' : '+1 Me Too');

    const labelEl = btn.querySelector('.upvote-label');
    if (labelEl) labelEl.textContent = label;
    if (countEl) countEl.textContent = `(${formattedCount})`;
  });

  // 7. Navbar Switcher Label
  const langBtnLabel = document.getElementById('langBtnLabel');
  if (langBtnLabel) {
    langBtnLabel.textContent = lang === 'bn' ? 'ENGLISH' : 'বাংলা';
  }
}
