import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { AuthModal } from './components/AuthModal';
import { HomeView } from './components/views/HomeView';
import { SearchView } from './components/views/SearchView';
import { SellView } from './components/views/SellView';
import { FavoritesView } from './components/views/FavoritesView';
import { ProfileView } from './components/views/ProfileView';

type View = 'home' | 'search' | 'sell' | 'favorites' | 'profile';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleAuthRequired = () => {
    setAuthModalOpen(true);
    setAuthMode('login');
  };

  const handleSellSuccess = () => {
    setCurrentView('home');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'search':
        return <SearchView />;
      case 'sell':
        return <SellView onSuccess={handleSellSuccess} onAuthRequired={handleAuthRequired} />;
      case 'favorites':
        return <FavoritesView onAuthRequired={handleAuthRequired} />;
      case 'profile':
        return <ProfileView onAuthRequired={handleAuthRequired} />;
      default:
        return <HomeView />;
    }
  };

  return (
    <AuthProvider>
      <Layout currentView={currentView} onNavigate={setCurrentView}>
        {renderView()}
      </Layout>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
      />
    </AuthProvider>
  );
}

export default App;
