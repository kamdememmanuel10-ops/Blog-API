import { useState, useEffect, useRef, useCallback } from "react";

const API = "https://blog-api-emmanuel.onrender.com/api/article";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --void:    #000000;
    --black:   #010204;
    --dark:    #03060d;
    --panel:   #050a14;
    --card:    #070e1a;
    --border:  rgba(30,60,120,0.25);
    --border2: rgba(50,100,200,0.4);
    --blue:    #1d4ed8;
    --blue2:   #2563eb;
    --blue3:   #3b82f6;
    --blue4:   #60a5fa;
    --blue5:   #93c5fd;
    --glow:    rgba(29,78,216,0.3);
    --glow2:   rgba(59,130,246,0.15);
    --gray:    #334155;
    --gray2:   #475569;
    --gray3:   #64748b;
    --light:   #94a3b8;
    --white:   #e2e8f0;
    --pure:    #f8fafc;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--void);
    color: var(--light);
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    cursor: none;
  }

  .cursor {
    position: fixed; pointer-events: none; z-index: 9999;
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--blue3);
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s;
    box-shadow: 0 0 12px var(--blue3), 0 0 24px var(--glow);
  }

  .cursor-ring {
    position: fixed; pointer-events: none; z-index: 9998;
    width: 32px; height: 32px; border-radius: 50%;
    border: 1px solid rgba(59,130,246,0.4);
    transform: translate(-50%, -50%);
    transition: left 0.1s ease, top 0.1s ease;
  }

  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: var(--void); }
  ::-webkit-scrollbar-thumb { background: var(--blue); }

  #bg-canvas { position: fixed; inset: 0; pointer-events: none; z-index: 0; }

  /* ── INTRO ── */
  .intro {
    position: fixed; inset: 0; z-index: 1000;
    background: var(--void);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    transition: opacity 0.8s ease, transform 0.8s ease;
  }

  .intro.exit { opacity: 0; transform: scale(1.04); pointer-events: none; }

  .intro-logo {
    font-size: clamp(3rem, 8vw, 6rem); font-weight: 900;
    letter-spacing: -0.03em; color: var(--pure);
    opacity: 0; transform: translateY(30px);
    animation: fadeUp 0.8s ease 0.3s forwards;
  }

  .intro-logo span { color: transparent; -webkit-text-stroke: 1px var(--blue3); }

  .intro-sub {
    font-family: 'JetBrains Mono', monospace; font-size: 0.72rem;
    letter-spacing: 0.3em; color: var(--gray3); text-transform: uppercase;
    margin-top: 10px; opacity: 0;
    animation: fadeUp 0.8s ease 0.6s forwards;
  }

  .intro-line {
    width: 0; height: 1px; margin-top: 28px;
    background: linear-gradient(90deg, transparent, var(--blue3), transparent);
    animation: growLine 1s ease 1s forwards;
  }

  .intro-count {
    font-size: 3.5rem; font-weight: 900; color: var(--blue);
    font-variant-numeric: tabular-nums; margin-top: 20px; line-height: 1;
    opacity: 0; animation: fadeUp 0.5s ease 1s forwards;
  }

  .intro-status {
    font-family: 'JetBrains Mono', monospace; font-size: 0.62rem;
    color: var(--gray); letter-spacing: 0.2em; margin-top: 10px;
    opacity: 0; animation: fadeUp 0.5s ease 1.2s forwards;
  }

  @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
  @keyframes growLine { to { width: 180px; } }

  /* ── SPLASH ── */
  .splash {
    position: fixed; inset: 0; z-index: 999;
    display: flex; align-items: center; justify-content: center;
    background: var(--void); pointer-events: none;
  }

  .splash-text {
    font-size: clamp(1.8rem, 5vw, 3.5rem); font-weight: 900;
    letter-spacing: -0.02em; color: var(--pure); text-align: center;
    opacity: 0; transform: translateY(18px) scale(0.96);
    animation: splashIn 0.5s ease forwards, splashOut 0.4s ease 1.6s forwards;
    max-width: 80vw; line-height: 1.1;
  }

  .splash-text em { font-style: normal; color: var(--blue4); }

  @keyframes splashIn { to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes splashOut { to { opacity: 0; transform: translateY(-18px) scale(1.04); } }

  /* ── APP ── */
  .app { position: relative; z-index: 1; opacity: 0; transition: opacity 0.8s ease; min-height: 100vh; }
  .app.visible { opacity: 1; }

  .layout { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }

  /* ── SIDEBAR ── */
  .sidebar {
    background: linear-gradient(180deg, rgba(3,6,13,0.98), rgba(1,2,4,0.98));
    border-right: 1px solid var(--border);
    padding: 24px 16px;
    display: flex; flex-direction: column; gap: 4px;
    position: sticky; top: 0; height: 100vh;
    backdrop-filter: blur(40px); overflow: hidden;
  }

  .sidebar::before {
    content: ''; position: absolute; top: -80px; left: -80px;
    width: 260px; height: 260px;
    background: radial-gradient(circle, rgba(29,78,216,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .s-logo {
    display: flex; align-items: center; gap: 10px;
    padding: 4px 8px 20px;
    border-bottom: 1px solid var(--border); margin-bottom: 8px;
  }

  .s-logo-icon {
    width: 34px; height: 34px; border-radius: 10px; font-size: 1rem;
    background: linear-gradient(135deg, var(--blue), var(--blue3));
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    box-shadow: 0 0 20px var(--glow);
  }

  .s-logo-name { font-size: 0.95rem; font-weight: 800; color: var(--pure); }
  .s-logo-sub { font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; color: var(--gray3); }

  .s-section {
    font-family: 'JetBrains Mono', monospace; font-size: 0.55rem;
    letter-spacing: 0.15em; color: var(--gray); text-transform: uppercase;
    padding: 10px 8px 4px;
  }

  .s-nav {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 10px; border-radius: 10px; cursor: none;
    transition: all 0.2s; font-size: 0.82rem; font-weight: 600; color: var(--gray3);
    border: 1px solid transparent; background: none; width: 100%; text-align: left;
    position: relative; overflow: hidden;
  }

  .s-nav::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(29,78,216,0.15), transparent);
    opacity: 0; transition: opacity 0.2s;
  }

  .s-nav:hover { color: var(--white); border-color: var(--border); }
  .s-nav:hover::before { opacity: 1; }

  .s-nav.active {
    color: var(--blue4); background: rgba(29,78,216,0.1);
    border-color: rgba(29,78,216,0.3);
    box-shadow: 0 0 20px rgba(29,78,216,0.08);
  }

  .s-nav.active::before { opacity: 1; }
  .s-nav-icon { font-size: 0.9rem; z-index: 1; flex-shrink: 0; }
  .s-nav-label { z-index: 1; }
  .s-nav-dot { width: 5px; height: 5px; border-radius: 50%; margin-left: auto; z-index: 1; }

  .ep-row { display: flex; align-items: center; gap: 8px; padding: 5px 10px; }
  .ep-badge {
    font-family: 'JetBrains Mono', monospace; font-size: 0.56rem;
    padding: 2px 6px; border-radius: 3px; font-weight: 600;
    min-width: 46px; text-align: center;
  }
  .ep-path { font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; color: var(--gray3); }

  .s-footer { margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border); }

  .author-pill {
    display: flex; align-items: center; gap: 8px; padding: 10px;
    border-radius: 10px; background: rgba(29,78,216,0.06); border: 1px solid var(--border);
  }

  .author-av {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg, var(--blue), var(--blue4));
    display: flex; align-items: center; justify-content: center;
    font-size: 0.62rem; font-weight: 800; color: white; flex-shrink: 0;
  }

  .author-name { font-size: 0.72rem; font-weight: 700; color: var(--white); }
  .author-id { font-family: 'JetBrains Mono', monospace; font-size: 0.57rem; color: var(--gray3); }

  /* ── MAIN / TOPBAR ── */
  .main { display: flex; flex-direction: column; min-height: 100vh; }

  .topbar {
    background: rgba(1,2,4,0.92); border-bottom: 1px solid var(--border);
    padding: 14px 28px; display: flex; align-items: center; justify-content: space-between;
    backdrop-filter: blur(40px); position: sticky; top: 0; z-index: 50;
  }

  .topbar::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--blue), transparent); opacity: 0.25;
  }

  .topbar-title { font-size: 1rem; font-weight: 800; color: var(--pure); }
  .topbar-sub { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: var(--gray3); margin-top: 1px; }

  .topbar-right { display: flex; align-items: center; gap: 10px; }

  .status-pill {
    display: flex; align-items: center; gap: 6px; padding: 5px 12px;
    border-radius: 100px; background: var(--panel); border: 1px solid var(--border);
    font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; transition: all 0.3s;
  }

  .status-pill.live { border-color: rgba(34,197,94,0.3); color: #4ade80; box-shadow: 0 0 12px rgba(34,197,94,0.08); }
  .status-pill.offline { border-color: rgba(239,68,68,0.3); color: #f87171; }
  .status-pill.connecting { color: var(--blue4); border-color: rgba(59,130,246,0.3); }

  .s-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
  .status-pill.live .s-dot { animation: livePulse 1.5s infinite; }

  @keyframes livePulse {
    0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
  }

  .topbar-btn {
    padding: 6px 14px; border-radius: 8px;
    background: rgba(29,78,216,0.12); border: 1px solid rgba(29,78,216,0.25);
    color: var(--blue4); font-size: 0.7rem; font-weight: 700;
    cursor: none; transition: all 0.2s; font-family: 'Syne', sans-serif;
  }

  .topbar-btn:hover { background: rgba(29,78,216,0.22); box-shadow: 0 0 16px rgba(29,78,216,0.15); }

  /* ── CONTENT / HERO ── */
  .content { padding: 28px; flex: 1; }

  .hero-banner {
    background: linear-gradient(135deg, rgba(29,78,216,0.07), rgba(1,2,4,0));
    border: 1px solid var(--border); border-radius: 18px; padding: 30px 34px;
    margin-bottom: 26px; position: relative; overflow: hidden;
    animation: slideUp 0.6s ease forwards; opacity: 0; transform: translateY(20px);
  }

  .hero-banner::before {
    content: ''; position: absolute; top: -60px; right: -60px;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(29,78,216,0.06), transparent 70%);
    pointer-events: none;
  }

  .hero-banner::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--blue3), transparent); opacity: 0.35;
  }

  .hero-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; color: var(--blue4); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px; }

  .hero-title {
    font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 900;
    color: var(--pure); letter-spacing: -0.02em; line-height: 1.1;
  }

  .hero-title span {
    color: transparent;
    background: linear-gradient(135deg, var(--blue3), var(--blue5));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  .hero-sub { font-size: 0.78rem; color: var(--gray3); margin-top: 10px; line-height: 1.6; }
  .hero-actions { display: flex; gap: 10px; margin-top: 18px; }

  /* ── STATS ── */
  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 26px; }

  .stat-card {
    background: var(--panel); border: 1px solid var(--border);
    border-radius: 13px; padding: 16px; position: relative; overflow: hidden;
    transition: all 0.3s; opacity: 0; transform: translateY(14px);
  }

  .stat-card.in { animation: slideUp 0.5s ease forwards; }

  .stat-card:hover { border-color: rgba(59,130,246,0.25); box-shadow: 0 0 24px rgba(29,78,216,0.08); transform: translateY(-2px); }

  .stat-card::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent);
  }

  .stat-m { font-family: 'JetBrains Mono', monospace; font-size: 0.55rem; padding: 2px 6px; border-radius: 3px; font-weight: 600; position: absolute; top: 12px; right: 12px; }
  .stat-icon { font-size: 1.2rem; margin-bottom: 10px; }
  .stat-val {
    font-size: 1.7rem; font-weight: 900; line-height: 1; font-variant-numeric: tabular-nums;
    background: linear-gradient(135deg, var(--pure), var(--blue5));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  .stat-lbl { font-size: 0.66rem; color: var(--gray3); margin-top: 3px; }

  /* ── SECTION ── */
  .sec-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .sec-title { font-size: 0.95rem; font-weight: 800; color: var(--pure); display: flex; align-items: center; gap: 8px; }
  .sec-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.56rem; padding: 2px 8px; border-radius: 3px; background: rgba(29,78,216,0.1); color: var(--blue4); border: 1px solid rgba(29,78,216,0.18); }

  /* ── FORM ── */
  .form-card {
    background: linear-gradient(135deg, rgba(5,10,20,0.92), rgba(3,6,13,0.96));
    border: 1px solid var(--border); border-radius: 15px; padding: 24px;
    position: relative; overflow: hidden;
  }

  .form-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--blue), var(--blue3), var(--blue5), transparent);
  }

  .f-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; margin-bottom: 16px; }
  .f-group { display: flex; flex-direction: column; gap: 5px; }
  .f-group.full { grid-column: 1 / -1; }

  .f-label { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: var(--gray3); letter-spacing: 0.1em; text-transform: uppercase; }

  .f-input, .f-ta {
    background: rgba(0,0,0,0.65); border: 1px solid var(--border);
    border-radius: 8px; padding: 10px 12px;
    color: var(--white); font-family: 'Syne', sans-serif; font-size: 0.82rem;
    outline: none; transition: all 0.2s; width: 100%;
  }

  .f-input:focus, .f-ta:focus { border-color: rgba(59,130,246,0.45); box-shadow: 0 0 0 3px rgba(29,78,216,0.07); }
  .f-ta { resize: vertical; min-height: 82px; }
  .f-actions { display: flex; gap: 9px; }

  .btn-p {
    padding: 10px 20px; border-radius: 9px;
    background: linear-gradient(135deg, var(--blue), var(--blue2));
    border: none; color: white; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.8rem;
    cursor: none; transition: all 0.2s; box-shadow: 0 4px 20px var(--glow);
    display: flex; align-items: center; gap: 6px;
  }

  .btn-p:hover { transform: translateY(-2px); box-shadow: 0 8px 30px var(--glow); }
  .btn-p:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .btn-g {
    padding: 10px 16px; border-radius: 9px; background: transparent;
    border: 1px solid var(--border); color: var(--gray3); font-family: 'Syne', sans-serif;
    font-weight: 600; font-size: 0.8rem; cursor: none; transition: all 0.2s;
  }

  .btn-g:hover { border-color: var(--border2); color: var(--white); }

  /* ── ARTICLES ── */
  .art-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(285px, 1fr)); gap: 13px; }

  .art-card {
    background: linear-gradient(135deg, rgba(5,10,20,0.95), rgba(3,6,13,0.98));
    border: 1px solid var(--border); border-radius: 13px; padding: 18px;
    position: relative; overflow: hidden; transition: all 0.3s;
    animation: cardIn 0.4s ease forwards; opacity: 0;
  }

  @keyframes cardIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .art-card:hover { border-color: rgba(59,130,246,0.25); transform: translateY(-3px); box-shadow: 0 16px 50px rgba(0,0,0,0.6), 0 0 24px rgba(29,78,216,0.07); }

  .art-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent);
  }

  .art-id { font-family: 'JetBrains Mono', monospace; font-size: 0.57rem; color: var(--blue4); background: rgba(29,78,216,0.08); border: 1px solid rgba(29,78,216,0.12); padding: 2px 7px; border-radius: 3px; display: inline-block; margin-bottom: 9px; }

  .art-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 9px; }
  .art-actions { display: flex; gap: 5px; }

  .ico-btn { width: 25px; height: 25px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; cursor: none; transition: all 0.2s; border: 1px solid transparent; background: none; }
  .ico-btn.edit { color: #fbbf24; border-color: rgba(251,191,36,0.12); background: rgba(251,191,36,0.04); }
  .ico-btn.edit:hover { background: rgba(251,191,36,0.1); transform: scale(1.1); }
  .ico-btn.del { color: #f87171; border-color: rgba(248,113,113,0.12); background: rgba(248,113,113,0.04); }
  .ico-btn.del:hover { background: rgba(248,113,113,0.1); transform: scale(1.1); }

  .art-title { font-size: 0.9rem; font-weight: 700; color: var(--pure); line-height: 1.3; }
  .art-body { font-size: 0.73rem; color: var(--gray3); line-height: 1.6; margin: 8px 0 11px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .art-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 11px; }
  .tag { font-family: 'JetBrains Mono', monospace; font-size: 0.57rem; padding: 2px 6px; border-radius: 3px; background: rgba(0,0,0,0.5); border: 1px solid var(--border); color: var(--gray3); }
  .art-foot { border-top: 1px solid var(--border); padding-top: 10px; display: flex; align-items: center; justify-content: space-between; }
  .art-author { font-size: 0.66rem; color: var(--gray3); }
  .art-author b { color: var(--blue4); font-weight: 600; }
  .art-date { font-family: 'JetBrains Mono', monospace; font-size: 0.57rem; color: var(--gray); }

  .loader-wrap { grid-column: 1/-1; display: flex; justify-content: center; padding: 80px; }
  .spinner { width: 34px; height: 34px; border-radius: 50%; border: 2px solid rgba(29,78,216,0.15); border-top-color: var(--blue3); animation: spin 0.7s linear infinite; box-shadow: 0 0 16px var(--glow2); }
  @keyframes spin { to { transform: rotate(360deg); } }
  .empty-wrap { grid-column: 1/-1; text-align: center; padding: 80px; }
  .empty-ico { font-size: 2.4rem; opacity: 0.12; margin-bottom: 12px; }
  .empty-txt { font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; color: var(--gray); letter-spacing: 0.1em; }

  /* ── MODAL ── */
  .modal-bg { position: fixed; inset: 0; z-index: 500; background: rgba(0,0,0,0.92); backdrop-filter: blur(16px); display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.25s; }
  .modal-bg.open { opacity: 1; pointer-events: all; }
  .modal { background: linear-gradient(135deg, rgba(5,10,20,0.99), rgba(3,6,13,0.99)); border: 1px solid var(--border2); border-radius: 17px; padding: 26px; width: 90%; max-width: 530px; transform: translateY(20px) scale(0.97); transition: all 0.3s cubic-bezier(0.34,1.2,0.64,1); position: relative; overflow: hidden; }
  .modal::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--blue3), var(--blue5), transparent); }
  .modal-bg.open .modal { transform: translateY(0) scale(1); }
  .modal-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .modal-title { font-size: 0.95rem; font-weight: 800; color: var(--pure); }
  .modal-x { width: 28px; height: 28px; border-radius: 7px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); color: var(--gray3); cursor: none; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .modal-x:hover { color: var(--white); border-color: var(--border2); }

  /* ── TOAST ── */
  .toast { position: fixed; bottom: 22px; right: 22px; z-index: 600; background: rgba(3,6,13,0.96); border: 1px solid var(--border); border-radius: 11px; padding: 11px 15px; display: flex; align-items: center; gap: 8px; font-size: 0.76rem; font-weight: 500; color: var(--white); transform: translateY(70px); opacity: 0; transition: all 0.4s cubic-bezier(0.34,1.4,0.64,1); backdrop-filter: blur(20px); box-shadow: 0 8px 40px rgba(0,0,0,0.5); }
  .toast.show { transform: translateY(0); opacity: 1; }
  .toast.success { border-color: rgba(74,222,128,0.2); }
  .toast.error { border-color: rgba(248,113,113,0.2); }

  /* ── METHOD COLORS ── */
  .m-get { background: rgba(59,130,246,0.1); color: #60a5fa; border: 1px solid rgba(59,130,246,0.18); }
  .m-post { background: rgba(34,197,94,0.1); color: #4ade80; border: 1px solid rgba(34,197,94,0.18); }
  .m-put { background: rgba(251,191,36,0.1); color: #fbbf24; border: 1px solid rgba(251,191,36,0.18); }
  .m-patch { background: rgba(251,191,36,0.07); color: #fcd34d; border: 1px solid rgba(251,191,36,0.12); }
  .m-del { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.18); }

  @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 860px) {
    .layout { grid-template-columns: 1fr; }
    .sidebar { display: none; }
    .stats-row { grid-template-columns: 1fr 1fr; }
    .f-grid { grid-template-columns: 1fr; }
    body { cursor: auto; }
    .cursor, .cursor-ring { display: none; }
  }
`;

// ─── TOAST HOOK ───────────────────────────────────────────────────────────────
function useToast() {
  const [t, setT] = useState({ msg: "", type: "success", show: false });
  const tmr = useRef(null);
  const show = useCallback((msg, type = "success") => {
    clearTimeout(tmr.current);
    setT({ msg, type, show: true });
    tmr.current = setTimeout(() => setT(p => ({ ...p, show: false })), 3000);
  }, []);
  return { t, show };
}

// ─── CANVAS ───────────────────────────────────────────────────────────────────
function BgCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    let W, H, pts = [], raf;
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    const init = () => { pts = Array.from({ length: 55 }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18, r: Math.random() + .3 })); };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(29,78,216,0.3)"; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = `rgba(29,78,216,${.035 * (1 - d / 130)})`; ctx.lineWidth = .4; ctx.stroke(); }
        }
      raf = requestAnimationFrame(draw);
    };
    resize(); init(); draw();
    window.addEventListener("resize", () => { resize(); init(); });
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas id="bg-canvas" ref={ref} />;
}

// ─── CURSOR ───────────────────────────────────────────────────────────────────
function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  useEffect(() => {
    const move = e => {
      if (dot.current) { dot.current.style.left = e.clientX + "px"; dot.current.style.top = e.clientY + "px"; }
      if (ring.current) { ring.current.style.left = e.clientX + "px"; ring.current.style.top = e.clientY + "px"; }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <><div className="cursor" ref={dot} /><div className="cursor-ring" ref={ring} /></>;
}

// ─── INTRO ────────────────────────────────────────────────────────────────────
const PHRASES = [
  { text: "Blog API", em: "Emmanuel" },
  { text: "Gérez vos articles", em: "en temps réel" },
  { text: "Node.js · Express", em: "· SQLite" },
  { text: "INF222", em: "· Développement Backend" },
];

function Intro({ onDone }) {
  const [phase, setPhase] = useState("logo");
  const [idx, setIdx] = useState(0);
  const [exit, setExit] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setCount(c => { if (c >= 100) { clearInterval(iv); return 100; } return c + 5; }), 50);
    const t1 = setTimeout(() => setPhase("phrases"), 2400);
    return () => { clearTimeout(t1); clearInterval(iv); };
  }, []);

  useEffect(() => {
    if (phase !== "phrases") return;
    if (idx >= PHRASES.length) { setExit(true); setTimeout(onDone, 800); return; }
    const t = setTimeout(() => setIdx(i => i + 1), 2100);
    return () => clearTimeout(t);
  }, [phase, idx, onDone]);

  return (
    <>
      <div className={`intro${exit ? " exit" : ""}`} style={{ display: phase === "logo" ? "flex" : "none" }}>
        <div className="intro-logo">BLOG<span>API</span></div>
        <div className="intro-sub">KAMDEM · EMMANUEL · BLOG_API</div>
        <div className="intro-line" />
        <div className="intro-count">{count}</div>
        <div className="intro-status">INITIALISATION...</div>
      </div>
      {phase === "phrases" && idx < PHRASES.length && (
        <div className="splash" key={idx}>
          <div className="splash-text">{PHRASES[idx].text} <em>{PHRASES[idx].em}</em></div>
        </div>
      )}
    </>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("dashboard");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("connecting");
  const [editData, setEditData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { t, show } = useToast();

  const emptyForm = { titre: "", contenu: "", auteur: "", date: "", categorie: "", tags: "" };
  const [form, setForm] = useState({ ...emptyForm, date: new Date().toISOString().split("T")[0] });
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(API);
      if (!r.ok) throw new Error();
      const d = await r.json();
      setArticles(Array.isArray(d) ? d : d.data || d.articles || []);
      setStatus("live");
    } catch { setStatus("offline"); show("API non disponible", "error"); }
    finally { setLoading(false); }
  }, [show]);

  useEffect(() => { if (ready) fetchArticles(); }, [ready, fetchArticles]);

  const createArticle = async () => {
    if (!form.titre || !form.contenu || !form.auteur) { show("Titre, contenu et auteur requis", "error"); return; }
    setSubmitting(true);
    try {
      const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!r.ok) throw new Error();
      show("Article publié ✓");
      setForm({ ...emptyForm, date: new Date().toISOString().split("T")[0] });
      fetchArticles(); setView("articles");
    } catch { show("Erreur création", "error"); }
    finally { setSubmitting(false); }
  };

  const deleteArticle = async (id) => {
    if (!window.confirm("Supprimer cet article ?")) return;
    try {
      const r = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error();
      show("Article supprimé"); fetchArticles();
    } catch { show("Erreur suppression", "error"); }
  };

  const updateArticle = async () => {
    setSubmitting(true);
    try {
      const r = await fetch(`${API}/${editData.id || editData._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editData) });
      if (!r.ok) throw new Error();
      show("Article modifié ✓"); setEditData(null); fetchArticles();
    } catch { show("Erreur modification", "error"); }
    finally { setSubmitting(false); }
  };

  const navItems = [
    { id: "dashboard", icon: "⬛", label: "Dashboard" },
    { id: "articles", icon: "📄", label: "Articles", color: "#60a5fa" },
    { id: "create", icon: "✏️", label: "Créer", color: "#4ade80" },
  ];

  const eps = [
    { m: "GET", p: "/api/articles", c: "m-get" },
    { m: "POST", p: "/api/articles", c: "m-post" },
    { m: "PUT", p: "/:id", c: "m-put" },
    { m: "PATCH", p: "/:id", c: "m-patch" },
    { m: "DELETE", p: "/:id", c: "m-del" },
  ];

  const fields = [
    { k: "titre", lbl: "Titre *", ph: "Titre de l'article...", full: true },
    { k: "contenu", lbl: "Contenu *", ph: "Contenu...", full: true, ta: true },
    { k: "auteur", lbl: "Auteur *", ph: "Nom de l'auteur..." },
    { k: "date", lbl: "Date", type: "date" },
    { k: "categorie", lbl: "Catégorie", ph: "Tech, Science..." },
    { k: "tags", lbl: "Tags", ph: "nodejs, api..." },
  ];

  const meta = {
    dashboard: { title: "Dashboard", sub: "Vue d'ensemble · Blog API Emmanuel" },
    articles: { title: "Articles", sub: "GET /api/articles" },
    create: { title: "Créer un article", sub: "POST /api/articles" },
  };

  return (
    <>
      <style>{styles}</style>
      <BgCanvas />
      <Cursor />
      {!ready && <Intro onDone={() => setReady(true)} />}

      <div className={`app${ready ? " visible" : ""}`}>
        <div className="layout">
          <aside className="sidebar">
            <div className="s-logo">
              <div className="s-logo-icon">📝</div>
              <div><div className="s-logo-name">BlogAPI</div><div className="s-logo-sub">EMMANUEL · INF222</div></div>
            </div>

            <div className="s-section">Navigation</div>
            {navItems.map(n => (
              <button key={n.id} className={`s-nav${view === n.id ? " active" : ""}`} onClick={() => setView(n.id)}>
                <span className="s-nav-icon">{n.icon}</span>
                <span className="s-nav-label">{n.label}</span>
                {n.color && <span className="s-nav-dot" style={{ background: n.color }} />}
              </button>
            ))}

            <div className="s-section" style={{ marginTop: 8 }}>Endpoints</div>
            {eps.map(e => (
              <div key={e.m + e.p} className="ep-row">
                <span className={`ep-badge ${e.c}`}>{e.m}</span>
                <span className="ep-path">{e.p}</span>
              </div>
            ))}

            <div className="s-footer">
              <div className="author-pill">
                <div className="author-av">KE</div>
                <div><div className="author-name">KAMDEM Emmanuel</div><div className="author-id">24F2805 · INF222</div></div>
              </div>
            </div>
          </aside>

          <main className="main">
            <div className="topbar">
              <div>
                <div className="topbar-title">{meta[view].title}</div>
                <div className="topbar-sub">{meta[view].sub}</div>
              </div>
              <div className="topbar-right">
                <div className={`status-pill ${status}`}>
                  <span className="s-dot" />
                  {status === "live" ? "API LIVE" : status === "offline" ? "OFFLINE" : "..."}
                </div>
                <button className="topbar-btn" onClick={fetchArticles}>↻ Refresh</button>
              </div>
            </div>

            <div className="content">
              {view === "dashboard" && (
                <>
                  <div className="hero-banner">
                    <div className="hero-tag">⚡ Bienvenue sur votre espace</div>
                    <div className="hero-title">Blog API <span>Emmanuel</span></div>
                    <div className="hero-sub">Gérez vos articles · Node.js · Express · SQLite </div>
                    <div className="hero-actions">
                      <button className="btn-p" onClick={() => setView("create")}>+ Nouvel article</button>
                      <button className="btn-g" onClick={() => setView("articles")}>Voir tout →</button>
                    </div>
                  </div>

                  <div className="stats-row">
                    {[
                      { icon: "📰", val: articles.length, lbl: "Articles", m: "GET", c: "m-get", d: "0s" },
                      { icon: "✍️", val: new Set(articles.map(a => a.auteur)).size, lbl: "Auteurs", m: "GET", c: "m-get", d: ".1s" },
                      { icon: "🗂️", val: new Set(articles.map(a => a.categorie).filter(Boolean)).size, lbl: "Catégories", m: "GET", c: "m-get", d: ".2s" },
                      { icon: "⚡", val: status === "live" ? "ON" : "OFF", lbl: "Statut API", m: "API", c: status === "live" ? "m-post" : "m-del", d: ".3s" },
                    ].map((s, i) => (
                      <div key={i} className="stat-card in" style={{ animationDelay: s.d }}>
                        <span className={`stat-m ${s.c}`}>{s.m}</span>
                        <div className="stat-icon">{s.icon}</div>
                        <div className="stat-val">{s.val}</div>
                        <div className="stat-lbl">{s.lbl}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: 26 }}>
                    <div className="sec-hdr">
                      <h2 className="sec-title">Derniers articles <span className="sec-tag">GET</span></h2>
                      <button className="btn-g" style={{ fontSize: "0.7rem", padding: "6px 12px" }} onClick={() => setView("articles")}>Voir tout →</button>
                    </div>
                    <ArticleGrid articles={articles.slice(0, 3)} loading={loading} onEdit={setEditData} onDelete={deleteArticle} />
                  </div>

                  <div>
                    <div className="sec-hdr"><h2 className="sec-title">Créer <span className="sec-tag m-post">POST</span></h2></div>
                    <FormCard fields={fields} form={form} setF={setF} onSubmit={createArticle} onClear={() => setForm({ ...emptyForm, date: new Date().toISOString().split("T")[0] })} submitting={submitting} />
                  </div>
                </>
              )}

              {view === "articles" && (
                <>
                  <div className="sec-hdr">
                    <h2 className="sec-title">Articles <span className="sec-tag">{articles.length}</span></h2>
                    <button className="btn-p" style={{ fontSize: "0.7rem", padding: "7px 14px" }} onClick={() => setView("create")}>+ Créer</button>
                  </div>
                  <ArticleGrid articles={articles} loading={loading} onEdit={setEditData} onDelete={deleteArticle} />
                </>
              )}

              {view === "create" && (
                <>
                  <div className="sec-hdr"><h2 className="sec-title">Nouvel article <span className="sec-tag m-post">POST</span></h2></div>
                  <FormCard fields={fields} form={form} setF={setF} onSubmit={createArticle} onClear={() => setForm({ ...emptyForm, date: new Date().toISOString().split("T")[0] })} submitting={submitting} />
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      <div className={`modal-bg${editData ? " open" : ""}`} onClick={e => e.target === e.currentTarget && setEditData(null)}>
        <div className="modal">
          <div className="modal-hdr">
            <div className="modal-title">✏️ Modifier l'article</div>
            <button className="modal-x" onClick={() => setEditData(null)}>✕</button>
          </div>
          {editData && (
            <>
              <div className="f-grid">
                {fields.map(f => (
                  <div key={f.k} className={`f-group${f.full ? " full" : ""}`}>
                    <label className="f-label">{f.lbl}</label>
                    {f.ta
                      ? <textarea className="f-ta" value={editData[f.k] || ""} onChange={e => setEditData(d => ({ ...d, [f.k]: e.target.value }))} />
                      : <input className="f-input" type={f.type || "text"} placeholder={f.ph || ""} value={editData[f.k] || ""} onChange={e => setEditData(d => ({ ...d, [f.k]: e.target.value }))} />
                    }
                  </div>
                ))}
              </div>
              <div className="f-actions" style={{ marginTop: 14 }}>
                <button className="btn-p" onClick={updateArticle} disabled={submitting}>{submitting ? "⏳ Sauvegarde..." : "💾 Enregistrer"}</button>
                <button className="btn-g" onClick={() => setEditData(null)}>Annuler</button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={`toast${t.show ? " show" : ""} ${t.type}`}>
        <span>{t.type === "success" ? "✓" : "✗"}</span> {t.msg}
      </div>
    </>
  );
}

function ArticleGrid({ articles, loading, onEdit, onDelete }) {
  if (loading) return <div className="art-grid"><div className="loader-wrap"><div className="spinner" /></div></div>;
  if (!articles.length) return <div className="art-grid"><div className="empty-wrap"><div className="empty-ico">📭</div><div className="empty-txt">AUCUN ARTICLE</div></div></div>;
  return (
    <div className="art-grid">
      {articles.map((a, i) => (
        <div key={a.id || i} className="art-card" style={{ animationDelay: `${i * 0.05}s` }}>
          <div className="art-id">#{a.id || i + 1}</div>
          <div className="art-header">
            <div className="art-title">{a.titre || "Sans titre"}</div>
            <div className="art-actions">
              <button className="ico-btn edit" onClick={() => onEdit({ ...a })}>✏</button>
              <button className="ico-btn del" onClick={() => onDelete(a.id || a._id)}>✕</button>
            </div>
          </div>
          <div className="art-body">{a.contenu || ""}</div>
          <div className="art-tags">
            {a.categorie && <span className="tag">◈ {a.categorie}</span>}
            {a.tags && a.tags.split(",").slice(0, 2).map(tg => <span key={tg} className="tag">#{tg.trim()}</span>)}
          </div>
          <div className="art-foot">
            <div className="art-author">✍ <b>{a.auteur || "Inconnu"}</b></div>
            {a.date && <div className="art-date">{a.date}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function FormCard({ fields, form, setF, onSubmit, onClear, submitting }) {
  return (
    <div className="form-card">
      <div className="f-grid">
        {fields.map(f => (
          <div key={f.k} className={`f-group${f.full ? " full" : ""}`}>
            <label className="f-label">{f.lbl}</label>
            {f.ta
              ? <textarea className="f-ta" placeholder={f.ph} value={form[f.k]} onChange={e => setF(f.k, e.target.value)} />
              : <input className="f-input" type={f.type || "text"} placeholder={f.ph || ""} value={form[f.k]} onChange={e => setF(f.k, e.target.value)} />
            }
          </div>
        ))}
      </div>
      <div className="f-actions">
        <button className="btn-p" onClick={onSubmit} disabled={submitting}>{submitting ? "⏳ Publication..." : "🚀 Publier"}</button>
        <button className="btn-g" onClick={onClear}>Effacer</button>
      </div>
    </div>
  );
}
