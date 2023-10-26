// next.config.js
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Load geojson files
    config.module.rules.push({
      test: /\.geojson$/,
      use: ['json-loader'],
    });

    return config;
  },
};

module.exports = nextConfig;
