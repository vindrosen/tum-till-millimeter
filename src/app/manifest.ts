import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { withBase } from "@/lib/basepath";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: withBase("/"),
    scope: withBase("/"),
    display: "standalone",
    orientation: "portrait",
    background_color: "#f6f1e8",
    theme_color: "#1c7a43",
    lang: "sv-SE",
    categories: ["utilities", "reference", "productivity"],
    icons: [
      { src: withBase("/icons/icon-192.png"), sizes: "192x192", type: "image/png", purpose: "any" },
      { src: withBase("/icons/icon-512.png"), sizes: "512x512", type: "image/png", purpose: "any" },
      { src: withBase("/icons/maskable-192.png"), sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: withBase("/icons/maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
