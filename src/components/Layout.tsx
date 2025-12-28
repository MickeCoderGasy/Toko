import { ReactNode } from 'react';
import { Home, Search, PlusCircle, Heart, User } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentView: 'home' | 'search' | 'sell' | 'favorites' | 'profile';
  onNavigate: (view: 'home' | 'search' | 'sell' | 'favorites' | 'profile') => void;
}

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Accueil' },
    { id: 'search' as const, icon: Search, label: 'Rechercher' },
    { id: 'sell' as const, icon: PlusCircle, label: 'Vendre' },
    { id: 'favorites' as const, icon: Heart, label: 'Favoris' },
    { id: 'profile' as const, icon: User, label: 'Profil' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {children}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-pb z-40">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center min-w-[64px] py-1 px-2 rounded-lg transition ${
                  isActive
                    ? 'text-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon
                  className={`w-6 h-6 mb-1 ${
                    item.id === 'sell' && isActive ? 'fill-teal-600' : ''
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
