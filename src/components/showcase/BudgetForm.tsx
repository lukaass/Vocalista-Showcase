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
    return `Olá, gostaria de solicitar um orçamento para o show de *${singer.name}*!

*DADOS DO CONTRATANTE:*
• Nome: ${name}
• E-mail: ${email}
• WhatsApp: ${phone}

*DETALHES DO EVENTO:*
• Data pretendida: ${date ? date.split('-').reverse().join('/') : 'Não informada'}
• Horário estimado: ${time || 'Não informado'}
• Local/Cidade: ${location}
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

              {/* City / Venue Location */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-350 uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={13} className="text-zinc-500" />
                  Local e Cidade do Evento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Espaço Contemporâneo, Ribeirão Preto - SP"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-sm outline-none focus:border-zinc-700 focus:ring-2 ${theme.primaryRing} transition`}
                />
              </div>

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
