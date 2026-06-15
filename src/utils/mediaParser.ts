import { SingerProfile } from '../types';

export type MediaType = 'image' | 'youtube' | 'instagram';

export interface ParsedMedia {
  type: MediaType;
  url: string;
  embedUrl: string;
}

export function parseMediaUrl(url: string): ParsedMedia {
  if (!url) return { type: 'image', url, embedUrl: url };

  // Detect YouTube
  // Match youtube.com/watch?v=ID or youtu.be/ID
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      url,
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`
    };
  }

  // Detect Instagram
  // Math instagram.com/p/ID or instagram.com/reel/ID
  const igMatch = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/i);
  if (igMatch && igMatch[1]) {
    // /embed endpoint from Instagram
    return {
      type: 'instagram',
      url,
      embedUrl: `https://www.instagram.com/p/${igMatch[1]}/embed`
    };
  }

  // Default to image
  return {
    type: 'image',
    url,
    embedUrl: url
  };
}

export function getFirstImage(gallery: string[], defaultFallback: string): string {
  for (const url of gallery) {
    if (parseMediaUrl(url).type === 'image') return url;
  }
  return defaultFallback;
}

export function getNthImage(gallery: string[], n: number, defaultFallback: string): string {
  const images = gallery.filter(url => parseMediaUrl(url).type === 'image');
  if (images.length > n) {
    return images[n];
  }
  if (images.length > 0) {
    return images[0];
  }
  return defaultFallback;
}

export function encodeProfile(profile: SingerProfile): string {
  try {
    const jsonStr = JSON.stringify(profile);
    return btoa(encodeURIComponent(jsonStr));
  } catch (e) {
    console.error('Error encoding profile:', e);
    return '';
  }
}

export function decodeProfile(encoded: string): SingerProfile | null {
  try {
    const jsonStr = decodeURIComponent(atob(encoded));
    return JSON.parse(jsonStr) as SingerProfile;
  } catch (e) {
    console.error('Error decoding profile:', e);
    return null;
  }
}

export function getShareUrl(profile: SingerProfile): string {
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  const encoded = encodeProfile(profile);
  return `${baseUrl}?singer=${profile.username}&pdata=${encoded}`;
}

