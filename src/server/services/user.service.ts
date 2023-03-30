import { NotificationTypes } from "server/enums";
import { roqClient } from "server/roq";
import { prisma } from 'server/db'

export class UserService {
  static async welcomeUser(userId: string) {
    roqClient.asSuperAdmin().notify({
      notification: {
        key: NotificationTypes.welcome,
        recipients: { userIds: [userId] },
      },
    });
  }

  static async registerUser(roqUserId: string, tenantId: string) {
    await prisma.user.create({
      data: {
        roqUserId,
        tenantId,
      }
    })
  }

  static async getUserId(roqUserId: string) {
    return (await prisma.user.findFirst({ where: { roqUserId } })).id;
  }
}
