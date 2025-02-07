import {
  Box,
  chakra,
  useColorModeValue,
  Button,
  Icon,
  Flex,
  useColorMode,
} from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { SerializedMovieType } from '../../models/movie';

export const LandingPage: React.FC<{
  movie?: SerializedMovieType;
  desiredUser?: { username: string; image: string; _id: string };
}> = ({ movie, desiredUser }): React.ReactElement => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { user: userID, movie: movieID, review } = router.query;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ScuffedMDB';
  const seanQuotes = [
    "The premier user generated judgment service",
    "High quality reviews by low quality people",    
    "Pretentious films reviewed by peasants",    
    "The curated film review site for common folk",
    "#1 Unofficial Jeff Goldblum fan site portal"
  ];  
  const randomQuote = seanQuotes[Math.floor(Math.random()*seanQuotes.length)];

  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URI}/${
    userID && movieID ? `?movie=${movieID}&user=${userID}` : ''
  }${userID && !movieID ? `?user=${userID}` : ''}${
    !userID && movieID ? `?movie=${movieID}` : ''
  }${review ? `&review=${review}` : ''}`;

  return (
    <>
      <NextSeo
        title={movie?.name || desiredUser?.username || 'Welcome'}
        openGraph={{
          title: movie?.name
            ? `${movie?.name} on ${siteName}`
            : desiredUser?.username
            ? `${desiredUser?.username} on ${siteName}`
            : 'Welcome',
          type: `website`,
          site_name: siteName,
          images: [
            {
              width: 1920,
              height: 1080,
              url: movie?.image || desiredUser?.image || `/sitePicture.jpg`,
              alt: siteName + ' webpage',
            },
          ],
        }}
        description={movie?.description || 'A private movie rating website'}
      />
      <Flex
        minH="100vh"
        flex={1}
        p={5}
        direction="row"
        align="center"
        justify="center"
      >
        <Box
          w={{ base: `full`, md: 11 / 12, xl: 8 / 12 }}
          mx="auto"
          textAlign={{ base: `left`, sm: `center` }}
        >
          <chakra.h1
            mb={6}
            fontSize={{ base: `4xl`, md: `6xl` }}
            lineHeight="none"
            letterSpacing={{ base: `normal`, md: `tight` }}
            w="full"
            bgClip="text"
            bgGradient="linear(to-r, green.400,purple.500)"
            fontWeight="extrabold"
          >
            {siteName}
          </chakra.h1>
          <chakra.p
            px={{ base: 0, lg: 24 }}
            mb={6}
            fontSize={{ base: `lg`, md: `xl` }}
            color={useColorModeValue(`gray.600`, `gray.300`)}
          >
            {randomQuote}
            {movie && (
              <>
                <br />
                Sign in to see details about{' '}
                <chakra.span
                  fontWeight="semibold"
                  color={
                    colorMode === 'light'
                      ? `${process.env.COLOR_THEME}.500`
                      : `${process.env.COLOR_THEME}.300`
                  }
                >
                  {movie.name}
                </chakra.span>
              </>
            )}
          </chakra.p>
          <Button
            variant="solid"
            color={useColorModeValue(
              `${process.env.COLOR_THEME}.700`,
              `${process.env.COLOR_THEME}.300`
            )}
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w={{ base: `full`, sm: `auto` }}
            mb={{ base: 2, sm: 0 }}
            // as="a"
            // href="/api/oauth"
            onClick={(e) => {
              e.preventDefault();
              signIn('discord', {
                callbackUrl,
              });
            }}
            size="lg"
          >
            Log in with discord
            <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </Icon>
          </Button>
        </Box>
      </Flex>
    </>
  );
};
