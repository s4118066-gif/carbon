import React, { useState } from 'react';
import { MapPin, Search, Navigation, Info, Shield, Compass } from 'lucide-react';

export default function EcoMaps() {
  const [query, setQuery] = useState('recycling centers near me');
  const [city, setCity] = useState('Bangalore');
  
  const mapCategories = [
    { name: 'Recycling Centers', query: 'recycling centers near me', icon: '♻️' },
    { name: 'EV Chargers', query: 'ev charging stations near me', icon: '🔌' },
    { name: 'Organic Gardens', query: 'organic food markets and community gardens near me', icon: '🌱' },
    { name: 'Thrift & Second-Hand', query: 'second hand thrift stores near me', icon: '🛍️' },
  ];

  const handleCategorySelect = (q) => {
    setQuery(q);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      setQuery(`${query.split(' near ')[0]} near ${city}`);
    }
  };

  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="space-y-6 animate-fade-in p-1 lg:p-4">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="text-eco-accent h-6 w-6" />
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">Eco Locations</h1>
          </div>
          <p className="text-xs text-eco-text-muted mt-1 leading-relaxed">
            Locate sustainable infrastructure, EV hubs, recycling facilities, and eco-friendly hubs near you using Google Maps.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation & Search Menu */}
        <div className="glass-card p-6 rounded-2xl border border-eco-border/40 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-white font-display tracking-wide uppercase">Find Green Places</h2>
            
            {/* City Query Input */}
            <form onSubmit={handleSearchSubmit} className="space-y-2">
              <label htmlFor="cityInput" className="text-[10px] font-bold text-eco-text-muted uppercase">Target Location</label>
              <div className="relative">
                <input
                  id="cityInput"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city (e.g. Bangalore)"
                  className="w-full bg-eco-bg-dark border border-eco-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-eco-accent transition-all"
                />
                <Compass className="absolute left-3.5 top-3 h-4 w-4 text-eco-text-muted animate-spin-slow" />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-eco-accent hover:bg-eco-accent/80 text-white font-bold text-xs rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-eco-accent"
              >
                Set Location Context
              </button>
            </form>

            {/* Quick Categories */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-eco-text-muted uppercase block mb-1">Eco Categories</span>
              <div className="grid grid-cols-1 gap-2">
                {mapCategories.map((cat, idx) => {
                  const isActive = query.includes(cat.query.split(' near ')[0]);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleCategorySelect(cat.query)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isActive
                          ? 'bg-eco-accent border-emerald-500 text-white font-semibold'
                          : 'bg-eco-bg-dark/40 border-eco-border/30 text-eco-text-muted hover:text-white hover:bg-eco-card-light'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">{cat.icon}</span>
                        <span className="text-xs">{cat.name}</span>
                      </div>
                      <Navigation className="h-3 w-3 opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Compliance Badge */}
          <div className="p-4 bg-emerald-950/20 border border-eco-border/40 rounded-xl flex items-start gap-3 mt-4">
            <Shield className="h-5 w-5 text-eco-accent shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] text-eco-accent uppercase font-bold tracking-wider block">Google Services Integration</span>
              <p className="text-[9px] text-eco-text-muted leading-relaxed">
                This hub features native Google Maps positioning. Ensure browser location settings are enabled to permit localized coordinates.
              </p>
            </div>
          </div>
        </div>

        {/* Map View Frame */}
        <div className="glass-card p-4 rounded-2xl border border-eco-border/40 lg:col-span-2 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-semibold text-white">Live Search Query: <em className="text-eco-accent not-italic">"{query}"</em></span>
            <div className="flex items-center gap-1.5 text-[10px] text-eco-text-muted">
              <Info className="h-3.5 w-3.5" />
              <span>Interactive Map View</span>
            </div>
          </div>
          <div className="flex-1 w-full rounded-xl overflow-hidden border border-eco-border/40 bg-eco-bg-dark/30">
            <iframe
              title="Google Maps Eco Locations Search"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              src={embedUrl}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
