import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Grid, Search, ShoppingCart, Plus, Minus, X, ArrowLeft, Phone, MapPin } from 'lucide-react';
import { CartProvider, useCart } from './CartContext';
import type { Product } from './CartContext';

const API_URL = 'http://localhost:3001/api/productos';

// --- Header y Carrito UI ---
function Header() {
  const { cart, setIsCartOpen } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur px-4 py-3 sm:px-5">
      <div className="flex items-center gap-3">
        <div className="relative flex w-12 h-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f3f4f6] ring-2 ring-teal-500/50 shadow-md">
          <img src="/nexi.png" alt="Nexi" className="w-full h-full object-cover scale-110" />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-sm font-semibold text-brand-ink">Nexi</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            EEPSA · en línea
          </span>
        </div>
      </div>
      <button
        onClick={() => setIsCartOpen(true)}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-teal-700 hover:border-teal-500 transition-colors shadow-sm"
      >
        <ShoppingCart className="w-4 h-4" />
        <span>{cartCount}</span>
      </button>
    </header>
  );
}

function CartUI() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalEstimado } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-brand-ink/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      
      {/* Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-heading font-bold text-teal-700">Tu Cotización</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">Tu solicitud está vacía</div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.imagen_url ? (
                       <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                    ) : (
                       <Grid className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-brand-ink">{item.nombre}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{item.descripcion}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, item.cantidad - 1)} className="text-gray-500 hover:text-teal-600"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-semibold w-4 text-center">{item.cantidad}</span>
                        <button onClick={() => updateQuantity(item.id, item.cantidad + 1)} className="text-gray-500 hover:text-teal-600"><Plus className="w-3 h-3" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 font-semibold hover:underline">Quitar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 bg-teal-50 border-t border-teal-100">
          <div className="mb-4 text-center p-3 bg-white/60 rounded-xl text-sm text-teal-800 font-medium">
            Los precios son estimados y de carácter informativo.
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="font-semibold text-gray-600">Total Estimado:</span>
            <span className="text-2xl font-bold text-teal-700">${totalEstimado.toFixed(2)}</span>
          </div>
          
          <div className="flex flex-col gap-3">
             <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 transition-all">
                <Phone className="w-5 h-5" /> Llamar a un asesor
             </button>
             <button className="w-full bg-white hover:bg-gray-50 text-brand-ink border border-gray-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                <MapPin className="w-5 h-5 text-gray-500" /> Ubicar tienda física
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Pantallas ---

function Screen1Selection() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen nexi-bg flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-700 mb-4 font-heading">Catálogo EEPSA</h1>
          <p className="text-lg text-gray-600">¿Cómo prefieres explorar nuestros productos?</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div onClick={() => navigate('/assistant')} className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer border border-white/50 group hover:-translate-y-1">
            <div className="w-20 h-20 bg-[#f3f4f6] rounded-full flex items-center justify-center mb-6 group-hover:ring-4 ring-teal-500/30 transition-all shadow-md overflow-hidden relative">
              <img src="/nexi.png" alt="Nexi" className="w-full h-full object-cover scale-110" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-brand-ink">Ayúdame a elegir</h2>
            <p className="text-gray-600">No estoy seguro de qué necesito. Deja que Nexi, nuestro asistente, te guíe.</p>
          </div>
          <div onClick={() => navigate('/catalog')} className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer border border-white/50 group hover:-translate-y-1">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-100 transition-colors">
              <Grid className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-brand-ink">Explorar el catálogo</h2>
            <p className="text-gray-600">Sé lo que busco. Explora libremente todos los productos y arma tu cotización.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Screen2AAssistant() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [messages, setMessages] = useState([
    { type: 'bot', text: '¡Hola! Soy Nexi, tu asistente en EEPSA. Te ayudo a encontrar el equipo de fibra óptica ideal.' },
    { type: 'bot', text: 'Para empezar, ¿qué tipo de producto buscas? Elige una categoría.' }
  ]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCategoryClick = async (category: string) => {
    setMessages(prev => [...prev, { type: 'user', text: category }]);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?tags=${category.toLowerCase()}`);
      const data = await res.json();
      setProducts(data);
      setMessages(prev => [...prev, { type: 'bot', text: `Encontré estos productos para la categoría "${category}".` }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { type: 'bot', text: 'Ups, hubo un error al buscar los productos.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen nexi-bg flex flex-col items-center sm:py-6">
      <div className="relative flex h-screen w-full max-w-2xl flex-col bg-white sm:h-[calc(100vh-3rem)] sm:max-h-[880px] sm:rounded-3xl sm:border sm:border-white/60 sm:shadow-2xl overflow-hidden">
        <Header />
        
        <div className="p-3 bg-gray-50 border-b border-gray-200">
           <button onClick={() => navigate('/')} className="text-sm font-semibold text-gray-500 hover:text-teal-600 flex items-center gap-1">
             <ArrowLeft className="w-4 h-4" /> Volver al inicio
           </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-5 pb-20">
          <div className="flex flex-col gap-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.type === 'bot' && (
                  <div className="relative flex w-10 h-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f3f4f6] ring-2 ring-teal-500/30 shadow-sm">
                    <img src="/nexi.png" alt="Nexi" className="w-full h-full object-cover scale-110" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.type === 'user' ? 'bg-teal-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-brand-ink rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-sm italic ml-14">
                Nexi está escribiendo...
              </div>
            )}

            {products.length === 0 && !loading && (
              <div className="ml-[52px] max-w-[88%] rounded-2xl bg-gray-50 border border-gray-200 p-4 shadow-sm sm:p-5">
                <div className="grid grid-cols-2 gap-3">
                  {['Cable', 'Conector', 'Herraje', 'Pasivo'].map(cat => (
                    <button key={cat} onClick={() => handleCategoryClick(cat)} className="rounded-xl border border-gray-200 bg-white p-3 text-sm font-semibold text-teal-700 hover:bg-teal-50 transition-colors shadow-sm">
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {products.length > 0 && (
               <div className="ml-[52px] w-full max-w-[88%] overflow-x-auto pb-4 snap-x">
                  <div className="flex gap-4">
                     {products.map(p => (
                        <div key={p.id} className="snap-center shrink-0 w-64 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
                           <div className="h-32 bg-gray-100 flex items-center justify-center">
                              {p.imagen_url ? <img src={p.imagen_url} alt={p.nombre} className="h-full object-cover" /> : <Grid className="text-gray-400" />}
                           </div>
                           <div className="p-4 flex-1 flex flex-col">
                              <h3 className="font-bold text-brand-ink text-sm mb-1 line-clamp-2">{p.nombre}</h3>
                              <p className="text-xs text-gray-500 mb-4 line-clamp-2">{p.descripcion}</p>
                              <button onClick={() => addToCart(p)} className="mt-auto w-full bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold py-2 rounded-xl text-sm transition-colors">
                                 Agregar
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Screen2BCatalog() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const filtered = products.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen nexi-bg flex flex-col">
      <header className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-teal-600">
               <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold font-heading text-teal-700 hidden sm:block">Catálogo</h1>
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Buscar productos..." 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-gray-50 focus:bg-white transition-all"
               />
            </div>
          </div>
          <Header />
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(p => (
               <div key={p.id} className="bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col group">
                  <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-4 relative">
                     {p.imagen_url ? <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" /> : <Grid className="w-12 h-12 text-gray-300" />}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                     <h3 className="font-bold text-brand-ink mb-2">{p.nombre}</h3>
                     <p className="text-sm text-gray-500 mb-4 line-clamp-2">{p.descripcion}</p>
                     <div className="mt-auto flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-400">Cotizar</span>
                        <button onClick={() => addToCart(p)} className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-xl shadow-lg shadow-teal-500/30 transition-all">
                           <Plus className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
         {filtered.length === 0 && (
            <div className="text-center text-gray-500 mt-20">No se encontraron productos.</div>
         )}
      </main>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Screen1Selection />} />
        <Route path="/assistant" element={<Screen2AAssistant />} />
        <Route path="/catalog" element={<Screen2BCatalog />} />
      </Routes>
      <CartUI />
    </CartProvider>
  );
}

export default App;
