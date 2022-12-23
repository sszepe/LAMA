/**
 * Displays a Clip
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton,
  Paper,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { indigo } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';

import { ClipBasicForm } from './ClipBasicForm';
import { BasicSegmentForm } from './BasicSegmentForm';
import { BasicElementForm } from './BasicElementForm';
import {
  TableView,
  getBasicTableViewItems,
  getAnnotTableViewItems,
} from './TableView';
import { Timecodes } from './Timecodes';
import { SegmentView } from './SegmentView';
import { MetaInfo } from './MetaInfo';
import { PlusButton } from './PlusButton';
import { ButtonGroup } from './CustomButtonGroup';
import { IconDeleteButton } from './DeleteButton';
import { Timeline } from './Timeline';

import {
  getClipAccordionsState,
  getEditingLeftState,
  getReadOnly,
  getUsername,
  shouldLockFormOnTheLeft,
} from '../selectors/app';
import {
  getClipElementById,
  getCurrentClip,
  getElementSegmentIds,
  getSegmentById,
} from '../selectors/clips';
import {
  doSetClipAccordions,
  doNewClip,
  doSetEditingLeft,
} from '../actionCreators/app';
import { doCreateConnection } from '../actionCreators/sidePanel';
import {
  doClipOverviewRendered,
  doDeleteElement,
  doFetchCurrentClip,
} from '../actionCreators/sagaActions';

import {
  supportedRelations,
  getConnectionTypeLabel,
} from '../connectionFormInfo';
import { getMetaInfo, withoutPathPrefix, withPathPrefix } from '../util';

import { BasicField } from '../viewFieldInfo';
import { ClipElement, ElementType } from '../types/clips';
import { ClipRelation, Relation } from '../types/relations';

const orderOfElementTypes: ElementType[] = [
  'Music',
  'Speech',
  'Noise',
  'Picture',
];

const basicFields: BasicField[] = [
  'title',
  'subtitle',
  'label',
  'url',
  'platform',
  'collections',
  'shelfmark',
  'fileType',
  'duration',
  'language',
  'clipType',
  'description',
];

export const clipRelations: ClipRelation[] =
  supportedRelations.Clip as ClipRelation[];

const relationsByElementType = supportedRelations;

const useStyles = makeStyles(_theme =>
  createStyles({
    categoryHeading: {
      backgroundColor: indigo[100],
      fontSize: '1.1rem',
      display: 'flex',
      flexDirection: 'row',
    },
    accordionButtons: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    innerAccordion: {
      display: 'block',
      padding: 0,
    },
    itemSummary: {
      backgroundColor: indigo[50],
      fontSize: '1.1rem',
      '& .MuiAccordionSummary-content': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
      },
    },
    topAccordion: {
      margin: '8px 0 0 0',
      '&.Mui-expanded': {
        margin: '8px 0 16px 0',
      },
    },
    basicForm: {
      marginBottom: '8px',
      padding: '8px 16px 16px',
      position: 'relative', // relevant for overlay
    },
    topButtons: {
      display: 'flex',
      '& :last-child': {
        marginLeft: 'auto',
      },
    },
  }),
);

interface CategoryAccordionProps {
  categoryId: string;
  children: React.ReactNode;
  label: string;
  expanded: boolean;
  itemIds: string[];
  toggleAll: (isOpen: boolean, accordionIds?: string[]) => void;
  toggleOne: (accordionId: string, open: boolean) => void;
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  categoryId,
  children,
  expanded,
  itemIds,
  label,
  toggleAll,
  toggleOne,
}) => {
  const classes = useStyles();
  return (
    <MuiAccordion
      expanded={expanded}
      onChange={(_event, open) => {
        toggleOne(categoryId, open);
      }}
    >
      <AccordionSummary
        id={categoryId}
        className={classes.categoryHeading}
        expandIcon={<ExpandMoreIcon />}
      >
        <span style={{ flexGrow: 1 }}>
          {label} ({itemIds.length})
        </span>
        <span>
          <IconButton
            title="Expand all"
            style={{ padding: '0 6px' }}
            onClick={event => {
              toggleAll(true, [...itemIds, categoryId]);
              event.stopPropagation();
            }}
          >
            <UnfoldMoreIcon fontSize="small" />
          </IconButton>
          <IconButton
            title="Collapse all"
            style={{ padding: '0 6px' }}
            onClick={event => {
              toggleAll(false, itemIds);
              event.stopPropagation();
            }}
          >
            <UnfoldLessIcon fontSize="small" />
          </IconButton>
        </span>
      </AccordionSummary>
      <AccordionDetails className={classes.innerAccordion}>
        {children}
      </AccordionDetails>
    </MuiAccordion>
  );
};

const unmountContentsIfClosed = { TransitionProps: { unmountOnExit: true } };

interface Props {
  clipId?: string;
}

export const ClipOverview: React.FC<Props> = ({ clipId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(getUsername);
  const clip = useSelector(getCurrentClip);
  const readOnlyMode = useSelector(getReadOnly);
  const isEditLocked = useSelector(shouldLockFormOnTheLeft);
  const editingLeftState = useSelector(getEditingLeftState);
  const isEditingNewClip =
    clip === null && editingLeftState.category === 'Clip';
  const isEditingExistingClip =
    clip !== null && editingLeftState.category === 'Clip';
  const isEditingElement = !['Clip', 'Segment', null].includes(
    editingLeftState.category,
  );
  const editingNewElementCategory: string | null =
    !['Clip', null].includes(editingLeftState.category) &&
    editingLeftState.id === null
      ? editingLeftState.category
      : null;
  const editingExistingElementId: string | null = isEditingElement
    ? editingLeftState.id
    : null;
  const buttonsDisabled: boolean =
    editingLeftState.category !== null || isEditLocked;
  const getE = useSelector(getClipElementById) as (id: string) => ClipElement;
  const getS = useSelector(getSegmentById);
  const categoryIds = ['Clip', 'Segment', ...orderOfElementTypes];
  const elementSegmentIds = useSelector(getElementSegmentIds);
  const accordionState = useSelector(getClipAccordionsState);
  const handleAccordionToggle = (
    accordionId: string,
    isOpen: boolean,
    parentId?: string,
  ) => {
    const accordionIdsToSet =
      parentId !== undefined && isOpen
        ? [accordionId, parentId]
        : [accordionId];
    dispatch(doSetClipAccordions(isOpen, accordionIdsToSet));
  };
  const setAccordions = (isOpen: boolean, accordionIds?: string[]) => {
    dispatch(doSetClipAccordions(isOpen, accordionIds));
  };
  React.useEffect(() => {
    if (withoutPathPrefix(location.pathname) === '/clip/new') {
      dispatch(doNewClip());
    }
  }, [dispatch]);
  React.useEffect(() => {
    if (clipId) {
      dispatch(doFetchCurrentClip(clipId));
    }
  }, [clipId, dispatch]);
  React.useEffect(() => {
    dispatch(doClipOverviewRendered());
  }, [clip, dispatch]);
  if (isEditingNewClip) {
    return (
      <Paper className={classes.basicForm}>
        <ClipBasicForm />
      </Paper>
    );
  }
  return (
    <div>
      <Paper id="Clip" className={classes.basicForm}>
        {isEditingExistingClip ? (
          <ClipBasicForm />
        ) : (
          clip !== null && (
            <div>
              <div className={classes.topButtons}>
                {!readOnlyMode && (
                  <ButtonGroup
                    disabled={buttonsDisabled}
                    disabledTitle="Please finish editing first"
                  >
                    <IconButton
                      title="Edit"
                      onClick={() => {
                        dispatch(doSetEditingLeft(true, 'Clip'));
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </ButtonGroup>
                )}
                <Button
                  onClick={function () {
                    history.push(withPathPrefix(`/explore/clip/${clipId}`));
                  }}
                >
                  Explore
                </Button>
              </div>
              <TableView
                items={getBasicTableViewItems(basicFields, clip)}
                extraInfo={getMetaInfo(clip)}
              />
            </div>
          )
        )}
      </Paper>
      <div className={classes.accordionButtons}>
        {(!categoryIds.every(c => accordionState[c]) ||
          elementSegmentIds.some(x => accordionState[x])) && (
          <Button
            startIcon={<UnfoldMoreIcon />}
            onClick={() => {
              setAccordions(true, [
                'ClipAnnotations',
                ...categoryIds,
                'Timeline',
              ]);
              setAccordions(false, elementSegmentIds);
            }}
          >
            Expand Categories
          </Button>
        )}
        <Button
          startIcon={<UnfoldMoreIcon />}
          onClick={() => {
            setAccordions(true);
          }}
        >
          Expand All
        </Button>
        <Button
          startIcon={<UnfoldLessIcon />}
          onClick={() => {
            setAccordions(false);
          }}
        >
          Collapse All
        </Button>
      </div>
      {clip !== null && (
        <>
          <MuiAccordion
            className={classes.topAccordion}
            expanded={accordionState.ClipAnnotations}
            onChange={(_event, open) => {
              handleAccordionToggle('ClipAnnotations', open);
            }}
          >
            <AccordionSummary
              id="ClipAnnotations"
              className={classes.categoryHeading}
              expandIcon={<ExpandMoreIcon />}
            >
              Clip Annotations
            </AccordionSummary>
            <AccordionDetails style={{ display: 'block' }}>
              {!readOnlyMode && (
                <ButtonGroup
                  disabled={buttonsDisabled}
                  disabledTitle="Please finish editing first"
                >
                  <PlusButton
                    title="Add annotation"
                    options={supportedRelations.Clip.map(r => ({
                      text: getConnectionTypeLabel(r),
                      handleClick: () => {
                        dispatch(doCreateConnection(r));
                      },
                    }))}
                  />
                </ButtonGroup>
              )}
              <TableView
                items={getAnnotTableViewItems(clipRelations, clip.annotations)}
              />
            </AccordionDetails>
          </MuiAccordion>
          {(clip.segments.length > 0 ||
            editingNewElementCategory === 'Segment') && (
            <CategoryAccordion
              categoryId="Segment"
              expanded={accordionState.Segment}
              itemIds={clip.segments}
              label="Segments"
              toggleAll={setAccordions}
              toggleOne={handleAccordionToggle}
            >
              {editingNewElementCategory === 'Segment' && (
                <Paper className={classes.basicForm}>
                  <BasicSegmentForm />
                </Paper>
              )}
              {clip.segments
                .map(segmentId => getS(segmentId))
                .map(segment => {
                  return (
                    <MuiAccordion
                      key={segment._id}
                      expanded={accordionState[segment._id]}
                      onChange={(_event, open) => {
                        handleAccordionToggle(segment._id, open);
                      }}
                      {...unmountContentsIfClosed}
                    >
                      <AccordionSummary
                        id={segment._id}
                        className={classes.itemSummary}
                        expandIcon={<ExpandMoreIcon />}
                      >
                        <span>{segment.label}</span>
                        &#160;
                        <Typography component="span" color="textSecondary">
                          <Timecodes timecodes={segment.timecodes} />
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails style={{ display: 'block' }}>
                        <SegmentView segmentProp={segment} />
                      </AccordionDetails>
                    </MuiAccordion>
                  );
                })}
            </CategoryAccordion>
          )}
          {orderOfElementTypes.map(et => {
            if (
              clip.elements[et].length === 0 &&
              editingNewElementCategory !== et
            ) {
              return null;
            }
            return (
              <CategoryAccordion
                key={et}
                categoryId={et}
                expanded={accordionState[et]}
                itemIds={clip.elements[et]}
                label={et === 'Noise' ? 'Other Sounds' : et}
                toggleAll={setAccordions}
                toggleOne={handleAccordionToggle}
              >
                {editingNewElementCategory === et && (
                  <Paper className={classes.basicForm}>
                    <BasicElementForm />
                  </Paper>
                )}
                {clip.elements[et].map(getE).map(element => (
                  <MuiAccordion
                    key={element._id}
                    expanded={accordionState[element._id]}
                    onChange={(_event, open) => {
                      handleAccordionToggle(element._id, open);
                    }}
                    {...unmountContentsIfClosed}
                  >
                    <AccordionSummary
                      id={element._id}
                      className={classes.itemSummary}
                      expandIcon={<ExpandMoreIcon />}
                    >
                      <span>{element.label}</span>
                      &#160;
                      <Typography component="span" color="textSecondary">
                        <Timecodes timecodes={element.timecodes} />
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{ display: 'block' }}>
                      {editingExistingElementId === element._id ? (
                        <BasicElementForm element={element} />
                      ) : (
                        <Typography>{element.description}</Typography>
                      )}
                      <MetaInfo about={element} />
                      {!readOnlyMode && (
                        <ButtonGroup
                          disabled={buttonsDisabled}
                          disabledTitle="Please finish editing first"
                        >
                          <PlusButton
                            title="Add Annotation"
                            options={supportedRelations[et].map(r => ({
                              text: getConnectionTypeLabel(r),
                              handleClick: () => {
                                dispatch(doCreateConnection(r, element._id));
                              },
                            }))}
                          />
                          <IconButton
                            title="Edit"
                            onClick={() => {
                              dispatch(doSetEditingLeft(true, et, element._id));
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          {element.createdBy === currentUser && (
                            <IconDeleteButton
                              onClick={() => {
                                dispatch(doDeleteElement(element));
                              }}
                            />
                          )}
                        </ButtonGroup>
                      )}
                      <TableView
                        items={getAnnotTableViewItems(
                          relationsByElementType[et],
                          (
                            element as ClipElement & {
                              annotations: Record<
                                Relation,
                                string[] | undefined
                              >;
                            }
                          ).annotations,
                        )}
                      />
                    </AccordionDetails>
                  </MuiAccordion>
                ))}
              </CategoryAccordion>
            );
          })}
          <MuiAccordion
            expanded={accordionState.Timeline}
            onChange={(_event, open) => {
              handleAccordionToggle('Timeline', open);
            }}
          >
            <AccordionSummary
              id="Timeline"
              className={classes.categoryHeading}
              expandIcon={<ExpandMoreIcon />}
            >
              Timeline
            </AccordionSummary>
            <AccordionDetails style={{ display: 'block', padding: 0 }}>
              <Timeline />
            </AccordionDetails>
          </MuiAccordion>
        </>
      )}
    </div>
  );
};
