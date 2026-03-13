import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function MainLayout({ user, setUser }) {
  return (
    <div className="app-shell">
      <Header user={user} setUser={setUser} />
      <main className="container page-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;