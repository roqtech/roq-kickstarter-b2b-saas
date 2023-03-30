import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import {getServerSession, withAuth} from "@roq/nextjs";
import {roqClient} from "../../server/roq";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = getServerSession(req);

    switch (req.method) {
        case 'GET':
            return getUsers();
        // case 'POST':
        //     return createCar();
        // case 'UPDATE':
        //     return createCar();
        // case'DELETE':
        //     return deleteCar();
        default:
            return res.status(405).json({message: 'Method ' + req.method + ' not allowed'})
    }

    async function getUsers() {
        const { users } = await roqClient.asUser(session.roqUserId).users({ withTenant: true })

        res.status(200).json({ users });
    }

}

// export default handler;
export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
    return withAuth(req, res)(handler);
}