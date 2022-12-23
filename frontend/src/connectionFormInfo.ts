/**
 * Re-exporting relation data generated from "truth".
 */
import * as G from './generated/relations';
import { EntityType } from './types/entities';
import { AnnotationField, ClipElement, Relation } from './types/relations';

export const supportedRelations = G.supportedRelations as Record<
  ClipElement,
  Relation[]
>;

type CRI = {
  label: string;
  definition: string;
  multi: boolean;
  types: EntityType[];
  roles: EntityType[];
  allowed: AnnotationField[];
  required: AnnotationField[];
};

export const connectionRelationInfo = G.connectionRelationInfo as Record<
  Relation,
  CRI
>;

export const getConnectionTypeLabel = (t: Relation): string =>
  connectionRelationInfo[t].label;
