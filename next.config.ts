import type { NextConfig } from "next";

// basePath sätts vid bygget (GitHub Actions räknar ut det från repo-namnet).
// Tomt lokalt och för user-/domänsajter, "/repo-namn" för projekt-sajter.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Statisk export – krävs för GitHub Pages (ingen Node-server).
  output: "export",
  basePath,
  // GitHub Pages kan inte köra Next:s bildoptimerare.
  images: { unoptimized: true },
  // Ger snygga URL:er (out/sida/index.html) som Pages serverar rätt.
  trailingSlash: true,
};

export default nextConfig;
