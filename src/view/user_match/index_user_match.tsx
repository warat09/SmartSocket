import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useNavigate } from "react-router-dom";
import {Assets, MatchRentSelection, RfidAssets, UserMatch} from '../../model/model'
import {ApproveUserMatch, addUserMatching, getAssets, getRentMatch, getRequestRent, getRfidAssets, returnAsset, updateUsermatch} from "../../services/apiservice"
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
  Stack,
  DialogTitle,
  DialogContent,
  CardContent,
  Grid,
  Dialog,
  CardActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Snackbar,
  Alert,
  DialogContentText,
  DialogActions,
  Avatar
} from "@mui/material";
import Scrollbar from "../../components/scrollbar/Scrollbar";
import { UserListHead,UserListToolbar } from '../../components/user';
import { Icon } from '@iconify/react';
import { Controller, useForm } from "react-hook-form";
import formatTime from "../../components/caltime/millisectohms"
import formatDate from "../../components/caltime/caldate"
import PageTitleWrapper from "../../components/PageTitleWrapper";

const TABLE_HEAD = [
  { id: 'Asset_name_assets', label: 'ชื่ออุปกรณ์', alignRight: false },
  { id: 'UserMatch_room', label: 'ห้อง', alignRight: false },
  { id: 'UserMatch_floor', label: 'ชั้น', alignRight: false },
  { id: 'UserMatch_description', label: 'คำอธิบาย', alignRight: false },
  { id: 'Match_sum_used_time', label: 'เวลาที่ใช้อุปกรณ์', alignRight: false },
  { id: 'UserMatch_datetime', label: 'วันที่-เวลา', alignRight: false },
  { id: 'UserMatch_status_user_match', label: 'สถาณะ', alignRight: false },
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
    return filter(array, (_user:any) => _user.Asset_name_assets.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el:any) => el[0]);
}

