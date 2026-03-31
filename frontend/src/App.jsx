import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Pause, Play, Layout, PenTool, Globe } from 'lucide-react';
import axios from 'axios';

const API_URL = "https://blog-api-emmanuel.onrender.com/api/article";

// --- COMPOSANT 1: SPLASH SCREEN EXPERT ---
const SplashScreen = ({ finishLoading }) => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a] text-white"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="h-[2px] bg-blue-500 mb-4"
      />
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-xl font-light tracking-[0.5em] uppercase"
      >
        Emmanuel Blog <span className="text-blue-500 underline">API</span>
      </motion.h1>
      <motion.p 
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="mt-4 text-xs text-gray-500 font-mono"
      >
        INITIALIZING CORE_SERVICES...
      </motion.p>
    </motion.div>
  );
};

// --- COMPOSANT 2: CARROUSEL AUTOMATISÉ ---
const AutoCarousel = ({ articles }) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused && articles.length > 0) {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % articles.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isPaused, articles.length]);

  if (articles.length === 0) return null;

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-3xl bg-[#1a1a1a] border border-gray-800 shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.6, ease: "circOut" }}
          className="absolute inset-0 p-12 flex flex-col justify-center"
        >
          <span className="text-blue-500 text-sm font-bold mb-2 uppercase tracking-widest">À la une</span>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">{articles[index].titre}</h2>
          <p className="text-gray-400 text-lg max-w-2xl line-clamp-2">{articles[index].contenu}</p>
          <button className="mt-8 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full w-fit transition-all transform hover:scale-105 font-medium">
            Lire l'article
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Contrôles d'accessibilité */}
      <div className="absolute bottom-8 right-12 flex items-center gap-4">
        <button onClick={() => setIsPaused(!isPaused)} className="p-2 text-gray-400 hover:text-white transition-colors">
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
        </button>
        <div className="flex gap-2">
          {articles.map((_, i) => (
            <div key={i} className={`h-1 transition-all duration-300 rounded-full ${i === index ? 'w-8 bg-blue-500' : 'w-2 bg-gray-700'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL ---
export default function BlogApp() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Simulation du chargement expert + Fetch API
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL);
        setArticles(res.data);
      } catch (err) {
        console.error("Erreur API", err);
      } finally {
        setTimeout(() => setLoading(false), 3000);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-200 selection:bg-blue-500/30">
      <AnimatePresence>
        {loading && <SplashScreen />}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-[#0d0d0d]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-white text-xl uppercase tracking-tighter">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center italic">E</div>
            Emmanuel Blog
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest text-gray-400">
            <a href="#" className="hover:text-blue-500 transition-colors">Flux</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Projets</a>
            <a href="#" className="hover:text-blue-500 transition-colors underline decoration-blue-500 underline-offset-8">Admin</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Section Dynamique */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <AutoCarousel articles={articles.slice(0, 3)} />
        </motion.section>

        {/* Grille d'articles (Interactivité passive) */}
        <section className="mt-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h3 className="text-3xl font-bold text-white">Archives Numériques</h3>
              <p className="text-gray-500 mt-2">Exploration des données via l'API REST</p>
            </div>
            <div className="h-[1px] flex-1 bg-gray-800 mx-8 mb-4"></div>
            <Globe className="text-gray-700" size={32} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((art, i) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group bg-[#161616] border border-gray-800 p-8 rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-gray-800 rounded-xl group-hover:bg-blue-600/20 transition-colors">
                    <PenTool size={20} className="text-blue-500" />
                  </div>
                  <span className="text-xs font-mono text-gray-600">ID: {art.id}</span>
                </div>
                <h4 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors mb-4 leading-tight">
                  {art.titre}
                </h4>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 font-light leading-relaxed">
                  {art.contenu}
                </p>
                <div className="flex items-center text-blue-500 text-xs font-bold uppercase tracking-widest">
                  Détails <ChevronRight size={14} className="ml-1 group-hover:translate-x-2 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-32 border-t border-gray-800 py-12 text-center text-gray-600 text-xs uppercase tracking-[0.3em]">
        © 2026 Blog-API Dashboard • Emmanuel Design Systems
      </footer>
    </div>
  );
}