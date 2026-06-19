/**
 * الإنجاز الإبداعي — موقع رسمي
 * ملف موحد شامل لجميع المكونات
 */

import { useState, useEffect, useRef, useCallback } from "react";
import logoNoBg from "/logo-nobg.png";
import banner from "/banner.png";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Member {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

interface Game {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  players: string;
  duration: string;
  instructions: string;
}

interface GalleryItem {
  id: number;
  url: string;
  caption: string;
  category: string;
}

interface MemberOfMonth {
  name: string;
  achievement: string;
  imageUrl: string | null;
}

// ─────────────────────────────────────────────
// INITIAL DATA
// ─────────────────────────────────────────────
const INITIAL_MEMBERS: Member[] = [
  { id: 1, name: "أحمد محمد الزهراني", role: "رئيس المجموعة", bio: "قائد ملهم بخبرة واسعة في إدارة المشاريع الإبداعية وتطوير المواهب الشابة", avatar: "أ" },
  { id: 2, name: "سارة عبدالله العمري", role: "نائبة الرئيس", bio: "متخصصة في التصميم الإبداعي وتطوير الهوية البصرية والتواصل المؤسسي", avatar: "س" },
  { id: 3, name: "محمد خالد الغامدي", role: "مسؤول التقنية", bio: "مطور برمجيات شغوف بالابتكار التقني ودمج التكنولوجيا مع الإبداع", avatar: "م" },
  { id: 4, name: "فاطمة علي الشهري", role: "مسؤولة الفعاليات", bio: "منظمة فعاليات محترفة تمتلك قدرة فائقة على خلق تجارب لا تُنسى", avatar: "ف" },
  { id: 5, name: "عمر يوسف القحطاني", role: "مسؤول التوثيق", bio: "مصور ومحتوى إبداعي يوثق رحلة المجموعة بعين فنية وأسلوب احترافي", avatar: "ع" },
];

const INITIAL_GAMES: Game[] = [
  {
    id: 1, title: "عقول متقدة", icon: "🧠",
    color: "from-orange-400 to-amber-600",
    description: "تحدِّ ذكاءك مع أسئلة تفكير نقدي متدرجة الصعوبة",
    players: "٢–٨ لاعبين", duration: "٣٠ دقيقة",
    instructions: "يطرح المحكّم سؤالاً، الفريق الذي يجيب أولاً وبشكل صحيح يكسب النقطة. الفريق الذي يجمع أكبر عدد من النقاط في ٣٠ دقيقة يفوز!"
  },
  {
    id: 2, title: "الرسّام المحترف", icon: "🎨",
    color: "from-amber-500 to-yellow-600",
    description: "ارسم وخمّن في جو من المرح والضحك المستمر",
    players: "٤–١٢ لاعباً", duration: "٤٥ دقيقة",
    instructions: "لاعب يرسم الكلمة السرية بدون أن يتكلم، وبقية الفريق يحاول التخمين في أقل من دقيقة. النقاط توزَّع حسب سرعة التخمين الصحيح."
  },
  {
    id: 3, title: "بناة المستقبل", icon: "🏗️",
    color: "from-yellow-500 to-orange-500",
    description: "تعاون مع فريقك لبناء أعلى برج من المواد المتاحة",
    players: "٢–٦ فرق", duration: "٦٠ دقيقة",
    instructions: "كل فريق يحصل على نفس المواد: أعواد، لاصق، ورق. الهدف بناء أعلى وأقوى هيكل يتحمل الوزن المحدد. الفريق ذو البرج الأعلى يفوز!"
  },
  {
    id: 4, title: "قصة بلا نهاية", icon: "📖",
    color: "from-orange-500 to-red-500",
    description: "كل مشارك يضيف جملة لبناء قصة جماعية مشتركة",
    players: "٥–٢٠ مشاركاً", duration: "٢٠ دقيقة",
    instructions: "يبدأ المحكّم بجملة افتتاحية، ثم يُكمل كل لاعب القصة بجملة واحدة فقط، دون رؤية ما كتبه الآخرون. في النهاية تُقرأ القصة كاملةً للجميع!"
  },
  {
    id: 5, title: "محاكاة القادة", icon: "⚡",
    color: "from-amber-600 to-orange-700",
    description: "تدريب على القيادة والقرارات الاستراتيجية الصعبة",
    players: "٦–١٨ مشاركاً", duration: "٩٠ دقيقة",
    instructions: "يتولى المشاركون أدواراً قيادية في سيناريوهات واقعية. يتخذون قرارات جماعية ثم يناقشون النتائج. يُقيَّم كل قائد بناءً على تأثير قراراته."
  },
  {
    id: 6, title: "مبتكرون صغار", icon: "💡",
    color: "from-yellow-400 to-amber-500",
    description: "ابتكر حلولاً خلاقة لمشكلات من الحياة اليومية",
    players: "٣–٥ أشخاص", duration: "٥٠ دقيقة",
    instructions: "يُعطى كل فريق مشكلة واقعية. المهمة ابتكار حل إبداعي وتقديمه أمام الجميع في ٥ دقائق. تُمنح الجائزة للحل الأكثر ابتكاراً وقابلية للتطبيق."
  },
];

const INITIAL_GALLERY: GalleryItem[] = [
  { id: 1, url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80", caption: "لقاء تأسيسي", category: "فعاليات" },
  { id: 2, url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80", caption: "ورشة إبداعية", category: "تدريب" },
  { id: 3, url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80", caption: "جلسة تخطيط", category: "تدريب" },
  { id: 4, url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80", caption: "فريق العمل", category: "فعاليات" },
  { id: 5, url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80", caption: "حفل تكريم", category: "احتفالات" },
  { id: 6, url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80", caption: "رحلة ثقافية", category: "رحلات" },
  { id: 7, url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80", caption: "مسابقة إبداعية", category: "فعاليات" },
  { id: 8, url: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&q=80", caption: "مجلس شهري", category: "اجتماعات" },
];

// ─────────────────────────────────────────────
// SVG ICONS
// ─────────────────────────────────────────────
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconCode = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);
const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const IconGrip = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <circle cx="9" cy="6" r="1" fill="currentColor" /><circle cx="15" cy="6" r="1" fill="currentColor" />
    <circle cx="9" cy="12" r="1" fill="currentColor" /><circle cx="15" cy="12" r="1" fill="currentColor" />
    <circle cx="9" cy="18" r="1" fill="currentColor" /><circle cx="15" cy="18" r="1" fill="currentColor" />
  </svg>
);
const IconUpload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ─────────────────────────────────────────────
// TOAST COMPONENT
// ─────────────────────────────────────────────
interface ToastProps { message: string; type: "success" | "error" | "info"; }
function Toast({ message, type }: ToastProps) {
  const colors = {
    success: "background: linear-gradient(135deg,#16a34a,#15803d); color:white",
    error:   "background: linear-gradient(135deg,#dc2626,#b91c1c); color:white",
    info:    "background: linear-gradient(135deg,#ED9004,#c97800); color:white",
  };
  return (
    <div className="toast" style={{ background: type === "success" ? "linear-gradient(135deg,#16a34a,#15803d)" : type === "error" ? "linear-gradient(135deg,#dc2626,#b91c1c)" : "linear-gradient(135deg,#ED9004,#c97800)", color: "white" }}>
      {message}
    </div>
  );
}

// ─────────────────────────────────────────────
// USE INTERSECTION OBSERVER (SCROLL ANIMATION)
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// HEADER COMPONENT
// ─────────────────────────────────────────────
function Header({ isAdmin, onLoginClick, onLogout }: { isAdmin: boolean; onLoginClick: () => void; onLogout: () => void; }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "الرئيسية", href: "#hero" },
    { label: "من نحن", href: "#about" },
    { label: "الأعضاء", href: "#members" },
    { label: "ألعابنا", href: "#games" },
    { label: "معرض الصور", href: "#gallery" },
    { label: "عضو الشهر", href: "#mom" },
  ];

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <header className="site-header" style={{ padding: "0 1rem", height: 70 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Left: Hamburger */}
          <button className={`hamburger-btn ${menuOpen ? "hamburger-open" : ""}`} onClick={() => setMenuOpen(v => !v)} aria-label="القائمة">
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>

          {/* Center: Banner + Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flex: 1, justifyContent: "center" }}>
            <img src={banner} alt="الإنجاز الإبداعي" style={{ height: 48, objectFit: "contain", borderRadius: 8 }} />
          </div>

          {/* Right: Admin button */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {isAdmin ? (
              <button className="btn-primary" style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem", display: "flex", alignItems: "center", gap: 4 }} onClick={onLogout}>
                <span style={{ width: 14, height: 14 }}><IconLogout /></span>
                خروج
              </button>
            ) : (
              <button className="btn-primary" style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem", display: "flex", alignItems: "center", gap: 4 }} onClick={onLoginClick}>
                <span style={{ width: 14, height: 14 }}><IconUser /></span>
                تسجيل الدخول
              </button>
            )}
          </div>
        </div>
        <div className="header-glow" />
      </header>

      {/* Side Nav */}
      <div className={`nav-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <nav className={`nav-menu ${menuOpen ? "open" : ""}`}>
        <div style={{ marginBottom: "2rem", borderBottom: "1px solid rgba(237,144,4,0.2)", paddingBottom: "1.5rem" }}>
          <img src={logoNoBg} alt="شعار" style={{ width: 70, height: 70, objectFit: "contain", display: "block", margin: "0 auto 0.5rem" }} />
          <p style={{ color: "rgba(237,144,4,0.9)", textAlign: "center", fontSize: "0.85rem", fontFamily: "'Amiri',serif" }}>الإنجاز الإبداعي</p>
        </div>
        {navLinks.map((l, i) => (
          <button key={l.href} onClick={() => scrollTo(l.href)}
            style={{ display: "block", width: "100%", textAlign: "right", padding: "0.85rem 1rem", color: "rgba(255,255,255,0.85)", background: "none", border: "none", borderRadius: 10, cursor: "pointer", fontSize: "1.05rem", fontFamily: "'Tajawal',sans-serif", fontWeight: 600, transition: "all 0.25s ease", animationDelay: `${i * 0.05}s` }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = "rgba(237,144,4,0.15)"; (e.target as HTMLButtonElement).style.color = "#f5a832"; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = "none"; (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.85)"; }}
          >
            {l.label}
          </button>
        ))}
        {isAdmin && (
          <div style={{ marginTop: "2rem", padding: "1rem", borderRadius: 12, background: "rgba(237,144,4,0.12)", border: "1px solid rgba(237,144,4,0.25)" }}>
            <p style={{ color: "var(--orange-light)", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.3rem" }}>✓ مدير النظام</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>لديك صلاحيات التعديل الكاملة</p>
          </div>
        )}
      </nav>
    </>
  );
}

// ─────────────────────────────────────────────
// AUTH MODAL
// ─────────────────────────────────────────────
function AuthModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void; }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (username === "Admin" && password === "Admin100") {
        onSuccess();
      } else {
        setError("بيانات الدخول غير صحيحة");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box glass-card" style={{ padding: "2.5rem 2rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#ED9004,#461506)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", boxShadow: "0 4px 20px rgba(237,144,4,0.4)" }}>
            <span style={{ width: 28, height: 28, color: "white" }}><IconLock /></span>
          </div>
          <h2 style={{ fontFamily: "'Amiri',serif", fontSize: "1.6rem", color: "var(--brown)", marginBottom: "0.3rem" }}>لوحة المدير</h2>
          <p style={{ color: "#888", fontSize: "0.9rem" }}>أدخل بيانات الدخول للمتابعة</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Username */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "#999", pointerEvents: "none" }}><IconUser /></span>
            <input
              className="form-input"
              style={{ paddingRight: "2.5rem" }}
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          {/* Password */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "#999", pointerEvents: "none" }}><IconLock /></span>
            <input
              className="form-input"
              style={{ paddingRight: "2.5rem", paddingLeft: "2.5rem" }}
              type={showPass ? "text" : "password"}
              placeholder="كلمة المرور"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button type="button" onClick={() => setShowPass(v => !v)}
              style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#888", width: 18, height: 18 }}>
              {showPass ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>

          {error && (
            <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 10, padding: "0.6rem 1rem", color: "#dc2626", fontSize: "0.9rem", textAlign: "center" }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ padding: "0.85rem", fontSize: "1.05rem", marginTop: "0.5rem" }} disabled={loading}>
            {loading ? <span style={{ display: "inline-block", animation: "spin-slow 1s linear infinite" }}>⟳</span> : "دخول"}
          </button>
        </form>

        <button onClick={onClose} style={{ position: "absolute", top: "1rem", left: "1rem", width: 32, height: 32, background: "rgba(0,0,0,0.08)", border: "none", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>
          <span style={{ width: 16, height: 16 }}><IconX /></span>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────
function HeroSection({ onScrollDown }: { onScrollDown: () => void }) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const px = mousePos.x * 30 - 15;
  const py = mousePos.y * 30 - 15;

  return (
    <section id="hero" className="hero-section" style={{ paddingTop: "calc(80px + 2rem)" }}>
      {/* Background orbs */}
      <div className="hero-orb" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(237,144,4,0.18) 0%, transparent 70%)", top: "-100px", right: "-100px", transform: `translate(${px}px, ${py}px)`, transition: "transform 0.8s ease" }} />
      <div className="hero-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(70,21,6,0.12) 0%, transparent 70%)", bottom: "0", left: "-80px", transform: `translate(${-px * 0.6}px, ${-py * 0.6}px)`, transition: "transform 0.8s ease" }} />
      <div className="hero-orb" style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(237,144,4,0.1) 0%, transparent 70%)", top: "40%", left: "40%", transform: `translate(${px * 0.4}px, ${py * 0.4}px)`, transition: "transform 0.8s ease" }} />

      {/* Islamic Pattern Overlay */}
      <div className="islamic-pattern" />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 800, padding: "0 1.5rem" }}>
        {/* Floating Logo */}
        <div className="about-img-wrapper animate-fadeInUp" style={{ display: "inline-block", marginBottom: "1.5rem" }}>
          <img src={logoNoBg} alt="شعار الإنجاز الإبداعي"
            style={{ width: 160, height: 160, objectFit: "contain", filter: "drop-shadow(0 8px 32px rgba(237,144,4,0.5))", transform: `perspective(800px) rotateY(${px * 0.06}deg) rotateX(${-py * 0.06}deg)`, transition: "transform 0.5s ease" }}
          />
        </div>

        <h1 className="shimmer-text animate-fadeInUp delay-100" style={{ fontFamily: "'Amiri',serif", fontSize: "clamp(2.2rem,6vw,4.5rem)", fontWeight: 700, lineHeight: 1.2, marginBottom: "0.5rem" }}>
          الإنجاز الإبداعي
        </h1>
        <p className="animate-fadeInUp delay-200" style={{ fontSize: "clamp(1rem,2.5vw,1.35rem)", color: "#5a3010", fontWeight: 400, marginBottom: "0.8rem", lineHeight: 1.7 }}>
          نبني الإبداع · نصنع الإنجاز · نحقق الأثر
        </p>
        <div className="animate-fadeInUp delay-300" style={{ display: "flex", justifyContent: "center", gap: "2rem", margin: "1rem 0 2rem", flexWrap: "wrap" }}>
          {[["٥+", "أعضاء"], ["٦", "ألعاب"], ["٨+", "فعاليات"]].map(([n, l]) => (
            <div key={l} className="glass-card-orange" style={{ padding: "0.8rem 1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--brown)" }}>{n}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--orange-dark)", fontWeight: 600 }}>{l}</div>
            </div>
          ))}
        </div>
        <div className="animate-fadeInUp delay-400" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" style={{ padding: "0.85rem 2rem", fontSize: "1.05rem" }} onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}>
            اكتشف أكثر
          </button>
          <button className="btn-dark" style={{ padding: "0.85rem 2rem", fontSize: "1.05rem" }} onClick={() => document.querySelector("#games")?.scrollIntoView({ behavior: "smooth" })}>
            ألعابنا
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fadeInUp delay-600" style={{ marginTop: "3rem", cursor: "pointer", opacity: 0.6 }} onClick={onScrollDown}>
          <div style={{ width: 28, height: 44, border: "2px solid var(--orange)", borderRadius: 14, margin: "0 auto", position: "relative" }}>
            <div style={{ width: 6, height: 6, background: "var(--orange)", borderRadius: "50%", position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", animation: "float 1.5s ease-in-out infinite" }} />
          </div>
          <p style={{ fontSize: "0.75rem", marginTop: "0.4rem", color: "var(--orange-dark)" }}>مرر للأسفل</p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// ABOUT SECTION
// ─────────────────────────────────────────────
function AboutSection() {
  const { ref, visible } = useScrollReveal();
  return (
    <section id="about" style={{ background: "linear-gradient(180deg,#fff8f0 0%,#fff 100%)" }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1rem" }}>
        <h2 className={`section-title gradient-text ${visible ? "animate-fadeInUp" : "opacity-0"}`}>من نحن</h2>
        <div className={`section-divider ${visible ? "animate-fadeInUp delay-100" : "opacity-0"}`} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "center" }}>
          {/* Text */}
          <div className={visible ? "animate-fadeInRight" : "opacity-0"} style={{ order: 1 }}>
            {[
              ["رؤيتنا", "أن نكون منصة إبداعية رائدة تُنمّي المواهب الشابة وتُحوّل الأفكار إلى إنجازات ملموسة تخدم المجتمع."],
              ["رسالتنا", "تمكين الأعضاء من خلال برامج تطوير مبتكرة، وخلق بيئة محفّزة تجمع بين التعلّم والإبداع والمتعة."],
              ["قيمنا", "الإبداع · الاحترام · التعاون · التميّز · المسؤولية المجتمعية"],
            ].map(([t, c], i) => (
              <div key={t} className="glass-card" style={{ padding: "1.2rem 1.5rem", marginBottom: "1rem", animationDelay: `${0.2 + i * 0.1}s` }}>
                <h3 style={{ color: "var(--orange-dark)", fontWeight: 700, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, background: "var(--orange)", borderRadius: "50%", display: "inline-block" }} />
                  {t}
                </h3>
                <p style={{ color: "#555", lineHeight: 1.8, fontSize: "0.95rem" }}>{c}</p>
              </div>
            ))}
          </div>

          {/* Image */}
          <div className={visible ? "animate-fadeInLeft" : "opacity-0"} style={{ order: 2, display: "flex", justifyContent: "center" }}>
            <div className="about-img-wrapper">
              <div style={{
                width: 300, height: 300, borderRadius: 28,
                background: "linear-gradient(135deg,#ED9004 0%,#c97800 50%,#461506 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 20px 60px rgba(237,144,4,0.35)",
                position: "relative", overflow: "hidden"
              }}>
                <img src={banner} alt="بانر الإنجاز الإبداعي" style={{ width: "90%", objectFit: "contain", filter: "brightness(1.1)" }} />
                {/* Decorative circles */}
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                <div style={{ position: "absolute", bottom: -30, left: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={`${visible ? "animate-fadeInUp delay-400" : "opacity-0"}`} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "1rem", marginTop: "3rem" }}>
          {[
            { icon: "🎯", label: "هدفنا الأسمى", val: "التميّز" },
            { icon: "🌟", label: "أعضاء نشطون", val: "٥+" },
            { icon: "🏆", label: "فعاليات منجزة", val: "٨+" },
            { icon: "💡", label: "أفكار مبتكرة", val: "∞" },
          ].map(s => (
            <div key={s.label} className="glass-card-orange" style={{ padding: "1.2rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>{s.icon}</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--brown)" }}>{s.val}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--orange-dark)", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// MEMBERS SECTION
// ─────────────────────────────────────────────
function MembersSection({ isAdmin }: { isAdmin: boolean }) {
  const { ref, visible } = useScrollReveal();
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", role: "", bio: "", avatar: "" });

  const handleDragStart = (i: number) => { if (!isAdmin) return; setDragIdx(i); };
  const handleDragOver = (e: React.DragEvent, i: number) => { e.preventDefault(); setOverIdx(i); };
  const handleDrop = (i: number) => {
    if (dragIdx === null || dragIdx === i) { setDragIdx(null); setOverIdx(null); return; }
    const arr = [...members];
    const [item] = arr.splice(dragIdx, 1);
    arr.splice(i, 0, item);
    setMembers(arr);
    setDragIdx(null); setOverIdx(null);
  };

  const deleteMember = (id: number) => setMembers(m => m.filter(x => x.id !== id));
  const addMember = () => {
    if (!newMember.name.trim()) return;
    setMembers(m => [...m, { ...newMember, id: Date.now(), avatar: newMember.avatar || newMember.name[0] }]);
    setNewMember({ name: "", role: "", bio: "", avatar: "" });
    setShowAdd(false);
  };
  const saveEdit = () => {
    if (!editingMember) return;
    setMembers(m => m.map(x => x.id === editingMember.id ? editingMember : x));
    setEditingMember(null);
  };

  return (
    <section id="members" style={{ background: "linear-gradient(180deg,#fff 0%,#fff8f0 100%)" }}>
      <div ref={ref} style={{ maxWidth: 900, margin: "0 auto", padding: "0 1rem" }}>
        <h2 className={`section-title gradient-text ${visible ? "animate-fadeInUp" : "opacity-0"}`}>أعضاء المجموعة</h2>
        <div className={`section-divider ${visible ? "animate-fadeInUp delay-100" : "opacity-0"}`} />

        {isAdmin && (
          <div className={`${visible ? "animate-fadeInUp delay-200" : "opacity-0"}`} style={{ textAlign: "center", marginBottom: "2rem" }}>
            <button className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6 }} onClick={() => setShowAdd(v => !v)}>
              <span style={{ width: 18, height: 18 }}><IconPlus /></span>
              إضافة عضو
            </button>
            <p style={{ color: "#888", fontSize: "0.8rem", marginTop: "0.5rem" }}>اسحب الأعضاء لإعادة الترتيب</p>
          </div>
        )}

        {/* Add Member Form */}
        {isAdmin && showAdd && (
          <div className="glass-card animate-fadeInUp" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "var(--brown)", fontWeight: 700 }}>عضو جديد</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
              <input className="form-input" placeholder="الاسم *" value={newMember.name} onChange={e => setNewMember(v => ({ ...v, name: e.target.value }))} />
              <input className="form-input" placeholder="الدور" value={newMember.role} onChange={e => setNewMember(v => ({ ...v, role: e.target.value }))} />
              <input className="form-input" placeholder="الرمز (حرف)" value={newMember.avatar} onChange={e => setNewMember(v => ({ ...v, avatar: e.target.value }))} maxLength={2} />
              <input className="form-input" placeholder="نبذة مختصرة" value={newMember.bio} onChange={e => setNewMember(v => ({ ...v, bio: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button className="btn-primary" onClick={addMember}>إضافة</button>
              <button className="btn-dark" onClick={() => setShowAdd(false)}>إلغاء</button>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {members.map((m, i) => (
            <div
              key={m.id}
              className={`timeline-item ${dragIdx === i ? "dragging" : ""} ${overIdx === i ? "drag-over" : ""} ${visible ? "animate-fadeInUp" : "opacity-0"}`}
              style={{ animationDelay: `${0.15 + i * 0.08}s` }}
              draggable={isAdmin}
              onDragStart={() => handleDragStart(i)}
              onDragOver={e => handleDragOver(e, i)}
              onDrop={() => handleDrop(i)}
              onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
            >
              {/* Line */}
              {i < members.length - 1 && <div className="timeline-line" />}

              {/* Dot */}
              <div className="timeline-dot">
                {m.avatar || m.name[0]}
              </div>

              {/* Card */}
              <div className="timeline-card glass-card" style={{ padding: "1.2rem 1.5rem", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--brown)", marginBottom: "0.2rem" }}>{m.name}</h3>
                    <span style={{ background: "linear-gradient(135deg,rgba(237,144,4,0.15),rgba(237,144,4,0.05))", color: "var(--orange-dark)", fontSize: "0.8rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: 999, border: "1px solid rgba(237,144,4,0.25)" }}>
                      {m.role}
                    </span>
                  </div>
                  {isAdmin && (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#888", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, transition: "all 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--orange)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#888")}
                        onClick={() => setEditingMember({ ...m })} title="تعديل">
                        <span style={{ width: 16, height: 16 }}><IconEdit /></span>
                      </button>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#888", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, transition: "all 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#dc2626")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#888")}
                        onClick={() => deleteMember(m.id)} title="حذف">
                        <span style={{ width: 16, height: 16 }}><IconTrash /></span>
                      </button>
                      <div style={{ cursor: "grab", color: "#bbb", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ width: 16, height: 16 }}><IconGrip /></span>
                      </div>
                    </div>
                  )}
                </div>
                {m.bio && <p style={{ color: "#666", fontSize: "0.9rem", lineHeight: 1.7, marginTop: "0.6rem" }}>{m.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingMember && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setEditingMember(null)}>
          <div className="modal-box glass-card" style={{ padding: "2rem" }}>
            <h3 style={{ marginBottom: "1.5rem", color: "var(--brown)", fontWeight: 700, fontSize: "1.2rem" }}>تعديل العضو</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <input className="form-input" placeholder="الاسم" value={editingMember.name} onChange={e => setEditingMember(v => v ? { ...v, name: e.target.value } : v)} />
              <input className="form-input" placeholder="الدور" value={editingMember.role} onChange={e => setEditingMember(v => v ? { ...v, role: e.target.value } : v)} />
              <input className="form-input" placeholder="النبذة" value={editingMember.bio} onChange={e => setEditingMember(v => v ? { ...v, bio: e.target.value } : v)} />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn-primary" onClick={saveEdit}>حفظ</button>
                <button className="btn-dark" onClick={() => setEditingMember(null)}>إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────
// GAMES SECTION
// ─────────────────────────────────────────────
function GamesSection({ isAdmin }: { isAdmin: boolean }) {
  const { ref, visible } = useScrollReveal();
  const [games, setGames] = useState<Game[]>(INITIAL_GAMES);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newGame, setNewGame] = useState({ title: "", description: "", icon: "🎮", color: "from-orange-400 to-amber-600", players: "", duration: "", instructions: "" });
  const [tilt, setTilt] = useState<Record<number, { x: number; y: number }>>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setTilt(t => ({ ...t, [id]: { x, y } }));
  };
  const clearTilt = (id: number) => setTilt(t => ({ ...t, [id]: { x: 0, y: 0 } }));

  const addGame = () => {
    if (!newGame.title) return;
    setGames(g => [...g, { ...newGame, id: Date.now() }]);
    setNewGame({ title: "", description: "", icon: "🎮", color: "from-orange-400 to-amber-600", players: "", duration: "", instructions: "" });
    setShowAdd(false);
  };
  const deleteGame = (id: number) => setGames(g => g.filter(x => x.id !== id));
  const saveEditGame = () => {
    if (!editingGame) return;
    setGames(g => g.map(x => x.id === editingGame.id ? editingGame : x));
    setEditingGame(null);
  };

  return (
    <section id="games" style={{ background: "linear-gradient(180deg,#fff8f0 0%,#fffaf5 100%)" }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1rem" }}>
        <h2 className={`section-title gradient-text ${visible ? "animate-fadeInUp" : "opacity-0"}`}>ألعابنا التفاعلية</h2>
        <div className={`section-divider ${visible ? "animate-fadeInUp delay-100" : "opacity-0"}`} />

        {isAdmin && (
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <button className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6 }} onClick={() => setShowAdd(v => !v)}>
              <span style={{ width: 18, height: 18 }}><IconPlus /></span>
              إضافة لعبة
            </button>
          </div>
        )}

        {isAdmin && showAdd && (
          <div className="glass-card animate-fadeInUp" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "var(--brown)", fontWeight: 700 }}>لعبة جديدة</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "0.8rem" }}>
              <input className="form-input" placeholder="اسم اللعبة *" value={newGame.title} onChange={e => setNewGame(v => ({ ...v, title: e.target.value }))} />
              <input className="form-input" placeholder="الأيقونة (emoiji)" value={newGame.icon} onChange={e => setNewGame(v => ({ ...v, icon: e.target.value }))} />
              <input className="form-input" placeholder="عدد اللاعبين" value={newGame.players} onChange={e => setNewGame(v => ({ ...v, players: e.target.value }))} />
              <input className="form-input" placeholder="المدة" value={newGame.duration} onChange={e => setNewGame(v => ({ ...v, duration: e.target.value }))} />
              <input className="form-input" placeholder="وصف مختصر" value={newGame.description} onChange={e => setNewGame(v => ({ ...v, description: e.target.value }))} style={{ gridColumn: "1 / -1" }} />
              <textarea className="form-input" placeholder="تعليمات اللعبة" value={newGame.instructions} onChange={e => setNewGame(v => ({ ...v, instructions: e.target.value }))} rows={2} style={{ gridColumn: "1 / -1", resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button className="btn-primary" onClick={addGame}>إضافة</button>
              <button className="btn-dark" onClick={() => setShowAdd(false)}>إلغاء</button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.5rem" }}>
          {games.map((g, i) => {
            const t = tilt[g.id] || { x: 0, y: 0 };
            return (
              <div
                key={g.id}
                className={`game-card glass-card ${visible ? "animate-fadeInUp" : "opacity-0"}`}
                style={{ padding: "1.5rem", animationDelay: `${0.1 + i * 0.07}s`, transform: `perspective(600px) rotateX(${t.y}deg) rotateY(${t.x}deg)`, cursor: "pointer" }}
                onMouseMove={e => handleMouseMove(e, g.id)}
                onMouseLeave={() => clearTilt(g.id)}
                onClick={() => setActiveGame(g)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>{g.icon}</div>
                  {isAdmin && (
                    <div style={{ display: "flex", gap: 2 }} onClick={e => e.stopPropagation()}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
                        onClick={() => setEditingGame({ ...g })}>
                        <span style={{ width: 14, height: 14 }}><IconEdit /></span>
                      </button>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
                        onClick={() => deleteGame(g.id)}>
                        <span style={{ width: 14, height: 14 }}><IconTrash /></span>
                      </button>
                    </div>
                  )}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--brown)", marginBottom: "0.5rem" }}>{g.title}</h3>
                <p style={{ color: "#666", fontSize: "0.88rem", lineHeight: 1.65, marginBottom: "1rem" }}>{g.description}</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ background: "rgba(237,144,4,0.12)", color: "var(--orange-dark)", fontSize: "0.75rem", padding: "0.25rem 0.6rem", borderRadius: 999, fontWeight: 600 }}>👥 {g.players}</span>
                  <span style={{ background: "rgba(70,21,6,0.08)", color: "var(--brown)", fontSize: "0.75rem", padding: "0.25rem 0.6rem", borderRadius: 999, fontWeight: 600 }}>⏱ {g.duration}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Game Modal */}
      {activeGame && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setActiveGame(null)}>
          <div className="modal-box glass-card" style={{ padding: "2.5rem 2rem" }}>
            <button onClick={() => setActiveGame(null)} style={{ position: "absolute", top: "1rem", left: "1rem", background: "rgba(0,0,0,0.07)", border: "none", borderRadius: 8, cursor: "pointer", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>
              <span style={{ width: 16, height: 16 }}><IconX /></span>
            </button>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>{activeGame.icon}</div>
              <h2 style={{ fontFamily: "'Amiri',serif", fontSize: "1.8rem", color: "var(--brown)", fontWeight: 700 }}>{activeGame.title}</h2>
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "0.5rem" }}>
                <span style={{ background: "rgba(237,144,4,0.15)", color: "var(--orange-dark)", padding: "0.25rem 0.7rem", borderRadius: 999, fontSize: "0.85rem", fontWeight: 600 }}>👥 {activeGame.players}</span>
                <span style={{ background: "rgba(70,21,6,0.08)", color: "var(--brown)", padding: "0.25rem 0.7rem", borderRadius: 999, fontSize: "0.85rem", fontWeight: 600 }}>⏱ {activeGame.duration}</span>
              </div>
            </div>
            <p style={{ color: "#555", lineHeight: 1.8, marginBottom: "1rem", textAlign: "center" }}>{activeGame.description}</p>
            <div style={{ background: "linear-gradient(135deg,rgba(237,144,4,0.08),rgba(70,21,6,0.04))", borderRadius: 12, padding: "1rem 1.2rem", border: "1px solid rgba(237,144,4,0.2)" }}>
              <h4 style={{ color: "var(--orange-dark)", fontWeight: 700, marginBottom: "0.5rem" }}>📋 طريقة اللعب</h4>
              <p style={{ color: "#555", lineHeight: 1.8, fontSize: "0.95rem" }}>{activeGame.instructions}</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Game Modal */}
      {editingGame && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setEditingGame(null)}>
          <div className="modal-box glass-card" style={{ padding: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", fontWeight: 700, color: "var(--brown)" }}>تعديل اللعبة</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <input className="form-input" value={editingGame.title} onChange={e => setEditingGame(v => v ? { ...v, title: e.target.value } : v)} placeholder="الاسم" />
              <input className="form-input" value={editingGame.icon} onChange={e => setEditingGame(v => v ? { ...v, icon: e.target.value } : v)} placeholder="الأيقونة" />
              <input className="form-input" value={editingGame.description} onChange={e => setEditingGame(v => v ? { ...v, description: e.target.value } : v)} placeholder="الوصف" />
              <input className="form-input" value={editingGame.players} onChange={e => setEditingGame(v => v ? { ...v, players: e.target.value } : v)} placeholder="اللاعبون" />
              <input className="form-input" value={editingGame.duration} onChange={e => setEditingGame(v => v ? { ...v, duration: e.target.value } : v)} placeholder="المدة" />
              <textarea className="form-input" value={editingGame.instructions} onChange={e => setEditingGame(v => v ? { ...v, instructions: e.target.value } : v)} placeholder="التعليمات" rows={3} style={{ resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button className="btn-primary" onClick={saveEditGame}>حفظ</button>
              <button className="btn-dark" onClick={() => setEditingGame(null)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────
// GALLERY SECTION
// ─────────────────────────────────────────────
function GallerySection({ isAdmin }: { isAdmin: boolean }) {
  const { ref, visible } = useScrollReveal();
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [lbIdx, setLbIdx] = useState(0);
  const [filter, setFilter] = useState("الكل");
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const categories = ["الكل", ...Array.from(new Set(gallery.map(g => g.category)))];
  const filtered = filter === "الكل" ? gallery : gallery.filter(g => g.category === filter);

  const openLightbox = (item: GalleryItem) => {
    const i = filtered.findIndex(g => g.id === item.id);
    setLbIdx(i); setLightbox(item);
  };
  const prev = () => { const i = (lbIdx - 1 + filtered.length) % filtered.length; setLbIdx(i); setLightbox(filtered[i]); };
  const next = () => { const i = (lbIdx + 1) % filtered.length; setLbIdx(i); setLightbox(filtered[i]); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === "ArrowLeft") next();
      if (e.key === "ArrowRight") prev();
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, lbIdx]);

  const addItem = () => {
    if (!newUrl) return;
    setGallery(g => [...g, { id: Date.now(), url: newUrl, caption: newCaption, category: newCategory || "متنوع" }]);
    setNewUrl(""); setNewCaption(""); setNewCategory(""); setShowAdd(false);
  };

  return (
    <section id="gallery" style={{ background: "linear-gradient(180deg,#fffaf5 0%,#fff8f0 100%)" }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1rem" }}>
        <h2 className={`section-title gradient-text ${visible ? "animate-fadeInUp" : "opacity-0"}`}>معرض الصور</h2>
        <div className={`section-divider ${visible ? "animate-fadeInUp delay-100" : "opacity-0"}`} />

        {/* Filter Tabs */}
        <div className={`${visible ? "animate-fadeInUp delay-200" : "opacity-0"}`} style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              style={{ padding: "0.4rem 1rem", borderRadius: 999, border: "1.5px solid", cursor: "pointer", transition: "all 0.3s ease", fontFamily: "'Tajawal',sans-serif", fontWeight: 600, fontSize: "0.9rem",
                borderColor: filter === c ? "var(--orange)" : "rgba(70,21,6,0.2)",
                background: filter === c ? "linear-gradient(135deg,var(--orange),var(--orange-dark))" : "rgba(255,255,255,0.7)",
                color: filter === c ? "white" : "var(--brown)" }}>
              {c}
            </button>
          ))}
        </div>

        {isAdmin && (
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <button className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6 }} onClick={() => setShowAdd(v => !v)}>
              <span style={{ width: 18, height: 18 }}><IconPlus /></span>
              إضافة صورة
            </button>
          </div>
        )}

        {isAdmin && showAdd && (
          <div className="glass-card animate-fadeInUp" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "var(--brown)", fontWeight: 700 }}>صورة جديدة</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "0.8rem" }}>
              <input className="form-input" placeholder="رابط الصورة *" value={newUrl} onChange={e => setNewUrl(e.target.value)} style={{ gridColumn: "1 / -1" }} />
              <input className="form-input" placeholder="التسمية" value={newCaption} onChange={e => setNewCaption(e.target.value)} />
              <input className="form-input" placeholder="التصنيف" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button className="btn-primary" onClick={addItem}>إضافة</button>
              <button className="btn-dark" onClick={() => setShowAdd(false)}>إلغاء</button>
            </div>
          </div>
        )}

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "1rem" }}>
          {filtered.map((item, i) => (
            <div key={item.id} className={`gallery-item ${visible ? "animate-fadeInUp" : "opacity-0"}`}
              style={{ animationDelay: `${0.1 + i * 0.06}s`, position: "relative" }}
              onClick={() => openLightbox(item)}>
              <img src={item.url} alt={item.caption} loading="lazy" onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300/ED9004/fff?text=صورة"; }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,rgba(70,21,6,0.7) 0%,transparent 60%)", opacity: 0, transition: "opacity 0.3s ease", display: "flex", alignItems: "flex-end", padding: "0.8rem" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0")}>
                <div>
                  <p style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>{item.caption}</p>
                  <span style={{ color: "rgba(237,144,4,0.9)", fontSize: "0.75rem" }}>{item.category}</span>
                </div>
                {isAdmin && (
                  <button style={{ position: "absolute", top: 8, left: 8, background: "rgba(220,38,38,0.8)", border: "none", borderRadius: 6, cursor: "pointer", color: "white", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
                    onClick={e => { e.stopPropagation(); setGallery(g => g.filter(x => x.id !== item.id)); }}>
                    <span style={{ width: 14, height: 14 }}><IconTrash /></span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button onClick={e => { e.stopPropagation(); prev(); }}
            style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "50%", width: 48, height: 48, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white", transition: "all 0.2s" }}>
            <span style={{ width: 22, height: 22 }}><IconChevronRight /></span>
          </button>
          <div onClick={e => e.stopPropagation()} style={{ textAlign: "center" }}>
            <img src={lightbox.url} alt={lightbox.caption} />
            <div style={{ marginTop: "1rem" }}>
              <p style={{ color: "white", fontSize: "1.1rem", fontWeight: 600 }}>{lightbox.caption}</p>
              <p style={{ color: "rgba(237,144,4,0.8)", fontSize: "0.85rem" }}>{lightbox.category}</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: "0.3rem" }}>{lbIdx + 1} / {filtered.length}</p>
            </div>
          </div>
          <button onClick={e => { e.stopPropagation(); next(); }}
            style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "50%", width: 48, height: 48, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white", transition: "all 0.2s" }}>
            <span style={{ width: 22, height: 22 }}><IconChevronLeft /></span>
          </button>
          <button onClick={() => setLightbox(null)}
            style={{ position: "absolute", top: "1rem", left: "1rem", background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <span style={{ width: 18, height: 18 }}><IconX /></span>
          </button>
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────
// MEMBER OF THE MONTH
// ─────────────────────────────────────────────
function MemberOfMonthSection({ isAdmin }: { isAdmin: boolean }) {
  const { ref, visible } = useScrollReveal();
  const [mom, setMom] = useState<MemberOfMonth>({ name: "أحمد محمد الزهراني", achievement: "قاد فريقه بنجاح نحو إطلاق أول مشروع رقمي للمجموعة، وحقق نتائج استثنائية تجاوزت جميع التوقعات المحددة.", imageUrl: null });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMom(m => ({ ...m, imageUrl: url }));
  };

  return (
    <section id="mom" style={{ background: "linear-gradient(180deg,#fff8f0 0%,#fff 100%)" }}>
      <div ref={ref} style={{ maxWidth: 900, margin: "0 auto", padding: "0 1rem" }}>
        <h2 className={`section-title gradient-text ${visible ? "animate-fadeInUp" : "opacity-0"}`}>عضو الشهر</h2>
        <div className={`section-divider ${visible ? "animate-fadeInUp delay-100" : "opacity-0"}`} />

        <div className={`${visible ? "animate-scaleIn delay-200" : "opacity-0"}`}>
          <div className="mom-bg">
            {mom.imageUrl && <img src={mom.imageUrl} alt="عضو الشهر" style={{ objectFit: "cover" }} />}
            {!mom.imageUrl && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: "8rem", opacity: 0.15 }}>⭐</div>
              </div>
            )}
            <div className="mom-overlay">
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#ED9004,#c97800)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 20px rgba(237,144,4,0.5)", border: "3px solid rgba(237,144,4,0.5)" }}>
                  <span style={{ color: "white", fontSize: "1.8rem", width: 30, height: 30 }}><IconStar /></span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "rgba(237,144,4,0.9)", fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.3rem" }}>🏆 عضو شهر {new Date().toLocaleDateString("ar-SA", { month: "long", year: "numeric" })}</p>
                  {isAdmin ? (
                    <input
                      className="form-input"
                      value={mom.name}
                      onChange={e => setMom(m => ({ ...m, name: e.target.value }))}
                      style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)", marginBottom: "0.5rem", fontSize: "1.5rem", fontWeight: 700 }}
                    />
                  ) : (
                    <h2 style={{ color: "white", fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.5rem", fontFamily: "'Amiri',serif" }}>{mom.name}</h2>
                  )}
                  {isAdmin ? (
                    <textarea
                      className="form-input"
                      value={mom.achievement}
                      onChange={e => setMom(m => ({ ...m, achievement: e.target.value }))}
                      rows={2}
                      style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.3)", resize: "vertical" }}
                    />
                  ) : (
                    <p style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.75, fontSize: "0.98rem" }}>{mom.achievement}</p>
                  )}
                </div>
              </div>
              {isAdmin && (
                <div style={{ marginTop: "1rem" }}>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                  <button className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem" }} onClick={() => fileRef.current?.click()}>
                    <span style={{ width: 16, height: 16 }}><IconUpload /></span>
                    {mom.imageUrl ? "تغيير الصورة" : "رفع صورة الخلفية"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CODE VIEWER MODAL
// ─────────────────────────────────────────────
function CodeViewerModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [activeFile, setActiveFile] = useState<"app" | "css">("app");

  const appCode = `/**
 * الإنجاز الإبداعي — الملف الرئيسي (App.tsx)
 * موقع رسمي كامل في ملف واحد
 *
 * المكونات:
 * - Header        : شريط التنقل مع القائمة المنزلقة
 * - AuthModal     : نافذة تسجيل دخول المدير (Admin / Admin100)
 * - HeroSection   : القسم الرئيسي مع تأثير الماوس
 * - AboutSection  : قسم "من نحن" مع صورة عائمة
 * - MembersSection: قائمة الأعضاء مع السحب والإفلات
 * - GamesSection  : شبكة الألعاب مع الميلان بالماوس
 * - GallerySection: معرض الصور مع Lightbox
 * - MemberOfMonth : عضو الشهر مع رفع الصورة
 * - CodeViewer    : عارض الكود (هذه النافذة)
 *
 * المصادقة: Admin / Admin100
 * الألوان: #ED9004 (برتقالي) + #461506 (بني داكن)
 * الخطوط: Tajawal + Amiri (Google Fonts)
 *
 * تقنيات: React 18 + TypeScript + Tailwind CSS
 * الاتجاه: RTL (عربي بالكامل)
 */

// راجع artifacts/injaz-website/src/App.tsx للكود الكامل
// وartifacts/injaz-website/src/index.css للأنماط الكاملة`;

  const cssNote = `/* ملف التنسيق الكامل في: artifacts/injaz-website/src/index.css */
/* يحتوي على:
   - متغيرات الألوان (--orange: #ED9004, --brown: #461506)
   - جميع @keyframes للحركات
   - فئات .glass-card و .btn-primary
   - أنماط الهيدر والقوائم
   - أنماط المعرض والـ Lightbox
   - أنماط الجدول الزمني للأعضاء
   - تصميم متجاوب لجميع الشاشات
*/`;

  const handleCopy = () => {
    const text = activeFile === "app" ? appCode : cssNote;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: "min(900px, 96vw)", animation: "modalContent 0.35s cubic-bezier(0.23,1,0.32,1)" }}>
        <div style={{ background: "#1a1a1a", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(237,144,4,0.25)", boxShadow: "0 25px 80px rgba(0,0,0,0.7)" }}>
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg,#461506,#2a0d03)", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(237,144,4,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <span style={{ width: 22, height: 22, color: "var(--orange)" }}><IconCode /></span>
              <h2 style={{ color: "white", fontFamily: "'Tajawal',sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>كود الموقع</h2>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleCopy} className="btn-primary" style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 14, height: 14 }}>{copied ? <IconCheck /> : <IconCopy />}</span>
                {copied ? "تم النسخ!" : "نسخ"}
              </button>
              <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, cursor: "pointer", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                <span style={{ width: 16, height: 16 }}><IconX /></span>
              </button>
            </div>
          </div>

          {/* File Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#111" }}>
            {(["app", "css"] as const).map(f => (
              <button key={f} onClick={() => setActiveFile(f)}
                style={{ padding: "0.6rem 1.2rem", background: "none", border: "none", cursor: "pointer", fontFamily: "'Courier New',monospace", fontSize: "0.82rem", transition: "all 0.2s",
                  color: activeFile === f ? "var(--orange)" : "rgba(255,255,255,0.4)",
                  borderBottom: activeFile === f ? "2px solid var(--orange)" : "2px solid transparent" }}>
                {f === "app" ? "App.tsx" : "index.css"}
              </button>
            ))}
          </div>

          {/* Code */}
          <div className="code-viewer" style={{ borderRadius: 0 }}>
            {/* Window dots */}
            <div style={{ position: "absolute", top: 0, right: 0, left: 0, height: 32, background: "#0d0d0d", display: "flex", alignItems: "center", padding: "0 1rem", gap: 6 }}>
              {["#ff5f56","#ffbd2e","#27c93f"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
              <span style={{ marginRight: "auto", color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", fontFamily: "monospace" }}>
                {activeFile === "app" ? "artifacts/injaz-website/src/App.tsx" : "artifacts/injaz-website/src/index.css"}
              </span>
            </div>
            <pre style={{ paddingTop: "2.5rem" }}>
              <code style={{ color: "#a8d8a8" }}>
                {activeFile === "app" ? appCode : cssNote}
              </code>
            </pre>
          </div>

          {/* Footer note */}
          <div style={{ background: "rgba(237,144,4,0.08)", borderTop: "1px solid rgba(237,144,4,0.15)", padding: "0.8rem 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: "var(--orange)", fontSize: "0.85rem" }}>💡</span>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", fontFamily: "'Tajawal',sans-serif" }}>
              الملفات الكاملة موجودة في <code style={{ color: "var(--orange)", background: "rgba(237,144,4,0.12)", padding: "0 4px", borderRadius: 4 }}>artifacts/injaz-website/src/</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
function Footer({ onShowCode }: { onShowCode: () => void }) {
  return (
    <footer className="site-footer">
      {/* Islamic decoration */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(45deg,rgba(237,144,4,0.8) 0,rgba(237,144,4,0.8) 1px,transparent 0,transparent 50%),repeating-linear-gradient(-45deg,rgba(237,144,4,0.8) 0,rgba(237,144,4,0.8) 1px,transparent 0,transparent 50%)", backgroundSize: "25px 25px", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
        <img src={logoNoBg} alt="شعار" style={{ width: 70, height: 70, objectFit: "contain", display: "block", margin: "0 auto 1rem", filter: "drop-shadow(0 4px 12px rgba(237,144,4,0.4))" }} />
        <h3 style={{ fontFamily: "'Amiri',serif", fontSize: "1.4rem", color: "rgba(237,144,4,0.9)", marginBottom: "0.4rem" }}>الإنجاز الإبداعي</h3>
        <p style={{ fontSize: "0.9rem", marginBottom: "2rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
          نبني الإبداع · نصنع الإنجاز · نحقق الأثر
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          {["الرئيسية", "من نحن", "الأعضاء", "الألعاب", "المعرض"].map(l => (
            <button key={l} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.55)", cursor: "pointer", fontFamily: "'Tajawal',sans-serif", fontSize: "0.9rem", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(237,144,4,0.9)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
              onClick={() => document.querySelector(`#${l === "الرئيسية" ? "hero" : l === "من نحن" ? "about" : l === "الأعضاء" ? "members" : l === "الألعاب" ? "games" : "gallery"}`)?.scrollIntoView({ behavior: "smooth" })}>
              {l}
            </button>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(237,144,4,0.15)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)" }}>
            © {new Date().getFullYear()} الإنجاز الإبداعي — جميع الحقوق محفوظة
          </p>
          <button onClick={onShowCode}
            style={{ background: "rgba(237,144,4,0.12)", border: "1px solid rgba(237,144,4,0.25)", borderRadius: 10, padding: "0.5rem 1rem", cursor: "pointer", color: "rgba(237,144,4,0.8)", fontFamily: "'Tajawal',sans-serif", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6, transition: "all 0.3s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(237,144,4,0.22)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(237,144,4,0.5)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(237,144,4,0.12)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(237,144,4,0.25)"; }}>
            <span style={{ width: 16, height: 16 }}><IconCode /></span>
            عرض كود الموقع
          </button>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// FLOATING CODE BUTTON (always visible)
// ─────────────────────────────────────────────
function FloatingCodeButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 800, width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#461506,#8b3010)", border: "2px solid rgba(237,144,4,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(237,144,4,0.9)", boxShadow: "0 4px 20px rgba(70,21,6,0.4)", transition: "all 0.3s ease" }}
      title="عرض كود الموقع"
      onMouseEnter={e => { (e.currentTarget).style.transform = "scale(1.12)"; (e.currentTarget).style.boxShadow = "0 8px 30px rgba(237,144,4,0.4)"; }}
      onMouseLeave={e => { (e.currentTarget).style.transform = "scale(1)"; (e.currentTarget).style.boxShadow = "0 4px 20px rgba(70,21,6,0.4)"; }}>
      <span style={{ width: 22, height: 22 }}><IconCode /></span>
    </button>
  );
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error" | "info" = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setShowAuth(false);
    showToast("مرحباً بك! تم تسجيل دخولك كمدير", "success");
  };

  const handleLogout = () => {
    setIsAdmin(false);
    showToast("تم تسجيل خروجك بنجاح", "info");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      {/* Header */}
      <Header isAdmin={isAdmin} onLoginClick={() => setShowAuth(true)} onLogout={handleLogout} />

      {/* Main Sections */}
      <main>
        <HeroSection onScrollDown={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })} />
        <AboutSection />
        <MembersSection isAdmin={isAdmin} />
        <GamesSection isAdmin={isAdmin} />
        <GallerySection isAdmin={isAdmin} />
        <MemberOfMonthSection isAdmin={isAdmin} />
      </main>

      {/* Footer */}
      <Footer onShowCode={() => setShowCode(true)} />

      {/* Floating Code Button */}
      <FloatingCodeButton onClick={() => setShowCode(true)} />

      {/* Modals */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleLoginSuccess} />}
      {showCode && <CodeViewerModal onClose={() => setShowCode(false)} />}

      {/* Toast */}
      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  );
}
