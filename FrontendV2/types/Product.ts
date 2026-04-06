export interface Product {
  id: number;
  title: string;
  price: number | string;
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
    price: number | string;
    description: string;
    thumbnail: string;
  }[];
}
