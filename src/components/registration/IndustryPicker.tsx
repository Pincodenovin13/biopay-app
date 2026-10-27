import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shirt,
  Footprints,
  Croissant,
  Sparkles,
  Watch,
  Smartphone,
  UtensilsCrossed,
  Scissors,
  Camera,
  Dumbbell,
  Cpu,
  GraduationCap,
  Gem,
  Palette,
  Home,
  Check,
  Eye,
  X,
  Instagram,
  ShoppingBag,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export interface IndustryOption {
  id: string;
  nameKey: string;
  nameFa: string;
  nameEn: string;
  nameAr: string;
  icon: React.ComponentType<{ className?: string }>;
  taglineFa: string;
  taglineEn: string;
  taglineAr: string;
  accentColor: string;
  bgGradient: string;
  sampleProducts: Array<{ title: string; price: string; tag: string }>;
  instagramBio: {
    handle: string;
    headline: string;
    bullets: string[];
    link: string;
  };
}

export const FIFTEEN_POPULAR_INDUSTRIES: IndustryOption[] = [
  {
    id: 'clothing',
    nameKey: 'clothing',
    nameFa: 'پوشاک و مد',
    nameEn: 'Clothing & Fashion',
    nameAr: 'الملابس والأزياء',
    icon: Shirt,
    taglineFa: 'کالکشن فصلی، سایزبندی دقیق، ارسال فوری',
    taglineEn: 'Seasonal collection, size guides, fast shipping',
    taglineAr: 'تشكيلة موسمية، جدول مقاسات، شحن سريع',
    accentColor: '#ec4899',
    bgGradient: 'from-pink-500/20 to-purple-500/10',
    sampleProducts: [
      { title: 'کت ترنچ لنین بهاره', price: '۱,۴۵۰,۰۰۰ تومان', tag: 'پرفروش' },
      { title: 'شومیز ساتن ابریشمی', price: '۸۹۰,۰۰۰ تومان', tag: 'جدید' },
    ],
    instagramBio: {
      handle: 'biopay.me/luxe_boutique',
      headline: '👗 کالکشن تخصصی پاییزه و زمستانه',
      bullets: ['✨ ضمانت تعویض تا ۷ روز', '📦 ارسال رایگان خریدهای بالای ۱ میلیون', '💳 پرداخت مستقیم شاپرک و تتر'],
      link: 'biopay.app/s/luxe_boutique',
    },
  },
  {
    id: 'shoes',
    nameKey: 'shoes',
    nameFa: 'کفش و کتونی',
    nameEn: 'Shoes & Sneakers',
    nameAr: 'الأحذية الرياضية',
    icon: Footprints,
    taglineFa: 'کتونی اورجینال، راهنمای سایز و ضمانت اصالت',
    taglineEn: 'Authentic sneakers, size selector, warranty',
    taglineAr: 'أحذية أصلية، دليل المقاسات، ضمان الجودة',
    accentColor: '#f97316',
    bgGradient: 'from-orange-500/20 to-amber-500/10',
    sampleProducts: [
      { title: 'کتونی رانینگ ضدضربه', price: '۲,۲۰۰,۰۰۰ تومان', tag: 'اورجینال' },
      { title: 'نیم‌بوت چرم طبیعی تبریز', price: '۱,۸۵۰,۰۰۰ تومان', tag: 'دست‌دوز' },
    ],
    instagramBio: {
      handle: 'biopay.me/sneaker_lab',
      headline: '👟 مرجع تخصصی کتونی و کفش اسپرت',
      bullets: ['⚡️ ارسال فوری همان روز در تهران', '🛡 ۱۰۰٪ تضمین اصالت و مرجوعی', '🔗 خرید سریع در ۳۰ ثانیه'],
      link: 'biopay.app/s/sneaker_lab',
    },
  },
  {
    id: 'bakery',
    nameKey: 'bakery',
    nameFa: 'کیک و شیرینی خانگی',
    nameEn: 'Bakery & Pastry',
    nameAr: 'المخبوزات والحلويات',
    icon: Croissant,
    taglineFa: 'سفارش آنلاین کیک تولد، ماکارون و شیرینی تازه',
    taglineEn: 'Fresh custom cakes, pastries, delivery slots',
    taglineAr: 'كعك مخصص، معجنات طازجة، مواعيد تسليم',
    accentColor: '#eab308',
    bgGradient: 'from-amber-500/20 to-yellow-500/10',
    sampleProducts: [
      { title: 'کیک بنتو شکلاتی دو نفره', price: '۳۸۰,۰۰۰ تومان', tag: 'تازه پخت' },
      { title: 'پک ۶ عددی ماکارون فرانسوی', price: '۲۹۰,۰۰۰ تومان', tag: 'محبوب' },
    ],
    instagramBio: {
      handle: 'biopay.me/sweet_atelier',
      headline: '🎂 کیک‌های دست‌ساز و شیرینی خانگی ارگانیک',
      bullets: ['🍓 مواد اولیه درجه یک بلژیکی', '🛵 پیک اختصاصی ضد آسیب کیک', '✨ ثبت سفارش آنلاین ۲۴ ساعته'],
      link: 'biopay.app/s/sweet_atelier',
    },
  },
  {
    id: 'perfume',
    nameKey: 'perfume',
    nameFa: 'عطر و ادکلن',
    nameEn: 'Perfume & Fragrance',
    nameAr: 'العطور والدخون',
    icon: Sparkles,
    taglineFa: 'دکانت‌های اورجینال، عطرهای نیش و راهنمای بویایی',
    taglineEn: 'Original decants, niche scents, notes guide',
    taglineAr: 'عينات أصلية، عطور نيش، روائح فاخرة',
    accentColor: '#8b5cf6',
    bgGradient: 'from-violet-500/20 to-purple-500/10',
    sampleProducts: [
      { title: 'دکانت ۱۰ میل بلک افغان', price: '۸۵۰,۰۰۰ تومان', tag: 'اورجینال' },
      { title: 'عطر باکارات رژ ۵۴۰', price: '۴,۲۰۰,۰۰۰ تومان', tag: 'لاکچری' },
    ],
    instagramBio: {
      handle: 'biopay.me/royal_perfume',
      headline: '💎 دنیای رایحه‌های اصیل و ماندگار',
      bullets: ['🌿 تضمین خلوص اسانس و ماندگاری', '📦 بسته‌بندی نفیس هدیه', '🎁 تست رایگان در هر سفارش'],
      link: 'biopay.app/s/royal_perfume',
    },
  },
  {
    id: 'accessories',
    nameKey: 'accessories',
    nameFa: 'اکسسوری و ساعت',
    nameEn: 'Accessories & Watches',
    nameAr: 'الإكسسوارات والساعات',
    icon: Watch,
    taglineFa: 'ساعت مچی، دستبند، عینک آفتابی و اکسسوری ترند',
    taglineEn: 'Wristwatches, bracelets, sunglasses & trends',
    taglineAr: 'ساعات يد، أساور، نظارات شمسية عصرية',
    accentColor: '#06b6d4',
    bgGradient: 'from-cyan-500/20 to-blue-500/10',
    sampleProducts: [
      { title: 'ساعت مینیمال بند چرم ژاپنی', price: '۱,۳۵۰,۰۰۰ تومان', tag: 'ضدآب' },
      { title: 'عینک فریم کائوچویی UV400', price: '۶۸۰,۰۰۰ تومان', tag: 'ترند' },
    ],
    instagramBio: {
      handle: 'biopay.me/urban_acc',
      headline: '⌚️ اکسسوری‌های مینیمال برای سلیقه‌های خاص',
      bullets: ['🛡 گارانتی ۱ ساله موتور ساعت', '📦 ارسال فوق سریع به سراسر کشور', '💳 خرید آنلاین ایمن'],
      link: 'biopay.app/s/urban_acc',
    },
  },
  {
    id: 'mobile',
    nameKey: 'mobile',
    nameFa: 'موبایل و لوازم جانبی',
    nameEn: 'Mobile & Gadgets',
    nameAr: 'الهواتف الذكية والإلكترونيات',
    icon: Smartphone,
    taglineFa: 'قاب، شارژر، ایرپاد و گجت‌های هوشمند روز',
    taglineEn: 'Cases, fast chargers, earbuds & smart gear',
    taglineAr: 'أغطية، شواحن سريعة، سماعات وأجهزة ذكية',
    accentColor: '#3b82f6',
    bgGradient: 'from-blue-500/20 to-indigo-500/10',
    sampleProducts: [
      { title: 'پاوربانک ۲۰۰۰۰ مگ‌سیف ۲۰W', price: '۱,۱۵۰,۰۰۰ تومان', tag: 'فست‌شارژ' },
      { title: 'قاب چرمی محافظ لنز با مگ‌سیف', price: '۳۹۰,۰۰۰ تومان', tag: 'محبوب' },
    ],
    instagramBio: {
      handle: 'biopay.me/gadget_hub',
      headline: '📱 برترین گجت‌ها و جانبی موبایل اورجینال',
      bullets: ['⚡️ شارژرهای تایید شده بدون افت باتری', '🛡 مهلت تست ۷ روزه تمام قطعات', '🚀 پرداخت سریع با درگاه بانکی'],
      link: 'biopay.app/s/gadget_hub',
    },
  },
  {
    id: 'restaurant',
    nameKey: 'restaurant',
    nameFa: 'رستوران و کافی‌شاپ',
    nameEn: 'Restaurant & Cafe',
    nameAr: 'المطاعم والمقاهي',
    icon: UtensilsCrossed,
    taglineFa: 'منوی دیجیتال QR، سفارش‌گیری میز و دلیوری',
    taglineEn: 'QR digital menu, table ordering & takeaway',
    taglineAr: 'قائمة رقمية ذكية، طلب طاولة وتوصيل',
    accentColor: '#ef4444',
    bgGradient: 'from-red-500/20 to-rose-500/10',
    sampleProducts: [
      { title: 'پیتزا سیر و استیک ناپلی', price: '۳۹۵,۰۰۰ تومان', tag: 'هیزمی' },
      { title: 'لاته کارامل ارگانیک', price: '۱۲۰,۰۰۰ تومان', tag: 'تک‌خاستگاه' },
    ],
    instagramBio: {
      handle: 'biopay.me/bistro_flavor',
      headline: '☕️ رستوران و کافه دنج با طعم‌های اصیل ایتالیایی',
      bullets: ['🌿 طبخ با مواد اولیه تازه روزانه', '📲 سفارش آنلاین از طریق منوی دیجیتال', '🛵 ارسال با پیک گرم‌نگهدارنده'],
      link: 'biopay.app/s/bistro_flavor',
    },
  },
  {
    id: 'barber',
    nameKey: 'barber',
    nameFa: 'آرایشگاه و سالن زیبایی',
    nameEn: 'Barbershop & Beauty Salon',
    nameAr: 'صالونات الحلاقة والتجميل',
    icon: Scissors,
    taglineFa: 'نوبت‌دهی آنلاین، رزرو پکیج و خدمات VIP',
    taglineEn: 'Online appointment booking & VIP services',
    taglineAr: 'حجز مواعيد أونلاين وباقات VIP',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-500/20 to-teal-500/10',
    sampleProducts: [
      { title: 'رزرو پکیج اصلاح مو + پاکسازی پوست', price: '۵۵۰,۰۰۰ تومان', tag: 'رزرو نوبت' },
      { title: 'سرم تقویت ریشه مو روغن آرگان', price: '۴۲۰,۰۰۰ تومان', tag: 'محصول' },
    ],
    instagramBio: {
      handle: 'biopay.me/barber_lounge',
      headline: '✂️ استایل مو و مراقبت پوست با استانداردهای مدرن',
      bullets: ['📅 انتخاب آسان ساعت نوبت بدون معطلی', '☕️ پذیرایی در فضای اختصاصی', '💳 بیعانه و تسویه آنلاین'],
      link: 'biopay.app/s/barber_lounge',
    },
  },
  {
    id: 'photographer',
    nameKey: 'photographer',
    nameFa: 'عکاسی و آتلیه',
    nameEn: 'Photography & Studio',
    nameAr: 'التصوير الفوتوغرافي والاستوديو',
    icon: Camera,
    taglineFa: 'پکیج‌های فرمالیته، عکاسی پرتره و تحویل دیجیتال',
    taglineEn: 'Portrait & wedding packages, digital delivery',
    taglineAr: 'جلسات تصوير، حفلات وتسليم رقمي',
    accentColor: '#6366f1',
    bgGradient: 'from-indigo-500/20 to-sky-500/10',
    sampleProducts: [
      { title: 'پکیج عکاسی پرتره استودیویی (۱۰ شات روتوش)', price: '۱,۹۰۰,۰۰۰ تومان', tag: 'آتلیه' },
      { title: 'پریست رنگی اختصاصی لایت‌روم (۱۰ عدد)', price: '۲۹۰,۰۰۰ تومان', tag: 'دانلود آنی' },
    ],
    instagramBio: {
      handle: 'biopay.me/lens_art',
      headline: '📸 ثبت ماندگارترین لحظات زندگی شما با نگاهی هنری',
      bullets: ['🎞 تحویل فایل‌های اصلی با کیفیت RAW', '💡 نورپردازی سینمایی در لوکیشن انتخابی', '📅 رزرو تاریخ جلسه عکاسی'],
      link: 'biopay.app/s/lens_art',
    },
  },
  {
    id: 'fitness',
    nameKey: 'fitness',
    nameFa: 'مربی بدنسازی و فیتنس',
    nameEn: 'Fitness Coach & Trainer',
    nameAr: 'مدرب لياقة بدنية وكمال أجسام',
    icon: Dumbbell,
    taglineFa: 'برنامه تمرینی اختصاصی، رژیم غذایی و مکمل‌ها',
    taglineEn: 'Custom workout & diet plans, supplement guide',
    taglineAr: 'خطط تمارين وغذاء مخصصة أونلاين',
    accentColor: '#14b8a6',
    bgGradient: 'from-teal-500/20 to-emerald-500/10',
    sampleProducts: [
      { title: 'برنامه تمرین و تغذیه اختصاصی ۱ ماهه', price: '۹۵۰,۰۰۰ تومان', tag: 'شخصی‌سازی' },
      { title: 'مشاوره آنلاین آنالیز بدنی و ترکیب عضلانی', price: '۴۵۰,۰۰۰ تومان', tag: 'آنلاین' },
    ],
    instagramBio: {
      handle: 'biopay.me/coach_fit',
      headline: '💪 همراه علمی شما تا ساخت بهترین فرم بدنی',
      bullets: ['🎯 بیش از ۳۰۰ شاگرد با نتایج واقعی', '🥗 رژیم منعطف بدون گرسنگی', '📲 پشتیبانی روزانه در واتساپ و تلگرام'],
      link: 'biopay.app/s/coach_fit',
    },
  },
  {
    id: 'digital',
    nameKey: 'digital',
    nameFa: 'محصولات دیجیتال و لایسنس',
    nameEn: 'Digital Products & Software',
    nameAr: 'المنتجات الرقمية والبرمجيات',
    icon: Cpu,
    taglineFa: 'قالب وبسایت، اشتراک‌های پریمیوم، اکانت و فایل',
    taglineEn: 'Web templates, premium accounts & instant downloads',
    taglineAr: 'قوالب، اشتراكات بريميوم وتنزيل فوري',
    accentColor: '#0ea5e9',
    bgGradient: 'from-sky-500/20 to-cyan-500/10',
    sampleProducts: [
      { title: 'اکانت ۱ ماهه پریمیوم اسپاتیفای', price: '۱۸۰,۰۰۰ تومان', tag: 'تحویل آنی' },
      { title: 'پک وکتور و کاراکتر سه‌بعدی UI/UX', price: '۳۴۰,۰۰۰ تومان', tag: 'فایل دیجیتال' },
    ],
    instagramBio: {
      handle: 'biopay.me/digital_zone',
      headline: '⚡️ پلتفرم تحویل خودکار انواع فایل و لایسنس دیجیتال',
      bullets: ['🤖 تحویل خودکار لینک دانلود بلافاصله بعد پرداخت', '🛡 تضمین کارکرد و پشتیبانی ۲۴ ساعته', '💳 پرداخت ریالی و تتر'],
      link: 'biopay.app/s/digital_zone',
    },
  },
  {
    id: 'courses',
    nameKey: 'courses',
    nameFa: 'دوره‌های آموزشی و پکیج',
    nameEn: 'Online Courses & Education',
    nameAr: 'الدورات التدريبية والتعليمية',
    icon: GraduationCap,
    taglineFa: 'دوره ویدیویی، فایل صوتی، ورکشاپ و وبینار',
    taglineEn: 'Video lectures, workshops, access passes',
    taglineAr: 'محاضرات فيديو، ورش عمل، وصول فوري',
    accentColor: '#a855f7',
    bgGradient: 'from-purple-500/20 to-pink-500/10',
    sampleProducts: [
      { title: 'دوره جامع آموزش فروش در اینستاگرام', price: '۱,۶۵۰,۰۰۰ تومان', tag: 'ویدیو HD' },
      { title: 'ورکشاپ عملی کمپین‌های تبلیغاتی', price: '۷۸۰,۰۰۰ تومان', tag: 'وبینار' },
    ],
    instagramBio: {
      handle: 'biopay.me/master_academy',
      headline: '🎓 مهارت‌های پردرآمد بازار را اصولی یاد بگیرید',
      bullets: ['🎥 مشاهده ویدیوها در اسپات‌پلیر بدون محدودیت', '📜 اعطای گواهی اتمام دوره', '💬 گروه اختصاصی رفع اشکال هنرجویان'],
      link: 'biopay.app/s/master_academy',
    },
  },
  {
    id: 'jewelry',
    nameKey: 'jewelry',
    nameFa: 'طلا و جواهرات',
    nameEn: 'Gold & Fine Jewelry',
    nameAr: 'الذهب والمجوهرات الفاخرة',
    icon: Gem,
    taglineFa: 'طلای کم‌اجرت، نقره عیار ۹۲۵، فاکتور رسمی',
    taglineEn: 'Fine gold, silver 925, official certified invoice',
    taglineAr: 'ذهب عيار، فضة 925، فاتورة رسمية معتمدة',
    accentColor: '#f59e0b',
    bgGradient: 'from-amber-400/20 to-yellow-600/10',
    sampleProducts: [
      { title: 'دستبند زنجیری کارتیر طلا ۱۸ عیار', price: '۸,۷۵۰,۰۰۰ تومان', tag: 'فاکتور رسمی' },
      { title: 'انگشتر تک‌نگین نقره رودیوم‌کاری', price: '۹۸۰,۰۰۰ تومان', tag: 'ضدحساسیت' },
    ],
    instagramBio: {
      handle: 'biopay.me/dorra_gold',
      headline: '✨ طلای ۱۸ عیار کم‌اجرت و جواهرات با اصالت',
      bullets: ['📜 همراه با فاکتور رسمی معتبر اتحادیه طلا', '📦 بیمه کامل مرسوله پستی تا درب منزل', '⚖️ وزن‌کشی دقیق با ترازوی صرافی'],
      link: 'biopay.app/s/dorra_gold',
    },
  },
  {
    id: 'cosmetics',
    nameKey: 'cosmetics',
    nameFa: 'آرایشی و مراقبت پوستی',
    nameEn: 'Cosmetics & Skincare',
    nameAr: 'مستحضرات التجميل والعناية بالبشرة',
    icon: Palette,
    taglineFa: 'ضدآفتاب، سرم نیاسینامید، تسترهای اصل کره و فرانسه',
    taglineEn: 'Korean skincare, sunscreens, clean cosmetics',
    taglineAr: 'منتجات العناية بالبشرة الكورية والفرنسية الأصلية',
    accentColor: '#f43f5e',
    bgGradient: 'from-rose-500/20 to-pink-500/10',
    sampleProducts: [
      { title: 'ضدآفتاب فیوژن واتر بیوتی آف چوسان', price: '۷۵۰,۰۰۰ تومان', tag: 'کره‌ای اصل' },
      { title: 'سرم ضدجوش نیاسینامید اوردینری', price: '۵۹۰,۰۰۰ تومان', tag: 'پرفروش' },
    ],
    instagramBio: {
      handle: 'biopay.me/glow_beauty',
      headline: '🌸 پوست شاداب و بی‌نقص با روتین پوستی استاندارد',
      bullets: ['🇰🇷 واردکننده مستقیم بدون واسطه از سئول', '🛡 بارکد اصالت کالا و بچ‌کد معتبر', '🎁 ارسال سمپل رایگان با هر خرید'],
      link: 'biopay.app/s/glow_beauty',
    },
  },
  {
    id: 'homedecor',
    nameKey: 'homedecor',
    nameFa: 'دکوراسیون و صنایع دستی',
    nameEn: 'Home Decor & Crafts',
    nameAr: 'الديكور المنزلي والحرف اليدوية',
    icon: Home,
    taglineFa: 'شمع معطر، گلدان سرامیکی، کوسن و اکسسوری خانه',
    taglineEn: 'Scented candles, ceramic vases, rugs & modern home',
    taglineAr: 'شموع عطرية، خزف يدوي، ديكورات عصرية',
    accentColor: '#84cc16',
    bgGradient: 'from-lime-500/20 to-emerald-500/10',
    sampleProducts: [
      { title: 'شمع معطر مومی سویا در ظرف سرامیکی', price: '۲۶۰,۰۰۰ تومان', tag: 'دست‌ساز' },
      { title: 'گلدان مینیمال مات طرح دونات', price: '۳۸۰,۰۰۰ تومان', tag: 'دکوراتیو' },
    ],
    instagramBio: {
      handle: 'biopay.me/cozy_nest',
      headline: '🕯 گرما و آرامش را به خانه خود هدیه دهید',
      bullets: ['🎨 آثار دست‌ساز هنرمندان مطرح ایرانی', '📦 بسته‌بندی ایمن ضد شکستگی', '🏡 هماهنگ با دکوراسیون مینیمال و بوهمین'],
      link: 'biopay.app/s/cozy_nest',
    },
  },
];

