import { Link } from 'react-router-dom';
import { categoryLabels, type ServiceCategory } from '../data/mockData';
import { slideshowPhotos } from '../data/photoData';

const categories = Object.keys(categoryLabels) as ServiceCategory[];

// Photos for the ON SITE strip — two rows with different selections
const row1Photos = [
  'photo-1631049307264-da0ec9d70304',
  'photo-1504307651254-35680f356dfd',
  'photo-1497366216548-37526070297c',
  'photo-1581578731548-c64695cc6952',
  'photo-1563453392212-326f5e854473',
  'photo-1527515637462-cff94aca208b',
  'photo-1630427804340-0b8524e85f25',
  'photo-1555041469-a586c61ea9bc',
  'photo-1617103996702-96ff29b1c467',
  'photo-1558618666-fcd25c85cd64',
];

const row2Photos = [
  'photo-1556912173-3bb406ef7e8a',
  'photo-1600607688969-a5bfcd646154',
  'photo-1600585154340-be6161a56a0c',
  'photo-1524758631624-e2822e304c36',
  'photo-1614771637369-ed94441a651c',
  'photo-1567538096630-e0c55bd6374c',
  'photo-1484101403633-562f891dc89a',
  'photo-1513161455079-7dc1de15ef3e',
  'photo-1626806787461-102c1bfaaea1',
  'photo-1616137466211-f939a420be84',
];

