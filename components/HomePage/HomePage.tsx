import AppLayout from '../AppLayout';
import CardGrid from '../CardGrid';
import { ReviewType, SerializedMovieType } from '../../models/movie';
import { UserAuthType } from 'next-auth';
import { NextSeo } from 'next-seo';
import { PopulatedUserType } from '../../models/user';
import AlertBanner from '../AlertBanner';

interface HomePageProps {
  user: UserAuthType;
  movies: SerializedMovieType<ReviewType<PopulatedUserType>[]>[];
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  movies,
}): React.ReactElement => {
  return (
    <>
      <NextSeo title="Home" />

      {!user.isAdmin && !user.isReviewer && (
        <AlertBanner
          storageName="dismissReadOnlyAlert"
          title="Read only mode!"
          message="Say hi in Discord to enable reviewing"
          color="blue"
        />
      )}

      {user.isReviewer && (
        <AlertBanner
          color="green"
          storageName="dismissReviewPromotion"
          title="You have been promoted!"
          message="You can now submit film reviews"
        />
      )}

      <AppLayout user={user} showMovies>
        <div>
          <CardGrid movies={movies} user={user} />
        </div>
      </AppLayout>
    </>
  );
};
