import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Headset } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
}

const RESPONSES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['hola', 'buenas', 'buenos', 'hey', 'saludos'],
    reply: '¡Hola! Bienvenido a EliteDrive 👋 ¿En qué puedo ayudarte hoy?',
  },
  {
    keywords: ['precio', 'costo', 'vale', 'cuánto', 'cuanto', 'valor'],
    reply: 'Nuestros vehículos van desde $45,000 hasta $220,000. Puedes explorar el inventario completo con filtros de precio en la sección "Inventario". ¿Tienes algún presupuesto en mente?',
  },
  {
    keywords: ['financiamiento', 'financiar', 'crédito', 'credito', 'cuota', 'mensual', 'plazo'],
    reply: 'Ofrecemos financiamiento flexible a 24, 36, 48 o 60 meses con aprobación en 24h. Puedes usar nuestra calculadora en el detalle de cada vehículo. ¿Te gustaría más información?',
  },
  {
    keywords: ['test drive', 'prueba', 'manejar', 'conducir', 'probar'],
    reply: 'Puedes agendar un test drive directamente desde el detalle de cualquier vehículo. Solo haz clic en "Agendar Test Drive" y elige fecha y hora. ¡Es gratis!',
  },
  {
    keywords: ['vender', 'vendo', 'tasación', 'tasacion', 'mi auto', 'mi carro'],
    reply: 'Compramos tu vehículo al mejor precio del mercado. Ve a la sección "Vender" en la página principal, llena el formulario de tasación y te contactamos en menos de 24 horas.',
  },
  {
    keywords: ['garantía', 'garantia', 'seguro', 'cobertura'],
    reply: 'Todos nuestros vehículos usados incluyen garantía mecánica de 6 meses o 10,000 km. También ofrecemos pólizas todo riesgo para autos de alta gama.',
  },
  {
    keywords: ['mercedes', 'bmw', 'audi', 'porsche', 'tesla', 'land rover', 'marca'],
    reply: 'Manejamos las marcas más exclusivas: Mercedes-Benz, BMW, Audi, Porsche, Land Rover y Tesla. Puedes filtrar por marca en el inventario. ¿Tienes alguna preferencia?',
  },
  {
    keywords: ['suv', 'sedán', 'sedan', 'deportivo', 'coupe', 'tipo', 'carrocería'],
    reply: 'Tenemos SUV, Sedán, Deportivos y Coupe. Usa los filtros de "Carrocería" en el inventario para encontrar exactamente lo que buscas.',
  },
  {
    keywords: ['eléctrico', 'electrico', 'híbrido', 'hibrido', 'gasolina', 'diesel', 'combustible'],
    reply: 'Contamos con vehículos a gasolina, diésel, híbridos y 100% eléctricos. Puedes filtrar por tipo de combustible en el inventario.',
  },
  {
    keywords: ['ubicación', 'ubicacion', 'dirección', 'direccion', 'donde', 'dónde', 'showroom'],
    reply: 'Estamos en Av. El Poblado #10-25, Medellín, Colombia. Abrimos de lunes a sábado de 9am a 7pm.',
  },
  {
    keywords: ['teléfono', 'telefono', 'llamar', 'contacto', 'whatsapp', 'número', 'numero'],
    reply: 'Puedes contactarnos al +57 (300) 123-4567 o escribirnos a info@elitedrive.com. También puedes usar el formulario de contacto en la página principal.',
  },
  {
    keywords: ['horario', 'hora', 'abierto', 'abren', 'cierran'],
    reply: 'Nuestro showroom está abierto de lunes a sábado de 9:00am a 7:00pm. Los domingos atendemos con cita previa.',
  },
  {
    keywords: ['gracias', 'perfecto', 'excelente', 'genial', 'listo', 'ok', 'okay'],
    reply: '¡Con gusto! Si tienes más preguntas, aquí estaré. ¿Hay algo más en lo que pueda ayudarte?',
  },
  {
    keywords: ['adios', 'adiós', 'bye', 'chao', 'hasta luego'],
    reply: '¡Hasta luego! Fue un placer atenderte. Recuerda que puedes visitarnos en el showroom cuando quieras 🚗',
  },
];

const DEFAULT_REPLY =
  'Entiendo tu consulta. Para darte la mejor atención, te recomiendo contactarnos directamente al +57 (300) 123-4567 o usar el formulario de contacto. ¿Puedo ayudarte con algo más?';

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  for (const { keywords, reply } of RESPONSES) {
    if (keywords.some((kw) => lower.includes(kw))) return reply;
  }
  return DEFAULT_REPLY;
}

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: getBotReply(userMsg.text),
          sender: 'agent',
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 sm:mb-6 w-[calc(100vw-2rem)] sm:w-[380px] h-[70vh] sm:h-[500px] max-h-[550px] glass-card flex flex-col shadow-2xl overflow-hidden border-brand-blue/20"
          >
            <div className="p-6 bg-brand-blue flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Headset className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Soporte EliteDrive</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-[10px] text-white/70 uppercase font-bold tracking-widest">En línea</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-brand-dark/40 no-scrollbar">
              {messages.length === 0 && (
                <div className="text-center py-10 space-y-4">
                  <MessageCircle className="w-12 h-12 text-white/5 mx-auto" />
                  <p className="text-white/40 text-sm">¿En qué podemos ayudarte hoy?</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {['Precios', 'Financiamiento', 'Test Drive', 'Vender mi auto'].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          const msg = { id: Date.now().toString(), text: q, sender: 'user' as const, timestamp: new Date().toISOString() };
                          setMessages([msg]);
                          setIsTyping(true);
                          setTimeout(() => {
                            setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), text: getBotReply(q), sender: 'agent', timestamp: new Date().toISOString() }]);
                            setIsTyping(false);
                          }, 900);
                        }}
                        className="text-xs bg-brand-blue/20 border border-brand-blue/30 text-brand-blue px-3 py-1.5 rounded-full hover:bg-brand-blue/30 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-brand-blue text-white rounded-tr-none'
                      : 'bg-brand-gray text-white/80 rounded-tl-none border border-white/5'
                  }`}>
                    <p>{msg.text}</p>
                    <span className="text-[10px] opacity-40 mt-2 block">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-brand-gray border border-white/5 rounded-2xl rounded-tl-none px-5 py-4 flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0ms]"></span>
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:150ms]"></span>
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:300ms]"></span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-brand-gray/50 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isTyping}
                className="flex-1 bg-brand-dark/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-blue transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!message.trim() || isTyping}
                className="p-2 bg-brand-blue text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
          isOpen ? 'bg-brand-gray rotate-90' : 'bg-brand-blue'
        }`}
      >
        {isOpen ? <X className="w-8 h-8 text-white" /> : <MessageCircle className="w-8 h-8 text-white" />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-brand-dark rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default LiveChat;
