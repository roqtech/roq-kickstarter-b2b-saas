import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession, withAuth } from '@roq/nextjs'
import { prisma } from 'server/db'
import { authorizationClient, roqClient } from 'server/roq'
import { EmployeeService } from 'server/services/employee.service'
import { hasAccess } from 'library/authorization/hasAccess'
import { ResourceOperationEnum } from '@roq/nodejs/dist/src/generated/sdk'
import { retrieveWithAuthorization } from 'library/authorization/retrieve-with-authorization'
import { buildAuthorizationFilter } from 'library/authorization/build-filter'
import { AuthorizationForbiddenException } from 'library/authorization/authorization-forbidden.exception'

const entity = 'Employee'
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getServerSession(req)
  const { roqUserId } = session

  switch (req.method) {
    case 'GET':
      return getEmployees()
    // case 'POST':
    //     return createPayrolls();
    case 'PATCH':
      return updateEmployees()
    default:
      return res
        .status(405)
        .json({ message: 'Method ' + req.method + ' not allowed' })
  }

  async function getEmployees() {
    const { type = 'all' } = req.query ?? {}
    let additionalFilter = {}
    if (type !== 'all') {
      const token = await roqClient.authorization.createServiceAccountToken()
      const payload: any = {
        operationName: null,
        variables: {},
        query: `{\n  users(filter: {roleKey: {valueIn: [\"${type}\"]}}) {\n    data {\n      id\n      email\n    }\n  }\n}\n`,
      }
      const users = await fetch(
        `${process.env.ROQ_PLATFORM_URL}/v01/server/graphql`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'roq-platform-authorization': 'Bearer ' + token,
            'roq-platform-server-authorization':
              'Basic YTE4N2Y3NmEtMTllNS00NGJmLTkzNWQtYzdlMjZhMmIwMGViOjA0OTQzZWVhLTcyZDAtNGY1OS04MzBlLWM4NzlhNmFiZmY5Mw==',
          },
          body: JSON.stringify(payload),
        },
      )
        .then((res) => res.json())
        .catch((err) => console.log('getEmployees -> err:', err))
      const userIds =
        users?.data?.users?.data?.map((user: any) => user.id) ?? []
      additionalFilter = {
        roqUserId: {
          in: userIds,
        },
      }
    }
    const filter = await authorizationClient.buildAuthorizationFilter(
      roqUserId,
      entity,
      additionalFilter,
    )
    const data = await prisma.employee.findMany({
      where: filter,
      orderBy: [{ createdAt: 'desc' }],
      include: {
        department: true,
        payroll: true,
      },
    })

    return res.status(200).json({ data })
  }

  async function updateEmployees() {
    try {
      const { allowed } = await authorizationClient.hasAccess(
        roqUserId,
        entity,
        ResourceOperationEnum.Update,
      )
      if (!allowed) {
        return res.status(403).json({ message: 'Forbidden' })
      }
      const data = await prisma.employee.update({
        where: {
          id: req.body.employee_id,
        },
        data: {
          department_id: req.body.department_id,
        },
      })
      return res
        .status(200)
        .json({ data, message: 'Employee updated successfully' })
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
