import { PrismaClient, Prisma } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const prismaGlobal = global as unknown as { prisma: PrismaClient };

const initPrisma =
  prismaGlobal.prisma ||
  new PrismaClient({
    log: ["query"],
  });

interface WithAuthorizationOptions {
  userId: string,
}

export type PrismaModel = {
  [k in "findMany" | "findFirst"]: CallableFunction;
};


export function withAuthorization<T, A, TResult extends Prisma.Result<T, A, "findMany">>(
  this: T,
  args: WithAuthorizationOptions
  ) {
    // get query plan
    return {
      findMany: async (
        options: Prisma.Args<T, "findMany">
        ): Promise<TResult> => {
      console.log('args: ', args);
      return (this as PrismaModel).findMany(options)
    },
  };
}
  

export const prisma = initPrisma.$extends({
  model: {
    $allModels: {
      withAuthorization
    }
  }
})

if (process.env.NODE_ENV !== "production") prismaGlobal.prisma = prisma;
