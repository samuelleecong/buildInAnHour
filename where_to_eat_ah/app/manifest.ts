import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Where To Eat Ah? - Singapore Hawker Centers',
    short_name: 'Where To Eat Ah?',
    description: 'Find open hawker centers in Singapore. Check real-time closure information for all Singapore hawker centers based on quarterly cleaning schedules and maintenance.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['food', 'travel', 'lifestyle', 'navigation'],
    shortcuts: [
      {
        name: 'View Map',
        short_name: 'Map',
        description: 'View hawker centers on map',
        url: '/',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Find Open Centers',
        short_name: 'Open Now',
        description: 'See all currently open hawker centers',
        url: '/?filter=open',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
    prefer_related_applications: false,
  };
}
