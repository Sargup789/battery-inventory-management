import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query';
import "public/static/scss/GlobalStyleSheet.scss"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { getTokenCookie } from '@/lib/auth-cookie';
import jwtDecode from 'jwt-decode';
import { DecodedToken } from '@/components/general/withLogin';
import { appWithTranslation } from 'next-i18next';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const token = getTokenCookie(null);
  let userRoles;
  if (token) {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      userRoles = decodedToken.roles;
    } catch (error) {
      console.error("Error decoding token", error);
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} roles={userRoles} />
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnHover />
    </QueryClientProvider>
  );
}

export default appWithTranslation(MyApp);
