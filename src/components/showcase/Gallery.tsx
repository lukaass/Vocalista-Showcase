import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { SingerProfile } from '../../types';
import { getThemeClasses } from '../../utils/theme';
import { parseMediaUrl } from '../../utils/mediaParser';

interface GalleryProps {
  singer: SingerProfile;
}

export default function Gallery({ singer }: GalleryProps) {
  const theme = getThemeClasses(singer.themeColor);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);

  const images = singer.gallery.length > 0 ? singer.gallery : [
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800&h=530',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800&h=530',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800&h=530',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800&h=530'
  ];

  const handlePrev = () => {
    if (activePhoto !== null) {
      setActivePhoto((activePhoto - 1 + images.length) % images.length);
    }
  };

  const handleNext = () => {
    if (activePhoto !== null) {
      setActivePhoto((activePhoto + 1) % images.length);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-[#09090b] text-white overflow-hidden border-t border-zinc-850">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs font-mono uppercase tracking-widest ${theme.primaryText} mb-3`}
          >
            <ImageIcon size={12} />
            Galeria de Mídia
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Palco em Imagens
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base font-light"
          >
            Sinta a energia de quem domina os melhores palcos. Imagens registradas em casamentos de luxo, shows beneficentes e feiras agropecuárias.
          </motion.p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((img, idx) => {
            const media = parseMediaUrl(img);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative group aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center"
                onClick={() => setActivePhoto(idx)}
              >
                {/* Media representation */}
                {media.type === 'youtube' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <img src={`https://img.youtube.com/vi/${media.embedUrl.split('embed/')[1]}/hqdefault.jpg`} className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100 group-hover:scale-110 transition duration-500 ease-out" />
                    <div className="absolute w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white" style={{ clipPath: 'polygon(35% 25%, 35% 75%, 75% 50%)' }}></div>
                  </div>
                )}
                {media.type === 'instagram' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 font-bold text-white tracking-widest uppercase group-hover:scale-110 transition duration-500 ease-out">
                    Ver no Instagram
                  </div>
                )}
                {media.type === 'image' && (
                  <img 
                    src={media.url} 
                    alt={`${singer.name} Galeria ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500 ease-out filter brightness-90 group-hover:brightness-100"
                    referrerPolicy="no-referrer"
                  />
                )}
                
                {/* Dark Hover overlay */}
                <div className="absolute inset-0 bg-[#09090b]/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  <div className="p-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transform scale-75 group-hover:scale-100 transition duration-300">
                    <Maximize2 size={20} className="text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal Overlay */}
      <AnimatePresence>
        {activePhoto !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setActivePhoto(null)}
          >
            {/* Modal Container */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white z-50 transition active:scale-95"
              >
                <X size={24} />
              </button>

              {/* Navigation Left */}
              <button 
                onClick={handlePrev}
                className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white z-40 transition active:scale-90"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Main Image / Video Player */}
              <div className="relative h-[65vh] md:h-[80vh] w-full flex items-center justify-center rounded-2xl overflow-hidden bg-transparent">
                {(() => {
                  const media = parseMediaUrl(images[activePhoto]);
                  if (media.type === 'youtube') {
                    return (
                      <iframe 
                        className="w-full h-full max-w-4xl shadow-2xl rounded-2xl bg-black" 
                        src={`${media.embedUrl}?autoplay=1`} 
                        title="YouTube video player" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    );
                  }
                  if (media.type === 'instagram') {
                    return (
                      <iframe 
                        className="w-full max-w-sm h-full shadow-2xl rounded-2xl bg-black" 
                        src={media.embedUrl} 
                        title="Instagram content" 
                        allow="autoplay; encrypted-media; picture-in-picture" 
                        allowFullScreen
                        scrolling="no"
                      ></iframe>
                    );
                  }
                  return (
                    <img 
                      src={media.url} 
                      alt={`${singer.name} Lightbox`}
                      className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                      referrerPolicy="no-referrer"
                    />
                  );
                })()}
              </div>

              {/* Image Caption/Counter */}
              <div className="mt-4 text-center text-zinc-400 font-mono text-xs">
                Foto {activePhoto + 1} de {images.length}
              </div>

              {/* Navigation Right */}
              <button 
                onClick={handleNext}
                className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white z-40 transition active:scale-90"
              >
                <ChevronRight size={24} />
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
