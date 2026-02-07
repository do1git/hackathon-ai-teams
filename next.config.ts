import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
    transpilePackages: ["@moru-ai/core"],
};

export default nextConfig;
