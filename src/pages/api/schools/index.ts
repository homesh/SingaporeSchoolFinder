import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import School from '../../../models/School';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;
  const { search } = query;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        let filter = {};
        if (search) {
          filter = {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
              { address: { $regex: search, $options: 'i' } },
            ],
          };
        }
        const schools = await School.find(filter);
        res.status(200).json({ success: true, data: schools });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const session = await getSession({ req });

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const schools = await School.find({});
        res.status(200).json({ success: true, data: schools });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      if (!session || !session.user.isAdmin) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      try {
        const school = await School.create(req.body);
        res.status(201).json({ success: true, data: school });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const schools = await School.find({});
        res.status(200).json({ success: true, data: schools });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const school = await School.create(req.body);
        res.status(201).json({ success: true, data: school });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
