export enum RelationTypeEnum {
  ManyToMany = 'many-to-many',
  OneToMany = 'one-to-many',
  ManyToOne = 'many-to-one',
  OneToOne = 'one-to-one'
}

export enum QueryPlanKind {
  restricted = 'restricted',
  noAccess = 'noAccess',
  fullAccess = 'fullAccess'
}