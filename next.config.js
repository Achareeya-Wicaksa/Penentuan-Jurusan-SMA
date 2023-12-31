const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
  basePath: "/docs",
});

/** @type {import('next').NextConfig} */
module.exports = withNextra({
  experimental: {
    appDir: !true,
  },
});
