import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface RatingProps {
  initialRating?: number;
  totalStars?: number;
  onRate: (rating: number) => void;
}

const RatingComponent: React.FC<RatingProps> = ({
  initialRating = 0,
  totalStars = 5,
  onRate,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (index: number) => {
    setRating(index);
    onRate(index);
  };

  return (
    <div>
      {[...Array(totalStars)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => handleClick(ratingValue)}
              style={{ display: 'none' }}
            />
            <FaStar
              className="star"
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              size={20}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default RatingComponent;import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Rating from '../../../models/Rating';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { schoolId } = req.query;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const ratings = await Rating.find({ schoolId });
        const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
        res.status(200).json({ success: true, data: { ratings, averageRating } });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
