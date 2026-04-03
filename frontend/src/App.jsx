import { useState, useEffect, useRef, useCallback } from "react";

const API_URL = "https://blog-api-emmanuel.onrender.com/api/articles";

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black:   #010203;
    --dark:    #030508;
    --card:    #05080f;
    --border:  #111827;
    --border2: #1a2535;
    --blue:    #2563eb;
    --blue2:   #010203;
    --blue3:   #60a5fa;
    --blue4:   #000000;
    --gray:    #4a5568;
    --gray2:   #718096;
    --light:   #000000;
    --white:   #e2e8f0;
    --glow:    rgba(37,99,235,0.2);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--light);
    font-family: 'Outfit', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--dark); }
  ::-webkit-scrollbar-thumb { background: var(--blue); border-radius: 4px; }

  /* ── CANVAS ── */
  #space-canvas {
    position: fixed; inset: 0;
    pointer-events: none; z-index: 0;
    opacity: 0.6;
  }

  /* ── LAYOUT ── */
  .app-wrapper {
    position: relative; z-index: 1;
    display: grid;
    grid-template-columns: 260px 1fr;
    min-height: 100vh;
  }

  /* ── SIDEBAR ── */
  .sidebar {
    background: rgba(13,17,23,0.92);
    border-right: 1px solid var(--border);
    padding: 28px 20px;
    display: flex; flex-direction: column; gap: 8px;
    position: sticky; top: 0; height: 100vh;
    backdrop-filter: blur(20px);
  }

  .sidebar-logo {
    display: flex; align-items: center; gap: 10px;
    padding: 0 8px 24px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 8px;
  }

  .logo-icon {
    width: 36px; height: 36px;
    background: var(--blue);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    box-shadow: 0 0 20px var(--glow);
    flex-shrink: 0;
  }

  .logo-text { font-size: 1rem; font-weight: 800; color: var(--white); }
  .logo-sub { font-size: 0.65rem; color: var(--gray2); font-family: 'JetBrains Mono', monospace; }

  .nav-section {
    font-size: 0.6rem; font-weight: 600; letter-spacing: 0.12em;
    color: var(--gray); text-transform: uppercase;
    padding: 12px 8px 4px; font-family: 'JetBrains Mono', monospace;
  }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px;
    cursor: pointer; transition: all 0.2s;
    font-size: 0.85rem; font-weight: 500; color: var(--gray2);
    border: 1px solid transparent;
    position: relative; overflow: hidden;
    background: none;
    width: 100%; text-align: left;
  }

  .nav-item::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--blue) 0%, transparent 100%);
    opacity: 0; transition: opacity 0.2s;
  }

  .nav-item:hover { color: var(--white); border-color: var(--border); }
  .nav-item:hover::before { opacity: 0.06; }

  .nav-item.active {
    color: var(--blue3); background: rgba(37,99,235,0.12);
    border-color: rgba(37,99,235,0.3);
    box-shadow: 0 0 16px rgba(37,99,235,0.1);
  }

  .nav-item.active::before { opacity: 0.1; }

  .nav-icon { font-size: 1rem; z-index: 1; flex-shrink: 0; }
  .nav-label { z-index: 1; }

  .method-dot {
    width: 6px; height: 6px; border-radius: 50%;
    margin-left: auto; z-index: 1; flex-shrink: 0;
  }

  .sidebar-footer {
    margin-top: auto; padding-top: 16px;
    border-top: 1px solid var(--border);
  }

  .author-card {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px;
    background: rgba(37,99,235,0.06);
    border: 1px solid var(--border);
  }

  .author-avatar {
    width: 32px; height: 32px; border-radius: 8px;
    background: linear-gradient(135deg, var(--blue), var(--blue3));
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 800; color: white; flex-shrink: 0;
  }

  .author-name { font-size: 0.75rem; font-weight: 600; color: var(--white); }
  .author-id { font-size: 0.6rem; color: var(--gray); font-family: 'JetBrains Mono', monospace; }

  /* ── MAIN ── */
  .main {
    display: flex; flex-direction: column;
    min-height: 100vh;
  }

  /* ── TOPBAR ── */
  .topbar {
    background: rgba(13,17,23,0.85);
    border-bottom: 1px solid var(--border);
    padding: 16px 32px;
    display: flex; align-items: center; justify-content: space-between;
    backdrop-filter: blur(20px);
    position: sticky; top: 0; z-index: 50;
  }

  .topbar-title { font-size: 1.1rem; font-weight: 700; color: var(--white); }
  .topbar-sub {
    font-size: 0.7rem; color: var(--gray);
    font-family: 'JetBrains Mono', monospace; margin-top: 1px;
  }

  .topbar-right { display: flex; align-items: center; gap: 12px; }

  .status-badge {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 12px; border-radius: 100px;
    background: var(--card); border: 1px solid var(--border);
    font-family: 'JetBrains Mono', monospace; font-size: 0.65rem;
    color: var(--gray2); transition: all 0.3s;
  }

  .status-badge.live { border-color: rgba(34,197,94,0.4); color: #4ade80; }
  .status-badge.offline { border-color: rgba(239,68,68,0.4); color: #f87171; }

  .status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: currentColor;
  }

  .status-badge.live .status-dot { animation: ping 2s infinite; }

  @keyframes ping {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .refresh-btn {
    padding: 7px 14px; border-radius: 8px;
    background: rgba(37,99,235,0.15); border: 1px solid rgba(37,99,235,0.3);
    color: var(--blue3); font-size: 0.75rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s; font-family: 'Outfit', sans-serif;
  }

  .refresh-btn:hover { background: rgba(37,99,235,0.25); transform: translateY(-1px); }

  /* ── CONTENT ── */
  .content { padding: 32px; flex: 1; }

  /* ── HERO STATS ── */
  .stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; padding: 20px;
    position: relative; overflow: hidden;
    transition: all 0.3s;
    animation: slideUp 0.5s ease forwards;
    opacity: 0; transform: translateY(20px);
  }

  .stat-card:hover {
    border-color: var(--border2); transform: translateY(-3px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }

  .stat-card::after {
    content: ''; position: absolute;
    top: -30px; right: -30px;
    width: 100px; height: 100px;
    background: radial-gradient(circle, var(--glow) 0%, transparent 70%);
    pointer-events: none;
  }

  @keyframes slideUp {
    to { opacity: 1; transform: translateY(0); }
  }

  .stat-icon { font-size: 1.5rem; margin-bottom: 12px; }
  .stat-value {
    font-size: 2rem; font-weight: 800; color: var(--white);
    line-height: 1; font-variant-numeric: tabular-nums;
  }

  .stat-label { font-size: 0.72rem; color: var(--gray); margin-top: 4px; letter-spacing: 0.03em; }
  .stat-method {
    position: absolute; top: 16px; right: 16px;
    font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
    padding: 3px 8px; border-radius: 4px; font-weight: 500;
  }

  /* ── SECTION ── */
  .section { margin-bottom: 40px; }

  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 1.1rem; font-weight: 700; color: var(--white);
    display: flex; align-items: center; gap: 8px;
  }

  .section-badge {
    font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
    padding: 3px 8px; border-radius: 4px;
    background: rgba(37,99,235,0.15); color: var(--blue3);
    border: 1px solid rgba(37,99,235,0.25);
  }

  /* ── FORM CARD ── */
  .form-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px;
    position: relative; overflow: hidden;
  }

  .form-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--blue), var(--blue3), transparent);
  }

  .form-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
    margin-bottom: 20px;
  }

  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-group.full { grid-column: 1 / -1; }

  .form-label {
    font-size: 0.68rem; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--gray2);
    font-family: 'JetBrains Mono', monospace;
  }

  .form-input, .form-textarea {
    background: rgba(6,8,16,0.8); border: 1px solid var(--border);
    border-radius: 10px; padding: 11px 14px;
    color: var(--white); font-family: 'Outfit', sans-serif; font-size: 0.85rem;
    outline: none; transition: all 0.2s; width: 100%;
  }

  .form-input:focus, .form-textarea:focus {
    border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
  }

  .form-textarea { resize: vertical; min-height: 90px; }

  .form-actions { display: flex; gap: 10px; }

  .btn-primary {
    padding: 11px 24px; border-radius: 10px;
    background: var(--blue); border: none; color: white;
    font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 0.85rem;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.02em;
    display: flex; align-items: center; gap: 6px;
    box-shadow: 0 4px 16px var(--glow);
  }

  .btn-primary:hover {
    background: var(--blue2); transform: translateY(-2px);
    box-shadow: 0 8px 24px var(--glow);
  }

  .btn-primary:active { transform: translateY(0); }

  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .btn-ghost {
    padding: 11px 20px; border-radius: 10px;
    background: transparent; border: 1px solid var(--border);
    color: var(--gray2); font-family: 'Outfit', sans-serif;
    font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
  }

  .btn-ghost:hover { border-color: var(--border2); color: var(--white); }

  /* ── ARTICLES GRID ── */
  .articles-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  .article-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; padding: 22px;
    position: relative; overflow: hidden;
    transition: all 0.3s; cursor: default;
    animation: fadeCard 0.4s ease forwards;
    opacity: 0;
  }

  @keyframes fadeCard {
    to { opacity: 1; }
  }

  .article-card:hover {
    border-color: var(--border2); transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.4);
  }

  .article-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99,155,255,0.2), transparent);
  }

  .card-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 10px; margin-bottom: 14px;
  }

  .card-id {
    font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
    color: var(--blue3); background: rgba(37,99,235,0.1);
    border: 1px solid rgba(37,99,235,0.2);
    padding: 2px 8px; border-radius: 4px; flex-shrink: 0;
  }

  .card-actions { display: flex; gap: 6px; }

  .icon-btn {
    width: 28px; height: 28px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid transparent; cursor: pointer; font-size: 0.8rem;
    transition: all 0.2s; background: none;
  }

  .icon-btn.edit {
    color: #fbbf24; border-color: rgba(251,191,36,0.2);
    background: rgba(251,191,36,0.06);
  }

  .icon-btn.edit:hover { background: rgba(251,191,36,0.15); transform: scale(1.1); }

  .icon-btn.del {
    color: #f87171; border-color: rgba(248,113,113,0.2);
    background: rgba(248,113,113,0.06);
  }

  .icon-btn.del:hover { background: rgba(248,113,113,0.15); transform: scale(1.1); }

  .card-title {
    font-size: 0.95rem; font-weight: 700; color: var(--white);
    margin-bottom: 8px; line-height: 1.3;
  }

  .card-content {
    font-size: 0.78rem; color: var(--gray2); line-height: 1.6;
    margin-bottom: 14px;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-tags {
    display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px;
  }

  .tag {
    font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
    padding: 2px 8px; border-radius: 4px;
    background: rgba(14,22,36,0.8); border: 1px solid var(--border);
    color: var(--gray2);
  }

  .card-footer {
    border-top: 1px solid var(--border); padding-top: 12px;
    display: flex; align-items: center; justify-content: space-between;
  }

  .card-author { font-size: 0.72rem; color: var(--gray2); }
  .card-author span { color: var(--blue3); font-weight: 600; }
  .card-date { font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; color: var(--gray); }

  /* ── EMPTY / LOADER ── */
  .loader-wrap {
    grid-column: 1 / -1; display: flex;
    justify-content: center; align-items: center; padding: 80px;
  }

  .spinner {
    width: 40px; height: 40px; border-radius: 50%;
    border: 3px solid var(--border);
    border-top-color: var(--blue);
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .empty-wrap {
    grid-column: 1 / -1; text-align: center; padding: 80px;
  }

  .empty-icon { font-size: 3rem; opacity: 0.2; margin-bottom: 16px; }
  .empty-text { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--gray); letter-spacing: 0.05em; }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(6,8,16,0.88); backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none; transition: opacity 0.25s;
  }

  .modal-overlay.open { opacity: 1; pointer-events: all; }

  .modal {
    background: var(--card); border: 1px solid var(--border2);
    border-radius: 20px; padding: 32px; width: 90%; max-width: 560px;
    transform: translateY(24px) scale(0.96); transition: all 0.3s;
    position: relative; overflow: hidden;
  }

  .modal::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--blue), var(--blue3), transparent);
  }

  .modal-overlay.open .modal { transform: translateY(0) scale(1); }

  .modal-header {
    display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 24px;
  }

  .modal-title { font-size: 1.1rem; font-weight: 700; color: var(--white); }

  .modal-close {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--dark); border: 1px solid var(--border);
    color: var(--gray); cursor: pointer; font-size: 1rem;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }

  .modal-close:hover { color: var(--white); border-color: var(--border2); }

  /* ── TOAST ── */
  .toast {
    position: fixed; bottom: 28px; right: 28px; z-index: 300;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; padding: 14px 18px;
    display: flex; align-items: center; gap: 10px;
    font-size: 0.8rem; font-weight: 500; color: var(--white);
    transform: translateY(80px); opacity: 0;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    max-width: 320px;
  }

  .toast.show { transform: translateY(0); opacity: 1; }
  .toast.success { border-color: rgba(74,222,128,0.3); }
  .toast.error { border-color: rgba(248,113,113,0.3); }
  .toast-icon { font-size: 1rem; flex-shrink: 0; }

  /* ── METHOD COLORS ── */
  .m-get { background: rgba(59,130,246,0.15); color: #60a5fa; }
  .m-post { background: rgba(34,197,94,0.15); color: #4ade80; }
  .m-put { background: rgba(251,191,36,0.15); color: #fbbf24; }
  .m-patch { background: rgba(251,191,36,0.1); color: #fcd34d; }
  .m-del { background: rgba(248,113,113,0.15); color: #f87171; }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .app-wrapper { grid-template-columns: 1fr; }
    .sidebar { display: none; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .form-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 560px) {
    .stats-grid { grid-template-columns: 1fr; }
    .content { padding: 16px; }
  }
`;

// ─── TOAST HOOK ──────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState({ msg: "", type: "success", show: false });
  const timer = useRef(null);
  const show = useCallback((msg, type = "success") => {
    clearTimeout(timer.current);
    setToast({ msg, type, show: true });
    timer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  }, []);
  return { toast, show };
}

// ─── CANVAS BG ───────────────────────────────────────────────────────────────
function SpaceCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let W, H, pts = [], raf;
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    const init = () => {
      pts = Array.from({ length: 70 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
        r: Math.random() * 1.2 + .3
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(96,165,250,0.5)";
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(37,99,235,${.06 * (1 - d / 130)})`;
            ctx.lineWidth = .6;
            ctx.stroke();
          }
        }
      raf = requestAnimationFrame(draw);
    };
    resize(); init(); draw();
    window.addEventListener("resize", () => { resize(); init(); });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas id="space-canvas" ref={ref} />;
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("dashboard");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("connecting");
  const [editData, setEditData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast, show } = useToast();

  // form
  const emptyForm = { titre: "", contenu: "", auteur: "", date: "", categorie: "", tags: "" };
  const [form, setForm] = useState({ ...emptyForm, date: new Date().toISOString().split("T")[0] });

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // fetch
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(API);
      if (!r.ok) throw new Error();
      const d = await r.json();
      setArticles(Array.isArray(d) ? d : d.data || d.articles || []);
      setStatus("live");
    } catch {
      setStatus("offline");
      show("API non disponible", "error");
    } finally { setLoading(false); }
  }, [show]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  // CREATE
  const createArticle = async () => {
    if (!form.titre || !form.contenu || !form.auteur) {
      show("Titre, contenu et auteur requis", "error"); return;
    }
    setSubmitting(true);
    try {
      const r = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!r.ok) throw new Error();
      show("Article publié avec succès ✓");
      setForm({ ...emptyForm, date: new Date().toISOString().split("T")[0] });
      fetchArticles();
    } catch { show("Erreur lors de la création", "error"); }
    finally { setSubmitting(false); }
  };

  // DELETE
  const deleteArticle = async (id) => {
    if (!window.confirm("Supprimer cet article définitivement ?")) return;
    try {
      const r = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error();
      show("Article supprimé");
      fetchArticles();
    } catch { show("Erreur suppression", "error"); }
  };

  // UPDATE
  const updateArticle = async () => {
    if (!editData) return;
    setSubmitting(true);
    try {
      const r = await fetch(`${API}/${editData.id || editData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData)
      });
      if (!r.ok) throw new Error();
      show("Article modifié ✓");
      setEditData(null);
      fetchArticles();
    } catch { show("Erreur modification", "error"); }
    finally { setSubmitting(false); }
  };

  const navItems = [
    { id: "dashboard", icon: "⬛", label: "Dashboard", method: null },
    { id: "articles", icon: "📄", label: "Tous les articles", method: "GET", color: "#60a5fa" },
    { id: "create", icon: "✏️", label: "Créer un article", method: "POST", color: "#4ade80" },
  ];

  return (
    <>
      <style>{styles}</style>
      <SpaceCanvas />

      <div className="app-wrapper">
        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">📝</div>
            <div>
              <div className="logo-text">BlogAPI</div>
              <div className="logo-sub">EMMANUEL · INF222</div>
            </div>
          </div>

          <div className="nav-section">Navigation</div>
          {navItems.map(n => (
            <button key={n.id} className={`nav-item${view === n.id ? " active" : ""}`}
              onClick={() => setView(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
              {n.method && (
                <span className="method-dot" style={{ background: n.color }} />
              )}
            </button>
          ))}

          <div className="nav-section" style={{ marginTop: 8 }}>API Endpoints</div>
          {[
            { m: "GET", p: "/api/articles", c: "m-get" },
            { m: "POST", p: "/api/articles", c: "m-post" },
            { m: "PUT", p: "/:id", c: "m-put" },
            { m: "PATCH", p: "/:id", c: "m-patch" },
            { m: "DELETE", p: "/:id", c: "m-del" },
          ].map(e => (
            <div key={e.m + e.p} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px" }}>
              <span className={`section-badge ${e.c}`} style={{ minWidth: 52, textAlign: "center" }}>{e.m}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", color: "var(--gray2)" }}>{e.p}</span>
            </div>
          ))}

          <div className="sidebar-footer">
            <div className="author-card">
              <div className="author-avatar">KE</div>
              <div>
                <div className="author-name">KAMDEM Emmanuel</div>
                <div className="author-id">24F2805 · INF222</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main">
          {/* TOPBAR */}
          <div className="topbar">
            <div>
              <div className="topbar-title">
                {view === "dashboard" && "🏠 Dashboard"}
                {view === "articles" && "📄 Tous les articles"}
                {view === "create" && "✏️ Créer un article"}
              </div>
              <div className="topbar-sub">Blog API — KAMDEM NDEFFO FRANCK EMMANUEL</div>
            </div>
            <div className="topbar-right">
              <div className={`status-badge ${status}`}>
                <span className="status-dot" />
                {status === "live" ? "API LIVE" : status === "offline" ? "OFFLINE" : "CONNECTING..."}
              </div>
              <button className="refresh-btn" onClick={fetchArticles}>↻ Refresh</button>
            </div>
          </div>

          <div className="content">
            {/* ── DASHBOARD ── */}
            {view === "dashboard" && (
              <>
                <div className="stats-grid">
                  {[
                    { icon: "📰", value: articles.length, label: "Articles total", method: "GET", cls: "m-get", delay: "0s" },
                    { icon: "✍️", value: new Set(articles.map(a => a.auteur)).size, label: "Auteurs uniques", method: "GET", cls: "m-get", delay: ".1s" },
                    { icon: "🗂️", value: new Set(articles.map(a => a.categorie).filter(Boolean)).size, label: "Catégories", method: "GET", cls: "m-get", delay: ".2s" },
                    { icon: "⚡", value: status === "live" ? "ON" : "OFF", label: "Statut API", method: "STATUS", cls: status === "live" ? "m-post" : "m-del", delay: ".3s" },
                  ].map((s, i) => (
                    <div key={i} className="stat-card" style={{ animationDelay: s.delay }}>
                      <span className={`stat-method ${s.cls}`}>{s.method}</span>
                      <div className="stat-icon">{s.icon}</div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="section">
                  <div className="section-header">
                    <h2 className="section-title">
                      Derniers articles
                      <span className="section-badge">GET /api/articles</span>
                    </h2>
                    <button className="btn-ghost" style={{ fontSize: "0.75rem", padding: "7px 14px" }}
                      onClick={() => setView("articles")}>
                      Voir tout →
                    </button>
                  </div>
                  <ArticleGrid articles={articles.slice(0, 3)} loading={loading}
                    onEdit={setEditData} onDelete={deleteArticle} />
                </div>

                <div className="section">
                  <div className="section-header">
                    <h2 className="section-title">
                      Créer un article
                      <span className="section-badge m-post">POST</span>
                    </h2>
                  </div>
                  <ArticleForm form={form} setField={setField} onSubmit={createArticle}
                    onClear={() => setForm({ ...emptyForm, date: new Date().toISOString().split("T")[0] })}
                    submitting={submitting} />
                </div>
              </>
            )}

            {/* ── ARTICLES ── */}
            {view === "articles" && (
              <div className="section">
                <div className="section-header">
                  <h2 className="section-title">
                    Articles <span className="section-badge">{articles.length} résultat(s)</span>
                  </h2>
                  <button className="btn-primary" style={{ fontSize: "0.75rem", padding: "8px 16px" }}
                    onClick={() => setView("create")}>
                    + Créer
                  </button>
                </div>
                <ArticleGrid articles={articles} loading={loading}
                  onEdit={setEditData} onDelete={deleteArticle} />
              </div>
            )}

            {/* ── CREATE ── */}
            {view === "create" && (
              <div className="section">
                <div className="section-header">
                  <h2 className="section-title">
                    Nouvel article
                    <span className="section-badge m-post">POST /api/articles</span>
                  </h2>
                </div>
                <ArticleForm form={form} setField={setField} onSubmit={createArticle}
                  onClear={() => setForm({ ...emptyForm, date: new Date().toISOString().split("T")[0] })}
                  submitting={submitting} />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── EDIT MODAL ── */}
      <div className={`modal-overlay${editData ? " open" : ""}`}
        onClick={e => e.target === e.currentTarget && setEditData(null)}>
        <div className="modal">
          <div className="modal-header">
            <div className="modal-title">✏️ Modifier l'article</div>
            <button className="modal-close" onClick={() => setEditData(null)}>✕</button>
          </div>
          {editData && (
            <>
              <div className="form-grid">
                {[
                  { k: "titre", label: "Titre", full: true },
                  { k: "contenu", label: "Contenu", full: true, ta: true },
                  { k: "auteur", label: "Auteur" },
                  { k: "date", label: "Date", type: "date" },
                  { k: "categorie", label: "Catégorie" },
                  { k: "tags", label: "Tags" },
                ].map(f => (
                  <div key={f.k} className={`form-group${f.full ? " full" : ""}`}>
                    <label className="form-label">{f.label}</label>
                    {f.ta
                      ? <textarea className="form-textarea" value={editData[f.k] || ""}
                          onChange={e => setEditData(d => ({ ...d, [f.k]: e.target.value }))} />
                      : <input className="form-input" type={f.type || "text"} value={editData[f.k] || ""}
                          onChange={e => setEditData(d => ({ ...d, [f.k]: e.target.value }))} />
                    }
                  </div>
                ))}
              </div>
              <div className="form-actions">
                <button className="btn-primary" onClick={updateArticle} disabled={submitting}>
                  {submitting ? "⏳ Enregistrement..." : "💾 Enregistrer"}
                </button>
                <button className="btn-ghost" onClick={() => setEditData(null)}>Annuler</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── TOAST ── */}
      <div className={`toast${toast.show ? " show" : ""} ${toast.type}`}>
        <span className="toast-icon">{toast.type === "success" ? "✓" : "✗"}</span>
        {toast.msg}
      </div>
    </>
  );
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
function ArticleGrid({ articles, loading, onEdit, onDelete }) {
  if (loading) return (
    <div className="articles-grid">
      <div className="loader-wrap"><div className="spinner" /></div>
    </div>
  );
  if (!articles.length) return (
    <div className="articles-grid">
      <div className="empty-wrap">
        <div className="empty-icon">📭</div>
        <div className="empty-text">AUCUN ARTICLE DISPONIBLE</div>
      </div>
    </div>
  );
  return (
    <div className="articles-grid">
      {articles.map((a, i) => (
        <div key={a.id || a._id || i} className="article-card" style={{ animationDelay: `${i * 0.05}s` }}>
          <div className="card-header">
            <span className="card-id">#{a.id || a._id || i + 1}</span>
            <div className="card-actions">
              <button className="icon-btn edit" onClick={() => onEdit({ ...a })}>✏</button>
              <button className="icon-btn del" onClick={() => onDelete(a.id || a._id)}>✕</button>
            </div>
          </div>
          <div className="card-title">{a.titre || a.title || "Sans titre"}</div>
          <div className="card-content">{a.contenu || a.content || ""}</div>
          <div className="card-tags">
            {a.categorie && <span className="tag">◈ {a.categorie}</span>}
            {a.tags && a.tags.split(",").slice(0, 2).map(t => (
              <span key={t} className="tag">#{t.trim()}</span>
            ))}
          </div>
          <div className="card-footer">
            <div className="card-author">✍ <span>{a.auteur || "Inconnu"}</span></div>
            {a.date && <div className="card-date">{a.date}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function ArticleForm({ form, setField, onSubmit, onClear, submitting }) {
  const fields = [
    { k: "titre", label: "Titre *", placeholder: "Titre de l'article...", full: true },
    { k: "contenu", label: "Contenu *", placeholder: "Contenu de l'article...", full: true, ta: true },
    { k: "auteur", label: "Auteur *", placeholder: "Nom de l'auteur..." },
    { k: "date", label: "Date", type: "date" },
    { k: "categorie", label: "Catégorie", placeholder: "Tech, Science..." },
    { k: "tags", label: "Tags", placeholder: "nodejs, api..." },
  ];
  return (
    <div className="form-card">
      <div className="form-grid">
        {fields.map(f => (
          <div key={f.k} className={`form-group${f.full ? " full" : ""}`}>
            <label className="form-label">{f.label}</label>
            {f.ta
              ? <textarea className="form-textarea" placeholder={f.placeholder}
                  value={form[f.k]} onChange={e => setField(f.k, e.target.value)} />
              : <input className="form-input" type={f.type || "text"} placeholder={f.placeholder || ""}
                  value={form[f.k]} onChange={e => setField(f.k, e.target.value)} />
            }
          </div>
        ))}
      </div>
      <div className="form-actions">
        <button className="btn-primary" onClick={onSubmit} disabled={submitting}>
          {submitting ? "⏳ Publication..." : "🚀 Publier l'article"}
        </button>
        <button className="btn-ghost" onClick={onClear}>Effacer</button>
      </div>
    </div>
  );
}
