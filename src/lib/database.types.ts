export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          avatar_url: string | null;
          location: string;
          bio: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name: string;
          avatar_url?: string | null;
          location?: string;
          bio?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string;
          avatar_url?: string | null;
          location?: string;
          bio?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          seller_id: string;
          category_id: string;
          title: string;
          description: string;
          price: number;
          condition: 'new' | 'like_new' | 'good' | 'fair' | 'worn';
          size: string | null;
          brand: string | null;
          images: string[];
          status: 'available' | 'sold' | 'reserved';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          category_id: string;
          title: string;
          description: string;
          price: number;
          condition: 'new' | 'like_new' | 'good' | 'fair' | 'worn';
          size?: string | null;
          brand?: string | null;
          images?: string[];
          status?: 'available' | 'sold' | 'reserved';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          category_id?: string;
          title?: string;
          description?: string;
          price?: number;
          condition?: 'new' | 'like_new' | 'good' | 'fair' | 'worn';
          size?: string | null;
          brand?: string | null;
          images?: string[];
          status?: 'available' | 'sold' | 'reserved';
          created_at?: string;
          updated_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
    };
  };
}
