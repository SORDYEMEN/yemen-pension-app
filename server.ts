import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Verify Employee Status (Hypothetical Gov API)
  app.post("/api/verify-employee", async (req, res) => {
    const { idNumber, insuranceNumber } = req.body;
    
    // In a real scenario, this would call:
    // const response = await fetch(`${process.env.GOV_API_BASE_URL}/verify`, {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${process.env.GOV_API_KEY}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ idNumber, insuranceNumber })
    // });
    // const data = await response.json();
    
    // For now, we simulate a successful verification with realistic data
    // based on the provided ID numbers for demo purposes, 
    // but the structure is ready for the real API.
    
    setTimeout(() => {
      if (idNumber === "123456789") {
        res.json({
          success: true,
          data: {
            name: "أحمد محمد علي",
            status: "نشط",
            lastContribution: "2024-03-15",
            employer: "المؤسسة العامة للكهرباء - تعز",
            yearsOfService: 12.5
          }
        });
      } else {
        res.status(404).json({ success: false, message: "لم يتم العثور على بيانات مطابقة" });
      }
    }, 1000);
  });

  // Fetch Official Gazettes
  app.get("/api/gazettes", async (req, res) => {
    // This would fetch from the Ministry of Legal Affairs or NIC
    // const response = await fetch(`${process.env.GOV_API_BASE_URL}/gazettes`);
    // const data = await response.json();

    const mockGazettes = [
      { id: 'G-2024-03', title: 'الجريدة الرسمية - العدد الثالث (مارس 2024)', date: '2024-03-30', url: '#', highlights: 'قرارات وزارية بشأن العلاوات السنوية' },
      { id: 'G-2024-02', title: 'الجريدة الرسمية - العدد الثاني (فبراير 2024)', date: '2024-02-28', url: '#', highlights: 'تعديلات لائحة التأمينات الاجتماعية' },
      { id: 'G-2024-01', title: 'الجريدة الرسمية - العدد الأول (يناير 2024)', date: '2024-01-31', url: '#', highlights: 'الموازنة العامة للدولة لسنة 2024' },
    ];

    res.json({ success: true, data: mockGazettes });
  });

  // Fetch Real-time News
  app.get("/api/news", (req, res) => {
    const news = [
      "بدء صرف معاشات شهر مارس 2026 عبر مكاتب البريد والبنوك المعتمدة ابتداءً من يوم غدٍ",
      "ندعو جميع المتقاعدين لتحديث بياناتهم البنكية عبر التطبيق لتجنب تأخير الصرف في الأشهر القادمة",
      "إطلاق حزمة خدمات إلكترونية جديدة تشمل حاسبة المعاش التقديرية وخدمات التأمين الاجتماعي للقطاع الحكومي",
      "تسهيل إجراءات تقديم إقرار الحياة السنوي إلكترونياً للمتقاعدين عبر خاصية التعرف على الوجه"
    ];
    res.json({ success: true, data: news });
  });

  // Verify Pension Details
  app.post("/api/verify-pension", (req, res) => {
    const { insuranceNumber, idNumber } = req.body;

    // Simulate database lookup
    setTimeout(() => {
      if (insuranceNumber === "INS-987654" || idNumber === "123456789") {
        res.json({
          success: true,
          data: {
            pensionAmount: "75,000 ر.ي",
            paymentStatus: "تم الصرف",
            lastPaymentDate: "2024-03-05",
            nextPaymentDate: "2024-04-05",
            bankName: "بنك الكريمي",
            accountNumber: "*******456"
          }
        });
      } else {
        res.status(404).json({ success: false, message: "لم يتم العثور على بيانات تقاعدية مطابقة" });
      }
    }, 1000);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
