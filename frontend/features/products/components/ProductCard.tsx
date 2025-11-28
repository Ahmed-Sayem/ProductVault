import { Product } from "../types";

export const ProductCard = ({ product }: { product: Product }) => {
  return (
      <div className="group border border-gray-200 rounded-xl p-4 hover:shadow-lg transition bg-white">
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
              onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=No+Image")}
          />
        </a>
        <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-xs text-gray-500">ID: {product.id} • {product.description}</p>
      </div>
  );
};
