import { useState } from 'react';
import { Menu, Plus, X } from 'lucide-react';

interface HeaderProps {
  onOpenComposer: () => void;
}

export function Header({ onOpenComposer }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '#videos', label: 'វីដេអូ' },
    { href: '#posts-story', label: 'រឿង' },
    { href: '#posts-song', label: 'បទចម្រៀង' },
    { href: '#posts-news', label: 'ព័ត៌មាន' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0B0D]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="text-lg font-bold tracking-tight text-[#F5F2EB] hover:text-[#D99B26] transition-colors whitespace-nowrap shrink-0"
        >
          តាមរឿង · Tam MOVIE
        </a>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#B8B4AB]" aria-label="ម៉ឺនុយចម្បង">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-[#F5F2EB] underline-offset-8 hover:underline decoration-[#D99B26] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenComposer}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] text-sm font-semibold rounded-lg bg-[#D99B26] text-[#0B0B0D] hover:bg-[#E5AA38] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D99B26] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>បង្ហោះមាតិកា</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/15 text-[#F5F2EB] hover:bg-white/5 cursor-pointer"
            aria-label={mobileOpen ? 'បិទម៉ឺនុយ' : 'បើកម៉ឺនុយ'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-white/10 bg-[#0B0B0D] px-4 py-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-[#D6D2C9] hover:text-[#F5F2EB] hover:bg-white/5 rounded-lg"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
