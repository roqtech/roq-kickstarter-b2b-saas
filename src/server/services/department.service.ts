import { prisma } from 'server/db'
import { Prisma, Department } from "@prisma/client";

export class DepartmentService {

  static async create(arg: Prisma.DepartmentCreateArgs) {
    return prisma.department.create(arg);
  }

  static async lists(arg?: Prisma.DepartmentFindManyArgs) {
    return prisma.department.findMany(arg);
  }
}
