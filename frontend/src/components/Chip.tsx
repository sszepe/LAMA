/**
 * Chip to display entity in short form
 * Information for initials and color per type is also stored here
 */
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import {
  Avatar,
  Chip,
  ChipProps,
  CircularProgress,
  Tooltip,
  Typography,
  createStyles,
  withStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';
import {
  amber,
  blue,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  purple,
  red,
  teal,
} from '@material-ui/core/colors';

import { AdditionalTagMarkers } from './AdditionalTagMarkers';

import { doShowEntity } from '../actionCreators/sidePanel';

import { getTypeLabel } from '../constants/entityTypes';

import { withLoadingEntity } from './withLoadingEntity';

import { Entity, EntityType } from '../types/entities';

const DEFAULT_COLOR = grey[500]; // grey
const DEFAULT_COLOR_CONTRAST = '#000';

const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[4],
    fontSize: 12,
  },
}))(Tooltip);

const CHIP_INFO: Record<
  EntityType,
  { initials: string; color: string; contrastColor: string }
> = {
  Person: {
    initials: 'P',
    color: indigo[500],
    contrastColor: '#fff',
  },
  FictionalCharacter: {
    initials: 'FC',
    color: indigo[500],
    contrastColor: '#fff',
  },
  Group: {
    initials: 'G',
    color: indigo[400],
    contrastColor: '#fff',
  },
  CollectiveIdentity: {
    initials: 'CI',
    color: indigo[400],
    contrastColor: '#fff',
  },
  Movement: {
    initials: 'MO',
    color: indigo[400],
    contrastColor: '#fff',
  },
  Organization: {
    initials: 'O',
    color: indigo[300],
    contrastColor: '#fff',
  },
  Broadcaster: {
    initials: 'BR',
    color: indigo[300],
    contrastColor: '#fff',
  },
  Platform: {
    initials: 'PF',
    color: indigo[300],
    contrastColor: '#fff',
  },
  Station: {
    initials: 'ST',
    color: indigo[200],
    contrastColor: '#000',
  },

  Collection: {
    initials: 'CO',
    color: blue[500],
    contrastColor: '#fff',
  },
  BroadcastSeries: {
    initials: 'BS',
    color: blue[600],
    contrastColor: '#fff',
  },

  VClipType: {
    initials: 'CT',
    color: lightBlue[400],
    contrastColor: '#000',
  },

  Event: {
    initials: 'EV',
    color: lime[700],
    contrastColor: '#000',
  },
  EventSeries: {
    initials: 'ES',
    color: lime[600],
    contrastColor: '#000',
  },
  VEventType: {
    initials: 'ET',
    color: lime[500],
    contrastColor: '#000',
  },
  TimePeriod: {
    initials: 'TP',
    color: lime[800],
    contrastColor: '#000',
  },

  AnySound: {
    initials: 'AS',
    color: amber[500],
    contrastColor: '#000',
  },
  PieceOfMusic: {
    initials: 'PM',
    color: orange[500],
    contrastColor: '#fff',
  },

  CreativeWork: {
    initials: 'CW',
    color: orange[400],
    contrastColor: '#000',
  },
  Thing: {
    initials: 'TH',
    color: green[500],
    contrastColor: '#000',
  },
  VInstrument: {
    initials: 'IN',
    color: green[600],
    contrastColor: '#fff',
  },

  Place: {
    initials: 'PL',
    color: lightGreen[400],
    contrastColor: '#000',
  },
  Location: {
    initials: 'L',
    color: lightGreen[700],
    contrastColor: '#fff',
  },

  Repertoire: {
    initials: 'R',
    color: teal[800],
    contrastColor: '#fff',
  },
  Genre: {
    initials: 'GN',
    color: teal[600],
    contrastColor: '#fff',
  },
  VLanguage: {
    initials: 'LG',
    color: teal[100],
    contrastColor: '#000',
  },
  VSpeechGenre: {
    initials: 'SG',
    color: teal[300],
    contrastColor: '#000',
  },

  Topic: {
    initials: 'T',
    color: purple[500],
    contrastColor: '#fff',
  },

  Topos: {
    initials: 'TO',
    color: deepPurple[500],
    contrastColor: '#fff',
  },
  LieuDeMemoire: {
    initials: 'LM',
    color: deepPurple[400],
    contrastColor: '#fff',
  },

  VFunctionInClipRole: {
    initials: 'FR',
    color: cyan[300],
    contrastColor: '#000',
  },
  VClipContributorRole: {
    initials: 'CR',
    color: cyan[400],
    contrastColor: '#000',
  },
  VMusicPerformanceRole: {
    initials: 'PR',
    color: cyan[500],
    contrastColor: '#000',
  },

  VAdjective: {
    initials: 'AD',
    color: deepOrange[300],
    contrastColor: '#000',
  },
  VActivity: {
    initials: 'AC',
    color: deepOrange[400],
    contrastColor: '#fff',
  },

  Shot: {
    initials: 'CS',
    color: purple[100],
    contrastColor: '#000',
  },
  ProductionTechniquePicture: {
    initials: 'PP',
    color: purple[100],
    contrastColor: '#000',
  },
  ProductionTechniqueSound: {
    initials: 'PS',
    color: purple[100],
    contrastColor: '#000',
  },
  VMusicArts: {
    initials: 'MA',
    color: deepOrange[300],
    contrastColor: '#000',
  },
};

