import { useEffect, useState } from 'react';
import { LogOut, Package, MapPin, User as UserIcon } from 'lucide-react';
import { Header } from '../Header';
import { ProductCard } from '../ProductCard';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Product = Database['public']['Tables']['products']['Row'] & {
  profiles: { username: string; avatar_url: string | null } | null;
};

interface ProfileViewProps {
  onAuthRequired: () => void;
}

export function ProfileView({ onAuthRequired }: ProfileViewProps) {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      onAuthRequired();
      setLoading(false);
      return;
    }
    fetchProfile();
    fetchUserProducts();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) setProfile(data);
  };

  const fetchUserProducts = async () => {
    if (!user) return;

    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select(`
        *,
        profiles:seller_id (username, avatar_url)
      `)
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setProducts(data);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Profil" />
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Mon profil
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Connectez-vous pour voir votre profil
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Profil" />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile.username[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {profile.full_name}
              </h1>
              <p className="text-gray-600 mb-2">@{profile.username}</p>
              {profile.location && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </div>
              )}
            </div>
          </div>

          {profile.bio && (
            <p className="text-gray-700 mb-4">{profile.bio}</p>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-gray-600" />
              <span className="font-medium">{products.length}</span>
              <span className="text-gray-600">articles</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Mes articles</h2>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Package className="w-12 h-12 mb-3 text-gray-400" />
            <p>Vous n'avez pas encore d'articles</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
