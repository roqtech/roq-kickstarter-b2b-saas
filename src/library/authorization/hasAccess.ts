import { QueryPlanModel, ResourceOperationEnum,  } from "@roq/nodejs/dist/src/generated/sdk"
import { roqClient } from "server/roq"
import { QueryPlanKind } from "./enums"

export async function hasAccess(
  userId: string,
  entity: string,
  operation = ResourceOperationEnum.Read
): Promise<{
  allowed: boolean,
  queryPlans: QueryPlanModel[]
}> {
  const { buildQueryPlan: queryPlans } = await roqClient.asUser(userId)
    .buildQueryPlan({
      entity,
      operation
    })
  console.log('queryPlans:', queryPlans)
  const conditionals = queryPlans.filter((e) => e.kind === QueryPlanKind.restricted)
  const canAccessAll = queryPlans.find((e) => e.kind === QueryPlanKind.fullAccess)

  if(canAccessAll) {
    return {
      allowed: true,
      queryPlans
    }
  }

  if(operation === ResourceOperationEnum.Create) {
    return {
      allowed: queryPlans.some((e) => e.kind !== QueryPlanKind.noAccess),
      queryPlans
    }
  }

  if(conditionals.length === 0) {
    return {
      allowed: false,
      queryPlans,
    }
  }

  return {
    allowed: true,
    queryPlans,
  }
}