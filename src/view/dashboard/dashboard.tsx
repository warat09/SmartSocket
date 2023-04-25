import { Helmet } from 'react-helmet-async';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../../services/apiservice";
import { Dashboards, Matching, Assets } from "../../model/model";
import {
  Card,
  CardActionArea,
  CardContent,
  Unstable_Grid2 as Grid,
  Typography,
  Container,
  Paper,
  Divider,
  Box
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import CardDashboard from '../../components/user/dashboard/carddashboard';
import Circle from '../../components/user/dashboard/Circle';
import Graph from '../../components/user/dashboard/graph';
import TableRemainingtime from '../../components/user/dashboard/TableRemainingtime'
import TableMaintenance from '../../components/user/dashboard/TableMaintenance'

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: '60px',
}));


const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [ConDashboard, SetDashboard] = useState<Dashboards[]>([]);
  const [Remainingtime, SetRemainingTime] = useState<Matching[]>([]);
  const [Maintenance, SetMaintenance] = useState<Assets[]>([]);
  const [role,setrole] = useState<string>("")
  const [DepartureRent,SetDepartureRent]:any = useState([])
  const [Chart,SetChart]:any = useState([])
  const ComponentDashboard = async (token: string) => {
    const Alldashboards = await getDashboard("/Dashboard/AllDashboard",token)
    SetDashboard(Alldashboards.countall)
    SetRemainingTime(Alldashboards.remainingtime)
    SetMaintenance(Alldashboards.maintenance)
    SetDepartureRent(Alldashboards.totaldeparturerent)
    SetChart(Alldashboards.totalchart)
  };

  useEffect(() => {
    const item = localStorage.getItem("User");
    if (item && item !== "undefined") {
      const user = JSON.parse(item);
      ComponentDashboard(user.token);
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard | SmartSocket </title>
      </Helmet>
      <Box
       component="main"
       sx={{
         pt:3
       }}
      >
        <Container maxWidth="xl">
        {/* <Typography variant="h4" sx={{ mb: 3,mt:2 }}>
            Dashboard
        </Typography> */}
          {/* <Divider sx={{borderBottomWidth: 3,mb:2,borderColor:"black",borderRadius:1}}/> */}
          <Grid container spacing={3}>
            {ConDashboard.map((row: any, i: any) => (
              <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <CardDashboard 
                difference={12}
                positive
                sx={{ height: '100%' }}
                value={row.amount}
                topic={row.topic}
                icon={row.icon}
                />
          </Grid>
              ))}
          <Grid
            xs={12}
            md={12}
            lg={8}
            >
            <Graph
              chartSeries={Chart}
            />
          </Grid>
          <Grid
            xs={12}
            md={12}
            lg={4}
          >
            <Circle
              chartData={DepartureRent}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={12}
            lg={6}
          >
            <TableRemainingtime
              title={"ใกล้ถึงเวลาบำรุงรักษา"}
              orders={Remainingtime}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={12}
            lg={6}
          >
            <TableMaintenance
              title={"การซ่อมบำรุงรักษาของอุปกรณ์"}
              orders={Maintenance}
              sx={{ height: '100%' }}
            />
          </Grid>
          </Grid>
      </Container>
    </Box>
    </>
    
  );
};
export default HomeDashboard;
