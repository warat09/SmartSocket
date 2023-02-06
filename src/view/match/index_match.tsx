import React, { useEffect, useState, useRef } from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { MatchAsset, Matching ,NodeSelection} from "../../model/model";
import {getMatchAssets,SelectMatchNode,getMatching,addMatching,Checktoken} from "../../services/apiservice";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Container,
  Typography,
  Divider,
  TextField,
  Stack,
  Button,
  FormHelperText
} from "@mui/material";
import { Controller,useForm, SubmitHandler } from 'react-hook-form';
const HomeMatch: React.FC = () => {
  const navigate = useNavigate();
  const [listnode, setlistnode] = useState<NodeSelection[]>([]);
  const [listassets, setlistassets] = useState<MatchAsset[]>([]);
  const [listmatching, setlistmatching] = useState<Matching[]>([]);
  const inputLabel = useRef(null);
  const [inputassets, setInputassets] = useState<string>("0");
  const [inputnode, setInputnode] = useState<string>("");
  const [room, SetRoom] = useState("");
  const [floor, SetFloor] = useState("");
  const [token, SetToken] = useState("")
  const { control, handleSubmit } = useForm({
    reValidateMode: "onBlur"
  });
  const myHelper:any = {
    email: {
      required: "Email is Required",
      pattern: "Invalid Email Address"
    },
    asset:{
      required: "Please Select Asset"
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

  const ComponentMatch= async (token:string) => {
    setlistmatching(await getMatching(token));
    // console.log(await getMatchAssets(token))
    setlistassets(await getMatchAssets(token));
  }

  // const handleChangeAssets = (event: SelectChangeEvent) => {
  //   setInputassets(event.target.value);
  //   Getnode(event.target.value);
  // };

  const handleChangeNode = (event: SelectChangeEvent) => {
    setInputnode(event.target.value);
    console.log(inputnode);
  };
  const test = async(data: any) => {
    console.log(data);
  };

  const handleOnSubmit=async(data:any)=>{
    await addMatching(token,data.asset,data.node,data.room,data.floor).then(()=>{
      setlistmatching([ ...listmatching, {
        Asset_name_assets: data.asset,
        Match_mac_address: data.node,
        Match_status_match: "Enable",
        Match_remain_time: 10000,
        Match_room: data.room,
        Match_floor:data.floor,
      }]);
    })
  }
  

  const Getnode = async (id:string) => {
    console.log(typeof(id))
    setlistnode(await SelectMatchNode(id));
  };

  const formatTime = (milliseconds:number) => {

    const totalSeconds = Math.floor(milliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    // const days = Math.floor(totalHours / 24);
  
    const seconds = totalSeconds % 60;
    const minutes = totalMinutes % 60;
    const hours = totalHours % 24;
  
    let time = 'Not use';
    // if (days > 0) {
    //   time = `${days}Day ${hours}Hours ${minutes}Minutes ${seconds} Seconds`;
    // } else 
    if (hours > 0) {
      time = `${totalHours} Hours ${minutes}Minutes ${seconds} Seconds`;
    } else if (minutes > 0) {
      time = `${minutes} Minutes ${seconds} Seconds`;
    } else if (seconds > 0) {
      time = `${seconds} Seconds`;
    }
    return time;
  }

  useEffect(() => {
    const item = localStorage.getItem("User");
      if (item && item !== "undefined") {
        const user = JSON.parse(item);
        Checktoken(user.token).then((response)=>{
          if(response.status === "ok"){  
            if(response.data[0].role === "admin"){
              ComponentMatch(user.token);
              SetToken(user.token)
            }
            else{
              navigate('/')
            }
          }else{
            localStorage.clear()
          }
        })
      }
      else{
        navigate('/login')
      }
  }, []);

  return (
    <>
      <Helmet>
          <title> Matching | SmartSocket </title>
      </Helmet>
      <Container>
        <Typography variant="h4" sx={{ mb: 3,mt:2 }}>
          Matching
        </Typography>
        <Divider sx={{borderBottomWidth: 3,mb:2,borderColor:"black",borderRadius:1}}/>
        <Box sx={{ minWidth: 120 }} component="form" onSubmit={handleSubmit(handleOnSubmit)}>
          <Stack spacing={3} mb={3}>
          {/* <Controller
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
                  type="email"
                  fullWidth
                  label="Email With Validation"
                  error={error !== undefined}
                  helperText={error ? myHelper.email[error.type] : ""}
                />
              )}
            /> */}

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
                  // value={inputassets}
                  // onChange={handleChangeAssets} 
                  // onBlur={onBlur}

                  // const handleChangeAssets = (event: SelectChangeEvent) => {
                    // setInputassets(event.target.value);
                    // Getnode(event.target.value);
                  // };
                  {...field}
                  onChange={(e) => {
                    field.onChange(parseInt(e.target.value))
                    setInputassets(e.target.value);
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
                {listnode.map((inputnode) => {
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
                // <TextField
                //   {...field}
                //   type="text"
                //   fullWidth
                //   label="Room"
                //   // onChange={(e) => {
                //   //   SetRoom(e.target.value);
                //   // }}
                //   error={error !== undefined}
                //   helperText={error ? myHelper.email[error.type] : ""}
                // />
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
                  
          {/* <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Assets</InputLabel>
              <Select
                name="assets"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={inputassets}
                label="Assets"
                onChange={handleChangeAssets}
                // {...makeErrorProps(errorState, "firstName")}
              >
                  <MenuItem
                      value={0}
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
            </FormControl> */}
          {/* <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Node</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={inputnode}
                label="Node"
                onChange={handleChangeNode}
              >
                {listnode.map((inputnode) => {
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
            </FormControl> */}
              {/* <TextField
                  name="room"
                  label="Room"
                  type="text"
                  className="form-control"
                  onChange={(e) => {
                    SetRoom(e.target.value);
                  }}
                /> */}
              {/* <TextField
                  name="floor"
                  label="Floor"
                  type="text"
                  onChange={(e) => {
                    SetFloor(e.target.value);
                  }}
                />  */}
                <Button variant="contained" type="submit">
                      Add Matching
                </Button>
          </Stack>        
        </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell >assets</TableCell>
              <TableCell align="right">mac_address&nbsp;</TableCell>
              <TableCell align="right">room&nbsp;</TableCell>
              <TableCell align="right">floor&nbsp;</TableCell>
              <TableCell align="right">remain_time&nbsp;</TableCell>
              <TableCell align="right">Date&nbsp;</TableCell>
              <TableCell align="right">Status&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listmatching.map((row:any) => (
              <TableRow
                key={row.Asset_name_assets}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.Asset_name_assets}
                </TableCell>
                <TableCell align="right">{row.Match_mac_address}</TableCell>
                <TableCell align="right">{row.Match_room}</TableCell>
                <TableCell align="right">{row.Match_floor}</TableCell>
                <TableCell align="right">{formatTime(row.Match_remain_time)}</TableCell>
                <TableCell align="right">{new Date(row.Match_active_datetime).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>
                <TableCell align="right">{row.Match_status_match}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Container>
    </>
  );
};
export default HomeMatch;
