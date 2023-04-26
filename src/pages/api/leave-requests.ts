import type {NextApiRequest, NextApiResponse} from 'next';
import {getServerSession, withAuth} from "@roq/nextjs";
import dayjs from 'dayjs'
import { prisma } from 'server/db';
import { EmployeeService } from 'server/services/employee.service';
import { ResourceOperationEnum } from "@roq/nodejs/dist/src/generated/sdk";
import { retrieveWithAuthorization } from 'library/authorization/retrieve-with-authorization';
import { AuthorizationForbiddenException } from 'library/authorization/authorization-forbidden.exception';
import { authorizationClient } from 'server/roq';

const entity = 'LeaveRequest'
async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = getServerSession(req);
    const { roqUserId } = session

    switch (req.method) {
        case 'GET':
            return getLeaveRequests();
        case 'POST':
            return createLeaveRequest();
        case 'PATCH': 
          return updateLeaveRequest();
        // case'DELETE':
        //     return deleteProject();
        default:
            return res.status(405).json({message: 'Method ' + req.method + ' not allowed'})
    }


    async function getLeaveRequests() {
        const filter = await authorizationClient.buildAuthorizationFilter(roqUserId, entity)
        const data = await prisma.leaveRequest.findMany({
            where: filter,
            orderBy: [{createdAt: 'desc',},],
            include: {
              employee: true
            }
        });

        return res.status(200).json({ data });
    }

    async function createLeaveRequest(){
        try {
            const { allowed } = await authorizationClient.hasAccess(roqUserId, entity, ResourceOperationEnum.Create)
            if(!allowed) {
                return res.status(403).json({message: 'Forbidden' })
            }
            const curUser = await prisma.employee.findFirst({ where: { roqUserId }})
            const data = await prisma.leaveRequest.create({
              data: {
                start_date: dayjs().toDate(),
                end_date: dayjs().add(3, 'day').toDate(),
                leave_type: 'Sick',
                status: 'Pending',
                employee_id: curUser.id,
              }
            });
            return res.status(200).json({ data, message: 'Create leave request successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async function updateLeaveRequest(){
        try {
            const { allowed } = await authorizationClient.hasAccess(roqUserId, entity, ResourceOperationEnum.Update)
            if(!allowed) {
                return res.status(403).json({message: 'Forbidden' })
            }
            if (req.body.status) {
              // TODO: check role here, > department_manager is allow to update status
            }
            const data = await prisma.leaveRequest.update({
              where: {
                id: req.body.id
              },
              data: {
                status: req.body.status,
                end_date: dayjs().add(Math.ceil(Math.random()*10), 'day').toDate(),
              }
            });
            return res.status(200).json({ data, message: 'Update leave request successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }
    
    async function deleteProject() {

        const id = req.query.id as string;

        try {
            // await retrieveWithAuthorization({
            //     prismaCollection: prisma.project,
            //     entity,
            //     id,
            //     roqUserId,
            //     operation: ResourceOperationEnum.Delete
            // })
            // const existingWorkspaces = await prisma.workspace.findMany({ where: { projectId: id, }})
            // if(existingWorkspaces.length > 0) {
            //     return res.status(200).json({ success: false, message: 'Unable to delete project with existing workspace'})
            // }
            // const data = await prisma.project.delete({where: { id: id as string }});
            const data = {}

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