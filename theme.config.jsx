/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-anonymous-default-export */

import Link from "next/link";
import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";

export default {
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter();
    const { frontMatter } = useConfig();
    const url =
      process.env.APP_URL +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

    return (
      <>
        <meta property="og:url" content={url} />
        <meta property="og:title" content={frontMatter.title || "SIPBUK"} />
        <meta
          property="og:description"
          content={frontMatter.description || "Sistem pakar jambu kristal"}
        />
      </>
    );
  },
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== "/") {
      return {
        titleTemplate: "%s - Dokumentasi SIPBUK",
      };
    }
  },
  banner: {
    text: () => {
      return (
        <span>
          🌿 Situs Resmi{" "}
          <Link href="/" className="text-blue-400">
            sipbuk.deri.my.id
          </Link>{" "}
          🌿
        </span>
      );
    },
    key: "official-website",
    dismissible: true,
  },
  faviconGlyph: "🌿",
  logo: <span>Dokumentasi SIPBUK</span>,
  logoLink: "/docs",
  docsRepositoryBase: `https://github.com/deri-kurniawan/sipbuk/tree/main`,
  search: {
    placeholder: "Cari Dokumentasi...",
    emptyResult: () => (
      <span class="nx-block nx-select-none nx-p-8 nx-text-center nx-text-sm nx-text-gray-400">
        Tidak ada hasil yang ditemukan
      </span>
    ),
  },
  project: {
    link: "https://github.com/deri-kurniawan/sipbuk",
  },
  feedback: {
    labels: "documentation",
    content: "Saran dan masukan",
  },
  editLink: {
    text: "Edit halaman ini",
  },
  themeSwitch: {
    useOptions() {
      return {
        light: "Terang",
        dark: "Gelap",
        system: "Sistem",
      };
    },
  },
  gitTimestamp: ({ timestamp }) => (
    <p>
      Terakhir diperbarui pada{" "}
      {new Date(timestamp).toLocaleDateString("id-ID", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}
    </p>
  ),
  navigation: {
    prev: true,
    next: true,
  },
  footer: {
    text: (
      <p>
        Copyright ©2022-{new Date().getFullYear()}{" "}
        <Link href="/" className="text-blue-400">
          SIPBUK
        </Link>
        . All right reserved.
      </p>
    ),
  },
};
