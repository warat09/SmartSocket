import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {Transaction} from '../../model/model'
import {getTransection,Checktoken} from "../../services/apiservice"

const CreateTransection: React.FC = () => {
  const navigate = useNavigate();
  const [listassets, SetDataassetslist] = useState<Transaction[]>([]);

//   function formatTime(timeMS:any) {
//     const [MS_IN_SEC, SEC_IN_DAY, SEC_IN_HOUR, SEC_IN_MIN] = [1000, 86400, 3600, 60];
//     let seconds = Math.round(Math.abs(timeMS) / MS_IN_SEC);
//     const days = Math.floor(seconds / SEC_IN_DAY);
//     seconds = Math.floor(seconds % SEC_IN_DAY);
//     const hours = Math.floor(seconds / SEC_IN_HOUR);
//     seconds = Math.floor(seconds % SEC_IN_HOUR);
//     const minutes = Math.floor(seconds / SEC_IN_MIN);
//     seconds = Math.floor(seconds % SEC_IN_MIN);
//     const [dd, hh, mm, ss] = [days, hours, minutes, seconds]
//         .map(item => item < 10 ? '0' + item : item.toString());
//     return dd + ':' + hh + ':' + mm + ':' + ss;
// }

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
    time = `${totalHours}Hours ${minutes}Minutes ${seconds} Seconds`;
  } else if (minutes > 0) {
    time = `${minutes}Minutes ${seconds} Seconds`;
  } else if (seconds > 0) {
    time = `${seconds} Seconds`;
  }
  return time;
}

  const handleGetTransection=async()=>{
    SetDataassetslist(await getTransection());
  }

  useEffect(() => {
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      Checktoken(user.token).then((status)=>{
        if(status === true){
          handleGetTransection();
        }else{
          localStorage.clear()
        }
      })
    }
    else{
      navigate('/login')
    }
  },[]);

  return (
    <div className="container">
      <h1>Transaction</h1>
      <hr />
      <div className="assets">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Assets</TableCell>
                <TableCell align="right">mac_address</TableCell>
                <TableCell align="right">status_transaction&nbsp;</TableCell>
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
                  <TableCell align="right">{row.Transaction_status_transaction}</TableCell>
                  <TableCell align="right">{formatTime(row.Transaction_time_used)}</TableCell>
                  <TableCell align="right">{new Date(row.Transaction_time_update).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>
                  <TableCell align="right">{row.Transaction_on_date}</TableCell>
                  <TableCell align="right">{row.Transaction_off_date}</TableCell>
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
