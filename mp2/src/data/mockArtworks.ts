import { Artwork } from '../types/art';

// Using Picsum to simulate artwork images.
// Replace imageUrl later with the real AIC IIIF URLs.
export const MOCK_ARTWORKS: Artwork[] = [
  { id: 1, title: 'The Bedroom', artist: 'Vincent van Gogh', date: '1889', department: 'European Painting', medium: 'Oil on canvas', imageUrl: 'https://picsum.photos/seed/aic1/800/1000', hasImage: true },
  { id: 2, title: 'Self-Portrait', artist: 'Vincent van Gogh', date: '1887', department: 'European Painting', medium: 'Oil on canvas', imageUrl: 'https://picsum.photos/seed/aic2/800/900', hasImage: true },
  { id: 3, title: 'Water Lilies', artist: 'Claude Monet', date: '1906', department: 'European Painting', medium: 'Oil on canvas', imageUrl: 'https://picsum.photos/seed/aic3/800/950', hasImage: true },
  { id: 4, title: 'American Gothic', artist: 'Grant Wood', date: '1930', department: 'American Art', medium: 'Oil on beaverboard', imageUrl: 'https://picsum.photos/seed/aic4/800/1100', hasImage: true },
  { id: 5, title: 'Untitled (Film Still)', artist: 'Cindy Sherman', date: '1979', department: 'Photography', medium: 'Gelatin silver print', imageUrl: 'https://picsum.photos/seed/aic5/800/1200', hasImage: true },
  { id: 6, title: 'The Old Guitarist', artist: 'Pablo Picasso', date: '1903', department: 'European Painting', medium: 'Oil on panel', imageUrl: 'https://picsum.photos/seed/aic6/800/980', hasImage: true },
  { id: 7, title: 'Nighthawks', artist: 'Edward Hopper', date: '1942', department: 'American Art', medium: 'Oil on canvas', imageUrl: 'https://picsum.photos/seed/aic7/800/1000', hasImage: true },
  { id: 8, title: 'The Banjo Lesson', artist: 'Henry Ossawa Tanner', date: '1893', department: 'American Art', medium: 'Oil on canvas', imageUrl: 'https://picsum.photos/seed/aic8/800/900', hasImage: true },
  { id: 9, title: 'Broadway Boogie Woogie', artist: 'Piet Mondrian', date: '1943', department: 'Modern Art', medium: 'Oil on canvas', imageUrl: 'https://picsum.photos/seed/aic9/800/1000', hasImage: true },
  { id: 10, title: 'Campbell’s Soup Cans', artist: 'Andy Warhol', date: '1962', department: 'Modern Art', medium: 'Synthetic polymer paint', imageUrl: 'https://picsum.photos/seed/aic10/800/950', hasImage: true },
  { id: 11, title: 'Dunes', artist: 'Ansel Adams', date: '1948', department: 'Photography', medium: 'Gelatin silver print', imageUrl: 'https://picsum.photos/seed/aic11/800/1050', hasImage: true },
  { id: 12, title: 'The Great Wave', artist: 'Katsushika Hokusai', date: '1831', department: 'Prints & Drawings', medium: 'Woodblock print', imageUrl: 'https://picsum.photos/seed/aic12/800/950', hasImage: true }
];

// Simple helper to get unique departments from mock data
export const DEPARTMENTS = Array.from(new Set(MOCK_ARTWORKS.map(a => a.department))).sort();
