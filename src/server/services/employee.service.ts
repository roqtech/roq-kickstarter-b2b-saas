import { NotificationTypes } from "server/enums";
import { roqClient } from "server/roq";
import { prisma } from 'server/db'
import { DEFAULT_DEPARTMENT_ID } from "config/constants";

export class EmployeeService {

  static async registerUserIfNotExist(roqUserId: string, tenantId: string, email: string) {
    const exists = await prisma.employee.findFirst({
      where: {
        roqUserId
      }
    })
    if(!exists) {
      return this.registerUser(roqUserId, tenantId, email)
    }
  }

  static async registerUser(roqUserId: string, tenantId: string, email: string, departmentId?: string) {
    await prisma.employee.create({
      data: {
        roqUserId,
        tenantId,
        job_title: 'Employee',
        email,
        department: {
          connectOrCreate: {
            where: {
              id: departmentId || DEFAULT_DEPARTMENT_ID
            },
            create: {
              name: 'Initial'
            }
          }
        }
      },
    })
  }

  static async getUserId(roqUserId: string) {
    return (await prisma.employee.findFirst({ where: { roqUserId } })).id;
  }
}
