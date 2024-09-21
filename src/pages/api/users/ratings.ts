import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dbConnect from '../../../utils/dbConnect';
import Rating from '../../../models/Rating';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const ratings = await Rating.find({ userId: session.user.id })
        .populate('schoolId', 'name')
        .sort({ createdAt: -1 });

      return res.status(200).json(ratings);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching ratings' });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const user = await User.findById(session.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching user profile' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { name, email } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        session.user.id,
        { name, email },
        { new: true, runValidators: true }
      ).select('-password');
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: 'Error updating user profile' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
