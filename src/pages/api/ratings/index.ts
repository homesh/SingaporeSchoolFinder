export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const session = await getSession({ req });
      if (!session) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { schoolId, rating } = req.body;
      const userId = session.user.id;

      if (!schoolId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Invalid input' });
      }

      let ratingDoc = await Rating.findOne({ schoolId, userId });

      if (ratingDoc) {
        ratingDoc.rating = rating;
        await ratingDoc.save();
      } else {
        ratingDoc = await Rating.create({ schoolId, userId, rating });
      }

      // Update average rating for the school
      const avgRating = await Rating.aggregate([
        { $match: { schoolId } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]);

      await School.findByIdAndUpdate(schoolId, {
        averageRating: avgRating[0]?.avgRating || 0
      });

      res.status(200).json({ success: true, rating: ratingDoc });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
