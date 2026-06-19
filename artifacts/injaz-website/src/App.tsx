/**
 * الإنجاز الإبداعي — موقع رسمي كامل
 * يدعم: وضع ليلي/فاتح + خلفية البانر الإسلامية + لوحة مدير
 */

import { useState, useEffect, useRef, useCallback } from "react";
import logoNoBg from "/logo-nobg.png";
import banner from "/banner.png";
import appRaw from "./App.tsx?raw";
import cssRaw from "./index.css?raw";

// ─────────────────────────────────────────────
// PERSISTENT STORAGE HOOK
// يحفظ أي بيانات في localStorage تلقائياً
// ─────────────────────────────────────────────
function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });
  const set = useCallback((v: T | ((prev: T) => T)) => {
    setState(prev => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);
  return [state, set];
}

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Member { id: number; name: string; role: string; bio: string; avatar: string; }
interface Game { id: number; title: string; description: string; icon: string; color: string; players: string; duration: string; instructions: string; }
interface GalleryItem { id: number; url: string; caption: string; category: string; }
interface MemberOfMonth { name: string; achievement: string; imageUrl: string | null; }
interface AdminUser { id: number; username: string; password: string; role: "superadmin"|"admin"; }
interface FailedLogin { id: number; username: string; attemptedAt: string; location: string; }

// ─────────────────────────────────────────────
// INITIAL DATA
// ─────────────────────────────────────────────
const INITIAL_MEMBERS: Member[] = [
  { id: 1, name: "أحمد محمد الزهراني",  role: "رئيس المجموعة",    bio: "قائد ملهم بخبرة واسعة في إدارة المشاريع الإبداعية وتطوير المواهب الشابة",    avatar: "" },
  { id: 2, name: "سارة عبدالله العمري",  role: "نائبة الرئيس",     bio: "متخصصة في التصميم الإبداعي وتطوير الهوية البصرية والتواصل المؤسسي",         avatar: "" },
  { id: 3, name: "محمد خالد الغامدي",   role: "مسؤول التقنية",    bio: "مطور برمجيات شغوف بالابتكار التقني ودمج التكنولوجيا مع الإبداع",             avatar: "" },
  { id: 4, name: "فاطمة علي الشهري",    role: "مسؤولة الفعاليات", bio: "منظمة فعاليات محترفة تمتلك قدرة فائقة على خلق تجارب لا تُنسى",              avatar: "" },
  { id: 5, name: "عمر يوسف القحطاني",   role: "مسؤول التوثيق",    bio: "مصور ومحتوى إبداعي يوثق رحلة المجموعة بعين فنية وأسلوب احترافي",             avatar: "" },
];

const INITIAL_GAMES: Game[] = [
  { id:1, title:"عقول متقدة",    icon:"🧠", color:"from-orange-400 to-amber-600",  description:"تحدِّ ذكاءك مع أسئلة تفكير نقدي متدرجة الصعوبة",                 players:"٢–٨ لاعبين",    duration:"٣٠ دقيقة", instructions:"يطرح المحكّم سؤالاً، الفريق الذي يجيب أولاً وبشكل صحيح يكسب النقطة. الفريق الذي يجمع أكبر عدد من النقاط في ٣٠ دقيقة يفوز!" },
  { id:2, title:"الرسّام المحترف", icon:"🎨", color:"from-amber-500 to-yellow-600", description:"ارسم وخمّن في جو من المرح والضحك المستمر",                        players:"٤–١٢ لاعباً",  duration:"٤٥ دقيقة", instructions:"لاعب يرسم الكلمة السرية بدون أن يتكلم، وبقية الفريق يحاول التخمين في أقل من دقيقة. النقاط توزَّع حسب سرعة التخمين الصحيح." },
  { id:3, title:"بناة المستقبل",  icon:"🏗️", color:"from-yellow-500 to-orange-500", description:"تعاون مع فريقك لبناء أعلى برج من المواد المتاحة",                 players:"٢–٦ فرق",       duration:"٦٠ دقيقة", instructions:"كل فريق يحصل على نفس المواد. الهدف بناء أعلى وأقوى هيكل يتحمل الوزن المحدد. الفريق ذو البرج الأعلى يفوز!" },
  { id:4, title:"قصة بلا نهاية", icon:"📖", color:"from-orange-500 to-red-500",    description:"كل مشارك يضيف جملة لبناء قصة جماعية مشتركة",                      players:"٥–٢٠ مشاركاً", duration:"٢٠ دقيقة", instructions:"يبدأ المحكّم بجملة افتتاحية، ثم يُكمل كل لاعب القصة بجملة واحدة فقط. في النهاية تُقرأ القصة كاملةً للجميع!" },
  { id:5, title:"محاكاة القادة",  icon:"⚡", color:"from-amber-600 to-orange-700",  description:"تدريب على القيادة والقرارات الاستراتيجية الصعبة",                  players:"٦–١٨ مشاركاً", duration:"٩٠ دقيقة", instructions:"يتولى المشاركون أدواراً قيادية في سيناريوهات واقعية. يتخذون قرارات جماعية ثم يناقشون النتائج." },
  { id:6, title:"مبتكرون صغار",  icon:"💡", color:"from-yellow-400 to-amber-500",  description:"ابتكر حلولاً خلاقة لمشكلات من الحياة اليومية",                    players:"٣–٥ أشخاص",    duration:"٥٠ دقيقة", instructions:"يُعطى كل فريق مشكلة واقعية. المهمة ابتكار حل إبداعي وتقديمه في ٥ دقائق. الجائزة للحل الأكثر ابتكاراً." },
];

const INITIAL_ADMINS: AdminUser[] = [
  { id: 1, username: "Admin", password: "Admin100", role: "superadmin" },
];

const INITIAL_GALLERY: GalleryItem[] = [
  { id:1, url:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80", caption:"لقاء تأسيسي",     category:"صور" },
  { id:2, url:"https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80", caption:"ورشة إبداعية",    category:"صور" },
  { id:3, url:"https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80", caption:"جلسة تخطيط",      category:"صور" },
  { id:4, url:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80", caption:"فريق العمل",      category:"صور" },
  { id:5, url:"https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80", caption:"حفل تكريم",        category:"صور" },
  { id:6, url:"https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80", caption:"رحلة ثقافية",    category:"صور" },
  { id:7, url:"https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80", caption:"مسابقة إبداعية", category:"مقاطع" },
  { id:8, url:"https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&q=80", caption:"مجلس شهري",        category:"مقاطع" },
];

// ─────────────────────────────────────────────
// SVG ICONS
// ─────────────────────────────────────────────
const Ico = {
  X:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Eye:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Lock:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  User:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Code:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  Copy:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Logout:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Plus:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Edit:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Grip:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/></svg>,
  Upload:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  Star:    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Check:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevL:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevR:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Shield:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Warning: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  UserPlus:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  Moon:    () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" opacity="0.9"/>
    </svg>
  ),
  Sun:     () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.9"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
};

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: "success"|"error"|"info" }) {
  const bg = type==="success" ? "linear-gradient(135deg,#16a34a,#15803d)" : type==="error" ? "linear-gradient(135deg,#dc2626,#b91c1c)" : "linear-gradient(135deg,#ED9004,#c97800)";
  return <div className="toast" style={{ background: bg, color:"white" }}>{message}</div>;
}

// ─────────────────────────────────────────────
// SCROLL REVEAL HOOK
// ─────────────────────────────────────────────
function useScrollReveal(threshold=0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){setVisible(true);obs.disconnect();} },{threshold});
    obs.observe(el); return ()=>obs.disconnect();
  },[threshold]);
  return { ref, visible };
}

