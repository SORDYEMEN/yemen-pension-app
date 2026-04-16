// Mock data for static deployment (GitHub Pages)
export const MOCK_NEWS = [
  "بدء صرف معاشات شهر مارس 2026 عبر مكاتب البريد والبنوك المعتمدة ابتداءً من يوم غدٍ",
  "ندعو جميع المتقاعدين لتحديث بياناتهم البنكية عبر التطبيق لتجنب تأخير الصرف في الأشهر القادمة",
  "إطلاق حزمة خدمات إلكترونية جديدة تشمل حاسبة المعاش التقديرية وخدمات التأمين الاجتماعي للقطاع الحكومي",
  "تسهيل إجراءات تقديم إقرار الحياة السنوي إلكترونياً للمتقاعدين عبر خاصية التعرف على الوجه"
];

export const MOCK_GAZETTES = [
  { id: 'G-2024-03', title: 'الجريدة الرسمية - العدد الثالث (مارس 2024)', date: '2024-03-30', url: '#', highlights: 'قرارات وزارية بشأن العلاوات السنوية' },
  { id: 'G-2024-02', title: 'الجريدة الرسمية - العدد الثاني (فبراير 2024)', date: '2024-02-28', url: '#', highlights: 'تعديلات لائحة التأمينات الاجتماعية' },
  { id: 'G-2024-01', title: 'الجريدة الرسمية - العدد الأول (يناير 2024)', date: '2024-01-31', url: '#', highlights: 'الموازنة العامة للدولة لسنة 2024' },
];

export const MOCK_EMPLOYEE_DATA = {
  name: "أحمد محمد علي",
  status: "نشط",
  lastContribution: "2024-03-15",
  employer: "المؤسسة العامة للكهرباء - تعز",
  yearsOfService: 12.5
};

export const MOCK_PENSION_DATA = {
  pensionAmount: "75,000 ر.ي",
  paymentStatus: "تم الصرف",
  lastPaymentDate: "2024-03-05",
  nextPaymentDate: "2024-04-05",
  bankName: "بنك الكريمي",
  accountNumber: "*******456"
};

/**
 * Generic fetch wrapper that falls back to mock data if the API is unavailable
 * (Essential for static hosting like GitHub Pages)
 */
export async function apiFetch<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<{ success: boolean; data: T; message?: string }> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.warn(`API call to ${url} failed, using mock data.`, error);
    return { success: true, data: fallbackData as T };
  }
}
