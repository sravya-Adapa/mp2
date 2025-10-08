// src/services/aic.ts
import axios from 'axios';

export const AIC_BASE = 'https://api.artic.edu/api/v1';
export const AIC_IIIF_BASE = 'https://www.artic.edu/iiif/2';

// Centralized placeholder (HTTPS)
export const PLACEHOLDER_IMG =
  'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';

export const AIC_FIELDS = [
  'id',
  'title',
  'artist_display',
  'date_display',
  'department_title',
  'medium_display',
  'image_id',
  'is_public_domain',
  'thumbnail',
].join(',');

export type AicApiArtwork = {
  id: number;
  title: string;
  artist_display?: string | null;
  date_display?: string | null;
  department_title?: string | null;
  medium_display?: string | null;
  image_id?: string | null;
  is_public_domain?: boolean | null;
  thumbnail?: { lqip?: string | null } | null;
};

export type AicListResponse = {
  data: AicApiArtwork[];
  pagination?: { total?: number; current_page?: number; total_pages?: number };
};

export type AicDetailResponse = { data: AicApiArtwork };

/** Build a display image URL from an IIIF image_id. width is optional (px). */
export function buildImageUrl(image_id?: string | null, width = 600) {
  if (!image_id) return PLACEHOLDER_IMG;
  return `${AIC_IIIF_BASE}/${image_id}/full/${width},/0/default.jpg`;
}

export async function browseArtworks(page = 1, limit = 24): Promise<AicListResponse> {
  const url = `${AIC_BASE}/artworks?fields=${AIC_FIELDS}&page=${page}&limit=${limit}`;
  const { data } = await axios.get<AicListResponse>(url);
  return data;
}

export async function searchArtworks(q: string, page = 1, limit = 24): Promise<AicListResponse> {
  const url = `${AIC_BASE}/artworks/search?q=${encodeURIComponent(q)}&fields=${AIC_FIELDS}&page=${page}&limit=${limit}`;
  const { data } = await axios.get<AicListResponse>(url);
  return data;
}

export async function fetchArtwork(id: number): Promise<AicApiArtwork | null> {
  const url = `${AIC_BASE}/artworks/${id}?fields=${AIC_FIELDS}`;
  const { data } = await axios.get<AicDetailResponse>(url);
  return data?.data ?? null;
}

/** Normalize to a simple card shape. */
export function toCard(a: AicApiArtwork) {
  return {
    id: a.id,
    title: a.title ?? 'Untitled',
    artist: a.artist_display ?? '—',
    date: a.date_display ?? '',
    department: a.department_title ?? '',
    medium: a.medium_display ?? '',
    imageUrl: buildImageUrl(a.image_id, 800),
    hasImage: Boolean(a.image_id), // tells us if it's a real IIIF image
  };
}
