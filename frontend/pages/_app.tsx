import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function MantleAtlasApp({
  Component,
  pageProps,
}: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}
