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
const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });

const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [ConDashboard, SetDashboard] = useState<Dashboards[]>([]);
  const [Remainingtime, SetRemainingTime] = useState<Matching[]>([]);
  const [Maintenance, SetMaintenance] = useState<Assets[]>([]);
  const [role,setrole] = useState<string>("")
  const ComponentDashboard = async (token: string) => {
    const Alldashboards = await getDashboard("/Dashboard/AllDashboard",token)
    SetDashboard(Alldashboards.countall)
    SetRemainingTime(Alldashboards.remainingtime)
    SetMaintenance(Alldashboards.maintenance)
    console.log(Alldashboards)
    // SetDashboard(await getDashboard("/Dashboard/AllDashboard",token));
    // console.log(ConDashboard)
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
         flexGrow: 1,
         py: 8,
         pl:3
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
            lg={8}
            >
            <Graph
              chartSeries={[
                {
                  name: 'This year',
                  data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20]
                },
                {
                  name: 'Last year',
                  data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13]
                }
              ]}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <Circle
              chartSeries={[63, 15, 22]}
              labels={['Desktop', 'Tablet', 'Phone']}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={12}
            lg={6}
          >
            <TableRemainingtime
              title={"Remaining time"}
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
              title={"Maintenance"}
              orders={Maintenance}
              sx={{ height: '100%' }}
            />
          </Grid>
          {/* {ConDashboard.map((row: any, i: any) => (
              <Grid item xs={4}>
                <Card>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {row.topic}
                      </Typography>
                      <Typography variant="h4" color="text.secondary">
                        {row.amount}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              ))} */}
          </Grid>
      </Container>
    </Box>
    </>
    
  );
};
export default HomeDashboard;
