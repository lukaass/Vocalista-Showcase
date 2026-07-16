import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { SingerProfile } from '../../types';
import { getThemeClasses } from '../../utils/theme';
import { parseMediaUrl } from '../../utils/mediaParser';

interface InstagramThumbnailProps {
  mediaId: string;
  singerName: string;
}

function InstagramThumbnail({ mediaId, singerName }: InstagramThumbnailProps) {
  const [imgSrc, setImgSrc] = useState(`https://www.instagram.com/p/${mediaId}/media/?size=m`);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      // Stable selection of premium music-related placeholder photos
      const beautifulMusicImages = [
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800', // Concert stage hands up
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800', // Singer with microphone
        'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800', // Concert crowd and lights
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800', // Vintage microphone
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800', // DJ controller/music
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800', // Party concert lights
        'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800'  // Concert performance
      ];
      // Create a stable sum hash based on media ID characters to pick one of the images
      let sum = 0;
      for (let i = 0; i < Math.min(mediaId.length, 5); i++) {
        sum += mediaId.charCodeAt(i);
      }
      setImgSrc(beautifulMusicImages[sum % beautifulMusicImages.length]);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <img
        src={imgSrc}
        onError={handleImageError}
        alt={`Instagram Post - ${singerName}`}
        className="w-full h-full object-cover filter brightness-75 group-hover:brightness-90 group-hover:scale-110 transition duration-500 ease-out"
        referrerPolicy="no-referrer"
      />
      
      {/* Small top-right Instagram badge */}
      <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1.5 text-[9px] font-mono tracking-wider font-bold text-white uppercase shadow-sm">
        <svg className="w-3.5 h-3.5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
        <span>Instagram</span>
      </div>

      {/* Play/View icon centered */}
      <div className="absolute w-12 h-12 rounded-full bg-black/55 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm shadow-md group-hover:scale-105 group-hover:bg-pink-600/70 group-hover:border-pink-500/40 transition duration-300">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </div>
    </div>
  );
}

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
                  <InstagramThumbnail mediaId={media.id || ''} singerName={singer.name} />
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
