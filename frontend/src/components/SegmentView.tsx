/**
 * Display a Segment in ClipOverview.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { IconButton, Typography, makeStyles } from '@material-ui/core';
import { lightBlue } from '@material-ui/core/colors';

import EditIcon from '@material-ui/icons/Edit';
import LinkIcon from '@material-ui/icons/Link';
import PowerIcon from '@material-ui/icons/PowerSettingsNew';

import { sortBy } from 'lodash';

import { TableView, getAnnotTableViewItems } from './TableView';
import { Accordion } from './Accordion';
import { BasicSegmentForm } from './BasicSegmentForm';
import { MetaInfo } from './MetaInfo';
import { ButtonGroup } from './CustomButtonGroup';
import { IconDeleteButton } from './DeleteButton';

import { supportedRelations } from '../connectionFormInfo';

import {
  doActivateSegment,
  doDeactivateSegment,
  doSetEditingLeft,
} from '../actionCreators/app';
import { doJumpTo, doDeleteSegment } from '../actionCreators/sagaActions';
import {
  getActiveSegment,
  getEditingLeftState,
  getUsername,
  getReadOnly,
  shouldLockFormOnTheLeft,
} from '../selectors/app';
import { getAnnotationById, getClipElementById } from '../selectors/clips';

import { Annotation, ClipElement, Segment } from '../types/clips';
import { Relation, ClipRelation } from '../types/relations';

const activeColor = lightBlue[500];

const useStyles = makeStyles({
  activeSegment: {
    '& .MuiIconButton-label': {
      // stroke: theme.palette.primary,
      stroke: activeColor,
    },
    '&.MuiIconButton-root': {
      boxShadow: '0 0 8px ' + activeColor,
    },
  },
});

type ElementTypeHere =
  | 'ClipAnnotations'
  | 'Music'
  | 'Speech'
  | 'Noise'
  | 'Picture';
const elementTypesHere: ElementTypeHere[] = [
  'ClipAnnotations',
  'Music',
  'Speech',
  'Noise',
  'Picture',
];

export const usedClipRelations: ClipRelation[] = [
  'RBroadcastDate',
  'RBroadcastSeries',
  'RContributor',
  'RKeyword',
  'RQuote',
  'RDateOfCreation',
];

const elementFields = {
  ...supportedRelations,
  ClipAnnotations: supportedRelations.Clip,
};

const groupAnnots = (annots: Annotation[]) => {
  const byElement = annots.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.element || 'ClipAnnotations']: [
        ...(acc[cur.element || 'ClipAnnotations'] || []),
        cur,
      ],
    }),
    {} as Record<string, Annotation[]>,
  );
  return Object.entries(byElement).reduce(
    (acc, [elementId, elementAnnots]) => ({
      ...acc,
      [elementId]: elementAnnots.reduce(
        (rAcc, cur) => ({
          ...rAcc,
          [cur.relation]: [...(rAcc[cur.relation] || []), cur._id],
        }),
        {} as Record<Relation, string[]>,
      ),
    }),
    {} as Record<string, Record<Relation, string[]>>,
  );
};

interface Props {
  segmentProp?: Segment;
}

export const SegmentView: React.FC<Props> = ({ segmentProp }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const segment = segmentProp;
  const readOnlyMode = useSelector(getReadOnly);
  const activeSegment = useSelector(getActiveSegment);
  const isActive = segment?._id === activeSegment?._id;
  const isUserSegment = useSelector(getUsername) === segment?.createdBy;
  const editingLeftState = useSelector(getEditingLeftState);
  const isEditingSegment = editingLeftState.category === 'Segment';
  const editingExistingSegmentId: string | null = isEditingSegment
    ? editingLeftState.id
    : null;
  const isEditLocked = useSelector(shouldLockFormOnTheLeft);
  const buttonsDisabled: boolean =
    editingLeftState.category !== null || isEditLocked;
  const getA = useSelector(getAnnotationById);
  const getE = useSelector(getClipElementById) as (id: string) => ClipElement;
  if (segment === undefined) {
    return (
      <Accordion defaultExpanded heading="Segment Basic">
        <BasicSegmentForm />
      </Accordion>
    );
  }
  const getElementType = (elementId: string) => getE(elementId).type;
  const byElementId = groupAnnots(
    sortBy(
      segment.segmentContains.map(sc => sc.annotation).map(getA),
      a => [a.timecodeStart || -1, a.timecodeEnd || -1, a.created],
      ['asc', 'asc', 'desc'],
    ),
  );
  const byElementType = Object.entries(byElementId).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k === 'ClipAnnotations' ? 'ClipAnnotations' : getElementType(k)]: {
        ...(acc[
          k === 'ClipAnnotations' ? 'ClipAnnotations' : getElementType(k)
        ] || {}),
        [k]: v,
      },
    }),
    {} as Record<
      'ClipAnnotations' | 'Music' | 'Speech' | 'Noise' | 'Picture' | 'Segment',
      Record<string, Record<Relation, string[]>>
    >,
  );
  return (
    <>
      {editingExistingSegmentId === segment._id ? (
        <BasicSegmentForm segment={segment} />
      ) : (
        <Typography>{segment.description}</Typography>
      )}
      <MetaInfo about={segment} />
      {!readOnlyMode && (
        <ButtonGroup
          disabled={buttonsDisabled}
          disabledTitle="Please finish editing first"
        >
          <IconButton
            className={classNames({ [classes.activeSegment]: isActive })}
            title={isActive ? 'Deactivate' : 'Activate'}
            onClick={() => {
              dispatch(
                isActive
                  ? doDeactivateSegment()
                  : doActivateSegment(segment._id),
              );
            }}
          >
            <PowerIcon />
          </IconButton>
          <IconButton
            title="Edit"
            onClick={() => {
              dispatch(doSetEditingLeft(true, 'Segment', segment._id));
            }}
          >
            <EditIcon />
          </IconButton>
          {isUserSegment && (
            <IconDeleteButton
              onClick={() => {
                dispatch(doDeleteSegment(segment));
              }}
            />
          )}
        </ButtonGroup>
      )}
      {elementTypesHere
        .filter(
          et =>
            byElementType[et] !== undefined &&
            Object.keys(byElementType[et]).length > 0,
        )
        .map(et => {
          return Object.entries(byElementType[et]).map(
            ([elementId, byRelation]) => {
              const heading =
                elementId === 'ClipAnnotations'
                  ? 'Clip Annotations'
                  : `${getE(elementId).label} (${
                      et === 'Noise' ? 'Other Sounds' : et
                    })`;
              return (
                <div key={elementId}>
                  <div>
                    {heading}
                    <IconButton
                      title="Go to"
                      onClick={e => {
                        e.preventDefault();
                        dispatch(doJumpTo(elementId, [et, elementId]));
                      }}
                    >
                      <LinkIcon />
                    </IconButton>
                  </div>
                  <TableView
                    items={getAnnotTableViewItems(
                      elementFields[et],
                      byRelation,
                    )}
                  />
                </div>
              );
            },
          );
        })}
    </>
  );
};
