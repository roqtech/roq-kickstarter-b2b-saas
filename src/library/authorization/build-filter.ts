import { QueryPlanInterface } from "./interfaces";
const snakeCase = require('lodash.snakecase')
import pluralize from 'pluralize'
import { QueryPlanModel, ResourceOperationEnum } from "@roq/nodejs/dist/src/generated/sdk";
import { QueryPlanKind } from "./enums";
import { roqClient } from "server/roq";

function buildFilter(queryPlan: QueryPlanInterface, userIdField: string): Record<string, any> {
  if(queryPlan.tenantId) {
    const response =  {
      tenantId: queryPlan.tenantId
    }
    return response
  }
  if(queryPlan.userId) {
    const response =  {
      [userIdField]: {
        in: queryPlan.userId
      }
    }
    return response
  }
  if(queryPlan.case === 'many-to-many') {
    const response = {
      [pluralize(snakeCase(queryPlan.to))]: {
        some: {
          [snakeCase(queryPlan.to)]: buildFilter(queryPlan.in, userIdField)
        }
      }
    }
    return response
  }
  if(queryPlan.case === 'many-to-one') {
    const response = {
      [snakeCase(queryPlan.to)]: buildFilter(queryPlan.in, userIdField)
    }
    return response
  }

  const response =  {
    [pluralize(snakeCase(queryPlan.to))]: {
      some: buildFilter(queryPlan.in, userIdField)
    }
  }
  return response
}

export async function buildAuthorizationFilter(
  userId: string,
  entity: string,
  initialFilter?: Record<string, any>,
  queryPlansParam?: QueryPlanModel[]
): Promise<Record<string, any>> {
  let queryPlans = queryPlansParam
  if(!queryPlans) {
    const response = await roqClient
      .asUser(userId)
        .buildQueryPlan({
          entity,
          operation: ResourceOperationEnum.Read
        })
    queryPlans = response.buildQueryPlan
  }
  console.log('queryPlans:', JSON.stringify(queryPlans))
  const conditionals = queryPlans.filter((e) => e.kind === QueryPlanKind.restricted)
  const canAccessAll = queryPlans.find((e) => e.kind === QueryPlanKind.fullAccess)
  if(canAccessAll) {
    return initialFilter || {}
  }
  if(conditionals.length >= 2) {
    const filter =  {
      OR: conditionals.map((e) => buildFilter((e.queryPlan as unknown) as QueryPlanInterface, 'roqUserId'))
    }
    if(initialFilter) {
      return {
        AND: [
          initialFilter,
          filter
        ]
      }
    }
    return filter
  }
  if(conditionals.length === 1) {
    const filter = buildFilter((conditionals[0].queryPlan as unknown) as QueryPlanInterface, 'roqUserId')
    if(initialFilter) {
      return {
        AND: [
          initialFilter,
          filter
        ]
      }
    }
    return filter
  }
  return {
    id: {
      in: []
    }
  }
}