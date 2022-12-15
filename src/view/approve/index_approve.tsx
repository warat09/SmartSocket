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
  Button
} from "@mui/material";

const CreateApprove: React.FC = () => {
  const navigate = useNavigate();
  const [listapprove, setlistapprove] = useState<Approve[]>([]);

  const ComponentMatch= async (token:string) => {
    setlistapprove(await getApprove(token))
  }

  const Checkapprove = async (asset:string,username:string,status:number) => {
    console.log(asset,username,status)
    if(status === 1){
      console.log("approve")
    }
    else{
      console.log("reject")
    }

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
            <TableCell>status&nbsp;</TableCell>
            <TableCell align="center">action</TableCell>
            <TableCell align="right">assets</TableCell>
            <TableCell align="right">room&nbsp;</TableCell>
            <TableCell align="right">floor&nbsp;</TableCell>
            <TableCell align="right">description&nbsp;</TableCell>
            <TableCell align="right">Date&nbsp;</TableCell>
            <TableCell align="right">name&nbsp;</TableCell>
            <TableCell align="right">surname&nbsp;</TableCell>
            <TableCell align="right">username&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listapprove.map((row:any) => (
            <TableRow
              key={row.UserMatch_status_user_match}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.UserMatch_status_user_match}
              </TableCell>
              <TableCell align="right">
                <Button variant="contained" size="small"color="success" onClick={()=>Checkapprove(row.Asset_name_assets,row.User_username,1)}>Approve</Button>&nbsp;
                <Button variant="contained" size="small"color="error" onClick={()=>Checkapprove(row.Asset_name_assets,row.User_username,0)}>Reject</Button>
              </TableCell>
              <TableCell align="right">{row.Asset_name_assets}</TableCell>
              <TableCell align="right">{row.UserMatch_room}</TableCell>
              <TableCell align="right">{row.UserMatch_floor}</TableCell>
              <TableCell align="right">{row.UserMatch_description}</TableCell>
              <TableCell align="right">{new Date(row.UserMatch_datetime).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>
              <TableCell align="right">{row.User_name}</TableCell>
              <TableCell align="right">{row.User_surname}</TableCell>
              <TableCell align="right">{row.User_username}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
};
export default CreateApprove;
