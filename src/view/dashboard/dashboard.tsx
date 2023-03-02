import { Helmet } from 'react-helmet-async';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../../services/apiservice";
import { Dashboards } from "../../model/model";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  Container,
  Paper,
  Divider,
  Box
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import CardDashboard from '../../components/user/carddashboard';

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
  const [role,setrole] = useState<string>("")
  const ComponentDashboard = async (token: string) => {
    SetDashboard(await getDashboard("/Dashboard/AllDashboard",token));
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
     
            {/* {ConDashboard.map((row: any, i: any) => (
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
                />
          </Grid>
              ))} */}
          {ConDashboard.map((row: any, i: any) => (
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
              ))}
          </Grid>
      </Container>
    </Box>
    </>
    
  );
};
export default HomeDashboard;
