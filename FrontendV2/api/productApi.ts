import { fetchProducts, type CatalogProduct } from '../lib/api';
import { Product } from '../types/Product';

function mapCatalogProduct(item: CatalogProduct): Product {
  return {
    id: item.id,
    title: item.name,
    price: item.price,
    description: item.description,
    image: item.imageUrl,
    name: item.name,
    imageUrl: item.imageUrl,
    modelSlug: item.modelSlug,
    category: item.category,
  };
}

export const searchProducts = async (query: string): Promise<Product[]> => {
  const products = await fetchProducts(query);
  return products.map(mapCatalogProduct);
};

export const fetchCatalogProducts = async (): Promise<Product[]> => {
  const products = await fetchProducts();
  return products.map(mapCatalogProduct);
};
