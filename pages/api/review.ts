import { getSession } from 'next-auth/client';
import { NextApiRequest, NextApiResponse } from 'next';

import Movie, { MovieType } from '../../models/movie';
import dbConnect from '../../utils/dbConnect';
import { ReviewEndpointBodyType } from '../../types/APITypes';
import User from '../../models/user';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<any>> => {
  await dbConnect();
  User.schema;
  if (req.method === `POST`) {
    const { comment, rating, movieID, concept, cinema, perform }: ReviewEndpointBodyType = JSON.parse(
      req.body
    );
    try {
      const session = await getSession({ req });
      if (!session?.user?.isReviewer) {
        return res
          .status(401)
          .json({ message: `You are not authorized to do that :(` });
      }

      const review = {
        // eslint-disable-next-line no-underscore-dangle
        user: session.user.sub,
        comment,
        rating,
        concept,
        cinema,
        perform
      };

      const movie: MovieType = await Movie.findOne({ _id: movieID });
      if (!movie) {
        return res.status(404);
      }
      const existingReview = movie.reviews.filter(
        // eslint-disable-next-line no-underscore-dangle
        (rv) => rv.user.toString() === session.user.id
      )[0];
      if (existingReview) {
        const index = movie.reviews.indexOf(existingReview);
        movie.reviews.splice(index, 1);
      }
      movie.reviews.push(review);
      movie.numReviews = movie.reviews.length;
      movie.rating =
        Math.round(
          (movie.reviews.reduce<number>((a, b) => a + b.rating, 0) /
            movie.reviews.length) *
            10
        ) / 10;
      movie.concept =
      Math.round(
        (movie.reviews.reduce<number>((a, b) => a + b.concept, 0) /
          movie.reviews.length) *
          10
      ) / 10;
      movie.cinema =
      Math.round(
        (movie.reviews.reduce<number>((a, b) => a + b.cinema, 0) /
          movie.reviews.length) *
          10
      ) / 10;
      movie.perform =
      Math.round(
        (movie.reviews.reduce<number>((a, b) => a + b.perform, 0) /
          movie.reviews.length) *
          10
      ) / 10;
      movie.markModified(`reviews`);
      await movie.save();
      return res
        .status(200)
        .json({ movie, type: existingReview ? `modification` : `addition` });
    } catch (err) {
      console.error(err);
      return res.status(500);
    }
  } else if (req.method === `DELETE`) {
    // TODO Delete reviews...
    return res.status(405);
  } else {
    return res.status(405).send({ message: `method not allowed :(` });
  }
};

export default handler;
