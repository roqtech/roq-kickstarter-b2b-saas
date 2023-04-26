import type {NextApiRequest, NextApiResponse} from 'next';
import {getServerSession, withAuth} from "@roq/nextjs";
import dayjs from 'dayjs'
import { prisma } from 'server/db';
import { EmployeeService } from 'server/services/employee.service';
import { ResourceOperationEnum } from "@roq/nodejs/dist/src/generated/sdk";
import { retrieveWithAuthorization } from 'library/authorization/retrieve-with-authorization';
import { AuthorizationForbiddenException } from 'library/authorization/authorization-forbidden.exception';
import { authorizationClient } from 'server/roq';

const entity = 'PerformanceEvaluation'
async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = getServerSession(req);
    const { roqUserId } = session

    switch (req.method) {
        case 'GET':
            return getPerformanceEvaluations();
        case 'POST':
            return createPerformanceEvaluation();
        case 'PATCH':
            return updatePerformanceEvaluation();
        // case'DELETE':
        //     return deleteProject();
        default:
            return res.status(405).json({message: 'Method ' + req.method + ' not allowed'})
    }


    async function getPerformanceEvaluations() {
        const filter = await authorizationClient.buildAuthorizationFilter(roqUserId, entity)
        console.log('getPerformanceEvaluations -> filter:', filter)

        // const curUser = await prisma.employee.findFirst({ where: { roqUserId }})
        // const department_id = curUser.department_id
        const data = await prisma.performanceEvaluation.findMany({
            where: filter,
            // where: {
            //   ...filter, 
              // employee: {
              //   department_id
              // }
            // },
            orderBy: [{createdAt: 'desc',},],
            include: {
              evaluatee: true,
              evaluator: true
            }
        });

        return res.status(200).json({ data });
    }

    async function createPerformanceEvaluation(){
        try {
            const { allowed } = await authorizationClient.hasAccess(roqUserId, entity, ResourceOperationEnum.Create)
            if(!allowed) {
                return res.status(403).json({message: 'Forbidden' })
            }
            const curUser = await prisma.employee.findFirst({ where: { roqUserId }})
            const data = await prisma.performanceEvaluation.create({
              data: {
                date: dayjs().toDate(),
                feedback: req.body.feedback ?? 'Good',
                rating: req.body.rating,
                evaluator_id: curUser.id,
                evaluatee_id: req.body.evaluatee_id
              }
            });
            return res.status(200).json({ data, message: 'Created evaluation successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    async function updatePerformanceEvaluation(){
        try {
            const { allowed } = await authorizationClient.hasAccess(roqUserId, entity, ResourceOperationEnum.Update)
            if(!allowed) {
                return res.status(403).json({message: 'Forbidden' })
            }
            console.log('updatePerformanceEvaluation -> req.body.id:', req.body.id)
            const data = await prisma.performanceEvaluation.update({
              where: {
                id: req.body.id
              },
              data: {
                date: dayjs().toDate(),
                rating: Math.ceil(Math.random()*10),
              }
            });
            return res.status(200).json({ data, message: 'Update successfully' });
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