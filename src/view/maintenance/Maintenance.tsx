import React, { useEffect, useState, forwardRef } from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate } from "react-router-dom";
import { filter } from 'lodash';
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
    Stack,
    Avatar,
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
  Input
  } from "@mui/material";
  import Iconify from "../../components/iconify/Iconify";
  import Scrollbar from "../../components/scrollbar/Scrollbar";
  import { UserListHead,UserListToolbar } from '../../components/user';
  import { getUsers,updateUser,updateUserStatus,register,SelectAssetMaintenance } from "../../services/apiservice";
  import { User } from "../../model/model";
  import { Controller,useForm } from 'react-hook-form';
  import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableHead from '@mui/material/TableHead';
import Collapse from '@mui/material/Collapse';
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import formatTime from '../../components/caltime/millisectohms'
import StepConnector, {
  stepConnectorClasses
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";

import HandymanTwoToneIcon from '@mui/icons-material/HandymanTwoTone';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import HourglassTopTwoToneIcon from '@mui/icons-material/HourglassTopTwoTone';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import { StepIconProps } from "@mui/material/StepIcon";
  interface LocalStorage {
    username: string;
    token: string;
  }

  const TABLE_HEAD:{ id: string, label: string,alignRight: boolean }[] = [
    { id: 'Asset_name', label: 'AssetName', alignRight: false },
    { id: 'Asset_expire_hour', label: 'ExpireHour', alignRight: false },
    { id: 'Match_remain_time', label: 'TimeUse', alignRight: false },
    { id: '', label: 'Action', alignRight: false  },
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
const HomeMaintenance: React.FC=()=>{

  const navigate = useNavigate();

  const [Token,setToken] = useState<string>("")

  const [listuser,setlistUser] = useState<[]>([])

  const [listMaintenance,setlistMaintenance] = useState<[]>([])

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
        setlistUser(await getUsers("/Maintenance/AllMaintenance",token))
        setlistMaintenance(await SelectAssetMaintenance("/Match/SelectMaintenance",token))
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
        const UpdateUser = await updateUserStatus(`/User/AllUser/${UserId.id}`,Token);
        if(UpdateUser.status === 1){
          const filterDeleteUser = filteredUsers.filter((object:any) => {
            return object.id_user !== UserId;
          });
          setlistUser(filterDeleteUser)
          setMessagealert({message:UpdateUser.message,color:"success"})
          handleCloseDialog() 
          setOpenAlert(true);
        }
          setOpenDialog(false)
      }
    
      const handleOnSubmit=async(data:any)=>{
        console.log(data)
        await register("/User/Register",Token,data.name,data.surname,data.id_card,data.password,data.email,data.role,data.departure)
        // navigate('/app/admin/user/list')
      }  
      const handleOnEditSubmit=async(data:any)=>{
        const UpdateUser = await updateUser(`/User/AllUser/${UserId.id}`,Token,data.editname,data.editsurname, data.editid_card,data.editemail,data.editrole,data.editdeparture);
        if(UpdateUser.status === 1){
          let Index = filteredUsers.findIndex((value: { id_user: number; })=>value.id_user === UserId.id);
          filteredUsers[Index].fullname = data.editname+" "+data.editsurname;
          filteredUsers[Index].email = data.editemail
          filteredUsers[Index].id_card = data.editid_card
          filteredUsers[Index].role = data.editrole
          filteredUsers[Index].departure = data.editdeparture
          setOpenEditDialog(false)
          setMessagealert({message:UpdateUser.message,color:"success"})
          setOpenAlert(true);
        }else{
          setOpenEditDialog(false)
          setMessagealert({message:UpdateUser.message,color:"error"})
          setOpenAlert(true);
        }
      }  
      //------------------------------//
      function Row(props:any) {
        const { row }:any = props;
        const { Match_id_match,Asset_name,Asset_expire_hour,Match_remain_time,History }:any = row;
        const [openTable, setOpenTable] = useState(false);
        const [rowsPage, setPerPage] = useState(4);
        const [pageTable, setPageTable] = useState(0);
        const [completed, setCompleted]:any = useState(undefined);
        const handleChangePageTable = (event:any, newPage:any) => {
          setPageTable(newPage);
        };
        const handleChangeRowsPage = (event:any) => {
          setPageTable(0);
          setPerPage(parseInt(event.target.value, 10));
        };
        const ColorlibStepIconRoot = styled("div")<{
          ownerState: { completed?: boolean; active?: boolean };
        }>(({ theme, ownerState }) => ({
          backgroundColor:
            theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
          zIndex: 1,
          color: "#fff",
          width: 50,
          height: 50,
          display: "flex",
          borderRadius: "50%",
          justifyContent: "center",
          alignItems: "center",
          ...(ownerState.active && {
            backgroundImage:
              "linear-gradient(315deg, #29539b 0%, #1e3b70 74%)",
            boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)"
          }),
          ...(ownerState.completed && {
            backgroundImage:
              "linear-gradient(315deg, #29539b 0%, #1e3b70 74%)"
          })
        }));
        const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
          [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 22
          },
          [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
              backgroundImage:
                "linear-gradient(315deg, #29539b 0%, #1e3b70 74%)"
            }
          },
          [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
              backgroundImage:
                "linear-gradient(315deg, #29539b 0%, #1e3b70 74%)"
            }
          },
          [`& .${stepConnectorClasses.line}`]: {
            height: 3,
            border: 0,
            backgroundColor:
              theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
            borderRadius: 1
          }
        }));
        function ColorlibStepIcon(props: StepIconProps) {
          const { active, completed, className } = props;
        
          const icons: { [index: string]: React.ReactElement } = {
            1: <HourglassTopTwoToneIcon />,
            2: <AssignmentTwoToneIcon />,
            3: <HandymanTwoToneIcon />,
            4: <CheckCircleTwoToneIcon />
          };
        
          return (
            <ColorlibStepIconRoot
              ownerState={{ completed, active }}
              className={className}
            >
              {icons[String(props.icon)]}
            </ColorlibStepIconRoot>
          );
        }
        let statusstep = 0;
        const steps = [
          "Waiting for Delivery",
          "Request Accepted",
          "Maintenancing",
          "Success Maintenance"
        ];
        const stepbutton = [
          "Request Accepted",
          "Maintenancing",
          "Success Maintenance"
        ]
        switch(History[0].Maintenance_status_maintenance) {
          case  "waiting for delivery":
            // code block
            break;
          case "request accepted":
            // code block
            statusstep = statusstep+1;
            break;
          case "maintenancing":
            statusstep = statusstep+2;
            break;
          case "success maintenance":
            statusstep = statusstep+3;
            stepbutton[3] = "success"
            // setCompleted(true)
            break;
          default:
            break;
            // code block
        }
        

        return(
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }} >
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpenTable(!openTable)}
            >
              {openTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>


          <TableCell align="center">{Asset_name}</TableCell>

          <TableCell align="center">{formatTime(Asset_expire_hour)}</TableCell>

          <TableCell align="center">{formatTime(Match_remain_time)}</TableCell>
          <TableCell align="center">
            <Box>
              <Button
              variant="contained"
              size="small"
              color="success"
              >
                {stepbutton[statusstep]}
              </Button>
            </Box>
          </TableCell>

       </TableRow>
       <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={openTable} timeout="auto" unmountOnExit>
            <Box sx={{ paddingTop:3,paddingBottom:3}}>
              {/* <Typography variant="h6" gutterBottom component="div" sx={{display:'flex',alignContent:'center'}}>
                History Maintenance
              </Typography> */}
              <Box sx={{ width: "100%" ,paddingTop:5,paddingBottom:5}}>
              <Stepper
                alternativeLabel
                activeStep={statusstep}
                connector={<ColorlibConnector />}
              >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {History.slice(pageTable * rowsPage, pageTable * rowsPage + rowsPage).map((historyRow:any) => (
                    <TableRow key={historyRow.Maintenance_id_maintenance}>
                      <TableCell component="th" scope="row" align="center">
                        {historyRow.Maintenance_status_maintenance}
                      </TableCell>
                      <TableCell align="center">{new Date(historyRow.Maintenance_date_maintenance).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                    rowsPerPageOptions={[4, 8, 12]}
                    component="div"
                    count={History.length}
                    rowsPerPage={rowsPage}
                    page={pageTable}
                    onPageChange={handleChangePageTable}
                    onRowsPerPageChange={handleChangeRowsPage}
                />
            </Box>
            
          </Collapse>
          
        </TableCell>
        
      </TableRow>
      
      </React.Fragment>
        )

      }

      useEffect(() => {
        const item = localStorage.getItem("User");
          if (item && item !== "undefined") {
            const user:LocalStorage = JSON.parse(item);
            ComponentUser(user.token);
            setToken(user.token);
          }
          else{
            navigate('/login')
          }
      }, []);

    return(
        <>
            <Helmet>
                <title> Maintenance: List | SmartSocket </title>
            </Helmet>
            <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5,mt:2 }}>
                <Typography variant="h4" gutterBottom>
                    Maintenance
                </Typography>
                <Button variant="contained" startIcon={<Iconify icon={"eva:plus-fill"}/>} onClick={() => setOpenNewDialog(true)}>
                    Send Repairs
                </Button>
            </Stack>
            <hr />
            <Card>
                <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
                <Scrollbar>
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
                            // const { id_user,id_card,fullname,email,departure,role,status_user }:any = row;
                            // const selectedUser = selected.indexOf(id_user) !== -1;

                            return (
                              <Row row={row} />
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
                Send Repairs Asset
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
                      name="asset"
                      defaultValue=""
                      rules={{
                        required: true
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl error={error !== undefined} fullWidth>
                        <InputLabel id="demo-simple-select-label">Assets</InputLabel>
                          <Select 
                          fullWidth
                          labelId="demo-simple-select-label"
                          label="Assets"
                          {...field}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value))
                            // setInputassets(e.target.value);
                            // Getnode(e.target.value);
                          }}
                          >
                            <MenuItem
                              value=""
                            >
                              <em>None</em>
                            </MenuItem>
                        {listMaintenance.map((inputassets:any) => {
                          return (
                            <MenuItem
                              value={inputassets.Match_id_match}
                              key={inputassets.Match_id_match}
                            >
                              {inputassets.Asset_name_assets}
                            </MenuItem>
                          );
                        })}
                          </Select>
                        <FormHelperText>{error ? myHelper.asset[error.type] : ""}</FormHelperText>
                        </FormControl>
                      )}
                    />
                </Grid>  
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
        </>
    );
}
export default HomeMaintenance