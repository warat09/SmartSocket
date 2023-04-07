import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { concat, filter, update } from 'lodash';
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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert
} from "@mui/material"
import {getNode, updateStatusNode} from '../../services/apiservice'
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

  const [openDialog, setOpenDialog] = useState(false);

  const [mac_address,setMac_address] = useState("");

  const [openAlert, setOpenAlert] = useState(false);

  const [messagealert, setMessagealert]:any = useState({message:"",color:""});

  const [dialog, setdialog] = React.useState({
    header: "",
    body: "",
    id: 0,
    status: 0,
  });

  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const handleGetNode= async() => {
    SetlistNode(await getNode("/Node/AllMACAddress"))
  }

  const handleOpenMenu = (event:any,mac_address:string) => {
    setMac_address(mac_address)
    setOpenDialog(true)
      setdialog({
        header: "Disable",
        body: `Are you sure want to disable ${mac_address}?`,
        id: 0,
        status: 0,
      });
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

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const Agree = async() => {
    await updateStatusNode(`/Node/AllMACAddress/${mac_address}`)
  }

  useEffect(() => {
    const item = localStorage.getItem("User");
    if(window.history.state !== null){
      const {open,message} = window.history.state;
      if(open === 1) {
        setMessagealert({message:message,color:"success"})
        setOpenAlert(true);
        window.history.replaceState({}, "", "");
      }
    }
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
        <Typography variant="h4" sx={{ mb: 5,mt:2 }}>
          Socket List
        </Typography>
        <Divider sx={{borderBottomWidth: 3,mb:3,borderColor:"black",borderRadius:1}}/>
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
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, mac_address)} />
                        </TableCell> */}

                        <TableCell align="center">{mac_address}</TableCell>

                        <TableCell align="center">{ip}</TableCell>
                        
                        <TableCell align="center">{new Date(date_node).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>

                        <TableCell align="center">{status_node}</TableCell>

                        <TableCell align="center">
                          <IconButton size="large" color="inherit" onClick={(event)=>handleOpenMenu(event,mac_address)}>
                            <Iconify icon={"fe:disabled"}/>
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
      <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "500px",  // Set your width here
              },
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">{dialog.header}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {dialog.body}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Disagree</Button>
            <Button
              onClick={Agree}
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={openAlert}
          autoHideDuration={3000}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleCloseAlert}
            variant="filled"
            severity={messagealert.color}
            sx={{ width: "100%" }}
          >
            {messagealert.message}!
          </Alert>
        </Snackbar>
    </>
  );
};
export default HomeNode
