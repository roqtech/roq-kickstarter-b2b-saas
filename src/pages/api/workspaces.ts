import type {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import {getServerSession, withAuth} from "@roq/nextjs";
import { buildAuthorizationFilter } from 'library/authorization/build-filter';
import { hasAccess } from 'library/authorization/hasAccess';
import { ResourceOperationEnum } from "@roq/nodejs/dist/src/generated/sdk";
import { prisma } from 'server/db';
import { retrieveWithAuthorization } from 'library/authorization/retrieve-with-authorization';


const entity = 'Workspace'
async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = getServerSession(req);
    const { roqUserId } = session
    switch (req.method) {
        case 'GET':
            return getWorkspaces();
        case 'POST':
            return createWorkspace();
        // case 'UPDATE':
        //     return createWorkspace();
        case'DELETE':
            return deleteWorkspace();
        default:
            return res.status(405).json({message: 'Method ' + req.method + ' not allowed'})
    }


    async function getWorkspaces() {
        const filter = await buildAuthorizationFilter(roqUserId, entity)

        const data = await prisma.workspace.findMany({
            where: filter,
            orderBy: [{createdAt: 'desc',},],
        });

        return res.status(200).json({ data });
    }

    async function createWorkspace(){
        try {
            const { allowed } = await hasAccess(roqUserId, entity, ResourceOperationEnum.Create)
            if(!allowed) {
              throw new Error('Forbidden')
            }
            const data = await prisma.workspace.create({
                data: req.body
            });
            return res.status(200).json({ data });
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async function deleteWorkspace() {
        const id = req.query.id as string;
        try {
            await retrieveWithAuthorization({
                prismaCollection: prisma.workspace,
                entity,
                id,
                roqUserId,
                operation: ResourceOperationEnum.Delete
              })
            const existingWorkspaces = await prisma.testFlight.findMany({ where: { workspaceId: id, }})
            if(existingWorkspaces.length > 0) {
                return res.status(200).json({ success: false, message: 'Unable to delete project with existing test-flights'})
            }
            const data = await prisma.workspace.delete({where: { id: id as string }});
            return res.status(200).json({success: true, data });
        } catch (error) {
            if(error.toString() === 'Forbidden') {
                return res.status(403).json({message: 'Forbidden' })
            }
            return res.status(500).json({message: 'Server error'});
        }
    }


}

// export default handler;
export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
    return withAuth(req, res)(handler);
}