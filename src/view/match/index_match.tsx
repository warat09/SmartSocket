import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Node, Assets, Matching ,NodeSelection} from "../../model/model";
import serviceapi from "../../services/apiservice";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

const MatchingHome: React.FC = () => {
  const [listnode, setlistnode] = useState<NodeSelection[]>([]);
  const [listassets, setlistassets] = useState<Assets[]>([]);
  const [listmatching, setlistmatching] = useState<Matching[]>([]);
  const [inputassets, setInputassets] = useState<string>("");
  const [inputnode, setInputnode] = useState<string>("");
  const [room, SetRoom] = useState("");
  const [floor, SetFloor] = useState("");

  const handleChangeAssets = (event: SelectChangeEvent) => {
    setInputassets(event.target.value);
  };

  const handleChangeNode = (event: SelectChangeEvent) => {
    setInputnode(event.target.value);
    console.log(inputassets);
  };

  const GetAssets = async () => {
    setlistassets(await serviceapi.getAssets());
    console.log(listassets);
  };
  const Getnode = async (id:any) => {
    setlistnode(await serviceapi.SelectMatchNode(id));
    // console.log(await serviceapi.SelectMatchNode(id))
  };

  useEffect(() => {
    // console.log("test")
    // handleGetnode()
    // handleGetassets()
    GetAssets();
    Getnode(inputassets);
    // setlistnode(await serviceapi.SelectMatchNode(inputassets));
  }, [inputassets]);

  return (
    <div>
      <h1>Matching</h1>
      <h2>{inputassets}</h2>
      <button onClick={GetAssets}>test</button>
      <br></br>
      <br></br>
      <Box sx={{ minWidth: 120 }}>
        <FormControl  fullWidth>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Assets</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={inputassets}
              label="Age"
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
              label="Age"
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  SetFloor(e.target.value);
                }}
              />
            </div>
          </form>
        </FormControl>
        <br />
        <br />
        <button>Matching</button>
      </Box>
    </div>
  );
};
export default MatchingHome;
