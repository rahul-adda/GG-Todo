import type { NextApiRequest, NextApiResponse } from 'next'
import sidebar from '@/mocks/sidebar.json'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(sidebar);
}
