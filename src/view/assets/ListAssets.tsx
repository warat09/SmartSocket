import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useNavigate } from "react-router-dom";
import {Assets} from '../../model/model'
import {getAssets} from "../../services/apiservice"
import Iconify from "../../components/iconify/Iconify";
import {
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Divider,
  TableContainer,
  Card,
  TablePagination,
  Checkbox,
  Popover,
  MenuItem,
  IconButton,
  Box,
  Stack
} from "@mui/material";
import Scrollbar from "../../components/scrollbar/Scrollbar";
import { UserListHead,UserListToolbar } from '../../components/user';
import { Icon } from '@iconify/react';

const TABLE_HEAD = [
  { id: 'name_assets', label: 'Assets', alignRight: false },
  { id: 'expire_hour', label: 'Expired', alignRight: false },
  { id: 'date_assets', label: 'Date', alignRight: false },
  { id: 'status_assets', label: 'Status', alignRight: false },
  { id: 'maintenance', label: 'Maintenance', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a:any, b:any, orderBy:any) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order:any, orderBy:any) {
  return order === 'desc'
    ? (a:any, b:any) => descendingComparator(a, b, orderBy)
    : (a:any, b:any) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array:any, comparator:any, query:any) {
  const stabilizedThis = array.map((el:any, index:any) => [el, index]);
  stabilizedThis.sort((a:any, b:any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user:any) => _user.name_assets.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el:any) => el[0]);
}

const HomeAsset: React.FC = () => {
  
  const navigate = useNavigate();

  const [listassets, SetDataassetslist] = useState<Assets[]>([]);

  const [token, settoken] = useState("");

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected]:any = useState([]);

  const [orderBy, setOrderBy] = useState('name_assets');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleGetassets=async(token:string)=>{
    SetDataassetslist(await getAssets("/Asset/AllAsset",token))
  }

  const handleOpenMenu = (event:any) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event:any, property:any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event:any) => {
    if (event.target.checked) {
      const newSelecteds:any = listassets.map((n:any) => n.name_assets);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event:any, name:any) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected:any = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event:any, newPage:any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event:any) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event:any) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listassets.length) : 0;

  const filteredUsers = applySortFilter(listassets, getComparator(order, orderBy), filterName);
  
  const isNotFound = !filteredUsers.length && !!filterName;

  useEffect(() => {
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      handleGetassets(user.token);
    }
    else{
      navigate('/login')
    }
  },[]);
  return (
    <>
      <Helmet>
          <title> Asset: List | SmartSocket </title>
      </Helmet>
      <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5,mt:2 }}>
          <Typography variant="h4" gutterBottom>
            Asset List
          </Typography>
          <Button variant="contained" startIcon={<Box component={Icon} icon={"eva:plus-fill"}/>} onClick={() => navigate('/app/admin/asset/new')}>
            New Asset
          </Button>
      </Stack>
        <hr />
        <br/>
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={listassets.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row:any) => {
                    const { id_assets, name_assets, expire_hour, date_assets, status_assets, maintenance }:any = row;
                    const selectedUser = selected.indexOf(name_assets) !== -1;

                    return (
                      <TableRow hover key={id_assets} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name_assets)} />
                        </TableCell>

                        <TableCell align="center">{name_assets}</TableCell>

                        <TableCell align="center">{expire_hour} Hour</TableCell>

                        <TableCell align="center">{new Date(date_assets).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>

                        <TableCell align="center">{status_assets}</TableCell>

                        <TableCell align="center">{maintenance ? 'ควรส่งซ่อม' : 'ยังไม่ซ่อม'}</TableCell>

                        {/* <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={"eva:more-vertical-fill"}/>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={listassets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={"eva:edit-fill"} sx={{ mr: 2 }}/>
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }}/>
          Delete
        </MenuItem>
      </Popover>
      
    </>
  );
};
export default HomeAsset;
