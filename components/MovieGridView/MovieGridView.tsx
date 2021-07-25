import {
  AspectRatio,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Heading,
  useColorModeValue,
  Stat,
  StatNumber,
  chakra,
  VStack,
  AvatarGroup,
  Avatar,
  Skeleton,
  Box,
} from '@chakra-ui/react';
import { UserAuthType } from 'next-auth';
import Image from 'next/image';
import React, { ReactElement, useMemo } from 'react';
import { useTable } from 'react-table';
import { SerializedMovieType } from '../../models/movie';

interface Props {
  movies: SerializedMovieType[];
  user: UserAuthType;
}

const COLUMNS = (
  user: UserAuthType,
) => [
  {
    Header: 'Movie',
    accessor: 'info',
    Cell: ({
      value: { image, name },
    }: {
      value: { name: string; image: string; tagLine: string };
    }) => {
      const [loaded, setLoaded] = React.useState(false);
      return (
        <Stack spacing={6} isInline alignItems="center">
          <Box display={{base: 'none', md:'block'}}>
            <AspectRatio ratio={16 / 9} width="150px" borderRadius="xl">
              <Skeleton borderRadius="md" isLoaded={loaded}>
                <Image
                  src={image}
                  alt={`${name} poster`}
                  layout="fill"
                  sizes={'150px'}
                  onLoad={() => setLoaded(true)}
                  className={'borderRadius-md'}
                />
              </Skeleton>
            </AspectRatio>
          </Box>
          <VStack alignItems="flex-start">
            <Heading size="lg">{name}</Heading>
          </VStack>
        </Stack>
      );
    },
  },
  {
    Header: 'Rating',
    accessor: 'rating',
    Cell: ({
      value: { rating, reviews },
    }: {
      value: { rating: string; reviews: { name: string; image: string }[] };
    }) => {
      return reviews.length > 0 ? (
        <Stat textAlign="center">
          <StatNumber
            alignItems="center"
            display="flex"
            fontSize="3xl"
            fontWeight="bold"
            justifyContent="center"
          >
            {rating}
            <chakra.span fontSize="md" fontWeight="normal" color={'gray.500'}>
              {' '}
              /10
            </chakra.span>

            <AvatarGroup ml={3} max={3} size="md">
              {reviews.map((review, i) => (
                <Avatar
                  src={review.image}
                  key={i.toString() + 'avatar'}
                  name={review.name}
                />
              ))}
            </AvatarGroup>

          </StatNumber>
        </Stat>
      ) : (
        <Heading width="full" textAlign="center" size="md">
          No reviews
        </Heading>
      );
    },
  },
];

export default function MovieGridView({ movies, user }: Props): ReactElement {

  const moviesData = movies.map((movie) => ({
    info: {
      name: movie.name,
      image: movie.image,
      tagLine: movie.tagLine,
    },
    rating: {
      rating: movie.rating,
      reviews: movie.reviews.map((review) => ({
        name: review.user?.username,
        image: review.user?.image,
      })),
    },
    actionInfo: { imdbID: movie.imdbID, movieID: movie._id, name: movie.name },
  }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => COLUMNS(user), [user]);
  const data = useMemo(() => moviesData, [moviesData]);
  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    //@ts-ignore
  } = useTable({ columns, data });

  return (
    <Table {...getTableProps()}>
      <Thead
        bg={useColorModeValue('gray.50', 'gray.900')}
        borderBottom="1px solid"
        shadow="md"
        borderColor={useColorModeValue('gray.300', 'gray.700')}
      >
        {headerGroups.map((headerGroup, i) => (
          <Tr
            {...headerGroup.getHeaderGroupProps()}
            key={i.toString() + 'heading'}
          >
            {headerGroup.headers.map((header, j) => (
              <Th
                {...header.getHeaderProps()}
                key={j.toString() + ' header'}
                py={7}
                fontSize="md"
                textAlign="center"
              >
                {header.render('Header')}
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {' '}
        {rows.map((row, j) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()} key={j.toString() + 'Row'}>
              {row.cells.map((cell, i) => {
                return (
                  <Td {...cell.getCellProps()} key={i.toString() + 'Cell'}>
                    {cell.render('Cell')}
                  </Td>
                );
              })}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
