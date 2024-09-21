import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import School from '../../../models/School';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const session = await getSession({ req });

  if ((method === 'PUT' || method === 'DELETE') && (!session || !session.user || session.user.role !== 'admin')) {
    return res.status(403).json({ success: false, error: 'Unauthorized: Admin access required' });
  }
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const school = await School.findById(id);
        if (!school) {
          return res.status(404).json({ success: false, error: 'School not found' });
        }
        res.status(200).json({ success: true, data: school });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error fetching school' });
      }
      break;

    case 'PUT':
      try {
        const school = await School.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!school) {
          return res.status(404).json({ success: false, error: 'School not found' });
        }
        res.status(200).json({ success: true, data: school });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error updating school' });
      }
      break;

    case 'DELETE':
      try {
        const deletedSchool = await School.deleteOne({ _id: id });
        if (!deletedSchool) {
          return res.status(404).json({ success: false, error: 'School not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Error deleting school' });
      }
      break;

    default:
      res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
  }
}