const useStyles = makeStyles(_theme =>
  createStyles({
    root: {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      maxWidth: '100%',
    },
    chipLabel: {
      fontSize: '0.8rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    fullLabel: {
      fontSize: '0.8rem',
    },
  }),
);

interface Props extends ChipProps {
  entity?: Entity;
  loading?: boolean;
}

const getAvatar = (entityType: keyof typeof CHIP_INFO) => {
  const chipInfo = CHIP_INFO[entityType];
  let chipInitials, backgroundColor, contrastColor;
  if (chipInfo === undefined) {
    chipInitials = '?';
    backgroundColor = red[800];
    contrastColor = '#fff';
  } else {
    const chipColor = CHIP_INFO[entityType].color;
    chipInitials = CHIP_INFO[entityType].initials;
    contrastColor = CHIP_INFO[entityType].contrastColor;
    backgroundColor = chipColor !== undefined ? chipColor : DEFAULT_COLOR;
    contrastColor =
      contrastColor !== undefined ? contrastColor : DEFAULT_COLOR_CONTRAST;
  }
  return (
    <LightTooltip title={getTypeLabel(entityType)}>
      <Avatar
        style={{
          backgroundColor,
          color: contrastColor,
        }}
      >
        {chipInitials}
      </Avatar>
    </LightTooltip>
  );
};

const CustomChip: FC<Props> = ({ entity, loading = false, ...props }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const isLoading = loading || entity === undefined;
  const label = !isLoading ? (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      <LightTooltip
        title={
          <Typography className={classes.fullLabel}>{entity!.label}</Typography>
        }
      >
        <Typography component="span" className={classes.chipLabel}>
          {entity!.label}
        </Typography>
      </LightTooltip>
      <AdditionalTagMarkers
        small
        selectedTags={entity!.analysisCategories || []}
      />
    </span>
  ) : (
    ''
  );
  return (
    <Chip
      avatar={!isLoading ? getAvatar(entity!.type) : undefined}
      className={classes.root}
      clickable
      label={!isLoading ? label : <CircularProgress size={'0.7rem'} />}
      onClick={
        !isLoading
          ? () => {
              dispatch(doShowEntity(entity!._id));
            }
          : () => {} // eslint-disable-line @typescript-eslint/no-empty-function
      }
      size="small"
      variant="outlined"
      {...props}
    />
  );
};

const WrappedChip = withLoadingEntity(CustomChip);
export { WrappedChip as Chip };
