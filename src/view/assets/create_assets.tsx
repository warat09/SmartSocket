import React, { useEffect, useState,HTMLInputTypeAttribute } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export interface Assets {
  name_assets?: string;
  expire_hour?: number;
  status_assets?: string;
  maintenance?: boolean;
  date_assets?: Date;
  //   children?: React.ReactNode;
}

const CreateAssets: React.FC = () => {
  const [name_assets, SetNameassets] = useState("");
  const [expire_hour, SetExpire_hour] = useState(0);
  const [date, SetDate] = useState(Date);
  const [listassets, SetDataassetslist] = useState<Assets[]>([]);

  const getAssets = () => {
    const url = "http://localhost:9090/Asset/AllAsset";
    axios
      .get(url)
      .then((response) => {
        const results = response.data;
        const { status, data } = results;
        if (response.status !== 200) {
          alert(status);
        } else {
          SetDataassetslist(response.data);
          console.log(new Date(response.data[0].date_assets).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' }))
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addAssets = () => {
    const url = "http://localhost:9090/Asset/AddAsset";
    const attibute_assets = { name_assets, expire_hour };
    axios
      .post(url, attibute_assets)
      .then((response) => {
        const results = response.data;
        const { status, data } = results;
        if (status !== "SUCCESS") {
          alert(status);
        } else {
          console.log(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAssets();
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
            <button onClick={addAssets}>ADD Assets</button>
          </div>
        </form>
      </div>
      <hr />
      <div className="assets">
        <button onClick={getAssets}>Show assets</button>

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
