import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Checkbox,
  TableRow,
  Paper,
  Container,
  Typography,
  Card,
  Divider,
  TablePagination,
  IconButton,
  Popover,
  MenuItem
} from "@mui/material";
import {Transaction} from '../../model/model';
import {getTransection,Checktoken} from "../../services/apiservice"
import Scrollbar from "../../components/scrollbar/Scrollbar";
import { UserListHead,UserListToolbar } from '../../components/user';
import { Icon } from '@iconify/react';
import Iconify from "../../components/iconify/Iconify";

const TABLE_HEAD = [
  { id: 'Asset_name_assets', label: 'Assets', alignRight: false },
  { id: 'Match_mac_address', label: 'MacAddress', alignRight: false },
  { id: 'Transaction_status_transaction', label: 'StatusTransaction', alignRight: false },
  { id: 'Transaction_time_used', label: 'TimeUsed', alignRight: false },
  { id: 'Transaction_time_update', label: 'TimeUpdate', alignRight: false },
  { id: 'Transaction_on_date', label: 'On_Date', alignRight: false },
  { id: 'Transaction_off_date', label: 'Off_Date', alignRight: false },
  { id: '' },
];

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
    return filter(array, (_user:any) => _user.Asset_name_assets.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el:any) => el[0]);
}

const HomeTransection: React.FC = () => {
  
  const navigate = useNavigate();

  const [listassets, SetDataassetslist] = useState<Transaction[]>([]);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected]:any = useState([]);

  const [orderBy, setOrderBy] = useState('Asset_name_assets');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const formatTime = (milliseconds:number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  // const days = Math.floor(totalHours / 24);

  const seconds = totalSeconds % 60;
  const minutes = totalMinutes % 60;
  const hours = totalHours % 24;

  let time = '1s';
  // if (days > 0) {
  //   time = `${days}Day ${hours}Hours ${minutes}Minutes ${seconds} Seconds`;
  // } else 
  if (hours > 0) {
    time = `${totalHours} Hours ${minutes}Minutes ${seconds} Seconds`;
  } else if (minutes > 0) {
    time = `${minutes} Minutes ${seconds} Seconds`;
  } else if (seconds > 0) {
    time = `${seconds} Seconds`;
  }
  return time;
}

  const handleGetTransection=async(token:string)=>{
    SetDataassetslist(await getTransection(token));
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
      const newSelecteds:any = listassets.map((n:any) => n.Transaction_id_txn);
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
      handleGetTransection(user.token);
    }
    else{
      navigate('/login')
    }
  },[]);

  return (
    <>
      <Helmet>
            <title> Transaction | SmartSocket </title>
      </Helmet>
      <Container>
        <Typography variant="h4" sx={{ mb: 3,mt:2 }}>
          Transaction
        </Typography>
        <Divider sx={{borderBottomWidth: 3,mb:2,borderColor:"black",borderRadius:1}}/>
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
                    console.log(row)
                    const { Transaction_id_txn,Asset_name_assets, Match_mac_address, Transaction_status_transaction, Transaction_time_used, Transaction_time_update, Transaction_on_date,Transaction_off_date  }:any = row;
                    const selectedUser = selected.indexOf(Transaction_id_txn) !== -1;

                    return (
                      <TableRow hover key={Transaction_id_txn} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, Transaction_id_txn)} />
                        </TableCell>

                        <TableCell align="left">{Asset_name_assets}</TableCell>

                        <TableCell align="left">{Match_mac_address}</TableCell>

                        <TableCell align="left">{Transaction_status_transaction}</TableCell>

                        <TableCell align="left">{formatTime(Transaction_time_used)}</TableCell>
                        
                        <TableCell align="left">{new Date(Transaction_time_update).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>

                        <TableCell align="left">{Transaction_on_date}</TableCell>

                        <TableCell align="left">{Transaction_off_date}</TableCell>

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
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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
        {/* <Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Assets</TableCell>
                  <TableCell align="right">mac_address</TableCell>
                  <TableCell align="right">status_transaction&nbsp;</TableCell>
                  <TableCell align="right">time_used&nbsp;</TableCell>
                  <TableCell align="right">time_update&nbsp;</TableCell>
                  <TableCell align="right">on_date&nbsp;</TableCell>
                  <TableCell align="right">off_date&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listassets.map((row:any,i:any) => (
                  <TableRow
                    key={row.Asset_name_assets}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.Asset_name_assets}
                    </TableCell>
                    <TableCell align="right">{row.Match_mac_address}</TableCell>
                    <TableCell align="right">{row.Transaction_status_transaction}</TableCell>
                    <TableCell align="right">{formatTime(row.Transaction_time_used)}</TableCell>
                    <TableCell align="right">{new Date(row.Transaction_time_update).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>
                    <TableCell align="right">{row.Transaction_on_date}</TableCell>
                    <TableCell align="right">{row.Transaction_off_date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box> */}
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
export default HomeTransection;
