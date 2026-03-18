interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const navItems = ['Tool', 'Download', 'About'];

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-bg">
      <div>
        <span className="font-mono text-xl font-bold text-accent tracking-tighter">Keyboard ReLay</span>
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
