/**
 * Selector functions for "clips" state.
 */
import { RootState } from '../types/root';

import { Annotation, Clip, ClipElement, Segment } from '../types/clips';

export const getCurrentClip = (state: RootState): Clip | null =>
  state.clipState.currentClip;

export const getAnnotationIds = (state: RootState): string[] =>
  Object.keys(state.clipState.clipAnnotations);

export const getAnnotationById =
  (state: RootState) =>
  (annotId: string): Annotation =>
    state.clipState.clipAnnotations[annotId] ||
    state.queryState.queryResultData.annotationData[annotId];

export const getClipElementById =
  (state: RootState) =>
  (elementId: string): ClipElement | undefined =>
    state.clipState.clipElements[elementId];

export const getSegmentById =
  (state: RootState) =>
  (segmentId: string): Segment =>
    state.clipState.clipSegments[segmentId];

export const getCurrentClipTitle = (state: RootState): string => {
  const clip = state.clipState.currentClip;
  return clip !== null
    ? clip.label || clip.title
    : 'LAMA... Linked Annotations for Media Analysis';
};

export const getLabelsUsedInClip = (state: RootState): Set<string> =>
  new Set([
    ...Object.values(state.clipState.clipElements).map(e => e.label),
    ...Object.values(state.clipState.clipSegments).map(s => s.label),
  ]);

export const getElementSegmentIds = (state: RootState): string[] => [
  ...Object.keys(state.clipState.clipElements),
  ...Object.keys(state.clipState.clipSegments),
];
