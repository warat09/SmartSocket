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
  nameassets?: string;
  timelimit?: number;
  status?: string;
  maintanent?: boolean;
  date?: Date;
  //   children?: React.ReactNode;
}

const CreateAssets: React.FC = () => {
  const [nameassets, SetNameassets] = useState("");
  const [timelimit, SetTimelimit] = useState(0);
  const [date, SetDate] = useState(Date);
  const [listassets, SetDataassetslist] = useState<Assets[]>([]);

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
          SetDataassetslist(data);
          console.log(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addAssets = () => {
    const url = "";
    const attibute_assets = { nameassets, timelimit };
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
                SetTimelimit(e.target.valueAsNumber)
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
              {listassets.map((val) => (
                <TableRow
                  key={val.nameassets}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {val.nameassets}
                  </TableCell>
                  <TableCell align="right">{val.timelimit}</TableCell>
                  <TableCell align="right">
                    {val.date?.toDateString()}
                  </TableCell>
                  <TableCell align="right">{val.status}</TableCell>
                  <TableCell align="right">{val.maintanent}</TableCell>
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
