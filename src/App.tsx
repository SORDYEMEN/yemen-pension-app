/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  User, 
  FileText, 
  Settings, 
  Info, 
  LogIn, 
  UserPlus, 
  ChevronLeft, 
  Plus, 
  Bell, 
  LayoutDashboard, 
  LogOut,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Printer,
  Edit2,
  RefreshCw,
  CreditCard,
  Activity,
  ChevronRight,
  Upload,
  Menu,
  Search,
  Megaphone,
  AlertTriangle,
  HelpCircle,
  Scale,
  FileBox,
  Calculator,
  MessageSquare,
  Heart,
  Target,
  BarChart3,
  Newspaper,
  Share2,
  Users,
  Shield,
  Building2,
  ShieldCheck,
  Coins,
  Gavel,
  Cpu,
  PieChart,
  Headphones,
  BookOpen,
  FileSearch,
  Star,
  UserCheck,
  Users2,
  Briefcase,
  ShieldAlert,
  Medal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { apiFetch, MOCK_NEWS, MOCK_GAZETTES, MOCK_EMPLOYEE_DATA, MOCK_PENSION_DATA } from './lib/api';
import Splash from './components/Splash';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Screen = 
  | 'ABOUT' 
  | 'SERVICES' 
  | 'LOGIN' 
  | 'REGISTER' 
  | 'DASHBOARD' 
  | 'BASIC_DATA' 
  | 'EDIT_DATA' 
  | 'REQUESTS' 
  | 'NEW_REQUEST' 
  | 'REQUEST_DETAILS'
  | 'GOV_AGENCIES'
  | 'PROFILE'
  | 'SETTINGS'
  | 'SUBSCRIPTIONS'
  | 'SERVICE_CATEGORY_DETAIL'
  | 'SERVICE_FORM'
  | 'INQUIRY_RESULT'
  | 'DRAFTS'
  | 'DOCUMENTS'
  | 'PENSION_CALC_RESULT'
  | 'COMPLAINT'
  | 'FAQ'
  | 'LAWS'
  | 'FORMS'
  | 'INSURANCE_CALC'
  | 'COMPLAINT_TRACKING'
  | 'GAZETTES'
  | 'MAIN_MENU';

type ServiceCategory = 
  | 'ALL'
  | 'PRIORITY'
  | 'AGENT'
  | 'BENEFICIARY'
  | 'GUARDIAN'
  | 'EMPLOYER'
  | 'INSURED'
  | 'TRUSTEE'
  | 'PENSIONER'
  | 'MILITARY'
  | 'VISITOR'
  | 'SOCIAL_INSURANCE';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'FORM' | 'INQUIRY' | 'DOWNLOAD' | 'CALCULATOR';
}

interface Draft {
  id: string;
  serviceId: string;
  serviceTitle: string;
  data: any;
  updatedAt: string;
}

interface UserDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
}

interface GovAgency {
  id: string;
  name: string;
  contact: string;
  services: string[];
  link: string;
}

interface Subscription {
  id: string;
  period: string;
  amount: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface RequestItem {
  id: string;
  type: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
  details: string;
}

// --- Components ---

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' }) => {
  const variants = {
    primary: 'bg-gov-green text-white hover:bg-opacity-90',
    secondary: 'bg-gov-text-secondary text-white hover:bg-opacity-90',
    outline: 'border border-gov-green text-gov-green hover:bg-gov-green hover:text-white',
    ghost: 'text-gov-text-secondary hover:bg-gray-100',
    danger: 'bg-gov-error text-white hover:bg-opacity-90',
  };

