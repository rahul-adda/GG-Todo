import type { NextApiRequest, NextApiResponse } from 'next'
import users from '@/mocks/users.json'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Basic mock: choose user based on query param ?as=admin or ?as=regular
  const as = (req.query.as as string) || 'admin';
  const user = as === 'regular' ? users[1] : users[0];
  res.status(200).json({ user });
}
