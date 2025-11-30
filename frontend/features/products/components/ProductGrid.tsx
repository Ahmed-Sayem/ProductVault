import { Product } from "../types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

export const ProductGrid = ({ products, loading }: ProductGridProps) => {
  if (loading && products.length === 0) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-video bg-gray-200 rounded-xl"></div>
          ))}
        </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No products found.</p>
          <p className="text-sm text-gray-400 mt-1">Upload some images to get started!</p>
        </div>
    );
  }

  return (
      <div className="relative min-h-[400px]"> {}

        {/* --- LOADING OVERLAY --- */}
        {/* This appears ON TOP of the existing grid when loading is true */}
        {loading && (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl transition-all duration-300">
              <div className="flex flex-col items-center">
                {/* Tailwind Spinner */}
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-blue-600 font-semibold mt-2 text-sm">Loading page...</span>
              </div>
            </div>
        )}

        {/* --- THE GRID --- */}
        {/* We reduce opacity when loading, but we DO NOT remove it */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}>
          {products.map((product) => (
              <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
  );
};
