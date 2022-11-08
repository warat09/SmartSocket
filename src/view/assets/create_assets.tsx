import React, { useEffect, useState,HTMLInputTypeAttribute } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {Assets} from '../../model/model'
import serviceapi from "../../services/apiservice"

const CreateAssets: React.FC = () => {
  const [name_assets, SetNameassets] = useState("");
  const [expire_hour, SetExpire_hour] = useState(0);
  const [date, SetDate] = useState(Date);
  const [listassets, SetDataassetslist] = useState<Assets[]>([]);

  const handleGetassets=async()=>{
    SetDataassetslist(await serviceapi.getAssets())
  }
  const handleSubmit=async()=>{
    await serviceapi.addAssets(name_assets,expire_hour)
  }




  useEffect(() => {
    handleGetassets();
  }, []);


//   const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//     SetNameassets(event.target.value);
//     console.log(event.target.value);
//   }
  return (
    <div className="container">
      <h1>Assets</h1>
      <div className="information">
        <form action="">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name Assets:
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Name Assets"
              onChange={(e)=>{
                SetNameassets(e.target.value)
              }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="timelimit" className="form-label">
              expiration time
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="expiration time"
              onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                SetExpire_hour(e.target.valueAsNumber)
              }}
            />
          </div>
          <div className="button-submit">
            <button onClick={handleSubmit}>ADD Assets</button>
          </div>
        </form>
      </div>
      <hr />
      <div className="assets">
        <button onClick={handleGetassets}>Show assets</button>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Assets</TableCell>
                <TableCell align="right">expired</TableCell>
                <TableCell align="right">Date&nbsp;</TableCell>
                <TableCell align="right">Status&nbsp;</TableCell>
                <TableCell align="right">Maintanent&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listassets.map((row:any,i:any) => (
                <TableRow
                  key={row.name_assets}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name_assets}
                  </TableCell>
                  <TableCell align="right">{new Date(Number(row.expire_hour)).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>
                  <TableCell align="right">
                    {new Date(row.date_assets).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}
                  </TableCell>
                  <TableCell align="right">{row.status_assets}</TableCell>
                  <TableCell align="right">
                    {row.maintenance === false && "ยังไม่ซ่อม"}
                    {row.maintenance === true && "ควรส่งซ่อม"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
export default CreateAssets;
