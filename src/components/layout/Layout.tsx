import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Layout({ children, currentPage, setCurrentPage }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 flex flex-col items-center px-8 py-4 animate-fade-up">{children}</main>
      <Footer />
    </div>
  );
}
