import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import { DepartmentService } from "server/services/department.service";
import {getServerSession, withAuth} from "@roq/nextjs";
import {roqClient} from "../../server/roq";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = getServerSession(req);

    switch (req.method) {
        case 'GET':
            return create();
        // case 'POST':
        //     return createCar();
        // case 'UPDATE':
        //     return createCar();
        // case'DELETE':
        //     return deleteCar();
        default:
            return res.status(405).json({message: 'Method ' + req.method + ' not allowed'})
    }

    async function create() {
        const department = await DepartmentService.create({
          data: {
            name: 'Initial'
          }
        })
        res.status(200).json({ department });
    }

}

export default handler;
// export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
//     return withAuth(req, res)(handler);
// }