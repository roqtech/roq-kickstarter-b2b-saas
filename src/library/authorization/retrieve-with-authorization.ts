import { ResourceOperationEnum } from "@roq/nodejs/dist/src/generated/sdk"
import { AuthorizationForbiddenException } from "./authorization-forbidden.exception"
import { buildAuthorizationFilter } from "./build-filter"
import { hasAccess } from "./hasAccess"

interface RetrieveWithAuthorizationParams {
  prismaCollection: any,
  roqUserId: string,
  entity: string
  id: string
  operation?: ResourceOperationEnum
}

export async function retrieveWithAuthorization(params: RetrieveWithAuthorizationParams) {
  const { roqUserId, entity, operation, prismaCollection, id } = params
  const { allowed, queryPlans } = await hasAccess(roqUserId, entity, operation)
  if(!allowed) {
    throw new AuthorizationForbiddenException('Forbidden')
  }
  const filter = await buildAuthorizationFilter(roqUserId, entity, { id }, queryPlans)
  return prismaCollection.findFirst({
    where: filter
  })
}