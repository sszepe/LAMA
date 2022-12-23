/**
 * Indicator in EntityChip to display an Entities Analysis Categories.
 */
import React from 'react';
import { Tooltip, withStyles, Theme } from '@material-ui/core';
import DotIcon from '@material-ui/icons/FiberManualRecord';

interface Props {
  color: string;
  small?: boolean;
  style?: React.CSSProperties;
  title: string;
}

const StyledTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[4],
    fontSize: 11,
  },
}))(Tooltip);

export const CoreStarIcon: React.FC<Props> = ({
  color,
  small = false,
  style,
  title,
}) => {
  return (
    <StyledTooltip title={title}>
      <DotIcon
        style={{ color: color, ...style }}
        fontSize={small ? 'small' : 'medium'}
      />
    </StyledTooltip>
  );
};
