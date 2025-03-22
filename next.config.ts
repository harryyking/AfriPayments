import { NextConfig } from "next";

const nextConfig: NextConfig = {

    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'utfs.io', // Add the hostname
            pathname: '/f/**',     // Allow all paths under this domain
          },
        ],
      },
};

export default nextConfig;
