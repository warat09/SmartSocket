import React, { useEffect, useState, useRef } from "react";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useNavigate } from "react-router-dom";
import { Matching } from "../../model/model";
import { getMatching } from "../../services/apiservice";
import Iconify from "../../components/iconify/Iconify";
import {
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
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
  { id: 'Asset_name_assets', label: 'Assets', alignRight: false },
  { id: 'Match_mac_address', label: 'MacAddress', alignRight: false },
  { id: 'Match_room', label: 'Room', alignRight: false },
  { id: 'Match_floor', label: 'Floor', alignRight: false },
  { id: 'Match_remain_time', label: 'RemainTime', alignRight: false },
  { id: 'Match_active_datetime', label: 'Date', alignRight: false },
  { id: 'Match_status_match', label: 'Status', alignRight: false },
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

const HomeMatch: React.FC = () => {
  
  const navigate = useNavigate();

  const [listmatching, setlistmatching] = useState<Matching[]>([]);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected]:any = useState([]);

  const [orderBy, setOrderBy] = useState('Asset_name_assets');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

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
      const newSelecteds:any = listmatching.map((n:any) => n.Asset_name_assets);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listmatching.length) : 0;

  const filteredUsers = applySortFilter(listmatching, getComparator(order, orderBy), filterName);
  
  const isNotFound = !filteredUsers.length && !!filterName;

  const ComponentMatch= async (token:string) => {
    setlistmatching(await getMatching("/Match/AllMatching",token));
  }

  const formatTime = (milliseconds:number) => {

    const totalSeconds = Math.floor(milliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    // const days = Math.floor(totalHours / 24);
  
    const seconds = totalSeconds % 60;
    const minutes = totalMinutes % 60;
    const hours = totalHours % 24;
  
    let time = 'Not use';
    // if (days > 0) {
    //   time = `${days}Day ${hours}Hours ${minutes}Minutes ${seconds} Seconds`;
    // } else 
    console.log(hours,minutes,seconds)
    if (hours > 0) {
      if(seconds === 0){
        time = `${totalHours} Hours ${minutes} Minutes`;
      }
      if(minutes === 0 && seconds === 0){
        time = `${totalHours} Hours`;
      }
      else{
        time = `${totalHours} Hours ${minutes} Minutes ${seconds} Seconds`;
      }
    } else if (minutes > 0) {
      if(seconds === 0){
        time = `${minutes} Minutes`;
      }
      else{
        time = `${minutes} Minutes ${seconds} Seconds`;
      }
    } else if (seconds > 0) {
      time = `${seconds} Seconds`;
    }
    return time;
  }

  useEffect(() => {
    const item = localStorage.getItem("User");
      if (item && item !== "undefined") {
          const user = JSON.parse(item);
          ComponentMatch(user.token);
      }
      else{
        navigate('/login')
      }
  }, []);

  return (
    <>
      <Helmet>
          <title> Matching: List | SmartSocket </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5,mt:2 }}>
          <Typography variant="h4" gutterBottom>
            Match List
          </Typography>
          <Button variant="contained" startIcon={<Box component={Icon} icon={"eva:plus-fill"}/>} onClick={() => navigate('/app/admin/match/new')}>
            New Matching
          </Button>
        </Stack>
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
                  rowCount={listmatching.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row:any) => {
                    console.log(row)
                    const { Asset_name_assets, Match_mac_address, Match_status_match, Match_remain_time, Match_active_datetime, Match_room,Match_floor  }:any = row;
                    const selectedUser = selected.indexOf(Asset_name_assets) !== -1;

                    return (
                      <TableRow hover key={Asset_name_assets} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, Asset_name_assets)} />
                        </TableCell>

                        <TableCell align="left">{Asset_name_assets}</TableCell>

                        <TableCell align="left">{Match_mac_address}</TableCell>

                        <TableCell align="left">{Match_room}</TableCell>
                        
                        <TableCell align="left">{Match_floor}</TableCell>

                        <TableCell align="left">{formatTime(Match_remain_time)}</TableCell>

                        <TableCell align="left">{new Date(Match_active_datetime).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>

                        <TableCell align="left">{Match_status_match}</TableCell>

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
                      <TableCell align="center" colSpan={9} sx={{ py: 3 }}>
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
            count={listmatching.length}
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
export default HomeMatch;
