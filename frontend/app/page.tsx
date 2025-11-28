"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // How many images per page

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setStatus("Error: Could not connect to backend.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
      setStatus("");
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      setStatus("Uploading...");

      await axios.post("http://localhost:8080/api/products/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percent);
        },
      });

      setStatus("Upload Successful!");
      setFiles(null);
      setUploadProgress(100);

      fetchProducts();

      setTimeout(() => setUploadProgress(0), 2000);

    } catch (error) {
      console.error(error);
      setStatus("Upload Failed.");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
      <main className="min-h-screen p-8 bg-gray-50 text-gray-800 font-sans">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-8 text-blue-600 tracking-tight">
            Product Vault
          </h1>

          {/* --- UPLOAD SECTION --- */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-10 transition hover:shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Bulk Upload</h2>

            <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
              <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 cursor-pointer"
              />
              <button
                  onClick={handleUpload}
                  disabled={!files || files.length === 0}
                  className="w-full sm:w-auto bg-blue-600 text-white px-8 py-2.5 rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium shadow-sm"
              >
                Start Upload
              </button>
            </div>

            {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                  <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
            )}

            {status && (
                <p className={`text-sm font-medium ${status.includes("Failed") || status.includes("Error") ? "text-red-500" : "text-green-600"}`}>
                  {status} {uploadProgress > 0 && uploadProgress < 100 && `(${uploadProgress}%)`}
                </p>
            )}
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700">Product Gallery</h2>
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
              Total: {products.length}
            </span>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  No products found. Upload some images above!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentItems.map((product) => (
                      <div key={product.id} className="group border border-gray-200 rounded-xl p-4 hover:shadow-lg transition duration-300 bg-white">

                        <a
                            href={product.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block aspect-video bg-gray-50 mb-4 rounded-lg overflow-hidden relative"
                        >
                          <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Error+Loading";
                              }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                            <span className="text-white text-sm font-medium border border-white/50 px-3 py-1 rounded-full backdrop-blur-sm">View Full Size</span>
                          </div>
                        </a>

                        <div className="space-y-1">
                          <h3 className="font-semibold text-gray-800 truncate" title={product.name}>
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500">ID: {product.id} • {product.description}</p>
                        </div>
                      </div>
                  ))}
                </div>
            )}

            {products.length > itemsPerPage && (
                <div className="flex justify-center gap-2 mt-10">
                  <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 text-sm rounded-lg border transition ${
                              currentPage === page
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                  ))}

                  <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50 disabled:opacity-50"
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
