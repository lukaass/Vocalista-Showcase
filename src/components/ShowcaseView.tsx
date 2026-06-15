import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowLeft, Menu, X, Globe } from 'lucide-react';
import { SingerProfile } from '../types';
import Hero from './showcase/Hero';
import About from './showcase/About';
import Gallery from './showcase/Gallery';
import Plans from './showcase/Plans';
import PlanComparison from './showcase/PlanComparison';
import Events from './showcase/Events';
import Testimonials from './showcase/Testimonials';
import BudgetForm from './showcase/BudgetForm';
import FAQ from './showcase/FAQ';
import Footer from './showcase/Footer';
import { getThemeClasses } from '../utils/theme';

interface ShowcaseViewProps {
  singer: SingerProfile;
  onGoBack?: () => void;
  backLabel?: string;
  isPreviewMode?: boolean;
}

export default function ShowcaseView({ singer, onGoBack, backLabel, isPreviewMode }: ShowcaseViewProps) {
  const theme = getThemeClasses(singer.themeColor);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll to element selector
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handeSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    // instant scroll to budget form
    const element = document.getElementById('budget');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`bg-[#09090b] min-h-screen text-zinc-100 selection:bg-zinc-800 selection:text-white ${isPreviewMode ? 'pt-10' : ''}`}>
      
      {/* PREVIEW BANNER FOR ACTIVE ADMIN/SINGER SESSION */}
      {isPreviewMode && (
        <div className="fixed top-0 left-0 right-0 h-10 z-50 bg-[#b45309] text-[#fffbeb] text-[11px] font-bold px-4 text-center font-mono flex items-center justify-center gap-2 shadow-lg border-b border-amber-600/20">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Modo de Visualização Ativa • Suas alterações estão publicadas!
          </span>
          {onGoBack && (
            <button 
              onClick={onGoBack}
              className="ml-3 px-2 py-0.5 rounded bg-amber-900/60 hover:bg-amber-900 hover:text-white transition cursor-pointer active:scale-95"
            >
              Voltar ao Painel
            </button>
          )}
        </div>
      )}

      {/* CUSTOM FLOATING STICKY NAVBAR */}
      <nav className={`fixed ${isPreviewMode ? 'top-10' : 'top-0'} left-0 right-0 z-40 bg-[#09090b]/85 backdrop-blur-md border-b border-zinc-850 py-4 px-4 md:px-8 transition-all`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onGoBack && (
              <button 
                onClick={onGoBack}
                className="p-1 px-3.5 rounded-lg border border-zinc-800 hover:bg-zinc-800 text-xs text-white/80 transition flex items-center gap-1 font-mono cursor-pointer"
              >
                <ArrowLeft size={12} />
                {backLabel || 'Voltar ao Catálogo'}
              </button>
            )}
            <span className="text-white font-bold text-lg tracking-tight font-sans cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              {singer.name} <span className="text-[10px] font-semibold text-zinc-500 font-mono tracking-wider ml-1 uppercase">{singer.genre.split(' ')[0]}</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400 font-medium">
            <button onClick={() => scrollToSection('about')} className="text-zinc-400 hover:text-white transition">Biografia</button>
            <button onClick={() => scrollToSection('gallery')} className="text-zinc-400 hover:text-white transition">Galeria</button>
            <button onClick={() => scrollToSection('plans')} className="text-zinc-400 hover:text-white transition">Formatos</button>
            <button onClick={() => scrollToSection('events')} className="text-zinc-400 hover:text-white transition">Agenda</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-zinc-400 hover:text-white transition">Depoimentos</button>
            <button onClick={() => scrollToSection('budget')} className="text-zinc-400 hover:text-white transition">Contratar</button>
            
            <a 
              href="#budget"
              onClick={() => scrollToSection('budget')}
              className={`px-4 py-2 rounded-lg font-semibold text-xs text-black ${theme.primaryBg} ${theme.primaryHoverBg} transition flex items-center gap-1.5`}
            >
              <Calendar size={13} strokeWidth={2} />
              Contratar Show
            </a>
          </div>

          {/* Mobile responsive toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/80 hover:text-white active:scale-95 transition"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown Overlay Pane */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-zinc-800 flex flex-col gap-3 text-sm text-zinc-300 font-medium">
            <button onClick={() => scrollToSection('about')} className="text-left py-1 text-zinc-400 hover:text-white">Biografia</button>
            <button onClick={() => scrollToSection('gallery')} className="text-left py-1 text-zinc-400 hover:text-white">Galeria</button>
            <button onClick={() => scrollToSection('plans')} className="text-left py-1 text-zinc-400 hover:text-white">Formatos</button>
            <button onClick={() => scrollToSection('events')} className="text-left py-1 text-zinc-400 hover:text-white">Agenda</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-left py-1 text-zinc-400 hover:text-white">Depoimentos</button>
            <button onClick={() => scrollToSection('budget')} className="text-left py-1 text-zinc-400 hover:text-white">Contratar</button>
            <a 
              href="#budget"
              onClick={() => scrollToSection('budget')}
              className={`w-full py-3 rounded-lg font-semibold text-center text-xs text-black ${theme.primaryBg} hover:opacity-90 transition block mt-2`}
            >
              Orçamento de Show
            </a>
          </div>
        )}
      </nav>

      {/* RENDER SHOWCASE PANELS IN SEQUENCE */}
      <main>
        {/* 1. Hero */}
        <Hero singer={singer} />

        {/* 2. Biography/About */}
        <About singer={singer} />

        {/* 3. Media Gallery */}
        <Gallery singer={singer} />

        {/* 4. Pricing / Packages */}
        <Plans singer={singer} onSelectPlan={handeSelectPlan} />

        {/* 5. Detailed Comparison table */}
        <PlanComparison singer={singer} />

        {/* 6. Gig/Tour Calendar Schedule */}
        <Events singer={singer} />

        {/* 7. Client Reviews / Testimonials */}
        <Testimonials singer={singer} />

        {/* 8. Active Contract Form */}
        <BudgetForm singer={singer} selectedPlanName={selectedPlan} />

        {/* 9. FAQ Section */}
        <FAQ singer={singer} />
      </main>

      {/* 10. Footer */}
      <Footer singer={singer} />



    </div>
  );
}
