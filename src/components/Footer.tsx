import { Link } from 'react-router-dom';
import { categoryLabels, type ServiceCategory } from '../data/mockData';

const categories = Object.keys(categoryLabels) as ServiceCategory[];

export default function Footer() {
  return (
    <footer className="bg-[#060F1E] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-white text-sm font-black" style={{ fontFamily: 'Outfit' }}>C</span>
              </div>
              <span className="font-bold text-lg text-white tracking-wide" style={{ fontFamily: 'Outfit' }}>CLEANER</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Professional cleaning services with proven results. Trusted by thousands of homes and businesses nationwide.
            </p>
            <div className="mt-6 text-xs text-slate-500">
              <p>Mon–Sat: 08:00 – 18:00</p>
              <p className="mt-1">📞 02-0000-0000</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4" style={{ fontFamily: 'Outfit' }}>Services</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <Link to={`/services/${cat.toLowerCase()}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {categoryLabels[cat]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More services */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4" style={{ fontFamily: 'Outfit' }}>More</h4>
            <ul className="space-y-2">
              {categories.slice(6).map((cat) => (
                <li key={cat}>
                  <Link to={`/services/${cat.toLowerCase()}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {categoryLabels[cat]}
                  </Link>
                </li>
              ))}
              <li><Link to="/portfolio" className="text-sm text-slate-400 hover:text-white transition-colors">Work Portfolio</Link></li>
              <li><Link to="/board" className="text-sm text-slate-400 hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4" style={{ fontFamily: 'Outfit' }}>Company</h4>
            <ul className="space-y-2">
              <li><Link to="/company" className="text-sm text-slate-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/reservation" className="text-sm text-slate-400 hover:text-white transition-colors">Book a Service</Link></li>
              <li><Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/signup" className="text-sm text-slate-400 hover:text-white transition-colors">Sign Up</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Cleaner Co. All rights reserved.</p>
          <p>Professional Cleaning Services · Seoul, Korea</p>
        </div>
      </div>
    </footer>
  );
}
