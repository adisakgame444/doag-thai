import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Doag Thai",
    short_name: "Doag Thai",
    description: "Doag Thai Official Store",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a7f3f",
    icons: [
      {
        src: "/icons/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
      {
        // src: "/icon-192.png",
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        // src: "/icon.png",
        src: "/icons/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
