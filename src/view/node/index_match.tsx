import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface Node {
  MAC_address?: string;
  ip?: string;
  date?: Date;
  status?: string;
}

const HomeNode: React.FC = () => {
  const [listnode, SetlistNode] = useState<Node[]>([]);

  const getAssets = () => {
    const url = "";
    axios
      .get(url)
      .then((response) => {
        const results = response.data;
        const { status, data } = results;
        if (status !== "SUCCESS") {
          alert(status);
        } else {
          SetlistNode(data);
          console.log(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Assets</TableCell>
              <TableCell align="right">expired</TableCell>
              <TableCell align="right">Date&nbsp;(g)</TableCell>
              <TableCell align="right">Status&nbsp;(g)</TableCell>
              <TableCell align="right">Maintanent&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listnode.map((val) => (
              <TableRow
                key={val.MAC_address}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {val.MAC_address}
                </TableCell>
                <TableCell align="right">{val.ip}</TableCell>
                <TableCell align="right">{val.date?.toDateString()}</TableCell>
                <TableCell align="right">{val.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default HomeNode

