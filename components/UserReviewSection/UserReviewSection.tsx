import {
  AspectRatio,
  chakra,
  Flex,
  Heading,
  Stack,
  Text,
  Link as ChakraLink,
  useBreakpoint,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { ReviewType, SerializedMovieType } from '../../models/movie';
import { PopulatedUserType } from '../../models/user';
import { ReviewActions } from '../MovieReviewSection/MovieReviewSection';
import { UserPageUser } from 'pages/user/[uID]';

export const UserReviewSection: React.FC<{
  movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
  user: UserPageUser;
}> = ({ movies, user }): React.ReactElement => {
  const bp = useBreakpoint();
  return (
    <Flex mt={5} maxW="6xl" width="full" direction="column">
      {movies.map((movie, i) => {
        const review = movie?.reviews?.find(
          (review) => review?.user?._id === user._id
        );
        if (!review) return null;
        return (
          <Flex
            mt={10}
            width="92%"
            mx="auto"
            maxWidth="6xl"
            key={i.toString()}
            direction={{ base: 'column', md: 'row' }}
            alignItems="center"
          >
            <AspectRatio
              ratio={16 / 9}
              minWidth="200px"
              mr={{ base: 0, md: 7 }}
            >
              <Image
                src={movie?.image || ''}
                alt={movie.name + ' movie poster'}
                layout="fill"
                sizes="200px"
                className={'borderRadius-xl'}
              />
            </AspectRatio>
            <Flex direction="column" maxWidth="full">
              <Flex direction={{ base: 'column', md: 'row' }}>
                <Stack isInline justifyContent="center">
                  <Link href={`/movie/${movie?._id}`} passHref>
                    <Heading
                      as={ChakraLink}
                      isTruncated
                      size={['base', 'sm'].includes(bp || '') ? 'lg' : 'xl'}
                      mr={5}
                    >
                      {movie?.name}
                    </Heading>
                  </Link>
                  <Heading
                    size={['base', 'sm'].includes(bp || '') ? 'lg' : 'xl'}
                  >
                    {' '}
                    <CircularProgress value={review?.concept} min={0} max={10} mr={5} mb={[0,0,2,2]} color="cyan.400" trackColor={`gray.300`} size="30px" thickness="14px">
                        <CircularProgressLabel fontWeight="semibold" fontSize="xs">{review?.concept.toFixed(0)}</CircularProgressLabel>
                      </CircularProgress>
                      <CircularProgress value={review?.cinema} min={0} max={10} mr={5} mb={[0,0,2,2]} color="yellow.400" trackColor={`gray.300`} size="30px" thickness="14px">
                        <CircularProgressLabel fontWeight="semibold" fontSize="xs">{review?.cinema.toFixed(0)}</CircularProgressLabel>
                      </CircularProgress>
                      <CircularProgress value={review?.perform} min={0} max={10} mr={5} mb={[0,0,2,2]} color="red.400" trackColor={`gray.300`} size="30px" thickness="14px">
                        <CircularProgressLabel fontWeight="semibold" fontSize="xs">{review?.perform.toFixed(0)}</CircularProgressLabel>
                      </CircularProgress>
                    <chakra.span color="gray.500">
                      • {review?.rating.toFixed(1)}
                    </chakra.span>
                  </Heading>
                </Stack>
                {bp === 'base' && (
                  <Text
                    fontSize={{ base: 'lg', md: '2xl' }}
                    listStylePosition="inside"
                  >
                    <ReactMarkdown
                      skipHtml
                      disallowedElements={['img', 'a', 'code', 'pre']}
                    >
                      {review?.comment || ''}
                    </ReactMarkdown>
                  </Text>
                )}
                {review && (
                  <ReviewActions
                    centred
                    toInvalidate={'movies'}
                    movie={movie}
                    review={review}
                  />
                )}
              </Flex>

              {bp !== 'base' && (
                <Text
                  fontSize={{ base: 'lg', md: '2xl' }}
                  listStylePosition="inside"
                >
                  <ReactMarkdown
                    skipHtml
                    disallowedElements={['img', 'a', 'code', 'pre']}
                  >
                    {review?.comment || ''}
                  </ReactMarkdown>
                </Text>
              )}
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
};
