/**
 * Display list of Entities
 */
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  GridColDef,
  GridValueGetterParams,
  GridValueFormatterParams,
  GridSortModel,
} from '@material-ui/data-grid';
import {
  IconButton,
  Input,
  MenuItem,
  Paper,
  Select,
  Theme,
  Tooltip,
  Typography,
  useTheme,
  withStyles,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import {
  CustomDataGrid as DataGrid,
  makeHandlePageChange,
  makeHandlePageSizeChange,
  makeHandleSortModelChange,
} from './CustomDataGrid';

import { doAddEntities } from '../actionCreators/entities';
import { doFetchError } from '../actionCreators/app';

import { allEntityTypes, getTypeLabel } from '../constants/entityTypes';

import { AdditionalTagCheckboxes } from './AdditionalTagCheckboxes';
import { AdditionalTagMarkers } from './AdditionalTagMarkers';
import { Chip } from './Chip';
import { PopoverButton } from './PopoverButton';
import { SearchBoxDebounced as SearchBox } from './SearchBox';

import { getEntities } from '../services/api';

import { formatIsoDate } from '../util';

import { getFromLocalStorageMaybe } from '../services/localStorage';

import { EmptyObject } from '../types';
import { EntityType } from '../types/entities';

const L_PAGE_SIZE = 'lama.EntityList.pageSize';
const L_SORT_MODEL = 'lama.EntityList.sortModel';

const StyledTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[4],
    fontSize: 13,
    maxWidth: theme.spacing(65),
  },
}))(Tooltip);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const columns: GridColDef[] = [
  {
    field: 'label',
    headerName: 'Label',
    disableColumnMenu: true,
    flex: 0.4,
    renderCell: function RenderPlatform(params: GridValueFormatterParams) {
      return <Chip entityId={params.row.id ? (params.row.id as string) : ''} />;
    },
  },
  {
    field: 'type',
    headerName: 'Type',
    disableColumnMenu: true,
    flex: 0.2,
    sortComparator: (v1, v2) =>
      getTypeLabel(v1 as EntityType).localeCompare(
        getTypeLabel(v2 as EntityType),
      ),
    valueFormatter: (params: GridValueGetterParams) =>
      `${getTypeLabel(params.value as EntityType)}`,
  },
  {
    field: 'description',
    headerName: 'Description',
    disableColumnMenu: true,
    flex: 0.6,
    renderCell: function RenderPlatform(params: GridValueFormatterParams) {
      const l = params.value as string;
      return (
        <StyledTooltip placement="bottom-start" title={l}>
          <Typography style={{ fontSize: 14 }}>{l}</Typography>
        </StyledTooltip>
      );
    },
  },
  {
    field: 'createdBy',
    headerName: 'User',
    disableColumnMenu: true,
    flex: 0.14,
    valueFormatter: (params: GridValueGetterParams) =>
      `${params.value ? (params.value as string) : 'empty'}`,
  },
  {
    field: 'updated',
    headerName: 'Updated on',
    disableColumnMenu: true,
    flex: 0.2,
    valueFormatter: (params: GridValueGetterParams) =>
      `${params.value ? formatIsoDate(params.value as string) : 'empty'}`,
  },
  {
    field: 'usageCount',
    headerName: '#',
    flex: 0.15,
    disableColumnMenu: true,
    description: 'Usage count',
    headerAlign: 'center',
    align: 'center',
  },
];

const allowedSortFields = [
  'label',
  'type',
  'createdBy',
  'updated',
  'usageCount',
];

interface EntityListRow {
  id: string;
  label: string;
  type: EntityType;
  description: string;
  createdBy: string;
  updated: string;
  usageCount: number;
}

