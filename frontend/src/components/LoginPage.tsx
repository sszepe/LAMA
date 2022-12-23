/**
 * LoginPage for either logging in or to activate read-only mode.
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Paper,
  createStyles,
  makeStyles,
  alpha,
  Typography,
} from '@material-ui/core';

import { LoginForm } from './LoginForm';

import { LamaIcon } from './LamaIcon';

import { doReadOnly } from '../actionCreators/sagaActions';
import { getAuthStatus } from '../selectors/app';

import { withoutPathPrefix } from '../util';

import { EmptyObject } from '../types';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    outerPaper: {
      maxWidth: theme.spacing(80),
      marginTop: theme.spacing(20),
      marginBottom: theme.spacing(2),
      padding: theme.spacing(1),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    content: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    readPaper: {
      padding: theme.spacing(1),
    },
    or: {
      marginTop: theme.spacing(1),
      color: '#777',
      fontStyle: 'italic',
      fontSize: theme.typography.fontSize * 0.9,
    },
    formLamas: {
      display: 'flex',
    },
    lamaIcon: {
      color: alpha(process.env.APPBAR_COLOR || '#ddd', 0.7),
      fontSize: theme.spacing(20),
      margin: theme.spacing(2),
      '&:first-child': {
        transform: 'scaleX(-1)',
      },
    },
    buttonColor: {
      color: process.env.APPBAR_COLOR || '#ddd',
    },
  }),
);

export const LoginPage: React.FC<EmptyObject> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const isAuthenticated = useSelector(getAuthStatus);
  const location = useLocation();
  const state = location.state as { fromPath?: string } | undefined;
  // prevent state update on unmounted component
  const isActiveRef = React.useRef(false);
  React.useEffect(function () {
    isActiveRef.current = true;
    return function () {
      isActiveRef.current = false;
    };
  }, []);
  const handleLoading = (isLoading: boolean) => {
    if (isActiveRef.current) {
      setLoading(isLoading);
    }
  };
  const handleReadOnly = () => {
    dispatch(
      doReadOnly(
        handleLoading,
        withoutPathPrefix(location.pathname),
        withoutPathPrefix(state?.fromPath || ''),
      ),
    );
  };
  if (isAuthenticated) {
    return <Typography>You are logged in already, redirecting...</Typography>;
  }
  return (
    <div className={classes.root}>
      <Paper className={classes.outerPaper}>
        <LamaIcon className={classes.lamaIcon} />
        <div className={classes.content}>
          <div className={classes.formLamas}>
            <LoginForm />
          </div>
          <Typography className={classes.or}>- OR -</Typography>
          <div className={classes.readPaper}>
            <div className={classes.formLamas}>
              <Button onClick={handleReadOnly} className={classes.buttonColor}>
                {loading ? (
                  <CircularProgress
                    style={{ color: process.env.APPBAR_COLOR }}
                    size={24}
                  />
                ) : (
                  'Continue Read-only'
                )}
              </Button>
            </div>
          </div>
        </div>
        <LamaIcon className={classes.lamaIcon} />
      </Paper>
    </div>
  );
};
