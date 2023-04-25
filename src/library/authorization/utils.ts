import { RelationTypeEnum } from "./enums";
import { QueryPlanInterface } from "./interfaces";

function lowerFirstLetter(str: string) {
  if (str.length === 0) {
    return str;
  } else {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }
}

function formatRelation(foreignKey: string) {
  if(foreignKey.endsWith('_id')) {
    const snakeCaseIdx = foreignKey.lastIndexOf('_id');
    return foreignKey.slice(0, snakeCaseIdx) + foreignKey.slice(snakeCaseIdx + 3);
  } else if(foreignKey.endsWith('Id')) {
    const camelCaseIdx = foreignKey.lastIndexOf('Id');
    return foreignKey.slice(0, camelCaseIdx) + foreignKey.slice(camelCaseIdx + 3);
  }
  return foreignKey
}

export function getRelation(queryPlan: QueryPlanInterface) {
  if(queryPlan.case === RelationTypeEnum.OneToMany) {
    return formatRelation(queryPlan.toField)
  } else if(queryPlan.case === RelationTypeEnum.ManyToOne) {
    return formatRelation(queryPlan.fromField)
  } else {
    return lowerFirstLetter(queryPlan.to)
  }
}