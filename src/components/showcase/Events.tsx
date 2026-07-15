import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, Ticket } from 'lucide-react';
import { SingerProfile } from '../../types';
import { getThemeClasses } from '../../utils/theme';

interface EventsProps {
  singer: SingerProfile;
}

export default function Events({ singer }: EventsProps) {
  const theme = getThemeClasses(singer.themeColor);

  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const todayStr = getTodayString();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'esgotado':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'convite':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'confirmado':
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'esgotado':
        return 'Esgotado';
      case 'convite':
        return 'Convite Especial';
      case 'confirmado':
      default:
        return 'Confirmado';
    }
  };

  // Helper to format date string to Portuguese format
  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const day = parts[2];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const year = parts[0];
        const months = [
          'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
          'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
        ];
        return {
          day,
          month: months[monthIndex] || '---',
          year
        };
      }
    } catch (e) {}
    return { day: '00', month: '---', year: '----' };
  };

  return (
    <section id="events" className="py-24 bg-[#09090b] text-zinc-100 border-b border-zinc-850">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className={`text-xs font-semibold tracking-widest uppercase ${theme.primaryText} mb-2 block`}>
            Agenda Oficial
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 font-sans">
            Próximas Apresentações
          </h2>
          <div className={`h-1 w-16 ${theme.primaryBg} mx-auto rounded-full mb-4`} />
          <p className="text-zinc-400 max-w-md mx-auto text-sm font-light">
            Quer ver uma prévia do show ao vivo? Confira as próximas datas abertas ao público e compareça para prestigiar.
          </p>
        </div>

        {/* Agenda Lists */}
        {singer.events && singer.events.length > 0 ? (
          <div className="space-y-4">
            {[...singer.events]
              .sort((a, b) => {
                const dateCompare = a.date.localeCompare(b.date);
                if (dateCompare !== 0) return dateCompare;
                return a.time.localeCompare(b.time);
              })
              .map((evt, idx) => {
              const formatted = formatDate(evt.date);
              const isPast = evt.date < todayStr;
              return (
                <motion.div
                  key={evt.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className={`flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl border transition hover:shadow-md ${
                    isPast 
                      ? 'bg-zinc-950/10 border-zinc-900/50 opacity-50' 
                      : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/70'
                  }`}
                >
                  {/* Left Side: Date Block & Info */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left w-full sm:w-auto">
                    {/* Calendar visual Block */}
                    <div className="w-16 h-16 rounded-xl flex flex-col items-center justify-center font-bold text-center border shadow-md bg-zinc-950 border-zinc-800">
                      <span className={`text-[10px] uppercase font-mono tracking-wider ${isPast ? 'text-zinc-600 line-through' : theme.primaryText}`}>
                        {formatted.month}
                      </span>
                      <span className={`text-2xl leading-none ${isPast ? 'text-zinc-500 line-through' : 'text-white'}`}>
                        {formatted.day}
                      </span>
                    </div>

                    {/* Venue and City Details */}
                    <div>
                      <h4 className={`font-bold text-lg leading-snug ${isPast ? 'text-zinc-500 line-through' : 'text-white'}`}>
                        {evt.title}
                      </h4>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-zinc-400 mt-1.5 font-light">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-zinc-500" />
                          {evt.venue} ({evt.city})
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} className="text-zinc-500" />
                          {evt.time}h
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Status Tag, Optional Ticket Links */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      isPast 
                        ? 'bg-zinc-900/30 text-zinc-500 border-zinc-850' 
                        : getStatusColor(evt.status)
                    }`}>
                      {isPast ? 'Show Realizado' : getStatusLabel(evt.status)}
                    </span>
                    
                    {evt.link && evt.status !== 'esgotado' && !isPast && (
                      <a
                        href={evt.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs hover:underline flex items-center gap-1 font-semibold ${theme.primaryText} transition`}
                      >
                        <Ticket size={13} />
                        Ingressos / Informações
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-12 bg-zinc-900/20 rounded-2xl border border-dashed border-zinc-805 text-zinc-500">
            <Calendar size={32} className="mx-auto text-zinc-600 mb-3" />
            <p className="text-sm">Nenhuma data pública agendada no momento. Entre em contato para datas corporativas.</p>
          </div>
        )}

      </div>
    </section>
  );
}
