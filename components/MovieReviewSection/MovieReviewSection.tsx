import {
  VStack,
  Heading,
  Box,
  Flex,
  Avatar,
  chakra,
  Text,
  CircularProgress,
  CircularProgressLabel,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { MovieType, ReviewType } from '../../models/movie';
import { UserType } from '../../models/user';
import Wave from '../Wave';

interface Props {
  movie: MovieType<ReviewType<UserType>[]>;
}

const Review = ({ review }: { review: ReviewType<UserType> }) => {
  return (
    <VStack mt={8} alignItems="flex-start" spacing={3} px={4} mb={5}>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        width="full"
        alignItems="center"
      >
        <Avatar size="lg" src={review.user.image} />
        <chakra.div display="flex" alignItems="center">
          <Heading size="2xl" ml={5} maxWidth="full" isTruncated>
            {review.user.username}
            <chakra.span color={'gray.500'} fontWeight="semibold" fontSize="lg">
              {' '}
              #{review.user.discriminator}
            </chakra.span>
          </Heading>
        </chakra.div>
        <chakra.div
            display="flex"
            ml={{ base: 0, lg: 'auto' }}
            alignItems="center"
          >  
              <CircularProgress value={review.concept} min={0} max={10} mr={5} mt={[0,0,1,1]} color="cyan.400" trackColor={useColorModeValue(`gray.200`, `gray.500`)} size="30px" thickness="14px">
                <CircularProgressLabel fontWeight="semibold" fontSize="xs">{review.concept}</CircularProgressLabel>
              </CircularProgress>
              <CircularProgress value={review.cinema} min={0} max={10} mr={5} mt={[0,0,1,1]} color="yellow.400" trackColor={useColorModeValue(`gray.200`, `gray.500`)} size="30px" thickness="14px">
                <CircularProgressLabel fontWeight="semibold" fontSize="xs">{review.cinema}</CircularProgressLabel>
              </CircularProgress>
              <CircularProgress value={review.perform} min={0} max={10} mr={5} mt={[0,0,1,1]} color="red.400" trackColor={useColorModeValue(`gray.200`, `gray.500`)} size="30px" thickness="14px">
                <CircularProgressLabel fontWeight="semibold" fontSize="xs">{review.perform}</CircularProgressLabel>
              </CircularProgress>
            <Text fontSize="4xl" fontWeight="bold">
              {review.rating}
              <chakra.span color={'gray.500'} fontWeight="semibold" fontSize="lg">
                {' '}
                /10
              </chakra.span>
            </Text>
          </chakra.div>
      </Flex>
      <Text fontSize="lg">{review.comment || 'No comment'}</Text>
    </VStack>
  );
};

export default function MovieReviewSection({ movie }: Props): ReactElement {
  return (
    <Box maxWidth="7xl" mx={'auto'}>
      <VStack alignItems="center" spacing={3} mt={{ base: 28, lg: 0 }}>
        <Wave mx="auto" width={{ base: '70%', md: '30%' }} />
        <Heading fontSize="6xl">
          {movie.reviews.length} Review{movie.reviews.length !== 1 && 's'}
        </Heading>
        <Wave
          mt={'15px!important'}
          mx="auto!important"
          width={{ base: '70%', md: '30%' }}
        />
      </VStack>
      <Flex mt={10} direction="column">
        {movie.reviews.map((review: ReviewType<UserType>, i) => (
          <Review review={review} key={i.toString()} />
        ))}
      </Flex>
    </Box>
  );
}
