import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "server/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await prisma.employee.withAuthorization({ userId: '1' })
    .findMany({ where: {} })
  
  return res.status(200).json(data)
}