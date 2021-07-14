import React, { useEffect } from 'react';
import { Divider, Flex } from '@chakra-ui/react';
import { UserType } from '../../models/user';
import AppLayout from '../../components/AppLayout';
import AboutUserSection from '../../components/AboutUserSection';
import User from '../../models/user';
import { getMovies } from '../../utils/queries';
import { MovieType, ReviewType } from '../../models/movie';
import UserReviewSection from '../../components/UserReviewSection';
import type { GetServerSidePropsContext } from 'next';
import dbConnect from '../../utils/dbConnect';
import { getSession, useSession } from 'next-auth/client';
import type { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

interface EditUserProps {
  session?: Session;
  desiredUser: UserType;
  movies: MovieType<ReviewType<UserType>[]>[];
}

function EditUser({ desiredUser, movies }: EditUserProps): React.ReactNode {
  const [session, loading] = useSession();

  const router = useRouter();
  useEffect(() => {
    if (!session && !loading) router.push('/');
  }, [loading, router, session]);
  if ((typeof window !== 'undefined' && loading) || !session) return null;
  if (!session) {
    router.push('/');
  }
  const user = session.user;

  const allRatings = movies
    .map((movie: any) => {
      const rev = movie?.reviews?.find(
        (review: any) => review.user.id === desiredUser.id
      );
      if (!rev) {
        return null;
      }
      rev.movie = {
        name: movie.name,
        image: movie.image,
      };
      return rev;
    })
    .filter((x) => (x ? true : false))
    .sort((a, b) => a.rating - b.rating)
    .reverse();
  return (
    <AppLayout user={user}>
      <Flex direction="column" pt={16} maxW="6xl" mx="auto">
        <AboutUserSection user={desiredUser} reviews={allRatings} />
        
        
        {
        // eslint-disable-next-line no-console
        console.log(desiredUser)
        }


        <Divider mt={10} />
        <UserReviewSection reviews={allRatings} />
        {/* <UserStatsSection /> */}
      </Flex>
      
      <NextSeo title= {user.username} />
    </AppLayout>
  );
}

interface returnProps {
  props: EditUserProps;
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<returnProps> {
  const { uID } = ctx.query;
  await dbConnect();
  const session = await getSession(ctx);

  const desiredUser: any = await User.findById(uID).lean();
  desiredUser._id = desiredUser._id.toString();
  desiredUser.createdAt = desiredUser.createdAt.getTime();
  desiredUser.updatedAt = desiredUser.updatedAt.getTime();

  const movies = await getMovies();
  return {
    props: {
      session,
      desiredUser: desiredUser || null,
      movies: movies,
    },
  };
}

export default EditUser;
