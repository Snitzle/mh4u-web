import type { NextConfig } from "next";

const assetHost = process.env.NEXT_PUBLIC_ASSET_HOST ?? "localhost";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: assetHost, port: "8088", pathname: "/assets/**" },
      { protocol: "http", hostname: assetHost, pathname: "/assets/**" },
      { protocol: "https", hostname: assetHost, pathname: "/assets/**" },
    ],
  },
};

export default nextConfig;
