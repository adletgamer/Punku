import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Hay otros lockfiles en el equipo; fijamos la raiz para que Next no dude.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
