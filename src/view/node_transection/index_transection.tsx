import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {Transection} from '../../model/model'
import {getTransection} from "../../services/apiservice"

const CreateTransection: React.FC = () => {
  
  const [listassets, SetDataassetslist] = useState<Transection[]>([]);

  const handleGetTransection=async()=>{
    getTransection().then(res=>{
      SetDataassetslist(res)
    })
  }

  useEffect(() => {
    console.log("node_tran");
    // getTransection().then(res=>{
    //   console.log()
      // SetDataassetslist(res)
      handleGetTransection();

  },[]);

  return (
    <div className="container">
      <h1>Transection</h1>
      <hr />
      <div className="assets">
        <button onClick={handleGetTransection}>Show Transection</button>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Assets</TableCell>
                <TableCell align="right">mac_address</TableCell>
                <TableCell align="right">status_action&nbsp;</TableCell>
                <TableCell align="right">time_used&nbsp;</TableCell>
                <TableCell align="right">time_update&nbsp;</TableCell>
                <TableCell align="right">on_date&nbsp;</TableCell>
                <TableCell align="right">off_date&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listassets.map((row:any,i:any) => (
                <TableRow
                  key={row.Asset_name_assets}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.Asset_name_assets}
                  </TableCell>
                  <TableCell align="right">{row.Match_mac_address}</TableCell>
                  <TableCell align="right">{row.Transection_status_action}</TableCell>
                  <TableCell align="right">{row.Transection_time_used}</TableCell>
                  <TableCell align="right">{new Date(row.Transection_time_update).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>
                  <TableCell align="right">{row.Transection_on_date}</TableCell>
                  <TableCell align="right">{row.Transection_off_date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
export default CreateTransection;