function OnSiteStrip() {
  // Double each array for seamless loop
  const r1 = [...row1Photos, ...row1Photos];
  const r2 = [...row2Photos, ...row2Photos];

  return (
    <section className="bg-[#060F1E] py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex items-baseline gap-4">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight" style={{ fontFamily: 'Outfit' }}>
            ON SITE
          </h2>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
            Real project photos
          </span>
        </div>
      </div>

      {/* Row 1 — right to left */}
      <div className="strip-track overflow-hidden mb-3" style={{ cursor: 'default' }}>
        <div className="strip-left flex gap-4" style={{ width: 'max-content' }}>
          {r1.map((id, i) => (
            <div
              key={`r1-${i}`}
              className="shrink-0 overflow-hidden rounded-md bg-slate-800"
              style={{ width: '220px', height: '220px' }}
            >
              <img
                src={`https://images.unsplash.com/${id}?w=440&h=440&fit=crop&auto=format`}
                alt=""
                draggable={false}
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — left to right */}
      <div className="strip-track overflow-hidden" style={{ cursor: 'default' }}>
        <div className="strip-right flex gap-4" style={{ width: 'max-content' }}>
          {r2.map((id, i) => (
            <div
              key={`r2-${i}`}
              className="shrink-0 overflow-hidden rounded-md bg-slate-800"
              style={{ width: '220px', height: '220px' }}
            >
              <img
                src={`https://images.unsplash.com/${id}?w=440&h=440&fit=crop&auto=format`}
                alt=""
                draggable={false}
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const strengths = [
  { n: '2,400+', label: 'Projects Completed', icon: '✓' },
  { n: '8+', label: 'Years in Business', icon: '◆' },
  { n: '98%', label: 'Customer Satisfaction', icon: '★' },
  { n: '9', label: 'Service Categories', icon: '⬛' },
];

const features = [
  { title: 'Certified Professionals', desc: 'Every technician is trained, certified, and background-checked for your safety and peace of mind.' },
  { title: 'Proven Results', desc: '200+ work photos document our track record — real projects, real transformations.' },
  { title: 'Flexible Scheduling', desc: 'Book online and choose from morning or afternoon slots, Monday through Saturday.' },
  { title: 'Satisfaction Guarantee', desc: "If you're not satisfied, we'll return to address any concerns at no extra charge." },
];

export default function Landing() {
  return (
    <div className="bg-white">
      {/* ── HERO ─────────────────────────────── */}
      <section className="relative bg-[#0B1F3A] text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&h=900&fit=crop&auto=format"
            alt="Professional cleaning"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/80 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-28 md:py-40">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-5">Professional Cleaning Services</p>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-6 tracking-tight" style={{ fontFamily: 'Outfit' }}>
              Proven.<br />
              Professional.<br />
              <span className="text-white/60">Pristine.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-lg">
              Over 2,400 completed projects. Mattresses to move-in cleans, appliances to commercial spaces — expert results every time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/reservation" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#0B1F3A] font-bold rounded text-sm hover:bg-slate-100 transition-colors tracking-wide">
                BOOK A SERVICE
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/30 text-white font-medium rounded text-sm hover:bg-white/5 transition-colors">
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ON SITE PHOTO STRIP ──────────────── */}
      <OnSiteStrip />

      {/* ── STATS BAR ─────────────────────────── */}
      <section className="bg-[#111827] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {strengths.map((s) => (
              <div key={s.label}>
                <div className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: 'Outfit' }}>{s.n}</div>
                <div className="text-xs text-slate-400 mt-1 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPANY INTRO ─────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-3">About Cleaner</p>
              <h2 className="text-3xl md:text-4xl font-black text-[#0B1F3A] mb-6 leading-tight" style={{ fontFamily: 'Outfit' }}>
                Eight Years of Precision Cleaning
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Founded in 2018, Cleaner Co. has grown from a small residential service to one of the most trusted professional cleaning companies in the region. Every job is approached with the same attention to detail.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Our certified technicians handle everything from delicate mattress sanitization to large-scale commercial and post-construction cleans — always on time, always thorough.
              </p>
              <Link to="/company" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1F3A] border-b-2 border-[#0B1F3A] pb-0.5 hover:text-slate-600 hover:border-slate-600 transition-colors">
                Learn About Us →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img src="https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500&h=600&fit=crop&auto=format" alt="Cleaning work" className="w-full aspect-[5/6] object-cover rounded-lg" />
              <div className="space-y-3 mt-8">
                <img src="https://images.unsplash.com/photo-1527515637462-cff94aca208b?w=500&h=400&fit=crop&auto=format" alt="Cleaning work" className="w-full aspect-square object-cover rounded-lg" />
                <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&h=300&fit=crop&auto=format" alt="Cleaning work" className="w-full aspect-video object-cover rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US ────────────────────────────── */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-3">Why Choose Us</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#0B1F3A]" style={{ fontFamily: 'Outfit' }}>The Cleaner Difference</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white border border-slate-200 rounded-lg p-6 hover:border-[#0B1F3A]/30 hover:shadow-sm transition-all">
                <div className="w-8 h-0.5 bg-[#0B1F3A] mb-4" />
                <h3 className="font-bold text-[#0B1F3A] mb-3 text-sm" style={{ fontFamily: 'Outfit' }}>{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO PREVIEW ─────────────────── */}
      <section className="py-20 bg-[#0B1F3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-2">Recent Work</p>
              <h2 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: 'Outfit' }}>Project Gallery</h2>
            </div>
            <Link to="/portfolio" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {slideshowPhotos.slice(5, 13).map((id, i) => (
              <Link to="/portfolio" key={id} className="group relative overflow-hidden rounded aspect-square bg-slate-800">
                <img
                  src={`https://images.unsplash.com/${id}?w=400&h=400&fit=crop&auto=format`}
                  alt={`Work photo ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 group-hover:opacity-80"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-[#0B1F3A] rounded-2xl p-12 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ fontFamily: 'Outfit' }}>Ready for a professional clean?</h2>
              <p className="text-slate-300">Contact us today for a free consultation and quote.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link to="/reservation" className="px-8 py-4 bg-white text-[#0B1F3A] font-bold rounded text-sm hover:bg-slate-100 transition-colors text-center tracking-wide">
                BOOK NOW
              </Link>
              <Link to="/services" className="px-8 py-4 border border-white/30 text-white font-medium rounded text-sm hover:bg-white/5 transition-colors text-center">
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
