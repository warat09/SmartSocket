import React, { useEffect, useState } from "react";
import {Node} from '../../model/model'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import serviceapi from '../../services/apiservice'


const HomeNode: React.FC = () => {
  const [listnode, SetlistNode] = useState<Node[]>([]);

  const handleGetNode= async() => {
    SetlistNode(await serviceapi.getNode())
  }
  // useEffect(() => {
  //   handleGetNode();
  // }, []);

  return (
    <div>
      <button onClick={handleGetNode}>Show Node</button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>M.A.C Addreess</TableCell>
              <TableCell align="right">i.p.&nbsp;</TableCell>
              <TableCell align="right">Date&nbsp;</TableCell>
              <TableCell align="right">status_node&nbsp;</TableCell>
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
                <TableCell align="right">{val.date_node?.toDateString()}</TableCell>
                <TableCell align="right">{val.status_node}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default HomeNode

