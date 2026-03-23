import { LanguageIcon } from '../ui/LanguageIcon';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const navItems = ['Tool', 'Download', 'About'];

  return (
    <header className="flex items-center justify-between px-4 py-4 border-b border-border bg-bg">
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setCurrentPage('Tool')}
      >
        <LanguageIcon className="w-8 h-8 text-accent transition-transform duration-200 group-hover:scale-110" />
        <span className="font-mono text-2xl font-medium text-accent tracking-tighter transition-colors duration-200 group-hover:text-white">Keyboard ReLay</span>
      </div>
      <nav className="flex gap-2">
        {navItems.map(item => (
          <button
            key={item}
            className={`nav-button ${currentPage === item ? 'active' : ''}`}
            onClick={() => setCurrentPage(item)}
          >
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
}