const CreateUserMatch: React.FC = () => {
  
  const navigate = useNavigate();

  // const [listassets, SetDataassetslist] = useState<Assets[]>([]);

  const [listassets, setlistassets] = useState<MatchRentSelection[]>([]);

  const [listusermatch, setlistusermatch] = useState<UserMatch[]>([]);

  const [token, setToken] = useState("");

  const [UserMatchReturn,setReturn] = useState({});

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected]:any = useState([]);

  const [orderBy, setOrderBy] = useState('Asset_name_assets');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openNewDialog, setOpenNewDialog] = useState(false);

  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [Usermatch,setUsermatch]:any = useState({})

  const [openAlert, setOpenAlert] = useState(false);

  const [messagealert, setMessagealert]:any = useState({message:"",color:""});

  const [openDialog, setOpenDialog] = useState(false);

  const [dialog, setdialog] = React.useState({
    header: "",
    body: "",
    id: 0,
    status: 0,
  });

  const { control, handleSubmit, watch, reset } = useForm({
    reValidateMode: "onBlur"
  });

  const myHelper:any = {
    asset:{
      required: "Name Assets is Required"
    },
    rfid:{
      required: "Please Select Rfid Address"
    },
    expiration:{
      required: "Expiration time is Required"
    }
  };

  // const handleGetassets=async(token:string)=>{
  //   SetDataassetslist(await getAssets("/Asset/AllAsset",token))
  // }

  // const handleGetRfid=async(token:string)=>{
  //   SetRfidAssets(await getRfidAssets("/Rfid/SelectRfidAsset"))
  // }

  const handleOpenMenu = (event:any,UserMatch_id_user_match:string,Asset_name_assets:string, UserMatch_room:string, UserMatch_floor:string, UserMatch_description:string) => {
    setUsermatch({
      UserMatch_id_user_match:UserMatch_id_user_match,
      Asset_name_assets:Asset_name_assets,
      UserMatch_room:UserMatch_room,
      UserMatch_floor:UserMatch_floor,
      UserMatch_description:UserMatch_description
    })
    setOpen(event.currentTarget);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
      const newSelecteds:any = listusermatch.map((n:any) => n.Asset_name_assets);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const Agree = async() => {
    // console.log(Usermatch.id_usermatch,Usermatch.id_match)
    await returnAsset(`/Usermatch/ReturnAssets/${Usermatch.id_usermatch}`,token,Usermatch.id_match)
  }

  const handleClickstate = (id_usermatch:string,id_match:string) => {
    setOpenDialog(true)
    setUsermatch({id_usermatch:id_usermatch,id_match:id_match});
      setdialog({
        header: "คืนอุปกรณ์",
        body: `คุณแน่ใจว่าจะส่งมอบคืออุปกรณ์?`,
        id: 0,
        status: 0,
      });

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

  const handleCloseNewDialog = () => {
    setOpenNewDialog(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listusermatch.length) : 0;

  const filteredUsers = applySortFilter(listusermatch, getComparator(order, orderBy), filterName);
  
  const isNotFound = !filteredUsers.length && !!filterName;

  const handlemenu = async(menu:number) => {
    setOpen(null)
    if(menu === 1){
      reset({})
      setOpenEditDialog(true)
    }
    else{
      await ApproveUserMatch(`/UserMatch/Approve/${Usermatch.UserMatch_id_user_match}`,token, {status_Approve:"Cancel",status_user_match:"Wait for Approve"})
    //   setOpenDialog(true)
    //   setdialog({
    //     header: "Delete",
    //     body: `Are you sure want to delete?`,
    //     id: 0,
    //     status: 0,
    //   });
    // }
  };
}

const handleOnSubmit=async(data:any)=>{
  const {asset,room,floor,description} = data
  await addUserMatching("/Usermatch/AddUsermatch",token,asset,room,floor,description)
}

const handleOnEditSubmit=async(data:any)=>{
  const {editroom,editfloor,editdescription} = data
  await updateUsermatch(`/Usermatch/AllUsermatch/${Usermatch.UserMatch_id_user_match}`,token,editroom,editfloor,editdescription);
}

const ComponentUserMatch= async (token:string) => {
  setlistusermatch(await getRequestRent("/Usermatch/GetRequestRent",token));
  setlistassets(await getRentMatch("/Match/SelectRentMatch",token));
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
      // handleGetassets(user.token);
      // handleGetRfid(user.token)
      ComponentUserMatch(user.token);
      setToken(user.token);
    }
    else{
      navigate('/login')
    }
  },[]);
  return (
    <>
      <Helmet>
          <title> User | SmartSocket </title>
      </Helmet>
      <Container>
      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5,mt:2 }}>
          <Typography variant="h4" gutterBottom>
            UserMatch
          </Typography>
          <Button variant="contained" startIcon={<Box component={Icon} icon={"eva:plus-fill"}/>} onClick={() => setOpenNewDialog(true)}>
            Rent
          </Button>
      </Stack> */}
      <PageTitleWrapper>
        <Avatar sx={{backgroundColor: 'rgba(255, 255, 255, 1)',marginRight:3,width: 70, height: 70,borderRadius: 2,boxShadow:6}}>
          <Iconify icon={"icon-park-outline:add-computer"} sx={{width: 40, height: 40,color:"rgb(85, 105, 255);"}}/>
        </Avatar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              เบิกยืมอุปกรณ์
            </Typography>
            <Typography variant="subtitle2">
              ทุกแง่มุมที่เกี่ยวข้องกับการเบิกยืมอุปกรณ์สามารถจัดการได้จากหน้านี้
            </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<Box component={Icon} icon={"eva:plus-fill"}/>}
            onClick={() => setOpenNewDialog(true)}
          >
            ยืมอุปกรณ์
          </Button>
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
                  rowCount={listusermatch.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row:any) => {
                    const { UserMatch_id_user_match,Asset_name_assets, UserMatch_room, UserMatch_floor, UserMatch_description, Totaltime, UserMatch_datetime, UserMatch_status_user_match,Match_id_match }:any = row;
                    const selectedUser = selected.indexOf(Asset_name_assets) !== -1;

                    return (
                      <TableRow hover key={UserMatch_id_user_match} tabIndex={-1} role="checkbox" selected={selectedUser}>

                        <TableCell align="center">{Asset_name_assets}</TableCell>

                        <TableCell align="center">{UserMatch_room}</TableCell>

                        <TableCell align="center">{UserMatch_floor}</TableCell>

                        <TableCell align="center">
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

                        <TableCell align="center">{formatTime(Number(Totaltime))}</TableCell>

                        <TableCell align="center">{formatDate(UserMatch_datetime)}</TableCell>

                        <TableCell align="center">
                          {UserMatch_status_user_match === "Wait for Approve" &&
                            "รอการอนุมัติ"
                          }
                          {UserMatch_status_user_match === "Approve" &&
                            "อนุมัติ"
                          }
                          {UserMatch_status_user_match === "Cancel" &&
                            "ยกเลิกคำขอ"
                          }
                          {UserMatch_status_user_match === "Wait for Approve Return" &&
                            "รอการอนุมัติส่งคืน"
                          }
                          {UserMatch_status_user_match === "Return" &&
                            "ส่งคืนอุปกรณ์เรียบร้อย"
                          }
                        </TableCell>

                        {UserMatch_status_user_match === "Wait for Approve" &&
                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event,UserMatch_id_user_match,Asset_name_assets, UserMatch_room, UserMatch_floor, UserMatch_description)}>
                            <Iconify icon={"eva:more-vertical-fill"}/>
                          </IconButton>
                        </TableCell>
                        }
                        {UserMatch_status_user_match === "Wait for Approve Return" &&
                        <TableCell align="right">
                        </TableCell>
                        }
                        {UserMatch_status_user_match === "Approve" &&
                        <TableCell align="left">
                          <Button variant="contained" size="small" onClick={()=>handleClickstate(UserMatch_id_user_match,Match_id_match)}>
                            คืนอุปกรณ์
                          </Button>
                        </TableCell>
                        }
                        {UserMatch_status_user_match === "Reject" &&
                        <TableCell align="left">
                          <Box sx={{marginLeft:4}}>
                           <Iconify  sx={{width:35,height:35,color:'red'}} icon={"material-symbols:cancel-outline-rounded"}/>
                          </Box>
                        </TableCell>
                        }
                        {UserMatch_status_user_match === "Return" &&
                        <TableCell align="left">
                          <Box sx={{marginLeft:4}}>
                          <Iconify sx={{width:35,height:35,color:'green'}} icon={"line-md:circle-to-confirm-circle-transition"}/>
                          </Box>
                        </TableCell>
                        }
                        {UserMatch_status_user_match === "Cancel" &&
                        <TableCell align="left">
                          <Box sx={{marginLeft:4}}>
                          <Iconify sx={{width:35,height:35,color:'red'}} icon={"material-symbols:cancel-schedule-send-outline-rounded"}/>
                          </Box>
                        </TableCell>

                        }
                        
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={8} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
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
            count={listusermatch.length}
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
        {/* <MenuItem onClick={()=>handlemenu(1)}>
          <Iconify icon={"eva:edit-fill"} sx={{ mr: 2 }}/>
          Edit
        </MenuItem> */}
        <MenuItem onClick={()=>handlemenu(0)} sx={{ color: 'error.main' }}>
          <Iconify icon={"material-symbols:cancel-schedule-send-outline-rounded"} sx={{ mr: 2 }}/>
          ยกเลิกคำขอ
        </MenuItem>
      </Popover>

      <Dialog
          open={openNewDialog}
          onClose={handleCloseNewDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "1000px",  // Set your width here
                paddingTop:"20px"
              },
            },
          }}
        >
          <DialogTitle id="form-dialog-title">
            <Typography sx={{paddingLeft:'30px',paddingTop:'10px'}} variant="h4" gutterBottom>
               เบิกยืมอุปกรณ์
            </Typography>
          </DialogTitle>
          <DialogContent>
          <Stack spacing={3}>
          <Box component="form" onSubmit={handleSubmit(handleOnSubmit)}>
            <CardContent sx={{pt:4}}>
              <Box sx={{ m: -1.5 }}>
              <Stack spacing={3} mb={3}>

          <Controller
              control={control}
              name="asset"
              defaultValue=""
              rules={{
                required: true
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl error={error !== undefined} fullWidth>
                <InputLabel id="demo-simple-select-label">อุปกรณ์</InputLabel>
                  <Select 
                  {...field}
                  fullWidth
                  labelId="demo-simple-select-label"
                  label="อุปกรณ์"
                  error={error !== undefined}
                   >
                    <MenuItem
                      value=""
                    >
                      <em>None</em>
                    </MenuItem>
                {listassets.map((asset) => {
                  return (
                    <MenuItem
                      value={asset.Match_id_match}
                      key={asset.Match_id_match}
                    >
                      {asset.Asset_name_assets}
                    </MenuItem>
                  );
                })}
                   </Select>
                <FormHelperText>{error ? myHelper.rfid[error.type] : ""}</FormHelperText>
                </FormControl>
              )}
            />

          <Controller
              control={control}
              name="room"
              defaultValue=""
              rules={{
                required: true
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  type="text"
                  fullWidth
                  label="ห้อง"
                  error={error !== undefined}
                  helperText={error ? myHelper.expiration[error.type] : ""}
                />
              )}
            />

            <Controller
              control={control}
              name="floor"
              defaultValue=""
              rules={{
                required: true
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  type="text"
                  fullWidth
                  label="ชั้น"
                  error={error !== undefined}
                  helperText={error ? myHelper.expiration[error.type] : ""}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              defaultValue=""
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  type="text"
                  fullWidth
                  label="คำอธิบาย"
                  multiline
                  rows={4}
                />
              )}
            />

          </Stack>
              </Box> 
            </CardContent>
            <Divider />
            <CardActions>
               <Button fullWidth variant="text" type="submit">
                  ส่งคำขอ
                </Button>
             </CardActions>
            </Box>
          </Stack>
          </DialogContent>
        </Dialog>

      <Dialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "1000px",  // Set your width here
                paddingTop:"20px"
              },
            },
          }}
        >
          <DialogTitle id="form-dialog-title">
            <Typography sx={{paddingLeft:'30px',paddingTop:'10px'}} variant="h4" gutterBottom>
                Edit Asset
            </Typography>
          </DialogTitle>
          <DialogContent>
          <Box component="form" onSubmit={handleSubmit(handleOnEditSubmit)}>
            <CardContent sx={{pt:4}}>
              <Box sx={{ m: -1.5 }}>
              <Stack spacing={2} mb={3}>
                    <Controller
                      control={control}
                      name="editassetname"
                      defaultValue={Usermatch.Asset_name_assets}
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          defaultValue={Usermatch.Asset_name_assets}
                          type="text"
                          fullWidth
                          label="Name Assets"
                          InputProps={{
                            readOnly: true,
                          }}
                          error={error !== undefined}
                          helperText={error ? myHelper.assets[error.type] : ""}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="editroom"
                      defaultValue={Usermatch.UserMatch_room}
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          defaultValue={Usermatch.UserMatch_room}
                          type="text"
                          fullWidth
                          label="Room"
                          error={error !== undefined}
                          helperText={error ? myHelper.expiration[error.type] : ""}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="editfloor"
                      defaultValue={Usermatch.UserMatch_floor}
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          defaultValue={Usermatch.UserMatch_floor}
                          type="text"
                          fullWidth
                          label="Floor"
                          error={error !== undefined}
                          helperText={error ? myHelper.expiration[error.type] : ""}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="editdescription"
                      defaultValue={Usermatch.UserMatch_description}
                      render={({ field}) => (
                        <TextField
                          defaultValue={Usermatch.UserMatch_description}
                          type="text"
                          fullWidth
                          label="Description"
                          multiline
                          rows={4}
                          {...field}
                        />
                      )}
                    />

              </Stack>
              </Box> 
            </CardContent>
            <Divider />
            <CardActions>
               <Button fullWidth variant="text" type="submit">
                Save Changes
                </Button>
             </CardActions>
            </Box>
          </DialogContent>
        </Dialog>

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
            <Button onClick={handleCloseDialog}>ยกเลิก</Button>
            <Button
              onClick={Agree}
              autoFocus
            >
              ส่งคืน
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
export default CreateUserMatch;