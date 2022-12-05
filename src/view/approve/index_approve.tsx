import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Approve } from "../../model/model";
import {getMatchAssets,SelectMatchNode,getMatching,getApprove,Checktoken} from "../../services/apiservice";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

const CreateApprove: React.FC = () => {
  const navigate = useNavigate();
  const [listapprove, setlistapprove] = useState<Approve[]>([]);

  const ComponentMatch= async (token:string) => {
    setlistapprove(await getApprove(token))
  }

  useEffect(() => {
    const item = localStorage.getItem("User");
      if (item && item !== "undefined") {
        const user = JSON.parse(item);
        Checktoken(user.token).then((status)=>{
          if(status === true){
            ComponentMatch(user.token);
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
      <h1>Approve</h1>
      <hr />
      <br></br>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell >assets</TableCell>
            <TableCell align="right">room&nbsp;</TableCell>
            <TableCell align="right">floor&nbsp;</TableCell>
            <TableCell align="right">description&nbsp;</TableCell>
            <TableCell align="right">Date&nbsp;</TableCell>
            <TableCell align="right">name&nbsp;</TableCell>
            <TableCell align="right">surname&nbsp;</TableCell>
            <TableCell align="right">username&nbsp;</TableCell>
            <TableCell align="right">status&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listapprove.map((row:any) => (
            <TableRow
              key={row.Asset_name_assets}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.Asset_name_assets}
              </TableCell>
              <TableCell align="right">{row.UserMatch_room}</TableCell>
              <TableCell align="right">{row.UserMatch_floor}</TableCell>
              <TableCell align="right">{row.UserMatch_description}</TableCell>
              <TableCell align="right">{new Date(row.UserMatch_datetime).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>
              <TableCell align="right">{row.User_name}</TableCell>
              <TableCell align="right">{row.User_surname}</TableCell>
              <TableCell align="right">{row.User_username}</TableCell>
              <TableCell align="right">{row.UserMatch_status_user_match}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
};
export default CreateApprove;
