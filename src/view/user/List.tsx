import React, { useEffect, useState, forwardRef } from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate } from "react-router-dom";
import { filter } from 'lodash';
import { 
  Container,
  Box,
  Stack,
  Typography,
  Button,
  Card,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
  Checkbox,
  IconButton,
  Avatar,
  Popover,
  MenuItem,
  //dialog
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,

  FormControl,
  InputLabel,
  Select,
  TextField,
  FormHelperText,
  CardHeader,
  CardContent,
  Unstable_Grid2 as Grid,
  CardActions,
  Divider,
  Input
} from "@mui/material";
import Iconify from "../../components/iconify/Iconify";
import Scrollbar from "../../components/scrollbar/Scrollbar";
import { UserListHead,UserListToolbar } from '../../components/user';
import { getUsers,updateUser,updateUserStatus,register } from "../../services/apiservice";
import { User } from "../../model/model";
import { IMaskInput } from 'react-imask';
import { Controller,useForm } from 'react-hook-form';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}
interface LocalStorage {
  username: string;
  token: string;
}
const TextMaskCustom = forwardRef<HTMLElement, CustomProps>(
  function TextMaskCustom(props, ref:any) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="0-0000-00000-00-0"
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  },
);

const TABLE_HEAD:{ id: string, label: string,alignRight: boolean }[] = [
  { id: 'fullname', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'id_card', label: 'ID card', alignRight: false },
  { id: 'departure', label: 'Departure', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'status_user', label: 'Status_user', alignRight: false },
  { id: '', label: '', alignRight: false  },
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
    return filter(array, (_user:any) => _user.fullname.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el:any) => el[0]);
}
 
const ListUser: React.FC = () => {

  const navigate = useNavigate();

  const [Token,setToken] = useState<string>("")

  const [listuser,setlistUser] = useState<User[]>([])

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected]:any = useState([]);

  const [orderBy, setOrderBy] = useState('fullname');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openDialog, setOpenDialog] = useState(false);

  const [openNewDialog, setOpenNewDialog] = useState(false);

  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [UserId,setId]:any = useState({})

  const [dialog, setdialog] = React.useState({
    header: "",
    body: "",
    id: 0,
    status: 0,
  });

  const [openAlert, setOpenAlert] = useState(false);

  const [messagealert, setMessagealert]:any = useState({message:"",color:""});

  //-----------------New User--------------------//
  const { control, handleSubmit, watch, reset } = useForm({
    reValidateMode: "onBlur"
  });

