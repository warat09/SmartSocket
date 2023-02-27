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
  Divider
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
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
      <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3,mt:2 }}>
          Dashboard
      </Typography>
        <Divider sx={{borderBottomWidth: 3,mb:2,borderColor:"black",borderRadius:1}}/>
        <Grid container spacing={2}>
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
    </>
    
  );
};
export default HomeDashboard;
