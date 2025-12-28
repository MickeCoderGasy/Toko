import { useEffect, useState } from 'react';
import { Header } from '../Header';
import { ProductCard } from '../ProductCard';
import { CategoryFilter } from '../CategoryFilter';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'] & {
  profiles: { username: string; avatar_url: string | null } | null;
};

type Category = Database['public']['Tables']['categories']['Row'];

export function HomeView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select(`
        *,
        profiles:seller_id (username, avatar_url)
      `)
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(20);

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }

    const { data } = await query;
    if (data) setProducts(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showLogo showNotifications />

      <div className="px-4 py-4">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-3 pb-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-500">
              Aucun article disponible
            </div>
          )}
        </div>
      )}
    </div>
  );
}
