import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {MatchRentSelection, UserMatch} from "../../model/model";
import {getRentMatch,getRequestRent,addUserMatching,Checktoken} from "../../services/apiservice";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

const CreateUserMatch: React.FC = () => {
  const navigate = useNavigate();
  const [listassets, setlistassets] = useState<MatchRentSelection[]>([]);
  const [listmatching, setlistmatching] = useState<UserMatch[]>([]);

  const [inputassets, setInputassets] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [room, SetRoom] = useState("");
  const [floor, SetFloor] = useState("");
  const [description, Setdescription] = useState("");

  const ComponentUserMatch= async (token:string) => {
    setlistmatching(await getRequestRent(token));
    setlistassets(await getRentMatch(token));
  }

  const handleChangeAssets = (event: SelectChangeEvent) => {
    setInputassets(event.target.value);
  };

  const handleSubmit=async()=>{
    await addUserMatching(token,inputassets,room,floor,description)
  }

  const formatTime = (milliseconds:number) => {

    const totalSeconds = Math.floor(milliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    // const days = Math.floor(totalHours / 24);
  
    const seconds = totalSeconds % 60;
    const minutes = totalMinutes % 60;
    const hours = totalHours % 24;
  
    let time = '1s';
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
        Checktoken(user.token).then((status)=>{
          if(status === true){
            ComponentUserMatch(user.token);
            setToken(user.token);
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
    <div className="container">
      <br/>
      <h1>UserMatch</h1>
      <hr />
      <br></br>
      <Box sx={{ minWidth: 120 }}>
        <FormControl  fullWidth>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Rent</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={inputassets}
              label="Assets"
              onChange={handleChangeAssets}
            >
              {listassets.map((inputassets) => {
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
          </FormControl>
          <form action="">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Room:
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Room"
                onChange={(e) => {
                  SetRoom(e.target.value);
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="timelimit" className="form-label">
                Floor:
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Floor"
                onChange={(e) => {
                  SetFloor(e.target.value);
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="timelimit" className="form-label">
              Description:
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                onChange={(e) => {
                  Setdescription(e.target.value);
                }}
              />
            </div>
          </form>
        </FormControl>
        <br />
        <button onClick={handleSubmit}>ADD</button>
        <br />
        <br />
      </Box>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell >assets</TableCell>
            <TableCell align="right">room&nbsp;</TableCell>
            <TableCell align="right">floor&nbsp;</TableCell>
            <TableCell align="right">description&nbsp;</TableCell>
            <TableCell align="right">sumuse&nbsp;</TableCell>
            <TableCell align="right">datetime&nbsp;</TableCell>
            <TableCell align="right">status&nbsp;</TableCell>
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
              <TableCell align="right">{row.UserMatch_room}</TableCell>
              <TableCell align="right">{row.UserMatch_floor}</TableCell>
              <TableCell align="right">{row.UserMatch_description }</TableCell>
              <TableCell align="right">
                {row.UserMatch_sum_used_time == 0 && "Not use"}
                {row.UserMatch_sum_used_time > 0 && formatTime(row.UserMatch_sum_used_time)}
              </TableCell>
              <TableCell align="right">{new Date(row.UserMatch_datetime).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>
              <TableCell align="right">{row.UserMatch_status_user_match}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
};
export default CreateUserMatch;