// ─────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────
function Header({ isAdmin, isDark, onLoginClick, onLogout, onToggleTheme, onAdminCenter, failedCount }: {
  isAdmin: boolean; isDark: boolean;
  onLoginClick:()=>void; onLogout:()=>void; onToggleTheme:()=>void;
  onAdminCenter:()=>void; failedCount:number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label:"الرئيسية", href:"#hero" }, { label:"من نحن", href:"#about" },
    { label:"الأعضاء", href:"#members" }, { label:"ألعابنا", href:"#games" },
    { label:"المعرض", href:"#gallery" }, { label:"عضو الشهر", href:"#mom" },
  ];
  const scrollTo = (href:string) => { document.querySelector(href)?.scrollIntoView({behavior:"smooth"}); setMenuOpen(false); };

  return (
    <>
      <header className="site-header" style={{ padding:"0 1rem", height:70 }}>
        <div style={{ maxWidth:1200, margin:"0 auto", height:"100%", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          {/* Left: Hamburger */}
          <button className={`hamburger-btn ${menuOpen?"hamburger-open":""}`} onClick={()=>setMenuOpen(v=>!v)} aria-label="القائمة">
            <span className="hamburger-line"/><span className="hamburger-line"/><span className="hamburger-line"/>
          </button>

          {/* Center: Logo + Name */}
          <div style={{ flex:1, display:"flex", justifyContent:"center", alignItems:"center", gap:"0.6rem" }}>
            <img src={logoNoBg} alt="شعار" style={{ height:42, objectFit:"contain", filter:"drop-shadow(0 2px 8px rgba(237,144,4,0.5))" }}/>
            <span style={{ fontFamily:"'Amiri',serif", fontSize:"1.15rem", fontWeight:700, color:"rgba(237,144,4,0.95)", letterSpacing:"0.02em", whiteSpace:"nowrap" }}>
              الإنجاز الإبداعي
            </span>
          </div>

          {/* Right: Theme toggle + Admin */}
          <div style={{ display:"flex", alignItems:"center", gap:"0.45rem" }}>
            {/* 🌙 / ☀️ Toggle */}
            <button className="theme-toggle" onClick={onToggleTheme} title={isDark ? "الوضع الفاتح" : "الوضع الليلي"}>
              <span style={{ width:22, height:22, color: isDark ? "#ED9004" : "#461506", display:"block",
                animation: isDark ? "moonGlow 3s ease-in-out infinite" : "sunGlow 2s ease-in-out infinite" }}>
                {isDark ? <Ico.Moon/> : <Ico.Sun/>}
              </span>
            </button>

            {/* مركز الإداره — admins only */}
            {isAdmin && (
              <button onClick={onAdminCenter} style={{ position:"relative", fontSize:"0.78rem", padding:"0.4rem 0.7rem", display:"flex", alignItems:"center", gap:4, background:"linear-gradient(135deg,#dc2626,#b91c1c)", border:"none", borderRadius:10, cursor:"pointer", color:"white", fontFamily:"'Tajawal',sans-serif", fontWeight:700, whiteSpace:"nowrap" }}>
                <span style={{ width:13, height:13, flexShrink:0 }}><Ico.Shield/></span>
                <span className="admin-center-label">مركز الإداره</span>
                {failedCount>0 && (
                  <span style={{ position:"absolute", top:-6, left:-6, background:"#fbbf24", color:"#1a0000", borderRadius:"50%", width:18, height:18, fontSize:"0.65rem", fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>{failedCount>9?"9+":failedCount}</span>
                )}
              </button>
            )}

            {/* Login / Logout button */}
            {isAdmin ? (
              <button className="btn-primary" style={{ fontSize:"0.78rem", padding:"0.4rem 0.7rem", display:"flex", alignItems:"center", gap:4, whiteSpace:"nowrap" }} onClick={onLogout}>
                <span style={{ width:13, height:13, flexShrink:0 }}><Ico.Logout/></span>خروج
              </button>
            ) : (
              <button className="btn-primary" style={{ fontSize:"0.78rem", padding:"0.4rem 0.7rem", display:"flex", alignItems:"center", gap:4, whiteSpace:"nowrap" }} onClick={onLoginClick}>
                <span style={{ width:13, height:13, flexShrink:0 }}><Ico.User/></span>تسجيل الدخول
              </button>
            )}
          </div>
        </div>
        <div className="header-glow"/>
      </header>

      {/* Nav Overlay + Drawer */}
      <div className={`nav-overlay ${menuOpen?"open":""}`} onClick={()=>setMenuOpen(false)}/>
      <nav className={`nav-menu ${menuOpen?"open":""}`}>
        <div style={{ marginBottom:"2rem", borderBottom:"1px solid rgba(237,144,4,0.2)", paddingBottom:"1.5rem" }}>
          <img src={logoNoBg} alt="شعار" style={{ width:70, height:70, objectFit:"contain", display:"block", margin:"0 auto 0.5rem" }}/>
          <p style={{ color:"rgba(237,144,4,0.9)", textAlign:"center", fontSize:"0.85rem", fontFamily:"'Amiri',serif" }}>الإنجاز الإبداعي</p>
        </div>
        {navLinks.map((l,i)=>(
          <button key={l.href} onClick={()=>scrollTo(l.href)}
            style={{ display:"block", width:"100%", textAlign:"right", padding:"0.85rem 1rem", color:"rgba(255,255,255,0.85)", background:"none", border:"none", borderRadius:10, cursor:"pointer", fontSize:"1.05rem", fontFamily:"'Tajawal',sans-serif", fontWeight:600, transition:"all 0.25s ease", animationDelay:`${i*0.05}s` }}
            onMouseEnter={e=>{ (e.target as HTMLButtonElement).style.background="rgba(237,144,4,0.15)"; (e.target as HTMLButtonElement).style.color="#f5a832"; }}
            onMouseLeave={e=>{ (e.target as HTMLButtonElement).style.background="none"; (e.target as HTMLButtonElement).style.color="rgba(255,255,255,0.85)"; }}>
            {l.label}
          </button>
        ))}
        {/* Theme toggle in nav */}
        <button onClick={onToggleTheme}
          style={{ display:"flex", alignItems:"center", gap:"0.8rem", width:"100%", padding:"0.85rem 1rem", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.7)", fontFamily:"'Tajawal',sans-serif", fontSize:"1rem", fontWeight:600, borderRadius:10, marginTop:"0.5rem", transition:"all 0.25s ease" }}
          onMouseEnter={e=>{ (e.currentTarget).style.background="rgba(237,144,4,0.15)"; (e.currentTarget).style.color="#f5a832"; }}
          onMouseLeave={e=>{ (e.currentTarget).style.background="none"; (e.currentTarget).style.color="rgba(255,255,255,0.7)"; }}>
          <span style={{ width:20, height:20, color: isDark?"#ED9004":"#f5a832" }}>{isDark?<Ico.Moon/>:<Ico.Sun/>}</span>
          {isDark ? "الوضع الفاتح ☀️" : "الوضع الليلي 🌙"}
        </button>
        {isAdmin && (
          <div style={{ marginTop:"2rem", padding:"1rem", borderRadius:12, background:"rgba(237,144,4,0.12)", border:"1px solid rgba(237,144,4,0.25)" }}>
            <p style={{ color:"var(--orange-light)", fontSize:"0.85rem", fontWeight:700, marginBottom:"0.3rem" }}>✓ مدير النظام</p>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.75rem" }}>لديك صلاحيات التعديل الكاملة</p>
          </div>
        )}
      </nav>
    </>
  );
}

// ─────────────────────────────────────────────
// AUTH MODAL
// ─────────────────────────────────────────────
function AuthModal({ onClose, onSuccess, admins, onFailedAttempt }: {
  onClose:()=>void; onSuccess:(username:string)=>void;
  admins: AdminUser[];
  onFailedAttempt:(username:string, location:string)=>void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLocation = async (): Promise<string> => {
    try {
      const r = await fetch("https://ipapi.co/json/");
      const d = await r.json();
      return `${d.city||""}, ${d.country_name||""}`.replace(/^, |, $/, "") || "غير معروف";
    } catch { return "غير معروف"; }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    setTimeout(async ()=>{
      const match = admins.find(a => a.username === username && a.password === password);
      if(match) { onSuccess(username); }
      else {
        setError("بيانات الدخول غير صحيحة"); setLoading(false);
        const loc = await fetchLocation();
        onFailedAttempt(username, loc);
      }
    }, 800);
  };

  return (
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box glass-card" style={{ padding:"2.5rem 2rem", position:"relative" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ width:60, height:60, borderRadius:"50%", background:"linear-gradient(135deg,#ED9004,#461506)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem", boxShadow:"0 4px 20px rgba(237,144,4,0.4)" }}>
            <span style={{ width:28, height:28, color:"white" }}><Ico.Lock/></span>
          </div>
          <h2 style={{ fontFamily:"'Amiri',serif", fontSize:"1.6rem", color:"var(--text-primary)", marginBottom:"0.3rem" }}>لوحة الإدارة</h2>
          <p style={{ color:"var(--text-muted)", fontSize:"0.9rem" }}>أدخل بيانات الدخول للمتابعة</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", right:"0.9rem", top:"50%", transform:"translateY(-50%)", width:18, height:18, color:"#999", pointerEvents:"none" }}><Ico.User/></span>
            <input className="form-input" style={{ paddingRight:"2.5rem" }} type="text" placeholder="اسم المستخدم" value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" required/>
          </div>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", right:"0.9rem", top:"50%", transform:"translateY(-50%)", width:18, height:18, color:"#999", pointerEvents:"none" }}><Ico.Lock/></span>
            <input className="form-input" style={{ paddingRight:"2.5rem", paddingLeft:"2.5rem" }} type={showPass?"text":"password"} placeholder="كلمة المرور" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/>
            <button type="button" onClick={()=>setShowPass(v=>!v)} style={{ position:"absolute", left:"0.9rem", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#888", width:18, height:18 }}>
              {showPass?<Ico.EyeOff/>:<Ico.Eye/>}
            </button>
          </div>
          {error && <div style={{ background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.3)", borderRadius:10, padding:"0.6rem 1rem", color:"#dc2626", fontSize:"0.9rem", textAlign:"center" }}>{error}</div>}
          <button type="submit" className="btn-primary" style={{ padding:"0.85rem", fontSize:"1.05rem", marginTop:"0.5rem" }} disabled={loading}>
            {loading ? "⟳" : "دخول"}
          </button>
        </form>
        <button onClick={onClose} style={{ position:"absolute", top:"1rem", left:"1rem", width:32, height:32, background:"rgba(0,0,0,0.08)", border:"none", borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text-secondary)" }}>
          <span style={{ width:16, height:16 }}><Ico.X/></span>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ADMIN CENTER MODAL
// ─────────────────────────────────────────────
function AdminCenterModal({ onClose, admins, setAdmins, failedLogins, setFailedLogins, currentUser }: {
  onClose:()=>void;
  admins: AdminUser[]; setAdmins:(v:AdminUser[]|((_:AdminUser[])=>AdminUser[]))=>void;
  failedLogins: FailedLogin[]; setFailedLogins:(v:FailedLogin[]|((_:FailedLogin[])=>FailedLogin[]))=>void;
  currentUser: string;
}) {
  const [tab, setTab] = useState<"attempts"|"admins">("attempts");
  const [newUser, setNewUser] = useState({ username:"", password:"", role:"admin" as "superadmin"|"admin" });
  const [showNewPass, setShowNewPass] = useState(false);
  const [addErr, setAddErr] = useState("");
  const currentAdmin = admins.find(a=>a.username===currentUser);
  const isSuperAdmin = currentAdmin?.role==="superadmin";

  const addAdmin = () => {
    setAddErr("");
    if(!newUser.username.trim()||!newUser.password.trim()) { setAddErr("أدخل الاسم وكلمة المرور"); return; }
    if(admins.find(a=>a.username===newUser.username)) { setAddErr("اسم المستخدم موجود مسبقاً"); return; }
    setAdmins(prev=>[...prev, { id:Date.now(), username:newUser.username, password:newUser.password, role:newUser.role }]);
    setNewUser({ username:"", password:"", role:"admin" });
  };

  return (
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ width:"min(680px,96vw)", animation:"modalContent 0.35s cubic-bezier(0.23,1,0.32,1)", position:"relative" }}>
        <div className="glass-card" style={{ overflow:"hidden", border:"2px solid rgba(220,38,38,0.4)", boxShadow:"0 25px 80px rgba(0,0,0,0.6), 0 0 40px rgba(220,38,38,0.15)" }}>
          {/* Header */}
          <div style={{ background:"linear-gradient(135deg,#7f1d1d,#991b1b)", padding:"1.2rem 1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.7rem" }}>
              <span style={{ width:24, height:24, color:"#fca5a5" }}><Ico.Shield/></span>
              <div>
                <h2 style={{ color:"white", fontFamily:"'Amiri',serif", fontSize:"1.2rem", fontWeight:700, lineHeight:1 }}>مركز الإداره</h2>
                <p style={{ color:"rgba(252,165,165,0.7)", fontSize:"0.72rem", marginTop:2 }}>للمدراء المعتمدين فقط</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:8, width:34, height:34, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"white" }}>
              <span style={{ width:16, height:16 }}><Ico.X/></span>
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", borderBottom:"1px solid rgba(220,38,38,0.2)", background:"rgba(220,38,38,0.05)" }}>
            {([["attempts","🚨 محاولات الدخول الفاشلة"],["admins","👥 إدارة الإداريين"]] as const).map(([key,label])=>(
              <button key={key} onClick={()=>setTab(key)}
                style={{ flex:1, padding:"0.8rem", background:"none", border:"none", cursor:"pointer", fontFamily:"'Tajawal',sans-serif", fontSize:"0.9rem", fontWeight:600, color: tab===key ? "#ef4444" : "var(--text-secondary)", borderBottom: tab===key ? "2px solid #ef4444" : "2px solid transparent", transition:"all 0.2s" }}>
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ padding:"1.2rem", maxHeight:"55vh", overflowY:"auto" }}>
            {tab==="attempts" && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
                  <p style={{ color:"var(--text-muted)", fontSize:"0.82rem" }}>{failedLogins.length} محاولة مسجّلة</p>
                  {failedLogins.length>0 && (
                    <button onClick={()=>setFailedLogins([])} style={{ background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.3)", borderRadius:8, padding:"0.3rem 0.7rem", cursor:"pointer", color:"#ef4444", fontSize:"0.78rem", fontFamily:"'Tajawal',sans-serif" }}>
                      مسح الكل
                    </button>
                  )}
                </div>
                {failedLogins.length===0 ? (
                  <div style={{ textAlign:"center", padding:"3rem 0", color:"var(--text-muted)" }}>
                    <div style={{ fontSize:"3rem", marginBottom:"0.5rem" }}>✅</div>
                    <p>لا توجد محاولات دخول فاشلة</p>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
                    {[...failedLogins].reverse().map(fl=>(
                      <div key={fl.id} style={{ display:"flex", alignItems:"flex-start", gap:"0.8rem", padding:"0.8rem 1rem", borderRadius:10, background:"rgba(220,38,38,0.06)", border:"1px solid rgba(220,38,38,0.15)" }}>
                        <span style={{ fontSize:"1.3rem", marginTop:2 }}>⚠️</span>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"0.3rem" }}>
                            <span style={{ color:"#ef4444", fontWeight:700, fontSize:"0.9rem" }}>
                              محاولة: <span style={{ fontFamily:"monospace" }}>{fl.username||"(بدون اسم)"}</span>
                            </span>
                            <span style={{ color:"var(--text-muted)", fontSize:"0.78rem" }}>{fl.attemptedAt}</span>
                          </div>
                          <div style={{ color:"var(--text-secondary)", fontSize:"0.82rem", marginTop:"0.2rem", display:"flex", alignItems:"center", gap:4 }}>
                            📍 {fl.location}
                          </div>
                        </div>
                        <button onClick={()=>setFailedLogins(prev=>prev.filter(x=>x.id!==fl.id))} style={{ background:"none", border:"none", cursor:"pointer", color:"#ef4444", opacity:0.6, width:24, height:24, flexShrink:0 }}>
                          <Ico.X/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab==="admins" && (
              <div>
                {/* Current admins list */}
                <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem", marginBottom:"1.5rem" }}>
                  {admins.map(a=>(
                    <div key={a.id} style={{ display:"flex", alignItems:"center", gap:"0.8rem", padding:"0.7rem 1rem", borderRadius:10, background:"rgba(70,21,6,0.06)", border:"1px solid rgba(70,21,6,0.12)" }}>
                      <span style={{ width:36, height:36, borderRadius:"50%", background: a.role==="superadmin" ? "linear-gradient(135deg,#7f1d1d,#b91c1c)" : "linear-gradient(135deg,var(--orange),var(--brown))", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <span style={{ width:16, height:16, color:"white" }}><Ico.User/></span>
                      </span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, color:"var(--text-primary)", fontSize:"0.9rem" }}>{a.username}</div>
                        <div style={{ fontSize:"0.75rem", color: a.role==="superadmin"?"#ef4444":"var(--orange-dark)", fontWeight:600 }}>
                          {a.role==="superadmin" ? "⭐ مدير رئيسي" : "🔑 مدير"}
                        </div>
                      </div>
                      {a.username!==currentUser && isSuperAdmin && (
                        <button onClick={()=>setAdmins(prev=>prev.filter(x=>x.id!==a.id))} style={{ background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.2)", borderRadius:8, width:32, height:32, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#ef4444" }}>
                          <span style={{ width:14, height:14 }}><Ico.Trash/></span>
                        </button>
                      )}
                      {a.username===currentUser && (
                        <span style={{ fontSize:"0.72rem", color:"var(--text-muted)", background:"rgba(237,144,4,0.1)", borderRadius:6, padding:"2px 8px" }}>أنت</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add new admin form - superadmin only */}
                {isSuperAdmin ? (
                  <div style={{ borderTop:"1px solid rgba(70,21,6,0.15)", paddingTop:"1rem" }}>
                    <h4 style={{ color:"var(--text-primary)", fontWeight:700, marginBottom:"0.8rem", display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ width:16, height:16, color:"var(--orange)" }}><Ico.UserPlus/></span>
                      إضافة مدير جديد
                    </h4>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}>
                      <input className="form-input" placeholder="اسم المستخدم" value={newUser.username} onChange={e=>setNewUser(v=>({...v,username:e.target.value}))}/>
                      <div style={{ position:"relative" }}>
                        <input className="form-input" placeholder="كلمة المرور" type={showNewPass?"text":"password"} value={newUser.password} onChange={e=>setNewUser(v=>({...v,password:e.target.value}))} style={{ paddingLeft:"2.2rem" }}/>
                        <button type="button" onClick={()=>setShowNewPass(v=>!v)} style={{ position:"absolute", left:"0.6rem", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#888", width:18, height:18 }}>
                          {showNewPass?<Ico.EyeOff/>:<Ico.Eye/>}
                        </button>
                      </div>
                    </div>
                    <select className="form-input" value={newUser.role} onChange={e=>setNewUser(v=>({...v,role:e.target.value as "superadmin"|"admin"}))} style={{ marginTop:"0.6rem", width:"100%" }}>
                      <option value="admin">مدير عادي</option>
                      <option value="superadmin">مدير رئيسي</option>
                    </select>
                    {addErr && <p style={{ color:"#ef4444", fontSize:"0.82rem", marginTop:"0.4rem" }}>{addErr}</p>}
                    <button className="btn-primary" onClick={addAdmin} style={{ marginTop:"0.8rem", display:"flex", alignItems:"center", gap:6, fontSize:"0.9rem", padding:"0.55rem 1.2rem", background:"linear-gradient(135deg,#dc2626,#b91c1c)" }}>
                      <span style={{ width:16, height:16 }}><Ico.UserPlus/></span>
                      إضافة مدير
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign:"center", padding:"1.5rem", background:"rgba(220,38,38,0.05)", borderRadius:12, border:"1px dashed rgba(220,38,38,0.2)" }}>
                    <p style={{ color:"var(--text-muted)", fontSize:"0.85rem" }}>صلاحية إضافة المدراء متاحة للمدير الرئيسي فقط</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────
function HeroSection({ onScrollDown, isDark }: { onScrollDown:()=>void; isDark:boolean }) {
  const [mousePos, setMousePos] = useState({ x:0.5, y:0.5 });
  useEffect(()=>{
    const fn=(e:MouseEvent)=>setMousePos({x:e.clientX/window.innerWidth,y:e.clientY/window.innerHeight});
    window.addEventListener("mousemove",fn); return()=>window.removeEventListener("mousemove",fn);
  },[]);
  const px=mousePos.x*30-15, py=mousePos.y*30-15;

  const orbColor = isDark
    ? "radial-gradient(circle, rgba(70,21,6,0.7) 0%, transparent 70%)"
    : "radial-gradient(circle, rgba(237,144,4,0.18) 0%, transparent 70%)";

  return (
    <section id="hero" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", paddingTop:"calc(80px + 2rem)", background:"transparent" }}>
      {/* Orbs */}
      <div className="hero-orb hero-orb-1" style={{ width:500, height:500, background:orbColor, top:"-100px", right:"-100px", transform:`translate(${px}px,${py}px)`, transition:"transform 0.8s ease" }}/>
      <div className="hero-orb hero-orb-2" style={{ width:400, height:400, background:isDark?"radial-gradient(circle,rgba(70,21,6,0.5) 0%,transparent 70%)":"radial-gradient(circle,rgba(70,21,6,0.12) 0%,transparent 70%)", bottom:0, left:"-80px", transform:`translate(${-px*0.6}px,${-py*0.6}px)`, transition:"transform 0.8s ease" }}/>
      <div className="hero-orb hero-orb-3" style={{ width:300, height:300, background:isDark?"radial-gradient(circle,rgba(70,21,6,0.35) 0%,transparent 70%)":"radial-gradient(circle,rgba(237,144,4,0.1) 0%,transparent 70%)", top:"40%", left:"40%", transform:`translate(${px*0.4}px,${py*0.4}px)`, transition:"transform 0.8s ease" }}/>

      {/* Content */}
      <div style={{ position:"relative", zIndex:2, textAlign:"center", maxWidth:800, padding:"0 1.5rem" }}>
        {/* Floating Logo */}
        <div className="about-img-wrapper animate-fadeInUp" style={{ display:"inline-block", marginBottom:"1.5rem" }}>
          <img src={logoNoBg} alt="شعار الإنجاز الإبداعي"
            style={{ width:160, height:160, objectFit:"contain",
              filter: isDark
                ? "drop-shadow(0 8px 32px rgba(70,21,6,1)) drop-shadow(0 0 60px rgba(70,21,6,0.7))"
                : "drop-shadow(0 8px 32px rgba(237,144,4,0.5))",
              transform:`perspective(800px) rotateY(${px*0.06}deg) rotateX(${-py*0.06}deg)`,
              transition:"transform 0.5s ease, filter 0.4s ease" }}
          />
        </div>

        <h1 className="shimmer-text animate-fadeInUp delay-100" style={{ fontFamily:"'Amiri',serif", fontSize:"clamp(2.2rem,6vw,4.5rem)", fontWeight:700, lineHeight:1.2, marginBottom:"0.5rem" }}>
          الإنجاز الإبداعي
        </h1>
        <p className="animate-fadeInUp delay-200" style={{ fontSize:"clamp(1rem,2.5vw,1.35rem)", color: isDark ? "rgba(245,168,50,0.8)" : "#5a3010", fontWeight:400, marginBottom:"0.8rem", lineHeight:1.7 }}>
          نبني الإبداع · نصنع الإنجاز · نحقق الأثر
        </p>

        <div className="animate-fadeInUp delay-300 hero-stats">
          {[["٥+","أعضاء"],["٦","ألعاب"],["٨+","فعاليات"]].map(([n,l])=>(
            <div key={l} className="glass-card-orange" style={{ padding:"0.8rem 1.2rem", textAlign:"center", minWidth:90 }}>
              <div style={{ fontSize:"1.8rem", fontWeight:900, color:"var(--stat-val-color)", fontFamily:"'Qomra','Tajawal',sans-serif" }}>{n}</div>
              <div style={{ fontSize:"0.85rem", color:"var(--orange-dark)", fontWeight:700, fontFamily:"'Qomra','Tajawal',sans-serif" }}>{l}</div>
            </div>
          ))}
        </div>

        <div className="animate-fadeInUp delay-400" style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn-primary" style={{ padding:"0.85rem 2rem", fontSize:"1.05rem" }} onClick={()=>document.querySelector("#about")?.scrollIntoView({behavior:"smooth"})}>اكتشف أكثر</button>
          <button className="btn-dark" style={{ padding:"0.85rem 2rem", fontSize:"1.05rem" }} onClick={()=>document.querySelector("#games")?.scrollIntoView({behavior:"smooth"})}>ألعابنا</button>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fadeInUp delay-600" style={{ marginTop:"3rem", cursor:"pointer", opacity:0.6 }} onClick={onScrollDown}>
          <div style={{ width:28, height:44, border:`2px solid ${isDark?"#461506":"var(--orange)"}`, borderRadius:14, margin:"0 auto", position:"relative" }}>
            <div style={{ width:6, height:6, background: isDark?"#461506":"var(--orange)", borderRadius:"50%", position:"absolute", top:8, left:"50%", transform:"translateX(-50%)", animation:"float 1.5s ease-in-out infinite" }}/>
          </div>
          <p style={{ fontSize:"0.75rem", marginTop:"0.4rem", color: isDark?"rgba(70,21,6,0.9)":"var(--orange-dark)" }}>مرر للأسفل</p>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// ABOUT SECTION
// ─────────────────────────────────────────────
function AboutSection({ isDark }: { isDark:boolean }) {
  const { ref, visible } = useScrollReveal();
  return (
    <section id="about" style={{ background: isDark ? "rgba(0,0,0,0.78)" : "linear-gradient(180deg,#fff8f0 0%,#fff 100%)" }}>
      <div ref={ref} style={{ maxWidth:1100, margin:"0 auto", padding:"0 1rem" }}>
        <h2 className={`section-title gradient-text ${visible?"animate-fadeInUp":"opacity-0"}`}>من نحن</h2>
        <div className={`section-divider ${visible?"animate-fadeInUp delay-100":"opacity-0"}`}/>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"3rem", alignItems:"center" }}>
          <div className={visible?"animate-fadeInRight":"opacity-0"}>
            {[
              ["رؤيتنا","أن نكون منصة إبداعية رائدة تُنمّي المواهب الشابة وتُحوّل الأفكار إلى إنجازات ملموسة تخدم المجتمع."],
              ["رسالتنا","تمكين الأعضاء من خلال برامج تطوير مبتكرة، وخلق بيئة محفّزة تجمع بين التعلّم والإبداع والمتعة."],
              ["قيمنا","الإبداع · الاحترام · التعاون · التميّز · المسؤولية المجتمعية"],
            ].map(([t,c],i)=>(
              <div key={t} className="glass-card" style={{ padding:"1.2rem 1.5rem", marginBottom:"1rem", animationDelay:`${0.2+i*0.1}s` }}>
                <h3 style={{ color:"var(--orange-dark)", fontWeight:700, marginBottom:"0.4rem", display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:8, height:8, background:"var(--orange)", borderRadius:"50%", display:"inline-block" }}/>
                  {t}
                </h3>
                <p style={{ color:"var(--text-secondary)", lineHeight:1.8, fontSize:"0.95rem" }}>{c}</p>
              </div>
            ))}
          </div>

          <div className={visible?"animate-fadeInLeft":"opacity-0"} style={{ display:"flex", justifyContent:"center" }}>
            <div className="about-img-wrapper">
              <div style={{ width:280, height:280, borderRadius:"50%",
                background: isDark
                  ? "radial-gradient(circle at 40% 40%, #461506, #0a0200)"
                  : "radial-gradient(circle at 40% 40%, #fff6e8, #fde8bb)",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow: isDark
                  ? "0 20px 60px rgba(70,21,6,0.9), 0 0 100px rgba(70,21,6,0.4)"
                  : "0 20px 60px rgba(237,144,4,0.35), 0 0 80px rgba(237,144,4,0.12)",
                position:"relative", overflow:"hidden", transition:"all 0.4s ease",
                border: isDark ? "2px solid rgba(70,21,6,0.5)" : "2px solid rgba(237,144,4,0.3)" }}>
                <img src={logoNoBg} alt="شعار الإنجاز الإبداعي"
                  style={{ width:"75%", height:"75%", objectFit:"contain",
                    filter: isDark
                      ? "drop-shadow(0 4px 24px rgba(70,21,6,1)) drop-shadow(0 0 40px rgba(70,21,6,0.8))"
                      : "drop-shadow(0 4px 20px rgba(237,144,4,0.5))",
                    transition:"filter 0.4s ease" }}/>
                <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:"rgba(237,144,4,0.08)" }}/>
                <div style={{ position:"absolute", bottom:-30, left:-30, width:150, height:150, borderRadius:"50%", background:"rgba(70,21,6,0.08)" }}/>
              </div>
            </div>
          </div>
        </div>

        <div className={`${visible?"animate-fadeInUp delay-400":"opacity-0"}`} style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:"1rem", marginTop:"3rem" }}>
          {[{icon:"🎯",label:"هدفنا الأسمى",val:"التميّز"},{icon:"🌟",label:"أعضاء نشطون",val:"٥+"},{icon:"🏆",label:"فعاليات منجزة",val:"٨+"},{icon:"💡",label:"أفكار مبتكرة",val:"∞"}].map(s=>(
            <div key={s.label} className="glass-card-orange" style={{ padding:"1.2rem", textAlign:"center" }}>
              <div style={{ fontSize:"2rem", marginBottom:"0.3rem" }}>{s.icon}</div>
              <div style={{ fontSize:"1.5rem", fontWeight:800, color:"var(--stat-val-color)" }}>{s.val}</div>
              <div style={{ fontSize:"0.8rem", color:"var(--orange-dark)", fontWeight:500 }}>{s.label}</div>
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
function MembersSection({ isAdmin, isDark }: { isAdmin:boolean; isDark:boolean }) {
  const { ref, visible } = useScrollReveal();
  const [members, setMembers] = useLocalStorage<Member[]>("injaz-members-v2", INITIAL_MEMBERS);
  const [dragIdx, setDragIdx] = useState<number|null>(null);
  const [overIdx, setOverIdx] = useState<number|null>(null);
  const [editingMember, setEditingMember] = useState<Member|null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState({name:"",role:"",bio:"",avatar:""});

  const handleDrop=(i:number)=>{
    if(dragIdx===null||dragIdx===i){setDragIdx(null);setOverIdx(null);return;}
    const arr=[...members]; const [item]=arr.splice(dragIdx,1); arr.splice(i,0,item);
    setMembers(arr); setDragIdx(null); setOverIdx(null);
  };
  const addMember=()=>{
    if(!newMember.name.trim()) return;
    setMembers(m=>[...m,{...newMember,id:Date.now()}]);
    setNewMember({name:"",role:"",bio:"",avatar:""}); setShowAdd(false);
  };
  const pickFile=(onDone:(url:string)=>void)=>{
    const inp=document.createElement("input"); inp.type="file"; inp.accept="image/*";
    inp.onchange=()=>{
      const file=inp.files?.[0]; if(!file) return;
      const reader=new FileReader();
      reader.onload=e=>onDone(e.target?.result as string);
      reader.readAsDataURL(file);
    }; inp.click();
  };
  const saveEdit=()=>{ if(!editingMember) return; setMembers(m=>m.map(x=>x.id===editingMember.id?editingMember:x)); setEditingMember(null); };

  return (
    <section id="members" style={{ background: isDark ? "rgba(5,1,0,0.80)" : "linear-gradient(180deg,#fff 0%,#fff8f0 100%)" }}>
      <div ref={ref} style={{ maxWidth:900, margin:"0 auto", padding:"0 1rem" }}>
        <h2 className={`section-title gradient-text ${visible?"animate-fadeInUp":"opacity-0"}`}>أعضاء المجموعة</h2>
        <div className={`section-divider ${visible?"animate-fadeInUp delay-100":"opacity-0"}`}/>

        {isAdmin && (
          <div style={{ textAlign:"center", marginBottom:"2rem" }}>
            <button className="btn-primary" style={{ display:"inline-flex", alignItems:"center", gap:6 }} onClick={()=>setShowAdd(v=>!v)}>
              <span style={{ width:18, height:18 }}><Ico.Plus/></span>إضافة عضو
            </button>
            <p style={{ color:"var(--text-muted)", fontSize:"0.8rem", marginTop:"0.5rem" }}>اسحب الأعضاء لإعادة الترتيب</p>
          </div>
        )}

        {isAdmin && showAdd && (
          <div className="glass-card animate-fadeInUp" style={{ padding:"1.5rem", marginBottom:"2rem" }}>
            <h3 style={{ marginBottom:"1rem", color:"var(--text-primary)", fontWeight:700 }}>عضو جديد</h3>
            {/* صورة العضو */}
            <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1rem" }}>
              <div style={{ width:64, height:64, borderRadius:14, overflow:"hidden", flexShrink:0, background:"linear-gradient(135deg,var(--orange),var(--brown))", border:"2px solid rgba(237,144,4,0.35)" }}>
                <img src={newMember.avatar||logoNoBg} alt="معاينة" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{(e.target as HTMLImageElement).src=logoNoBg;}}/>
              </div>
              <div style={{ flex:1, display:"flex", flexDirection:"column", gap:"0.4rem" }}>
                <input className="form-input" placeholder="رابط الصورة (URL)" value={newMember.avatar} onChange={e=>setNewMember(v=>({...v,avatar:e.target.value}))} style={{ fontSize:"0.85rem" }}/>
                <button type="button" className="btn-dark" style={{ fontSize:"0.8rem", padding:"0.4rem 0.8rem", display:"inline-flex", alignItems:"center", gap:4, width:"fit-content" }}
                  onClick={()=>pickFile(url=>setNewMember(v=>({...v,avatar:url})))}>
                  📁 رفع صورة
                </button>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.8rem" }}>
              <input className="form-input" placeholder="الاسم *" value={newMember.name} onChange={e=>setNewMember(v=>({...v,name:e.target.value}))}/>
              <input className="form-input" placeholder="الدور" value={newMember.role} onChange={e=>setNewMember(v=>({...v,role:e.target.value}))}/>
              <input className="form-input" placeholder="نبذة مختصرة" value={newMember.bio} onChange={e=>setNewMember(v=>({...v,bio:e.target.value}))} style={{ gridColumn:"1/-1" }}/>
            </div>
            <div style={{ display:"flex", gap:"0.5rem", marginTop:"1rem" }}>
              <button className="btn-primary" onClick={addMember}>إضافة</button>
              <button className="btn-dark" onClick={()=>setShowAdd(false)}>إلغاء</button>
            </div>
          </div>
        )}

        <div style={{ position:"relative" }}>
          {members.map((m,i)=>(
            <div key={m.id}
              className={`timeline-item ${dragIdx===i?"dragging":""} ${overIdx===i?"drag-over":""} ${visible?"animate-fadeInUp":"opacity-0"}`}
              style={{ animationDelay:`${0.15+i*0.08}s` }}
              draggable={isAdmin}
              onDragStart={()=>{ if(isAdmin) setDragIdx(i); }}
              onDragOver={e=>{ e.preventDefault(); setOverIdx(i); }}
              onDrop={()=>handleDrop(i)}
              onDragEnd={()=>{ setDragIdx(null); setOverIdx(null); }}>
              {i<members.length-1 && <div className="timeline-line"/>}
              <div className="timeline-dot">
                <img
                  src={m.avatar || logoNoBg}
                  alt={m.name}
                  onError={e=>{ (e.target as HTMLImageElement).src=logoNoBg; }}
                />
              </div>
              <div className="timeline-card glass-card" style={{ padding:"1.2rem 1.5rem", flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"0.5rem", flexWrap:"wrap" }}>
                  <div>
                    <h3 style={{ fontWeight:700, fontSize:"1.05rem", color:"var(--text-primary)", marginBottom:"0.2rem" }}>{m.name}</h3>
                    <span style={{ background:"linear-gradient(135deg,rgba(237,144,4,0.15),rgba(237,144,4,0.05))", color:"var(--orange-dark)", fontSize:"0.8rem", fontWeight:600, padding:"0.2rem 0.6rem", borderRadius:999, border:"1px solid rgba(237,144,4,0.25)" }}>
                      {m.role}
                    </span>
                  </div>
                  {isAdmin && (
                    <div style={{ display:"flex", gap:4 }}>
                      <button style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6 }}
                        onMouseEnter={e=>(e.currentTarget.style.color="var(--orange)")} onMouseLeave={e=>(e.currentTarget.style.color="var(--text-muted)")}
                        onClick={()=>setEditingMember({...m})}>
                        <span style={{ width:16, height:16 }}><Ico.Edit/></span>
                      </button>
                      <button style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6 }}
                        onMouseEnter={e=>(e.currentTarget.style.color="#dc2626")} onMouseLeave={e=>(e.currentTarget.style.color="var(--text-muted)")}
                        onClick={()=>setMembers(ms=>ms.filter(x=>x.id!==m.id))}>
                        <span style={{ width:16, height:16 }}><Ico.Trash/></span>
                      </button>
                      <div style={{ cursor:"grab", color:"var(--text-muted)", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span style={{ width:16, height:16 }}><Ico.Grip/></span>
                      </div>
                    </div>
                  )}
                </div>
                {m.bio && <p style={{ color:"var(--text-secondary)", fontSize:"0.9rem", lineHeight:1.7, marginTop:"0.6rem" }}>{m.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      {editingMember && (
        <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&setEditingMember(null)}>
          <div className="modal-box glass-card" style={{ padding:"2rem" }}>
            <h3 style={{ marginBottom:"1.5rem", color:"var(--text-primary)", fontWeight:700, fontSize:"1.2rem" }}>تعديل بيانات العضو</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.8rem" }}>
              {/* صورة العضو */}
              <div style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"1rem", borderRadius:14, background:"rgba(237,144,4,0.06)", border:"1px solid rgba(237,144,4,0.15)" }}>
                <div style={{ width:72, height:72, borderRadius:14, overflow:"hidden", flexShrink:0, background:"linear-gradient(135deg,var(--orange),var(--brown))", border:"2px solid rgba(237,144,4,0.4)" }}>
                  <img src={editingMember.avatar||logoNoBg} alt="صورة العضو" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{(e.target as HTMLImageElement).src=logoNoBg;}}/>
                </div>
                <div style={{ flex:1, display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                  <p style={{ color:"var(--text-muted)", fontSize:"0.8rem", fontWeight:600 }}>صورة العضو</p>
                  <input className="form-input" value={editingMember.avatar} onChange={e=>setEditingMember(v=>v?{...v,avatar:e.target.value}:v)} placeholder="رابط الصورة (URL)" style={{ fontSize:"0.85rem" }}/>
                  <button type="button" className="btn-dark" style={{ fontSize:"0.8rem", padding:"0.4rem 0.8rem", display:"inline-flex", alignItems:"center", gap:4, width:"fit-content" }}
                    onClick={()=>pickFile(url=>setEditingMember(v=>v?{...v,avatar:url}:v))}>
                    📁 رفع صورة من الجهاز
                  </button>
                </div>
              </div>
              <input className="form-input" value={editingMember.name} onChange={e=>setEditingMember(v=>v?{...v,name:e.target.value}:v)} placeholder="الاسم"/>
              <input className="form-input" value={editingMember.role} onChange={e=>setEditingMember(v=>v?{...v,role:e.target.value}:v)} placeholder="الدور"/>
              <input className="form-input" value={editingMember.bio} onChange={e=>setEditingMember(v=>v?{...v,bio:e.target.value}:v)} placeholder="النبذة"/>
              <div style={{ display:"flex", gap:"0.5rem" }}>
                <button className="btn-primary" onClick={saveEdit}>حفظ</button>
                <button className="btn-dark" onClick={()=>setEditingMember(null)}>إلغاء</button>
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
function GamesSection({ isAdmin, isDark }: { isAdmin:boolean; isDark:boolean }) {
  const { ref, visible } = useScrollReveal();
  const [games, setGames] = useLocalStorage<Game[]>("injaz-games", INITIAL_GAMES);
  const [activeGame, setActiveGame] = useState<Game|null>(null);
  const [editingGame, setEditingGame] = useState<Game|null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newGame, setNewGame] = useState({title:"",description:"",icon:"🎮",color:"from-orange-400 to-amber-600",players:"",duration:"",instructions:""});
  const [tilt, setTilt] = useState<Record<number,{x:number;y:number}>>({});

  const handleMouseMove=(e:React.MouseEvent<HTMLDivElement>,id:number)=>{
    const r=e.currentTarget.getBoundingClientRect();
    setTilt(t=>({...t,[id]:{x:((e.clientX-r.left)/r.width-0.5)*20, y:((e.clientY-r.top)/r.height-0.5)*-20}}));
  };

  return (
    <section id="games" style={{ background: isDark ? "rgba(0,0,0,0.78)" : "linear-gradient(180deg,#fff8f0 0%,#fffaf5 100%)" }}>
      <div ref={ref} style={{ maxWidth:1100, margin:"0 auto", padding:"0 1rem" }}>
        <h2 className={`section-title gradient-text ${visible?"animate-fadeInUp":"opacity-0"}`}>ألعابنا التفاعلية</h2>
        <div className={`section-divider ${visible?"animate-fadeInUp delay-100":"opacity-0"}`}/>

        {isAdmin && (
          <div style={{ textAlign:"center", marginBottom:"1.5rem" }}>
            <button className="btn-primary" style={{ display:"inline-flex", alignItems:"center", gap:6 }} onClick={()=>setShowAdd(v=>!v)}>
              <span style={{ width:18, height:18 }}><Ico.Plus/></span>إضافة لعبة
            </button>
          </div>
        )}
        {isAdmin && showAdd && (
          <div className="glass-card animate-fadeInUp" style={{ padding:"1.5rem", marginBottom:"2rem" }}>
            <h3 style={{ marginBottom:"1rem", color:"var(--text-primary)", fontWeight:700 }}>لعبة جديدة</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"0.8rem" }}>
              <input className="form-input" placeholder="اسم اللعبة *" value={newGame.title} onChange={e=>setNewGame(v=>({...v,title:e.target.value}))}/>
              <input className="form-input" placeholder="الأيقونة (emoji)" value={newGame.icon} onChange={e=>setNewGame(v=>({...v,icon:e.target.value}))}/>
              <input className="form-input" placeholder="عدد اللاعبين" value={newGame.players} onChange={e=>setNewGame(v=>({...v,players:e.target.value}))}/>
              <input className="form-input" placeholder="المدة" value={newGame.duration} onChange={e=>setNewGame(v=>({...v,duration:e.target.value}))}/>
              <input className="form-input" placeholder="وصف مختصر" value={newGame.description} onChange={e=>setNewGame(v=>({...v,description:e.target.value}))} style={{ gridColumn:"1/-1" }}/>
              <textarea className="form-input" placeholder="تعليمات اللعبة" value={newGame.instructions} onChange={e=>setNewGame(v=>({...v,instructions:e.target.value}))} rows={2} style={{ gridColumn:"1/-1", resize:"vertical" }}/>
            </div>
            <div style={{ display:"flex", gap:"0.5rem", marginTop:"1rem" }}>
              <button className="btn-primary" onClick={()=>{ if(!newGame.title) return; setGames(g=>[...g,{...newGame,id:Date.now()}]); setNewGame({title:"",description:"",icon:"🎮",color:"from-orange-400 to-amber-600",players:"",duration:"",instructions:""}); setShowAdd(false); }}>إضافة</button>
              <button className="btn-dark" onClick={()=>setShowAdd(false)}>إلغاء</button>
            </div>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"1.5rem" }}>
          {games.map((g,i)=>{
            const t=tilt[g.id]||{x:0,y:0};
            return (
              <div key={g.id}
                className={`game-card glass-card ${visible?"animate-fadeInUp":"opacity-0"}`}
                style={{ padding:"1.5rem", animationDelay:`${0.1+i*0.07}s`, transform:`perspective(600px) rotateX(${t.y}deg) rotateY(${t.x}deg)`, cursor:"pointer" }}
                onMouseMove={e=>handleMouseMove(e,g.id)}
                onMouseLeave={()=>setTilt(t=>({...t,[g.id]:{x:0,y:0}}))}
                onClick={()=>setActiveGame(g)}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{ fontSize:"2.5rem", marginBottom:"0.8rem" }}>{g.icon}</div>
                  {isAdmin && (
                    <div style={{ display:"flex", gap:2 }} onClick={e=>e.stopPropagation()}>
                      <button style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setEditingGame({...g})}>
                        <span style={{ width:14, height:14 }}><Ico.Edit/></span>
                      </button>
                      <button style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={()=>setGames(gs=>gs.filter(x=>x.id!==g.id))}>
                        <span style={{ width:14, height:14 }}><Ico.Trash/></span>
                      </button>
                    </div>
                  )}
                </div>
                <h3 style={{ fontWeight:800, fontSize:"1.1rem", color:"var(--text-primary)", marginBottom:"0.5rem" }}>{g.title}</h3>
                <p style={{ color:"var(--text-secondary)", fontSize:"0.88rem", lineHeight:1.65, marginBottom:"1rem" }}>{g.description}</p>
                <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
                  <span style={{ background:"rgba(237,144,4,0.12)", color:"var(--orange-dark)", fontSize:"0.75rem", padding:"0.25rem 0.6rem", borderRadius:999, fontWeight:600 }}>👥 {g.players}</span>
                  <span style={{ background: isDark?"rgba(70,21,6,0.3)":"rgba(70,21,6,0.08)", color:"var(--text-primary)", fontSize:"0.75rem", padding:"0.25rem 0.6rem", borderRadius:999, fontWeight:600 }}>⏱ {g.duration}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeGame && (
        <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&setActiveGame(null)}>
          <div className="modal-box glass-card" style={{ padding:"2.5rem 2rem" }}>
            <button onClick={()=>setActiveGame(null)} style={{ position:"absolute", top:"1rem", left:"1rem", background:"rgba(0,0,0,0.07)", border:"none", borderRadius:8, cursor:"pointer", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text-secondary)" }}>
              <span style={{ width:16, height:16 }}><Ico.X/></span>
            </button>
            <div style={{ textAlign:"center", marginBottom:"1.5rem" }}>
              <div style={{ fontSize:"3.5rem", marginBottom:"0.5rem" }}>{activeGame.icon}</div>
              <h2 style={{ fontFamily:"'Amiri',serif", fontSize:"1.8rem", color:"var(--text-primary)", fontWeight:700 }}>{activeGame.title}</h2>
              <div style={{ display:"flex", gap:"0.5rem", justifyContent:"center", marginTop:"0.5rem" }}>
                <span style={{ background:"rgba(237,144,4,0.15)", color:"var(--orange-dark)", padding:"0.25rem 0.7rem", borderRadius:999, fontSize:"0.85rem", fontWeight:600 }}>👥 {activeGame.players}</span>
                <span style={{ background:"rgba(70,21,6,0.08)", color:"var(--text-primary)", padding:"0.25rem 0.7rem", borderRadius:999, fontSize:"0.85rem", fontWeight:600 }}>⏱ {activeGame.duration}</span>
              </div>
            </div>
            <p style={{ color:"var(--text-secondary)", lineHeight:1.8, marginBottom:"1rem", textAlign:"center" }}>{activeGame.description}</p>
            <div style={{ background:"linear-gradient(135deg,rgba(237,144,4,0.08),rgba(70,21,6,0.04))", borderRadius:12, padding:"1rem 1.2rem", border:"1px solid rgba(237,144,4,0.2)" }}>
              <h4 style={{ color:"var(--orange-dark)", fontWeight:700, marginBottom:"0.5rem" }}>📋 طريقة اللعب</h4>
              <p style={{ color:"var(--text-secondary)", lineHeight:1.8, fontSize:"0.95rem" }}>{activeGame.instructions}</p>
            </div>
          </div>
        </div>
      )}
      {editingGame && (
        <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&setEditingGame(null)}>
          <div className="modal-box glass-card" style={{ padding:"2rem" }}>
            <h3 style={{ marginBottom:"1rem", fontWeight:700, color:"var(--text-primary)" }}>تعديل اللعبة</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.8rem" }}>
              <input className="form-input" value={editingGame.title} onChange={e=>setEditingGame(v=>v?{...v,title:e.target.value}:v)} placeholder="الاسم"/>
              <input className="form-input" value={editingGame.icon} onChange={e=>setEditingGame(v=>v?{...v,icon:e.target.value}:v)} placeholder="الأيقونة"/>
              <input className="form-input" value={editingGame.description} onChange={e=>setEditingGame(v=>v?{...v,description:e.target.value}:v)} placeholder="الوصف"/>
              <input className="form-input" value={editingGame.players} onChange={e=>setEditingGame(v=>v?{...v,players:e.target.value}:v)} placeholder="اللاعبون"/>
              <input className="form-input" value={editingGame.duration} onChange={e=>setEditingGame(v=>v?{...v,duration:e.target.value}:v)} placeholder="المدة"/>
              <textarea className="form-input" value={editingGame.instructions} onChange={e=>setEditingGame(v=>v?{...v,instructions:e.target.value}:v)} rows={3} style={{ resize:"vertical" }} placeholder="التعليمات"/>
            </div>
            <div style={{ display:"flex", gap:"0.5rem", marginTop:"1rem" }}>
              <button className="btn-primary" onClick={()=>{ if(!editingGame) return; setGames(g=>g.map(x=>x.id===editingGame.id?editingGame:x)); setEditingGame(null); }}>حفظ</button>
              <button className="btn-dark" onClick={()=>setEditingGame(null)}>إلغاء</button>
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
function GallerySection({ isAdmin, isDark }: { isAdmin:boolean; isDark:boolean }) {
  const { ref, visible } = useScrollReveal();
  const [gallery, setGallery] = useLocalStorage<GalleryItem[]>("injaz-gallery-v2", INITIAL_GALLERY);
  const [lightbox, setLightbox] = useState<GalleryItem|null>(null);
  const [lbIdx, setLbIdx] = useState(0);
  const [filter, setFilter] = useState("الكل");
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const TABS = ["الكل", "صور", "مقاطع"] as const;
  const filtered = filter==="الكل" ? gallery : gallery.filter(g=>g.category===filter);

  const openLightbox=(item:GalleryItem)=>{ const i=filtered.findIndex(g=>g.id===item.id); setLbIdx(i); setLightbox(item); };
  const prev=()=>{ const i=(lbIdx-1+filtered.length)%filtered.length; setLbIdx(i); setLightbox(filtered[i]); };
  const next=()=>{ const i=(lbIdx+1)%filtered.length; setLbIdx(i); setLightbox(filtered[i]); };

  useEffect(()=>{
    const fn=(e:KeyboardEvent)=>{ if(!lightbox) return; if(e.key==="ArrowLeft") next(); if(e.key==="ArrowRight") prev(); if(e.key==="Escape") setLightbox(null); };
    window.addEventListener("keydown",fn); return()=>window.removeEventListener("keydown",fn);
  },[lightbox,lbIdx]);

  return (
    <section id="gallery" style={{ background: isDark ? "rgba(5,1,0,0.80)" : "linear-gradient(180deg,#fffaf5 0%,#fff8f0 100%)" }}>
      <div ref={ref} style={{ maxWidth:1100, margin:"0 auto", padding:"0 1rem" }}>
        <h2 className={`section-title gradient-text ${visible?"animate-fadeInUp":"opacity-0"}`}>المعرض</h2>
        <div className={`section-divider ${visible?"animate-fadeInUp delay-100":"opacity-0"}`}/>

        <div className={`${visible?"animate-fadeInUp delay-200":"opacity-0"}`} style={{ display:"flex", gap:"0.6rem", justifyContent:"center", flexWrap:"wrap", marginBottom:"2rem" }}>
          {TABS.map(c=>(
            <button key={c} onClick={()=>setFilter(c)}
              style={{ padding:"0.5rem 1.4rem", borderRadius:999, border:"2px solid", cursor:"pointer", transition:"all 0.3s ease", fontFamily:"'Qomra','Tajawal',sans-serif", fontWeight:700, fontSize:"1rem",
                borderColor: filter===c ? "var(--orange)" : isDark?"rgba(70,21,6,0.4)":"rgba(70,21,6,0.2)",
                background: filter===c ? "linear-gradient(135deg,var(--orange),var(--orange-dark))" : isDark?"rgba(70,21,6,0.2)":"rgba(255,255,255,0.7)",
                color: filter===c ? "white" : "var(--text-primary)",
                boxShadow: filter===c ? "0 4px 16px rgba(237,144,4,0.35)" : "none" }}>
              {c}
            </button>
          ))}
        </div>

        {isAdmin && (
          <div style={{ textAlign:"center", marginBottom:"1.5rem" }}>
            <button className="btn-primary" style={{ display:"inline-flex", alignItems:"center", gap:6 }} onClick={()=>setShowAdd(v=>!v)}>
              <span style={{ width:18, height:18 }}><Ico.Plus/></span>إضافة صورة
            </button>
          </div>
        )}
        {isAdmin && showAdd && (
          <div className="glass-card animate-fadeInUp" style={{ padding:"1.5rem", marginBottom:"2rem" }}>
            <h3 style={{ marginBottom:"1rem", color:"var(--text-primary)", fontWeight:700 }}>صورة جديدة</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"0.8rem" }}>
              <input className="form-input" placeholder="رابط الصورة *" value={newUrl} onChange={e=>setNewUrl(e.target.value)} style={{ gridColumn:"1/-1" }}/>
              <input className="form-input" placeholder="التسمية" value={newCaption} onChange={e=>setNewCaption(e.target.value)}/>
              <input className="form-input" placeholder="التصنيف" value={newCategory} onChange={e=>setNewCategory(e.target.value)}/>
            </div>
            <div style={{ display:"flex", gap:"0.5rem", marginTop:"1rem" }}>
              <button className="btn-primary" onClick={()=>{ if(!newUrl) return; setGallery(g=>[...g,{id:Date.now(),url:newUrl,caption:newCaption,category:newCategory||"متنوع"}]); setNewUrl(""); setNewCaption(""); setNewCategory(""); setShowAdd(false); }}>إضافة</button>
              <button className="btn-dark" onClick={()=>setShowAdd(false)}>إلغاء</button>
            </div>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"1rem" }}>
          {filtered.map((item,i)=>(
            <div key={item.id} className={`gallery-item ${visible?"animate-fadeInUp":"opacity-0"}`}
              style={{ animationDelay:`${0.1+i*0.06}s`, position:"relative" }}
              onClick={()=>openLightbox(item)}>
              <img src={item.url} alt={item.caption} loading="lazy" onError={e=>{(e.target as HTMLImageElement).src="https://via.placeholder.com/400x300/461506/ED9004?text=صورة";}}/>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(0deg,rgba(0,0,0,0.75) 0%,transparent 60%)", opacity:0, transition:"opacity 0.3s ease", display:"flex", alignItems:"flex-end", padding:"0.8rem" }}
                onMouseEnter={e=>(e.currentTarget.style.opacity="1")}
                onMouseLeave={e=>(e.currentTarget.style.opacity="0")}>
                <div>
                  <p style={{ color:"white", fontWeight:600, fontSize:"0.9rem" }}>{item.caption}</p>
                  <span style={{ color:"rgba(237,144,4,0.9)", fontSize:"0.75rem" }}>{item.category}</span>
                </div>
                {isAdmin && (
                  <button style={{ position:"absolute", top:8, left:8, background:"rgba(220,38,38,0.8)", border:"none", borderRadius:6, cursor:"pointer", color:"white", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center" }}
                    onClick={e=>{ e.stopPropagation(); setGallery(g=>g.filter(x=>x.id!==item.id)); }}>
                    <span style={{ width:14, height:14 }}><Ico.Trash/></span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="lightbox" onClick={()=>setLightbox(null)}>
          <button onClick={e=>{e.stopPropagation();prev();}} style={{ position:"absolute", right:"1rem", top:"50%", transform:"translateY(-50%)", background:"rgba(70,21,6,0.4)", border:"1px solid rgba(70,21,6,0.6)", borderRadius:"50%", width:48, height:48, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"white" }}>
            <span style={{ width:22, height:22 }}><Ico.ChevR/></span>
          </button>
          <div onClick={e=>e.stopPropagation()} style={{ textAlign:"center" }}>
            <img src={lightbox.url} alt={lightbox.caption}/>
            <p style={{ color:"white", fontSize:"1.1rem", fontWeight:600, marginTop:"1rem" }}>{lightbox.caption}</p>
            <p style={{ color:"rgba(237,144,4,0.8)", fontSize:"0.85rem" }}>{lightbox.category}</p>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.8rem", marginTop:"0.3rem" }}>{lbIdx+1} / {filtered.length}</p>
          </div>
          <button onClick={e=>{e.stopPropagation();next();}} style={{ position:"absolute", left:"1rem", top:"50%", transform:"translateY(-50%)", background:"rgba(70,21,6,0.4)", border:"1px solid rgba(70,21,6,0.6)", borderRadius:"50%", width:48, height:48, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"white" }}>
            <span style={{ width:22, height:22 }}><Ico.ChevL/></span>
          </button>
          <button onClick={()=>setLightbox(null)} style={{ position:"absolute", top:"1rem", left:"1rem", background:"rgba(70,21,6,0.5)", border:"none", borderRadius:"50%", width:40, height:40, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"white" }}>
            <span style={{ width:18, height:18 }}><Ico.X/></span>
          </button>
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────
// MEMBER OF THE MONTH
// ─────────────────────────────────────────────
function MemberOfMonthSection({ isAdmin, isDark }: { isAdmin:boolean; isDark:boolean }) {
  const { ref, visible } = useScrollReveal();
  const [mom, setMom] = useLocalStorage<MemberOfMonth>("injaz-mom", { name:"أحمد محمد الزهراني", achievement:"قاد فريقه بنجاح نحو إطلاق أول مشروع رقمي للمجموعة، وحقق نتائج استثنائية تجاوزت جميع التوقعات المحددة.", imageUrl:null });
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <section id="mom" style={{ background: isDark?"rgba(0,0,0,0.78)":"linear-gradient(180deg,#fff8f0 0%,#fff 100%)" }}>
      <div ref={ref} style={{ maxWidth:900, margin:"0 auto", padding:"0 1rem" }}>
        <h2 className={`section-title gradient-text ${visible?"animate-fadeInUp":"opacity-0"}`}>عضو الشهر</h2>
        <div className={`section-divider ${visible?"animate-fadeInUp delay-100":"opacity-0"}`}/>
        <div className={`${visible?"animate-scaleIn delay-200":"opacity-0"}`}>
          <div className="mom-bg">
            {mom.imageUrl && <img src={mom.imageUrl} alt="عضو الشهر"/>}
            {!mom.imageUrl && (
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontSize:"8rem", opacity:0.12 }}>⭐</div>
              </div>
            )}
            <div className="mom-overlay">
              <div style={{ display:"flex", alignItems:"flex-start", gap:"1rem", flexWrap:"wrap" }}>
                <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#ED9004,#c97800)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 20px rgba(237,144,4,0.5)", border:"3px solid rgba(237,144,4,0.5)" }}>
                  <span style={{ color:"white", width:30, height:30 }}><Ico.Star/></span>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ color:"rgba(237,144,4,0.9)", fontWeight:600, fontSize:"0.85rem", marginBottom:"0.3rem" }}>🏆 عضو شهر {new Date().toLocaleDateString("ar-SA",{month:"long",year:"numeric"})}</p>
                  {isAdmin ? (
                    <input className="form-input" value={mom.name} onChange={e=>setMom(m=>({...m,name:e.target.value}))}
                      style={{ background:"rgba(255,255,255,0.12)", color:"white", border:"1px solid rgba(255,255,255,0.25)", marginBottom:"0.5rem", fontSize:"1.4rem", fontWeight:700 }}/>
                  ) : (
                    <h2 style={{ color:"white", fontSize:"1.8rem", fontWeight:800, marginBottom:"0.5rem", fontFamily:"'Amiri',serif" }}>{mom.name}</h2>
                  )}
                  {isAdmin ? (
                    <textarea className="form-input" value={mom.achievement} onChange={e=>setMom(m=>({...m,achievement:e.target.value}))} rows={2}
                      style={{ background:"rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.9)", border:"1px solid rgba(255,255,255,0.25)", resize:"vertical" }}/>
                  ) : (
                    <p style={{ color:"rgba(255,255,255,0.85)", lineHeight:1.75, fontSize:"0.98rem" }}>{mom.achievement}</p>
                  )}
                </div>
              </div>
              {isAdmin && (
                <div style={{ marginTop:"1rem" }}>
                  <input ref={fileRef} type="file" accept="image/*" onChange={e=>{ const f=e.target.files?.[0]; if(f) setMom(m=>({...m,imageUrl:URL.createObjectURL(f)})); }} style={{ display:"none" }}/>
                  <button className="btn-primary" style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:"0.85rem" }} onClick={()=>fileRef.current?.click()}>
                    <span style={{ width:16, height:16 }}><Ico.Upload/></span>
                    {mom.imageUrl?"تغيير الصورة":"رفع صورة الخلفية"}
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
function CodeViewerModal({ onClose }: { onClose:()=>void }) {
  const [copied, setCopied] = useState(false);
  const [activeFile, setActiveFile] = useState<"app"|"css">("app");

  const content = { app: appRaw, css: cssRaw };

  return (
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ width:"min(900px,96vw)", animation:"modalContent 0.35s cubic-bezier(0.23,1,0.32,1)" }}>
        <div style={{ background:"#1a1a1a", borderRadius:20, overflow:"hidden", border:"1px solid rgba(70,21,6,0.5)", boxShadow:"0 25px 80px rgba(0,0,0,0.8)" }}>
          <div style={{ background:"linear-gradient(135deg,#461506,#2a0d03)", padding:"1rem 1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid rgba(70,21,6,0.4)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.8rem" }}>
              <span style={{ width:22, height:22, color:"var(--orange)" }}><Ico.Code/></span>
              <h2 style={{ color:"white", fontFamily:"'Tajawal',sans-serif", fontWeight:700, fontSize:"1.1rem" }}>كود الموقع</h2>
            </div>
            <div style={{ display:"flex", gap:"0.5rem" }}>
              <button onClick={()=>{ navigator.clipboard.writeText(content[activeFile]).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); }); }} className="btn-primary" style={{ fontSize:"0.8rem", padding:"0.4rem 0.9rem", display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ width:14, height:14 }}>{copied?<Ico.Check/>:<Ico.Copy/>}</span>{copied?"تم النسخ!":"نسخ"}
              </button>
              <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:8, cursor:"pointer", width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", color:"white" }}>
                <span style={{ width:16, height:16 }}><Ico.X/></span>
              </button>
            </div>
          </div>
          <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.08)", background:"#111" }}>
            {(["app","css"] as const).map(f=>(
              <button key={f} onClick={()=>setActiveFile(f)}
                style={{ padding:"0.6rem 1.2rem", background:"none", border:"none", cursor:"pointer", fontFamily:"'Courier New',monospace", fontSize:"0.82rem",
                  color: activeFile===f ? "var(--orange)" : "rgba(255,255,255,0.4)",
                  borderBottom: activeFile===f ? "2px solid var(--orange)" : "2px solid transparent", transition:"all 0.2s" }}>
                {f==="app"?"App.tsx":"index.css"}
              </button>
            ))}
          </div>
          <div className="code-viewer" style={{ borderRadius:0 }}>
            <div style={{ position:"absolute", top:0, right:0, left:0, height:32, background:"#0d0d0d", display:"flex", alignItems:"center", padding:"0 1rem", gap:6 }}>
              {["#ff5f56","#ffbd2e","#27c93f"].map(c=><div key={c} style={{ width:12, height:12, borderRadius:"50%", background:c }}/>)}
              <span style={{ marginRight:"auto", color:"rgba(255,255,255,0.3)", fontSize:"0.72rem", fontFamily:"monospace" }}>
                {activeFile==="app"?"artifacts/injaz-website/src/App.tsx":"artifacts/injaz-website/src/index.css"}
              </span>
            </div>
            <pre style={{ paddingTop:"2.5rem" }}><code style={{ color:"#a8d8a8" }}>{content[activeFile]}</code></pre>
          </div>
          <div style={{ background:"rgba(70,21,6,0.2)", borderTop:"1px solid rgba(70,21,6,0.3)", padding:"0.8rem 1.5rem" }}>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.8rem", fontFamily:"'Tajawal',sans-serif" }}>
              💡 الملفات الكاملة في <code style={{ color:"var(--orange)", background:"rgba(237,144,4,0.12)", padding:"0 4px", borderRadius:4 }}>artifacts/injaz-website/src/</code>
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
function Footer({ onShowCode, isDark }: { onShowCode:()=>void; isDark:boolean }) {
  return (
    <footer className="site-footer">
      <div style={{ position:"absolute", inset:0, opacity: isDark ? 0.3 : 0.05,
        backgroundImage:"repeating-linear-gradient(45deg,rgba(70,21,6,0.8) 0,rgba(70,21,6,0.8) 1px,transparent 0,transparent 50%),repeating-linear-gradient(-45deg,rgba(70,21,6,0.8) 0,rgba(70,21,6,0.8) 1px,transparent 0,transparent 50%)",
        backgroundSize:"25px 25px", pointerEvents:"none",
        filter: isDark ? "none" : "none" }}/>
      {/* Brown glow in dark mode */}
      {isDark && <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center, rgba(70,21,6,0.4) 0%, transparent 70%)", pointerEvents:"none" }}/>}
      <div style={{ position:"relative", zIndex:1, maxWidth:800, margin:"0 auto" }}>
        <img src={logoNoBg} alt="شعار" style={{ width:70, height:70, objectFit:"contain", display:"block", margin:"0 auto 1rem",
          filter: isDark ? "drop-shadow(0 4px 16px rgba(70,21,6,1)) drop-shadow(0 0 30px rgba(70,21,6,0.7))" : "drop-shadow(0 4px 12px rgba(237,144,4,0.4))" }}/>
        <h3 style={{ fontFamily:"'Amiri',serif", fontSize:"1.4rem", color:"rgba(237,144,4,0.9)", marginBottom:"0.4rem" }}>الإنجاز الإبداعي</h3>
        <p style={{ fontSize:"0.9rem", marginBottom:"2rem", color:"rgba(255,255,255,0.45)", lineHeight:1.7 }}>نبني الإبداع · نصنع الإنجاز · نحقق الأثر</p>
        <div style={{ display:"flex", justifyContent:"center", gap:"1rem", flexWrap:"wrap", marginBottom:"2rem" }}>
          {[["الرئيسية","hero"],["من نحن","about"],["الأعضاء","members"],["الألعاب","games"],["المعرض","gallery"]].map(([l,id])=>(
            <button key={id} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontFamily:"'Tajawal',sans-serif", fontSize:"0.9rem", transition:"color 0.2s" }}
              onMouseEnter={e=>(e.currentTarget.style.color="rgba(237,144,4,0.9)")}
              onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.5)")}
              onClick={()=>document.querySelector(`#${id}`)?.scrollIntoView({behavior:"smooth"})}>
              {l}
            </button>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(70,21,6,0.4)", paddingTop:"1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem" }}>
          <p style={{ fontSize:"0.82rem", color:"rgba(255,255,255,0.3)" }}>© {new Date().getFullYear()} الإنجاز الإبداعي — جميع الحقوق محفوظة</p>
          <button onClick={onShowCode}
            style={{ background:"rgba(70,21,6,0.3)", border:"1px solid rgba(70,21,6,0.5)", borderRadius:10, padding:"0.5rem 1rem", cursor:"pointer", color:"rgba(237,144,4,0.8)", fontFamily:"'Tajawal',sans-serif", fontSize:"0.85rem", display:"flex", alignItems:"center", gap:6, transition:"all 0.3s ease" }}
            onMouseEnter={e=>{ (e.currentTarget).style.background="rgba(70,21,6,0.5)"; (e.currentTarget).style.borderColor="rgba(70,21,6,0.7)"; }}
            onMouseLeave={e=>{ (e.currentTarget).style.background="rgba(70,21,6,0.3)"; (e.currentTarget).style.borderColor="rgba(70,21,6,0.5)"; }}>
            <span style={{ width:16, height:16 }}><Ico.Code/></span>عرض كود الموقع
          </button>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// FLOATING CODE BUTTON
// ─────────────────────────────────────────────
function FloatingCodeButton({ onClick, isDark }: { onClick:()=>void; isDark:boolean }) {
  return (
    <button onClick={onClick}
      style={{ position:"fixed", bottom:"1.5rem", right:"1.5rem", zIndex:800, width:52, height:52, borderRadius:"50%",
        background: isDark ? "linear-gradient(135deg,#000,#461506)" : "linear-gradient(135deg,#461506,#8b3010)",
        border:"2px solid rgba(70,21,6,0.6)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
        color:"rgba(237,144,4,0.9)", boxShadow: isDark ? "0 4px 20px rgba(70,21,6,0.8), 0 0 30px rgba(70,21,6,0.4)" : "0 4px 20px rgba(70,21,6,0.4)",
        transition:"all 0.3s ease" }}
      title="عرض كود الموقع"
      onMouseEnter={e=>{ (e.currentTarget).style.transform="scale(1.12)"; (e.currentTarget).style.boxShadow="0 8px 30px rgba(70,21,6,0.9)"; }}
      onMouseLeave={e=>{ (e.currentTarget).style.transform="scale(1)"; (e.currentTarget).style.boxShadow= isDark?"0 4px 20px rgba(70,21,6,0.8)":"0 4px 20px rgba(70,21,6,0.4)"; }}>
      <span style={{ width:22, height:22 }}><Ico.Code/></span>
    </button>
  );
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showAdminCenter, setShowAdminCenter] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [toast, setToast] = useState<{msg:string; type:"success"|"error"|"info"}|null>(null);
  const [admins, setAdmins] = useLocalStorage<AdminUser[]>("injaz-admins", INITIAL_ADMINS);
  const [failedLogins, setFailedLogins] = useLocalStorage<FailedLogin[]>("injaz-failed-logins", []);

  /* persist theme */
  useEffect(()=>{ const saved=localStorage.getItem("injaz-theme"); if(saved==="dark") setIsDark(true); },[]);
  useEffect(()=>{
    document.documentElement.setAttribute("data-theme", isDark?"dark":"light");
    localStorage.setItem("injaz-theme", isDark?"dark":"light");
  },[isDark]);

  const showToast=useCallback((msg:string, type:"success"|"error"|"info"="info")=>{
    setToast({msg,type}); setTimeout(()=>setToast(null),3000);
  },[]);

  const handleLoginSuccess=(username:string)=>{ setIsAdmin(true); setCurrentUser(username); setShowAuth(false); showToast(`مرحباً ${username}! تم تسجيل دخولك كمدير`,"success"); };
  const handleLogout=()=>{ setIsAdmin(false); setCurrentUser(""); showToast("تم تسجيل خروجك بنجاح","info"); };
  const toggleTheme=()=>setIsDark(v=>!v);
  const handleFailedAttempt=(username:string, location:string)=>{
    setFailedLogins(prev=>[...prev,{
      id:Date.now(), username, location,
      attemptedAt: new Date().toLocaleString("ar-SA",{dateStyle:"short",timeStyle:"medium"})
    }]);
  };

  return (
    <div data-theme={isDark?"dark":"light"} style={{ minHeight:"100vh", background:"var(--bg-base)", transition:"background 0.5s ease", position:"relative" }}>

      {/* ── Full-page Background Pattern ── */}
      <div className={`site-bg ${isDark?"dark":"light"}`}/>

      {/* ── Dark mode extra overlay (deep black base) ── */}
      {isDark && (
        <div style={{ position:"fixed", inset:0, zIndex:0,
          background:"radial-gradient(ellipse at 20% 30%, rgba(70,21,6,0.25) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(70,21,6,0.2) 0%, transparent 60%)",
          pointerEvents:"none" }}/>
      )}

      {/* Header */}
      <Header isAdmin={isAdmin} isDark={isDark} onLoginClick={()=>setShowAuth(true)} onLogout={handleLogout} onToggleTheme={toggleTheme} onAdminCenter={()=>setShowAdminCenter(true)} failedCount={failedLogins.length}/>

      {/* Sections */}
      <main style={{ position:"relative", zIndex:1 }}>
        <HeroSection onScrollDown={()=>document.querySelector("#about")?.scrollIntoView({behavior:"smooth"})} isDark={isDark}/>
        <AboutSection isDark={isDark}/>
        <MembersSection isAdmin={isAdmin} isDark={isDark}/>
        <GamesSection isAdmin={isAdmin} isDark={isDark}/>
        <GallerySection isAdmin={isAdmin} isDark={isDark}/>
        <MemberOfMonthSection isAdmin={isAdmin} isDark={isDark}/>
      </main>

      <Footer onShowCode={()=>setShowCode(true)} isDark={isDark}/>
      <FloatingCodeButton onClick={()=>setShowCode(true)} isDark={isDark}/>

      {/* Modals */}
      {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onSuccess={handleLoginSuccess} admins={admins} onFailedAttempt={handleFailedAttempt}/>}
      {showCode && <CodeViewerModal onClose={()=>setShowCode(false)}/>}
      {showAdminCenter && isAdmin && (
        <AdminCenterModal
          onClose={()=>setShowAdminCenter(false)}
          admins={admins} setAdmins={setAdmins}
          failedLogins={failedLogins} setFailedLogins={setFailedLogins}
          currentUser={currentUser}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.msg} type={toast.type}/>}
    </div>
  );
}
