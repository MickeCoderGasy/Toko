import { Heart } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'] & {
  profiles: { username: string; avatar_url: string | null } | null;
};

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    setLoading(true);
    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, product_id: product.id });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = product.images[0] || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    <div
      onClick={() => onSelect?.(product)}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <div className="relative aspect-[3/4] bg-gray-200">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        {user && (
          <button
            onClick={toggleFavorite}
            disabled={loading}
            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
              }`}
            />
          </button>
        )}
        <div className="absolute bottom-2 left-2">
          <span className="inline-block px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-semibold text-gray-900">
            {product.price.toLocaleString()} Ar
          </span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
          {product.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="capitalize">{product.condition.replace('_', ' ')}</span>
          {product.size && <span>Taille {product.size}</span>}
        </div>
      </div>
    </div>
  );
}
