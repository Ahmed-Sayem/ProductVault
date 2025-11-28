"use client";

import { useProducts } from "@/features/products/hooks/useProducts";
import { ProductCard } from "@/features/products/components/ProductCard";
import { UploadWidget } from "@/features/products/components/UploadWidget";

export default function Home() {
  const { currentItems, totalPages, currentPage, setCurrentPage, refresh, loading } = useProducts();

  return (
      <main className="min-h-screen p-8 bg-gray-50 text-gray-800 font-sans">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-8 text-blue-600 tracking-tight">Product Vault</h1>

          {/* 1. Feature: Upload */}
          <UploadWidget onUploadSuccess={refresh} />

          {/* 2. Feature: List */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-6">Product Gallery</h2>

            {loading ? (
                <p>Loading products...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentItems.map((p) => (
                      <ProductCard key={p.id} product={p} />
                  ))}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 text-sm rounded-lg border transition ${
                              currentPage === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                  ))}
                </div>
            )}
          </div>
        </div>
      </main>
  );
}
