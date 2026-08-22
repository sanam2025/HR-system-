import AppRouter from './AppRouter';
import { LanguageProvider } from './i18n/translations/LanguageContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <LanguageProvider>
      <AppRouter />
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={10}
        containerStyle={{ zIndex: 9999999 }}
        toastOptions={{
          duration: 4500,
          style: {
            background: '#ffffff',
            color: '#1E293B',
            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            borderRadius: '16px',
            padding: '14px 20px',
            fontSize: '14px',
            fontWeight: '600',
            maxWidth: '480px',
            fontFamily: 'Tajawal, Cairo, sans-serif',
            zIndex: 9999999,
            direction: 'rtl',
          },
          success: {
            duration: 4000,
            style: {
              background: '#F0FDF4',
              color: '#15803D',
              border: '1px solid #BBF7D0',
            },
            iconTheme: {
              primary: '#22C55E',
              secondary: '#FFFFFF',
            },
          },
          error: {
            duration: 6000,
            style: {
              background: '#FEF2F2',
              color: '#991B1B',
              border: '1px solid #FECACA',
            },
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </LanguageProvider>
  );
}

export default App;