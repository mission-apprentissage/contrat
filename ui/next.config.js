/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const path = require("path");
const { withPlausibleProxy } = require("next-plausible");
const { withSentryConfig } = require("@sentry/nextjs");

function inline(value) {
  return value.replace(/\s{2,}/g, " ").trim();
}

const contentSecurityPolicy = `
      default-src 'self' https://plausible.io;
      base-uri 'self';
      block-all-mixed-content;
      font-src 'self' https: data:;
      frame-ancestors 'self';
      frame-src 'self' https://plausible.io;
      img-src 'self' https://www.notion.so data: ;
      object-src 'none';
      script-src 'self' https://plausible.io 'unsafe-inline' ${
        process.env.NEXT_PUBLIC_ENV === "local" ? "'unsafe-eval'" : ""
      };
      script-src-attr 'none';
      style-src 'self' https:  https: *.plausible.io 'unsafe-inline';
      connect-src 'self' https://geo.api.gouv.fr/ https://plausible.io  https://sentry.apprentissage.beta.gouv.fr ${
        process.env.NEXT_PUBLIC_ENV === "local" ? "http://localhost:5001/" : ""
      };
      upgrade-insecure-requests;
`;

const nextConfig = {
  transpilePackages: ["shared"],
  poweredByHeader: false,
  swcMinify: true,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../"),
    // typedRoutes: true,
  },
  output: "standalone",
  sentry: {
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
    hideSourceMaps: false,
    widenClientFileUpload: true,
  },

  async redirects() {
    return [
      {
        source: "/cgu",
        destination: "https://cfas.apprentissage.beta.gouv.fr/cgu",
        permanent: true,
      },
      {
        source: "/mentions-legales",
        destination: "https://cfas.apprentissage.beta.gouv.fr/mentions-legales",
        permanent: true,
      },
      {
        source: "/politique-confidentialite",
        destination: "https://cfas.apprentissage.beta.gouv.fr/politique-de-confidentialite",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: inline(contentSecurityPolicy),
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.woff2$/,
      type: "asset/resource",
    });
    return config;
  },
};

// const sentryWebpackPluginOptions = {
//   org: "sentry",
//   project: "contrat-ui",
//   url: "https://sentry.apprentissage.beta.gouv.fr",

//   // An auth token is required for uploading source maps.
//   // You can get an auth token from https://sentry.io/settings/account/api/auth-tokens/
//   // The token must have `project:releases` and `org:read` scopes for uploading source maps
//   authToken: process.env.SENTRY_AUTH_TOKEN,

//   silent: true, // Suppresses all logs

//   disable: !process.env.SENTRY_RELEASE,

//   release: {
//     name: version,
//     setCommits: {
//       auto: true,
//     },
//     deploy: {

//     }
//   }

//   // For all available options, see:
//   // https://github.com/getsentry/sentry-webpack-plugin#options.
// };

module.exports = withSentryConfig(
  withPlausibleProxy()(nextConfig)
  // sentryWebpackPluginOptions,
);
