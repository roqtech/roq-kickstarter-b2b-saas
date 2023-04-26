import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession, withAuth } from '@roq/nextjs'
import { prisma } from 'server/db'
import { EmployeeService } from 'server/services/employee.service'
import { ResourceOperationEnum } from '@roq/nodejs/dist/src/generated/sdk'
import { retrieveWithAuthorization } from 'library/authorization/retrieve-with-authorization'
import { AuthorizationForbiddenException } from 'library/authorization/authorization-forbidden.exception'
import { authorizationClient } from 'server/roq'
import dayjs from 'dayjs'

const entity = 'Payslip'
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getServerSession(req)
  const { roqUserId } = session

  switch (req.method) {
    case 'GET':
      return getPayslips()
    case 'POST':
      return createPayslips()
    case 'DELETE':
      return deletePayslips()
    default:
      return res
        .status(405)
        .json({ message: 'Method ' + req.method + ' not allowed' })
  }

  async function getPayslips() {
    const filter = await authorizationClient.buildAuthorizationFilter(
      roqUserId,
      entity,
    )
    // console.log('getPayslips -> filter:', JSON.stringify(filter, null, 2))
    const data = await prisma.payslip.findMany({
      where: filter,
      orderBy: [{ createdAt: 'desc' }],
      include: {
        payroll: {
          include: {
            employee: true
          }
        },
      },
    })

    return res.status(200).json({ data })
  }

  async function createPayslips() {
    try {
      const { allowed } = await authorizationClient.hasAccess(
        roqUserId,
        entity,
        ResourceOperationEnum.Create,
      )
      if (!allowed) {
        return res.status(403).json({ message: 'Forbidden' })
      }
      const data = await prisma.payslip.create({
        data: {
          payroll_id: req.body.payroll_id,
          bonuses: Math.ceil(Math.random()*10),
          date: dayjs().toDate(),
          deductions: Math.ceil(Math.random()*10),
          gross_salary: req.body.gross_salary,
          net_salary: req.body.net_salary,
        },
      })
      return res
        .status(200)
        .json({ data, message: 'Created payslip successfully' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  async function deletePayslips() {
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
      const data = await prisma.payslip.delete({
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
