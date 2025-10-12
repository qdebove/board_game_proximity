const nextConfig = {
    experimental: {
        serverActions: {
        bodySizeLimit: '2mb',
        },
    },
    images: {
        remotePatterns: [
        {
            protocol: 'https',
            hostname: '**.boardgamegeek.com',
        },
        {
            protocol: 'https',
            hostname: 'images.unsplash.com',
        },
        ],
    },
    i18n: {
        defaultLocale: 'fr',
        locales: ['fr', 'en'],
    },
};

export default nextConfig;