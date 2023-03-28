import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useNavigate } from "react-router-dom";
import {Node} from '../../model/model'
import {Table,TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  Typography,
  Container,
  Divider,
  Checkbox,
  Card,
  IconButton,
  Popover,
  MenuItem
} from "@mui/material"
import {getNode} from '../../services/apiservice'
import Scrollbar from "../../components/scrollbar/Scrollbar";
import { UserListHead,UserListToolbar } from '../../components/user';
import Iconify from "../../components/iconify/Iconify";

const TABLE_HEAD = [
  { id: 'mac_address', label: 'M.A.C Addreess', alignRight: false },
  { id: 'ip', label: 'i.p.', alignRight: false },
  { id: 'date_node', label: 'Date', alignRight: false },
  { id: 'status_node', label: 'status_node', alignRight: false },
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
    return filter(array, (_user:any) => _user.mac_address.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el:any) => el[0]);
}

const HomeNode: React.FC = () => {

  const navigate = useNavigate();

  const [listnode, SetlistNode] = useState<Node[]>([]);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected]:any = useState([]);

  const [orderBy, setOrderBy] = useState('mac_address');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleGetNode= async() => {
    SetlistNode(await getNode("/Node/AllMACAddress"))
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
      const newSelecteds:any = listnode.map((n:any) => n.mac_address);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listnode.length) : 0;

  const filteredUsers = applySortFilter(listnode, getComparator(order, orderBy), filterName);
  
  const isNotFound = !filteredUsers.length && !!filterName;

  useEffect(() => {
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      handleGetNode();
    }
    else{
      navigate('/login')
    }
  }, []);

  return (
    <>
      <Helmet>
            <title> Node | SmartSocket </title>
      </Helmet>
      <Container>
        <Typography variant="h4" sx={{ mb: 3,mt:2 }}>
          Socket List
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
                  rowCount={listnode.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row:any) => {
                    console.log(row)
                    const { mac_address,ip, date_node, status_node }:any = row;
                    const selectedUser = selected.indexOf(mac_address) !== -1;

                    return (
                      <TableRow hover key={mac_address} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, mac_address)} />
                        </TableCell>

                        <TableCell align="center">{mac_address}</TableCell>

                        <TableCell align="center">{ip}</TableCell>
                        
                        <TableCell align="center">{new Date(date_node).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>

                        <TableCell align="center">{status_node}</TableCell>

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
            count={listnode.length}
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
export default HomeNode

