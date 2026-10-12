import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "10.2.0.2",
    "172.28.0.1",
    "*.ngrok-free.app",
  ],
};

export default nextConfig;
