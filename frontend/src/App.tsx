import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Grid, Search, ShoppingCart, Plus, Minus, X, ArrowLeft, Phone, MapPin, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { CartProvider, useCart } from './CartContext';
import type { Product } from './CartContext';

const BACKEND_URL = 'http://localhost:3001';
const API_URL = `${BACKEND_URL}/api/productos`;

// --- ANIMATION VARIANTS ---
const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const slideInRight: Variants = {
  initial: { x: '100%' },
  animate: { x: 0, transition: { type: "spring", damping: 25, stiffness: 200 } },
  exit: { x: '100%', transition: { type: "tween", duration: 0.3 } }
};

const chatBubbleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 10, transformOrigin: "bottom left" },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4, duration: 0.6 } }
};

const chatBubbleUserVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 10, transformOrigin: "bottom right" },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4, duration: 0.6 } }
};

// --- COMPONENTS ---
function SkeletonLoader() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-[52px] max-w-[88%] w-full overflow-hidden pb-4">
      <div className="flex gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="shrink-0 w-64 bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col p-4 animate-pulse">
            <div className="h-32 bg-gray-200 rounded-xl mb-4 w-full"></div>
            <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded-full w-full mb-1"></div>
            <div className="h-3 bg-gray-200 rounded-full w-5/6 mb-4"></div>
            <div className="h-10 bg-teal-50 rounded-xl w-full mt-auto"></div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-3">
      <div className="relative flex w-10 h-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f3f4f6] ring-1 ring-black/5 shadow-sm mb-1">
        <img src="/nexi.png" alt="Nexi" className="w-full h-full object-cover scale-110" />
      </div>
      <div className="bg-white border border-gray-100 rounded-[1.5rem] rounded-bl-sm px-5 py-4 shadow-sm flex items-center gap-1.5">
        <motion.div className="w-2 h-2 bg-gray-300 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }} />
        <motion.div className="w-2 h-2 bg-gray-300 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
        <motion.div className="w-2 h-2 bg-gray-300 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
      </div>
    </motion.div>
  );
}

function Header() {
  const { cart, setIsCartOpen } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/40 glass-panel px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="relative flex w-12 h-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f3f4f6] ring-2 ring-teal-500/50 shadow-md">
          <img src="/nexi.png" alt="Nexi" className="w-full h-full object-cover scale-110" />
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-[15px] font-bold text-brand-ink leading-tight">Nexi Assistant</span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Siempre en línea
          </span>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCartOpen(true)}
        className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white border border-gray-100 premium-shadow text-teal-700 transition-colors hover:border-teal-300"
      >
        <ShoppingCart className="w-5 h-5" />
        <AnimatePresence>
          {cartCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-teal-600 text-white text-[10px] font-bold rounded-full border-2 border-white"
            >
              {cartCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </header>
  );
}

