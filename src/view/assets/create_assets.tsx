import React, { useEffect, useState,HTMLInputTypeAttribute } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {Assets} from '../../model/model'
import {getAssets,addAssets,Checktoken} from "../../services/apiservice"

const CreateAssets: React.FC = () => {
  const navigate = useNavigate();
  const [name_assets, SetNameassets] = useState("");
  const [expire_hour, SetExpire_hour] = useState(0);
  const [listassets, SetDataassetslist] = useState<Assets[]>([]);
  const [token, settoken] = useState("");

  const handleGetassets=async(token:string)=>{
    SetDataassetslist(await getAssets(token))
    console.log(await getAssets(token))
  }
  const handleSubmit=async(e: React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    await addAssets(token,name_assets,expire_hour)
  }

  useEffect(() => {
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      Checktoken(user.token).then((status)=>{
        if(status === true){
          handleGetassets(user.token);
          settoken(user.token)
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
      <br/>
      <h1>Assets</h1>
      <hr />
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
            <button onClick={handleSubmit}>ADD</button>
          </div>
        </form>
      </div>
      <hr />
      <div className="assets">

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
                  <TableCell align="right">{row.expire_hour} Hours</TableCell>
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
