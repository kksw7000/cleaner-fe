import { Link } from 'react-router-dom';
import { categoryLabels, categoryIcons, type ServiceCategory } from '../data/mockData';
import { slideshowPhotos } from '../data/photoData';

const categories = Object.keys(categoryLabels) as ServiceCategory[];

const heroImages: Record<ServiceCategory, string> = {
  MATTRESS: 'photo-1631049307264-da0ec9d70304',
  SOFA_CARPET: 'photo-1555041469-a586c61ea9bc',
  MOVE_IN: 'photo-1527515637462-cff94aca208b',
  APPLIANCE: 'photo-1630427804340-0b8524e85f25',
  CONSTRUCTION: 'photo-1504307651254-35680f356dfd',
  COMMERCIAL: 'photo-1497366216548-37526070297c',
  WAX_COATING: 'photo-1581578731548-c64695cc6952',
  REGULAR_CLEANING: 'photo-1563453392212-326f5e854473',
  ESTATE_CLEANING: 'photo-1614771637369-ed94441a651c',
};

const categoryDescriptions: Record<ServiceCategory, string> = {
  MATTRESS: 'UV sterilization and deep steam cleaning to eliminate dust mites, allergens, and bacteria.',
  SOFA_CARPET: 'High-pressure steam and hot water extraction for fabric sofas and wall-to-wall carpets.',
  MOVE_IN: 'Comprehensive top-to-bottom cleaning for your new home before or after moving.',
  APPLIANCE: 'Full disassembly and antibacterial wash for air conditioners and washing machines.',
  CONSTRUCTION: 'Specialized removal of construction dust, paint splatter, and debris.',
  COMMERCIAL: 'Professional cleaning for offices, retail spaces, and commercial facilities.',
  WAX_COATING: 'Floor wax and coating application for hardwood and tile, restoring gloss and protection.',
  REGULAR_CLEANING: 'Scheduled home maintenance cleaning covering all living areas, kitchen, and bathrooms.',
  ESTATE_CLEANING: 'Organization and thorough cleaning for estate situations and belongings sorting.',
};

export default function Services() {
  return (
    <div className="bg-white">
      {/* Page header */}
      <div className="bg-[#0B1F3A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-3">Professional Cleaning</p>
          <h1 className="text-4xl md:text-5xl font-black" style={{ fontFamily: 'Outfit' }}>Cleaning Services</h1>
          <p className="text-slate-300 mt-3 max-w-xl">Select a category to explore work photos, service details, and pricing.</p>
        </div>
      </div>

      {/* Categories grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/services/${cat.toLowerCase()}`}
              className="group relative overflow-hidden rounded-xl bg-[#0B1F3A] aspect-[4/3] flex items-end"
            >
              <img
                src={`https://images.unsplash.com/${heroImages[cat]}?w=700&h=525&fit=crop&auto=format`}
                alt={categoryLabels[cat]}
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/20 to-transparent" />
              <div className="relative p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{categoryIcons[cat]}</span>
                </div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit' }}>{categoryLabels[cat]}</h3>
                <p className="text-slate-300 text-sm mt-1 line-clamp-2">{categoryDescriptions[cat]}</p>
                <div className="mt-3 text-xs text-white/60 group-hover:text-white/90 transition-colors flex items-center gap-1">
                  View work photos →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#F8FAFC] border-t border-slate-200 py-14 text-center">
        <h2 className="text-2xl font-black text-[#0B1F3A] mb-3" style={{ fontFamily: 'Outfit' }}>Not sure which service you need?</h2>
        <p className="text-slate-500 mb-6 text-sm">Contact us for a free consultation — we'll recommend the right cleaning solution for your space.</p>
        <Link to="/reservation" className="inline-flex items-center gap-2 px-7 py-3 bg-[#0B1F3A] text-white font-semibold rounded text-sm hover:bg-[#060F1E] transition-colors">
          Get a Free Consultation
        </Link>
      </div>
    </div>
  );
}
