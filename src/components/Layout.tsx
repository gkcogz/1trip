import { Link } from 'react-router-dom';
import Topbar from './Topbar';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen pl-24">
      {/* --- DEĞİŞİKLİK BURADA: left-4 -> left-6 --- */}
      <Link to="/" title="Home" className="fixed top-4 left-6 z-50 print:hidden">
        <img
          src="/logo.png"
          alt="logo"
          className="h-10 w-10 rounded-full shadow-lg transition-transform hover:scale-110"
        />
      </Link>
      
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1">
            {children}
        </main>
      </div>
    </div>
  );
}