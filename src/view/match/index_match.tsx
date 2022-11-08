import React, { useEffect, useState, HTMLInputTypeAttribute } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Node, Assets, Matching } from "../../model/model";
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
  const [listnode, setlistnode] = useState<Node[]>([]);
  const [listassets, setlistassets] = useState<Assets[]>([]);
  const [listmatching, setlistmatching] = useState<Matching[]>([]);
  const [inputassets, setInputassets] = useState<string>("");
  const [inputnode, setInputnode] = useState<string>("");

  const Getnode = async () => {
    setlistnode(await serviceapi.getNode());
  };
  const handleChangeAssets = (event: SelectChangeEvent) => {
    setInputassets(event.target.value);
    console.log(inputassets);
  };

  const handleChangeNode = (event: SelectChangeEvent) => {
    setInputnode(event.target.value);
    console.log(inputassets);
  };

  const GetAssets = async () => {
    setlistassets(await serviceapi.getAssets());
    console.log(listassets);
  };

  useEffect(() => {
    // console.log("test")
    // handleGetnode()
    // handleGetassets()
    GetAssets();
  }, []);

  return (
    <div>
      <h1>Matching</h1>
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
                    value={inputassets.name_assets}
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
                    value={inputnode.MAC_address}
                    key={inputnode.MAC_address}
                  >
                    {inputnode.MAC_address}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </FormControl>
        <br />
        <br />
        <button>Matching</button>
      </Box>
    </div>
  );
};
export default MatchingHome;
