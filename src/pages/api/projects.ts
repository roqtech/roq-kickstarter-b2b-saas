import type {NextApiRequest, NextApiResponse} from 'next';
import {getServerSession, withAuth} from "@roq/nextjs";
import { prisma } from 'server/db';
import { UserService } from 'server/services/user.service';
import { hasAccess } from 'library/authorization/hasAccess';
import { ResourceOperationEnum } from "@roq/nodejs/dist/src/generated/sdk";
import { retrieveWithAuthorization } from 'library/authorization/retrieve-with-authorization';
import { buildAuthorizationFilter } from 'library/authorization/build-filter';
import { AuthorizationForbiddenException } from 'library/authorization/authorization-forbidden.exception';

const entity = 'Project'
async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = getServerSession(req);
    const { roqUserId } = session

    switch (req.method) {
        case 'GET':
            return getProjects();
        case 'POST':
            return createProject();
        case'DELETE':
            return deleteProject();
        default:
            return res.status(405).json({message: 'Method ' + req.method + ' not allowed'})
    }


    async function getProjects() {
        const filter = await buildAuthorizationFilter(roqUserId, entity)
        const data = await prisma.project.findMany({
            where: filter,
            orderBy: [{createdAt: 'desc',},],
        });

        return res.status(200).json({ data });
    }

    async function createProject(){
        try {
            const { allowed } = await hasAccess(roqUserId, entity, ResourceOperationEnum.Create)
            if(!allowed) {
                return res.status(403).json({message: 'Forbidden' })
            }
            const data = await prisma.project.create({
                data: {
                    ...req.body,
                    userId: await UserService.getUserId(session.roqUserId)
                }
            });
            return res.status(200).json({ data });
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async function deleteProject() {

        const id = req.query.id as string;

        try {
            await retrieveWithAuthorization({
                prismaCollection: prisma.project,
                entity,
                id,
                roqUserId,
                operation: ResourceOperationEnum.Delete
            })
            const existingWorkspaces = await prisma.workspace.findMany({ where: { projectId: id, }})
            if(existingWorkspaces.length > 0) {
                return res.status(200).json({ success: false, message: 'Unable to delete project with existing workspace'})
            }
            const data = await prisma.project.delete({where: { id: id as string }});

            return res.status(200).json({ success: true, data });
        } catch (error) {
            if(error instanceof AuthorizationForbiddenException) {
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