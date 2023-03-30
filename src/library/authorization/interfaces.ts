import { QueryPlanKind, RelationTypeEnum } from "./enums";

export interface BuildQueryPlanResponse {
  kind: QueryPlanKind,
  queryPlan: QueryPlanInterface
}
export interface QueryPlanInterface {
  case: RelationTypeEnum;
  from: string;
  fromField?: string;
  to?: string;
  in?: QueryPlanInterface;
  userId?: string[];
  toField?: string;
  joinRelation?: string;
  joinRelationFromField?: string;
  joinRelationtoField?: string;
  tenantId?: string
}