function CartUI() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalEstimado } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-brand-ink/30 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} 
          />
          
          <motion.div 
            variants={slideInRight} initial="initial" animate="animate" exit="exit"
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-heading font-extrabold text-teal-800">Tu Cotización</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
              {cart.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-20 flex flex-col items-center">
                  <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="w-10 h-10 text-teal-300" />
                  </div>
                  <h3 className="font-heading font-bold text-gray-700 text-lg">Tu carrito está vacío</h3>
                  <p className="text-gray-500 text-sm mt-2">Explora nuestros productos y añádelos aquí.</p>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-4">
                  <AnimatePresence>
                    {cart.map(item => (
                      <motion.div 
                        key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
                        className="flex gap-4 p-4 bg-white rounded-3xl border border-gray-100 premium-shadow"
                      >
                        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                          {item.imagen_url ? (
                             <img src={item.imagen_url.startsWith('http') ? item.imagen_url : `${BACKEND_URL}${item.imagen_url}`} alt={item.nombre} className="w-full h-full object-contain mix-blend-multiply p-1" />
                          ) : (
                             <Grid className="w-6 h-6 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col">
                          <h3 className="font-bold text-sm text-brand-ink leading-tight mb-1">{item.nombre}</h3>
                          <p className="text-xs text-gray-500 line-clamp-1 mb-3">{item.descripcion}</p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                              <button onClick={() => updateQuantity(item.id, item.cantidad - 1)} className="w-6 h-6 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-500 hover:text-teal-600"><Minus className="w-3 h-3" /></button>
                              <span className="text-xs font-bold w-6 text-center text-brand-ink">{item.cantidad}</span>
                              <button onClick={() => updateQuantity(item.id, item.cantidad + 1)} className="w-6 h-6 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-500 hover:text-teal-600"><Plus className="w-3 h-3" /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-xs font-bold text-red-500/70 hover:text-red-600 transition-colors">Quitar</button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-10">
              <div className="flex justify-between items-end mb-6">
                <span className="font-medium text-gray-500">Total Estimado</span>
                <div className="text-right">
                  <span className="text-3xl font-heading font-black text-teal-800 tracking-tight">${totalEstimado.toFixed(2)}</span>
                  <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-wider">Precio informativo</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                 <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition-colors">
                    <Phone className="w-5 h-5" /> Contactar a un Asesor
                 </motion.button>
                 <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-teal-50 hover:bg-teal-100 text-teal-800 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <MapPin className="w-5 h-5" /> Visitar Tienda Física
                 </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// --- SCREENS ---
function Screen1Selection() {
  const navigate = useNavigate();
  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" className="min-h-screen nexi-bg flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.3 }} className="mb-8 flex justify-center">
             <img src="/EEPSAlogo.avif" alt="EEPSA" className="h-16 object-contain drop-shadow-md" onError={(e) => (e.currentTarget.style.display = 'none')} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-brand-ink mb-5 font-heading tracking-tight leading-tight">
            Catálogo Interactivo de <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">Equipamiento Óptico</span>
          </h1>
          <p className="text-lg font-medium text-gray-500 max-w-2xl mx-auto">Explora nuestras soluciones y herramientas para redes de fibra óptica. Selecciona tu método de navegación preferido.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          <motion.div 
            whileHover={{ y: -8, scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/assistant')} 
            className="bg-white/80 backdrop-blur-xl border-2 border-white shadow-xl hover:shadow-[0_20px_40px_-15px_rgba(20,184,166,0.3)] hover:border-teal-400 rounded-[2rem] p-8 md:p-10 cursor-pointer group transition-all duration-300 relative overflow-hidden"
          >
            {/* Gradiente sutil que aparece en hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:ring-4 ring-teal-500/30 transition-all shadow-sm overflow-hidden border border-gray-100 group-hover:border-teal-200">
                <img src="/nexi.png" alt="Nexi" className="w-full h-full object-cover scale-110" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-brand-ink font-heading group-hover:text-teal-700 transition-colors">Asesoría con Nexi</h2>
              <p className="text-sm font-medium text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">No estoy seguro de qué necesito. Deja que nuestro asistente virtual te guíe paso a paso para encontrar el producto ideal.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -8, scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/catalog')} 
            className="bg-white/80 backdrop-blur-xl border-2 border-white shadow-xl hover:shadow-[0_20px_40px_-15px_rgba(20,184,166,0.3)] hover:border-teal-400 rounded-[2rem] p-8 md:p-10 cursor-pointer group transition-all duration-300 relative overflow-hidden"
          >
            {/* Gradiente sutil que aparece en hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:ring-4 ring-teal-500/30 transition-all shadow-sm border border-gray-100 group-hover:border-teal-200">
                <Grid className="w-8 h-8 text-teal-600 group-hover:text-teal-500 transition-colors" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-brand-ink font-heading group-hover:text-teal-700 transition-colors">Explorar Catálogo</h2>
              <p className="text-sm font-medium text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">Sé lo que busco. Visualiza todo nuestro inventario, filtra productos y arma tu propia cotización directa.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function Screen2AAssistant() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [messages, setMessages] = useState<{id: number, type: string, text: string}[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Simular escritura de los primeros mensajes al cargar la pantalla
    const loadInitialMessages = async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      setMessages([{ id: 1, type: 'bot', text: '¡Hola! Soy Nexi ✦ Te ayudaré a encontrar el equipo de fibra óptica ideal.' }]);
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      setMessages(prev => [...prev, { id: 2, type: 'bot', text: 'Para empezar, ¿qué tipo de producto estás buscando? Selecciona una categoría.' }]);
      setInitialLoading(false);
    };
    loadInitialMessages();
  }, []);

  const handleCategoryClick = async (category: string) => {
    const categoryMap: Record<string, string> = {
      'Cables': 'cable',
      'Conectores': 'conector',
      'Herrajes': 'herraje',
      'Cajas NAP': 'nap'
    };
    
    const userMsgId = Date.now();
    setMessages(prev => [...prev, { id: userMsgId, type: 'user', text: category }]);
    setLoading(true);
    
    // Simulate slight delay for more natural UX
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const res = await fetch(`${API_URL}?tags=${categoryMap[category]}`);
      const data = await res.json();
      setProducts(data);
      const botMsgId = Date.now() + 1;
      setMessages(prev => [...prev, { id: botMsgId, type: 'bot', text: `¡Excelente! Encontré estas opciones para "${category}".` }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: 'Uy, tuvimos un problema de conexión. ¿Intentamos de nuevo?' }]);
    }
    setLoading(false);
  };

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" className="min-h-screen nexi-bg flex flex-col items-center sm:py-6 sm:px-4">
      <div className="relative flex h-screen w-full max-w-3xl flex-col bg-white sm:h-[calc(100vh-3rem)] sm:max-h-[900px] sm:rounded-[2.5rem] sm:border sm:border-white/60 premium-shadow overflow-hidden">
        <Header />
        
        <div className="p-4 bg-gray-50/80 backdrop-blur-sm border-b border-gray-100 z-20 flex items-center gap-4">
           <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate('/')} className="text-gray-400 hover:text-brand-ink transition-colors bg-white p-2 rounded-full premium-shadow">
             <ArrowLeft className="w-5 h-5" />
           </motion.button>
           <span className="font-heading font-bold text-gray-500 text-sm">Volver al inicio</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 pb-32 hide-scrollbar">
          <div className="flex flex-col gap-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  variants={msg.type === 'bot' ? chatBubbleVariants : chatBubbleUserVariants}
                  initial="hidden" animate="visible"
                  className={`flex items-end gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.type === 'bot' && (
                    <div className="relative flex w-10 h-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f3f4f6] ring-1 ring-black/5 shadow-sm mb-1">
                      <img src="/nexi.png" alt="Nexi" className="w-full h-full object-cover scale-110" />
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-[1.5rem] px-5 py-3.5 text-[15px] font-medium leading-relaxed shadow-sm ${msg.type === 'user' ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-br-sm' : 'bg-white border border-gray-100 text-brand-ink rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {initialLoading && <TypingIndicator />}
            {loading && <SkeletonLoader />}

            {products.length === 0 && !loading && !initialLoading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="ml-[52px] max-w-[88%] w-full">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {['Cables', 'Conectores', 'Herrajes', 'Cajas NAP'].map((cat, idx) => (
                    <motion.button 
                      key={cat} 
                      whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + idx * 0.1 }}
                      onClick={() => handleCategoryClick(cat)} 
                      className="rounded-2xl border-2 border-transparent bg-white p-4 text-sm font-bold text-teal-700 hover:border-teal-100 premium-shadow text-center"
                    >
                      {cat}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {products.length > 0 && !loading && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-[52px] w-full max-w-[88%] overflow-x-auto pb-6 snap-x hide-scrollbar">
                    <div className="flex gap-4">
                       {products.map((p, idx) => (
                          <motion.div 
                            key={p.id} 
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                            className="snap-center shrink-0 w-64 bg-white rounded-3xl border border-gray-100 overflow-hidden premium-shadow flex flex-col group"
                          >
                             <div className="h-40 bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
                                {p.imagen_url ? <img src={p.imagen_url.startsWith('http') ? p.imagen_url : `${BACKEND_URL}${p.imagen_url}`} alt={p.nombre} className="h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" /> : <Grid className="text-gray-300 w-10 h-10" />}
                             </div>
                             <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold font-heading text-brand-ink text-base mb-1.5 leading-tight line-clamp-2">{p.nombre}</h3>
                                <p className="text-[13px] font-medium text-gray-400 mb-4 line-clamp-2">{p.descripcion}</p>
                                
                                <div className="mt-auto flex flex-col gap-2">
                                  {p.optic_times_id && (
                                    <a 
                                      href={`https://optictimes.mx/product?id=${p.optic_times_id}`}
                                      target="_blank" rel="noopener noreferrer"
                                      className="flex items-center justify-center gap-1.5 w-full bg-blue-50/50 hover:bg-blue-100/50 text-blue-600 font-bold py-2 rounded-xl text-xs transition-colors border border-blue-100"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" /> Ficha Técnica
                                    </a>
                                  )}
                                  <motion.button 
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    onClick={() => addToCart(p)} 
                                    className="w-full bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold py-2.5 rounded-xl text-sm transition-colors flex justify-center items-center gap-2"
                                  >
                                     <Plus className="w-4 h-4" /> Agregar
                                  </motion.button>
                                </div>
                             </div>
                          </motion.div>
                       ))}
                    </div>
                 </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Decorative fade for bottom of chat */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
      </div>
    </motion.div>
  );
}

function Screen2BCatalog() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()) || p.descripcion.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-30 px-4 py-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
          <div className="flex items-center gap-4 flex-1">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate('/')} className="text-gray-400 hover:text-brand-ink transition-colors bg-gray-50 p-2 rounded-full">
               <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <h1 className="text-xl font-black font-heading text-brand-ink hidden sm:block tracking-tight">Catálogo</h1>
            <div className="relative flex-1 max-w-lg">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Buscar por nombre o descripción..." 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="w-full pl-11 pr-5 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-4 focus:ring-teal-500/20 bg-gray-50 focus:bg-white text-sm font-medium transition-all"
               />
            </div>
          </div>
          <Header />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
         {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 p-5 h-[340px] animate-pulse">
                  <div className="h-40 bg-gray-100 rounded-2xl mb-5 w-full"></div>
                  <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-100 rounded-full w-full mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded-full w-4/5 mb-6"></div>
                  <div className="h-12 bg-gray-100 rounded-2xl w-full mt-auto"></div>
                </div>
              ))}
            </div>
         ) : (
           <>
             <div className="mb-6 flex items-center justify-between">
               <span className="text-sm font-bold text-gray-500">{filtered.length} productos encontrados</span>
             </div>
             
             <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {filtered.map((p, idx) => (
                     <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2, delay: idx * 0.05 }}
                        key={p.id} 
                        className="bg-white rounded-3xl border border-gray-100 premium-shadow hover:shadow-[0_20px_40px_-15px_rgba(15,118,110,0.15)] transition-all duration-300 overflow-hidden flex flex-col group"
                     >
                        <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
                           {p.imagen_url ? <img src={p.imagen_url.startsWith('http') ? p.imagen_url : `${BACKEND_URL}${p.imagen_url}`} alt={p.nombre} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" /> : <Grid className="w-12 h-12 text-gray-200" />}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                           <h3 className="font-bold font-heading text-brand-ink mb-2 text-[17px] leading-tight line-clamp-2">{p.nombre}</h3>
                           <p className="text-[13px] font-medium text-gray-400 mb-4 line-clamp-2">{p.descripcion}</p>
                           
                           {p.optic_times_id && (
                             <a 
                               href={`https://optictimes.mx/product?id=${p.optic_times_id}`}
                               target="_blank" rel="noopener noreferrer"
                               className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold text-xs mb-4 transition-colors"
                             >
                               <ExternalLink className="w-3.5 h-3.5" /> Ver Ficha Técnica Oficial
                             </a>
                           )}

                           <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Añadir a Cotización</span>
                              <motion.button 
                                whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                                onClick={() => addToCart(p)} 
                                className="bg-brand-ink text-white p-3.5 rounded-2xl shadow-lg shadow-black/10 hover:bg-teal-700 transition-colors"
                              >
                                 <Plus className="w-5 h-5" />
                              </motion.button>
                           </div>
                        </div>
                     </motion.div>
                  ))}
                </AnimatePresence>
             </motion.div>

             {filtered.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-32 flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-brand-ink mb-2">No encontramos resultados</h3>
                  <p className="text-gray-500 font-medium">Intenta buscar con otras palabras o navega con nuestro asistente.</p>
                </motion.div>
             )}
           </>
         )}
      </main>
    </motion.div>
  );
}

function App() {
  return (
    <CartProvider>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Screen1Selection />} />
          <Route path="/assistant" element={<Screen2AAssistant />} />
          <Route path="/catalog" element={<Screen2BCatalog />} />
        </Routes>
      </AnimatePresence>
      <CartUI />
    </CartProvider>
  );
}

export default App;
