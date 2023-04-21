import { prisma } from 'server/db'
import { Prisma, Department } from "@prisma/client";

export class DepartmentService {

  static async create(arg: Prisma.DepartmentCreateArgs): Promise<Department> {
    return prisma.department.create(arg);
  }
}
