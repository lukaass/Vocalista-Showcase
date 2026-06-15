import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Phone, Mail, User, MapPin, Clock, MessageSquare, Send, Check, ExternalLink, Copy } from 'lucide-react';
import { SingerProfile } from '../../types';
import { getThemeClasses } from '../../utils/theme';

interface BudgetFormProps {
  singer: SingerProfile;
  selectedPlanName: string;
}

export default function BudgetForm({ singer, selectedPlanName }: BudgetFormProps) {
  const theme = getThemeClasses(singer.themeColor);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [plan, setPlan] = useState('');
  const [remarks, setRemarks] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [distanceKm, setDistanceKm] = useState<number | ''>(0);

  // Auto-Travel calculation states
  const [eventCity, setEventCity] = useState('');
  const [eventState, setEventState] = useState('SP');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [manualOverride, setManualOverride] = useState(false);

  // Formatting helper
  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
  };

  // Convert "R$ 2.500" or similar text price to integer
  const getPlanPriceNumber = (planName: string) => {
    const p = singer.plans.find(x => x.name === planName);
    if (!p) return 0;
    const cleaned = p.price.replace(/\D/g, '');
    return parseInt(cleaned) || 0;
  };

  // Haversine formula to compute geodesic distance in KM between two latitude/longitude points
  const computeHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's mean radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceDirect = R * c;
    // Simulate real road topology curves and bypasses, normally ~25% longer than flat straight line distance
    return Math.round(distanceDirect * 1.25);
  };

  const geocodeAddress = async (query: string): Promise<{ lat: number; lon: number } | null> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
        headers: {
          'Accept-Language': 'pt-BR,pt;q=0.9',
          'User-Agent': 'VitrineContratacoes/2.0'
        }
      });
      if (!response.ok) return null;
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        };
      }
    } catch (e) {
      console.error("Geocoding address failed:", query, e);
    }
    return null;
  };

  const calculateDistanceAutomatically = async (cityInput = eventCity, stateInput = eventState) => {
    const trimmedCity = cityInput.trim();
    if (!trimmedCity || !singer.travelEnabled) return;

    setIsCalculatingRoute(true);
    setRouteError(null);

    const originQuery = singer.travelOrigin || 'São Paulo - SP';
    const destinationQuery = `${trimmedCity}, ${stateInput}, Brasil`;

    try {
      // 1. Geocode origin
      const originCoords = await geocodeAddress(originQuery);
      if (!originCoords) {
        setRouteError(`Não foi possível determinar as coordenadas de origem no satélite (${originQuery}).`);
        setIsCalculatingRoute(false);
        return;
      }

      // 2. Geocode destination
      const destCoords = await geocodeAddress(destinationQuery);
      if (!destCoords) {
        setRouteError(`Destino não encontrado pelo satélite: "${trimmedCity} - ${stateInput}". Verifique a ortografia.`);
        setIsCalculatingRoute(false);
        return;
      }

      // 3. Compute road-equivalent distance in Km
      const computedDistance = computeHaversineDistance(
        originCoords.lat,
        originCoords.lon,
        destCoords.lat,
        destCoords.lon
      );

      // set distance state
      setDistanceKm(computedDistance);
      setRouteError(null);
    } catch (err) {
      console.error(err);
      setRouteError("Conexão ao satélite instável. Por favor, ajuste o Km de forma assistida.");
      setManualOverride(true);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Trigger calculation automatically when eventCity changes (on blur / debounced trigger)
  // We can also trigger when city changes and state changes, but let's provide solid onBlur + Manual Trigger buttons for premium control.

  // Calculation details generator
  const getTravelCalculation = () => {
    const baseRadius = singer.travelBaseRadius ?? 50;
    const stepKm = singer.travelStepKm ?? 50;
    const incrementPercent = singer.travelIncrementPercent ?? 10;
    const distanceVal = typeof distanceKm === 'number' ? distanceKm : 0;

    if (!singer.travelEnabled || distanceVal <= baseRadius) {
      return { surchargePercent: 0, surchargeAmount: 0, total: getPlanPriceNumber(plan) };
    }

    const basePrice = getPlanPriceNumber(plan);
    const excess = distanceVal - baseRadius;
    const steps = Math.ceil(excess / stepKm);
    const surchargePercent = steps * incrementPercent;
    const surchargeAmount = Math.round(basePrice * (surchargePercent / 100));
    const total = basePrice + surchargeAmount;

    return { surchargePercent, surchargeAmount, total };
  };

  // Sync state if selectedPlanName changes from Plans component click
  useEffect(() => {
    if (selectedPlanName) {
      setPlan(selectedPlanName);
    }
  }, [selectedPlanName]);

  // Set default plan selection if nothing is chosen
  useEffect(() => {
    if (!plan && singer.plans.length > 0) {
      setPlan(singer.plans[0].name);
    }
  }, [singer, plan]);

  const generateTextMessage = () => {
    let logisticsBlock = '';
    if (singer.travelEnabled) {
      const distanceVal = typeof distanceKm === 'number' ? distanceKm : 0;
      const { surchargePercent, surchargeAmount, total } = getTravelCalculation();
      const planPrice = getPlanPriceNumber(plan);
      logisticsBlock = `\n*LOGÍSTICA & VALOR ESTIMADO:*
• Rota Base: ${singer.travelOrigin || 'Não definida'} ➔ ${eventCity} - ${eventState}
• Distância Rodoviária: ${distanceVal} km
• Preço base do formato: ${formatBRL(planPrice)}
• Adicional de Viagem (+${surchargePercent}%): ${formatBRL(surchargeAmount)}
• *Valor Total Estimado:* ${formatBRL(total)}
`;
    }

    return `Olá, gostaria de solicitar um orçamento para o show de *${singer.name}*!

*DADOS DO CONTRATANTE:*
• Nome: ${name}
• E-mail: ${email}
• WhatsApp: ${phone}

*DETALHES DO EVENTO:*
• Data pretendida: ${date ? date.split('-').reverse().join('/') : 'Não informada'}
• Horário estimado: ${time || 'Não informado'}
• Cidade do Evento: ${eventCity} - ${eventState}
• Local/Espaço: ${location || 'Não informado'}${logisticsBlock}
• Formato de Show desejado: *${plan}*

*OBSERVAÇÕES:*
${remarks || 'Nenhuma observação informada.'}

_Gerado automaticamente via Vitrine Comercial Premium de ${singer.name}._`;
  };

  const generateWhatsappUrl = () => {
    const textMessage = generateTextMessage();
    const encodedText = encodeURIComponent(textMessage);
    const cleanPhone = singer.phone.replace(/\D/g, ''); // Numbers only
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Attempt instant user-triggered open. It might navigate safely under user gesture if iframe allows popups.
    const url = generateWhatsappUrl();
    try {
      window.open(url, '_blank');
    } catch (err) {
      console.warn('Redirect blocked by browser sandbox/popup settings', err);
    }
  };

  return (
    <section id="budget" className="py-24 bg-[#09090b] text-zinc-100 border-b border-zinc-900">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className={`text-xs font-semibold tracking-widest uppercase ${theme.primaryText} mb-2 block`}>
            Contratação Rápida
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 font-sans">
            Solicitar Datas & Orçamento
          </h2>
          <div className={`h-1 w-16 ${theme.primaryBg} mx-auto rounded-full mb-4`} />
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base font-light leading-relaxed">
            Preencha os dados básicos abaixo para reservar sua data. Você será redirecionado para o WhatsApp de nossa produção para formalizar o contrato de show.
          </p>
        </div>

        {/* Content Split Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-zinc-900/30 rounded-3xl p-6 md:p-10 border border-zinc-800 shadow-2xl overflow-hidden relative backdrop-blur-md">
          
          {/* Form Left Pillar Info */}
          <div className="lg:col-span-4 flex flex-col justify-between text-zinc-400 min-h-[300px]">
            <div>
              <h3 className="text-xl font-bold text-white font-sans mb-4">Por que nos escolher?</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed mb-6">
                Ao enviar este formulário, nossa produção analisa instantaneamente a logística para sua cidade, verifica a disponibilidade e retorna em minutos.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full bg-zinc-950 border border-zinc-850 ${theme.primaryText}`}>
                    <User size={16} />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-white">Contato Comercial Sem Filtros</p>
                    <p className="text-zinc-500">Fale direto com a equipe do artista</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full bg-zinc-950 border border-zinc-850 ${theme.primaryText}`}>
                    <Calendar size={16} />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-white">Reserva de Datas</p>
                    <p className="text-zinc-500">Bloqueio imediato no calendário</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full bg-zinc-950 border border-zinc-850 ${theme.primaryText}`}>
                    <Phone size={16} />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-white">Econômico e Seguro</p>
                    <p className="text-zinc-500">Valor fixado conforme vitrine comercial</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-zinc-850">
              <p className="text-xs font-mono text-zinc-500">CONEXÃO DIRETA</p>
              <h4 className="text-sm font-bold text-white mt-1">Conexão Segura via WhatsApp</h4>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                Preencha os dados no formulário ao lado para liberar o contato. Nosso sistema efetuará o redirecionamento instantâneo para a equipe de produção do cantor no WhatsApp com suas informações organizadas.
              </p>
            </div>
          </div>

          {/* Form Real Form Block */}
          {formSubmitted ? (
            <div className="lg:col-span-8 bg-zinc-950/40 rounded-2xl p-6 md:p-8 border border-zinc-800 text-center flex flex-col items-center justify-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Check size={32} />
              </div>
              
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white font-sans">
                  Sua Solicitação Está Pronta!
                </h3>
                <p className="text-zinc-450 text-sm mt-2 leading-relaxed max-w-lg mx-auto">
                  Como você está acessando a simulação do aplicativo, o seu navegador pode ter restringido o redirecionamento automático imediato.
                </p>
                <p className="text-emerald-400 text-xs font-semibold mt-2 max-w-md mx-auto">
                  Por favor, clique no botão seguro abaixo para iniciar o chat do WhatsApp em uma nova guia:
                </p>
              </div>

              {/* Action Buttons */}
              <div className="w-full max-w-md space-y-3 pt-2">
                <a
                  href={generateWhatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-black bg-emerald-500 hover:bg-emerald-450 shadow-lg shadow-emerald-500/10 transition cursor-pointer"
                >
                  <Phone size={18} fill="currentColor" />
                  Conectar ao WhatsApp de Produção
                  <ExternalLink size={14} />
                </a>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const textMessage = generateTextMessage();
                      navigator.clipboard.writeText(textMessage).then(() => {
                        setCopiedText(true);
                        setTimeout(() => setCopiedText(false), 2000);
                      });
                    }}
                    className="py-3 px-4 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-850 text-zinc-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedText ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        Texto Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        Copiar Mensagem
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="py-3 px-4 rounded-xl border border-transparent bg-zinc-900/20 hover:bg-zinc-900 text-zinc-450 hover:text-zinc-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Editar Dados
                  </button>
                </div>
              </div>

              {/* Message preview */}
              <div className="w-full text-left bg-zinc-950 border border-zinc-900/50 rounded-xl p-4 text-xs font-mono max-h-[170px] overflow-y-auto mt-4 space-y-1">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 border-b border-zinc-900 pb-1.5 flex items-center justify-between">
                  <span>Visualização Completa do Texto:</span>
                  <span className="text-[9px] text-zinc-600 font-normal">Enviado diretamente ao produtor</span>
                </div>
                <div className="whitespace-pre-line text-zinc-450 leading-relaxed font-sans">
                  {generateTextMessage()}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-350 uppercase tracking-wider flex items-center gap-1">
                    <User size={13} className="text-zinc-500" />
                    Seu Nome Inteiro *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João Silva Santos"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm outline-none focus:border-zinc-700 focus:ring-2 ${theme.primaryRing} transition`}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-350 uppercase tracking-wider flex items-center gap-1">
                    <Mail size={13} className="text-zinc-500" />
                    E-mail de Contato *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: joao@site.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm outline-none focus:border-zinc-700 focus:ring-2 ${theme.primaryRing} transition`}
                  />
                </div>

                {/* Telephone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-350 uppercase tracking-wider flex items-center gap-1">
                    <Phone size={13} className="text-zinc-500" />
                    WhatsApp para Retorno *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: (11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm outline-none focus:border-zinc-700 focus:ring-2 ${theme.primaryRing} transition`}
                  />
                </div>

                {/* Choice of Plan */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-350 uppercase tracking-wider flex items-center gap-1">
                    <Send size={13} className="text-zinc-500" />
                    Plano / Formato Escolhido *
                  </label>
                  <select
                    required
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 text-sm outline-none focus:border-zinc-700 focus:ring-2 ${theme.primaryRing} transition appearance-none cursor-pointer`}
                  >
                    {singer.plans.map((p, idx) => (
                      <option key={p.id || idx} value={p.name} className="bg-zinc-950 text-zinc-100">
                        {p.name} ({p.price})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date of Event */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-350 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={13} className="text-zinc-500" />
                    Data do Evento *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm outline-none focus:border-zinc-700 focus:ring-2 ${theme.primaryRing} transition`}
                  />
                </div>

                {/* Proposed Time */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-350 uppercase tracking-wider flex items-center gap-1">
                    <Clock size={13} className="text-zinc-500" />
                    Horário de Início aproximado *
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm outline-none focus:border-zinc-700 focus:ring-2 ${theme.primaryRing} transition`}
                  />
                </div>

              </div>

              {/* Localidade do Evento com Cálculo por Satélite */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Cidade */}
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-350 uppercase tracking-wider flex items-center gap-1">
                      <MapPin size={13} className="text-zinc-500" />
                      Cidade do Evento *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Ribeirão Preto, Campinas, Petrópolis"
                      value={eventCity}
                      onChange={(e) => {
                        setEventCity(e.target.value);
                        // Limpa o Km pra exigir recálculo
                        setDistanceKm(0);
                      }}
                      onBlur={() => calculateDistanceAutomatically()}
                      className={`w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm outline-none focus:border-zinc-700 focus:ring-2 ${theme.primaryRing} transition`}
                    />
                  </div>

                  {/* Estado (UF) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-350 uppercase tracking-wider flex items-center gap-1">
                      Estado (UF) *
                    </label>
                    <select
                      value={eventState}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEventState(val);
                        setDistanceKm(0);
                        if (eventCity.trim()) {
                          calculateDistanceAutomatically(eventCity, val);
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm outline-none focus:border-zinc-700 focus:ring-2 ${theme.primaryRing} transition cursor-pointer`}
                    >
                      {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
                        <option key={uf} value={uf} className="bg-zinc-900 text-white">{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Local Físico */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-350 uppercase tracking-wider flex items-center gap-1">
                    <MapPin size={13} className="text-zinc-400" />
                    Local / Espaço do Show *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Chácara Recanto Verde, Mansão das Oliveiras, Clube Hípico"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm outline-none focus:border-zinc-700 focus:ring-2 ${theme.primaryRing} transition`}
                  />
                </div>
              </div>

              {/* Bloco de Deslocamento Automático */}
              {singer.travelEnabled && (
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-350 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                      <MapPin size={13} className={theme.primaryText} />
                      Logística e Transporte do Artista
                    </label>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold uppercase tracking-wider">
                      Cálculo Oficial e Seguro
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 font-light leading-relaxed">
                    Para garantir a viabilidade técnica e pontualidade, calculamos a distância automática entre a base de <strong>{singer.name}</strong> ({singer.travelOrigin || 'São Paulo - SP'}) e o local do seu evento.
                  </p>

                  <div className="flex flex-col gap-4 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800">
                    
                    {/* Botão de cálculo ou status */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-zinc-350">
                          Rota: <span className="text-white font-mono">{singer.travelOrigin || 'São Paulo - SP'}</span> ➔ <span className="text-emerald-400 font-bold font-mono">{eventCity ? `${eventCity} - ${eventState}` : 'Digite a Cidade acima'}</span>
                        </div>
                        {routeError && (
                          <div className="text-[11px] text-rose-400 font-medium">⚠️ {routeError}</div>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={isCalculatingRoute || !eventCity.trim()}
                        onClick={() => calculateDistanceAutomatically()}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          eventCity.trim() 
                            ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 active:scale-[0.98]' 
                            : 'bg-zinc-900/50 text-zinc-650 cursor-not-allowed border border-white/5'
                        }`}
                      >
                        {isCalculatingRoute ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-zinc-300 border-t-transparent rounded-full animate-spin" />
                            Consultando Rota...
                          </>
                        ) : (
                          <>
                            🗺️ Calcular Rota Oficial
                          </>
                        )}
                      </button>
                    </div>

                    {/* Resultados consolidados */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-900">
                      
                      {/* Distância */}
                      <div className="flex flex-col justify-center p-3 rounded-xl bg-zinc-950/70 border border-zinc-900">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wide font-bold">Distância Rodoviária</span>
                        
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-black text-white font-mono">
                            {distanceKm === '' || distanceKm === 0 ? '--' : distanceKm}
                          </span>
                          <span className="text-xs text-zinc-500 font-mono font-medium">km</span>
                          
                          {distanceKm !== '' && distanceKm > 0 && (
                            <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded ml-2 flex items-center gap-0.5">
                              ✓ Confirmada
                            </span>
                          )}
                        </div>

                        {distanceKm !== '' && distanceKm > 0 && (
                          <span className="text-[10px] text-zinc-400 mt-1">
                            {distanceKm <= (singer.travelBaseRadius ?? 50) 
                              ? `Dentro da base de cortesia (${singer.travelBaseRadius ?? 50}km)!` 
                              : `Taxa calculada sobre ${(distanceKm - (singer.travelBaseRadius ?? 50))}km extras.`
                            }
                          </span>
                        )}
                      </div>

                      {/* Orçamento das taxas */}
                      <div className="space-y-1 text-xs leading-normal p-3 rounded-xl bg-zinc-950/70 border border-zinc-900">
                        {(() => {
                          const { surchargePercent, surchargeAmount, total } = getTravelCalculation();
                          const basePrice = getPlanPriceNumber(plan);
                          return (
                            <>
                              <div className="flex justify-between text-zinc-400">
                                <span>Preço Base do Show:</span>
                                <span className="text-white font-mono font-semibold">{formatBRL(basePrice)}</span>
                              </div>
                              <div className="flex justify-between text-zinc-400">
                                <span>Adicional de Viagem ({surchargePercent}%):</span>
                                <span className={`${surchargePercent > 0 ? 'text-amber-400' : 'text-emerald-400'} font-mono font-semibold`}>
                                  {surchargePercent > 0 ? `+ ${formatBRL(surchargeAmount)}` : 'R$ 0 (Incluso!)'}
                                </span>
                              </div>
                              <div className="border-t border-zinc-900 pt-1.5 mt-1.5 flex justify-between text-xs font-bold">
                                <span className="text-white">Orçamento Estimado:</span>
                                <span className={`${theme.primaryText} font-mono font-bold`}>{formatBRL(total)}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>

                    </div>

                    {/* Habilitar override de segurança */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setManualOverride(!manualOverride)}
                        className="text-[10px] text-zinc-500 hover:text-zinc-400 underline transition cursor-pointer"
                      >
                        {manualOverride ? 'Ocultar ajuste manual' : 'Precisa de ajuste manual de distância?'}
                      </button>
                    </div>

                    {/* Input manual em caso de falhas ou se preferido */}
                    {manualOverride && (
                      <div className="p-3 bg-zinc-950 rounded-lg space-y-2 border border-zinc-900 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-400">Distância Ajustada Manualmente:</span>
                          <div className="flex items-center gap-1 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                            <input
                              type="number"
                              min="0"
                              value={distanceKm}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDistanceKm(val === '' ? '' : Math.max(0, parseInt(val) || 0));
                              }}
                              className="bg-transparent text-white font-bold text-xs text-right w-10 outline-none font-mono"
                            />
                            <span className="text-[10px] text-zinc-500 font-mono">km</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="400"
                          step="5"
                          value={distanceKm === '' ? 0 : distanceKm}
                          onChange={(e) => setDistanceKm(parseInt(e.target.value) || 0)}
                          className="w-full accent-indigo-500 bg-zinc-900 rounded-lg appearance-none h-1 cursor-pointer"
                        />
                        <span className="block text-[9px] text-zinc-500 leading-normal">
                          * Use o ajuste apenas se a cidade correta não foi mapeada via consulta de satélite ou se possui uma distância preferencial acordada.
                        </span>
                      </div>
                    )}

                  </div>

                  <div className="text-[10px] text-zinc-500 leading-relaxed font-light">
                    ℹ️ <span className="font-semibold text-zinc-400">Regra comercial de deslocamento:</span> Os primeiros <span className="text-zinc-300 font-semibold">{singer.travelBaseRadius ?? 50} km</span> de distância são cortesia (incluo total sem custos adicionais). A partir dessa milhagem base, é adicionada uma taxa de <span className="text-zinc-300 font-semibold">{singer.travelIncrementPercent ?? 10}%</span> no preço do plano selecionado a cada lote de <span className="text-zinc-300 font-semibold">{singer.travelStepKm ?? 50} km</span> de trajeto percorrido.
                  </div>
                </div>
              )}

              {/* Observações */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-350 uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare size={13} className="text-zinc-500" />
                  Observações Especiais/Pedidos
                </label>
                <textarea
                  placeholder="Indique a quantidade de convidados estimada, faturas necessárias ou outras observações do repertório..."
                  rows={4}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm outline-none focus:border-zinc-700 focus:ring-2 ${theme.primaryRing} transition resize-none`}
                />
              </div>

              {/* Submit Action */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={formSubmitted}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/10 transition cursor-pointer disabled:opacity-70`}
              >
                <Phone size={18} fill="currentColor" />
                {formSubmitted ? 'Redirecionando...' : 'Enviar Solicitação via WhatsApp'}
              </motion.button>
            </form>
          )}

        </div>

      </div>
    </section>
  );
}
