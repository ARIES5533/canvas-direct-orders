
import { createRoot } from 'react-dom/client';
import { ArtworkProvider } from './context/ArtworkContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(
  <ArtworkProvider>
    <App />
  </ArtworkProvider>
);
