import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const mantleLinks = [
    { label: 'Mantle Network', href: 'https://www.mantle.xyz/' },
    { label: 'Documentation', href: 'https://docs.mantle.xyz/' },
    { label: 'Twitter', href: 'https://twitter.com/0xMantle' },
    { label: 'Discord', href: 'https://discord.com/invite/0xMantle' },
  ];

  return (
    <footer className="mt-32 pb-12 border-t border-white/5 pt-12 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <Link href="/">
            <h3 className="text-2xl font-black tracking-tighter text-white">
              Mantle <span className="text-accent-cyan">Atlas</span>
            </h3>
          </Link>
          <p className="text-sm text-slate-500 font-medium">
            © {currentYear} Mantle Atlas. All rights reserved.
          </p>
        </div>

        <div className="flex gap-8">
          {mantleLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-accent-cyan transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      
      <div className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-700/50">
        BUILT ON MANTLE NETWORK
      </div>
    </footer>
  );
}
