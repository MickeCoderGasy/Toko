import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Header } from '../Header';
import { ProductCard } from '../ProductCard';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'] & {
  profiles: { username: string; avatar_url: string | null } | null;
};

export function SearchView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [condition, setCondition] = useState<string>('');

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchProducts();
    } else if (searchQuery.length === 0) {
      setProducts([]);
    }
  }, [searchQuery, minPrice, maxPrice, condition]);

  const searchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select(`
        *,
        profiles:seller_id (username, avatar_url)
      `)
      .eq('status', 'available')
      .ilike('title', `%${searchQuery}%`)
      .order('created_at', { ascending: false });

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }
    if (condition) {
      query = query.eq('condition', condition);
    }

    const { data } = await query.limit(50);
    if (data) setProducts(data);
    setLoading(false);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setCondition('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Rechercher" />

      <div className="sticky top-[57px] bg-white border-b border-gray-200 px-4 py-3 z-20">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des articles..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Prix min (Ar)
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Prix max (Ar)
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="1000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Toutes</option>
                <option value="new">Neuf</option>
                <option value="like_new">Comme neuf</option>
                <option value="good">Bon état</option>
                <option value="fair">État correct</option>
                <option value="worn">Usé</option>
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="w-full py-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      <div className="px-3 pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {searchQuery.length > 2 && products.length === 0 && !loading && (
              <div className="col-span-2 text-center py-12 text-gray-500">
                Aucun résultat trouvé
              </div>
            )}
            {searchQuery.length === 0 && (
              <div className="col-span-2 text-center py-12 text-gray-500">
                Entrez au moins 3 caractères pour rechercher
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