interface IndustryPickerProps {
  selectedId: string;
  onSelect: (id: string) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const IndustryPicker: React.FC<IndustryPickerProps> = ({
  selectedId,
  onSelect,
  onProceed,
  onBack,
}) => {
  const { locale } = useI18n();
  const [previewIndustry, setPreviewIndustry] = useState<IndustryOption | null>(null);

  const getIndustryName = (item: IndustryOption) => {
    if (locale === 'fa') return item.nameFa;
    if (locale === 'ar') return item.nameAr;
    return item.nameEn;
  };

  const getIndustryTagline = (item: IndustryOption) => {
    if (locale === 'fa') return item.taglineFa;
    if (locale === 'ar') return item.taglineAr;
    return item.taglineEn;
  };

  const activeOption = FIFTEEN_POPULAR_INDUSTRIES.find((i) => i.id === selectedId) || FIFTEEN_POPULAR_INDUSTRIES[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>مرحله ۲ از ۳: انتخاب صنف و قالب ویترین</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          حوزه فعالیت فروشگاه شما چیست؟
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          یکی از ۱۵ صنف پرطرفدار را انتخاب کنید. قالب ویترین اینستاگرامی و دسته‌بندی محصولات شما بر اساس این انتخاب پیکربندی می‌شود.
        </p>
      </div>

      {/* Grid of 15 Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {FIFTEEN_POPULAR_INDUSTRIES.map((ind) => {
          const Icon = ind.icon;
          const isSelected = selectedId === ind.id;

          return (
            <motion.div
              key={ind.id}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(ind.id)}
              className={`relative cursor-pointer rounded-2xl border p-3.5 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/30 shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-500/40'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 end-2.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              {/* Preview Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewIndustry(ind);
                }}
                title="مشاهده پیش‌نمایش قالب"
                className="absolute bottom-2.5 end-2.5 p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>

              <div className="space-y-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: ind.accentColor }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                    {getIndustryName(ind)}
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {getIndustryTagline(ind)}
                  </p>
                </div>
              </div>

              {/* Mini template visual bar */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ind.accentColor }} />
                <span className="text-[9px] text-slate-400 font-mono">
                  {ind.sampleProducts.length} محصول پیش‌فرض
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Industry Summary Card */}
      {activeOption && (
        <Card className="p-4 bg-slate-900 border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow"
              style={{ backgroundColor: activeOption.accentColor }}
            >
              <activeOption.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-medium">صنف انتخاب شده:</span>
                <span className="text-sm font-bold text-white">{getIndustryName(activeOption)}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ویترین فروشگاه شما شامل بیو اینستاگرام و ۲ محصول نمونه آماده خواهد بود.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPreviewIndustry(activeOption)}
              className="flex-1 sm:flex-none text-xs py-2 px-3 border border-slate-700 hover:bg-slate-800 flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>پیش‌نمایش قالب</span>
            </Button>
            <Button
              type="button"
              onClick={onProceed}
              className="flex-1 sm:flex-none text-xs py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <span>ادامه ثبت‌نام</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Button>
          </div>
        </Card>
      )}

      {/* Back button */}
      <div className="flex justify-start">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
        >
          <span>← تغییر نوع حساب (فروشنده / همکار)</span>
        </button>
      </div>

      {/* Full Instagram Bio Layout Preview Modal */}
      <AnimatePresence>
        {previewIndustry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-0 text-slate-100"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: previewIndustry.accentColor }}
                  >
                    <previewIndustry.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-white">
                    پیش‌نمایش ویترین: {getIndustryName(previewIndustry)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewIndustry(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Instagram Style Mockup Container */}
              <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Simulated Instagram Profile Bio */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                          BP
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-bold text-white">
                            {previewIndustry.instagramBio.handle.split('/')[1]}
                          </span>
                          <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[9px] font-bold">
                            ✓
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">فروشگاه رسمی اینستاگرامی</span>
                      </div>
                    </div>
                    <Instagram className="w-5 h-5 text-pink-400" />
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-white">{previewIndustry.instagramBio.headline}</p>
                    {previewIndustry.instagramBio.bullets.map((b, idx) => (
                      <p key={idx} className="text-slate-300 text-[11px] leading-relaxed">
                        {b}
                      </p>
                    ))}
                  </div>

                  {/* Bio Link Pill */}
                  <div className="pt-1">
                    <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-semibold">
                      <ShoppingBag className="w-3 h-3 text-emerald-400" />
                      <span>{previewIndustry.instagramBio.link}</span>
                    </div>
                  </div>
                </div>

                {/* Sample Showcase Products */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">
                    نمونه کارت‌های محصول در ویترین:
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {previewIndustry.sampleProducts.map((prod, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                      >
                        <div className="h-20 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-500">
                          <ShoppingBag className="w-6 h-6 opacity-40" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                              {prod.tag}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">
                            {prod.title}
                          </h4>
                          <span className="text-xs font-mono text-emerald-400 font-bold block mt-0.5">
                            {prod.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-xl text-[11px] text-slate-400 leading-relaxed">
                  💡 پس از ثبت‌نام و تایید حساب، می‌توانید نام، لوگو، رنگ‌بندی و محصولات ویترین خود را آزادانه ویرایش فرمایید.
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setPreviewIndustry(null)}
                  className="text-xs py-2 px-4"
                >
                  بستن
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    onSelect(previewIndustry.id);
                    setPreviewIndustry(null);
                  }}
                  className="text-xs py-2 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                >
                  انتخاب این قالب
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
