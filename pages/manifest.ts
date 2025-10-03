import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'QuepacsKasih',
    short_name: 'QuepacsKasih',
    description: 'QuepacsKasih PWA',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    icons: [
      {
      src: "/icons/web-app-manifest-192x192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "/icons/web-app-manifest-512x512.png",
      sizes: "512x512",
      type: "image/png"
    },
    ],
  }
}