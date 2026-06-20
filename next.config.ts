import type { NextConfig } from "next";

// No `output: "standalone"` here — the Netlify Next.js plugin (@netlify/plugin-nextjs)
// generates its own serverless functions from `.next` and explicitly recommends
// against standalone output. Local dev (`next dev`) is unaffected.
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
