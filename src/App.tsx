import { useState } from 'react';
import Layout from './components/layout/Layout';
import Tool from './pages/Tool';
import Download from './pages/Download';
import About from './pages/About';

function App() {
  const [currentPage, setCurrentPage] = useState('Tool');

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {currentPage === 'Tool' && <Tool />}
      {currentPage === 'Download' && <Download />}
      {currentPage === 'About' && <About />}
    </Layout>
  );
}

export default App;
