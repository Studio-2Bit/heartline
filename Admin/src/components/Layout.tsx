import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-screen-xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}