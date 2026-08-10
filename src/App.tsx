import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { Search, ChevronDown, Filter, Car as CarIcon, Info, Calculator, ArrowRight, X, Camera, Calendar, DollarSign, Settings, Heart, CheckCircle2, Mail, Phone, Star, MapPin, Users, Award, Menu, Upload, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Slider from '@radix-ui/react-slider';
import { CARS, BLOG_POSTS } from './constants';
import { Car, Filters, BlogPost } from './types';
import LiveChat from './components/LiveChat';

// --- Components ---

const Navbar = ({ favoritesCount, onSearch }: { favoritesCount: number, onSearch: (term: string) => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const goToSection = (id: string) => {
    setMenuOpen(false);
    if (!isHome) {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    onSearch(searchTerm);
    navigate('/inventory');
    setSearchTerm('');
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/95 backdrop-blur-lg border-b border-white/10">
      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-blue rounded-lg flex items-center justify-center">
            <CarIcon className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tighter">ELITE<span className="text-brand-blue">DRIVE</span></span>
        </Link>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-sm relative">
          <input type="text" placeholder="Buscar marca o modelo..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-blue/50 transition-colors"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        </form>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-white/70">
          <Link to="/" className={`hover:text-brand-blue transition-colors ${isHome ? 'text-brand-blue' : ''}`}>Inicio</Link>
          <Link to="/inventory" className={`hover:text-brand-blue transition-colors ${location.pathname === '/inventory' ? 'text-brand-blue' : ''}`}>Inventario</Link>
          <button onClick={() => goToSection('nosotros')} className="hover:text-brand-blue transition-colors">Nosotros</button>
          <button onClick={() => goToSection('servicios')} className="hover:text-brand-blue transition-colors">Servicios</button>
          <button onClick={() => goToSection('vender')} className="hover:text-brand-blue transition-colors">Vender</button>
          <button onClick={() => goToSection('contacto')} className="hover:text-brand-blue transition-colors">Contacto</button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/favorites" className="relative">
            <Heart className={`w-6 h-6 transition-colors ${favoritesCount > 0 ? 'text-red-500 fill-red-500' : 'text-white/50 hover:text-white/80'}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-blue text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-dark">
                {favoritesCount}
              </span>
            )}
          </Link>
          <button onClick={() => goToSection('contacto')} className="hidden md:block btn-primary py-2 px-5 text-sm">Contáctanos</button>
          {/* Hamburger - only on mobile */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Menú"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-brand-dark">
          {/* Mobile search */}
          <div className="px-4 pt-4">
            <form onSubmit={handleSearch} className="relative">
              <input type="text" placeholder="Buscar marca o modelo..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-blue/50"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            </form>
          </div>
          {/* Nav links */}
          <div className="px-2 py-3 flex flex-col">
            <Link to="/" onClick={() => setMenuOpen(false)}
              className="flex items-center px-4 py-3.5 rounded-xl text-white/80 hover:bg-white/5 hover:text-brand-blue font-medium transition-colors">
              Inicio
            </Link>
            <Link to="/inventory" onClick={() => setMenuOpen(false)}
              className="flex items-center px-4 py-3.5 rounded-xl text-white/80 hover:bg-white/5 hover:text-brand-blue font-medium transition-colors">
              Inventario
            </Link>
            <Link to="/marketplace" onClick={() => setMenuOpen(false)}
              className="flex items-center px-4 py-3.5 rounded-xl text-white/80 hover:bg-white/5 hover:text-brand-blue font-medium transition-colors">
              Marketplace
            </Link>
            <Link to="/favorites" onClick={() => setMenuOpen(false)}
              className="flex items-center px-4 py-3.5 rounded-xl text-white/80 hover:bg-white/5 hover:text-brand-blue font-medium transition-colors">
              Mis Favoritos {favoritesCount > 0 && <span className="ml-2 bg-brand-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{favoritesCount}</span>}
            </Link>
            <button onClick={() => goToSection('nosotros')}
              className="flex items-center px-4 py-3.5 rounded-xl text-white/80 hover:bg-white/5 hover:text-brand-blue font-medium transition-colors text-left w-full">
              Nosotros
            </button>
            <button onClick={() => goToSection('servicios')}
              className="flex items-center px-4 py-3.5 rounded-xl text-white/80 hover:bg-white/5 hover:text-brand-blue font-medium transition-colors text-left w-full">
              Servicios
            </button>
            <button onClick={() => goToSection('vender')}
              className="flex items-center px-4 py-3.5 rounded-xl text-white/80 hover:bg-white/5 hover:text-brand-blue font-medium transition-colors text-left w-full">
              Vender mi auto
            </button>
            <button onClick={() => goToSection('blog')}
              className="flex items-center px-4 py-3.5 rounded-xl text-white/80 hover:bg-white/5 hover:text-brand-blue font-medium transition-colors text-left w-full">
              Blog
            </button>
            <button onClick={() => goToSection('contacto')}
              className="flex items-center px-4 py-3.5 rounded-xl text-white/80 hover:bg-white/5 hover:text-brand-blue font-medium transition-colors text-left w-full">
              Contacto
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ onSearch, filters, onFilterChange }: { 
  onSearch: () => void, 
  filters: Filters, 
  onFilterChange: (newFilters: Filters) => void 
}) => {
  const featuredCar = CARS.find(c => c.featured) || CARS[0];

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Car Background" 
          className="w-full h-full object-cover opacity-30"
          
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/20 via-brand-dark/60 to-brand-dark"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-blue font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 block">Experiencia EliteDrive</span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 tracking-tighter">
              Tu Próximo <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">Auto de Lujo</span>
            </h1>
            <p className="text-base sm:text-xl text-white/60 mb-8 leading-relaxed max-w-lg">
              Explora la colección más exclusiva de vehículos premium.
              Calidad certificada, financiamiento inmediato y entrega a domicilio.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/inventory" className="btn-primary py-3 px-6 sm:py-4 sm:px-8 text-base sm:text-lg">Explorar Inventario</Link>
              <button onClick={() => {
                const element = document.getElementById('showroom');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }} className="glass-card py-3 px-6 sm:py-4 sm:px-8 text-base sm:text-lg hover:bg-white/5 transition-colors">Ver Recién Llegados</button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="absolute -inset-4 bg-brand-blue/20 blur-3xl rounded-full"></div>
            <div className="relative glass-card p-4 rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src={featuredCar.image} 
                alt="Featured Car" 
                className="rounded-xl shadow-2xl w-full h-[400px] object-cover"
                
              />
              <div className="absolute bottom-8 left-8 right-8 glass-card p-6 backdrop-blur-xl border-white/20">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-brand-blue font-bold text-xs uppercase tracking-widest mb-1 block">Destacado de la Semana</span>
                    <h3 className="text-2xl font-bold">{featuredCar.brand} {featuredCar.model}</h3>
                    <p className="text-white/60 text-sm">{featuredCar.year} • {featuredCar.engine}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-brand-blue font-bold text-2xl">${featuredCar.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="glass-card p-4 sm:p-6 md:p-8 mt-8 sm:mt-16 border-brand-blue/20 shadow-[0_0_30px_rgba(0,102,255,0.1)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Marca</label>
              <div className="relative">
                <select 
                  className="input-field w-full appearance-none"
                  value={filters.brand}
                  onChange={(e) => onFilterChange({ ...filters, brand: e.target.value })}
                >
                  <option value="">Todas las marcas</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="BMW">BMW</option>
                  <option value="Audi">Audi</option>
                  <option value="Porsche">Porsche</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Modelo</label>
              <input 
                type="text" 
                placeholder="Ej: M4" 
                className="input-field w-full" 
                value={filters.model}
                onChange={(e) => onFilterChange({ ...filters, model: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Precio Máx.</label>
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="150,000" 
                  className="input-field w-full" 
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value === '' ? '' : Number(e.target.value) })}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Año</label>
              <div className="relative">
                <select 
                  className="input-field w-full appearance-none"
                  value={filters.year}
                  onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
                >
                  <option value="">Cualquier año</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-end">
              <button 
                onClick={onSearch}
                className="btn-primary w-full flex items-center justify-center gap-2 h-[50px]"
              >
                <Search className="w-5 h-5" />
                <span>Buscar Auto</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

interface CarCardProps {
  car: Car;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: any) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onClick, isFavorite, onToggleFavorite }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass-card overflow-hidden group cursor-pointer relative"
    onClick={onClick}
  >
    <button 
      onClick={onToggleFavorite}
      className="absolute top-4 right-4 z-20 p-2 rounded-full bg-brand-dark/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
    >
      <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white/60'}`} />
    </button>

    <div className="relative h-64 overflow-hidden">
      <img 
        src={car.image} 
        alt={`${car.brand} ${car.model}`} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <div className="bg-brand-blue text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          {car.category}
        </div>
        {car.featured && (
          <div className="bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3 fill-white" />
            Destacado
          </div>
        )}
        {car.year >= 2024 && (
          <div className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            Nuevo
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
        <span className="text-white font-bold flex items-center gap-2 bg-brand-blue/80 backdrop-blur-md px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          Ver detalles <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1 group-hover:text-brand-blue transition-colors">{car.brand} {car.model}</h3>
          <p className="text-white/40 text-sm">{car.year} • {car.transmission}</p>
        </div>
        <div className="text-right">
          <p className="text-brand-blue font-bold text-2xl">${car.price.toLocaleString()}</p>
          <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Entrega Inmediata</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-white/60 text-xs">
          <Settings className="w-4 h-4 text-brand-blue" />
          <span>{car.engine}</span>
        </div>
        <div className="flex items-center gap-2 text-white/60 text-xs">
          <Info className="w-4 h-4 text-brand-blue" />
          <span>{car.mileage.toLocaleString()} km</span>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Disponible</span>
        </div>
        <button className="text-brand-blue text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
          Financiar <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  </motion.div>
);

const CarCardSkeleton = () => (
  <div className="glass-card overflow-hidden animate-pulse">
    <div className="h-64 bg-white/5" />
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-6 w-40 bg-white/10 rounded" />
          <div className="h-4 w-24 bg-white/10 rounded" />
        </div>
        <div className="text-right space-y-2">
          <div className="h-8 w-24 bg-white/10 rounded ml-auto" />
          <div className="h-3 w-16 bg-white/10 rounded ml-auto" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
        <div className="h-4 bg-white/5 rounded" />
        <div className="h-4 bg-white/5 rounded" />
      </div>
      <div className="flex justify-between items-center pt-4">
        <div className="h-4 w-20 bg-white/5 rounded" />
        <div className="h-4 w-16 bg-white/5 rounded" />
      </div>
    </div>
  </div>
);

const SpecsAccordion = ({ car }: { car: Car }) => {
  const [open, setOpen] = useState<string | null>(null);

  const sections = [
    {
      id: 'general',
      label: 'Información General',
      rows: [
        ['Color', car.color],
        ['Carrocería', car.bodyType],
        ['Versión', car.version],
        ['Capacidad', car.capacity ? `${car.capacity} personas` : null],
        ['Dirección', car.steering],
        ['Último dígito placa', car.plateLastDigit],
        ['Paridad placa', car.plateType],
      ],
    },
    {
      id: 'seguridad',
      label: 'Seguridad',
      bools: [
        ['Frenos ABS', car.abs],
        ['Airbag conductor', car.airbagDriver],
        ['Airbag pasajero', car.airbagPassenger],
        ['Control de estabilidad', car.stabilityControl],
        ['Sensor de parqueo', car.parkingSensor],
        ['Cámara de reversa', car.reverseCamera],
        ['Luces automáticas', car.automaticLights],
        ['Faros antiniebla traseros', car.rearFogLights],
        ['Desempañador trasero', car.rearDefogger],
        ['Cierre centralizado', car.centralLocking],
        ['3ra luz de freno LED', car.thirdBrakeLightLed],
        ['Alarma', car.alarm],
      ],
    },
    {
      id: 'confort',
      label: 'Confort y Conveniencia',
      bools: [
        ['Piloto automático', car.autopilot],
        ['Aire acondicionado', car.airConditioning],
        ['Vidrios eléctricos', car.electricWindows],
        ['Sensor de lluvia', car.rainSensor],
        ['Controles en volante', car.steeringWheelControls],
        ['Computadora de abordo', car.boardComputer],
        ['Cierre automático vidrios', car.autoWindowClose],
        ['Alerta luces encendidas', car.lightsOnAlert],
        ['Porta vasos', car.cupHolder],
      ],
    },
    {
      id: 'entretenimiento',
      label: 'Entretenimiento e Interior',
      bools: [
        ['Techo corredizo', car.sunroof],
        ['Tapizado de cuero', car.leatherSeats],
        ['Llantas de aleación', car.alloyWheels],
        ['Bluetooth', car.bluetooth],
        ['Entrada USB', car.usbInput],
        ['Entrada auxiliar', car.auxInput],
        ['AM/FM', car.amFm],
        ['Reproductor MP3', car.mp3],
      ],
    },
    {
      id: 'compra',
      label: 'Condiciones de Compra',
      bools: [
        ['Precio negociable', car.negotiable],
        ['Acepta permuta', car.acceptsTrade],
      ],
    },
  ];

  return (
    <div className="space-y-2 pt-2 border-t border-white/5">
      <p className="text-xs text-white/30 uppercase font-bold tracking-widest mb-3">Especificaciones completas</p>
      {sections.map(({ id, label, rows, bools }) => (
        <div key={id} className="glass-card border-white/5 overflow-hidden">
          <button
            onClick={() => setOpen(open === id ? null : id)}
            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors"
          >
            <span className="text-sm font-bold">{label}</span>
            <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-300 ${open === id ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence initial={false}>
            {open === id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm border-t border-white/5 pt-3">
                  {rows?.filter(([, v]) => v != null).map(([label, value]) => (
                    <div key={label as string} className="flex justify-between gap-2 py-1 border-b border-white/5">
                      <span className="text-white/40 text-xs">{label}</span>
                      <span className="font-semibold text-xs text-right">{value as string}</span>
                    </div>
                  ))}
                  {bools?.filter(([, v]) => v != null).map(([label, value]) => (
                    <div key={label as string} className="flex justify-between gap-2 py-1 border-b border-white/5">
                      <span className="text-white/40 text-xs">{label}</span>
                      <span className={`font-bold text-xs ${value ? 'text-green-400' : 'text-white/20'}`}>{value ? 'Sí' : 'No'}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

const ImageZoomViewer = ({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) => {
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.min(4, Math.max(1, z - e.deltaY * 0.001)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setDragging(true);
    setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleDoubleClick = () => {
    if (zoom > 1) { setZoom(1); setPos({ x: 0, y: 0 }); }
    else setZoom(2.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10">
        <X className="w-6 h-6" />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 z-10">
        <button onClick={() => { setZoom(z => Math.max(1, z - 0.5)); if (zoom <= 1.5) setPos({ x: 0, y: 0 }); }} className="text-white/60 hover:text-white text-lg font-bold w-8 h-8 flex items-center justify-center">−</button>
        <span className="text-white text-sm font-bold w-12 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(4, z + 0.5))} className="text-white/60 hover:text-white text-lg font-bold w-8 h-8 flex items-center justify-center">+</button>
        <div className="w-px h-4 bg-white/20" />
        <button onClick={() => { setZoom(1); setPos({ x: 0, y: 0 }); }} className="text-white/60 hover:text-white text-xs font-bold">Reset</button>
      </div>
      <p className="absolute top-6 left-1/2 -translate-x-1/2 text-white/30 text-xs">Doble click para zoom • Scroll para acercar • Arrastra para mover</p>
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onDoubleClick={handleDoubleClick}
        style={{ cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{ transform: `scale(${zoom}) translate(${pos.x / zoom}px, ${pos.y / zoom}px)`, transition: dragging ? 'none' : 'transform 0.2s ease', maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
        />
      </div>
    </motion.div>
  );
};

const VehicleDetail = ({ car, onClose, onBookTestDrive, onFinanceRequest }: { car: Car, onClose: () => void, onBookTestDrive: () => void, onFinanceRequest: () => void }) => {
  const [downPayment, setDownPayment] = useState(car.price * 0.2);
  const [months, setMonths] = useState(48);
  const [isBooking, setIsBooking] = useState(false);
  const [activeImage, setActiveImage] = useState(car.image);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [sendingTestDrive, setSendingTestDrive] = useState(false);
  const [sendingFinance, setSendingFinance] = useState(false);
  const testDriveFormRef = useRef<HTMLFormElement>(null);
  const interestRate = 0.08;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const allImages = car.images && car.images.length > 0 ? car.images : [car.image];
  const monthlyPayment = ((car.price - downPayment) * (interestRate / 12)) / (1 - Math.pow(1 + interestRate / 12, -months));

  const goTo = (idx: number) => {
    const i = (idx + allImages.length) % allImages.length;
    setActiveIndex(i);
    setActiveImage(allImages[i]);
  };

  const handleTestDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testDriveFormRef.current) return;
    setSendingTestDrive(true);
    try {
      await emailjs.sendForm(
        'YOUR_SERVICE_ID', 'YOUR_TESTDRIVE_TEMPLATE_ID',
        testDriveFormRef.current, 'YOUR_PUBLIC_KEY'
      );
      setIsBooking(false);
      onBookTestDrive();
    } catch {
      onBookTestDrive();
      setIsBooking(false);
    } finally {
      setSendingTestDrive(false);
    }
  };

  const handleFinanceRequest = async () => {
    setSendingFinance(true);
    try {
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_FINANCE_TEMPLATE_ID', {
        car_name: `${car.brand} ${car.model} ${car.year}`,
        car_price: car.price.toLocaleString(),
        down_payment: downPayment.toLocaleString(),
        months,
        monthly_payment: Math.round(monthlyPayment).toLocaleString(),
      }, 'YOUR_PUBLIC_KEY');
    } catch { /* silent */ } finally {
      setSendingFinance(false);
      onFinanceRequest();
    }
  };

  return (
    <>
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-brand-dark/95 backdrop-blur-xl overflow-y-auto"
    >
      <div className="max-w-6xl w-full mx-auto my-4 sm:my-8 glass-card overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Gallery */}
          <div className="flex flex-col bg-brand-gray/20">
            <div className="h-[260px] sm:h-[380px] lg:h-[500px] relative group overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  src={activeImage} 
                  alt={car.model} 
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setZoomImage(activeImage)}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-60 pointer-events-none"></div>
              {/* Zoom hint */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white/60 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Search className="w-3 h-3" /> Click para ampliar
              </div>
              {/* Nav arrows */}
              {allImages.length > 1 && (
                <>
                  <button onClick={() => goTo(activeIndex - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-brand-blue backdrop-blur-md rounded-full transition-colors">
                    <ChevronDown className="w-5 h-5 rotate-90" />
                  </button>
                  <button onClick={() => goTo(activeIndex + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-brand-blue backdrop-blur-md rounded-full transition-colors">
                    <ChevronDown className="w-5 h-5 -rotate-90" />
                  </button>
                </>
              )}
              {/* Counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)} className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-brand-blue w-4' : 'bg-white/30'}`} />
                  ))}
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="p-4 flex gap-3 overflow-x-auto no-scrollbar">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => goTo(idx)}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${activeIndex === idx ? 'border-brand-blue scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`${car.model} ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-5 sm:p-8 lg:p-12 space-y-6 lg:max-h-[90vh] lg:overflow-y-auto">
            <div>
              <span className="text-brand-blue font-bold uppercase tracking-widest text-xs mb-2 block">{car.brand}</span>
              <h2 className="text-4xl font-bold mb-1">{car.model}</h2>
              {car.version && <p className="text-white/40 text-sm mb-4">{car.version}</p>}
              <p className="text-white/60 leading-relaxed">{car.description}</p>
            </div>

            {/* Especificaciones básicas */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Año', value: car.year },
                { label: 'Kilometraje', value: `${car.mileage.toLocaleString()} km` },
                { label: 'Motor', value: car.engine },
                { label: 'Transmisión', value: car.transmission },
                { label: 'Combustible', value: car.fuelType },
                { label: 'Potencia', value: car.power },
                { label: 'Tracción', value: car.traction },
                { label: 'Puertas', value: car.doors },
              ].filter(i => i.value != null).map(({ label, value }) => (
                <div key={label} className="glass-card p-3 border-white/5">
                  <p className="text-white/40 text-[10px] uppercase font-bold mb-1">{label}</p>
                  <p className="font-semibold text-sm">{value as string}</p>
                </div>
              ))}
            </div>

            {/* Condiciones rápidas */}
            <div className="flex gap-3">
              {car.negotiable && (
                <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full">Precio negociable</span>
              )}
              {car.acceptsTrade && (
                <span className="bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-bold px-3 py-1.5 rounded-full">Acepta permuta</span>
              )}
              {car.reverseCamera && (
                <span className="bg-white/5 border border-white/10 text-white/60 text-xs font-bold px-3 py-1.5 rounded-full">Cámara reversa</span>
              )}
            </div>

            {/* Acordeón especificaciones completas */}
            <SpecsAccordion car={car} />

            {/* Financing Calculator */}
            <div className="pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-brand-blue" />
                <h3 className="text-xl font-bold">Calculadora de Financiamiento</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Pago Inicial</span>
                    <span className="text-brand-blue font-bold">${downPayment.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={car.price * 0.8} 
                    step={1000}
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full accent-brand-blue"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Plazo (Meses)</span>
                    <span className="text-brand-blue font-bold">{months} meses</span>
                  </div>
                  <div className="flex gap-2">
                    {[24, 36, 48, 60].map(m => (
                      <button 
                        key={m}
                        onClick={() => setMonths(m)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${months === m ? 'bg-brand-blue text-white' : 'bg-brand-gray text-white/40 hover:bg-white/5'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-brand-blue/10 p-6 rounded-2xl border border-brand-blue/20 flex justify-between items-center">
                  <div>
                    <p className="text-white/60 text-xs uppercase font-bold mb-1">Cuota Mensual Est.</p>
                    <p className="text-3xl font-bold text-brand-blue">${Math.round(monthlyPayment).toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={handleFinanceRequest}
                    disabled={sendingFinance}
                    className="btn-primary py-3 px-6 disabled:opacity-60"
                  >
                    {sendingFinance ? 'Enviando...' : 'Solicitar'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button 
                onClick={() => setIsBooking(true)}
                className="btn-primary flex-1 py-4 flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Agendar Test Drive
              </button>
              <button 
                onClick={() => {
                  const msg = encodeURIComponent(`Hola, estoy interesado en el ${car.brand} ${car.model} ${car.year} que vi en EliteDrive. ¿Podrían darme más información?`);
                  window.open(`https://wa.me/573123658104?text=${msg}`, '_blank');
                }}
                className="flex-1 py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Hablar con Asesor
              </button>
            </div>
          </div>
        </div>

        {/* Test Drive Modal */}
        <AnimatePresence>
          {isBooking && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-md"
            >
              <div className="max-w-md w-full glass-card p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">Agendar Test Drive</h3>
                  <button onClick={() => setIsBooking(false)} className="p-2 hover:bg-white/5 rounded-full">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-white/60 text-sm">Estás a un paso de conducir tu próximo {car.brand} {car.model}.</p>
                
                <form ref={testDriveFormRef} className="space-y-4" onSubmit={handleTestDriveSubmit}>
                  <input type="hidden" name="car_name" value={`${car.brand} ${car.model} ${car.year}`} />
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Nombre Completo</label>
                    <input type="text" name="from_name" required className="input-field w-full" placeholder="Ej: Juan Pérez" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email</label>
                      <input type="email" name="from_email" required className="input-field w-full" placeholder="juan@ejemplo.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Teléfono</label>
                      <input type="tel" name="phone" required className="input-field w-full" placeholder="+57 300..." />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Fecha</label>
                      <input type="date" name="date" required className="input-field w-full" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Hora</label>
                      <input type="time" name="time" required className="input-field w-full" />
                    </div>
                  </div>
                  <button type="submit" disabled={sendingTestDrive} className="btn-primary w-full py-4 mt-4 disabled:opacity-60">
                    {sendingTestDrive ? 'Enviando...' : 'Confirmar Reserva'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>

    <AnimatePresence>
      {zoomImage && <ImageZoomViewer src={zoomImage} alt={car.model} onClose={() => setZoomImage(null)} />}
    </AnimatePresence>
    </>
  );
};

const AboutUs = () => {
  const values = [
    { title: "Integridad", description: "Transparencia absoluta en cada transacción y peritaje." },
    { title: "Exclusividad", description: "Curaduría experta de los vehículos más deseados del mundo." },
    { title: "Pasión", description: "Amamos los motores y compartimos esa emoción con cada cliente." }
  ];

  return (
    <section id="nosotros" className="py-16 sm:py-24 bg-brand-gray/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-blue font-bold uppercase tracking-widest text-sm mb-4 block">Nuestra Historia</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">Más de 15 años <br /> <span className="text-brand-blue">Redefiniendo el Lujo</span></h2>
            <p className="text-white/60 text-lg mb-6 leading-relaxed">
              Fundada en 2009, EliteDrive nació con la visión de transformar la compra de vehículos de alta gama en una experiencia de estilo de vida. Lo que comenzó como un pequeño showroom en Medellín se ha convertido en el referente nacional de exclusividad automotriz.
            </p>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              Nuestra misión es conectar a entusiastas con máquinas extraordinarias, garantizando que cada kilómetro recorrido sea un testimonio de nuestra dedicación a la excelencia.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-bold text-brand-blue">{value.title}</h4>
                  <p className="text-white/40 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative mt-8 lg:mt-0"
          >
            <div className="aspect-square rounded-3xl overflow-hidden relative z-10 max-h-[400px] sm:max-h-none">
              <img
                src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1000"
                alt="Showroom EliteDrive"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-6 -right-6 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl -z-0"></div>
            <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-0"></div>
            
            <div className="absolute -bottom-10 -right-10 glass-card p-8 z-20 hidden md:block">
              <div className="text-4xl font-bold text-brand-blue mb-1">2009</div>
              <div className="text-white/60 text-sm font-bold uppercase tracking-widest">Año de Fundación</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Award className="w-8 h-8 text-brand-blue" />,
      title: "Calidad Garantizada",
      description: "Cada vehículo pasa por una inspección rigurosa de 150 puntos para asegurar su estado óptimo."
    },
    {
      icon: <DollarSign className="w-8 h-8 text-brand-blue" />,
      title: "Financiamiento Flexible",
      description: "Planes a medida con las mejores tasas del mercado para que conduzcas el auto de tus sueños."
    },
    {
      icon: <Users className="w-8 h-8 text-brand-blue" />,
      title: "Servicio Post-Venta",
      description: "Acompañamiento continuo y mantenimiento especializado para tu tranquilidad absoluta."
    }
  ];

  return (
    <section className="py-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-brand-blue font-bold uppercase tracking-widest text-sm mb-4 block">Por qué elegirnos</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">La Experiencia <span className="text-brand-blue">EliteDrive</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-10 text-center hover:border-brand-blue/30 transition-colors"
            >
              <div className="mb-6 flex justify-center">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      name: "Andrés Mendoza",
      role: "Empresario",
      content: "La atención fue excepcional. Compré mi Porsche 911 y el proceso fue transparente y rápido. Totalmente recomendados.",
      avatar: "https://i.pravatar.cc/150?u=andres"
    },
    {
      name: "Valentina Ortiz",
      role: "Arquitecta",
      content: "Buscaba un SUV seguro y elegante. En EliteDrive encontré la asesoría perfecta y un financiamiento que se ajustó a mi presupuesto.",
      avatar: "https://i.pravatar.cc/150?u=valentina"
    },
    {
      name: "Carlos Ruiz",
      role: "Coleccionista",
      content: "He comprado varios vehículos aquí. La calidad del inventario es insuperable en el país. Son verdaderos expertos en lujo.",
      avatar: "https://i.pravatar.cc/150?u=carlos"
    }
  ];

  return (
    <section className="py-24 bg-brand-gray/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-brand-blue font-bold uppercase tracking-widest text-sm mb-4 block">Testimonios</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Lo que dicen nuestros <span className="text-brand-blue">Clientes</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((review, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 relative"
            >
              <div className="flex items-center gap-4 mb-6">
                <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full border-2 border-brand-blue" />
                <div>
                  <h4 className="font-bold">{review.name}</h4>
                  <p className="text-white/40 text-xs">{review.role}</p>
                </div>
              </div>
              <p className="text-white/70 italic leading-relaxed">"{review.content}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch('https://formsubmit.co/estabngranadosbotia16@gmail.com', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        setSent(true);
        form.reset();
        setTimeout(() => setSent(false), 5000);
      }
    } catch { /* silent */ }
  };

  return (
    <section id="contacto" className="py-16 sm:py-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <span className="text-brand-blue font-bold uppercase tracking-widest text-sm mb-4 block">Contacto</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">¿Tienes alguna <span className="text-brand-blue">Pregunta?</span></h2>
            <p className="text-white/60 text-lg mb-12 leading-relaxed">
              Estamos aquí para ayudarte a encontrar el vehículo perfecto. Visítanos en nuestro showroom o contáctanos por cualquiera de nuestros canales.
            </p>
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Email</h4>
                  <p className="text-white/60">info@elitedrive.com</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Teléfono</h4>
                  <p className="text-white/60">+57 (300) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                  <Settings className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Ubicación</h4>
                  <p className="text-white/60">Av. El Poblado #10-25, Medellín, Colombia</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 sm:p-10">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-16 text-center space-y-6">
                  <div className="w-20 h-20 bg-brand-blue/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-brand-blue" />
                  </div>
                  <h3 className="text-2xl font-bold">¡Mensaje Enviado!</h3>
                  <p className="text-white/60">Te responderemos en menos de 24 horas.</p>
                </motion.div>
              ) : (
                <motion.form key="form" className="space-y-6" onSubmit={handleSubmit}>
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_subject" value="Nuevo mensaje desde EliteDrive" />
                  <input type="hidden" name="_template" value="table" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Nombre</label>
                      <input type="text" name="nombre" required className="input-field w-full" placeholder="Tu nombre" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Email</label>
                      <input type="email" name="email" required className="input-field w-full" placeholder="tu@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase">Asunto</label>
                    <select name="asunto" className="input-field w-full appearance-none">
                      <option>Interés en un vehículo</option>
                      <option>Financiamiento</option>
                      <option>Vender mi auto</option>
                      <option>Otro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase">Mensaje</label>
                    <textarea name="mensaje" required className="input-field w-full h-32 resize-none" placeholder="¿En qué podemos ayudarte?"></textarea>
                  </div>
                  <button type="submit" className="btn-primary w-full py-4 font-bold">
                    Enviar Mensaje
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { label: "Autos Entregados", value: "3,200+", icon: <CarIcon className="w-6 h-6" /> },
    { label: "Clientes Felices", value: "2,800+", icon: <Users className="w-6 h-6" /> },
    { label: "Años en el Mercado", value: "18+", icon: <Calendar className="w-6 h-6" /> },
    { label: "Garantía Total", value: "100%", icon: <Award className="w-6 h-6" /> }
  ];

  return (
    <section className="py-20 bg-brand-blue relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center flex flex-col items-center group"
            >
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                {stat.icon}
              </div>
              <div className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-2 tracking-tighter">{stat.value}</div>
              <div className="text-white/60 text-xs uppercase tracking-widest font-bold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      title: "Financiamiento Premium",
      description: "Asesoría personalizada para obtener las mejores tasas de interés con bancos aliados.",
      icon: <DollarSign className="w-6 h-6" />
    },
    {
      title: "Seguros de Lujo",
      description: "Pólizas todo riesgo diseñadas específicamente para vehículos de alta gama.",
      icon: <CheckCircle2 className="w-6 h-6" />
    },
    {
      title: "Taller Especializado",
      description: "Mantenimiento preventivo y correctivo con técnicos certificados y repuestos originales.",
      icon: <Settings className="w-6 h-6" />
    },
    {
      title: "Trámites y Gestoría",
      description: "Nos encargamos de todo el papeleo legal para que solo te preocupes por conducir.",
      icon: <Info className="w-6 h-6" />
    }
  ];

  return (
    <section id="servicios" className="py-16 sm:py-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-brand-blue font-bold uppercase tracking-widest text-sm mb-4 block">Nuestros Servicios</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Soluciones Integrales para tu <span className="text-brand-blue">Vehículo</span></h2>
          </div>
          <p className="text-white/40 max-w-md">
            Más que una compra, te ofrecemos una experiencia completa para que disfrutes de tu inversión con total seguridad.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <div key={index} className="glass-card p-8 hover:bg-white/5 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-6 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    {
      q: "¿Qué garantía ofrecen en sus vehículos?",
      a: "Todos nuestros autos usados cuentan con una garantía mecánica de 6 meses o 10,000 km, lo que ocurra primero."
    },
    {
      q: "¿Reciben mi auto actual como parte de pago?",
      a: "Sí, realizamos un peritaje técnico y comercial para ofrecerte el mejor precio del mercado por tu vehículo actual."
    },
    {
      q: "¿Cuánto tiempo demora el proceso de financiamiento?",
      a: "Contamos con aprobación inmediata con algunos bancos aliados. El proceso completo suele demorar entre 24 y 48 horas."
    }
  ];

  return (
    <section className="py-24 bg-brand-gray/5">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-brand-blue font-bold uppercase tracking-widest text-sm mb-4 block">FAQ</span>
          <h2 className="text-4xl font-bold">Preguntas <span className="text-brand-blue">Frecuentes</span></h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-card p-6">
              <h4 className="font-bold text-lg mb-2">{faq.q}</h4>
              <p className="text-white/60 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Marketplace = ({ onShowAll, onContact }: { onShowAll: () => void, onContact: (owner: string) => void }) => {
  const userCars = [
    { id: 'u1', brand: 'Audi', model: 'A4', year: 2019, price: 32000, image: 'https://images.unsplash.com/photo-1606148632349-543303a39e3e?auto=format&fit=crop&q=80&w=800', owner: 'Juan P.', location: 'Medellín' },
    { id: 'u2', brand: 'BMW', model: '330i', year: 2020, price: 38500, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800', owner: 'Maria G.', location: 'Bogotá' },
    { id: 'u3', brand: 'Mercedes-Benz', model: 'C200', year: 2018, price: 29900, image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800', owner: 'Carlos R.', location: 'Cali' },
  ];

  return (
    <section id="marketplace" className="py-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 sm:mb-16">
          <div>
            <span className="text-brand-blue font-bold uppercase tracking-widest text-sm mb-4 block">Marketplace</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Ventas de la <span className="text-brand-blue">Comunidad</span></h2>
          </div>
          <button onClick={onShowAll} className="text-brand-blue font-bold hover:underline flex items-center gap-2 shrink-0">
            Ver todos los anuncios <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {userCars.map((car) => (
            <div key={car.id} className="glass-card overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <img src={car.image} alt={car.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"  />
                <div className="absolute top-4 right-4 bg-brand-dark/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">Particular</div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-lg">{car.brand} {car.model}</h4>
                    <p className="text-white/40 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{car.year} • {car.location}</p>
                  </div>
                  <span className="text-brand-blue font-bold">${car.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center text-[10px] font-bold">{car.owner[0]}</div>
                    <span className="text-white/60 text-xs">{car.owner}</span>
                  </div>
                  <button onClick={() => onContact(car.owner)} className="text-xs font-bold text-brand-blue hover:underline">Contactar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MarketplaceView = ({ onContact }: { onContact: (owner: string) => void }) => {
  const allListings = [
    { id: 'u1', brand: 'Audi', model: 'A4', year: 2019, price: 32000, image: 'https://images.unsplash.com/photo-1606148632349-543303a39e3e?auto=format&fit=crop&q=80&w=800', owner: 'Juan P.', location: 'Medellín', km: 45000 },
    { id: 'u2', brand: 'BMW', model: '330i', year: 2020, price: 38500, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800', owner: 'Maria G.', location: 'Bogotá', km: 32000 },
    { id: 'u3', brand: 'Mercedes-Benz', model: 'C200', year: 2018, price: 29900, image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800', owner: 'Carlos R.', location: 'Cali', km: 61000 },
    { id: 'u4', brand: 'Porsche', model: 'Macan', year: 2021, price: 72000, image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800', owner: 'Laura M.', location: 'Medellín', km: 18000 },
    { id: 'u5', brand: 'Audi', model: 'Q5', year: 2020, price: 55000, image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=800', owner: 'Pedro A.', location: 'Bogotá', km: 27000 },
    { id: 'u6', brand: 'BMW', model: 'X5', year: 2022, price: 89000, image: 'https://images.unsplash.com/photo-1605515298946-d062f2e9da53?auto=format&fit=crop&q=80&w=800', owner: 'Sofia V.', location: 'Cali', km: 9000 },
  ];

  return (
    <div className="pt-28 sm:pt-32 pb-16 sm:pb-24 min-h-screen bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 sm:mb-16">
          <span className="text-brand-blue font-bold uppercase tracking-widest text-sm mb-4 block">Marketplace</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Anuncios de la <span className="text-brand-blue">Comunidad</span></h2>
          <p className="text-white/40 text-lg">Vehículos publicados por particulares verificados.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {allListings.map((car) => (
            <motion.div key={car.id} whileHover={{ y: -6 }} className="glass-card overflow-hidden group">
              <div className="relative h-52 overflow-hidden">
                <img src={car.image} alt={car.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"  />
                <div className="absolute top-4 right-4 bg-brand-dark/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">Particular</div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg">{car.brand} {car.model}</h4>
                    <p className="text-white/40 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{car.year} • {car.location} • {car.km.toLocaleString()} km</p>
                  </div>
                  <span className="text-brand-blue font-bold text-lg">${car.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-blue/20 flex items-center justify-center text-xs font-bold">{car.owner[0]}</div>
                    <span className="text-white/60 text-sm">{car.owner}</span>
                  </div>
                  <button onClick={() => onContact(car.owner)} className="btn-primary py-1.5 px-4 text-xs">Contactar</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SellSection = ({ onAppraisalSubmit }: { onAppraisalSubmit: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
    setPhotos(prev => [...prev, ...valid].slice(0, 5));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setSending(true);
    try {
      await emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_SELL_TEMPLATE_ID', formRef.current, 'YOUR_PUBLIC_KEY');
    } catch { /* silent */ } finally {
      setSending(false);
      setSubmitted(true);
      setPhotos([]);
      onAppraisalSubmit();
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <section id="vender" className="py-16 sm:py-24 bg-brand-gray/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span className="text-brand-blue font-bold uppercase tracking-widest text-sm mb-4 block">Tasación Profesional</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 leading-tight">Vende tu auto al <br /><span className="text-brand-blue">mejor precio</span> del mercado</h2>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              Nuestro equipo de expertos evaluará tu vehículo de forma gratuita y te ofrecerá una oferta competitiva en menos de 24 horas.
            </p>
            <ul className="space-y-4">
              {['Inspección técnica detallada', 'Pago inmediato garantizado', 'Gestión de trámites incluida'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80">
                  <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-brand-blue"></div>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-8 md:p-10 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <Camera className="w-6 h-6 text-brand-blue" />
                    Formulario de Tasación
                  </h3>
                  <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Marca y Modelo</label>
                        <input required type="text" name="car_model" placeholder="Ej: BMW M4" className="input-field w-full" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Año</label>
                        <input required type="number" name="car_year" placeholder="2022" className="input-field w-full" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Kilometraje</label>
                        <input required type="number" name="mileage" placeholder="15000" className="input-field w-full" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Precio Esperado</label>
                        <div className="relative">
                          <input required type="number" name="expected_price" placeholder="45000" className="input-field w-full" />
                          <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Tu Email</label>
                      <input required type="email" name="from_email" placeholder="tu@email.com" className="input-field w-full" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Fotos del Vehículo ({photos.length}/5)</label>
                      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
                          dragging ? 'border-brand-blue bg-brand-blue/10' : 'border-white/10 hover:border-brand-blue/50'
                        }`}
                      >
                        <Upload className="w-8 h-8 text-white/20" />
                        <p className="text-sm text-white/40 text-center">Arrastra fotos aquí o haz clic para subir<br /><span className="text-xs">Máx. 5 imágenes</span></p>
                      </div>
                      {photos.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-2">
                          {photos.map((f, i) => (
                            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                              <img src={URL.createObjectURL(f)} alt="preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                                className="absolute top-0.5 right-0.5 bg-red-500 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button type="submit" disabled={sending} className="btn-primary w-full py-4 text-lg disabled:opacity-60">
                      {sending ? 'Enviando...' : 'Enviar Solicitud'}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center space-y-6">
                  <div className="w-20 h-20 bg-brand-blue/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-brand-blue" />
                  </div>
                  <h3 className="text-3xl font-bold">¡Solicitud Enviada!</h3>
                  <p className="text-white/60">Gracias por confiar en EliteDrive. Un experto se pondrá en contacto contigo en menos de 24 horas.</p>
                  <button onClick={() => setSubmitted(false)} className="text-brand-blue font-bold hover:underline">Enviar otra solicitud</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const BlogSection = ({ onReadPost, onShowAll }: { onReadPost: (post: BlogPost) => void, onShowAll: () => void }) => (
  <section id="blog" className="py-16 sm:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 sm:mb-16">
        <div>
          <span className="text-brand-blue font-bold uppercase tracking-widest text-sm mb-4 block">Contenido Exclusivo</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">EliteDrive <span className="text-brand-blue">Journal</span></h2>
        </div>
        <button 
          onClick={onShowAll}
          className="text-white/60 hover:text-brand-blue font-bold flex items-center gap-2 transition-colors"
        >
          Ver todo el blog <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {BLOG_POSTS.map(post => (
          <motion.div
            key={post.id}
            whileHover={{ y: -5 }}
            className="glass-card overflow-hidden group cursor-pointer"
          >
            <div className="relative h-48 sm:h-72 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                
              />
              <div className="absolute top-6 left-6 bg-brand-dark/80 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold text-white/60">
                {post.date}
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4 group-hover:text-brand-blue transition-colors">{post.title}</h3>
              <p className="text-white/60 leading-relaxed mb-6">{post.excerpt}</p>
              <button 
                onClick={() => onReadPost(post)}
                className="text-brand-blue font-bold flex items-center gap-2"
              >
                Leer más <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = ({ onToast }: { onToast: (msg: string) => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_NEWSLETTER_TEMPLATE_ID', { email: newsletterEmail }, 'YOUR_PUBLIC_KEY');
    } catch { /* silent */ } finally {
      setNewsletterSent(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSent(false), 4000);
    }
  };

  return (
    <footer className="bg-brand-gray/50 border-t border-white/5 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-blue rounded flex items-center justify-center">
                <CarIcon className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tighter">ELITE<span className="text-brand-blue">DRIVE</span></span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">La plataforma líder en vehículos de lujo. Calidad, confianza y exclusividad en cada kilómetro.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Navegación</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><button onClick={() => scrollToSection('showroom')} className="hover:text-brand-blue transition-colors">Showroom</button></li>
              <li><Link to="/marketplace" className="hover:text-brand-blue transition-colors">Marketplace</Link></li>
              <li><button onClick={() => scrollToSection('servicios')} className="hover:text-brand-blue transition-colors">Servicios</button></li>
              <li><button onClick={() => scrollToSection('nosotros')} className="hover:text-brand-blue transition-colors">Sobre nosotros</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Soporte</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><button onClick={() => onToast('Centro de ayuda en construcción')} className="hover:text-brand-blue transition-colors">Centro de ayuda</button></li>
              <li><button onClick={() => onToast('Términos y condiciones')} className="hover:text-brand-blue transition-colors">Términos y condiciones</button></li>
              <li><button onClick={() => onToast('Política de privacidad')} className="hover:text-brand-blue transition-colors">Privacidad</button></li>
              <li><button onClick={() => scrollToSection('contacto')} className="hover:text-brand-blue transition-colors">Contacto</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Newsletter</h4>
            <p className="text-white/40 text-sm mb-4">Suscríbete para recibir ofertas exclusivas.</p>
            {newsletterSent ? (
              <p className="text-brand-blue font-bold text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> ¡Suscrito con éxito!</p>
            ) : (
              <form className="flex gap-2" onSubmit={handleNewsletter}>
                <input
                  type="email" required placeholder="Tu email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="input-field flex-1 py-2 text-sm"
                />
                <button type="submit" className="bg-brand-blue p-2 rounded-xl hover:bg-blue-600 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/20 text-xs font-medium text-center sm:text-left">
          <p>© 2024 EliteDrive. Todos los derechos reservados.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const PriceRangeSlider = ({ 
  min, 
  max, 
  value, 
  onChange 
}: { 
  min: number, 
  max: number, 
  value: [number, number], 
  onChange: (val: [number, number]) => void 
}) => {
  return (
    <div className="space-y-6">
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={value}
        max={max}
        min={min}
        step={5000}
        onValueChange={onChange}
      >
        <Slider.Track className="bg-white/10 relative grow rounded-full h-[3px]">
          <Slider.Range className="absolute bg-brand-blue rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-black/50 rounded-[10px] hover:bg-brand-blue focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-brand-blue/20 transition-colors cursor-grab active:cursor-grabbing"
          aria-label="Precio mínimo"
        />
        <Slider.Thumb
          className="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-black/50 rounded-[10px] hover:bg-brand-blue focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-brand-blue/20 transition-colors cursor-grab active:cursor-grabbing"
          aria-label="Precio máximo"
        />
      </Slider.Root>
      <div className="flex justify-between items-center">
        <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center flex-1">
          <p className="text-[8px] text-white/40 uppercase font-bold">Mínimo</p>
          <p className="text-sm font-bold">${value[0].toLocaleString()}</p>
        </div>
        <div className="w-4 h-[1px] bg-white/10 mx-2" />
        <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center flex-1">
          <p className="text-[8px] text-white/40 uppercase font-bold">Máximo</p>
          <p className="text-sm font-bold">${value[1].toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

// --- Inventory View ---

const InventoryView = ({ 
  cars, 
  filters, 
  onFilterChange, 
  sortBy, 
  onSortChange, 
  onCarClick,
  favorites,
  onToggleFavorite,
  isLoading
}: { 
  cars: Car[], 
  filters: Filters, 
  onFilterChange: (newFilters: Filters) => void,
  sortBy: string,
  onSortChange: (newSort: any) => void,
  onCarClick: (car: Car) => void,
  favorites: string[],
  onToggleFavorite: (e: any, carId: string) => void,
  isLoading: boolean
}) => {
  const minPrice = filters.minPrice === '' ? 0 : Number(filters.minPrice);
  const maxPrice = filters.maxPrice === '' ? 300000 : Number(filters.maxPrice);

  return (
    <div className="pt-28 sm:pt-32 pb-16 sm:pb-24 min-h-screen bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 sm:mb-16">
          <span className="text-brand-blue font-bold uppercase tracking-widest text-sm mb-4 block">Inventario Completo</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Encuentra tu <span className="text-brand-blue">Próximo Vehículo</span></h2>
          <p className="text-white/40 max-w-2xl text-lg">
            Explora nuestra selección curada de vehículos de lujo y deportivos. Cada unidad ha sido rigurosamente inspeccionada para garantizar la máxima calidad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="glass-card p-5 sm:p-8 sticky top-24 sm:top-32">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Filter className="w-5 h-5 text-brand-blue" />
                  Filtros
                </h3>
                <button 
                  onClick={() => onFilterChange({ brand: '', model: '', minPrice: '', maxPrice: '', year: '', category: '', bodyType: '', color: '', fuelType: '', search: '' })}
                  className="text-xs text-brand-blue font-bold hover:underline"
                >
                  Limpiar
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Búsqueda Rápida</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Marca o modelo..." 
                      className="input-field w-full text-sm"
                      value={filters.search}
                      onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Marca</label>
                  <div className="relative">
                    <select 
                      className="input-field w-full text-sm appearance-none"
                      value={filters.brand}
                      onChange={(e) => onFilterChange({ ...filters, brand: e.target.value })}
                    >
                      <option value="">Todas las marcas</option>
                      <option value="Mercedes-Benz">Mercedes-Benz</option>
                      <option value="BMW">BMW</option>
                      <option value="Audi">Audi</option>
                      <option value="Porsche">Porsche</option>
                      <option value="Land Rover">Land Rover</option>
                      <option value="Tesla">Tesla</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Modelo</label>
                  <input 
                    type="text" 
                    placeholder="Ej: M4" 
                    className="input-field w-full text-sm"
                    value={filters.model}
                    onChange={(e) => onFilterChange({ ...filters, model: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Rango de Precio</label>
                  <PriceRangeSlider 
                    min={0}
                    max={300000}
                    value={[minPrice, maxPrice]}
                    onChange={(val) => onFilterChange({ ...filters, minPrice: val[0], maxPrice: val[1] })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Año</label>
                  <div className="relative">
                    <select 
                      className="input-field w-full text-sm appearance-none"
                      value={filters.year}
                      onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
                    >
                      <option value="">Cualquier año</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Carrocería</label>
                  <div className="relative">
                    <select 
                      className="input-field w-full text-sm appearance-none"
                      value={filters.bodyType}
                      onChange={(e) => onFilterChange({ ...filters, bodyType: e.target.value })}
                    >
                      <option value="">Cualquier tipo</option>
                      <option value="SUV">SUV</option>
                      <option value="SUV Coupe">SUV Coupe</option>
                      <option value="Coupe">Coupe</option>
                      <option value="Sedán">Sedán</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Combustible</label>
                  <div className="relative">
                    <select 
                      className="input-field w-full text-sm appearance-none"
                      value={filters.fuelType}
                      onChange={(e) => onFilterChange({ ...filters, fuelType: e.target.value })}
                    >
                      <option value="">Cualquier tipo</option>
                      <option value="Gasolina">Gasolina</option>
                      <option value="Diésel">Diésel</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Eléctrico">Eléctrico</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <p className="text-white/40 text-sm font-medium">
                Mostrando <span className="text-white font-bold">{cars.length}</span> vehículos disponibles
              </p>
              <div className="flex items-center gap-3 bg-brand-gray/20 border border-white/10 rounded-xl px-4 py-2">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Ordenar:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value as any)}
                  className="bg-transparent text-sm text-white outline-none cursor-pointer font-bold"
                >
                  <option value="year-desc" className="bg-brand-dark">Más Recientes</option>
                  <option value="price-asc" className="bg-brand-dark">Precio: Menor a Mayor</option>
                  <option value="price-desc" className="bg-brand-dark">Precio: Mayor a Menor</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
                  <CarCardSkeleton key={i} />
                ))}
              </div>
            ) : cars.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {cars.map(car => (
                    <motion.div
                      key={car.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CarCard 
                        car={car} 
                        isFavorite={favorites.includes(car.id)}
                        onToggleFavorite={(e) => onToggleFavorite(e, car.id)}
                        onClick={() => onCarClick(car)} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-32 glass-card"
              >
                <Search className="w-20 h-20 text-white/5 mx-auto mb-8" />
                <h3 className="text-3xl font-bold mb-4">No se encontraron resultados</h3>
                <p className="text-white/40 text-lg">Intenta ajustar tus filtros para encontrar lo que buscas.</p>
                <button 
                  onClick={() => onFilterChange({ brand: '', model: '', minPrice: '', maxPrice: '', year: '', category: '', bodyType: '', color: '', fuelType: '', search: '' })}
                  className="mt-10 btn-primary px-8 py-3"
                >
                  Limpiar Filtros
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const TrustBar = () => (
  <div className="bg-brand-blue/10 border-y border-white/5 py-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-brand-blue/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="text-brand-blue w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold">Calidad Certificada</p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">Inspección de 150 puntos</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-brand-blue/20 rounded-full flex items-center justify-center">
          <Calculator className="text-brand-blue w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold">Financiamiento</p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">Aprobación en 24h</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-brand-blue/20 rounded-full flex items-center justify-center">
          <Award className="text-brand-blue w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold">Garantía Elite</p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">1 año de cobertura total</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-brand-blue/20 rounded-full flex items-center justify-center">
          <Users className="text-brand-blue w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold">Atención 24/7</p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">Soporte personalizado</p>
        </div>
      </div>
    </div>
  </div>
);

const TopBrands = () => {
  const brands = [
    { name: 'Mercedes-Benz', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/500px-Mercedes-Logo.svg.png' },
    { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/500px-BMW.svg.png' },
    { name: 'Audi', logo: 'https://www.carlogos.org/car-logos/audi-logo-2016.png' },
    { name: 'Porsche', logo: 'https://logos-world.net/wp-content/uploads/2021/03/Porsche-Logo.png' },
    { name: 'Land Rover', logo: 'https://www.carlogos.org/car-logos/land-rover-logo.png' },
    { name: 'Tesla', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/500px-Tesla_Motors.svg.png' }
  ];

  return (
    <div className="py-12 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 md:gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
          {brands.map(brand => (
            <img
              key={brand.name}
              src={brand.logo}
              alt={brand.name}
              className="h-6 sm:h-8 md:h-10 object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Home = ({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  filteredCars,
  favorites,
  toggleFavorite,
  setSelectedCar,
  setSelectedPost,
  setShowToast,
  isLoading
}: {
  filters: Filters; setFilters: (f: Filters) => void;
  sortBy: 'price-asc' | 'price-desc' | 'year-desc'; setSortBy: (s: any) => void;
  filteredCars: Car[]; favorites: string[]; toggleFavorite: (e: any, id: string) => void;
  setSelectedCar: (c: Car | null) => void; setSelectedPost: (p: BlogPost | null) => void;
  setShowToast: (m: string | null) => void; isLoading: boolean;
}) => {
  const navigate = useNavigate();
  
  return (
    <>
      <Hero 
        filters={filters}
        onFilterChange={setFilters}
        onSearch={() => {
          navigate('/inventory');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />

      <section id="showroom" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 sm:mb-16 gap-6">
            <div>
              <span className="text-brand-blue font-bold uppercase tracking-widest text-sm mb-4 block">Catálogo Exclusivo</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Recién <span className="text-brand-blue">Llegados</span></h2>
            </div>
            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-3 bg-brand-gray/20 border border-white/10 rounded-xl px-4 py-2">
                <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-sm text-white outline-none cursor-pointer font-bold"
                >
                  <option value="year-desc" className="bg-brand-dark">Más Recientes</option>
                  <option value="price-asc" className="bg-brand-dark">Precio: Menor a Mayor</option>
                  <option value="price-desc" className="bg-brand-dark">Precio: Mayor a Menor</option>
                </select>
              </div>
              <div className="grid grid-cols-3 sm:flex gap-2 w-full sm:w-auto">
                {['', 'SUV', 'Deportivo', 'Sedán', 'Lujo'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilters({ ...filters, category: cat })}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                      filters.category === cat ? 'bg-brand-blue text-white' : 'bg-brand-gray/50 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {cat === '' ? 'Todos' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(12)].map((_, i) => (
                <CarCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredCars.slice(0, 12).map(car => (
                <CarCard 
                  key={car.id} 
                  car={car} 
                  isFavorite={favorites.includes(car.id)}
                  onToggleFavorite={(e) => toggleFavorite(e, car.id)}
                  onClick={() => setSelectedCar(car)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 glass-card">
              <Search className="w-16 h-16 text-white/10 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-2">No se encontraron vehículos</h3>
              <p className="text-white/40">Intenta ajustar tus filtros de búsqueda.</p>
              <button 
                type="button"
                onClick={() => setFilters({ brand: '', model: '', minPrice: '', maxPrice: '', year: '', category: '', bodyType: '', color: '', fuelType: '', search: '' })}
                className="mt-8 text-brand-blue font-bold hover:underline"
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}

          <div className="mt-16 text-center">
            <Link 
              to="/inventory"
              className="btn-primary py-4 px-12 text-lg inline-block"
            >
              Ver Inventario Completo
            </Link>
          </div>
        </div>
      </section>

      <TopBrands />

      <TrustBar />

      <Stats />

      <WhyChooseUs />

      <AboutUs />

      <SellSection onAppraisalSubmit={() => setShowToast('Solicitud de tasación enviada')} />
      
      <Services />

      <Testimonials />

      <ContactSection />

      <BlogSection onReadPost={(post) => setSelectedPost(post)} onShowAll={() => navigate('/inventory')} />
    </>
  );
};

const FavoritesView = ({ favorites, cars, onCarClick, onToggleFavorite }: {
  favorites: string[]; cars: Car[];
  onCarClick: (car: Car) => void; onToggleFavorite: (e: any, id: string) => void;
}) => {
  const favCars = cars.filter(c => favorites.includes(c.id));
  return (
    <div className="pt-28 sm:pt-32 pb-16 sm:pb-24 min-h-screen bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 sm:mb-16">
          <span className="text-brand-blue font-bold uppercase tracking-widest text-sm mb-4 block">Mi Lista</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Mis <span className="text-brand-blue">Favoritos</span></h2>
          <p className="text-white/40 text-lg">{favCars.length} vehículo{favCars.length !== 1 ? 's' : ''} guardado{favCars.length !== 1 ? 's' : ''}</p>
        </div>
        {favCars.length === 0 ? (
          <div className="text-center py-32 glass-card">
            <Heart className="w-20 h-20 text-white/5 mx-auto mb-8" />
            <h3 className="text-3xl font-bold mb-4">No tienes favoritos aún</h3>
            <p className="text-white/40 text-lg mb-8">Explora el inventario y guarda los vehículos que te interesen.</p>
            <Link to="/inventory" className="btn-primary py-3 px-8">Ver Inventario</Link>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {favCars.map(car => (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                >
                  <CarCard car={car} isFavorite onClick={() => onCarClick(car)} onToggleFavorite={(e) => onToggleFavorite(e, car.id)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'year-desc'>('year-desc');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('elitedrive_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    brand: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    year: '',
    category: '',
    bodyType: '',
    color: '',
    fuelType: '',
    search: ''
  });

  const handleFilterChange = (newFilters: Filters) => {
    setIsLoading(true);
    setFilters(newFilters);
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleSortChange = (newSort: 'price-asc' | 'price-desc' | 'year-desc') => {
    setIsLoading(true);
    setSortBy(newSort);
    setTimeout(() => setIsLoading(false), 800);
  };

  useEffect(() => {
    localStorage.setItem('elitedrive_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (e: any, carId: string) => {
    e.stopPropagation();
    const isFav = favorites.includes(carId);
    setSelectedCar(null);
    setFavorites(prev => isFav ? prev.filter(id => id !== carId) : [...prev, carId]);
    setShowToast(isFav ? 'Eliminado de favoritos' : 'Agregado a favoritos');
    setTimeout(() => setShowToast(null), 3000);
  };

  const filteredCars = CARS.filter(car => {
    const matchesSearch = filters.search === '' || 
      car.brand.toLowerCase().includes(filters.search.toLowerCase()) || 
      car.model.toLowerCase().includes(filters.search.toLowerCase());
    const matchesBrand = filters.brand === '' || car.brand === filters.brand;
    const matchesModel = filters.model === '' || car.model.toLowerCase().includes(filters.model.toLowerCase());
    const matchesPrice = (filters.minPrice === '' || car.price >= filters.minPrice) && 
                         (filters.maxPrice === '' || car.price <= filters.maxPrice);
    const matchesYear = filters.year === '' || car.year.toString() === filters.year;
    const matchesCategory = filters.category === '' || car.category === filters.category;
    const matchesBodyType = filters.bodyType === '' || car.bodyType === filters.bodyType;
    const matchesColor = filters.color === '' || car.color === filters.color;
    const matchesFuelType = filters.fuelType === '' || car.fuelType === filters.fuelType;
    
    return matchesSearch && matchesBrand && matchesModel && matchesPrice && matchesYear && matchesCategory && matchesBodyType && matchesColor && matchesFuelType;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'year-desc') return b.year - a.year;
    return 0;
  });


  return (
    <div className="bg-brand-dark min-h-screen">
      <Navbar 
        favoritesCount={favorites.length} 
        onSearch={(term) => handleFilterChange({ ...filters, search: term })}
      />
      
      <Routes>
        <Route path="/" element={
          <Home 
            filters={filters}
            setFilters={handleFilterChange}
            sortBy={sortBy}
            setSortBy={handleSortChange}
            filteredCars={filteredCars}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            setSelectedCar={setSelectedCar}
            setSelectedPost={setSelectedPost}
            setShowToast={setShowToast}
            isLoading={isLoading}
          />
        } />
        <Route path="/inventory" element={
          <InventoryView 
            cars={filteredCars}
            filters={filters}
            onFilterChange={handleFilterChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onCarClick={setSelectedCar}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            isLoading={isLoading}
          />
        } />
        <Route path="/favorites" element={
          <FavoritesView
            favorites={favorites}
            cars={CARS}
            onCarClick={setSelectedCar}
            onToggleFavorite={toggleFavorite}
          />
        } />
        <Route path="/marketplace" element={
          <MarketplaceView onContact={(owner) => { setShowToast(`Contactando a ${owner}...`); setTimeout(() => setShowToast(null), 3000); }} />
        } />
      </Routes>

      <Footer onToast={(msg) => setShowToast(msg)} />

      <LiveChat />

      <AnimatePresence>
        {selectedCar && (
          <VehicleDetail 
            car={selectedCar} 
            onClose={() => setSelectedCar(null)} 
            onBookTestDrive={() => setShowToast('Reserva de Test Drive confirmada')}
            onFinanceRequest={() => setShowToast('Solicitud de financiamiento enviada')}
          />
        )}
      </AnimatePresence>

      {/* Blog Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl" onClick={() => setSelectedPost(null)}></div>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl glass-card overflow-hidden"
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 z-50 p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-64 object-cover"  />
              <div className="p-8 md:p-12 space-y-6">
                <span className="text-brand-blue font-bold text-sm uppercase tracking-widest">{selectedPost.date}</span>
                <h2 className="text-4xl font-bold">{selectedPost.title}</h2>
                <div className="space-y-4 text-white/60 leading-relaxed text-lg">
                  <p>{selectedPost.excerpt}</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-brand-blue text-white px-8 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

