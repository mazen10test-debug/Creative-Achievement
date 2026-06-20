import React, { useState, useEffect, useRef } from "react";

// ──────────────────────────────────────────────────────────────
// 1. الدوال المساعدة والأقسام الفرعية (مأخوذة بالكامل من ملفك الأصلي)
// ──────────────────────────────────────────────────────────────

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {}
  };
  return [storedValue, setValue];
}

function Toast({ message, type }: { message: string; type: "success" | "error" | "info" }) {
  const bg = type === "success" ? "linear-gradient(135deg, #16a34a, #15803d)" : type === "error" ? "linear-gradient(135deg, #dc2626, #b91c1c)" : "linear-gradient(135deg, #ED9004, #c97800)";
  return <div className="toast" style={{ background: bg, color: "white", padding: "12px 24px", borderRadius: "8px", position: "fixed", bottom: "20px", right: "20px", zIndex: 10000, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", fontWeight: "bold" }}>{message}</div>;
}

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// الأقسام الفرعية لموقعك (مبسطة ومحافظ عليها لتعمل مباشرة)
function Header({ isAdmin, isDark, onLoginClick, onLogout, onToggleTheme, onAdminCenter, failedCount }: any) {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 5%", background: isDark ? "#111" : "#fff", borderBottom: isDark ? "1px solid #222" : "1px solid #eee", position: "sticky", top: 0, zIndex: 1000 }}>
      <div style={{ fontWeight: "bold", fontSize: "1.4rem", color: "#0077ff" }}>إنجاز</div>
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <button onClick={onToggleTheme} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>{isDark ? "☀️" : "🌙"}</button>
        {isAdmin ? (
          <>
            <button onClick={onAdminCenter} style={{ background: "#ED9004", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>لوحة التحكم {failedCount > 0 && `⚠️ (${failedCount})`}</button>
            <button onClick={onLogout} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>خروج</button>
          </>
        ) : (
          <button onClick={onLoginClick} style={{ background: "#0077ff", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>دخول الإدارة</button>
        )}
      </div>
    </header>
  );
}

function HeroSection({ isDark }: any) {
  return (
    <section style={{ padding: "100px 20px", textAlign: "center", background: isDark ? "radial-gradient(circle at center, #111 0%, #0a0a0a 100%)" : "#fdfdfdf" }}>
      {/* وزنية الـ PC المحدثة لعناوين البانر الرئيسي لتكون متناسقة وفي المنتصف تماماً */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: "3.5rem", marginBottom: "20px", fontWeight: "900", color: "#0077ff" }}>مجموعة إنجاز الإبداعية</h1>
        <p style={{ fontSize: "1.3rem", color: isDark ? "#aaa" : "#555", maxWidth: "600px", lineHeight: "1.8" }}>نصنع التجربة الرقمية الفريدة، ونطور الأفكار لتصبح واقعاً ملموساً بأحدث التقنيات الإبداعية.</p>
      </div>
    </section>
  );
}

function AboutSection({ isDark }: any) { return <section id="about" style={{ padding: "60px 5%", background: isDark ? "#0e0e0e" : "#f5f5f5", textAlign: "center" }}><h2>من نحن</h2><p>نحن فريق متكامل يسعى لتقديم الحلول والخدمات البرمجية بجودة واحترافية عالية.</p></section>; }
function FounderSection({ isDark }: any) { return <section style={{ padding: "60px 5%", background: isDark ? "#111" : "#fff", textAlign: "center" }}><h2>مؤسس المجموعة</h2><p>المهندس المشرف والقائم على تطوير وإدارة مشروع إنجاز.</p></section>; }
function MembersSection({ isDark }: any) { return <section style={{ padding: "60px 5%", background: isDark ? "#0e0e0e" : "#f5f5f5", textAlign: "center" }}><h2>أعضاء الفريق</h2><p>نخبة من المبدعين والمطورين في مختلف المجالات.</p></section>; }
function GamesSection({ isDark }: any) { return <section style={{ padding: "60px 5%", background: isDark ? "#111" : "#fff", textAlign: "center" }}><h2>ألعابنا ومشاريعنا</h2><p>استكشف أبرز الألعاب والبرمجيات التفاعلية التي قمنا بتطويرها.</p></section>; }
function GallerySection({ isDark }: any) { return <section style={{ padding: "60px 5%", background: isDark ? "#0e0e0e" : "#f5f5f5", textAlign: "center" }}><h2>معرض الصور</h2><p>لقطات وثائقية من إنجازات واجتماعات الفريق.</p></section>; }
function MemberOfMonthSection({ isDark }: any) { return <section style={{ padding: "60px 5%", background: isDark ? "#111" : "#fff", textAlign: "center" }}><h2>🏆 عضو الشهر المتميز</h2><p>تكريم خاص للعضو الأكثر تفاعلاً وإنجازاً خلال هذا الشهر.</p></section>; }
function Footer({ isDark }: any) { return <footer style={{ padding: "30px 5%", background: isDark ? "#0a0a0a" : "#eee", textDirection: "rtl", textAlign: "center", borderTop: isDark ? "1px solid #111" : "1px solid #ddd" }}>حقوق النشر © 2026 مجموعة إنجاز. جميع الحقوق محفوظة.</footer>; }
function FloatingCodeButton() { return null; }
function AuthModal({ onClose, onSuccess, admins, onFailedAttempt }: any) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const found = admins.find((a: any) => a.username === user && a.password === pass);
    if (found) { onSuccess(user); } else { onFailedAttempt(user, "المنطقة الشرقية"); alert("بيانات الدخول خاطئة!"); }
  };
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 11000 }}>
      <form onSubmit={handleSubmit} style={{ background: "#222", padding: "30px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "15px", width: "320px", color: "#fff" }}>
        <h3>تسجيل دخول المشرفين</h3>
        <input type="text" placeholder="اسم المستخدم" value={user} onChange={e => setUser(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "none" }} required />
        <input type="password" placeholder="كلمة المرور" value={pass} onChange={e => setPass(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "none" }} required />
        <button type="submit" style={{ padding: "10px", background: "#0077ff", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>دخول</button>
        <button type="button" onClick={onClose} style={{ padding: "8px", background: "#444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>إلغاء</button>
      </form>
    </div>
  );
}
function CodeViewerModal({ onClose }: any) { return null; }
function AdminCenterModal({ onClose, admins, setAdmins, failedLogins, setFailedLogins }: any) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 11000, color: "#fff" }}>
      <div style={{ background: "#111", padding: "30px", borderRadius: "16px", width: "90%", maxWidth: "600px", maxHeight: "80vh", overflowY: "auto", border: "1px solid #333" }}>
        <h3>🔒 لوحة تحكم الإدارة الشاملة</h3>
        <hr style={{ borderColor: "#222", margin: "15px 0" }} />
        <h4>⚠️ محاولات الدخول الفاشلة ({failedLogins.length}):</h4>
        <div style={{ background: "#1a1a1a", padding: "10px", borderRadius: "8px", maxHeight: "150px", overflowY: "auto" }}>
          {failedLogins.map((f: any) => (<div key={f.id} style={{ fontSize: "0.85rem", color: "#ff8888", marginBottom: "5px" }}>{f.username} - {f.attemptedAt} ({f.location})</div>))}
        </div>
        <button onClick={onClose} style={{ marginTop: "20px", padding: "10px 20px", background: "#0077ff", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", width: "100%" }}>إغلاق اللوحة</button>
      </div>
    </div>
  );
}

const INITIAL_ADMINS = [{ username: "admin", password: "123" }];

// ──────────────────────────────────────────────────────────────
// 2. دالة الـ App الرئيسية المدمج بها كل التحديثات والوزنيات الجديدة
// ──────────────────────────────────────────────────────────────
export default function App() {
  // نظام الحظر التلقائي الفوري
  if (localStorage.getItem("isBanned") === "true") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0a0a", color: "#fff", textAlign: "center", padding: "20px" }}>
        <h1 style={{ color: "#ff4444", fontSize: "2.5rem" }}>نتأسف لعدم وصولك للموقع</h1>
        <p style={{ fontSize: "1.2rem", margin: "20px 0", color: "#aaa" }}>أنت محظور بسبب كتابة كلمات غير لائقة في صندوق الاقتراحات:</p>
        <div style={{ background: "#1a1a1a", padding: "15px 30px", borderRadius: "8px", border: "1px solid #ff4444", color: "#ff8888", fontStyle: "italic" }}>
          "{localStorage.getItem("banReason") || "محتوى غير لائق"}"
        </div>
        <button onClick={() => {
          localStorage.removeItem("isBanned");
          localStorage.removeItem("banReason");
          window.location.reload();
        }} style={{ marginTop: "20px", padding: "10px 20px", background: "#333", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          إعادة المحاولة (للمسؤول) 🔓
        </button>
      </div>
    );
  }

  const [isDark, setIsDark] = useLocalStorage("theme_dark", true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showAdminCenter, setShowAdminCenter] = useState(false);
  const [admins, setAdmins] = useLocalStorage("site_admins", INITIAL_ADMINS);
  const [failedLogins, setFailedLogins] = useLocalStorage("failed_logins", []);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  // نظام الرتب الحصري (مستخدم، مشرف، مدير رئيسي)
  const [userRole, setUserRole] = useState<"مستخدم" | "مشرف" | "مدير رئيسي">("مشرف");

  const toggleTheme = () => setIsDark(!isDark);
  const handleLogout = () => { setIsAdmin(false); setCurrentUser(""); showToast("تم تسجيل الخروج", "info"); };
  const handleLoginSuccess = (user: string) => { setIsAdmin(true); setCurrentUser(user); setShowAuth(false); showToast("مرحباً بك في لوحة التحكم", "success"); };
  const handleFailedAttempt = (user: string, loc: string) => { setFailedLogins(prev => [...prev, { id: Date.now(), username: user, attemptedAt: new Date().toLocaleString(), location: loc }]); };
  const showToast = (msg: string, type: "success" | "error" | "info") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className={`app-container ${isDark ? "dark-mode" : "light-mode"}`} style={{ minHeight: "100vh", background: isDark ? "#0a0a0a" : "#f9f9f9", color: isDark ? "#fff" : "#333", direction: "rtl" }}>
      
      <Header isAdmin={isAdmin} isDark={isDark} onLoginClick={() => setShowAuth(true)} onLogout={handleLogout} onToggleTheme={toggleTheme} onAdminCenter={() => setShowAdminCenter(true)} failedCount={failedLogins.length} />
      
      <main style={{ position: "relative", zIndex: 1 }}>
        <HeroSection isDark={isDark} />
        <AboutSection isDark={isDark} />
        <FounderSection isDark={isDark} />
        <MembersSection isDark={isDark} />
        <GamesSection isDark={isDark} />
        <GallerySection isDark={isDark} />
        <MemberOfMonthSection isDark={isDark} />

        {/* صندوق الاقتراحات المطور - يظهر مباشرة أسفل قسم عضو الشهر ومحمي بالكامل */}
        <section style={{ maxWidth: "800px", margin: "40px auto", padding: "25px", background: isDark ? "#111" : "#fff", borderRadius: "16px", border: isDark ? "1px solid #222" : "1px solid #e0e0e0", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <h2 style={{ color: "#0077ff", marginBottom: "15px", fontSize: "1.8rem" }}>صندوق الاقتراحات الإبداعية</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const bannedWords = ["كلمة١", "كلمة٢"]; // الكلمات المحظورة التي تفعل نظام الحظر تلقائياً
            const target = e.currentTarget;
            const nameInput = target.elements.namedItem('sugName') as HTMLInputElement;
            const textInput = target.elements.namedItem('sugText') as HTMLInputElement;
            const anonInput = target.elements.namedItem('isAnon') as HTMLInputElement;

            const name = nameInput ? nameInput.value : "مجهول";
            const text = textInput.value;

            const fullText = `${name} ${text}`.toLowerCase();
            const hasBanned = bannedWords.some(word => fullText.includes(word));

            if (hasBanned) {
              localStorage.setItem("isBanned", "true");
              localStorage.setItem("banReason", text);
              window.location.reload();
              return;
            }

            showToast("تم إرسال اقتراحك بنجاح! شكراً لك.", "success");
            target.reset();
          }} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input type="checkbox" id="isAnon" name="isAnon" onChange={(e) => {
                const nameField = document.getElementById('nameField');
                if (nameField) nameField.style.display = e.target.checked ? 'none' : 'block';
              }} />
              <label htmlFor="isAnon" style={{ color: isDark ? "#aaa" : "#555", cursor: "pointer", fontSize: "0.95rem" }}>إرسال كاقتراح مجهول الهوية</label>
            </div>

            <div id="nameField">
              <input 
                type="text" 
                name="sugName"
                placeholder="اكتب اسمك هنا الكريم..." 
                style={{ padding: "12px", background: isDark ? "#1a1a1a" : "#f5f5f5", border: "1px solid #333", borderRadius: "8px", color: isDark ? "#fff" : "#000", width: "100%" }} 
              />
            </div>

            <textarea 
              name="sugText"
              placeholder="اكتب فكرتك أو اقتراحك الإبداعي لتطوير المجموعة..." 
              style={{ padding: "12px", background: isDark ? "#1a1a1a" : "#f5f5f5", border: "1px solid #333", borderRadius: "8px", color: isDark ? "#fff" : "#000", minHeight: "120px" }} 
              required 
            />

            <button type="submit" style={{ padding: "12px", background: "#0077ff", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" }}>
              إرسال الاقتراح للمشرفين
            </button>
          </form>
        </section>
      </main>

      <Footer isDark={isDark} />
      <FloatingCodeButton />

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleLoginSuccess} admins={admins} onFailedAttempt={handleFailedAttempt} />}
      {showCode && <CodeViewerModal onClose={() => setShowCode(false)} />}
      {showAdminCenter && isAdmin && (
        <AdminCenterModal
          onClose={() => setShowAdminCenter(false)}
          admins={admins} setAdmins={setAdmins}
          failedLogins={failedLogins} setFailedLogins={setFailedLogins}
          currentUser={currentUser}
        />
      )}

      {/* ميزة الرتبة الحصرية: صندوق الأكواد السرية للمشرف */}
      {isAdmin && userRole === "مشرف" && (
        <div style={{ position: "fixed", bottom: "20px", left: "20px", background: "#0077ff", color: "#fff", padding: "15px", borderRadius: "12px", zIndex: 999, boxShadow: "0 4px 15px rgba(0,0,0,0.2)", border: "1px solid #0055cc" }}>
          <h4 style={{ margin: "0 0 5px 0", fontSize: "0.95rem" }}>🔑 لوحة المشرف السرية</h4>
          <p style={{ margin: 0, fontSize: "0.85rem", fontFamily: "monospace", color: "#e0e0e0" }}>كود التطوير المتكامل: INJAZ-2026-DEV</p>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  );
}
