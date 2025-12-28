import { ShoppingBag, Bell } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
  showNotifications?: boolean;
}

export function Header({ title, showLogo = false, showNotifications = false }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-30">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {showLogo ? (
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-teal-600" />
            <span className="text-xl font-bold text-gray-900">Toko</span>
          </div>
        ) : (
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        )}

        {showNotifications && (
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        )}
      </div>
    </header>
  );
}
