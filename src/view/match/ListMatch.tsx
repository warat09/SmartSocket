import React, { useEffect, useState, useRef } from "react";
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useNavigate } from "react-router-dom";
import { MatchAsset, Matching, NodeSelection ,Node } from "../../model/model";
import { SelectMatchNode, addMatching, getMatchAssets, getMatching, getNode, updateMatching } from "../../services/apiservice";
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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CardActions,
  Snackbar,
  Alert
} from "@mui/material";
import Scrollbar from "../../components/scrollbar/Scrollbar";
import { UserListHead,UserListToolbar } from '../../components/user';
import { Icon } from '@iconify/react';
import formatTime from '../../components/caltime/millisectohms'
import { Controller, useForm } from "react-hook-form";

const TABLE_HEAD = [
  { id: 'Asset_name_assets', label: 'Assets', alignRight: false },
  { id: 'Match_mac_address', label: 'MacAddress', alignRight: false },
  { id: 'Match_room', label: 'Room', alignRight: false },
  { id: 'Match_floor', label: 'Floor', alignRight: false },
  { id: 'Match_sum_used_time', label: 'RemainTime', alignRight: false },
  { id: 'Match_active_datetime', label: 'Date', alignRight: false },
  { id: 'Match_status_rent', label: 'Status', alignRight: false },
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

  const [listnode, SetlistNode] = useState<Node[]>([]);

  const [listmatching, setlistmatching] = useState<Matching[]>([]);

  const [listnodeselect, setlistnode] = useState<NodeSelection[]>([]);

  const [listassets, setlistassets] = useState<MatchAsset[]>([]);

  const [Token, setToken] = useState("");

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected]:any = useState([]);

  const [orderBy, setOrderBy] = useState('Asset_name_assets');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openNewDialog, setOpenNewDialog] = useState(false);

  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [Matching,setMatching]:any = useState({})

  const [openAlert, setOpenAlert] = useState(false);

  const [messagealert, setMessagealert]:any = useState({message:"",color:""});

  const { control, handleSubmit, watch, reset } = useForm({
    reValidateMode: "onBlur"
  });

  const myHelper:any = {
    asset:{
      required: "Asset is Required"
    },
    node:{
      required: "Please Select Node"
    },
    room:{
      required: "Room is Required"
    },
    floor:{
      required: "Floor is Required"
    }
  };

  const handleOpenMenu = (event:any,Match_id_match:string,Asset_name_assets:string,Match_mac_address:string,Match_room:string,Match_floor:string) => {
    setMatching({
      Match_id_match:Match_id_match,
      Asset_name_assets:Asset_name_assets,
      Match_mac_address:Match_mac_address,
      Match_room:Match_room,
      Match_floor:Match_floor
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listmatching.length) : 0;

  const filteredUsers = applySortFilter(listmatching, getComparator(order, orderBy), filterName);
  
  const isNotFound = !filteredUsers.length && !!filterName;

  const handlemenu = async(menu:number) => {
    setOpen(null)
    if(menu === 1){
      reset({})
      setOpenEditDialog(true)
    }
    else{
      console.log(2)
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

  const ComponentMatch= async (token:string) => {
    setlistmatching(await getMatching("/Match/AllMatching",token));
    setlistassets(await getMatchAssets("/Asset/SelectMatchAsset",token));
    SetlistNode(await getNode("/Node/AllMACAddress"))
  }

  const Getnode = async (id:string) => {
    setlistnode(await SelectMatchNode("/Node/SelectNode",id));
  };

  const handleOnSubmit=async(data:any)=>{
    const {asset,node, room, floor} = data
    await addMatching("/Match/MatchingAssets",Token,asset,node, room, floor)
  }  

  const handleOnEditSubmit=async(data:any)=>{
    const {editasset,editnode,editroom,editfloor} = data;
    await updateMatching(`/Match/AllMatching/${Matching.Match_id_match}`,Token, editasset, editnode, editroom, editfloor);
  }

  useEffect(() => {
    const {open,message} = window.history.state
    const item = localStorage.getItem("User");
      if(open === 1) {
        setMessagealert({message:message,color:"success"})
        setOpenAlert(true);
        window.history.replaceState({}, "", "");
      }
      if (item && item !== "undefined") {
          const user = JSON.parse(item);
          ComponentMatch(user.token);
          setToken(user.token)
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
          <Button variant="contained" startIcon={<Box component={Icon} icon={"eva:plus-fill"}/>} onClick={() => setOpenNewDialog(true)}>
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
                    const { Match_id_match,Asset_name_assets, Match_mac_address, Match_status_rent, Match_sum_used_time, Match_active_datetime, Match_room,Match_floor  }:any = row;
                    const selectedUser = selected.indexOf(Asset_name_assets) !== -1;

                    return (
                      <TableRow hover key={Asset_name_assets} tabIndex={-1} role="checkbox" selected={selectedUser}>

                        <TableCell align="center">{Asset_name_assets}</TableCell>

                        <TableCell align="center">{Match_mac_address}</TableCell>

                        <TableCell align="center">{Match_room}</TableCell>
                        
                        <TableCell align="center">{Match_floor}</TableCell>

                        <TableCell align="center">{formatTime(Match_sum_used_time)}</TableCell>

                        <TableCell align="center">{new Date(Match_active_datetime).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>

                        <TableCell align="center">{Match_status_rent}</TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu(event,Match_id_match,Asset_name_assets,Match_mac_address,Match_room,Match_floor)}>
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
        <MenuItem onClick={()=>handlemenu(1)}>
          <Iconify icon={"eva:edit-fill"} sx={{ mr: 2 }}/>
          Edit
        </MenuItem>

        <MenuItem onClick={()=>handlemenu(0)} sx={{ color: 'error.main' }}>
          <Iconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }}/>
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
                Create a Matching
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
                      <InputLabel id="demo-simple-select-label">Assets</InputLabel>
                        <Select 
                        fullWidth
                        labelId="demo-simple-select-label"
                        label="Assets"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value))
                          // setInputassets(e.target.value);
                          Getnode(e.target.value);
                        }}
                        >
                          <MenuItem
                            value=""
                          >
                            <em>None</em>
                          </MenuItem>
                      {listassets.map((inputassets) => {
                        return (
                          <MenuItem
                            value={inputassets.Assets_id_assets}
                            key={inputassets.Assets_id_assets}
                          >
                            {inputassets.Assets_name_assets}
                          </MenuItem>
                        );
                      })}
                        </Select>
                      <FormHelperText>{error ? myHelper.asset[error.type] : ""}</FormHelperText>
                      </FormControl>
                    )}
                  />

                <Controller
                    control={control}
                    name="node"
                    defaultValue=""
                    rules={{
                      required: true
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl error={error !== undefined} fullWidth>
                      <InputLabel id="demo-simple-select-label">Node</InputLabel>
                        <Select 
                        {...field}
                        fullWidth
                        labelId="demo-simple-select-label"
                        // value={inputnode}
                        label="Node"
                        // onChange={handleChangeNode} 
                        error={error !== undefined}
                        >
                          <MenuItem
                            value=""
                          >
                            <em>None</em>
                          </MenuItem>
                      {listnodeselect.map((inputnode) => {
                        return (
                          <MenuItem
                            value={inputnode.Node_mac_address}
                            key={inputnode.Node_mac_address}
                          >
                            {inputnode.Node_mac_address}
                          </MenuItem>
                        );
                      })}
                        </Select>
                      <FormHelperText>{error ? myHelper.node[error.type] : ""}</FormHelperText>
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
                      label="Room"
                      type="text"
                      // onChange={(e) => {
                      //   SetRoom(e.target.value);
                      // }}
                      error={error !== undefined}
                      helperText={error ? myHelper.room[error.type] : ""}
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
                        label="Floor"
                        // onChange={(e) => {
                        //   SetFloor(e.target.value);
                        // }}
                        error={error !== undefined}
                        helperText={error ? myHelper.floor[error.type] : ""}
                      />
                    )}
                  />
          
              </Stack>
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
                Edit Matching
            </Typography>
          </DialogTitle>
          <DialogContent>
          <Box component="form" onSubmit={handleSubmit(handleOnEditSubmit)}>
            <CardContent sx={{pt:4}}>
              <Box sx={{ m: -1.5 }}>
              <Stack spacing={2} mb={3}>
                        
                <Controller
                    control={control}
                    name="editasset"
                    defaultValue={Matching.Asset_name_assets}
                    rules={{
                      required: true
                    }}
                    render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      type="text"
                      fullWidth
                      label="Asset Name"
                      defaultValue={Matching.Asset_name_assets}
                      InputProps={{
                        readOnly: true,
                      }}
                      error={error !== undefined}
                      helperText={error ? myHelper.asset[error.type] : ""}
                    />
                    )}
                  />

                <Controller
                    control={control}
                    name="editnode"
                    defaultValue={Matching.Match_mac_address}
                    rules={{
                      required: true
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl error={error !== undefined} fullWidth>
                      <InputLabel id="demo-simple-select-label">Node</InputLabel>
                        <Select 
                        {...field}
                        fullWidth
                        labelId="demo-simple-select-label"
                        // value={inputnode}
                        label="Node"
                        defaultValue={Matching.Match_mac_address}
                        error={error !== undefined}
                        >
                          <MenuItem
                            value=""
                          >
                            <em>None</em>
                          </MenuItem>
                      {listnode.map((inputnode) => {
                        return (
                          <MenuItem
                            value={inputnode.mac_address}
                            key={inputnode.mac_address}
                          >
                            {inputnode.mac_address}
                          </MenuItem>
                        );
                      })}
                        </Select>
                      <FormHelperText>{error ? myHelper.node[error.type] : ""}</FormHelperText>
                      </FormControl>
                    )}
                  />

                <Controller
                    control={control}
                    name="editroom"
                    defaultValue={Matching.Match_room}
                    rules={{
                      required: true
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                      {...field}
                      label="Room"
                      type="text"
                      // onChange={(e) => {
                      //   SetRoom(e.target.value);
                      // }}
                      error={error !== undefined}
                      defaultValue={Matching.Match_room}
                      helperText={error ? myHelper.room[error.type] : ""}
                    />
                    )}
                  />

                <Controller
                    control={control}
                    name="editfloor"
                    defaultValue={Matching.Match_floor}
                    rules={{
                      required: true
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        type="text"
                        fullWidth
                        label="Floor"
                        defaultValue={Matching.Match_floor}
                        error={error !== undefined}
                        helperText={error ? myHelper.floor[error.type] : ""}
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
export default HomeMatch;
