import {
  AspectRatio,
  chakra,
  Flex,
  Heading,
  Image,
  Text,
  Box,
} from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { ReviewType } from '../../models/movie';
import { PopulatedUserType } from '../../models/user';

export const UserReviewSection: React.FC<{
  reviews: (
    | (ReviewType<PopulatedUserType> & {
        movie?: { name: string; image?: string; _id: string };
      })
    | null
  )[];
}> = ({ reviews }): React.ReactElement => {
  return (
    <Flex mt={5} maxW="6xl" width="full" direction="column">
      {reviews.map((review, i) => (
        <Flex mt={10} width="6xl" key={i.toString()}>
          <Box display={{base: 'none', lg:'block'}}>
            <AspectRatio ratio={16 / 9} minWidth="200px" mr={7}>
              <Image
                src={review?.movie?.image}
                alt={review?.user?.username + "'s profile"}
                objectFit="fill"
                borderRadius="2xl"
              />
            </AspectRatio>
          </Box>
          <Flex
            direction="column"
            maxWidth="full"
            overflowWrap="anywhere"
            overflow="hidden"
          >
            <Link href={`/movie/${review?.movie?._id}`} passHref>
              <Heading as="a">
                {review?.movie?.name}{' • '}
                <chakra.span color="gray.500">
                {review?.rating.toFixed(1)}
                </chakra.span>
                {' • '}
                <chakra.span color="cyan.500">
                {review?.concept.toFixed(1)}
                </chakra.span>
                {' • '}
                <chakra.span color="yellow.500">
                {review?.cinema.toFixed(1)}
                </chakra.span>
                {' • '}
                <chakra.span color="red.500">
                {review?.perform.toFixed(1)}
                </chakra.span>
              </Heading>
            </Link>
            <Text fontSize="2xl">{review?.comment}</Text>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
