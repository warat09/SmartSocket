import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate } from "react-router-dom";
import {Node} from '../../model/model'
import {Table,TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  Divider
} from "@mui/material"
import {getNode,Checktoken} from '../../services/apiservice'

const HomeNode: React.FC = () => {
  const navigate = useNavigate();
  const [listnode, SetlistNode] = useState<Node[]>([]);

  const handleGetNode= async() => {
    SetlistNode(await getNode())
  }
  useEffect(() => {
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      handleGetNode();
    }
    else{
      navigate('/login')
    }
  }, []);

  return (
    <>
      <Helmet>
            <title> Node | SmartSocket </title>
      </Helmet>
      <Container>
        <Typography variant="h4" sx={{ mb: 3,mt:2 }}>
          NodeMCU
        </Typography>
        <Divider sx={{borderBottomWidth: 3,mb:2,borderColor:"black",borderRadius:1}}/>
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
              {listnode.map((val:any) => (
                <TableRow
                  key={val.mac_address}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {val.mac_address}
                  </TableCell>
                  <TableCell align="right">{val.ip}</TableCell>
                  <TableCell align="right">{new Date(val.date_node).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>
                  <TableCell align="right">{val.status_node}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};
export default HomeNode

