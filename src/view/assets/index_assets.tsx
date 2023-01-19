import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate } from "react-router-dom";
import {Assets} from '../../model/model'
import {getAssets,addAssets,Checktoken} from "../../services/apiservice"
import {
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Divider
} from "@mui/material";
import rows from "./rowData";

const HomeAsset: React.FC = () => {
  const navigate = useNavigate();
  const [name_assets, SetNameassets] = useState("");
  const [expire_hour, SetExpire_hour] = useState(0);
  const [listassets, SetDataassetslist] = useState<Assets[]>([]);
  const [token, settoken] = useState("");
  const mystyle = {
    overflowX: 'scroll',
    marginRight: "auto",
  marginLeft: "auto",
  marginTop: "50px",
  padding: "10px",
  margin: "10px"
  };

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
      Checktoken(user.token).then((response)=>{
        if(response.status === "ok"){
          if(response.data[0].role === "admin"){
            handleGetassets(user.token);
            settoken(user.token)
          }
          else{
            navigate('/')
          }
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
    <>
      <Helmet>
          <title> Asset | SmartSocket </title>
      </Helmet>
      <Container>
        <Typography variant="h4" sx={{ mb: 3,mt:2 }}>
          Asset
        </Typography>
        <Divider sx={{borderBottomWidth: 3,mb:2,borderColor:"black",borderRadius:1}}/>
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
            {/* <div className="button-submit">
              <button onClick={handleSubmit}>ADD</button>
            </div> */}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                ADD
              </Button>
          </form>
        </div>
        <hr />
        {/* <div className="tablecontainer"> */}
        <Paper className="tablecontainer">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell >Calories</TableCell>
              <TableCell >Fat (g)</TableCell>
              <TableCell >Carbs (g)</TableCell>
              <TableCell >Protein (g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(({ id, name, calories, fat, carbs, protein }) => (
              <TableRow key={id}>
                <TableCell component="th" scope="row">
                  {name}
                </TableCell>
                <TableCell >{calories}</TableCell>
                <TableCell >{fat}</TableCell>
                <TableCell >{carbs}</TableCell>
                <TableCell >{protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      {/* <TableContainer sx={{maxWidth:400,overflowX:'auto'}}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell >Calories</TableCell>
              <TableCell >Fat (g)</TableCell>
              <TableCell >Carbs (g)</TableCell>
              <TableCell >Protein (g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(({ id, name, calories, fat, carbs, protein }) => (
              <TableRow key={id}>
                <TableCell component="th" scope="row">
                  {name}
                </TableCell>
                <TableCell >{calories}</TableCell>
                <TableCell >{fat}</TableCell>
                <TableCell >{carbs}</TableCell>
                <TableCell >{protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer> */}

          {/* <Paper>
            <Table  sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Assets</TableCell>
                  <TableCell align="right">expired</TableCell>
                  <TableCell align="right">Date&nbsp;</TableCell>
                  <TableCell align="right">Status&nbsp;</TableCell>
                  <TableCell align="right">Maintenance&nbsp;</TableCell>
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
          </Paper> */}
        {/* </div> */}
      </Container>
    </>
  );
};
export default HomeAsset;
