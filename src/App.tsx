/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { getSinger, importSinger, syncFromFirestore } from './services/db';
import { decodeProfile } from './utils/mediaParser';
import PlatformLanding from './components/PlatformLanding';
import ShowcaseView from './components/ShowcaseView';
import AdminLogin from './components/AdminLogin';
import PlatformOwnerDashboard from './components/PlatformOwnerDashboard';
import SingerDashboard from './components/SingerDashboard';

export default function App() {
  const [singerSlug, setSingerSlug] = useState<string | null>(null);
  const [page, setPage] = useState<'landing' | 'admin' | 'showcase'>('landing');
  const [session, setSession] = useState<{ role: 'owner' | 'singer'; userId: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Parse URL parameters for custom state routing
  const parseUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    const singer = params.get('singer');
    const pdata = params.get('pdata');
    const p = params.get('page');

    if (singer) {
      if (pdata) {
        try {
          const importedProfile = decodeProfile(pdata);
          if (importedProfile && importedProfile.username.toLowerCase() === singer.toLowerCase()) {
            importSinger(importedProfile);
          }
        } catch (e) {
          console.error('Failed to auto-import profile back-up from URL', e);
        }
      }
      setSingerSlug(singer);
      setPage('showcase');
    } else if (p === 'admin') {
      setSingerSlug(null);
      setPage('admin');
    } else {
      setSingerSlug(null);
      setPage('landing');
    }
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        await syncFromFirestore();
      } catch (err) {
        console.error("Failed to sync database from Firestore:", err);
      } finally {
        setLoading(false);
        parseUrlParams();
      }
    };
    initApp();

    // Listen for browser Back/Forward navigation triggers
    const handlePopState = () => {
      parseUrlParams();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (targetPage: 'landing' | 'admin' | 'showcase', slug: string | null = null) => {
    const params = new URLSearchParams();
    if (slug) {
      params.set('singer', slug);
    } else if (targetPage === 'admin') {
      params.set('page', 'admin');
    }

    const newSearch = params.toString() ? `?${params.toString()}` : '';
    window.history.pushState(null, '', `${window.location.pathname}${newSearch}`);
    
    setSingerSlug(slug);
    setPage(slug ? 'showcase' : targetPage);
  };

  const handleLoginSuccess = (newSession: { role: 'owner' | 'singer'; userId: string }) => {
    setSession(newSession);
  };

  const handleLogout = () => {
    setSession(null);
  };

  const handleImpersonate = (slug: string) => {
    setSession({ role: 'singer', userId: slug });
  };

  if (loading) {
    return (
      <div className="bg-zinc-950 min-h-screen text-zinc-100 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xs font-bold tracking-widest text-zinc-500 uppercase animate-pulse">
          Sincronizando vitrines online...
        </div>
      </div>
    );
  }

  // Rendering Switch based on active page state values
  if (page === 'showcase' && singerSlug) {
    const singerProfile = getSinger(singerSlug);
    if (singerProfile) {
      return (
        <ShowcaseView 
          singer={singerProfile} 
          onGoBack={() => handleNavigate(session ? 'admin' : 'landing')} 
          backLabel={session ? 'Voltar ao Painel' : 'Voltar ao Catálogo'}
          isPreviewMode={!!session}
        />
      );
    } else {
      // If code cannot locate singer, show custom warning
      return (
        <div className="bg-zinc-950 min-h-screen text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl">
            <span className="text-4xl">⚠️</span>
            <h2 className="text-2xl font-bold mt-4 font-sans text-white">Vitrine Não Localizada</h2>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
              O cantor com o username <code className="text-amber-500 font-mono">@{singerSlug}</code> não foi encontrado ou foi removido da plataforma pelo proprietário.
            </p>
            <button 
              onClick={() => handleNavigate('landing')}
              className="mt-6 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer"
            >
              Voltar ao Catálogo Geral
            </button>
          </div>
        </div>
      );
    }
  }

  if (page === 'admin') {
    if (!session) {
      return (
        <AdminLogin 
          onLoginSuccess={handleLoginSuccess} 
          onGoBack={() => handleNavigate('landing')} 
        />
      );
    }

    if (session.role === 'owner') {
      return (
        <PlatformOwnerDashboard 
          onLogout={handleLogout} 
          onImpersonateSinger={handleImpersonate} 
        />
      );
    }

    if (session.role === 'singer') {
      return (
        <SingerDashboard 
          username={session.userId} 
          onLogout={handleLogout} 
          onPreviewShowcase={(slug) => handleNavigate('showcase', slug)}
        />
      );
    }
  }

  // Fallback default: PlatformLanding Page
  return (
    <PlatformLanding 
      onSelectSinger={(slug) => handleNavigate('showcase', slug)}
      onGoToAdmin={() => handleNavigate('admin')}
    />
  );
}

