import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function MantleAtlasApp({
  Component,
  pageProps,
}: AppProps): JSX.Element {
  return (
    <main className="font-sans antialiased text-slate-100 bg-dark-900 min-h-screen selection:bg-mantle-500/30 selection:text-white">
      <Component {...pageProps} />
    </main>
  );
}
