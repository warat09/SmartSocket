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
  Popover,
  TextField,
  Grid,
  Avatar
} from "@mui/material";
import Scrollbar from "../../components/scrollbar/Scrollbar";
import { UserListHead,UserListToolbar } from '../../components/user';
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import PageTitleWrapper from "../../components/PageTitleWrapper";
import formatDate from "../../components/caltime/caldate"

const TABLE_HEAD = [
  { id: 'Asset_name_assets', label: 'ชื่ออุปกรณ์', alignRight: false },
  { id: 'UserMatch_room', label: 'ห้อง', alignRight: false },
  { id: 'UserMatch_floor', label: 'ชั้น', alignRight: false },
  { id: 'UserMatch_description', label: 'คำอธิบาย', alignRight: false },
  { id: 'UserMatch_datetime', label: 'วันที่-เวลา', alignRight: false },
  { id: 'User_Name', label: 'ชื่อผู้ใช้', alignRight: false },
  { id: 'UserMatch_status_user_match', label: 'สถาณะ', alignRight: false },
  { id: 'User_action', label: '', alignRight: false }
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
    status_user_match:""
  });

  const [openAlert, setOpenAlert] = useState(false);

  const [messagealert, setMessagealert]:any = useState({message:"",color:""});

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

  const handleClickOpen = (id: number, status: number, asset: string,status_user_match:string) => {
    setOpenDialog(true);
    if (status == 1) {
      setdialog({
        header: "อนุมัติ",
        body: `คุณแน่ใจว่าจะอนุมัติอุปกรณ์ ${asset}?`,
        id: id,
        status: status,
        status_user_match:status_user_match
      });
    } else {
      setdialog({
        header: "ปฏิเศษ",
        body: `คุณแน่ใจว่าจะปฏิเศษอุปกรณ์ ${asset}`,
        id: id,
        status: status,
        status_user_match:status_user_match
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

  const Checkapprove = async (id: number, status: number,status_user_match:string) => {
    let status_Approve=""    
    if (status === 1) {
      status_Approve="Approve"
    } else {
      status_Approve="Reject"
    }
    await ApproveUserMatch(`/UserMatch/Approve/${id}`,token, {status_Approve,status_user_match})
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
      <PageTitleWrapper>
        <Avatar sx={{backgroundColor: 'rgba(255, 255, 255, 1)',marginRight:3,width: 70, height: 70,borderRadius: 2,boxShadow:6}}>
          <Iconify icon={"basil:user-clock-solid"} sx={{width: 40, height: 40,color:"rgb(85, 105, 255);"}}/>
        </Avatar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              อนุมัติ
            </Typography>
            <Typography variant="subtitle2">
              อนุมัติการใช้งานอุปกรณ์และการส่งคืนอุปกรณ์
            </Typography>
        </Grid>
      </Grid>
      </PageTitleWrapper>
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
                    let change_UserMatch_status_user_match
                    const { Asset_name_assets, UserMatch_room, UserMatch_floor, UserMatch_description, UserMatch_datetime, User_name, User_surname, UserMatch_status_user_match }:any = row;
                    const selectedUser = selected.indexOf(Asset_name_assets) !== -1;
                    if(UserMatch_status_user_match === "Wait for Approve"){
                      change_UserMatch_status_user_match = "รออนุมัติการยืม"
                    }
                    if(UserMatch_status_user_match === "Wait for Approve Return"){
                      change_UserMatch_status_user_match = "รออนุมัติการส่งคืน"
                    }

                    return (
                      <TableRow hover key={Asset_name_assets} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, Asset_name_assets)} />
                        </TableCell> */}

                        <TableCell align="center">{Asset_name_assets}</TableCell>

                        <TableCell align="center">{UserMatch_room}</TableCell>

                        <TableCell align="center">{UserMatch_floor}</TableCell>

                        <TableCell align="center">
                          {/* {UserMatch_description ? UserMatch_description : '-'} */}
                          <TextField
                              InputProps={{
                                readOnly: true,
                              }}
                              type="text"
                              multiline
                              rows={2}
                              defaultValue={UserMatch_description ? UserMatch_description : 'ไม่มีคำอธิบาย'}
                            />
                        </TableCell>

                        <TableCell align="center">{formatDate(UserMatch_datetime)}</TableCell>

                        <TableCell align="center">{User_name+" "+User_surname}</TableCell>

                        <TableCell align="center">{change_UserMatch_status_user_match}</TableCell>
                
                        <TableCell align="center">
                          <Box sx={{display:'flex',justifyContent:'center'}}>
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() =>
                              handleClickOpen(
                                row.UserMatch_id_user_match,
                                1,
                                Asset_name_assets,
                                UserMatch_status_user_match
                              )
                            }
                          >
                            อนุมัติ
                          </Button>
                          &nbsp;
                          {UserMatch_status_user_match === "Wait for Approve" &&
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() =>
                              handleClickOpen(
                                row.UserMatch_id_user_match,
                                0,
                                Asset_name_assets,
                                UserMatch_status_user_match
                              )
                            }
                          >
                            ปฎิเศษ
                          </Button>

                          }
                          
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
            <Button onClick={handleCloseDialog}>ยกเลิก</Button>
            <Button
              onClick={() => Checkapprove(dialog.id, dialog.status,dialog.status_user_match)}
              autoFocus
            >
              ยืนยัน
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
            severity={messagealert.color}
            sx={{ width: "100%" }}
          >
            {messagealert.message}!
          </Alert>
        </Snackbar>
    </>
  );
};
export default HomeApprove;
