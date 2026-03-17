import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";

type NavigationItem = {
  href: string;
  label: string;
};

type DashboardLayoutProps = {
  title: string;
  description: string;
  activePath: string;
  children: ReactNode;
};

const navigationItems: NavigationItem[] = [
  { href: "/", label: "Home" },
  { href: "/ecosystem", label: "Ecosystem" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/insights", label: "Insights" },
];

export default function DashboardLayout({
  title,
  description,
  activePath,
  children,
}: DashboardLayoutProps): JSX.Element {
  return (
    <>
      <Head>
        <title>{`Mantle Atlas | ${title}`}</title>
        <meta name="description" content={description} />
      </Head>

      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <header className="mb-10 flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-400">
                Mantle Atlas
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">{title}</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400">
                {description}
              </p>
            </div>

            <nav className="flex flex-wrap gap-3 text-sm">
              {navigationItems.map((item) => {
                const isActive = item.href === activePath;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg border px-4 py-2 transition ${
                      isActive
                        ? "border-teal-500 bg-teal-500/10 text-teal-300"
                        : "border-slate-700 text-slate-300 hover:border-teal-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          {children}
        </div>
      </main>
    </>
  );
}
