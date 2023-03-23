import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Approve } from "../../model/model";
import Iconify from "../../components/iconify/Iconify";
import {
  getApprove,
  ApproveUserMatch,
} from "../../services/apiservice";
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Container,
  Divider,
  Card,
  TablePagination,
  Checkbox,
  IconButton,
  //dialog
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,Snackbar,
  Popover
} from "@mui/material";
import Scrollbar from "../../components/scrollbar/Scrollbar";
import { UserListHead,UserListToolbar } from '../../components/user';
import { Icon } from '@iconify/react';

import MuiAlert, { AlertProps } from "@mui/material/Alert";

const TABLE_HEAD = [
  { id: 'Asset_name_assets', label: 'Assets', alignRight: false },
  { id: 'UserMatch_room', label: 'Room', alignRight: false },
  { id: 'UserMatch_floor', label: 'Floor', alignRight: false },
  { id: 'UserMatch_description', label: 'Description', alignRight: false },
  { id: 'UserMatch_datetime', label: 'DateTime', alignRight: false },
  { id: 'User_Name', label: 'Name', alignRight: false },
  { id: 'UserMatch_status_user_match', label: 'Status', alignRight: false },
  { id: 'User_action', label: 'Action', alignRight: false }
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
    return filter(array, (_user:any) => _user.Asset_name_assets.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el:any) => el[0]);
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const HomeApprove: React.FC = () => {
  
  const navigate = useNavigate();

  const [listapprove, setlistapprove] = useState<Approve[]>([]);

  const [openDialog, setOpenDialog] = React.useState(false);

  const [dialog, setdialog] = React.useState({
    header: "",
    body: "",
    id: 0,
    status: 0,
  });

  const [openAlert, setOpenAlert] = useState(false);

  const [token, SetToken] = useState("");
  
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected]:any = useState([]);

  const [orderBy, setOrderBy] = useState('Asset_name_assets');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const ComponentMatch = async (token: string) => {
    setlistapprove(await getApprove("/UserMatch/GetApprove",token));
  };

  const handleClickOpen = (id: number, status: number, asset: string) => {
    setOpenDialog(true);
    if (status == 1) {
      setdialog({
        header: "Approve?",
        body: `Do you want approve asset ${asset}`,
        id: id,
        status: status,
      });
    } else {
      setdialog({
        header: "Reject?",
        body: `Do you want reject asset ${asset}`,
        id: id,
        status: status,
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClickDialog = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const Checkapprove = async (id: number, status: number) => {
    console.log(id, status);
    let status_Approve=""
    
    if (status === 1) {
      console.log("1")
      handleCloseDialog();
      handleClickDialog()
      // handleClickOpen(status,asset)

      // console.log(listapprove);
      // console.log("approve");
      status_Approve="Approve"
     
    } else {
      // handleClickOpen(status,asset)
      console.log("2")
      handleCloseDialog();
      handleClickDialog()
      status_Approve="Reject"
      // console.log("reject");
    }
    await ApproveUserMatch(`/UserMatch/Approve/${id}`,token, status_Approve)
  };

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
      const newSelecteds:any = listapprove.map((n:any) => n.Asset_name_assets);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listapprove.length) : 0;

  const filteredUsers = applySortFilter(listapprove, getComparator(order, orderBy), filterName);
  
  const isNotFound = !filteredUsers.length && !!filterName;

  useEffect(() => {
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      ComponentMatch(user.token);
      SetToken(user.token)
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <Helmet>
          <title> Approve | SmartSocket </title>
      </Helmet>
      <Container>
        <Typography variant="h4" sx={{ mb: 3,mt:2 }}>
          Approve
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
                  rowCount={listapprove.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row:any) => {
                    console.log(row)
                    
                    const { Asset_name_assets, UserMatch_room, UserMatch_floor, UserMatch_description, UserMatch_datetime, User_name, User_surname, User_username, UserMatch_status_user_match }:any = row;
                    const selectedUser = selected.indexOf(Asset_name_assets) !== -1;

                    return (
                      <TableRow hover key={Asset_name_assets} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, Asset_name_assets)} />
                        </TableCell>

                        <TableCell align="left">{Asset_name_assets}</TableCell>

                        <TableCell align="left">{UserMatch_room}</TableCell>

                        <TableCell align="left">{UserMatch_floor}</TableCell>

                        <TableCell align="center">{UserMatch_description ? UserMatch_description : '-'}</TableCell>

                        <TableCell align="left">{new Date(UserMatch_datetime).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>

                        <TableCell align="left">{User_name+" "+User_surname}</TableCell>

                        <TableCell align="left">{UserMatch_status_user_match}</TableCell>
                
                        <TableCell align="left">
                          <Box sx={{display:'flex'}}>
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() =>
                              handleClickOpen(
                                row.UserMatch_id_user_match,
                                1,
                                row.Asset_name_assets
                              )
                            }
                          >
                            Approve
                          </Button>
                          &nbsp;
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() =>
                              handleClickOpen(
                                row.UserMatch_id_user_match,
                                0,
                                row.Asset_name_assets
                              )
                            }
                          >
                            Reject
                          </Button>
                          </Box>
                         </TableCell>

                        {/* <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell> */}
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
            count={listapprove.length}
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

      <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
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
              onClick={() => Checkapprove(dialog.id, dialog.status)}
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={openAlert}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="success"
            sx={{ width: "100%" }}
          >
            This is a success message!
          </Alert>
        </Snackbar>
    </>
  );
};
export default HomeApprove;
