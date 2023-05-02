import type { NextApiRequest, NextApiResponse } from 'next'
import isEmpty from 'lodash.isempty'
import { DepartmentService } from 'server/services/department.service'
import { getServerSession, withAuth } from '@roq/nextjs'
import { authorizationClient } from 'server/roq'
import { prisma } from 'server/db'
import { ResourceOperationEnum } from '@roq/nodejs/dist/src/generated/sdk'

const entity = 'Department'
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getServerSession(req)
  const { roqUserId } = session

  switch (req.method) {
    case 'GET':
      return lists()
    case 'POST':
      return create()
    // case 'UPDATE':
    //     return createCar();
    case 'DELETE':
      return deleteDep()
    default:
      return res
        .status(405)
        .json({ message: 'Method ' + req.method + ' not allowed' })
  }

  async function lists() {
    try {
      const filter = await authorizationClient.buildAuthorizationFilter(
        roqUserId,
        entity,
      )
      const departments = await DepartmentService.lists({
        where: filter,
        include: {
          employees: true,
          department_manager: true,
        },
      })
      res.status(200).json({ departments })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async function create() {
    try {
      const { allowed } = await authorizationClient.hasAccess(
        roqUserId,
        entity,
        ResourceOperationEnum.Create,
      )
      if (!allowed) {
        return res.status(403).json({ message: 'Forbidden' })
      }
      const { department_manager_id } = req.body
      if (isEmpty(department_manager_id)) {
        return res
          .status(400)
          .json({ message: 'Department manager id is required' })
      }
      // TODO: validate role of department_manager_id
      const department = await DepartmentService.create({
        data: {
          ...req.body,
          department_manager_id,
        },
      })
      res
        .status(200)
        .json({ department, message: 'Create department successfully' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async function deleteDep() {
    try {
      const { allowed } = await authorizationClient.hasAccess(
        roqUserId,
        entity,
        ResourceOperationEnum.Delete,
      )
      if (!allowed) {
        return res.status(403).json({ message: 'Forbidden' })
      }
      const result = await prisma.department.delete({
        where: {
          id: req.body.id,
        },
      })
      res
        .status(200)
        .json({ result, message: 'Delete department successfully' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

// export default handler;
export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return withAuth(req, res)(handler)
}
