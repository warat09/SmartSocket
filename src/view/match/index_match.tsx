import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Node, Assets, Matching ,NodeSelection} from "../../model/model";
import {getAssets,SelectMatchNode,getMatching,addMatching,Checktoken} from "../../services/apiservice";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

const CreateMatch: React.FC = () => {
  const navigate = useNavigate();
  const [listnode, setlistnode] = useState<NodeSelection[]>([]);
  const [listassets, setlistassets] = useState<Assets[]>([]);
  const [listmatching, setlistmatching] = useState<Matching[]>([]);

  const [inputassets, setInputassets] = useState<string>("");
  const [inputnode, setInputnode] = useState<string>("");
  const [room, SetRoom] = useState("");
  const [floor, SetFloor] = useState("");
  const [token, SetToken] = useState("")

  const ComponentMatch= async (token:string) => {
    setlistmatching(await getMatching(token));
    setlistassets(await getAssets(token));
  }

  const handleChangeAssets = (event: SelectChangeEvent) => {
    setInputassets(event.target.value);
    Getnode(event.target.value);
  };

  const handleChangeNode = (event: SelectChangeEvent) => {
    setInputnode(event.target.value);
    console.log(inputnode);
  };

  const handleSubmit=async()=>{
    await addMatching(token,inputassets,inputnode,room,floor)
  }

  const Getnode = async (id:any) => {
    setlistnode(await SelectMatchNode(id));
  };

  useEffect(() => {
    const item = localStorage.getItem("User");
      if (item && item !== "undefined") {
        const user = JSON.parse(item);
        Checktoken(user.token).then((status)=>{
          if(status === true){
            ComponentMatch(user.token);
            SetToken(user.token)
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
      <h1>Matching</h1>
      <hr />
      <br></br>
      <Box sx={{ minWidth: 120 }}>
        <FormControl  fullWidth>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Assets</InputLabel>
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
                    value={inputassets.id_assets}
                    key={inputassets.id_assets}
                  >
                    {inputassets.name_assets}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <br></br>
          <br></br>
          <FormControl fullWidth>
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
          </form>
        </FormControl>
        <br />
        <br />
        <button onClick={handleSubmit}>Matching</button>
        <br />
      </Box>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell >assets</TableCell>
            <TableCell align="right">mac_address&nbsp;</TableCell>
            <TableCell align="right">room&nbsp;</TableCell>
            <TableCell align="right">floor&nbsp;</TableCell>
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
              <TableCell align="right">{new Date(row.Match_active_datetime).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>
              <TableCell align="right">{row.Match_status_match}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
};
export default CreateMatch;
