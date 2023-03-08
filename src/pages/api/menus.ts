import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import {getServerSession, withAuth} from "@roq/nextjs";
import {roqClient} from "../../server/roq";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = getServerSession(req);


    if (req.method === 'GET') {
        const menus = await prisma.menu.findMany({
            // where: {
            //     roqUserId: session.roqUserId
            // }
            orderBy: [
                {
                    id: 'desc',
                },
            ],
        });

        let userIds: any[] = [];
        menus.forEach(menu => userIds.push(menu.roqUserId));

        const users = await roqClient.asUser(session.roqUserId).userProfiles(
            {filter: {id: {valueIn: userIds}}}
        );

        res.status(200).json({result: {menus, users}});
    } else {
        res.status(400).json({message: 'Invalid method'});
    }
}

// export default handler;
export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
    return withAuth(req, res)(handler);
}