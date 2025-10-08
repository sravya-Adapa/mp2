// src/types/art.ts
export type SortKey = 'title' | 'date';
export type SortDir = 'asc' | 'desc';

export interface Artwork {
  id: number;
  title: string;
  artist: string;
  date: string;
  department: string;
  medium: string;
  imageUrl: string;   // IIIF url
  hasImage: boolean;
}
