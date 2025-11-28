import { Product } from "../types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

export const ProductGrid = ({ products, loading }: ProductGridProps) => {
  if (loading) {
    return (
        <div className="text-center py-20 text-gray-500 animate-pulse">
          Loading products...
        </div>
    );
  }

  if (products.length === 0) {
    return (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No products found.</p>
          <p className="text-sm text-gray-400 mt-1">Upload some images to get started!</p>
        </div>
    );
  }

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
      </div>
  );
};
