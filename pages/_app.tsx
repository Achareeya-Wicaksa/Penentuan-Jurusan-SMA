import { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import NextNProgressbar from "nextjs-progressbar";
import "@/styles/globals.css";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import { Analytics } from '@vercel/analytics/react';
import SafeLayout from "@/layouts/SafeLayout";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      <Analytics />
      <DefaultSeo
        description="."
        openGraph={{
          type: 'website',
          locale: 'id_ID',
          url: process.env.APP_URL + router.asPath,
          siteName: process.env.APP_NAME,
        }}
      />

      <NextNProgressbar
        color="#00D87F"
        height={5}
        showOnShallow={true}
        options={{ easing: "ease", speed: 500 }}
      />

      <Toaster
        position="bottom-left"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />

      <div className={inter.className}>
        <SafeLayout>
          <Component className={inter.className} {...pageProps} />
        </SafeLayout>
      </div>
    </>
  );
}
