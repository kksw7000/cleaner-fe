import { Link } from 'react-router-dom';

const milestones = [
  { year: '2018', text: 'Cleaner Co. founded with a team of 5 in Seoul.' },
  { year: '2020', text: 'Expanded to commercial and post-construction cleaning.' },
  { year: '2022', text: 'Reached 1,000 completed projects. Launched online booking.' },
  { year: '2024', text: 'Team grew to 40+ certified technicians nationwide.' },
  { year: '2026', text: 'Over 2,400 projects completed. 98% customer satisfaction.' },
];

export default function Company() {
  return (
    <div className="bg-white">
      <div className="relative bg-[#0B1F3A] text-white overflow-hidden">
        <img src="https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1400&h=500&fit=crop&auto=format" alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-3">About Us</p>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'Outfit' }}>Who We Are</h1>
          <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
            Founded in 2018, Cleaner Co. is one of Korea's most trusted professional cleaning companies. We combine certified expertise with a relentless commitment to quality across every service category.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl font-black text-[#0B1F3A] mb-6" style={{ fontFamily: 'Outfit' }}>Our Mission</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We believe everyone deserves to live and work in a clean, healthy environment. Our mission is to deliver professional cleaning results that are reliable, repeatable, and backed by real experience.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Every technician on our team is certified, background-checked, and trained in the specific techniques required for each cleaning category. We don't cut corners — and our portfolio of 200+ work photos proves it.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Whether it's a single mattress or an entire commercial floor, we bring the same level of precision and care to every job.
            </p>
            <div className="mt-8">
              <Link to="/reservation" className="inline-flex items-center gap-2 px-7 py-3 bg-[#0B1F3A] text-white font-bold rounded text-sm hover:bg-[#060F1E] transition-colors">
                Book a Service
              </Link>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-3xl font-black text-[#0B1F3A] mb-8" style={{ fontFamily: 'Outfit' }}>Our History</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
              <div className="space-y-8">
                {milestones.map((m) => (
                  <div key={m.year} className="flex gap-6 pl-2">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center text-xs font-bold shrink-0" style={{ fontFamily: 'Outfit' }}>
                        {m.year.slice(2)}
                      </div>
                    </div>
                    <div className="pt-1">
                      <div className="text-xs font-bold text-[#0B1F3A] mb-1 uppercase tracking-wider" style={{ fontFamily: 'Outfit' }}>{m.year}</div>
                      <p className="text-slate-600 text-sm leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team photo strip */}
      <div className="bg-[#F8FAFC] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-[#0B1F3A] mb-8" style={{ fontFamily: 'Outfit' }}>Our Work Speaks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['photo-1581578731548-c64695cc6952','photo-1563453392212-326f5e854473','photo-1527515637462-cff94aca208b','photo-1617103996702-96ff29b1c467'].map((id) => (
              <div key={id} className="aspect-square overflow-hidden rounded-lg bg-slate-200">
                <img src={`https://images.unsplash.com/${id}?w=400&h=400&fit=crop&auto=format`} alt="Work photo" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
