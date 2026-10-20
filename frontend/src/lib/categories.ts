/**
 * University Grievance Category Definitions & Metadata
 */
import { ICONS } from './icons.js';
import type { ComplaintCategory } from '../types/complaint.js';

export interface CategoryMeta {
  key: ComplaintCategory;
  label: string;
  labelBn: string;
  icon: string;
  color: string;
  description?: string;
  descriptionBn?: string;
}

export const CATEGORY_DEFINITIONS: Record<string, CategoryMeta> = {
  facilities: {
    key: 'facilities',
    label: 'Facilities',
    labelBn: 'অবকাঠামো ও ল্যাব',
    icon: ICONS.building,
    color: 'var(--pastel-cyan)',
    description: 'Classrooms, labs, restrooms, electricity & water purifiers',
    descriptionBn: 'ক্লাসরুম, ল্যাব, ওয়াশরুম, বিদ্যুৎ ও পানি ফিল্টার মেরামত',
  },
  hostel_canteen: {
    key: 'hostel_canteen',
    label: 'Hostel & Mess',
    labelBn: 'হল ও ডাইনিং',
    icon: ICONS.home,
    color: 'var(--pastel-yellow)',
    description: 'Dormitory living conditions, food hygiene & meal quality',
    descriptionBn: 'হল কক্ষের সমস্যা, ক্যান্টিন খাবারের মান ও স্বাস্থ্যবিধি',
  },
  transport: {
    key: 'transport',
    label: 'Transport',
    labelBn: 'বাস ও পরিবহন',
    icon: ICONS.bus,
    color: 'var(--pastel-mint)',
    description: 'Campus bus routes, driver delays & schedule coordination',
    descriptionBn: 'ক্যাম্পাস বাস রুট, বাসের সময়সূচী ও পরিবহন সংক্রান্ত',
  },
  academics: {
    key: 'academics',
    label: 'Academics',
    labelBn: 'শিক্ষা ও পরীক্ষা',
    icon: ICONS.book,
    color: 'var(--pastel-lavender)',
    description: 'Library digital access, course credits & examination desk',
    descriptionBn: 'লাইব্রেরি ডিজিটাল রিসোর্স, পরীক্ষার ফলাফল ও অ্যাকাডেমিক সেবা',
  },
  safety_bullying: {
    key: 'safety_bullying',
    label: 'Safety & Anti-Ragging',
    labelBn: 'অ্যান্টি-র‍্যাগিং ও নিরাপত্তা',
    icon: ICONS.shieldAlert,
    color: 'var(--pastel-rose)',
    description: 'Ragging deterrence, night patrol & whistleblower safety',
    descriptionBn: 'র‍্যাগিং প্রতিরোধ, নিরাপত্তা টহল ও গোপনীয় হুইসেলব্লোয়ার সুরক্ষা',
  },
  administration: {
    key: 'administration',
    label: 'Administration',
    labelBn: 'প্রশাসনিক দপ্তর',
    icon: ICONS.fileText,
    color: 'var(--pastel-orange)',
    description: 'Registrar office, student affairs & certificate processing',
    descriptionBn: 'রেজিস্ট্রার কার্যালয়, সনদপত্র ও প্রশাসনিক অনুমোদন',
  },
};

export function getCategoryMeta(cat?: string | null): CategoryMeta {
  if (cat && CATEGORY_DEFINITIONS[cat]) {
    return CATEGORY_DEFINITIONS[cat];
  }
  const fallbackKey = (cat || 'facilities') as ComplaintCategory;
  return {
    key: fallbackKey,
    label: String(cat || 'General').toUpperCase(),
    icon: ICONS.building,
    color: 'var(--pastel-cyan)',
  };
}

