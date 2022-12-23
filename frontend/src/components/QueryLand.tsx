/**
 * Main query page.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Button,
  IconButton,
  Paper,
  Typography,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { QueryBlock } from './QueryBlock';
import { QueryIntersectionResultView } from './QueryIntersectionResultView';

import {
  getQueryBlocks,
  getQueryResults,
  getQueryIntersectionLoadingState,
  getReadyToClear,
  getReadyToQuery,
} from '../selectors/query';
import { doToggleSidePanel } from '../actionCreators/app';
import { doClearQuery, doNewQueryBlock } from '../actionCreators/query';
import { doGetQueryResults } from '../actionCreators/sagaActions';

import { EmptyObject } from '../types';

const useStyles = makeStyles(_theme =>
  createStyles({
    topButtons: { display: 'flex', alignItems: 'center' },
    rightButtons: { marginLeft: 'auto' },
  }),
);

export const QueryLand: React.FC<EmptyObject> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const queryBlocks = useSelector(getQueryBlocks);
  const queryResultData = useSelector(getQueryResults);
  const isLoading = useSelector(getQueryIntersectionLoadingState);
  const couldQuery = useSelector(getReadyToQuery)();
  const couldClear = useSelector(getReadyToClear);
  const resultPossible = queryResultData.intersectionByClip !== null;
  const couldClearResult = Object.values(queryResultData.blockAnnotations).some(
    a => a.length > 0,
  );
  const addQueryBlock = () => {
    if (queryBlocks.length < 3) {
      dispatch(doNewQueryBlock());
    }
  };
  React.useEffect(() => {
    dispatch(doToggleSidePanel(true));
    return () => {
      dispatch(doToggleSidePanel(false));
    };
  }, [dispatch]);
  return (
    <div>
      <div className={classes.topButtons}>
        <span>
          {queryBlocks.length < 3 && (
            <IconButton onClick={addQueryBlock} title="Add query block">
              <AddIcon />
            </IconButton>
          )}
          <Button
            title="Order of columns corresponds to query blocks."
            disabled={!couldQuery}
            onClick={() => {
              dispatch(doGetQueryResults(queryBlocks));
            }}
          >
            Combined query by Clip
          </Button>
        </span>
        <span className={classes.rightButtons}>
          {couldClearResult && (
            <Button
              title="Gone!"
              onClick={() => {
                dispatch(doClearQuery());
              }}
            >
              Clear all results
            </Button>
          )}
          {couldClear && (
            <Button
              title="Gone!"
              onClick={() => {
                dispatch(doClearQuery(true));
              }}
            >
              Clear everything
            </Button>
          )}
        </span>
      </div>
      {queryBlocks.map((qb, i) => (
        <QueryBlock key={i} data={qb} />
      ))}
      {isLoading ? (
        <Paper style={{ margin: '8px', padding: '8px' }}>
          <Typography>Loading...</Typography>
        </Paper>
      ) : resultPossible ? (
        <QueryIntersectionResultView />
      ) : null}
    </div>
  );
};
