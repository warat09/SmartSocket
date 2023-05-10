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
  CardActions,
  Input,
  Grid
  } from "@mui/material";
  import Iconify from "../../components/iconify/Iconify";
  import Scrollbar from "../../components/scrollbar/Scrollbar";
  import { UserListHead,UserListToolbar } from '../../components/user';
  import { getUsers,SelectAssetMaintenance,AddStatusMaintenance } from "../../services/apiservice";
  import { User } from "../../model/model";
  import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableHead from '@mui/material/TableHead';
import Collapse from '@mui/material/Collapse';
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import formatTime from '../../components/caltime/millisectohms'
import formatDate from "../../components/caltime/caldate"
import StepConnector, {
  stepConnectorClasses
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";

import HandymanTwoToneIcon from '@mui/icons-material/HandymanTwoTone';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import HourglassTopTwoToneIcon from '@mui/icons-material/HourglassTopTwoTone';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import { StepIconProps } from "@mui/material/StepIcon";
import PageTitleWrapper from "../../components/PageTitleWrapper";
  interface LocalStorage {
    username: string;
    token: string;
  }

  const TABLE_HEAD:{ id: string, label: string,alignRight: boolean }[] = [
    { id: 'opendiv', label: '', alignRight: false  },
    { id: 'Asset_name', label: 'ชื่ออุปกรณ๋', alignRight: false },
    { id: 'Asset_expire_hour', label: 'เวลาที่เหลือในการบำรุงรักษา', alignRight: false },
    { id: 'Match_remain_time', label: 'เวลาที่ใช้', alignRight: false },
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
const HomeMaintenance: React.FC=()=>{

  const navigate = useNavigate();

  const [Token,setToken] = useState<string>("")

  const [listuser,setlistUser] = useState<[]>([])

  const [listMaintenance,setlistMaintenance] = useState<[]>([])

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected]:any = useState([]);

  const [orderBy, setOrderBy] = useState('Asset_name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openAlert, setOpenAlert] = useState(false);

  const [messagealert, setMessagealert]:any = useState({message:"",color:""});

  const [Disable,setdisable] = useState("");

    const ComponentUser = async(token:string) => {
        setlistUser(await getUsers("/Maintenance/AllMaintenance",token))
        setlistMaintenance(await SelectAssetMaintenance("/Match/SelectMaintenance",token))
      }

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
    
      //------------------------------//
      function Row(props:any) {
        const { row }:any = props;
        const { Match_status_rent,Asset_name,Asset_expire_hour,Match_sum_used_time,History }:any = row;
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
        const handleAddStatus = async(status:string,asset:number) => {
          await AddStatusMaintenance("/Maintenance/AddStatusMaintenance",Token,status,asset)
        }
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
          "รับเรื่อง",
          "กำลังซ่อมบำรุงรักษา",
          "ซ่อมบำรุงรักษาเสร็จสิ้น"
        ];
        const stepbutton = [
          "Maintenancing",
          "Success Maintenance"
        ]
        const step_button = [
          "กำลังซ่อมบำรุงรักษา",
          "ซ่อมบำรุงรักษาเสร็จสิ้น"
        ]
        switch(History[0].Maintenance_status_maintenance) {
          case "Request Accepted":
            // code block
            break;
          case "Maintenancing":
            statusstep = statusstep+1;
            break;
          case "Success Maintenance":
            statusstep = statusstep+2;
            stepbutton[2] = "success"
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

          <TableCell align="center">{formatTime(Match_sum_used_time)}</TableCell>
          <TableCell align="center">
            {Match_status_rent === "Available" &&
              <Button
              variant="contained"
              size="small"
              color="success"
              onClick={()=>handleAddStatus(stepbutton[statusstep],row.History[0].Maintenance_id_assets)}
              >
                {step_button[statusstep]}
              </Button>       
            }
            {Match_status_rent !== "Available" &&
              <Button
              disabled
              variant="contained"
              size="small"
              color="success"
              onClick={()=>handleAddStatus(stepbutton[statusstep],row.History[0].Maintenance_id_assets)}
              >
                {step_button[statusstep]}
              </Button>       
            }
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
                    <TableCell align="center">สถานะซ่อมบำรุงรักษา</TableCell>
                    <TableCell align="center">วันที่ซ่อมบำรุงรักษา</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {History.slice(pageTable * rowsPage, pageTable * rowsPage + rowsPage).map((historyRow:any) => (
                    <TableRow key={historyRow.Maintenance_id_maintenance}>
                      <TableCell component="th" scope="row" align="center">
                        {historyRow.Maintenance_status_maintenance === "Maintenancing" &&
                          "กำลังซ่อมบำรุงรักษา"
                        }
                        {historyRow.Maintenance_status_maintenance === "Success Maintenance" &&
                          "ซ่อมบำรุงรักษาเสร็จสิ้น"
                        }
                        {historyRow.Maintenance_status_maintenance === "Request Accepted" &&
                          "รับเรื่อง"
                        }
                      </TableCell>
                      <TableCell align="center">{formatDate(historyRow.Maintenance_date_maintenance)}</TableCell>
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
        if(window.history.state !== null){
          const {open,message} = window.history.state;
          if(open === 1) {
            setMessagealert({message:message,color:"success"})
            setOpenAlert(true);
            window.history.replaceState({}, "", "");
          }
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

    return(
        <>
            <Helmet>
                <title> Maintenance | SmartSocket </title>
            </Helmet>
            <Container>
            <PageTitleWrapper>
              <Avatar sx={{backgroundColor: 'rgba(255, 255, 255, 1)',marginRight:3,width: 70, height: 70,borderRadius: 2,boxShadow:6}}>
                <Iconify icon={"wpf:maintenance"} sx={{width: 40, height: 40,color:"rgb(85, 105, 255);"}}/>
              </Avatar>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Typography variant="h3" component="h3" gutterBottom>
                    บำรุงรักษา
                  </Typography>
                  <Typography variant="subtitle2">
                    เมื่ออุปกรณ์ถึงเวลาบำรุงรักษาและบ่งบอกสถาณะบำรุงรักษาของอุปกรณ์
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
}
export default HomeMaintenance