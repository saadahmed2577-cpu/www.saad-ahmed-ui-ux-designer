import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Clock, 
  Globe, 
  ExternalLink, 
  Copy, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Radio, 
  Sparkles, 
  Layers, 
  Wifi, 
  ArrowUpRight,
  Search,
  Route,
  Locate,
  X,
  Car,
  ArrowRight
} from 'lucide-react';

interface GlobalHub {
  id: string;
  city: string;
  country: string;
  role: string;
  project: string;
  lat: number;
  lng: number;
  xPercent: number; // For interactive SVG positioning on 1000x500 map projection
  yPercent: number;
  timezone: string;
  utcOffset: string;
  highlightColor?: string;
}

const GLOBAL_HUBS: GlobalHub[] = [
  {
    id: 'karachi-hq',
    city: 'Karachi (Studio HQ)',
    country: 'Pakistan',
    role: 'Primary Creative Lab & Architecture',
    project: 'Design Systems & Core UI/UX Operations',
    lat: 25.0323,
    lng: 67.0582,
    xPercent: 66.8,
    yPercent: 44.5,
    timezone: 'Asia/Karachi',
    utcOffset: 'UTC+5',
    highlightColor: '#D91E2A'
  },
  {
    id: 'new-york',
    city: 'New York',
    country: 'United States',
    role: 'FinTech & B2B SaaS Platforms',
    project: 'NextGen Financial Analytics Suite',
    lat: 40.7128,
    lng: -74.0060,
    xPercent: 28.5,
    yPercent: 33.2,
    timezone: 'America/New_York',
    utcOffset: 'UTC-4',
    highlightColor: '#FFFFFF'
  },
  {
    id: 'san-francisco',
    city: 'San Francisco',
    country: 'United States',
    role: 'AI Product & Mobile UX',
    project: 'AI Intelligence Dashboard',
    lat: 37.7749,
    lng: -122.4194,
    xPercent: 18.2,
    yPercent: 34.8,
    timezone: 'America/Los_Angeles',
    utcOffset: 'UTC-7',
    highlightColor: '#FFFFFF'
  },
  {
    id: 'london',
    city: 'London',
    country: 'United Kingdom',
    role: 'E-Commerce & Digital Flagship',
    project: 'Noble Matrimonial & Luxury Web Experience',
    lat: 51.5074,
    lng: -0.1278,
    xPercent: 48.8,
    yPercent: 27.5,
    timezone: 'Europe/London',
    utcOffset: 'UTC+1',
    highlightColor: '#FFFFFF'
  },
  {
    id: 'dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    role: 'Enterprise Portals & PropTech',
    project: 'ShelterMax Luxury Real Estate UI',
    lat: 25.2048,
    lng: 55.2708,
    xPercent: 63.5,
    yPercent: 43.8,
    timezone: 'Asia/Dubai',
    utcOffset: 'UTC+4',
    highlightColor: '#FFFFFF'
  },
  {
    id: 'sydney',
    city: 'Sydney',
    country: 'Australia',
    role: 'Telemetry & IoT Interface',
    project: 'Fishinity Pro Marine Telemetry',
    lat: -33.8688,
    lng: 151.2093,
    xPercent: 88.5,
    yPercent: 78.5,
    timezone: 'Australia/Sydney',
    utcOffset: 'UTC+10',
    highlightColor: '#FFFFFF'
  },
  {
    id: 'toronto',
    city: 'Toronto',
    country: 'Canada',
    role: 'Creative Agency Showcase',
    project: 'Flipp Productions Digital Experience',
    lat: 43.6532,
    lng: -79.3832,
    xPercent: 27.2,
    yPercent: 31.8,
    timezone: 'America/Toronto',
    utcOffset: 'UTC-4',
    highlightColor: '#FFFFFF'
  }
];

const DESTINATION_COORDS = '24.9930024,67.0650956';
const DESTINATION_GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/New+Karachi+Town,+Karachi,+Pakistan/@24.9914645,67.0436444,14z/data=!3m1!4b1!4m6!3m5!1s0x3eb3411d1b1aa5dd:0x7f8008a575c0b797!8m2!3d24.9930024!4d67.0650956!16zL20vMDlwMXlm?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDkwNi4wIKXMDSoASAFQAw%3D%3D';
const DESTINATION_LABEL = 'Saad Ahmed Studio (New Karachi Town, Karachi)';

