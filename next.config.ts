import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // En esta maquina hay varios lockfiles y Next dudaba de cual era la raiz.
  // process.cwd() es la raiz del proyecto tanto al compilar aqui como en la nube,
  // y a diferencia de __dirname existe igual en CommonJS y en modulos ES.
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
