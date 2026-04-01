export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  name?: string;
  imageUrl?: string;
  modelSlug?: string | null;
  category?: string | null;
}

export interface ApiResponse {
  products: {
    id: number;
    title: string;
    price: number;
    description: string;
    thumbnail: string;
  }[];
}
