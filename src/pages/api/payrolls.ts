import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession, withAuth } from '@roq/nextjs'
import { prisma } from 'server/db'
import { EmployeeService } from 'server/services/employee.service'
import { ResourceOperationEnum } from '@roq/nodejs/dist/src/generated/sdk'
import { retrieveWithAuthorization } from 'library/authorization/retrieve-with-authorization'
import { AuthorizationForbiddenException } from 'library/authorization/authorization-forbidden.exception'
import { authorizationClient } from 'server/roq'

const entity = 'Payroll'
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getServerSession(req)
  const { roqUserId } = session

  switch (req.method) {
    case 'GET':
      return getPayrolls()
    case 'POST':
      return createPayrolls()
    case 'DELETE':
      return deletePayroll()
    default:
      return res
        .status(405)
        .json({ message: 'Method ' + req.method + ' not allowed' })
  }

  async function getPayrolls() {
    const filter = await authorizationClient.buildAuthorizationFilter(
      roqUserId,
      entity,
    )
    // console.log('getPayrolls -> filter:', JSON.stringify(filter, null, 2))
    const data = await prisma.payroll.findMany({
      where: filter,
      orderBy: [{ createdAt: 'desc' }],
      include: {
        employee: true,
      },
    })

    return res.status(200).json({ data })
  }

  async function createPayrolls() {
    try {
      const { allowed } = await authorizationClient.hasAccess(
        roqUserId,
        entity,
        ResourceOperationEnum.Create,
      )
      if (!allowed) {
        return res.status(403).json({ message: 'Forbidden' })
      }
      const data = await prisma.payroll.create({
        data: {
          ...req.body,
        },
      })
      return res
        .status(200)
        .json({ data, message: 'Created payroll successfully' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async function deletePayroll() {
    const id = req.query.id as string
    try {
      const { allowed } = await authorizationClient.hasAccess(
        roqUserId,
        entity,
        ResourceOperationEnum.Delete,
      )
      if (!allowed) {
        return res.status(403).json({ message: 'Forbidden' })
      }
      const data = await prisma.payroll.delete({
        where: { id },
      })

      return res.status(200).json({ data, message: 'Deleted successfully' })
    } catch (error) {
      if (error instanceof AuthorizationForbiddenException) {
        return res.status(403).json({ message: 'Forbidden' })
      }
      return res.status(500).json({ message: 'Server error' })
    }
  }
}

// export default handler;
export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return withAuth(req, res)(handler)
}
