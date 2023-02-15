import React, { useEffect, useState, useRef } from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { MatchAsset, Matching ,NodeSelection} from "../../model/model";
import {getMatchAssets,SelectMatchNode,getMatching,addMatching,Checktoken} from "../../services/apiservice";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Container,
  Typography,
  Divider,
  TextField,
  Stack,
  Button,
  FormHelperText
} from "@mui/material";
import { Controller,useForm, SubmitHandler } from 'react-hook-form';
import { Icon } from '@iconify/react';
const HomeMatch: React.FC = () => {
  const navigate = useNavigate();
  const [listmatching, setlistmatching] = useState<Matching[]>([]);

  const [token, SetToken] = useState("")

  // const myHelper:any = {
  //   email: {
  //     required: "Email is Required",
  //     pattern: "Invalid Email Address"
  //   },
  //   asset:{
  //     required: "Please Select Asset"
  //   },
  //   node:{
  //     required: "Please Select Node"
  //   },
  //   room:{
  //     required: "Room is Required"
  //   },
  //   floor:{
  //     required: "Floor is Required"
  //   }
  // };

  const ComponentMatch= async (token:string) => {
    setlistmatching(await getMatching(token));
  }

  const formatTime = (milliseconds:number) => {

    const totalSeconds = Math.floor(milliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    // const days = Math.floor(totalHours / 24);
  
    const seconds = totalSeconds % 60;
    const minutes = totalMinutes % 60;
    const hours = totalHours % 24;
  
    let time = 'Not use';
    // if (days > 0) {
    //   time = `${days}Day ${hours}Hours ${minutes}Minutes ${seconds} Seconds`;
    // } else 
    if (hours > 0) {
      time = `${totalHours} Hours ${minutes}Minutes ${seconds} Seconds`;
    } else if (minutes > 0) {
      time = `${minutes} Minutes ${seconds} Seconds`;
    } else if (seconds > 0) {
      time = `${seconds} Seconds`;
    }
    return time;
  }

  useEffect(() => {
    const item = localStorage.getItem("User");
      if (item && item !== "undefined") {
        const user = JSON.parse(item);
        Checktoken(user.token).then((response)=>{
          if(response.status === "ok"){  
            if(response.data[0].role === "admin"){
              ComponentMatch(user.token);
              SetToken(user.token)
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
  }, []);

  return (
    <>
      <Helmet>
          <title> Matching: List | SmartSocket </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5,mt:2 }}>
          <Typography variant="h4" gutterBottom>
            Match List
          </Typography>
          <Button variant="contained" startIcon={<Box component={Icon} icon={"eva:plus-fill"}/>} onClick={() => navigate('/app/match/new')}>
            New Matching
          </Button>
        </Stack>
        <Divider sx={{borderBottomWidth: 3,mb:2,borderColor:"black",borderRadius:1}}/>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell >assets</TableCell>
              <TableCell align="right">mac_address&nbsp;</TableCell>
              <TableCell align="right">room&nbsp;</TableCell>
              <TableCell align="right">floor&nbsp;</TableCell>
              <TableCell align="right">remain_time&nbsp;</TableCell>
              <TableCell align="right">Date&nbsp;</TableCell>
              <TableCell align="right">Status&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listmatching.map((row:any) => (
              <TableRow
                key={row.Asset_name_assets}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.Asset_name_assets}
                </TableCell>
                <TableCell align="right">{row.Match_mac_address}</TableCell>
                <TableCell align="right">{row.Match_room}</TableCell>
                <TableCell align="right">{row.Match_floor}</TableCell>
                <TableCell align="right">{formatTime(row.Match_remain_time)}</TableCell>
                <TableCell align="right">{new Date(row.Match_active_datetime).toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' })}</TableCell>
                <TableCell align="right">{row.Match_status_match}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Container>
    </>
  );
};
export default HomeMatch;