export const MapSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'studio' | 'global'>('studio');
  const [mapStyle, setMapStyle] = useState<'obsidian' | 'satellite' | 'street'>('obsidian');
  const [zoomLevel, setZoomLevel] = useState<number>(15);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isLiveOpen, setIsLiveOpen] = useState(true);
  const [selectedHub, setSelectedHub] = useState<GlobalHub>(GLOBAL_HUBS[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Search & Road Map State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeOrigin, setActiveOrigin] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [mapReloadKey, setMapReloadKey] = useState<number>(0);

  const handleGoToMyLocation = () => {
    setActiveOrigin(null);
    setSearchQuery('');
    setZoomLevel(15);
    setActiveTab('studio');
    setMapReloadKey(prev => prev + 1);
    setLocationNotice('Location Loaded on this page: New Karachi Town (Saad Ahmed Designer)');
    setTimeout(() => {
      setLocationNotice(null);
    }, 4500);
    const mapElement = document.getElementById('map-canvas-stage');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Live Studio Clock (Karachi Time PKT UTC+5)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Karachi',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        setCurrentTime(formatter.format(now));

        // Check if between 9am and 9pm PKT
        const pktHour = parseInt(
          new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Karachi', hour: 'numeric', hour12: false }).format(now),
          10
        );
        setIsLiveOpen(pktHour >= 9 && pktHour < 21);
      } catch {
        setCurrentTime('PKT Time');
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCoords = () => {
    navigator.clipboard.writeText('24.9930024, 67.0650956');
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, 19));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 11));
  const handleResetZoom = () => setZoomLevel(15);

  // Road Map Search Handlers
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setActiveOrigin(trimmed);
    setActiveTab('studio');
    setLocationNotice(`Road Map plotted from "${trimmed}" to Saad Ahmed Studio`);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice('Geolocation not supported in browser. Type your location above.');
      return;
    }
    setIsLocating(true);
    setLocationNotice('Detecting your GPS location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
        setSearchQuery('My Current Location');
        setActiveOrigin(coords);
        setActiveTab('studio');
        setLocationNotice('Road Map plotted from your live GPS location to Saad Ahmed Studio');
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        setLocationNotice('Location access not granted. Please type your area or city.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleClearRoute = () => {
    setSearchQuery('');
    setActiveOrigin(null);
    setLocationNotice(null);
  };

  // Google Maps URL generation permanently locked to user location
  const defaultGoogleMapsUrl = DESTINATION_GOOGLE_MAPS_URL;
  
  // Directions URL with locked destination coords (24.9930024, 67.0650956)
  const dynamicDirectionsUrl = activeOrigin
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(activeOrigin)}&destination=${DESTINATION_COORDS}`
    : `https://www.google.com/maps/dir/?api=1&destination=${DESTINATION_COORDS}`;

  // Map Embed URL:
  // When activeOrigin is provided, Google Maps renders a direct road map route to destination!
  // When no origin is provided, it pins Saad Ahmed's Studio location directly on New Karachi Town.
  const mapTypeParam = mapStyle === 'satellite' ? 'k' : mapStyle === 'street' ? 'm' : 'm';
  const iframeEmbedUrl = activeOrigin
    ? `https://maps.google.com/maps?saddr=${encodeURIComponent(activeOrigin)}&daddr=${DESTINATION_COORDS}&t=${mapTypeParam}&output=embed`
    : `https://maps.google.com/maps?q=24.9930024,67.0650956+(New+Karachi+Town)&t=${mapTypeParam}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;

  return (
    <section 
      id="location" 
      className={`py-28 relative bg-[#080808] border-t border-white/[0.08] overflow-hidden transition-all duration-500 ${
        isFullscreen ? 'fixed inset-0 z-50 p-6 bg-[#080808]/95 backdrop-blur-2xl overflow-y-auto' : ''
      }`}
    >
      {/* Ambient background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#D91E2A]/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-950/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 max-w-2xl"
          >
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111113] border border-[#D91E2A]/30 shadow-[0_0_15px_rgba(217,30,42,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[#D91E2A] animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-[#D91E2A] font-bold uppercase">
                06 // STUDIO HQ & GLOBAL REACH
              </span>
            </div>

            <h2 className="font-bebas text-5xl sm:text-7xl font-bold text-white leading-none uppercase tracking-tight">
              ARCHITECTED LOCALLY. <br />
              <span className="font-serif-luxury italic font-normal text-[#D91E2A] capitalize text-4xl sm:text-6xl">Delivered</span>{' '}
              WORLDWIDE.
            </h2>

            <p className="font-sans-clean text-xs sm:text-sm text-[#9A9A9A] leading-relaxed">
              Operating out of Karachi, Pakistan with a globally distributed client footprint. Search your location below to generate a direct road map connected straight to the Karachi Creative Lab.
            </p>
          </motion.div>

          {/* Perspective Switcher & Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center gap-3 shrink-0"
          >
            {/* View Mode Switcher */}
            <div className="p-1 rounded-xl bg-[#111113] border border-white/10 flex items-center gap-1 shadow-inner">
              <button
                onClick={() => setActiveTab('studio')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'studio'
                    ? 'bg-[#D91E2A] text-white shadow-[0_0_20px_rgba(217,30,42,0.5)]'
                    : 'text-[#9A9A9A] hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Karachi HQ Studio</span>
              </button>

              <button
                onClick={() => setActiveTab('global')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'global'
                    ? 'bg-[#D91E2A] text-white shadow-[0_0_20px_rgba(217,30,42,0.5)]'
                    : 'text-[#9A9A9A] hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Global Client Network</span>
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2.5 rounded-xl bg-[#111113] border border-white/10 text-[#9A9A9A] hover:text-white hover:border-white/20 transition-all cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Expand Map'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </motion.div>
        </div>

        {/* Dedicated Luxury Road Map Search Panel (Always Locked to Saad's Studio) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-8 p-5 sm:p-6 rounded-2xl bg-[#0D0D10] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Title & Locked Destination Status */}
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#D91E2A]">
                <Route className="w-3.5 h-3.5" />
                <span>ROAD MAP GENERATOR // DESTINATION PERMANENTLY LOCKED</span>
              </div>
              <div className="text-sm font-bold text-white mt-1 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  <Check className="w-3 h-3" />
                  Locked Destination:
                </span>
                <span className="text-[#C5C5C5]">
                  Saad Ahmed Studio, New Karachi Town, Karachi (24.9930024, 67.0650956)
                </span>
              </div>
            </div>

            {/* Status notice if active */}
            {locationNotice && (
              <div className="px-3.5 py-1.5 rounded-lg bg-[#18181B] border border-[#D91E2A]/40 text-xs font-mono text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D91E2A] animate-pulse" />
                <span>{locationNotice}</span>
              </div>
            )}
          </div>

          {/* Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#888] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search starting location / area (e.g. Airport, Clifton, Gulshan, Saddar, Lahore)..."
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-[#111113] border border-white/10 hover:border-white/20 focus:border-[#D91E2A] focus:outline-none text-white text-xs sm:text-sm placeholder-[#666] transition-all font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearRoute}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888] hover:text-white transition-colors"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* GPS Live Geolocation Button */}
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={isLocating}
              className="px-4 py-3 rounded-xl bg-[#111113] border border-white/10 hover:border-[#D91E2A]/70 text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-50"
              title="Use my current GPS location as start point"
            >
              <Locate className={`w-4 h-4 text-[#D91E2A] ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{isLocating ? 'Locating...' : 'Use My GPS'}</span>
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#D91E2A] hover:bg-[#b51823] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(217,30,42,0.4)] shrink-0"
            >
              <Car className="w-4 h-4" />
              <span>Plot Road Map</span>
            </button>

            {/* Clear Route button if active */}
            {activeOrigin && (
              <button
                type="button"
                onClick={handleClearRoute}
                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#9A9A9A] hover:text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Pin</span>
              </button>
            )}
          </form>

          {/* Dynamic Searched Location Display */}
          <div className="flex items-center gap-2.5 flex-wrap pt-1 min-h-[36px]">
            <span className="text-[10px] font-mono text-[#888] uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#D91E2A]" />
              SEARCHED LOCATION:
            </span>
            {(searchQuery.trim() || activeOrigin) ? (
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#111113] border border-[#D91E2A]/50 text-white font-mono text-xs shadow-[0_0_15px_rgba(217,30,42,0.15)] transition-all">
                <span className="w-2 h-2 rounded-full bg-[#D91E2A] animate-pulse shrink-0" />
                <span className="text-white font-semibold tracking-wide break-all">
                  {searchQuery.trim() || activeOrigin}
                </span>
                {activeOrigin && (
                  <span className="text-[9px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider font-bold shrink-0">
                    Route Plotted
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs font-mono text-[#666] italic">
                Type any location or city in the search bar above...
              </span>
            )}
          </div>
        </motion.div>

        {/* Main Luxury Interactive Map Container */}
        <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#0D0D10] shadow-[0_30px_90px_rgba(0,0,0,0.85)] group">
          
          {/* Top HUD Telemetry Bar */}
          <div className="bg-[#111113]/90 backdrop-blur-md px-5 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 z-30 relative">
            {/* Left Status Readout */}
            <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLiveOpen ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLiveOpen ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                </span>
                <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                  {activeOrigin ? 'ROAD MAP ACTIVE' : isLiveOpen ? 'STUDIO OPEN' : 'AFTER HOURS'}
                </span>
                <span className="text-[10px] text-[#9A9A9A] font-mono hidden sm:inline">
                  • 09:00 - 21:00 PKT
                </span>
              </div>

              <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

              {/* Live Clock */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#D91E2A]">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-bold tracking-widest">{currentTime || '12:00:00 PM'} PKT (UTC+5)</span>
              </div>

              <div className="h-4 w-[1px] bg-white/10 hidden md:block" />

              {/* Exact Coordinates */}
              <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-[#9A9A9A]">
                <Navigation className="w-3 h-3 text-[#D91E2A]" />
                <span>24°59'34.8"N 67°03'54.3"E • NEW KARACHI TOWN HQ</span>
              </div>
            </div>

            {/* Right Map Style Toggles & Actions */}
            <div className="flex items-center gap-2">
              {activeTab === 'studio' && (
                <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-black/50 border border-white/10 text-[10px] font-mono">
                  <button
                    onClick={() => setMapStyle('obsidian')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      mapStyle === 'obsidian' ? 'bg-[#D91E2A] text-white font-bold' : 'text-[#9A9A9A] hover:text-white'
                    }`}
                  >
                    OBSIDIAN
                  </button>
                  <button
                    onClick={() => setMapStyle('satellite')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      mapStyle === 'satellite' ? 'bg-[#D91E2A] text-white font-bold' : 'text-[#9A9A9A] hover:text-white'
                    }`}
                  >
                    SATELLITE
                  </button>
                  <button
                    onClick={() => setMapStyle('street')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      mapStyle === 'street' ? 'bg-[#D91E2A] text-white font-bold' : 'text-[#9A9A9A] hover:text-white'
                    }`}
                  >
                    HYBRID
                  </button>
                </div>
              )}

              {/* Copy GPS button */}
              <button
                onClick={handleCopyCoords}
                className="px-3 py-1.5 rounded-lg bg-[#18181B] border border-white/10 hover:border-[#D91E2A]/60 text-xs text-white font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                title="Copy Exact GPS Coordinates"
              >
                {copiedCoords ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#D91E2A]" />
                    <span className="hidden sm:inline">COPY GPS</span>
                  </>
                )}
              </button>

              {/* Direct In-Page Location Link Action */}
              <button
                type="button"
                onClick={handleGoToMyLocation}
                className="px-3 py-1.5 rounded-lg bg-[#D91E2A] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#b51823] transition-colors shadow-[0_0_15px_rgba(217,30,42,0.4)] cursor-pointer active:scale-95"
                title="Esi page par meri location link load karein"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>LOCATION LINK</span>
              </button>
            </div>
          </div>

          {/* Interactive Map Canvas Stage */}
          <div id="map-canvas-stage" className="relative h-[480px] sm:h-[560px] lg:h-[620px] w-full overflow-hidden bg-[#0A0A0C]">
            
            {/* View 1: Studio HQ Precision Map View */}
            {activeTab === 'studio' ? (
              <div className="relative w-full h-full">
                {/* Embed iframe */}
                <iframe
                  key={mapReloadKey}
                  title="Saad Ahmed Studio Karachi Location"
                  src={iframeEmbedUrl}
                  className={`w-full h-full border-0 transition-all duration-700 ${
                    mapStyle === 'obsidian' 
                      ? 'invert-[0.92] hue-rotate-180 contrast-[1.2] saturate-[0.35]' 
                      : mapStyle === 'satellite'
                      ? 'contrast-[1.1] saturate-[1.2]'
                      : 'contrast-[1.05]'
                  }`}
                  loading="lazy"
                  allowFullScreen
                />

                {/* Dark Luxury Vignette & Edge Blending Mask */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(8,8,8,0.85)]" />

                {/* Luxury Target Crosshairs & Overlays */}
                <div className="absolute top-6 left-6 pointer-events-none hidden sm:block">
                  <div className="w-8 h-8 border-t-2 border-l-2 border-[#D91E2A]/70" />
                </div>
                <div className="absolute top-6 right-6 pointer-events-none hidden sm:block">
                  <div className="w-8 h-8 border-t-2 border-r-2 border-[#D91E2A]/70" />
                </div>
                <div className="absolute bottom-6 left-6 pointer-events-none hidden sm:block">
                  <div className="w-8 h-8 border-b-2 border-l-2 border-[#D91E2A]/70" />
                </div>
                <div className="absolute bottom-6 right-6 pointer-events-none hidden sm:block">
                  <div className="w-8 h-8 border-b-2 border-r-2 border-[#D91E2A]/70" />
                </div>

                {/* Active Route HUD Overlay banner when route is plotted */}
                {activeOrigin && (
                  <div className="absolute top-6 left-6 right-20 sm:right-auto sm:max-w-md z-30 pointer-events-auto">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-4 py-2.5 rounded-xl bg-[#111113]/95 border border-[#D91E2A]/60 backdrop-blur-md shadow-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <span className="font-mono text-[11px] text-white truncate">
                          <span className="text-[#888]">FROM:</span> {searchQuery || activeOrigin}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#D91E2A] shrink-0" />
                        <span className="font-mono text-[11px] text-[#D91E2A] font-bold shrink-0">
                          STUDIO (NEW KARACHI)
                        </span>
                      </div>
                      <button
                        onClick={handleClearRoute}
                        className="p-1 rounded-md text-[#888] hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                        title="Reset to Studio Pin"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  </div>
                )}

                {/* Pulsing Studio Center Marker Overlay - ONLY shown when not viewing road map */}
                {!activeOrigin && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={handleGoToMyLocation}
                      className="relative flex items-center justify-center cursor-pointer group"
                      title="Meri location par ajayein (esi page par)"
                    >
                      <div className="w-24 h-24 rounded-full border border-[#D91E2A]/40 animate-ping absolute" />
                      <div className="w-16 h-16 rounded-full border border-[#D91E2A]/60 animate-pulse absolute" />
                      <div className="w-10 h-10 rounded-full bg-[#D91E2A] group-hover:scale-110 transition-transform text-white shadow-[0_0_30px_#D91E2A] flex items-center justify-center border-2 border-white">
                        <MapPin className="w-5 h-5 fill-white" />
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={handleGoToMyLocation}
                      className="mt-3 px-3.5 py-1.5 rounded-full bg-[#111113]/95 hover:bg-[#D91E2A] border border-[#D91E2A]/60 backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.8)] text-center whitespace-nowrap transition-all group flex items-center gap-1.5 cursor-pointer pointer-events-auto"
                      title="Meri location par ajayein (esi page par)"
                    >
                      <span className="text-[11px] font-bold text-white tracking-wide">SAAD AHMED CREATIVE LAB</span>
                      <span className="text-[9px] text-[#D91E2A] group-hover:text-white font-mono uppercase font-bold flex items-center gap-0.5">
                        • New Karachi Town
                      </span>
                    </button>
                  </div>
                )}

                {/* Floating Architectural Studio Card in Map */}
                <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md z-30">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 sm:p-6 rounded-2xl bg-[#111113]/95 border border-white/15 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-4"
                  >
                    {activeOrigin ? (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[10px] font-mono text-[#D91E2A] uppercase font-bold tracking-wider flex items-center gap-1.5">
                              <Route className="w-3 h-3" />
                              ROAD MAP ROUTE ACTIVE
                            </div>
                            <h3 className="font-bebas text-2xl sm:text-3xl text-white uppercase tracking-wide mt-0.5">
                              Road Navigation Map
                            </h3>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-[#D91E2A]/20 border border-[#D91E2A]/50 text-[#D91E2A] text-[10px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                            <Car className="w-3 h-3" />
                            Live Route
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs font-mono bg-black/40 p-3 rounded-xl border border-white/10">
                          <div className="flex items-center gap-2 text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span className="text-[#888] text-[10px]">ORIGIN:</span>
                            <span className="truncate text-white font-bold">{searchQuery || activeOrigin}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#D91E2A]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D91E2A] shrink-0" />
                            <span className="text-[#888] text-[10px]">DESTINATION:</span>
                            <span className="truncate text-white font-bold">Saad Ahmed Studio (New Karachi Town)</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <a
                            href={dynamicDirectionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 px-4 rounded-xl bg-[#D91E2A] hover:bg-[#b51823] text-white text-xs font-bold text-center tracking-wider uppercase transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-[0_0_20px_rgba(217,30,42,0.4)]"
                          >
                            <Navigation className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            <span>Navigate in Google Maps</span>
                          </a>

                          <button
                            type="button"
                            onClick={handleClearRoute}
                            className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#C5C5C5] hover:text-white text-xs font-mono uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                          >
                            Reset
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[10px] font-mono text-[#D91E2A] uppercase font-bold tracking-wider">
                              STUDIO HEADQUARTERS
                            </div>
                            <h3 className="font-bebas text-2xl sm:text-3xl text-white uppercase tracking-wide mt-0.5">
                              New Karachi Designer
                            </h3>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                            <Wifi className="w-3 h-3" />
                            Online
                          </span>
                        </div>

                        <p className="text-xs text-[#C5C5C5] leading-relaxed">
                          New Karachi Town, Karachi, Sindh 75850, Pakistan.
                        </p>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px] font-mono">
                          <div>
                            <span className="text-[#888] block text-[9px] uppercase">TIMEZONE</span>
                            <span className="text-white font-bold">PKT (UTC +5:00)</span>
                          </div>
                          <div>
                            <span className="text-[#888] block text-[9px] uppercase">LATENCY / RESPONSE</span>
                            <span className="text-[#D91E2A] font-bold">&lt; 2 Hours</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={handleGoToMyLocation}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-[#D91E2A] hover:bg-[#b51823] text-white text-xs font-bold text-center tracking-wider uppercase transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-[0_0_20px_rgba(217,30,42,0.4)] active:scale-95"
                            title="Esi page par meri location link par ajayein"
                          >
                            <MapPin className="w-3.5 h-3.5 text-white shrink-0 animate-bounce" />
                            <span>MERI LOCATION PAR JAO</span>
                          </button>

                          <a
                            href="#contact"
                            className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold text-center tracking-wider uppercase transition-colors shrink-0"
                          >
                            Book Intro
                          </a>
                        </div>
                      </>
                    )}
                  </motion.div>
                </div>

                {/* Floating Map Zoom Controls */}
                <div className="absolute top-6 right-6 z-30 flex flex-col gap-2">
                  <button
                    onClick={handleZoomIn}
                    className="w-10 h-10 rounded-xl bg-[#111113]/90 hover:bg-[#D91E2A] border border-white/15 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-all cursor-pointer group"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4 text-[#C5C5C5] group-hover:text-white" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="w-10 h-10 rounded-xl bg-[#111113]/90 hover:bg-[#D91E2A] border border-white/15 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-all cursor-pointer group"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4 text-[#C5C5C5] group-hover:text-white" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="w-10 h-10 rounded-xl bg-[#111113]/90 hover:bg-[#D91E2A] border border-white/15 text-white flex items-center justify-center backdrop-blur-md shadow-lg transition-all cursor-pointer group"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-4 h-4 text-[#C5C5C5] group-hover:text-white" />
                  </button>
                </div>
              </div>
            ) : (
              /* View 2: Interactive Luxury Global Client Footprint Map */
              <div className="relative w-full h-full p-4 sm:p-8 flex items-center justify-center">
                
                {/* SVG Vector Stylized World Map with Glowing Network Links */}
                <svg
                  viewBox="0 0 1000 500"
                  className="w-full h-full max-h-[550px] select-none pointer-events-auto"
                >
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D91E2A" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#D91E2A" stopOpacity="0.1" />
                    </linearGradient>
                    <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#D91E2A" stopOpacity="1" />
                      <stop offset="100%" stopColor="#D91E2A" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Coordinate Grid Lines */}
                  <g opacity="0.12" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="3 3">
                    <line x1="0" y1="125" x2="1000" y2="125" />
                    <line x1="0" y1="250" x2="1000" y2="250" />
                    <line x1="0" y1="375" x2="1000" y2="375" />
                    <line x1="250" y1="0" x2="250" y2="500" />
                    <line x1="500" y1="0" x2="500" y2="500" />
                    <line x1="750" y1="0" x2="750" y2="500" />
                  </g>

                  {/* Continents Simplified Abstract Dotted Silhouettes */}
                  <g fill="#202026" opacity="0.45">
                    {/* North America */}
                    <path d="M 120,100 Q 180,90 260,110 Q 300,160 270,220 Q 230,240 180,260 Q 140,210 110,160 Z" />
                    {/* South America */}
                    <path d="M 270,270 Q 320,290 310,380 Q 290,440 260,420 Q 240,360 250,290 Z" />
                    {/* Europe */}
                    <path d="M 450,110 Q 530,100 550,160 Q 500,200 460,180 Q 430,150 450,110 Z" />
                    {/* Africa */}
                    <path d="M 460,200 Q 550,200 550,300 Q 520,380 480,360 Q 450,280 460,200 Z" />
                    {/* Asia */}
                    <path d="M 560,90 Q 750,80 820,170 Q 770,260 670,240 Q 600,220 560,140 Z" />
                    {/* Australia */}
                    <path d="M 800,340 Q 900,330 910,400 Q 860,440 810,410 Q 790,370 800,340 Z" />
                  </g>

                  {/* Curved Network Beams connecting Karachi HQ to Global Hubs */}
                  {GLOBAL_HUBS.filter(h => h.id !== 'karachi-hq').map((hub) => {
                    const hq = GLOBAL_HUBS[0];
                    const x1 = (hq.xPercent / 100) * 1000;
                    const y1 = (hq.yPercent / 100) * 500;
                    const x2 = (hub.xPercent / 100) * 1000;
                    const y2 = (hub.yPercent / 100) * 500;
                    
                    // Bezier curve midpoint with luxury arc height
                    const midX = (x1 + x2) / 2;
                    const midY = Math.min(y1, y2) - 40;

                    const isSelected = selectedHub.id === hub.id;

                    return (
                      <g key={`beam-${hub.id}`}>
                        <path
                          d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                          fill="none"
                          stroke={isSelected ? '#D91E2A' : '#ffffff'}
                          strokeOpacity={isSelected ? 0.85 : 0.22}
                          strokeWidth={isSelected ? 2.5 : 1.2}
                          strokeDasharray={isSelected ? 'none' : '4 4'}
                          filter={isSelected ? 'url(#glowEffect)' : undefined}
                          className="transition-all duration-300"
                        />
                        {/* Animated Pulses traveling across paths */}
                        {isSelected && (
                          <circle r="4" fill="#FFFFFF">
                            <animateMotion
                              path={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                              dur="2.5s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}
                      </g>
                    );
                  })}

                  {/* Hub Location Pins */}
                  {GLOBAL_HUBS.map((hub) => {
                    const cx = (hub.xPercent / 100) * 1000;
                    const cy = (hub.yPercent / 100) * 500;
                    const isHQ = hub.id === 'karachi-hq';
                    const isSelected = selectedHub.id === hub.id;

                    return (
                      <g 
                        key={hub.id} 
                        className="cursor-pointer group"
                        onClick={() => setSelectedHub(hub)}
                      >
                        {/* Pulsing Outer Ring */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHQ ? 20 : isSelected ? 16 : 10}
                          fill="none"
                          stroke={isHQ ? '#D91E2A' : isSelected ? '#FFFFFF' : '#D91E2A'}
                          strokeWidth="1.5"
                          opacity={isHQ ? 0.7 : isSelected ? 0.6 : 0.3}
                          className="animate-pulse"
                        />

                        {isHQ && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r="32"
                            fill="none"
                            stroke="#D91E2A"
                            strokeWidth="1"
                            opacity="0.3"
                            className="animate-ping"
                          />
                        )}

                        {/* Core Marker Dot */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHQ ? 8 : isSelected ? 6 : 4}
                          fill={isHQ ? '#D91E2A' : isSelected ? '#FFFFFF' : '#D91E2A'}
                          stroke="#080808"
                          strokeWidth="2"
                          filter={isHQ || isSelected ? 'url(#glowEffect)' : undefined}
                        />

                        {/* City Label */}
                        <text
                          x={cx}
                          y={cy - 14}
                          textAnchor="middle"
                          fill={isHQ ? '#D91E2A' : isSelected ? '#FFFFFF' : '#9A9A9A'}
                          fontSize={isHQ ? '12' : '10'}
                          fontWeight={isHQ || isSelected ? 'bold' : '500'}
                          fontFamily="monospace"
                          className="tracking-wider select-none pointer-events-none"
                        >
                          {hub.city.split(' ')[0].toUpperCase()}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Selected Global Hub Detail Card */}
                <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md z-30">
                  <motion.div
                    key={selectedHub.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 sm:p-6 rounded-2xl bg-[#111113]/95 border border-white/15 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-mono text-[#D91E2A] uppercase font-bold tracking-wider flex items-center gap-1.5">
                          <Radio className="w-3 h-3 animate-pulse" />
                          <span>{selectedHub.id === 'karachi-hq' ? 'STUDIO HEADQUARTERS' : 'ACTIVE CLIENT NODE'}</span>
                        </div>
                        <h3 className="font-bebas text-2xl sm:text-3xl text-white uppercase tracking-wide mt-0.5">
                          {selectedHub.city}, {selectedHub.country}
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white font-mono text-[10px] font-bold">
                        {selectedHub.utcOffset}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase text-[#888]">SPECIALTY / SCOPE</div>
                      <div className="text-xs font-bold text-white">{selectedHub.role}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <div className="text-[9px] font-mono uppercase text-[#D91E2A] font-bold">FEATURED COLLABORATION</div>
                      <div className="text-xs font-semibold text-[#E0E0E0] mt-0.5">{selectedHub.project}</div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="text-[11px] font-mono text-[#888]">
                        LAT: {selectedHub.lat.toFixed(2)}° • LNG: {selectedHub.lng.toFixed(2)}°
                      </div>
                      <a
                        href="#projects"
                        className="text-xs text-[#D91E2A] hover:text-white font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>View Work</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                </div>

                {/* Network Legend in Top Right */}
                <div className="absolute top-6 right-6 hidden md:block z-30">
                  <div className="p-4 rounded-xl bg-[#111113]/90 border border-white/10 backdrop-blur-md text-[11px] font-mono space-y-2">
                    <div className="text-[9px] uppercase tracking-wider text-[#888] font-bold">MAP PROTOCOL</div>
                    <div className="flex items-center gap-2 text-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D91E2A] shadow-[0_0_10px_#D91E2A]" />
                      <span>Karachi HQ (Core Node)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#9A9A9A]">
                      <span className="w-2 h-2 rounded-full bg-white" />
                      <span>Remote Enterprise Hubs</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
