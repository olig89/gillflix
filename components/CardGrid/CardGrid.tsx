import {
  Container,
  SimpleGrid,
  Box,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  chakra,
  useColorModeValue,
  useToast,
  useColorMode,
  Stack,
} from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiChevronDown } from 'react-icons/bi';
import { useState } from 'react';
import { useEffect } from 'react';
import Card from '../Card';
import { MovieType, ReviewType } from '../../models/movie';
import { UserType } from '../../models/user';
import { NextSeo } from 'next-seo';
import ReviewModal from '../ReviewModal';
import Link from 'next/link';
interface CardGridProps {
  movies: { data: MovieType[] };
  user: UserType;
  movieID?: string | string[];
}

export const CardGrid: React.FC<CardGridProps> = ({
  movies: unSortedMovies,
  user,
}): React.ReactElement => {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('recent');

  const toast = useToast();
  const { colorMode } = useColorMode();
  // Fix for https://github.com/chakra-ui/chakra-ui/issues/3076
  useEffect(() => {
    toast.update(`otherToast`, {
      variant: `solid`,
      title: 'Movie not found',
      description: 'The shared movie does not exist',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }, [colorMode, toast]);

  const movies = {
    data: unSortedMovies.data
      ?.filter((mv) => {
        if (mv.name.toLowerCase().includes(filter)) {
          return true;
        }
        return false;
      })
      .sort((a, b) => {
        if (sort === 'recent' || sort === 'old') {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        } else if (sort === 'best') {
          return a.rating - b.rating;
        } else if (sort === 'worst') {
          return a.rating - b.rating;
        }
      }),
  };

  if (sort === 'best' || sort === 'recent') {
    movies.data = movies.data.reverse();
  }

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ScuffedMDB';
  const siteURI =
    process.env.NEXT_PUBLIC_APP_URI || 'https://www.movie.michael-hall.me';

  return (
    <>
      <NextSeo
        openGraph={{
          title: siteName,
          type: `website`,
          site_name: siteName,
          images: [
            {
              width: 2542,
              height: 1312,
              url: `${siteURI}/sitePicture.png`,
              alt: siteName + ' webpage',
            },
          ],
        }}
        description={'A private movie rating website'}
      />

      <Container maxW="container.xl" mt={10}>
        <Heading fontSize={{ base: '4xl', md: '6xl' }} textAlign="center">
          We have reviewed{' '}
          {
            <chakra.span color={useColorModeValue('purple.500', 'purple.300')}>
              {unSortedMovies?.data?.length}
            </chakra.span>
          }{' '}films
        </Heading>
        <Flex
          width="full"
          direction={{ base: 'column', md: 'row' }}
          my={7}
          justifyContent="space-between"
        >
          <Flex mb={{ base: 4, md: 0 }}>
            {(user.isReviewer || user.isAdmin) && (
              <ReviewModal isAdmin={user.isAdmin} />
            )}
          </Flex>

          <Stack direction={{ base: 'column', md: 'row' }}>
            <InputGroup maxWidth={{ base: 'full', md: '200px' }}>
              <InputLeftElement pointerEvents="none">
                <AiOutlineSearch color="gray.300" />
              </InputLeftElement>
              <Input
                variant="filled"
                type="text"
                placeholder="Search"
                onChange={(e) => setFilter(e.target.value.toLowerCase())}
              />
            </InputGroup>

            <Menu>
              <MenuButton as={Button} rightIcon={<BiChevronDown />}>
                Sort by...
              </MenuButton>
              <MenuList zIndex={998}>
                <MenuItem
                  zIndex={999}
                  isDisabled={sort === 'recent'}
                  onClick={() => setSort('recent')}
                >
                  Recent
                </MenuItem>
                <MenuItem
                  zIndex={999}
                  isDisabled={sort === 'old'}
                  onClick={() => setSort('old')}
                >
                  Old
                </MenuItem>
                <MenuItem
                  zIndex={999}
                  isDisabled={sort === 'best'}
                  onClick={() => setSort('best')}
                >
                  Best
                </MenuItem>
                <MenuItem
                  zIndex={999}
                  isDisabled={sort === 'worst'}
                  onClick={() => setSort('worst')}
                >
                  Worst
                </MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={10}
          alignItems="stretch"
        >
          {movies?.data?.map((movie: MovieType<ReviewType[]>, i) => (
            <Link
              key={`${i.toString()}cardBox`}
              href={`/movie/${movie._id}`}
              passHref
            >
              <Box as={'a'} height="full">
                <Card movie={movie} key={`${i.toString()}card`} />
              </Box>
            </Link>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
};
