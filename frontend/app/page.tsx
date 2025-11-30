"use client";

import { useProducts } from "@/features/products/hooks/useProducts";
import { UploadWidget } from "@/features/products/components/UploadWidget";
import { ProductGrid } from "@/features/products/components/ProductGrid";

export default function Home() {
  const {
    products,
    loading,
    totalPages,
    currentPage,
    changePage,
    refresh
  } = useProducts(6);

  return (
      <main className="min-h-screen p-8 bg-gray-50 text-gray-800 font-sans">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-8 text-blue-600 tracking-tight">
            Product Vault
          </h1>

          <UploadWidget onUploadSuccess={refresh} />

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">Product Gallery</h2>

            <ProductGrid products={products} loading={loading} />

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">

                  <button
                      onClick={() => changePage(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                      <button
                          key={i}
                          onClick={() => changePage(i)}
                          className={`px-4 py-2 text-sm rounded-lg border transition ${
                              currentPage === i
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {i + 1}
                      </button>
                  ))}

                  <button
                      onClick={() => changePage(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                      className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
            )}
          </div>
        </div>
      </main>
  );
}
