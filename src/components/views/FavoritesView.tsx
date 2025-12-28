import { useEffect, useState } from 'react';
import { Header } from '../Header';
import { ProductCard } from '../ProductCard';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'] & {
  profiles: { username: string; avatar_url: string | null } | null;
};

interface FavoritesViewProps {
  onAuthRequired: () => void;
}

export function FavoritesView({ onAuthRequired }: FavoritesViewProps) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      onAuthRequired();
      setLoading(false);
      return;
    }
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    setLoading(true);
    const { data: favorites } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);

    if (favorites && favorites.length > 0) {
      const productIds = favorites.map((f) => f.product_id);
      const { data } = await supabase
        .from('products')
        .select(`
          *,
          profiles:seller_id (username, avatar_url)
        `)
        .in('id', productIds)
        .eq('status', 'available');

      if (data) setProducts(data);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Favoris" />
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-6xl mb-4">💙</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Vos articles préférés
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Connectez-vous pour sauvegarder vos articles favoris
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Favoris" />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-6xl mb-4">💙</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Aucun favori pour le moment
          </h2>
          <p className="text-gray-600 text-center">
            Parcourez les articles et ajoutez-les à vos favoris
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-3 pt-4 pb-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
