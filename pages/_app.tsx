import '../styles/globals.css';
import { AppProps } from 'next/app';
import { ChakraProvider, extendTheme, useDisclosure } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { DefaultSeo } from 'next-seo';
import { ReviewModalContext } from '../utils/ModalContext';

const theme = extendTheme({
  colors: {
    brand: {
      300: `#84C9FB`,
    },
  },
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps): React.ReactChild {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ScuffedMDB';
  const siteURI = process.env.NEXT_PUBLIC_APP_URI || 'https://www.movie.michael-hall.me';

  return (
    <>
      <DefaultSeo
        titleTemplate={'%s | ' + siteName}
        description={'A private movie rating website'}
        openGraph={{
          title: siteName,
          type: `website`,
          site_name: siteName,
          images: [
            {
              url: siteURI + `/sitePicture.png`,
              alt: `Profile Picture`,
            },
          ],
        }}
      />

        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <ReviewModalContext.Provider value={{ isOpen, onOpen, onClose }}>
              <Component {...pageProps} />
            </ReviewModalContext.Provider>
          </ChakraProvider>
        </QueryClientProvider>
    </>
  );
}

export default MyApp;
