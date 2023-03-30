import type {NextApiRequest, NextApiResponse} from 'next';
import {getServerSession, withAuth} from "@roq/nextjs";
import { buildAuthorizationFilter } from 'library/authorization/build-filter';
import { hasAccess } from 'library/authorization/hasAccess';
import { ResourceOperationEnum } from "@roq/nodejs/dist/src/generated/sdk";
import { prisma } from 'server/db';
import { retrieveWithAuthorization } from 'library/authorization/retrieve-with-authorization';

const entity = 'TestFlight'

async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = getServerSession(req);
    const { roqUserId } = session

    switch (req.method) {
        case 'GET':
            return getTestFlights();
        case 'POST':
            return createTestFlight();
        // case 'UPDATE':
        //     return createTestFlight();
        case'DELETE':
            return deleteTestFlight();
        default:
            return res.status(405).json({message: 'Method ' + req.method + ' not allowed'})
    }


    async function getTestFlights() {
        const filter = await buildAuthorizationFilter(session.roqUserId, entity)
        const data = await prisma.testFlight.findMany({
            where: filter,
            orderBy: [{createdAt: 'desc',},],
        });

        return res.status(200).json({ data });
    }

    async function createTestFlight(){
        try {
            const { allowed } = await hasAccess(roqUserId, entity, ResourceOperationEnum.Create)
            if(!allowed) {
                return res.status(403).json({message: 'Forbidden' })
            }
            const data = await prisma.testFlight.create({
                data: req.body
            });
            return res.status(200).json({data});
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async function deleteTestFlight() {

        const id = req.query.id as string;

        try {
            await retrieveWithAuthorization({
                prismaCollection: prisma.testFlight,
                entity,
                id,
                roqUserId,
                operation: ResourceOperationEnum.Delete
              })
            const data = await prisma.testFlight.delete({where: { id: id as string }});

            return res.status(200).json({success: true, data });
        } catch (error) {
            if(error.toString() === 'Forbidden') {
                return res.status(403).json({message: 'Forbidden' })
            }
            console.error(error);
            return res.status(500).json({message: 'Server error'});
        }
    }


}

// export default handler;
export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
    return withAuth(req, res)(handler);
}