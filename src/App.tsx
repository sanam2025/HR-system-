// src/App.tsx
import AppRouter from './AppRouter';
import { LanguageProvider } from './i18n/LanguageContext';

function App() {
  return(
    <LanguageProvider>
     <AppRouter />;
    </LanguageProvider>
  )
}

export default App;