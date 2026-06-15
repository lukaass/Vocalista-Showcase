import { Instagram, Youtube, Mail, MapPin } from 'lucide-react';
import { SingerProfile } from '../../types';
import { getThemeClasses } from '../../utils/theme';

interface FooterProps {
  singer: SingerProfile;
}

export default function Footer({ singer }: FooterProps) {
  const theme = getThemeClasses(singer.themeColor);

  return (
    <footer className="bg-[#09090b] text-zinc-400 py-16 border-t border-zinc-850">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Logo Name & Slogan */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="text-white text-2xl font-bold tracking-tight font-sans">
              {singer.name}
            </h3>
            <p className="text-sm font-light leading-relaxed text-zinc-400 max-w-sm">
              {singer.slogan}
            </p>
            <p className="text-xs text-zinc-500 font-mono">
              VITRINE COMERCIAL OFICIAL • TODOS OS DIREITOS RESERVADOS © {new Date().getFullYear()}
            </p>
          </div>

          {/* Social and Quick Links */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-mono">Redes Sociais</h4>
            <div className="flex flex-col gap-2 text-sm font-light">
              {singer.instagram && (
                <a 
                  href={`https://instagram.com/${singer.instagram}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition flex items-center gap-2"
                >
                  <Instagram size={15} className={theme.primaryText} />
                  Instagram Oficial
                </a>
              )}
              {singer.youtube && (
                <a 
                  href={`https://youtube.com/${singer.youtube}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition flex items-center gap-2"
                >
                  <Youtube size={15} className="text-red-500" />
                  Canal do YouTube
                </a>
              )}
              {singer.spotify && (
                <a 
                  href={`https://open.spotify.com/artist/${singer.spotify}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition flex items-center gap-2"
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-black font-semibold">S</span>
                  Músicas no Spotify
                </a>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-mono">Contratação</h4>
            <div className="space-y-3 text-sm font-light">
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-zinc-500" />
                <span className="truncate">{singer.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={15} className="text-zinc-500" />
                <span>Disponível em todo do Brasil</span>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Admin Login Shortcut */}
        <div className="mt-12 pt-8 border-t border-zinc-850 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>Plataforma Desenvolvida para Cantores Premium • Vocalis</p>
          <a 
            href="?page=admin" 
            className="hover:text-white underline transition flex items-center gap-1 font-mono hover:text-amber-500 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-300"
          >
            Acesso Área Administrativa ⚙
          </a>
        </div>

      </div>
    </footer>
  );
}
