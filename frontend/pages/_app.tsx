import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Chatbot } from "../components/Chatbot";

export default function MantleAtlasApp({
  Component,
  pageProps,
}: AppProps): JSX.Element {
  return (
    <main className="font-sans antialiased text-slate-100 bg-dark-900 min-h-screen selection:bg-mantle-500/30 selection:text-white">
      <Component {...pageProps} />
      <Chatbot />
    </main>
  );
}