  return (
    <button 
      className={cn(
        'px-4 py-2 rounded-gov font-medium transition-all active:scale-95 flex items-center justify-center gap-2',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className, ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(
    'bg-white p-5 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100/80 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-0.5', 
    className
  )} {...props}>
    {children}
  </div>
);

const ServiceCard: React.FC<{ item: ServiceItem; onClick: () => void; isDarkMode: boolean }> = ({ item, onClick, isDarkMode }) => (
  <Card 
    className={cn(
      "flex items-center gap-4 cursor-pointer hover:border-gov-green transition-all group", 
      isDarkMode && "bg-gray-800 border-gray-700 hover:bg-gray-700"
    )} 
    onClick={onClick}
  >
    <div className={cn(
      "p-3 rounded-xl transition-colors group-hover:bg-gov-green group-hover:text-white",
      isDarkMode ? "bg-gray-700 text-gov-green" : "bg-gov-bg text-gov-green"
    )}>
      {item.icon}
    </div>
    <div className="flex-1">
      <h4 className={cn("text-sm font-bold transition-colors group-hover:text-gov-green", isDarkMode ? "text-white" : "text-gov-text-primary")}>
        {item.title}
      </h4>
      <p className="text-[10px] text-gov-text-secondary line-clamp-1">
        {item.description}
      </p>
    </div>
    <div className={cn(
      "text-[10px] font-bold px-2 py-1 rounded-lg border transition-all",
      isDarkMode 
        ? "bg-gray-900/50 border-gray-600 text-gray-400 group-hover:border-gov-green group-hover:text-gov-green" 
        : "bg-gray-50 border-gray-100 text-gov-text-secondary group-hover:border-gov-green group-hover:text-gov-green"
    )}>
      {item.type === 'FORM' ? 'طلب' : item.type === 'INQUIRY' ? 'استعلام' : item.type === 'CALCULATOR' ? 'حاسبة' : 'تحميل'}
    </div>
  </Card>
);

const NewsTicker = () => {
  const [news, setNews] = useState<string[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const result = await apiFetch<string[]>('/api/news', {}, MOCK_NEWS);
      if (result.success) {
        setNews(result.data);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="bg-gov-green text-white text-[10px] flex items-center overflow-hidden relative h-9 shadow-md border-b border-white/10">
      <div className="bg-red-600 text-white px-3 flex items-center gap-1.5 z-20 absolute right-0 h-full shadow-[-4px_0_12px_rgba(0,0,0,0.3)] font-black italic tracking-wider">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Megaphone size={14} />
        </motion.div>
        <span>أخبار الهيئة</span>
      </div>
      <div className="whitespace-nowrap animate-marquee pr-32 flex gap-12 items-center h-full">
        {news.length > 0 ? news.map((item, idx) => (
          <span key={idx} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
            {item}
          </span>
        )) : (
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
            جاري جلب آخر الأخبار...
          </span>
        )}
      </div>
    </div>
  );
};

const Input = ({ label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-sm font-semibold text-gov-text-primary">{label}</label>}
    <input 
      className={cn(
        'px-4 py-2 rounded-gov border border-gray-300 focus:outline-none focus:border-gov-green transition-colors bg-white',
        error && 'border-gov-error',
        props.className
      )}
      {...props}
    />
    {error && <span className="text-xs text-gov-error">{error}</span>}
  </div>
);

// --- Main App ---

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState<Screen>('LOGIN');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'AR' | 'EN'>('AR');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    pensionPayments: true,
    requestStatus: true,
    newsUpdates: false,
    securityAlerts: true
  });

  const [user, setUser] = useState({
    name: 'أحمد محمد علي',
    idNumber: '123456789',
    insuranceNumber: 'INS-987654',
    email: 'ahmed@example.com',
    phone: '777123456',
    address: 'تعز - شارع جمال',
    status: 'نشط',
    avatar: 'https://picsum.photos/seed/user/200/200'
  });

  const [requests, setRequests] = useState<RequestItem[]>([
    { id: 'REQ-001', type: 'طلب معاش تقاعدي', status: 'PENDING', date: '2024-03-01', details: 'طلب مقدم للحصول على المعاش التقاعدي المبكر.' },
    { id: 'REQ-002', type: 'تحديث بيانات بنكية', status: 'APPROVED', date: '2024-02-15', details: 'تحديث رقم الحساب البنكي لاستلام المعاش.' },
    { id: 'REQ-003', type: 'شهادة إثبات حالة', status: 'REJECTED', date: '2024-01-20', details: 'طلب شهادة إثبات حالة تأمينية.' },
  ]);

  const [subscriptions] = useState<Subscription[]>([
    { id: 'SUB-001', period: 'يناير 2024', amount: '5000 ر.ي', status: 'ACTIVE' },
    { id: 'SUB-002', period: 'فبراير 2024', amount: '5000 ر.ي', status: 'ACTIVE' },
    { id: 'SUB-003', period: 'ديسمبر 2023', amount: '4500 ر.ي', status: 'ACTIVE' },
  ]);

  const [govAgencies] = useState<GovAgency[]>([
    { id: 'GOV-001', name: 'وزارة الخدمة المدنية', contact: '04-211XXX', services: ['تحديث بيانات الموظفين', 'إصدار شهادات الخدمة'], link: 'https://mcs.gov.ye' },
    { id: 'GOV-002', name: 'البنك المركزي اليمني - تعز', contact: '04-222XXX', services: ['صرف المعاشات', 'التحويلات البنكية'], link: 'https://cby.gov.ye' },
    { id: 'GOV-003', name: 'مصلحة الأحوال المدنية', contact: '04-333XXX', services: ['إصدار البطاقة الشخصية', 'شهادات الميلاد'], link: 'https://cra.gov.ye' },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [inquiryData, setInquiryData] = useState<any>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [userDocuments, setUserDocuments] = useState<UserDocument[]>([
    { id: 'DOC-1', name: 'البطاقة الشخصية.pdf', type: 'PDF', size: '1.2 MB', date: '2024-01-10' },
    { id: 'DOC-2', name: 'صورة شمسية.jpg', type: 'IMAGE', size: '450 KB', date: '2024-01-12' },
  ]);

  const [complaints, setComplaints] = useState([
    { id: 'CMP-101', title: 'تأخر صرف المعاش', status: 'PENDING', date: '2024-03-01', details: 'لم يتم استلام معاش شهر فبراير حتى الآن.' },
    { id: 'CMP-102', title: 'خطأ في البيانات البنكية', status: 'RESOLVED', date: '2024-02-10', details: 'تم تعديل رقم الحساب ولكن لم يظهر في النظام.' },
  ]);

  const servicesData: Record<ServiceCategory, { title: string, icon: React.ReactNode, items: ServiceItem[] }> = {
    ALL: {
      title: 'جميع الخدمات',
      icon: <Menu size={20} />,
      items: [] // Will be populated dynamically or with a subset
    },
    PRIORITY: {
      title: 'خدمات ذات أولوية',
      icon: <Star size={20} />,
      items: [
        { id: 'prio_1', title: 'صرف معاش تقاعدي', description: 'طلب صرف المعاش التقاعدي الأول', icon: <Coins size={20} />, type: 'FORM' },
        { id: 'prio_2', title: 'تحديث بيانات الحساب البنكي', description: 'تغيير رقم الحساب لاستلام المعاش', icon: <RefreshCw size={20} />, type: 'FORM' },
      ]
    },
    AGENT: {
      title: 'خدمات الوكيل',
      icon: <UserCheck size={20} />,
      items: [
        { id: 'age_1', title: 'تسجيل وكيل جديد', description: 'إضافة وكيل لإدارة المعاملات', icon: <UserPlus size={20} />, type: 'FORM' },
        { id: 'age_2', title: 'تجديد وكالة', description: 'تحديث بيانات الوكالة القائمة', icon: <RefreshCw size={20} />, type: 'FORM' },
      ]
    },
    BENEFICIARY: {
      title: 'خدمات المستحقين',
      icon: <Users2 size={20} />,
      items: [
        { id: 'ben_1', title: 'استعلام عن نصيب الورثة', description: 'توزيع المعاش بين المستحقين', icon: <LayoutDashboard size={20} />, type: 'INQUIRY' },
        { id: 'ben_2', title: 'طلب شهادة استحقاق معاش', description: 'إثبات استلام معاش للمستفيد', icon: <FileText size={20} />, type: 'FORM' },
      ]
    },
    GUARDIAN: {
      title: 'خدمات القيّم',
      icon: <ShieldAlert size={20} />,
      items: [
        { id: 'gua_1', title: 'إثبات حالة القيّم', description: 'تقديم مستندات القوامة القانونية', icon: <FileText size={20} />, type: 'FORM' },
      ]
    },
    EMPLOYER: {
      title: 'خدمات جهة العمل',
      icon: <Briefcase size={20} />,
      items: [
        { id: 'emp_1', title: 'رفع كشوفات الاشتراكات', description: 'تحميل ملفات الاشتراكات الشهرية', icon: <Upload size={20} />, type: 'FORM' },
        { id: 'emp_2', title: 'استعلام عن مديونية الجهة', description: 'معرفة المبالغ المستحقة', icon: <Activity size={20} />, type: 'INQUIRY' },
      ]
    },
    INSURED: {
      title: 'خدمات المؤمن عليه',
      icon: <ShieldCheck size={20} />,
      items: [
        { id: 'ins_1', title: 'تحديث بيانات المؤمن عليه', description: 'تحديث البيانات الشخصية والوظيفية', icon: <User size={20} />, type: 'FORM' },
        { id: 'ins_2', title: 'استعلام عن مدة الخدمة', description: 'معرفة سنوات الخدمة المسجلة', icon: <Clock size={20} />, type: 'INQUIRY' },
      ]
    },
    TRUSTEE: {
      title: 'خدمات الوصي',
      icon: <UserCheck size={20} />,
      items: [
        { id: 'tru_1', title: 'تسجيل وصي شرعي', description: 'إضافة بيانات الوصي القانوني', icon: <UserPlus size={20} />, type: 'FORM' },
      ]
    },
    PENSIONER: {
      title: 'خدمات المتقاعدين',
      icon: <User size={20} />,
      items: [
        { id: 'pen_1', title: 'استعلام عن حالة المعاش', description: 'متابعة حالة صرف المعاش الشهري', icon: <CreditCard size={20} />, type: 'INQUIRY' },
        { id: 'pen_3', title: 'تقديم إقرار حياة سنوي', description: 'تحديث الحالة السنوية للمتقاعد', icon: <CheckCircle2 size={20} />, type: 'FORM' },
      ]
    },
    MILITARY: {
      title: 'خدمات العسكريين',
      icon: <Medal size={20} />,
      items: [
        { id: 'mil_1', title: 'استعلام عن المعاش العسكري', description: 'تفاصيل المعاش لمنتسبي القوات المسلحة', icon: <Shield size={20} />, type: 'INQUIRY' },
        { id: 'mil_2', title: 'طلب شهادة خدمة عسكرية', description: 'إصدار بيان خدمة عسكرية', icon: <FileText size={20} />, type: 'FORM' },
      ]
    },
    VISITOR: {
      title: 'خدمات الزوار',
      icon: <HelpCircle size={20} />,
      items: [
        { id: 'vis_1', title: 'حاسبة المعاش التقديرية', description: 'حساب المعاش المتوقع عند التقاعد', icon: <Calculator size={20} />, type: 'CALCULATOR' },
        { id: 'vis_4', title: 'الجريدة الرسمية', description: 'الاطلاع على أحدث القوانين والقرارات', icon: <Scale size={20} />, type: 'INQUIRY' },
      ]
    },
    SOCIAL_INSURANCE: {
      title: 'خدمات التأمين الاجتماعي',
      icon: <Activity size={20} />,
      items: [
        { id: 'soc_1', title: 'استعلام عن حصص الاشتراكات', description: 'معرفة المبالغ المستقطعة والموردة', icon: <Calculator size={20} />, type: 'INQUIRY' },
      ]
    }
  };

  const navigateToCategory = (cat: ServiceCategory) => {
    setSelectedCategory(cat);
    navigate('SERVICE_CATEGORY_DETAIL');
  };

  const navigateToService = (service: ServiceItem) => {
    setSelectedService(service);
    if (service.id === 'vis_4') {
      navigate('GAZETTES');
    } else if (service.type === 'DOWNLOAD') {
      // Simulate download
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert('تم بدء تحميل الملف بنجاح');
      }, 1000);
    } else {
      navigate('SERVICE_FORM');
    }
  };

  // Navigation Helper
  const navigate = (to: Screen) => {
    setIsLoading(true);
    setTimeout(() => {
      setScreen(to);
      setIsLoading(false);
    }, 500);
  };

  // Layout Wrappers
  const PageWrapper = ({ children, title, showBack = true, showNav = true }: { children: React.ReactNode; title: string; showBack?: boolean; showNav?: boolean }) => (
    <div className={cn(
      "min-h-screen flex flex-col max-w-md mx-auto relative overflow-hidden transition-colors duration-300",
      isDarkMode ? "bg-gray-900 text-white" : "bg-gov-bg text-gov-text-primary"
    )}>
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <RefreshCw className="text-gov-green animate-spin mb-2" size={40} />
            <p className="text-gov-green font-bold">جاري التحميل...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-gov-green text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => window.history.back()} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <ChevronRight size={24} />
            </button>
          )}
          <h1 className="text-lg font-bold truncate max-w-[200px]">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <>
              <Bell size={20} className="cursor-pointer hover:scale-110 transition-transform" />
              <div 
                onClick={() => navigate('PROFILE')}
                className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/30 cursor-pointer hover:border-white transition-all"
              >
                <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
              </div>
            </>
          )}
          {!isLoggedIn && (
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
               <img src="https://picsum.photos/seed/yemen/100/100" alt="Logo" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </header>

      {/* News Ticker */}
      <NewsTicker />

      {/* Content */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Nav */}
      {showNav && isLoggedIn && (
        <nav className={cn(
          "fixed bottom-0 left-0 right-0 max-w-md mx-auto flex justify-around p-2 z-50 backdrop-blur-xl border-t transition-all duration-300",
          isDarkMode ? "bg-gray-900/90 border-gray-800" : "bg-white/90 border-gray-200"
        )}>
          <button onClick={() => navigate('DASHBOARD')} className={cn('flex flex-col items-center p-2 gap-1 transition-colors relative', screen === 'DASHBOARD' ? 'text-gov-green' : 'text-gov-text-secondary')}>
            {screen === 'DASHBOARD' && <motion.div layoutId="nav-indicator" className="absolute -top-2 w-8 h-1 bg-gov-green rounded-b-full" />}
            <LayoutDashboard size={22} />
            <span className="text-[10px] font-bold">الرئيسية</span>
          </button>
          <button onClick={() => navigate('REQUESTS')} className={cn('flex flex-col items-center p-2 gap-1 transition-colors relative', screen === 'REQUESTS' ? 'text-gov-green' : 'text-gov-text-secondary')}>
            {screen === 'REQUESTS' && <motion.div layoutId="nav-indicator" className="absolute -top-2 w-8 h-1 bg-gov-green rounded-b-full" />}
            <FileText size={22} />
            <span className="text-[10px] font-bold">الطلبات</span>
          </button>
          <button onClick={() => navigate('SERVICES')} className={cn('flex flex-col items-center p-2 gap-1 transition-colors relative', screen === 'SERVICES' ? 'text-gov-green' : 'text-gov-text-secondary')}>
            {screen === 'SERVICES' && <motion.div layoutId="nav-indicator" className="absolute -top-2 w-8 h-1 bg-gov-green rounded-b-full" />}
            <Menu size={22} />
            <span className="text-[10px] font-bold">الخدمات</span>
          </button>
          <button onClick={() => navigate('MAIN_MENU')} className={cn('flex flex-col items-center p-2 gap-1 transition-colors relative', screen === 'MAIN_MENU' ? 'text-gov-green' : 'text-gov-text-secondary')}>
            {screen === 'MAIN_MENU' && <motion.div layoutId="nav-indicator" className="absolute -top-2 w-8 h-1 bg-gov-green rounded-b-full" />}
            <LayoutDashboard size={22} />
            <span className="text-[10px] font-bold">القائمة</span>
          </button>
          <button onClick={() => navigate('PROFILE')} className={cn('flex flex-col items-center p-2 gap-1 transition-colors relative', screen === 'PROFILE' ? 'text-gov-green' : 'text-gov-text-secondary')}>
            {screen === 'PROFILE' && <motion.div layoutId="nav-indicator" className="absolute -top-2 w-8 h-1 bg-gov-green rounded-b-full" />}
            <User size={22} />
            <span className="text-[10px] font-bold">حسابي</span>
          </button>
        </nav>
      )}
    </div>
  );

  // --- Screen Components ---

  const AboutScreen = () => (
    <PageWrapper title="عن الهيئة" showNav={isLoggedIn}>
      <div className="space-y-4 pb-6">
        {/* Vision */}
        <Card className="border-r-4 border-r-blue-500">
          <h2 className="text-blue-600 font-bold mb-2 flex items-center gap-2">
            <Activity size={18} /> الرؤية
          </h2>
          <p className="text-sm text-gov-text-secondary leading-relaxed">
            الريادة والتميز في تقديم الخدمات التأمينية والمعاشات، وبناء نظام حماية اجتماعية مستدام يضمن العيش الكريم لجميع المتقاعدين والمستفيدين في محافظة تعز وفق أرقى المعايير.
          </p>
        </Card>

        {/* Mission */}
        <Card className="border-r-4 border-r-gov-green">
          <h2 className="text-gov-green font-bold mb-2 flex items-center gap-2">
            <Info size={18} /> الرسالة
          </h2>
          <p className="text-sm text-gov-text-secondary leading-relaxed">
            العمل بكفاءة عالية لتأمين الحقوق التأمينية وصرف المعاشات لمستحقيها، من خلال تبني التحول الرقمي وتطوير الكوادر البشرية، بما يحقق رضا المتعاملين ويعزز الثقة بين الهيئة والمجتمع.
          </p>
        </Card>

        {/* Values */}
        <Card className="border-r-4 border-r-orange-500">
          <h2 className="text-orange-600 font-bold mb-2 flex items-center gap-2">
            <Heart size={18} /> القيم الجوهرية
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { title: 'الشفافية', icon: '👁️' },
              { title: 'العدالة', icon: '⚖️' },
              { title: 'الأمانة', icon: '🛡️' },
              { title: 'التميز', icon: '⭐' },
              { title: 'المسؤولية', icon: '🤝' },
              { title: 'الابتكار', icon: '💡' },
            ].map((val, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-xs font-bold">
                <span>{val.icon}</span>
                <span>{val.title}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Strategic Goals */}
        <Card className="border-r-4 border-r-purple-500">
          <h2 className="text-purple-600 font-bold mb-2 flex items-center gap-2">
            <Target size={18} /> أهدافنا الإستراتيجية
          </h2>
          <ul className="space-y-3">
            {[
              'أتمتة كافة الخدمات والعمليات الإدارية والمالية للتحول الكامل نحو الحكومة الإلكترونية.',
              'توسيع المظلة التأمينية لتشمل كافة العاملين في القطاعين العام والخاص والمختلط.',
              'تنمية الاستثمارات المالية للهيئة لضمان الاستدامة المالية والوفاء بالالتزامات المستقبلية.',
              'رفع كفاءة الأداء المؤسسي من خلال التدريب المستمر وتطبيق معايير الجودة الشاملة.',
              'تعزيز قنوات التواصل مع المتقاعدين والمستفيدين وتقديم خدمات استباقية تلبي احتياجاتهم.',
            ].map((goal, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gov-text-secondary">
                <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="leading-relaxed">{goal}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Button variant="outline" className="w-full border-gov-green text-gov-green">
          <Download size={18} /> تحميل ميثاق الشرف المهني (PDF)
        </Button>
      </div>
    </PageWrapper>
  );

  const ServicesScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    
    const allServices = Object.values(servicesData).flatMap(cat => cat.items);
    const filteredServices = searchQuery 
      ? allServices.filter(s => 
          s.title.includes(searchQuery) || 
          s.description.includes(searchQuery)
        )
      : [];

    return (
      <PageWrapper title="الخدمات الإلكترونية" showNav={isLoggedIn}>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="ابحث عن خدمة (مثال: شهادة، معاش...)" 
              className={cn(
                "w-full pl-4 pr-10 py-3 rounded-xl border focus:border-gov-green focus:ring-1 focus:ring-gov-green outline-none transition-all",
                isDarkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-white border-gray-200 text-gray-900"
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchQuery ? (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gov-text-secondary mb-2">نتائج البحث ({filteredServices.length})</h3>
              {filteredServices.length > 0 ? (
                filteredServices.map(item => (
                  <ServiceCard 
                    key={item.id} 
                    item={item} 
                    onClick={() => navigateToService(item)} 
                    isDarkMode={isDarkMode} 
                  />
                ))
              ) : (
                <div className="text-center py-10">
                  <Search size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gov-text-secondary">لم يتم العثور على خدمات مطابقة لبحثك</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(servicesData) as ServiceCategory[]).map((catKey) => {
                const cat = servicesData[catKey];
                return (
                  <Card 
                    key={catKey} 
                    className={cn(
                      "flex flex-col items-center text-center gap-2 cursor-pointer hover:shadow-md transition-all p-4 border-2", 
                      isDarkMode ? "bg-gray-800 border-gray-700 hover:bg-gray-700" : "bg-white border-gray-100"
                    )} 
                    onClick={() => navigateToCategory(catKey)}
                  >
                    <div className={cn('p-4 rounded-full mb-1 bg-gov-bg text-gov-green')}>
                      {cat.icon}
                    </div>
                    <h3 className={cn("font-bold text-sm", isDarkMode ? "text-white" : "text-gov-text-primary")}>{cat.title}</h3>
                    <p className="text-[10px] text-gov-text-secondary leading-tight">
                      {cat.items.length} خدمات متاحة
                    </p>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </PageWrapper>
    );
  };

  const ServiceCategoryDetailScreen = () => {
    if (!selectedCategory) return null;
    const data = servicesData[selectedCategory];

    return (
      <PageWrapper title={data.title}>
        <div className="space-y-3">
          {data.items.map((item) => (
            <ServiceCard 
              key={item.id} 
              item={item} 
              onClick={() => navigateToService(item)} 
              isDarkMode={isDarkMode} 
            />
          ))}
        </div>
      </PageWrapper>
    );
  };

  const ServiceFormScreen = () => {
    if (!selectedService) return null;
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState<any>({});

    const handleAction = async () => {
      setIsLoading(true);
      
      if (selectedService.id === 'vis_5' || selectedService.id === 'pen_1') {
        const isEmployee = selectedService.id === 'vis_5';
        const endpoint = isEmployee ? '/api/verify-employee' : '/api/verify-pension';
        const fallback = isEmployee ? MOCK_EMPLOYEE_DATA : MOCK_PENSION_DATA;
        
        const result = await apiFetch<any>(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            idNumber: formData.idNumber, 
            insuranceNumber: formData.insuranceNumber || formData.pensionId
          })
        }, fallback);

        setIsLoading(false);
        
        if (result.success) {
          if (selectedService.id === 'pen_1') {
            setInquiryData({
              title: 'تفاصيل المعاش التقاعدي',
              result: `مبلغ المعاش: ${result.data.pensionAmount}\nحالة الصرف: ${result.data.paymentStatus}\nتاريخ آخر صرف: ${result.data.lastPaymentDate}\nتاريخ الصرف القادم: ${result.data.nextPaymentDate}\nجهة الصرف: ${result.data.bankName}\nرقم الحساب: ${result.data.accountNumber}`,
              date: new Date().toLocaleDateString('ar-YE'),
              ref: 'PEN-' + Math.floor(100000 + Math.random() * 900000)
            });
          } else {
            setInquiryData({
              title: 'نتيجة التحقق الفوري',
              result: `الاسم: ${result.data.name}\nالحالة: ${result.data.status}\nجهة العمل: ${result.data.employer}\nمدة الخدمة: ${result.data.yearsOfService} سنة`,
              date: new Date().toLocaleDateString('ar-YE'),
              ref: 'VER-' + Math.floor(100000 + Math.random() * 900000)
            });
          }
          navigate('INQUIRY_RESULT');
        } else {
          alert(result.message || 'فشل التحقق من البيانات');
        }
        return;
      }

      setTimeout(() => {
        setIsLoading(false);
        if (selectedService.type === 'INQUIRY') {
          setInquiryData({
            title: selectedService.title,
            result: 'تم العثور على البيانات المطلوبة بنجاح. الحالة الحالية: نشط ومستحق.',
            date: new Date().toLocaleDateString('ar-YE'),
            ref: 'INQ-' + Math.floor(100000 + Math.random() * 900000)
          });
          navigate('INQUIRY_RESULT');
        } else if (selectedService.type === 'CALCULATOR') {
          const salary = parseFloat(formData.salary || '0');
          const years = parseFloat(formData.years || '0');
          const result = (salary * years * 0.025).toFixed(2);
          setInquiryData({
            title: 'نتائج حاسبة المعاش التقديرية',
            result: `بناءً على الراتب (${salary} ر.ي) ومدة الخدمة (${years} سنة)، فإن المعاش التقديري المتوقع هو: ${result} ر.ي شهرياً.`,
            date: new Date().toLocaleDateString('ar-YE'),
            ref: 'CALC-' + Math.floor(100000 + Math.random() * 900000)
          });
          navigate('INQUIRY_RESULT');
        } else {
          setIsSubmitted(true);
        }
      }, 1500);
    };

    const handleSaveDraft = () => {
      setIsLoading(true);
      setTimeout(() => {
        const newDraft: Draft = {
          id: 'DFT-' + Date.now(),
          serviceId: selectedService.id,
          serviceTitle: selectedService.title,
          data: formData,
          updatedAt: new Date().toLocaleString('ar-YE')
        };
        setDrafts([...drafts, newDraft]);
        setIsLoading(false);
        alert('تم حفظ المسودة بنجاح');
        navigate('SERVICES');
      }, 1000);
    };

    if (isSubmitted) {
      return (
        <PageWrapper title="تم الإرسال">
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={48} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">تم استلام طلبك</h2>
              <p className="text-gov-text-secondary text-sm">تم إرسال {selectedService.title} بنجاح.</p>
            </div>
            <Button className="w-full mt-8" onClick={() => navigate('SERVICES')}>العودة للخدمات</Button>
          </div>
        </PageWrapper>
      );
    }

    const renderDynamicFields = () => {
      switch (selectedService.id) {
        // --- INSURED SERVICES ---
        case 'ins_1': // Update Data
          return (
            <>
              <Input label="رقم الهاتف الجديد" placeholder="7XX XXX XXX" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              <Input label="العنوان الحالي" placeholder="المحافظة - المديرية - الشارع" onChange={(e) => setFormData({...formData, address: e.target.value})} />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">الحالة الاجتماعية</label>
                <select className="px-4 py-2 rounded-gov border border-gray-300 bg-white focus:outline-none focus:border-gov-green">
                  <option>أعزب</option>
                  <option>متزوج</option>
                  <option>مطلق</option>
                  <option>أرمل</option>
                </select>
              </div>
            </>
          );
        case 'ins_2': // Service Duration Inquiry
          return (
            <>
              <Input label="الرقم التأميني" defaultValue={user.insuranceNumber} readOnly className="bg-gray-50" />
              <Input label="رقم البطاقة الشخصية" placeholder="أدخل الرقم الوطني" onChange={(e) => setFormData({...formData, idNumber: e.target.value})} />
            </>
          );
        case 'ins_3': // Service Certificate
          return (
            <>
              <Input label="الجهة الموجه إليها الشهادة" placeholder="اسم الجهة الطالبة للشهادة" onChange={(e) => setFormData({...formData, entity: e.target.value})} />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">الغرض من الشهادة</label>
                <textarea className="px-4 py-2 rounded-gov border border-gray-300 bg-white min-h-[80px]" placeholder="اكتب الغرض هنا..." />
              </div>
            </>
          );
        case 'ins_4': // Subscriptions Inquiry
          return (
            <>
              <Input label="الرقم التأميني" defaultValue={user.insuranceNumber} readOnly className="bg-gray-50" />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">سنة الاستعلام</label>
                <select className="px-4 py-2 rounded-gov border border-gray-300 bg-white focus:outline-none focus:border-gov-green">
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                  <option>جميع السنوات</option>
                </select>
              </div>
            </>
          );

        // --- PENSIONER SERVICES ---
        case 'pen_1': // Pension Status Inquiry
          return (
            <>
              <Input label="رقم المعاش / الرقم التأميني" placeholder="أدخل رقم المعاش" onChange={(e) => setFormData({...formData, pensionId: e.target.value})} />
              <Input label="رقم البطاقة الشخصية" placeholder="أدخل الرقم الوطني" onChange={(e) => setFormData({...formData, idNumber: e.target.value})} />
              <Input label="شهر الاستعلام" type="month" onChange={(e) => setFormData({...formData, month: e.target.value})} />
            </>
          );
        case 'pen_2': // Update Bank Account
          return (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">اسم البنك / جهة الصرف</label>
                <select className="px-4 py-2 rounded-gov border border-gray-300 bg-white focus:outline-none focus:border-gov-green">
                  <option>بنك الكريمي</option>
                  <option>البريد اليمني</option>
                  <option>بنك التضامن</option>
                  <option>بنك اليمن والكويت</option>
                </select>
              </div>
              <Input label="رقم الحساب الجديد" placeholder="أدخل رقم الحساب المكون من 12-16 رقم" onChange={(e) => setFormData({...formData, accNumber: e.target.value})} />
              <div className="space-y-2 mt-2">
                <label className="text-sm font-semibold">مرفق إثبات الحساب (بطاقة البنك أو إفادة)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-gov p-4 text-center bg-gray-50 cursor-pointer">
                  <Upload size={20} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-[10px] text-gov-text-secondary">اضغط لرفع الملف</p>
                </div>
              </div>
            </>
          );
        case 'pen_3': // Annual Life Declaration
          return (
            <>
              <Card className="bg-orange-50 border-orange-200 mb-4">
                <p className="text-xs text-orange-800 leading-relaxed">
                  إقرار الحياة السنوي إلزامي لاستمرار صرف المعاش. يرجى إرفاق صورة حديثة لك مع بطاقة الهوية.
                </p>
              </Card>
              <Input label="رقم الهاتف الحالي" defaultValue={user.phone} />
              <div className="space-y-2">
                <label className="text-sm font-semibold">التقاط / رفع صورة حديثة مع الهوية</label>
                <div className="border-2 border-dashed border-gov-green/50 rounded-gov p-6 text-center bg-green-50 cursor-pointer hover:bg-green-100 transition-colors">
                  <User size={32} className="mx-auto text-gov-green mb-2" />
                  <p className="text-xs font-bold text-gov-green">اضغط لفتح الكاميرا أو رفع صورة</p>
                </div>
              </div>
              <div className="flex items-start gap-2 mt-4">
                <input type="checkbox" id="declare" className="mt-1" />
                <label htmlFor="declare" className="text-xs text-gov-text-primary leading-relaxed">
                  أقر أنا المذكور أعلاه بصحة البيانات المرفقة وبأنني على قيد الحياة حتى تاريخ تقديم هذا الإقرار، وأتحمل المسؤولية القانونية في حال ثبوت عكس ذلك.
                </label>
              </div>
            </>
          );

        // --- BENEFICIARY SERVICES ---
        case 'ben_1': // Heirs Share Inquiry
          return (
            <>
              <Input label="الرقم التأميني للمورث (المتوفي)" placeholder="أدخل رقم المورث" />
              <Input label="رقم هوية المستعلم" placeholder="أدخل رقم هويتك" />
            </>
          );

        // --- GOV AGENCY SERVICES ---
        case 'gov_1': // Upload Subscriptions
          return (
            <>
              <Input label="رقم جهة العمل" placeholder="أدخل رقم الجهة" />
              <Input label="عن شهر" type="month" />
              <div className="space-y-2 mt-2">
                <label className="text-sm font-semibold">ملف الكشوفات (Excel / CSV)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-gov p-6 text-center bg-gray-50 cursor-pointer">
                  <Upload size={24} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-[10px] text-gov-text-secondary">اسحب ملف الإكسل هنا</p>
                </div>
              </div>
            </>
          );
        case 'gov_2': // Agency Debt Inquiry
          return (
            <>
              <Input label="رقم جهة العمل" placeholder="أدخل رقم الجهة" />
              <Input label="كلمة المرور الخاصة بالجهة" type="password" placeholder="***" />
            </>
          );
        case 'vis_5': // Employee Verification
          return (
            <>
              <Card className="bg-blue-50 border-blue-200 mb-4">
                <p className="text-xs text-blue-800 leading-relaxed">
                  هذه الخدمة تتيح لك التحقق الفوري من البيانات التأمينية لموظف معين عبر الربط المباشر مع قاعدة بيانات الهيئة.
                </p>
              </Card>
              <Input label="رقم الهوية الوطنية" placeholder="أدخل الرقم الوطني (9 أرقام)" onChange={(e) => setFormData({...formData, idNumber: e.target.value})} />
              <Input label="الرقم التأميني" placeholder="أدخل الرقم التأميني" onChange={(e) => setFormData({...formData, insuranceNumber: e.target.value})} />
            </>
          );

        // --- DEFAULT FALLBACKS ---
        default:
          if (selectedService.type === 'FORM') {
            return (
              <>
                <Input label="الرقم التأميني / الهوية" defaultValue={user.insuranceNumber} />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">تفاصيل الطلب</label>
                  <textarea className="px-4 py-2 rounded-gov border border-gray-300 bg-white min-h-[100px]" placeholder="اكتب التفاصيل..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">المرفقات (إن وجدت)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-gov p-4 text-center bg-gray-50 cursor-pointer">
                    <Upload size={20} className="mx-auto text-gray-400 mb-1" />
                    <p className="text-[10px] text-gov-text-secondary">اضغط للرفع</p>
                  </div>
                </div>
              </>
            );
          } else if (selectedService.type === 'INQUIRY') {
            return (
              <>
                <Input label="رقم الهوية / الرقم التأميني" placeholder="أدخل الرقم المراد الاستعلام عنه" />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">فترة الاستعلام</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" placeholder="من" />
                    <Input type="date" placeholder="إلى" />
                  </div>
                </div>
              </>
            );
          } else if (selectedService.type === 'CALCULATOR') {
            return (
              <>
                <Input label="آخر راتب أساسي (ر.ي)" type="number" placeholder="أدخل الراتب" onChange={(e) => setFormData({...formData, salary: e.target.value})} />
                <Input label="إجمالي سنوات الخدمة" type="number" placeholder="أدخل عدد السنوات" onChange={(e) => setFormData({...formData, years: e.target.value})} />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">سبب التقاعد</label>
                  <select className="px-4 py-2 rounded-gov border border-gray-300 bg-white focus:outline-none focus:border-gov-green">
                    <option>بلوغ السن القانوني</option>
                    <option>العجز الصحي</option>
                    <option>الوفاة</option>
                    <option>التقاعد المبكر</option>
                  </select>
                </div>
              </>
            );
          }
          return null;
      }
    };

    return (
      <PageWrapper title={selectedService.title}>
        <div className="space-y-5">
          <Card className={cn("bg-gov-bg border-none", isDarkMode && "bg-gray-800")}>
            <p className="text-xs text-gov-text-secondary leading-relaxed">
              {selectedService.description}. يرجى تعبئة الحقول المطلوبة بدقة.
            </p>
          </Card>

          <div className="space-y-4">
            {renderDynamicFields()}
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button className="w-full" onClick={handleAction}>
              {selectedService.type === 'FORM' ? 'إرسال الطلب' : selectedService.type === 'CALCULATOR' ? 'حساب المعاش' : 'بدء الاستعلام'}
            </Button>
            {selectedService.type === 'FORM' && (
              <Button variant="outline" className="w-full" onClick={handleSaveDraft}>
                حفظ كمسودة
              </Button>
            )}
            <Button variant="ghost" className="w-full" onClick={() => window.history.back()}>إلغاء</Button>
          </div>
        </div>
      </PageWrapper>
    );
  };

  const DraftsScreen = () => (
    <PageWrapper title="المسودات المحفوظة">
      <div className="space-y-4">
        {drafts.length === 0 ? (
          <div className="text-center py-20">
            <Edit2 size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gov-text-secondary">لا توجد مسودات محفوظة حالياً</p>
          </div>
        ) : (
          drafts.map((draft) => (
            <Card key={draft.id} className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm">{draft.serviceTitle}</h3>
                <span className="text-[10px] text-gov-text-secondary">{draft.updatedAt}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-xs py-1.5" onClick={() => {
                  const service = Object.values(servicesData).flatMap(cat => cat.items).find(i => i.id === draft.serviceId);
                  if (service) {
                    setSelectedService(service);
                    navigate('SERVICE_FORM');
                  }
                }}>إكمال التعديل</Button>
                <Button variant="ghost" className="text-xs py-1.5 text-gov-error" onClick={() => setDrafts(drafts.filter(d => d.id !== draft.id))}>حذف</Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </PageWrapper>
  );

  const DocumentsScreen = () => (
    <PageWrapper title="وثائقي والمرفقات">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-sm">الملفات المرفوعة</h3>
          <Button variant="outline" className="text-xs py-1 px-3">
            <Plus size={14} /> رفع جديد
          </Button>
        </div>
        
        <div className="space-y-3">
          {userDocuments.map((doc) => (
            <Card key={doc.id} className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-lg",
                doc.type === 'PDF' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
              )}>
                <FileText size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold truncate max-w-[150px]">{doc.name}</h4>
                <p className="text-[10px] text-gov-text-secondary">{doc.size} • {doc.date}</p>
              </div>
              <div className="flex gap-1">
                <button className="p-2 text-gov-text-secondary hover:text-gov-green"><Download size={18} /></button>
                <button className="p-2 text-gov-text-secondary hover:text-gov-error" onClick={() => setUserDocuments(userDocuments.filter(d => d.id !== doc.id))}><XCircle size={18} /></button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageWrapper>
  );

  const InquiryResultScreen = () => {
    if (!inquiryData) return null;

    return (
      <PageWrapper title="نتائج الاستعلام">
        <div className="space-y-4">
          <Card className="border-gov-green bg-green-50/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gov-green text-white rounded-full">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="font-bold text-gov-green">{inquiryData.title}</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-white rounded border border-gray-100">
                <p className="text-sm leading-relaxed text-gov-text-primary">
                  {inquiryData.result}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-[10px] text-gov-text-secondary">
                <div>
                  <p>رقم المرجع</p>
                  <p className="font-bold text-gov-text-primary">{inquiryData.ref}</p>
                </div>
                <div className="text-left">
                  <p>تاريخ الاستعلام</p>
                  <p className="font-bold text-gov-text-primary">{inquiryData.date}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => window.print()}>
              <Printer size={18} /> طباعة النتيجة
            </Button>
            <Button className="flex-1" onClick={() => navigate('SERVICES')}>العودة للخدمات</Button>
          </div>
        </div>
      </PageWrapper>
    );
  };

  const ComplaintScreen = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    if (isSubmitted) {
      return (
        <PageWrapper title="تم الإرسال">
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={48} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">تم استلام شكواك</h2>
              <p className="text-gov-text-secondary text-sm">سيتم مراجعة الشكوى والرد عليك في أقرب وقت.</p>
            </div>
            <Button className="w-full mt-8" onClick={() => navigate('DASHBOARD')}>العودة للرئيسية</Button>
          </div>
        </PageWrapper>
      );
    }

    return (
      <PageWrapper title="تقديم شكوى / مقترح">
        <div className="space-y-4">
          <Card className="bg-red-50 border-red-100">
            <p className="text-xs text-red-800 leading-relaxed">
              نحن نهتم بملاحظاتكم. يرجى كتابة تفاصيل الشكوى أو المقترح بوضوح ليتمكن الفريق المختص من معالجتها.
            </p>
          </Card>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">نوع الرسالة</label>
            <select className="px-4 py-2 rounded-gov border border-gray-300 bg-white focus:outline-none focus:border-gov-green">
              <option>شكوى ضد خدمة</option>
              <option>شكوى ضد موظف</option>
              <option>مقترح تطوير</option>
              <option>أخرى</option>
            </select>
          </div>
          <Input label="عنوان الشكوى / المقترح" placeholder="اكتب عنواناً مختصراً" />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">التفاصيل</label>
            <textarea className="px-4 py-2 rounded-gov border border-gray-300 bg-white min-h-[120px]" placeholder="اكتب كافة التفاصيل هنا..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">المرفقات (اختياري)</label>
            <div className="border-2 border-dashed border-gray-200 rounded-gov p-4 text-center bg-gray-50 cursor-pointer">
              <Upload size={20} className="mx-auto text-gray-400 mb-1" />
              <p className="text-[10px] text-gov-text-secondary">اضغط لرفع صور أو مستندات داعمة</p>
            </div>
          </div>
          <Button className="w-full mt-4" onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              setIsSubmitted(true);
            }, 1500);
          }}>إرسال الشكوى</Button>
        </div>
      </PageWrapper>
    );
  };

  const FAQScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('الكل');

    const categories = ['الكل', 'عام', 'المتقاعدين', 'المؤمن عليهم', 'المستفيدين'];

    const faqs = [
      { category: 'المتقاعدين', q: 'كيف يمكنني تحديث بياناتي البنكية؟', a: 'يمكنك ذلك من خلال قسم الخدمات > خدمات المتقاعدين > تحديث بيانات الحساب البنكي، مع إرفاق صورة من بطاقة البنك.' },
      { category: 'عام', q: 'متى يتم صرف المعاش التقاعدي؟', a: 'يتم صرف المعاش التقاعدي عادة في الأسبوع الأول من كل شهر ميلادي.' },
      { category: 'المتقاعدين', q: 'ما هي الأوراق المطلوبة لإقرار الحياة؟', a: 'تحتاج فقط إلى التقاط صورة حديثة لك مع بطاقة الهوية الوطنية من خلال التطبيق.' },
      { category: 'المستفيدين', q: 'كيف أستعلم عن نصيبي من معاش المورث؟', a: 'من خلال خدمات المستفيدين، أدخل الرقم التأميني للمورث ورقم هويتك لتظهر لك التفاصيل.' },
      { category: 'المؤمن عليهم', q: 'كيف يمكنني معرفة إجمالي مدة خدمتي؟', a: 'من خلال قسم خدمات المؤمن عليهم > استعلام عن مدة الخدمة، سيظهر لك إجمالي السنوات والشهور المسجلة.' },
      { category: 'عام', q: 'كيف يمكنني التواصل مع فرع تعز؟', a: 'يمكنك التواصل عبر أرقام الهواتف الموضحة في قسم "الجهات الحكومية" أو زيارة مقرنا في شارع جمال.' },
      { category: 'المؤمن عليهم', q: 'هل يمكنني ضم مدة خدمة سابقة؟', a: 'نعم، يمكنك تقديم طلب ضم خدمة من خلال قسم الطلبات، مع إرفاق الوثائق المؤيدة للمدة السابقة.' },
    ];

    const filteredFaqs = faqs.filter(faq => {
      const matchesSearch = faq.q.includes(searchQuery) || faq.a.includes(searchQuery);
      const matchesCategory = activeCategory === 'الكل' || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
    
    return (
      <PageWrapper title="الأسئلة الشائعة">
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="ابحث في الأسئلة..." 
              className={cn(
                "w-full pl-4 pr-10 py-2.5 rounded-xl border outline-none transition-all text-sm",
                isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200"
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                  activeCategory === cat 
                    ? "bg-gov-green text-white shadow-md" 
                    : (isDarkMode ? "bg-gray-800 text-gray-400 border border-gray-700" : "bg-white text-gov-text-secondary border border-gray-100")
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <Card key={idx} className="space-y-2 overflow-hidden border-r-4 border-r-gov-green">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-sm text-gov-text-primary flex items-start gap-2">
                      <HelpCircle size={18} className="shrink-0 mt-0.5 text-gov-green" />
                      {faq.q}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full shrink-0">
                      {faq.category}
                    </span>
                  </div>
                  <p className="text-xs text-gov-text-secondary leading-relaxed pr-6">
                    {faq.a}
                  </p>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <HelpCircle size={48} className="mx-auto text-gray-200 mb-2" />
                <p className="text-gov-text-secondary text-sm">لم يتم العثور على نتائج لبحثك</p>
              </div>
            )}
          </div>
        </div>
      </PageWrapper>
    );
  };

  const LawsScreen = () => {
    const [selectedLaw, setSelectedLaw] = useState<any>(null);

    const lawCategories = [
      {
        id: 'social_insurance',
        title: 'قانون التأمينات الاجتماعية',
        icon: <ShieldCheck size={20} />,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        items: [
          { 
            id: 'l1', 
            title: 'قانون التأمينات الاجتماعية رقم (26) لسنة 1991', 
            summary: 'ينظم هذا القانون حقوق وواجبات العاملين في القطاع الخاص والمختلط، ويحدد نسب الاشتراكات وشروط استحقاق المعاش التقاعدي وإصابات العمل.',
            date: '1991',
            size: '3.2 MB'
          }
        ]
      },
      {
        id: 'pension_law',
        title: 'قانون التأمينات والمعاشات',
        icon: <Gavel size={20} />,
        color: 'text-gov-green',
        bg: 'bg-green-50',
        items: [
          { 
            id: 'l2', 
            title: 'قانون التأمينات والمعاشات رقم (25) لسنة 1991', 
            summary: 'يختص هذا القانون بموظفي الجهاز الإداري للدولة والقطاع العام، ويحدد قواعد احتساب المعاش التقاعدي ومكافأة نهاية الخدمة.',
            date: '1991',
            size: '2.8 MB'
          }
        ]
      },
      {
        id: 'regulations',
        title: 'اللوائح التنفيذية',
        icon: <FileText size={20} />,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        items: [
          { 
            id: 'l3', 
            title: 'اللائحة التنفيذية لقانون التأمينات والمعاشات', 
            summary: 'توضح هذه اللائحة الإجراءات التفصيلية لتنفيذ مواد القانون، ونماذج الطلبات، والمدد الزمنية للمعاملات.',
            date: '1992',
            size: '1.5 MB'
          }
        ]
      },
      {
        id: 'decisions',
        title: 'القرارات',
        icon: <CheckCircle2 size={20} />,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        items: [
          { 
            id: 'l4', 
            title: 'قرار رئيس الهيئة بشأن تسوية المعاشات', 
            summary: 'قرار تنظيمي يحدد آليات تسوية المعاشات للحالات الاستثنائية وتعديل الحد الأدنى للمعاش.',
            date: '2023',
            size: '0.8 MB'
          }
        ]
      },
      {
        id: 'instructions',
        title: 'التعليمات',
        icon: <Info size={20} />,
        color: 'text-teal-600',
        bg: 'bg-teal-50',
        items: [
          { 
            id: 'l5', 
            title: 'تعليمات صرف المعاشات عبر البنوك', 
            summary: 'دليل إرشادي للمتقاعدين حول كيفية فتح الحسابات البنكية واستلام المعاشات إلكترونياً.',
            date: '2024',
            size: '0.5 MB'
          }
        ]
      },
      {
        id: 'international',
        title: 'الاتفاقيات الدولية ذات الصلة',
        icon: <Scale size={20} />,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        items: [
          { 
            id: 'l6', 
            title: 'اتفاقية منظمة العمل الدولية رقم (102)', 
            summary: 'تحدد المعايير الدنيا للضمان الاجتماعي، بما في ذلك الرعاية الطبية، ومعاشات الشيخوخة، وتعويضات البطالة.',
            date: '1952',
            size: '1.2 MB'
          }
        ]
      }
    ];

    return (
      <PageWrapper title="التشريعات والقوانين">
        <div className="space-y-6">
          {lawCategories.map((cat) => (
            <div key={cat.id} className="space-y-3">
              <h3 className={cn("text-sm font-bold flex items-center gap-2 px-1", cat.color)}>
                {cat.icon} {cat.title}
              </h3>
              <div className="space-y-2">
                {cat.items.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gov-text-primary leading-tight mb-1">{item.title}</h4>
                        <p className="text-[10px] text-gov-text-secondary">الإصدار: {item.date} • الحجم: {item.size}</p>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setSelectedLaw(selectedLaw?.id === item.id ? null : item)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            selectedLaw?.id === item.id ? "bg-gov-green text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          )}
                          title="ملخص مبسط"
                        >
                          <FileSearch size={18} />
                        </button>
                        <button className="p-2 bg-gov-bg text-gov-green rounded-lg hover:bg-green-100 transition-colors" title="تحميل">
                          <Download size={18} />
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedLaw?.id === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-2 mb-2 text-blue-700">
                              <BookOpen size={14} />
                              <span className="text-[10px] font-bold uppercase tracking-wider">ملخص مبسط</span>
                            </div>
                            <p className="text-xs text-blue-900 leading-relaxed">
                              {item.summary}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageWrapper>
    );
  };

  const FormsScreen = () => {
    const forms = [
      { id: 1, title: 'استمارة نهاية الخدمة (نموذج 1)', type: 'PDF' },
      { id: 2, title: 'استمارة طلب معاش شيخوخة', type: 'PDF' },
      { id: 3, title: 'نموذج إقرار حالة اجتماعية', type: 'DOCX' },
      { id: 4, title: 'استمارة حصر الورثة', type: 'PDF' },
    ];
    
    return (
      <PageWrapper title="الاستمارات والنماذج">
        <div className="space-y-3">
          {forms.map(form => (
            <Card key={form.id} className="flex items-center gap-4">
              <div className={cn("p-3 rounded-lg", form.type === 'PDF' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600")}>
                <FileBox size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold">{form.title}</h4>
                <p className="text-[10px] text-gov-text-secondary">صيغة الملف: {form.type}</p>
              </div>
              <button className="p-2 text-gov-green hover:bg-green-50 rounded-full transition-colors">
                <Download size={20} />
              </button>
            </Card>
          ))}
        </div>
      </PageWrapper>
    );
  };

  const PensionCalcScreen = () => {
    const [salary, setSalary] = useState('');
    const [years, setYears] = useState('');
    const [result, setResult] = useState<number | null>(null);

    const calculate = () => {
      const s = parseFloat(salary);
      const y = parseFloat(years);
      if (isNaN(s) || isNaN(y) || s <= 0 || y <= 0) return;
      
      // Standard formula: (Salary * Years * 2.5%)
      // Max pension is usually 100% of salary
      const pension = Math.min(s, s * y * 0.025);
      setResult(pension);
    };

    return (
      <PageWrapper title="حاسبة المعاش التقاعدي">
        <div className="space-y-4">
          <Card className="bg-orange-50 border-orange-100">
            <div className="flex gap-3">
              <Calculator className="text-orange-600 shrink-0" size={24} />
              <p className="text-xs text-orange-800 leading-relaxed">
                استخدم هذه الحاسبة لتقدير راتبك التقاعدي المتوقع بناءً على متوسط راتبك الأخير وإجمالي سنوات الخدمة.
              </p>
            </div>
          </Card>

          <div className="space-y-4">
            <Input 
              label="متوسط الراتب الأخير (ر.ي)" 
              type="number" 
              placeholder="أدخل الراتب" 
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
            <Input 
              label="إجمالي سنوات الخدمة" 
              type="number" 
              placeholder="مثال: 30" 
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
            <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={calculate}>
              احسب المعاش المتوقع
            </Button>
          </div>

          {result !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="border-orange-500 bg-white shadow-xl overflow-hidden">
                <div className="bg-orange-500 text-white p-3 text-center -mx-4 -mt-4 mb-4">
                  <h3 className="font-bold">النتيجة التقديرية</h3>
                </div>
                <div className="text-center py-4">
                  <p className="text-sm text-gov-text-secondary mb-1">المعاش الشهري المتوقع</p>
                  <p className="text-3xl font-black text-orange-600">{result.toLocaleString()} <span className="text-sm font-normal">ر.ي</span></p>
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gov-text-secondary">نسبة الاستحقاق</span>
                    <span className="font-bold">{((result / parseFloat(salary)) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gov-text-secondary">سنوات الخدمة</span>
                    <span className="font-bold">{years} سنة</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-4 text-center italic">
                  * هذه النتائج تقديرية وتخضع للقوانين واللوائح النافذة عند التقاعد الفعلي.
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </PageWrapper>
    );
  };

  const InsuranceCalcScreen = () => {
    const [salary, setSalary] = useState('');
    const [result, setResult] = useState<{emp: number, gov: number, total: number} | null>(null);

    const calculate = () => {
      const s = parseFloat(salary);
      if (isNaN(s) || s <= 0) return;
      // Assuming standard 6% employee, 9% employer = 15% total
      setResult({
        emp: s * 0.06,
        gov: s * 0.09,
        total: s * 0.15
      });
    };

    return (
      <PageWrapper title="حاسبة التأمين">
        <div className="space-y-4">
          <Card className="bg-indigo-50 border-indigo-100">
            <p className="text-xs text-indigo-800 leading-relaxed">
              تساعدك هذه الحاسبة في معرفة قيمة الاشتراكات التأمينية الشهرية المستقطعة من الراتب وحصة جهة العمل.
            </p>
          </Card>
          
          <Input 
            label="الراتب الأساسي (ر.ي)" 
            type="number" 
            placeholder="أدخل الراتب الأساسي" 
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          
          <Button className="w-full" onClick={calculate}>احسب الاشتراكات</Button>

          {result && (
            <Card className="border-gov-green mt-6 space-y-4">
              <h3 className="font-bold text-center text-gov-green border-b pb-2">تفاصيل الاشتراكات الشهرية</h3>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gov-text-secondary">حصة الموظف (6%)</span>
                <span className="font-bold">{result.emp.toFixed(2)} ر.ي</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gov-text-secondary">حصة جهة العمل (9%)</span>
                <span className="font-bold">{result.gov.toFixed(2)} ر.ي</span>
              </div>
              
              <div className="flex justify-between items-center text-sm pt-2 border-t border-dashed">
                <span className="font-bold text-gov-green">إجمالي الاشتراك (15%)</span>
                <span className="font-bold text-lg text-gov-green">{result.total.toFixed(2)} ر.ي</span>
              </div>
            </Card>
          )}
        </div>
      </PageWrapper>
    );
  };

  const ComplaintTrackingScreen = () => (
    <PageWrapper title="تتبع الشكاوى">
      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button className="px-4 py-1.5 bg-gov-green text-white rounded-full text-xs whitespace-nowrap">الكل</button>
          <button className="px-4 py-1.5 bg-white border border-gray-200 text-gov-text-secondary rounded-full text-xs whitespace-nowrap">قيد المعالجة</button>
          <button className="px-4 py-1.5 bg-white border border-gray-200 text-gov-text-secondary rounded-full text-xs whitespace-nowrap">تم الحل</button>
        </div>

        <div className="space-y-3">
          {complaints.map((cmp) => (
            <Card key={cmp.id} className="cursor-pointer hover:border-gov-green">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm">{cmp.title}</h3>
                <span className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full font-bold',
                  cmp.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                )}>
                  {cmp.status === 'RESOLVED' ? 'تم الحل' : 'قيد المعالجة'}
                </span>
              </div>
              <p className="text-xs text-gov-text-secondary line-clamp-2 mb-3 leading-relaxed">
                {cmp.details}
              </p>
              <div className="flex justify-between items-center text-[10px] text-gov-text-secondary pt-2 border-t border-gray-50">
                <span>رقم الشكوى: {cmp.id}</span>
                <span>التاريخ: {cmp.date}</span>
              </div>
            </Card>
          ))}
        </div>

        <Button className="w-full mt-4" onClick={() => navigate('COMPLAINT')}>
          <Plus size={18} /> تقديم شكوى جديدة
        </Button>
      </div>
    </PageWrapper>
  );

  const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleLogin = () => {
      if (!username || !password) {
        setLoginError('يرجى إدخال اسم المستخدم وكلمة المرور');
        return;
      }
      
      setIsLoading(true);
      setLoginError(null);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoggedIn(true);
        navigate('DASHBOARD');
        setIsLoading(false);
      }, 1500);
    };

    return (
      <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white p-6 justify-center">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gov-green/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <img src="https://picsum.photos/seed/yemen-logo/200/200" alt="Authority Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gov-green">الهيئة العامة للتأمينات والمعاشات</h1>
          <p className="text-gov-text-secondary">فرع تَعِز - الجمهورية اليمنية</p>
        </div>

        <div className="space-y-4">
          <Input 
            label="رقم الهوية / الرقم التأميني" 
            placeholder="أدخل الرقم هنا" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={loginError && !username ? loginError : undefined}
          />
          <Input 
            label="كلمة المرور" 
            type="password" 
            placeholder="********" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={loginError && !password ? loginError : undefined}
          />
          
          {loginError && username && password && (
            <p className="text-xs text-gov-error text-center">{loginError}</p>
          )}
          
          <div className="flex justify-between items-center text-sm">
            <button className="text-gov-link hover:underline">نسيت كلمة المرور؟</button>
          </div>

          <Button className="w-full py-3" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : (
              <>
                <LogIn size={20} /> تسجيل الدخول
              </>
            )}
          </Button>

          <div className="text-center pt-4">
            <p className="text-sm text-gov-text-secondary">
              ليس لديك حساب؟{' '}
              <button onClick={() => navigate('REGISTER')} className="text-gov-link font-bold hover:underline">إنشاء حساب جديد</button>
            </p>
          </div>
        </div>

        <div className="mt-auto pt-10 text-center">
          <button onClick={() => navigate('ABOUT')} className="text-gov-text-secondary text-sm flex items-center justify-center gap-1 mx-auto">
            <Info size={16} /> عن الهيئة
          </button>
        </div>
      </div>
    );
  };

  const RegisterScreen = () => (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white p-6">
      <div className="flex items-center gap-2 mb-8">
        <button onClick={() => navigate('LOGIN')} className="p-1"><ChevronRight size={24} /></button>
        <h1 className="text-xl font-bold text-gov-green">إنشاء حساب جديد</h1>
      </div>

      <div className="space-y-4 flex-1">
        <Input label="الاسم الكامل" placeholder="أدخل اسمك الرباعي" />
        <Input label="رقم الهوية / الرقم التأميني" placeholder="أدخل الرقم" />
        <Input label="البريد الإلكتروني" type="email" placeholder="example@mail.com" />
        <Input label="رقم الهاتف" placeholder="777XXXXXX" />
        <Input label="كلمة المرور" type="password" placeholder="********" />
        <Input label="تأكيد كلمة المرور" type="password" placeholder="********" />
        
        <div className="flex items-start gap-2 py-2">
          <input type="checkbox" className="mt-1" id="terms" />
          <label htmlFor="terms" className="text-xs text-gov-text-secondary leading-relaxed">
            أوافق على <span className="text-gov-link underline">شروط الاستخدام</span> و <span className="text-gov-link underline">سياسة الخصوصية</span> الخاصة بالهيئة.
          </label>
        </div>

        <Button className="w-full py-3" onClick={() => navigate('LOGIN')}>
          <UserPlus size={20} /> إنشاء الحساب
        </Button>
      </div>
    </div>
  );

  const DashboardScreen = () => (
    <PageWrapper title="لوحة التحكم" showBack={false}>
      <div className="space-y-6">
        {/* Welcome Card */}
        <div className="bg-gov-green text-white p-6 rounded-gov shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm opacity-80">مرحباً بك،</p>
            <h2 className="text-xl font-bold mb-4">{user.name}</h2>
            <div className="flex gap-4 text-xs">
              <div>
                <p className="opacity-70">الرقم التأميني</p>
                <p className="font-mono">{user.insuranceNumber}</p>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <p className="opacity-70">الحالة</p>
                <p className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full" /> {user.status}
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Track Request Widget */}
        <Card className="bg-white border-gov-green/20 shadow-sm">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-gov-green">
            <Search size={18} /> تتبع معاملة / طلب
          </h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="أدخل رقم الطلب (مثال: REQ-001)" 
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-gov-green focus:ring-1 focus:ring-gov-green outline-none"
            />
            <Button className="py-2 px-4 text-sm" onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                alert('حالة الطلب: قيد المراجعة من قبل الإدارة المختصة.');
              }, 1000);
            }}>تتبع</Button>
          </div>
        </Card>

        {/* Quick Services Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="flex flex-col items-center justify-center gap-2 py-6 cursor-pointer hover:border-gov-green" onClick={() => navigate('BASIC_DATA')}>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full"><User size={24} /></div>
            <span className="text-sm font-bold">بياناتي</span>
          </Card>
          <Card className="flex flex-col items-center justify-center gap-2 py-6 cursor-pointer hover:border-gov-green" onClick={() => navigate('REQUESTS')}>
            <div className="p-3 bg-green-50 text-green-600 rounded-full"><FileText size={24} /></div>
            <span className="text-sm font-bold">طلباتي</span>
          </Card>
          <Card className="flex flex-col items-center justify-center gap-2 py-6 cursor-pointer hover:border-gov-green" onClick={() => navigate('DRAFTS')}>
            <div className="p-3 bg-orange-50 text-orange-600 rounded-full"><Edit2 size={24} /></div>
            <span className="text-sm font-bold">المسودات</span>
          </Card>
          <Card className="flex flex-col items-center justify-center gap-2 py-6 cursor-pointer hover:border-gov-green" onClick={() => navigate('DOCUMENTS')}>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-full"><Upload size={24} /></div>
            <span className="text-sm font-bold">وثائقي</span>
          </Card>
          <Card className="flex flex-col items-center justify-center gap-2 py-6 cursor-pointer hover:border-gov-green" onClick={() => navigate('ABOUT')}>
            <div className="p-3 bg-teal-50 text-teal-600 rounded-full"><Info size={24} /></div>
            <span className="text-sm font-bold">عن الهيئة</span>
          </Card>
        </div>

        {/* Additional Services */}
        <div>
          <h3 className="font-bold text-gov-text-primary mb-3">خدمات إضافية</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="flex items-center gap-3 p-3 cursor-pointer hover:border-gov-green" onClick={() => navigate('COMPLAINT_TRACKING')}>
              <div className="p-2 bg-red-50 text-red-600 rounded-lg"><MessageSquare size={20} /></div>
              <span className="text-xs font-bold">تتبع الشكاوى</span>
            </Card>
            <Card className="flex items-center gap-3 p-3 cursor-pointer hover:border-gov-green" onClick={() => navigate('INSURANCE_CALC')}>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Calculator size={20} /></div>
              <span className="text-xs font-bold">حاسبة التأمين</span>
            </Card>
            <Card className="flex items-center gap-3 p-3 cursor-pointer hover:border-gov-green" onClick={() => navigate('LAWS')}>
              <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Scale size={20} /></div>
              <span className="text-xs font-bold">قوانين وتشريعات</span>
            </Card>
            <Card className="flex items-center gap-3 p-3 cursor-pointer hover:border-gov-green" onClick={() => navigate('FORMS')}>
              <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><FileBox size={20} /></div>
              <span className="text-xs font-bold">النماذج</span>
            </Card>
          </div>
        </div>

        {/* Recent Requests */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gov-text-primary">الطلبات الأخيرة</h3>
            <button onClick={() => navigate('REQUESTS')} className="text-xs text-gov-link">عرض الكل</button>
          </div>
          <div className="space-y-2">
            {requests.slice(0, 2).map((req) => (
              <Card key={req.id} className="flex items-center justify-between p-3" onClick={() => { setSelectedRequest(req); navigate('REQUEST_DETAILS'); }}>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-2 rounded-full',
                    req.status === 'APPROVED' ? 'bg-green-50 text-green-600' : 
                    req.status === 'PENDING' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                  )}>
                    {req.status === 'APPROVED' ? <CheckCircle2 size={16} /> : req.status === 'PENDING' ? <Clock size={16} /> : <XCircle size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{req.type}</p>
                    <p className="text-[10px] text-gov-text-secondary">{req.date}</p>
                  </div>
                </div>
                <ChevronLeft size={16} className="text-gray-300" />
              </Card>
            ))}
          </div>
        </div>

        {/* Important Notifications */}
        <Card className="bg-blue-50 border-blue-100">
          <div className="flex gap-3">
            <Bell size={20} className="text-blue-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-blue-900">إشعار مهم</p>
              <p className="text-xs text-blue-700 leading-relaxed">يرجى تحديث بيانات الحساب البنكي قبل نهاية الشهر لضمان استلام المعاش في موعده.</p>
            </div>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );

  const BasicDataScreen = () => (
    <PageWrapper title="البيانات الأساسية">
      <div className="space-y-4">
        <Card className={cn("text-center py-8 relative overflow-hidden", isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100")}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gov-green/5 rounded-bl-full -mr-10 -mt-10" />
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg relative z-10">
            <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl font-bold relative z-10">{user.name}</h2>
          <p className="text-sm text-gov-text-secondary font-mono relative z-10">{user.insuranceNumber}</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 text-xs rounded-full font-bold border border-green-100 relative z-10">
            <CheckCircle2 size={14} />
            الحالة: {user.status}
          </div>
        </Card>

        <div className="space-y-3">
          {[
            { label: 'رقم الهوية الوطنية', value: user.idNumber, icon: <CreditCard size={18} className="text-blue-500" /> },
            { label: 'البريد الإلكتروني', value: user.email, icon: <LogIn size={18} className="text-orange-500" /> },
            { label: 'رقم الهاتف الجوال', value: user.phone, icon: <Activity size={18} className="text-green-500" /> },
            { label: 'عنوان السكن الحالي', value: user.address, icon: <Home size={18} className="text-purple-500" /> },
          ].map((item, idx) => (
            <Card key={idx} className={cn(
              "flex items-center gap-4 p-4",
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
            )}>
              <div className="p-2 bg-gray-50 rounded-lg">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gov-text-secondary mb-0.5">{item.label}</p>
                <p className="text-sm font-bold">{item.value}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 pt-4">
          <Button variant="outline" className="justify-start h-14" onClick={() => navigate('EDIT_DATA')}>
            <Edit2 size={20} /> تعديل بيانات الحساب
          </Button>
          <Button variant="outline" className="justify-start h-14">
            <Upload size={20} /> تحديث الوثائق والمستندات
          </Button>
          <Button variant="outline" className="justify-start h-14">
            <CreditCard size={20} /> تحديث الحساب البنكي
          </Button>
          <Button variant="outline" className="justify-start h-14" onClick={() => navigate('SUBSCRIPTIONS')}>
            <Activity size={20} /> عرض سجل الاشتراكات
          </Button>
          <Button variant="danger" className="mt-6 h-12" onClick={() => { setIsLoggedIn(false); navigate('LOGIN'); }}>
            <LogOut size={20} /> تسجيل الخروج
          </Button>
        </div>
      </div>
    </PageWrapper>
  );

  const SubscriptionsScreen = () => (
    <PageWrapper title="سجل الاشتراكات">
      <div className="space-y-4">
        <Card className={cn("bg-gov-green text-white", isDarkMode && "bg-gov-green/80")}>
          <p className="text-xs opacity-80">إجمالي الاشتراكات النشطة</p>
          <h2 className="text-2xl font-bold">14,500 ر.ي</h2>
          <p className="text-[10px] mt-2">آخر تحديث: {new Date().toLocaleDateString('ar-YE')}</p>
        </Card>

        <div className="space-y-3">
          <h3 className="font-bold text-sm">تفاصيل الدفعات</h3>
          {subscriptions.map((sub) => (
            <Card key={sub.id} className={cn("flex justify-between items-center", isDarkMode && "bg-gray-800 border-gray-700")}>
              <div>
                <p className="text-sm font-bold">{sub.period}</p>
                <p className="text-[10px] text-gov-text-secondary">رقم العملية: {sub.id}</p>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gov-green">{sub.amount}</p>
                <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full">ناجحة</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageWrapper>
  );

  const GovAgenciesScreen = () => (
    <PageWrapper title="الجهات الحكومية">
      <div className="space-y-4">
        {govAgencies.map((agency) => (
          <Card key={agency.id} className={cn("space-y-3", isDarkMode && "bg-gray-800 border-gray-700")}>
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-gov-green">{agency.name}</h3>
              <a href={agency.link} target="_blank" rel="noreferrer" className="text-gov-link text-xs flex items-center gap-1">
                زيارة الموقع <ChevronLeft size={12} />
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-gov-text-secondary">
              <Home size={16} />
              <span>{agency.contact}</span>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-bold mb-2">الخدمات المتاحة:</p>
              <div className="flex flex-wrap gap-2">
                {agency.services.map((service, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 bg-gray-100 rounded-full text-gov-text-primary">
                    {service}
                  </span>
                ))}
              </div>
            </div>
            <Button variant="outline" className="w-full text-xs py-1.5 mt-2">
              تواصل مباشر
            </Button>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );

  const ProfileScreen = () => (
    <PageWrapper title="الملف الشخصي">
      <div className="space-y-6">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gov-green shadow-lg">
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-0 left-0 bg-gov-green text-white p-2 rounded-full shadow-md border-2 border-white">
              <Edit2 size={14} />
            </button>
          </div>
          <h2 className="text-xl font-bold mt-3">{user.name}</h2>
          <p className="text-sm text-gov-text-secondary">{user.insuranceNumber}</p>
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-between px-4" onClick={() => navigate('EDIT_DATA')}>
            <div className="flex items-center gap-3">
              <User size={18} /> <span>تعديل الملف الشخصي</span>
            </div>
            <ChevronLeft size={18} />
          </Button>
          <Button variant="outline" className="w-full justify-between px-4">
            <div className="flex items-center gap-3">
              <LogIn size={18} /> <span>تغيير كلمة المرور</span>
            </div>
            <ChevronLeft size={18} />
          </Button>
          <Button variant="outline" className="w-full justify-between px-4" onClick={() => navigate('SETTINGS')}>
            <div className="flex items-center gap-3">
              <Settings size={18} /> <span>الإعدادات</span>
            </div>
            <ChevronLeft size={18} />
          </Button>
          <Button variant="danger" className="w-full mt-8" onClick={() => { setIsLoggedIn(false); navigate('LOGIN'); }}>
            <LogOut size={18} /> تسجيل الخروج
          </Button>
        </div>
      </div>
    </PageWrapper>
  );

  const SettingsScreen = () => (
    <PageWrapper title="الإعدادات">
      <div className="space-y-6">
        <section>
          <h3 className="text-xs font-bold text-gov-text-secondary uppercase mb-3 px-2">تفضيلات التطبيق</h3>
          <Card className={cn("space-y-4", isDarkMode && "bg-gray-800 border-gray-700")}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-gov-green" />
                <span className="text-sm font-bold">الإشعارات العامة</span>
              </div>
              <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors",
                  notificationsEnabled ? "bg-gov-green" : "bg-gray-300"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  notificationsEnabled ? "left-1" : "left-7"
                )} />
              </button>
            </div>

            {notificationsEnabled && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-4 pt-2 border-t border-gray-100"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gov-text-secondary">تنبيهات صرف المعاشات</span>
                  <button 
                    onClick={() => setNotificationSettings({...notificationSettings, pensionPayments: !notificationSettings.pensionPayments})}
                    className={cn("w-10 h-5 rounded-full relative transition-colors", notificationSettings.pensionPayments ? "bg-blue-500" : "bg-gray-200")}
                  >
                    <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all", notificationSettings.pensionPayments ? "left-0.5" : "left-5.5")} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gov-text-secondary">تغييرات حالة الطلبات</span>
                  <button 
                    onClick={() => setNotificationSettings({...notificationSettings, requestStatus: !notificationSettings.requestStatus})}
                    className={cn("w-10 h-5 rounded-full relative transition-colors", notificationSettings.requestStatus ? "bg-blue-500" : "bg-gray-200")}
                  >
                    <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all", notificationSettings.requestStatus ? "left-0.5" : "left-5.5")} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gov-text-secondary">أخبار وتحديثات الهيئة</span>
                  <button 
                    onClick={() => setNotificationSettings({...notificationSettings, newsUpdates: !notificationSettings.newsUpdates})}
                    className={cn("w-10 h-5 rounded-full relative transition-colors", notificationSettings.newsUpdates ? "bg-blue-500" : "bg-gray-200")}
                  >
                    <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all", notificationSettings.newsUpdates ? "left-0.5" : "left-5.5")} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gov-text-secondary">تنبيهات الأمان</span>
                  <button 
                    onClick={() => setNotificationSettings({...notificationSettings, securityAlerts: !notificationSettings.securityAlerts})}
                    className={cn("w-10 h-5 rounded-full relative transition-colors", notificationSettings.securityAlerts ? "bg-blue-500" : "bg-gray-200")}
                  >
                    <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all", notificationSettings.securityAlerts ? "left-0.5" : "left-5.5")} />
                  </button>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-gov-green" />
                <span className="text-sm font-bold">الوضع الداكن</span>
              </div>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors",
                  isDarkMode ? "bg-gov-green" : "bg-gray-300"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  isDarkMode ? "left-1" : "left-7"
                )} />
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Info size={18} className="text-gov-green" />
                <span className="text-sm font-bold">اللغة</span>
              </div>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as 'AR' | 'EN')}
                className="text-xs bg-transparent font-bold focus:outline-none"
              >
                <option value="AR">العربية</option>
                <option value="EN">English</option>
              </select>
            </div>
          </Card>
        </section>

        <section>
          <h3 className="text-xs font-bold text-gov-text-secondary uppercase mb-3 px-2">قانوني</h3>
          <Card className={cn("space-y-4", isDarkMode && "bg-gray-800 border-gray-700")}>
            <button className="w-full flex justify-between items-center text-sm font-bold">
              <span>سياسة الخصوصية</span>
              <ChevronLeft size={16} />
            </button>
            <button className="w-full flex justify-between items-center text-sm font-bold">
              <span>شروط الاستخدام</span>
              <ChevronLeft size={16} />
            </button>
            <button className="w-full flex justify-between items-center text-sm font-bold" onClick={() => navigate('ABOUT')}>
              <span>عن الهيئة</span>
              <ChevronLeft size={16} />
            </button>
          </Card>
        </section>

        <div className="text-center text-[10px] text-gov-text-secondary">
          <p>إصدار التطبيق 1.0.4</p>
          <p>© 2024 الهيئة العامة للتأمينات والمعاشات - تعز</p>
        </div>
      </div>
    </PageWrapper>
  );

  const EditDataScreen = () => (
    <PageWrapper title="تعديل البيانات">
      <div className="space-y-4">
        <Input label="الاسم الكامل" defaultValue={user.name} />
        <Input label="رقم الهوية" defaultValue={user.idNumber} />
        <Input label="الرقم التأميني" defaultValue={user.insuranceNumber} disabled className="bg-gray-50" />
        <Input label="البريد الإلكتروني" defaultValue={user.email} />
        <Input label="رقم الهاتف" defaultValue={user.phone} />
        <Input label="العنوان" defaultValue={user.address} />
        
        <div className="flex gap-3 pt-6">
          <Button className="flex-1" onClick={() => navigate('BASIC_DATA')}>حفظ التغييرات</Button>
          <Button variant="ghost" className="flex-1" onClick={() => navigate('BASIC_DATA')}>إلغاء</Button>
        </div>
      </div>
    </PageWrapper>
  );

  const RequestsScreen = () => (
    <PageWrapper title="طلباتي">
      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button className="px-4 py-1.5 bg-gov-green text-white rounded-full text-xs whitespace-nowrap">الكل</button>
          <button className="px-4 py-1.5 bg-white border border-gray-200 text-gov-text-secondary rounded-full text-xs whitespace-nowrap">قيد المراجعة</button>
          <button className="px-4 py-1.5 bg-white border border-gray-200 text-gov-text-secondary rounded-full text-xs whitespace-nowrap">موافق عليه</button>
          <button className="px-4 py-1.5 bg-white border border-gray-200 text-gov-text-secondary rounded-full text-xs whitespace-nowrap">مرفوض</button>
        </div>

        <div className="space-y-3">
          {requests.map((req) => (
            <Card key={req.id} className="cursor-pointer hover:border-gov-green" onClick={() => { setSelectedRequest(req); navigate('REQUEST_DETAILS'); }}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm">{req.type}</h3>
                <span className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full font-bold',
                  req.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                  req.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                )}>
                  {req.status === 'APPROVED' ? 'موافق عليه' : req.status === 'PENDING' ? 'قيد المراجعة' : 'مرفوض'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-gov-text-secondary">
                <span>رقم الطلب: {req.id}</span>
                <span>التاريخ: {req.date}</span>
              </div>
            </Card>
          ))}
        </div>

        <Button className="fixed bottom-20 left-4 right-4 max-w-md mx-auto shadow-lg" onClick={() => navigate('NEW_REQUEST')}>
          <Plus size={20} /> تقديم طلب جديد
        </Button>
      </div>
    </PageWrapper>
  );

  const NewRequestScreen = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [requestId, setRequestId] = useState('');

    const handleSubmit = () => {
      setIsLoading(true);
      setTimeout(() => {
        const newId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
        setRequestId(newId);
        setIsSubmitted(true);
        setIsLoading(false);
      }, 1500);
    };

    if (isSubmitted) {
      return (
        <PageWrapper title="تم التقديم بنجاح">
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={48} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">تم استلام طلبك بنجاح</h2>
              <p className="text-gov-text-secondary text-sm">رقم الطلب الخاص بك هو:</p>
              <p className="text-2xl font-mono font-bold text-gov-green mt-2">{requestId}</p>
            </div>
            <p className="text-xs text-gov-text-secondary px-6">
              يمكنك متابعة حالة الطلب من خلال قائمة "طلباتي" في لوحة التحكم.
            </p>
            <Button className="w-full mt-8" onClick={() => navigate('REQUESTS')}>العودة للطلبات</Button>
          </div>
        </PageWrapper>
      );
    }

    return (
      <PageWrapper title="تقديم طلب جديد">
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">نوع الطلب</label>
            <select className="px-4 py-2 rounded-gov border border-gray-300 bg-white focus:outline-none focus:border-gov-green">
              <option>اختر نوع الطلب...</option>
              <option>طلب معاش تقاعدي</option>
              <option>تحديث بيانات بنكية</option>
              <option>شهادة إثبات حالة</option>
              <option>طلب ضم خدمة</option>
            </select>
          </div>

          <Input label="ملاحظات إضافية" placeholder="اكتب أي تفاصيل أخرى هنا..." />
          
          <div className="space-y-2">
            <label className="text-sm font-semibold">المرفقات المطلوبة</label>
            <div className="border-2 border-dashed border-gray-200 rounded-gov p-8 text-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gov-text-secondary">اضغط هنا لرفع الملفات</p>
              <p className="text-[10px] text-gray-400 mt-1">PDF, JPG, PNG (بحد أقصى 5MB)</p>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button className="flex-1" onClick={handleSubmit}>تقديم الطلب</Button>
            <Button variant="outline" className="flex-1" onClick={() => navigate('REQUESTS')}>حفظ كمسودة</Button>
          </div>
        </div>
      </PageWrapper>
    );
  };

  const RequestDetailsScreen = () => {
    if (!selectedRequest) return null;
    
    return (
      <PageWrapper title="تفاصيل الطلب">
        <div className="space-y-4">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gov-green">{selectedRequest.type}</h2>
              <span className={cn(
                'text-[10px] px-2 py-0.5 rounded-full font-bold',
                selectedRequest.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                selectedRequest.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
              )}>
                {selectedRequest.status === 'APPROVED' ? 'موافق عليه' : selectedRequest.status === 'PENDING' ? 'قيد المراجعة' : 'مرفوض'}
              </span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gov-text-secondary">رقم الطلب</span>
                <span className="font-mono">{selectedRequest.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gov-text-secondary">تاريخ التقديم</span>
                <span>{selectedRequest.date}</span>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-gov-text-secondary mb-1">التفاصيل:</p>
                <p className="leading-relaxed">{selectedRequest.details}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-sm mb-3">مسار الطلب</h3>
            <div className="space-y-4 relative before:absolute before:right-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              <div className="relative pr-8">
                <div className="absolute right-0 top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                <p className="text-sm font-bold">تم استلام الطلب</p>
                <p className="text-[10px] text-gov-text-secondary">{selectedRequest.date}</p>
              </div>
              <div className="relative pr-8">
                <div className={cn(
                  'absolute right-0 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm',
                  selectedRequest.status !== 'PENDING' ? 'bg-green-500' : 'bg-orange-400 animate-pulse'
                )} />
                <p className="text-sm font-bold">قيد المراجعة الفنية</p>
                <p className="text-[10px] text-gov-text-secondary">جاري فحص المستندات</p>
              </div>
              <div className="relative pr-8">
                <div className={cn(
                  'absolute right-0 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm',
                  selectedRequest.status === 'APPROVED' ? 'bg-green-500' : 
                  selectedRequest.status === 'REJECTED' ? 'bg-red-500' : 'bg-gray-200'
                )} />
                <p className="text-sm font-bold">القرار النهائي</p>
                <p className="text-[10px] text-gov-text-secondary">بانتظار الاعتماد</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button variant="outline" className="w-full">
              <Download size={18} /> تحميل الملفات
            </Button>
            <Button variant="outline" className="w-full">
              <Printer size={18} /> طباعة الطلب
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  };

  const GazetteScreen = () => {
    const [gazettes, setGazettes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchGazettes = async () => {
        const result = await apiFetch<any[]>('/api/gazettes', {}, MOCK_GAZETTES);
        if (result.success) {
          setGazettes(result.data);
        }
        setLoading(false);
      };
      fetchGazettes();
    }, []);

    return (
      <PageWrapper title="الجريدة الرسمية">
        <div className="space-y-4">
          <Card className="bg-teal-50 border-teal-200">
            <div className="flex gap-3">
              <Scale className="text-teal-600 shrink-0" size={24} />
              <p className="text-xs text-teal-800 leading-relaxed">
                يتم جلب هذه البيانات مباشرة من وزارة الشؤون القانونية لضمان اطلاعكم على أحدث التشريعات والقرارات الرسمية.
              </p>
            </div>
          </Card>

          {loading ? (
            <div className="flex flex-col items-center py-12 space-y-3">
              <RefreshCw className="animate-spin text-gov-green" size={32} />
              <p className="text-sm text-gov-text-secondary">جاري جلب البيانات الرسمية...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {gazettes.map((g) => (
                <Card key={g.id} className="hover:border-gov-green transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-gov-text-primary group-hover:text-gov-green transition-colors">{g.title}</h4>
                    <span className="text-[10px] text-gov-text-secondary bg-gray-100 px-2 py-0.5 rounded-full">{g.date}</span>
                  </div>
                  <p className="text-xs text-gov-text-secondary mb-4">{g.highlights}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-[10px] h-8">
                      <FileText size={14} /> قراءة النص الكامل
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-[10px] h-8">
                      <Download size={14} /> تحميل PDF
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    );
  };

  const MainMenuScreen = () => {
    const menuItems = [
      { title: 'الرئيسية', icon: <Home size={20} />, screen: 'DASHBOARD', color: 'text-blue-600', bg: 'bg-blue-50' },
      { title: 'عن الهيئة', icon: <Building2 size={20} />, screen: 'ABOUT', color: 'text-teal-600', bg: 'bg-teal-50' },
      { title: 'الخدمات التأمينية', icon: <ShieldCheck size={20} />, screen: 'SERVICES', color: 'text-gov-green', bg: 'bg-green-50' },
      { title: 'المنافع والمعاشات', icon: <Coins size={20} />, screen: 'PENSION_CALC_RESULT', color: 'text-orange-600', bg: 'bg-orange-50' },
      { title: 'التشريعات', icon: <Gavel size={20} />, screen: 'LAWS', color: 'text-purple-600', bg: 'bg-purple-50' },
      { title: 'الخدمات الإلكترونية', icon: <Cpu size={20} />, screen: 'SERVICES', color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { title: 'التقارير والإحصائيات', icon: <PieChart size={20} />, screen: 'DASHBOARD', color: 'text-red-600', bg: 'bg-red-50' },
      { title: 'الإعلام والتوعية', icon: <Newspaper size={20} />, screen: 'GAZETTES', color: 'text-amber-600', bg: 'bg-amber-50' },
      { title: 'التواصل', icon: <Headphones size={20} />, screen: 'COMPLAINT', color: 'text-cyan-600', bg: 'bg-cyan-50' },
    ];

    return (
      <PageWrapper title="القائمة الرئيسية">
        <div className="space-y-4">
          <Card className="grid grid-cols-1 gap-2 p-2">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => navigate(item.screen as Screen)}
                className={cn(
                  "flex items-center gap-4 w-full p-4 rounded-xl transition-all hover:translate-x-[-4px] active:scale-95",
                  isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                )}
              >
                <div className={cn("p-2.5 rounded-lg shrink-0", item.bg, item.color)}>
                  {item.icon}
                </div>
                <span className={cn("font-bold text-sm flex-1 text-right", isDarkMode ? "text-white" : "text-gov-text-primary")}>
                  {item.title}
                </span>
                <ChevronLeft size={18} className="text-gray-300" />
              </button>
            ))}
          </Card>
          
          <div className="pt-4 px-2">
            <Button 
              variant="outline" 
              className="w-full border-red-100 text-red-500 hover:bg-red-50"
              onClick={() => setIsLoggedIn(false)}
            >
              <LogOut size={18} /> تسجيل الخروج
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  };

  // --- Router ---
  const renderScreen = () => {
    switch (screen) {
      case 'ABOUT': return <AboutScreen />;
      case 'SERVICES': return <ServicesScreen />;
      case 'LOGIN': return <LoginScreen />;
      case 'REGISTER': return <RegisterScreen />;
      case 'DASHBOARD': return <DashboardScreen />;
      case 'BASIC_DATA': return <BasicDataScreen />;
      case 'EDIT_DATA': return <EditDataScreen />;
      case 'REQUESTS': return <RequestsScreen />;
      case 'NEW_REQUEST': return <NewRequestScreen />;
      case 'REQUEST_DETAILS': return <RequestDetailsScreen />;
      case 'GOV_AGENCIES': return <GovAgenciesScreen />;
      case 'PROFILE': return <ProfileScreen />;
      case 'SETTINGS': return <SettingsScreen />;
      case 'SUBSCRIPTIONS': return <SubscriptionsScreen />;
      case 'PENSION_CALC_RESULT': return <PensionCalcScreen />;
      case 'SERVICE_CATEGORY_DETAIL': return <ServiceCategoryDetailScreen />;
      case 'SERVICE_FORM': return <ServiceFormScreen />;
      case 'INQUIRY_RESULT': return <InquiryResultScreen />;
      case 'DRAFTS': return <DraftsScreen />;
      case 'DOCUMENTS': return <DocumentsScreen />;
      case 'COMPLAINT': return <ComplaintScreen />;
      case 'FAQ': return <FAQScreen />;
      case 'LAWS': return <LawsScreen />;
      case 'FORMS': return <FormsScreen />;
      case 'INSURANCE_CALC': return <InsuranceCalcScreen />;
      case 'COMPLAINT_TRACKING': return <ComplaintTrackingScreen />;
      case 'GAZETTES': return <GazetteScreen />;
      case 'MAIN_MENU': return <MainMenuScreen />;
      default: return <LoginScreen />;
    }
  };

  return (
    <>
      <Splash onFinish={() => setShowSplash(false)} />
      {!showSplash && (
        <AnimatePresence mode="wait">
          {renderScreen()}
        </AnimatePresence>
      )}
    </>
  );
}
