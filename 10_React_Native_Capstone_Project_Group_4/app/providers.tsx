/**
 * Providers - Root Context Providers (Paper, DesignMode, Auth, Cart)
 */
import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { DesignModeProvider } from '@/context/DesignModeContext';
import { PaperProvider } from 'react-native-paper';
import { theme } from '@/constants/theme';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PaperProvider theme={theme}>
      <DesignModeProvider>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </DesignModeProvider>
    </PaperProvider>
  );
}
