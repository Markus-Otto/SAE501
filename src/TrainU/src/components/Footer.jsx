import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between text-xs text-slate-400">
        <span>© {new Date().getFullYear()} TrainU</span>
        <div className="flex items-center gap-3">
          <Link
            to="/mentions-legales"
            className="hover:text-slate-200 transition-colors duration-200 cursor-pointer"
          >
            Mentions légales
          </Link>
          <span className="hover:text-slate-200 transition-colors duration-200 cursor-pointer">Contact</span>
        </div>
      </div>
    </footer>
  );
}
