import { useState } from 'react';
import './App.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Header from './components/Header';
import Footer from './components/Footer';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {
  const [user] = useAuthState(auth);
  const [page, setPage] = useState('home');

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const handleLogout = () => {
    signOut(auth);
    setPage('home');
  };

  const goHome = () => setPage('home');
  const goProfile = () => setPage('profile');

  const renderContent = () => {
    if (!user) return <Auth onLogin={handleLogin} />;
    if (page === 'profile') return <Profile user={user} onBack={goHome} />;
    return <Home />;
  };

  return (
    <div className="app">
      <Header
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onProfile={goProfile}
      />
      <main>{renderContent()}</main>
      <Footer />
    </div>
  );
}

export default App;