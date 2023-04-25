import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useNavigate } from "react-router-dom";
import {Assets, RfidAssets} from '../../model/model'
import {addAssets, getAssets, getRfidAssets, updateAsset, updateStatusAsset} from "../../services/apiservice"
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
import PageTitleWrapper from "../../components/PageTitleWrapper"

const TABLE_HEAD = [
  { id: 'name_assets', label: 'ชื่ออุปกรณ์', alignRight: false },
  { id: 'rfid_address', label: 'แอดเดรสอาร์เอฟไอดี', alignRight: false },
  { id: 'expire_hour', label: 'เวลาบำรุงรักษา(ชั่วโมง)', alignRight: false },
  { id: 'date_assets', label: 'วันที่-เวลา', alignRight: false },
  // { id: 'maintenance', label: 'Maintenance', alignRight: false },
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

  const [ RfidAssets,SetRfidAssets ] = useState<RfidAssets[]>([]);

  const [token, settoken] = useState("");

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected]:any = useState([]);

  const [orderBy, setOrderBy] = useState('name_assets');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openDialog, setOpenDialog] = useState(false);

  const [openNewDialog, setOpenNewDialog] = useState(false);

  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [Asset,setAsset]:any = useState({})

  const [openAlert, setOpenAlert] = useState(false);

  const [messagealert, setMessagealert]:any = useState({message:"",color:""});

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

  const handleGetassets=async(token:string)=>{
    SetDataassetslist(await getAssets("/Asset/AllAsset",token))
  }

  const handleGetRfid=async(token:string)=>{
    SetRfidAssets(await getRfidAssets("/Rfid/SelectRfidAsset"))
  }

  const handleOpenMenu = (event:any,id_assets:string,name_assets:string,expire_hour:number,rfid_address:string) => {
    setAsset({
      id_assets:id_assets,
      name_assets:name_assets,
      expire_hour:expire_hour,
      rfid_address:rfid_address
    })
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

  const handleCloseDialog = () => {
    setOpenDialog(false);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listassets.length) : 0;

  const filteredUsers = applySortFilter(listassets, getComparator(order, orderBy), filterName);
  
  const isNotFound = !filteredUsers.length && !!filterName;

  const handlemenu = async(menu:number) => {
    setOpen(null)
    if(menu === 1){
      reset({})
      setOpenEditDialog(true)
    }
    else{
      setOpenDialog(true)
      setdialog({
        header: "ปิดการใช้งาน",
        body: `คุณแน่ใจว่าจะปิดการใช้งานอุปกรณ์ ${Asset.name_assets}?`,
        id: 0,
        status: 0,
      });
  };
}

const Agree = async() => {
  await updateStatusAsset(`/Asset/AllAsset/${Asset.id_assets}`,token);
}

const handleOnSubmit=async(data:any)=>{
  const {nameassets,rfid,expirehour} = data
  await addAssets("/Asset/AddAsset",token,nameassets,rfid,expirehour)
}

const handleOnEditSubmit=async(data:any)=>{
  const {editassetname,editrfid,editexpirehour} = data
  await updateAsset(`/Asset/AllAsset/${Asset.rfid_address}`,editassetname,editrfid,editexpirehour);
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
      handleGetassets(user.token);
      handleGetRfid(user.token)
      settoken(user.token)
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
      <PageTitleWrapper>
        <Avatar sx={{backgroundColor: 'rgba(255, 255, 255, 1)',marginRight:3,width: 70, height: 70,borderRadius: 2,boxShadow:6}}>
          <Iconify icon={"ri:plug-2-line"} sx={{width: 40, height: 40,color:"rgb(85, 105, 255);"}}/>
        </Avatar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              อุปกรณ์
            </Typography>
            <Typography variant="subtitle2">
              สร้างอุปกรณ์และกำหนดเวลาบำรุงรักษา
            </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<Box component={Icon} icon={"eva:plus-fill"}/>}
            onClick={() => setOpenNewDialog(true)}
          >
            เพิ่มอุปกรณ์
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
                  rowCount={listassets.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row:any) => {
                    const { id_assets, name_assets, expire_hour, date_assets, status_assets, maintenance,rfid_address }:any = row;
                    const selectedUser = selected.indexOf(name_assets) !== -1;
                    console.log(row)

                    return (
                      <TableRow hover key={id_assets} tabIndex={-1} role="checkbox" selected={selectedUser}>

                        <TableCell align="center">{name_assets}</TableCell>

                        <TableCell align="center">{rfid_address}</TableCell>

                        <TableCell align="center">{expire_hour} ชั่วโมง</TableCell>

                        <TableCell align="center">{new Date(date_assets).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>

                        {/* <TableCell align="center">{maintenance ? 'ควรส่งซ่อม' : 'ยังไม่ซ่อม'}</TableCell> */}

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event,id_assets,name_assets,expire_hour,rfid_address)}>
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
        <MenuItem onClick={()=>handlemenu(1)}>
          <Iconify icon={"eva:edit-fill"} sx={{ mr: 2 }}/>
          แก้ไข
        </MenuItem>

        <MenuItem onClick={()=>handlemenu(0)} sx={{ color: 'error.main' }}>
          <Iconify icon={"fe:disabled"} sx={{ mr: 2 }}/>
          ปิดใช้งาน
        </MenuItem>
      </Popover>

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
              ปิดการใช้งาน
            </Button>
          </DialogActions>
        </Dialog>

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
            สร้างอุปกรณ์
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
              name="nameassets"
              defaultValue=""
              rules={{
                required: true
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                {...field}
                label="ชื่ออุปกรณ์"
                type="text"
                error={error !== undefined}
                helperText={error ? myHelper.asset[error.type] : ""}
              />
              )}
            />

          <Controller
              control={control}
              name="rfid"
              defaultValue=""
              rules={{
                required: true
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl error={error !== undefined} fullWidth>
                <InputLabel  id="demo-simple-select-label">แอดเดรสอาร์เอฟไอดี</InputLabel>
                  <Select 
                  {...field}
                  fullWidth
                  labelId="demo-simple-select-label"
                  label="แอดเดรสอาร์เอฟไอดี"
                  error={error !== undefined}
                   >
                    <MenuItem
                      value=""
                    >
                      <em>None</em>
                    </MenuItem>
                {RfidAssets.map((inputnode) => {
                  return (
                    <MenuItem
                      value={inputnode.Rfid_rfid_address}
                      key={inputnode.Rfid_rfid_address}
                    >
                      {inputnode.Rfid_rfid_address}
                    </MenuItem>
                  );
                })}
                   </Select>
                <FormHelperText>{error ? myHelper.rfid[error.type] : ""}</FormHelperText>
                </FormControl>
              )}
            />

          {/* <Controller
              control={control}
              name="expirehour"
              defaultValue=""
              rules={{
                required: true
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  type="number"
                  fullWidth
                  label="เวลาบำรุงรักษา"
                  error={error !== undefined}
                  helperText={error ? myHelper.expiration[error.type] : ""}
                />
              )}
            /> */}
            <Controller
              control={control}
              name="expirehour"
              defaultValue=""
              rules={{
                required: true
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl error={error !== undefined} fullWidth>
                <InputLabel  id="demo-simple-select-label">เวลาบำรุงรักษา</InputLabel>
                  <Select 
                  {...field}
                  fullWidth
                  labelId="demo-simple-select-label"
                  label="เวลาบำรุงรักษา"
                  error={error !== undefined}
                   >
                    <MenuItem
                      value=""
                    >
                      <em>None</em>
                    </MenuItem>
                    <MenuItem
                      value="8760"
                    >
                      <p>1 ปี</p>
                    </MenuItem>
                    <MenuItem
                      value="17520"
                    >
                      <p>2 ปี</p>
                    </MenuItem>
                    <MenuItem
                      value="26280"
                    >
                      <p>3 ปี</p>
                    </MenuItem>
                    <MenuItem
                      value="35040"
                    >
                      <p>4 ปี</p>
                    </MenuItem>
                    <MenuItem
                      value="43800"
                    >
                      <p>5 ปี</p>
                    </MenuItem>
                
                   </Select>
                <FormHelperText>{error ? myHelper.expiration[error.type] : ""}</FormHelperText>
                </FormControl>
              )}
            />
          </Stack>
              </Box> 
            </CardContent>
            <Divider />
            <CardActions>
               <Button fullWidth variant="text" type="submit">
                  สร้างอุปกรณ์
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
                แก้ไขอุปกรณ์
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
                      defaultValue={Asset.name_assets}
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          defaultValue={Asset.name}
                          type="text"
                          fullWidth
                          label="ชื่ออุปกรณ์"
                          error={error !== undefined}
                          helperText={error ? myHelper.assets[error.type] : ""}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="editexpirehour"
                      defaultValue={Asset.expire_hour}
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          defaultValue={Asset.expire_hour}
                          type="text"
                          fullWidth
                          label="เวลาบำรุงรักษา (ชั่วโมง)"
                          error={error !== undefined}
                          helperText={error ? myHelper.expiration[error.type] : ""}
                          {...field}
                        />
                      )}
                    />

                  <Controller
              control={control}
              name="editrfid"
              defaultValue={Asset.rfid_address}
              rules={{
                required: true
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl error={error !== undefined} fullWidth>
                <InputLabel id="demo-simple-select-label">แอดเดรสอาร์เอฟไอดี</InputLabel>
                  <Select 
                  {...field}
                  fullWidth
                  labelId="demo-simple-select-label"
                  label="แอดเดรสอาร์เอฟไอดี"
                  defaultValue={Asset.rfid_address}
                  error={error !== undefined}
                   >
                    
                    <MenuItem
                      value=""
                    >
                      <em>None</em>
                    </MenuItem>
                    <MenuItem
                      value={Asset.rfid_address}
                    >
                      {Asset.rfid_address}
                    </MenuItem>
                {RfidAssets.map((inputnode) => {
                  return (
                    <MenuItem
                      value={inputnode.Rfid_rfid_address}
                      key={inputnode.Rfid_rfid_address}
                    >
                      {inputnode.Rfid_rfid_address}
                    </MenuItem>
                  );
                })}
                   </Select>
                <FormHelperText>{error ? myHelper.rfid[error.type] : ""}</FormHelperText>
                </FormControl>
              )}
            />
              </Stack>
              </Box> 
            </CardContent>
            <Divider />
            <CardActions>
               <Button fullWidth variant="text" type="submit">
                บันทึกการเปลี่ยนแปลง
                </Button>
             </CardActions>
            </Box>
          </DialogContent>
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
export default HomeAsset;