export const EntitiesList: FC<EmptyObject> = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<EntityListRow[]>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>(
    getFromLocalStorageMaybe<GridSortModel>(L_SORT_MODEL)?.filter(
      (sortItem: { field: string }) =>
        allowedSortFields.includes(sortItem.field),
    ) || [{ field: 'updated', sort: 'desc' }],
  );
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState<number>(
    getFromLocalStorageMaybe(L_PAGE_SIZE) || 16,
  );
  const [pageBeforeAfter, setPageBeforeAfter] = useState<
    [string | undefined, string | undefined]
  >([undefined, undefined]);
  const [firstLastIndex, setFirstLastIndex] = useState([-1, -1]);
  const [page, setPage] = useState(0);

  const [searchText, setSearchText] = useState('');
  const [catFilters, setCatFilters] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<EntityType[]>([]);

  React.useEffect(() => {
    let active = true;
    const [pageBefore, pageAfter] = pageBeforeAfter;
    (async () => {
      try {
        setLoading(true);
        const data = await getEntities({
          match: searchText,
          type: selectedTypes.length > 0 ? selectedTypes : undefined,
          cats: catFilters.length > 0 ? catFilters : undefined,
          pageSize,
          pageAfter,
          pageBefore,
          sortBy: sortModel.length > 0 ? sortModel : undefined,
        });
        const { entities } = data;
        dispatch(doAddEntities(entities));
        if (!active) {
          return;
        }
        const newRows: EntityListRow[] = entities.map(
          ({
            _id,
            label,
            type,
            description,
            createdBy,
            updated,
            created,
            usageCount,
          }) => ({
            id: _id,
            label,
            type,
            description,
            createdBy,
            updated: updated || created,
            usageCount: usageCount || 0,
          }),
        );
        setTotalCount(data.totalCount);
        setFirstLastIndex([data.firstIndex, data.lastIndex]);
        setPage(data.page);
        setRows(newRows);
        setLoading(false);
      } catch (e) {
        dispatch(doFetchError(e));
      }
    })();
    return () => {
      active = false;
    };
  }, [
    dispatch,
    pageBeforeAfter,
    pageSize,
    searchText,
    selectedTypes,
    sortModel,
    catFilters,
  ]);

  const handleFilterTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setSelectedTypes(event.target.value as EntityType[]);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleSortModelChange = makeHandleSortModelChange(
    setSortModel,
    allowedSortFields,
    L_SORT_MODEL,
  );
  const handlePageSizeChange = makeHandlePageSizeChange(
    setPageSize,
    L_PAGE_SIZE,
  );
  const handlePageChange = makeHandlePageChange(
    rows,
    setPage,
    setPageBeforeAfter,
  );

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 4,
        }}
      >
        <Paper
          elevation={2}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            paddingLeft: '12px',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <PopoverButton icon={<CheckIcon />} label="A.C.">
              <AdditionalTagCheckboxes
                onChange={newValue => {
                  setCatFilters(newValue);
                }}
                value={catFilters}
              />
            </PopoverButton>
            <AdditionalTagMarkers selectedTags={catFilters} />
          </span>
        </Paper>
        <Paper
          style={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'row',
            marginLeft: 16,
            marginRight: 16,
          }}
        >
          <Select
            fullWidth
            style={{
              maxWidth: '100%',
            }}
            multiple
            value={selectedTypes}
            onChange={handleFilterTypeChange}
            input={<Input />}
            displayEmpty
            renderValue={_selected => (
              <span
                style={{
                  padding: '4px',
                  paddingLeft: '8px',
                }}
              >
                {selectedTypes.length === 0
                  ? 'Filter by type...'
                  : selectedTypes.map(getTypeLabel).join(', ')}
              </span>
            )}
            MenuProps={MenuProps}
          >
            {allEntityTypes.map(et => (
              <MenuItem
                key={et}
                value={et}
                style={{
                  fontWeight: selectedTypes.includes(et)
                    ? theme.typography.fontWeightBold
                    : theme.typography.fontWeightRegular,
                }}
              >
                {getTypeLabel(et)}
              </MenuItem>
            ))}
          </Select>
          <IconButton
            onClick={() => {
              setSelectedTypes([]);
            }}
            style={{ padding: '8px' }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </Paper>
        <SearchBox
          placeholder="Label or description contains..."
          onChange={handleSearchChange}
          value={searchText}
        />
      </div>
      <DataGrid
        columns={columns}
        disableColumnFilter
        loading={loading}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePageSizeChange}
        onSortModelChange={handleSortModelChange}
        page={page}
        pageSize={pageSize}
        rowCount={totalCount}
        rowIndexFirst={firstLastIndex[0]}
        rowIndexLast={firstLastIndex[1]}
        rows={rows}
      />
    </>
  );
};
