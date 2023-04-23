import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { DepartmentService } from 'server/services/department.service'
import { getServerSession, withAuth } from '@roq/nextjs'
import { roqClient } from '../../server/roq'
import { ResourceOperationEnum } from '@roq/nodejs/dist/src/generated/sdk'
import { buildAuthorizationFilter, hasAccess } from 'library/authorization'

const prisma = new PrismaClient()

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
    // case'DELETE':
    //     return deleteCar();
    default:
      return res
        .status(405)
        .json({ message: 'Method ' + req.method + ' not allowed' })
  }

  async function lists() {
    const filter = await buildAuthorizationFilter(roqUserId, entity)
    console.log('lists -> filter:', filter)
    // TODO: admin filter
    // {
    //   employees: { some: { tenantId: '9658ae0c-a18d-4962-a38b-a8c22786e495' } }
    // }
    // is not enough because admin belong to 1 department
    const departments = await DepartmentService.lists({
      where: filter,
      include: {
        employees: true,
      },
    })
    res.status(200).json({ departments })
  }

  async function create() {
    const department = await DepartmentService.create({
      data: {
        ...req.body,
      },
    })
    const { allowed } = await hasAccess(
      roqUserId,
      entity,
      ResourceOperationEnum.Create,
    )
    if (!allowed) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    res.status(200).json({ department })
  }
}

// export default handler;
export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return withAuth(req, res)(handler)
}
