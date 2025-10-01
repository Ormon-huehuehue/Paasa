export interface Slide {
  id: number;
  img: any; // This could be more specific if we know the exact type of require('../assets/...')
  description: string;
}