const myHelper:any = {
    username:{
      required: "Username is Required"
    },
    password:{
      required: "Password is Required"
    },
    confirmpassword:{
      required: "ConfirmPassword is Required",
      validate: "Password Not Match"
    },
    name:{
      required: "Name is Required"
    },
    surname:{
      required: "Surname is Required"
    },
    email:{
      required: "Email is Required",
      pattern: "Invalid Email Address"
    },
    card:{
      required: "Id Card is Required",
      pattern: "Invalid Id Card"
    },
    role:{
      required: "Role is Required"
    },
    departure:{
        required: "Departure is Required"
    }
  };

  const ComponentUser = async(token:string) => {
    setlistUser(await getUsers("/User/AllUser",token))
  }

  const handleOpenMenu = (event:any,id:any,id_card:any,fullname:any,email:any,departure:any,role:any,status_user:any) => {
    console.log(id,id_card,fullname,email,departure,role,status_user)
    var splitfullname = fullname.split(" ");
    setId({
      id:id,
      name:splitfullname[0],
      surname:splitfullname[1],
      email:email,
      id_card:id_card,
      departure:departure,
      role:role
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
      const newSelecteds:any = listuser.map((n:any) => n.id_user);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listuser.length) : 0;

  const filteredUsers = applySortFilter(listuser, getComparator(order, orderBy), filterName);
  
  const isNotFound = !filteredUsers.length && !!filterName;

  const handlemenu = async(menu:number) => {
    setOpen(null)
    if(menu === 1){
      reset({})
      setOpenEditDialog(true)
      // setdialog({
      //   header: "Approve",
      //   body: `Do you want Delete User?`,
      //   id: 0,
      //   status: 0,
      // });
    }
    else{
      setOpenDialog(true)
      setdialog({
        header: "Delete",
        body: `Are you sure want to delete?`,
        id: 0,
        status: 0,
      });
    }
  };

  const Agree = async() => {
    await updateUserStatus(`/User/AllUser/${UserId.id}`,Token);
  }

  const handleOnSubmit=async(data:any)=>{
    console.log(data)
    await register("/User/Register",Token,data.name,data.surname,data.id_card,data.password,data.email,data.role,data.departure)
    navigate('/app/admin/user/list')
  }  
  const handleOnEditSubmit=async(data:any)=>{
    await updateUser(`/User/AllUser/${UserId.id}`,Token,data.editname,data.editsurname, data.editid_card,data.editemail,data.editrole,data.editdeparture);
  }  
  //------------------------------//

  useEffect(() => {
    const {open,message} = window.history.state
    const item = localStorage.getItem("User");
      if(open === 1){
          setMessagealert({message:message,color:"success"})
          setOpenAlert(true);
          window.history.replaceState({}, "", "");
        }
      if (item && item !== "undefined") {
        const user:LocalStorage = JSON.parse(item);
        ComponentUser(user.token);
        setToken(user.token);
      }
      else{
        navigate('/login')
      }
  }, []);

  return (
    <>
      <Helmet>
          <title> User: List | SmartSocket </title>
      </Helmet>
      <Container >
        
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5,mt:2 }}>
          <Typography variant="h4" gutterBottom>
            User List
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon={"eva:plus-fill"}/>} onClick={() => setOpenNewDialog(true)}>
            New User
          </Button>
        </Stack>
        <hr />
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          {/* <Scrollbar> */}
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={listuser.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row:any,index:any) => {
                    const { id_user,id_card,fullname,email,departure,role,status_user }:any = row;
                    const selectedUser = selected.indexOf(id_user) !== -1;

                    return (
                      <TableRow hover key={id_user} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, id_user)} />
                        </TableCell> */}

                        <TableCell align="center">
                        <Stack direction="row" alignItems="center" spacing={2} sx={{pl:3}}>
                          <Avatar src={"https://ui-avatars.com/api/?background=random&bold=true&name="+fullname} />
                            <Typography variant="subtitle2" noWrap>
                              {fullname}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="center">{email}</TableCell>

                        <TableCell align="center">
                            <Typography noWrap>
                              {id_card}
                            </Typography>
                        </TableCell>

                        <TableCell align="center">{departure}</TableCell>

                        <TableCell align="center">{role}</TableCell>

                        <TableCell align="center">{status_user}</TableCell>
                        {
                          id_user !== 1 &&
                          <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event,id_user,id_card,fullname,email,departure,role,status_user)}>
                            <Iconify icon={"eva:more-vertical-fill"}/>
                          </IconButton>
                        </TableCell>
                        }
                        {
                          id_user === 1 &&
                          <TableCell align="right">
                        </TableCell>
                        }

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
          {/* </Scrollbar> */}

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={listuser.length}
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
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
              Edit
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }} onClick={()=>handlemenu(0)}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
              Delete
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
            <Button onClick={handleCloseDialog}>Disagree</Button>
            <Button
              onClick={Agree}
              autoFocus
            >
              Agree
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
            <Typography variant="h3" gutterBottom>
                Create a new user
            </Typography>
          </DialogTitle>
          <DialogContent>
          <Stack spacing={3}>
          <Box component="form" onSubmit={handleSubmit(handleOnSubmit)}>
            <CardContent sx={{pt:4}}>
              <Box sx={{ m: -1.5 }}>
                <Grid container spacing={2} pl={2} pr={2}>
                <Grid
                    xs={12}
                    md={6}
                  >
                    <Controller
                      control={control}
                      name="name"
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          label="Name"
                          defaultValue=""
                          error={error !== undefined}
                          helperText={error ? myHelper.name[error.type] : ""}
                        />
                      )}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={6}
                  >
                     <Controller
                      control={control}
                      name="surname"
                      defaultValue=""
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          label="Surname"
                          error={error !== undefined}
                          helperText={error ? myHelper.surname[error.type] : ""}
                        />
                      )}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={6}
                  >
                    <Controller
                      control={control}
                      name="email"
                      defaultValue=""
                      rules={{
                        required: true,
                        pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          label="Email"
                          error={error !== undefined}
                          helperText={error ? myHelper.email[error.type] : ""}
                        />
                      )}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={6}
                  >
                    <Controller
                      control={control}
                      name="id_card"
                      defaultValue=""
                      rules={{
                        required: true,
                        pattern: /([0-9]{1})-([0-9]{4})-([0-9]{5})-([0-9]{2})-([0-9]{1})/
                      }}
                      render={({ field, fieldState: { error } }) => (
                        
                        <TextField
                        {...field}
                          type="text"
                          fullWidth
                          label="ID Card"
                          InputProps={{
                            inputComponent: TextMaskCustom as any
                          }}
                          error={error !== undefined}
                          helperText={error ? myHelper.card[error.type] : ""}
                      />

                                                
                      )}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={6}
                  >
                    <Controller
                      control={control}
                      name="role"
                      defaultValue=""
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          label="Role"
                          error={error !== undefined}
                          helperText={error ? myHelper.role[error.type] : ""}
                        />
                      )}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={6}
                  >
                    <Controller
                      control={control}
                      name="departure"
                      defaultValue=""
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          label="Departure"
                          error={error !== undefined}
                          helperText={error ? myHelper.departure[error.type] : ""}
                        />
                      )}
                    />  
                  </Grid>
                  <Grid
                    xs={12}
                    md={6}
                  >
                    <Controller
                      control={control}
                      name="password"
                      defaultValue=""
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="password"
                          fullWidth
                          label="Password"
                          error={error !== undefined}
                          helperText={error ? myHelper.password[error.type] : ""}
                        />
                      )}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={6}
                  >
                    <Controller
                      control={control}
                      name="con-password"
                      defaultValue=""
                      rules={{
                        required: true,
                        validate: (val: string) => {
                          if (watch('password') != val) {
                            return false;
                          }
                        }
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="password"
                          fullWidth
                          label="ConfirmPassword"
                          error={error !== undefined}
                          helperText={error ? myHelper.confirmpassword[error.type] : ""}
                        />
                      )}
                    />
                  </Grid>
                </Grid>   
              </Box> 
            </CardContent>
            <Divider />
            <CardActions>
               <Button fullWidth variant="text" type="submit">
                Create a new user
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
                Edit User {UserId.name}
            </Typography>
          </DialogTitle>
          <DialogContent>
          <Stack spacing={3}>
          <Box component="form" onSubmit={handleSubmit(handleOnEditSubmit)}>
            <CardContent sx={{pt:4}}>
              <Box sx={{ m: -1.5 }}>
                <Grid container spacing={2} pl={2} pr={2}>
                <Grid
                    xs={12}
                    md={6}
                  >
                    <Controller
                      control={control}
                      name="editname"
                      defaultValue={UserId.name}
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          defaultValue={UserId.name}
                          type="text"
                          fullWidth
                          label="Name"
                          error={error !== undefined}
                          helperText={error ? myHelper.name[error.type] : ""}
                          {...field}
                          // onChange={(e) => {
                          //   field.onChange(parseInt(e.target.value))
                          //   setId({name:e.target.value})
                          // }}
                          
                        />
                      )}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={6}
                  >
                     <Controller
                      control={control}
                      name="editsurname"
                      defaultValue={UserId.surname}
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          label="Surname"
                          error={error !== undefined}
                          helperText={error ? myHelper.surname[error.type] : ""}
                        />
                      )}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={6}
                  >
                    <Controller
                      control={control}
                      name="editemail"
                      defaultValue={UserId.email}
                      rules={{
                        required: true,
                        pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          label="Email"
                          error={error !== undefined}
                          helperText={error ? myHelper.email[error.type] : ""}
                        />
                      )}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={6}
                  >
                    <Controller
                      control={control}
                      name="editid_card"
                      defaultValue={UserId.id_card}
                      rules={{
                        required: true,
                        pattern: /([0-9]{1})-([0-9]{4})-([0-9]{5})-([0-9]{2})-([0-9]{1})/
                      }}
                      render={({ field, fieldState: { error } }) => (
                        
                        <TextField
                        {...field}
                          type="text"
                          fullWidth
                          label="ID Card"
                          InputProps={{
                            inputComponent: TextMaskCustom as any
                          }}
                          error={error !== undefined}
                          helperText={error ? myHelper.card[error.type] : ""}
                          defaultValue={UserId.id_card}
                      />                    
                      )}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={6}
                  >
                    <Controller
                      control={control}
                      name="editrole"
                      defaultValue={UserId.role}
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          label="Role"
                          error={error !== undefined}
                          helperText={error ? myHelper.role[error.type] : ""}
                        />
                      )}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={6}
                  >
                    <Controller
                      control={control}
                      name="editdeparture"
                      defaultValue={UserId.departure}
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          label="Departure"
                          error={error !== undefined}
                          helperText={error ? myHelper.departure[error.type] : ""}
                          defaultValue={UserId.departure}
                        />
                      )}
                    />  
                  </Grid>
                </Grid>   
              </Box> 
            </CardContent>
            <Divider />
            <CardActions>
               <Button fullWidth variant="text" type="submit">
                Save Changes
                </Button>
             </CardActions>
            </Box>
          </Stack>
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
export default ListUser;
